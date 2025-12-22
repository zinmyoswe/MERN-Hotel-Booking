import Facility from "../models/Facility.js";
import Hotel from "../models/Hotel.js";

export const addFacility = async (req, res) => {
    try {
        const { name, hotelId } = req.body;
        const owner = req.auth.userId;

        // Check if hotel exists and belongs to the user
        const hotel = await Hotel.findOne({ _id: hotelId, owner });
        if (!hotel) {
            return res.json({ success: false, message: 'Hotel not found or not authorized' });
        }

        // Check if facility already exists for this hotel
        const existingFacility = await Facility.findOne({ name, hotel: hotelId });
        if (existingFacility) {
            return res.json({ success: false, message: 'Facility already exists for this hotel' });
        }

        const facility = await Facility.create({
            name,
            hotel: hotelId,
        });

        res.json({ success: true, message: "Facility added successfully", facility });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getFacilitiesByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const facilities = await Facility.find({ hotel: hotelId }).sort({ createdAt: -1 });
        res.json({ success: true, facilities });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const removeFacility = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = req.auth.userId;

        // Find the facility and check if the hotel belongs to the user
        const facility = await Facility.findById(id).populate('hotel');
        if (!facility) {
            return res.json({ success: false, message: 'Facility not found' });
        }

        if (facility.hotel.owner.toString() !== owner) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        await Facility.findByIdAndDelete(id);

        res.json({ success: true, message: 'Facility removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAvailableFacilities = async (req, res) => {
    try {
        // Return predefined facilities that can be selected
        const availableFacilities = [
            "Free Wi-Fi",
            "Swimming pool",
            "Car park",
            "Spa",
            "Front desk [24-hour]",
            "Fitness center",
            "Restaurants",
            "Bar",
            "Room service",
            "Laundry service",
            "Airport transfer",
            "Business center",
            "Concierge",
            "Elevator",
            "Luggage storage",
            "24-hour security",
            "Daily housekeeping",
            "Currency exchange",
            "ATM on site",
            "Shuttle service"
        ];

        res.json({ success: true, facilities: availableFacilities });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};