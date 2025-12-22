import Staycation from "../models/Staycation.js";
import Hotel from "../models/Hotel.js";

export const addStaycation = async (req, res) => {
    try {
        const { name, staycationtype, hotelId } = req.body;
        const owner = req.auth.userId;

        // Check if hotel exists and belongs to the user
        const hotel = await Hotel.findOne({ _id: hotelId, owner });
        if (!hotel) {
            return res.json({ success: false, message: 'Hotel not found or not authorized' });
        }

        // Check if staycation already exists for this hotel
        const existingStaycation = await Staycation.findOne({ name, hotel: hotelId });
        if (existingStaycation) {
            return res.json({ success: false, message: 'Staycation activity already exists for this hotel' });
        }

        const staycation = await Staycation.create({
            name,
            staycationtype,
            hotel: hotelId,
        });

        res.json({ success: true, message: "Staycation activity added successfully", staycation });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getStaycationsByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const staycations = await Staycation.find({ hotel: hotelId }).sort({ staycationtype: 1, createdAt: -1 });
        res.json({ success: true, staycations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const removeStaycation = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = req.auth.userId;

        // Find the staycation and check if the hotel belongs to the user
        const staycation = await Staycation.findById(id).populate('hotel');
        if (!staycation) {
            return res.json({ success: false, message: 'Staycation activity not found' });
        }

        if (staycation.hotel.owner.toString() !== owner) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        await Staycation.findByIdAndDelete(id);

        res.json({ success: true, message: 'Staycation activity removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAvailableStaycations = async (req, res) => {
    try {
        // Return predefined staycation activities organized by type
        const availableStaycations = {
            "Food and Drinks": {
                icon: "https://cdn6.agoda.net/images/staycation/default/DrinkingAndDining.svg",
                activities: [
                    "Room service [24-hour]",
                    "Coffee shop",
                    "Room service",
                    "Bar",
                    "Poolside bar",
                    "Restaurants"
                ]
            },
            "Wellness": {
                icon: "https://cdn6.agoda.net/images/staycation/default/wellness.svg",
                activities: [
                    "Fitness center",
                    "Spa",
                    "Steamroom",
                    "Massage"
                ]
            },
            "Activities": {
                icon: "https://cdn6.agoda.net/images/staycation/default/activities.svg",
                activities: [
                    "Swimming Pool",
                    "Kids club"
                ]
            }
        };

        res.json({ success: true, staycations: availableStaycations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};