import e from "express";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from 'cloudinary';
import { populate } from "dotenv";

//API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { hotel: hotelId, roomType, pricePerNight, quantity, amenities, isAvailable, RoomView, Adults, Bed, SquareFeet, discountType, discountPercentage, originalPrice } = req.body;

        // Verify that the hotel exists and belongs to the authenticated user
        const hotel = await Hotel.findOne({ _id: hotelId, owner: req.auth.userId });

        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found or access denied." });
        }

        //upload images to cloudinary
        const uploadedImages = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
        });

        const images = await Promise.all(uploadedImages)

        await Room.create({
            hotel: hotelId,
            roomType,
            pricePerNight: +pricePerNight,
            quantity: quantity ? +quantity : 1,
            amenities: JSON.parse(amenities),
            images,
            isAvailable,
            RoomView,
            Adults,
            Bed,
            SquareFeet,
            discountType,
            discountPercentage: discountPercentage ? +discountPercentage : null,
            originalPrice: originalPrice ? +originalPrice : null
        });
        res.json({ success: true, message: "Room created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//API to get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        // Get all hotels owned by the user
        const hotels = await Hotel.find({ owner: req.auth.userId });
        const hotelIds = hotels.map(hotel => hotel._id.toString());

        // Find rooms for all hotels owned by the user
        const rooms = await Room.find({ hotel: { $in: hotelIds } }).populate('hotel').sort({ createdAt: -1 });
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room availability Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//API to get a single room by ID
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        });
        if (!room) {
            return res.json({ success: false, message: "Room not found." });
        }
        res.json({ success: true, room });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//API to get total available rooms count for a hotel
export const getHotelAvailableRoomsCount = async (req, res) => {
    try {
        const { hotelId } = req.params;
        
        const rooms = await Room.find({ hotel: hotelId, isAvailable: true });
        const totalAvailable = rooms.reduce((sum, room) => sum + (room.quantity || 1), 0);
        
        res.json({ success: true, availableRoomsCount: totalAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//API to update a room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { hotel: hotelId, roomType, pricePerNight, quantity, amenities, isAvailable, RoomView, Adults, Bed, SquareFeet, discountType, discountPercentage, originalPrice } = req.body;

        // Find the room and verify ownership
        const room = await Room.findById(id).populate('hotel');
        if (!room) {
            return res.json({ success: false, message: "Room not found." });
        }

        // Verify that the hotel belongs to the authenticated user
        const hotel = await Hotel.findOne({ _id: room.hotel._id, owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: "Access denied." });
        }

        // Handle image updates if new images are provided
        let updatedImages = room.images;
        if (req.files && req.files.length > 0) {
            // Upload new images to cloudinary
            const uploadedImages = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url;
            });
            updatedImages = await Promise.all(uploadedImages);
        }

        // Update the room
        const updatedRoom = await Room.findByIdAndUpdate(id, {
            hotel: hotelId || room.hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            quantity: quantity ? +quantity : room.quantity,
            amenities: JSON.parse(amenities),
            images: updatedImages,
            isAvailable,
            RoomView,
            Adults,
            Bed,
            SquareFeet,
            discountType,
            discountPercentage: discountPercentage ? +discountPercentage : null,
            originalPrice: originalPrice ? +originalPrice : null
        }, { new: true });

        res.json({ success: true, message: "Room updated successfully", room: updatedRoom });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};;