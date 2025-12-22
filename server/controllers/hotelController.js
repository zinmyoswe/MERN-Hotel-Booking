import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from 'cloudinary';


export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city, state, country, zipcode, description, videoUrl, mapUrl } = req.body;
        const owner = req.auth.userId;

        //check if user already registered
        const hotel = await Hotel.findOne({owner});
        if(hotel){
            return res.json({success: false, message: "Hotel already registered"});
        }

        //upload images to cloudinary
        const mainImage = await cloudinary.uploader.upload(req.files.hotelMainImage[0].path);
        
        const subImages = await Promise.all(req.files.hotelSubImages.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
        }));

        await Hotel.create({
            name,
            address,
            contact,
            city,
            state,
            country,
            zipcode,
            description,
            owner,
            hotelMainImage: mainImage.secure_url,
            hotelSubImages: subImages,
            videoUrl,
            mapUrl,
        });
        await User.findByIdAndUpdate(owner, {role: "hotelOwner"});
        res.json({success: true, message: "Hotel registered successfully"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().populate({
            path: 'owner',
            select: 'image'
        }).sort({ createdAt: -1 });
        res.json({ success: true, hotels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate({
            path: 'owner',
            select: 'image name'
        });
        if (!hotel) {
            return res.json({ success: false, message: 'Hotel not found' });
        }
        res.json({ success: true, hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getRoomsByHotel = async (req, res) => {
    try {
        const rooms = await Room.find({ hotel: req.params.id });
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}