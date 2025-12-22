import NearbyPlaces from "../models/NearbyPlaces.js";
import Hotel from "../models/Hotel.js";

export const addNearbyPlace = async (req, res) => {
    try {
        const { name, distance, icon, type, hotelId } = req.body;
        const owner = req.auth.userId;

        // Check if hotel exists and belongs to the user
        const hotel = await Hotel.findOne({ _id: hotelId, owner });
        if (!hotel) {
            return res.json({ success: false, message: 'Hotel not found or not authorized' });
        }

        const nearbyPlace = await NearbyPlaces.create({
            name,
            distance,
            icon,
            type,
            hotel: hotelId,
        });

        res.json({ success: true, message: "Nearby place added successfully", nearbyPlace });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getNearbyPlacesByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const nearbyPlaces = await NearbyPlaces.find({ hotel: hotelId }).sort({ createdAt: -1 });
        res.json({ success: true, nearbyPlaces });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateNearbyPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, distance, icon, type } = req.body;
        const owner = req.auth.userId;

        // Find the nearby place and check if the hotel belongs to the user
        const nearbyPlace = await NearbyPlaces.findById(id).populate('hotel');
        if (!nearbyPlace) {
            return res.json({ success: false, message: 'Nearby place not found' });
        }

        if (nearbyPlace.hotel.owner.toString() !== owner) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        const updatedNearbyPlace = await NearbyPlaces.findByIdAndUpdate(
            id,
            { name, distance, icon, type },
            { new: true }
        );

        res.json({ success: true, message: 'Nearby place updated successfully', nearbyPlace: updatedNearbyPlace });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteNearbyPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = req.auth.userId;

        // Find the nearby place and check if the hotel belongs to the user
        const nearbyPlace = await NearbyPlaces.findById(id).populate('hotel');
        if (!nearbyPlace) {
            return res.json({ success: false, message: 'Nearby place not found' });
        }

        if (nearbyPlace.hotel.owner.toString() !== owner) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        await NearbyPlaces.findByIdAndDelete(id);

        res.json({ success: true, message: 'Nearby place deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};