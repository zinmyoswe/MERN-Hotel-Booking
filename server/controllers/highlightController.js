import Highlight from "../models/Highlight.js";
import Hotel from "../models/Hotel.js";

export const addHighlight = async (req, res) => {
    try {
        const { name, highlighticonurl, isGreenIcon, isLocationType, isCustomizable, customValue, hotelId } = req.body;
        const owner = req.auth.userId;

        // Check if hotel exists and belongs to the user
        const hotel = await Hotel.findOne({ _id: hotelId, owner });
        if (!hotel) {
            return res.json({ success: false, message: 'Hotel not found or not authorized' });
        }

        // Check if highlight already exists for this hotel
        const existingHighlight = await Highlight.findOne({ name, hotel: hotelId });
        if (existingHighlight) {
            return res.json({ success: false, message: 'Highlight already exists for this hotel' });
        }

        const highlight = await Highlight.create({
            name,
            highlighticonurl,
            isGreenIcon: isGreenIcon || false,
            isLocationType: isLocationType || false,
            isCustomizable: isCustomizable || false,
            customValue: customValue || '',
            hotel: hotelId,
        });

        res.json({ success: true, message: "Highlight added successfully", highlight });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getHighlightsByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const highlights = await Highlight.find({ hotel: hotelId }).sort({ createdAt: -1 });
        res.json({ success: true, highlights });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const removeHighlight = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = req.auth.userId;

        // Find the highlight and check if the hotel belongs to the user
        const highlight = await Highlight.findById(id).populate('hotel');
        if (!highlight) {
            return res.json({ success: false, message: 'Highlight not found' });
        }

        if (highlight.hotel.owner.toString() !== owner) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        await Highlight.findByIdAndDelete(id);

        res.json({ success: true, message: 'Highlight removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAvailableHighlights = async (req, res) => {
    try {
        // Return predefined highlights that can be selected
        const availableHighlights = [
            {
                name: "[X] meters to public transportation",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/bus.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: true
            },
            {
                name: "Rated highly by Solo travelers",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/baggage-pay.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Great for activities",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/like.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Top Value",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/medal.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Hygiene Plus",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/SafetyFeatures.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Great Breakfast",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/croissant.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Sparkling clean",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/spray.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Front desk [24-hour]",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/door.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Free Wi-Fi in all rooms!",
                highlighticonurl: "https://cdn6.agoda.net/cdn-design-system/icons/788cf6fe.svg",
                isGreenIcon: true,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Blackout curtains",
                highlighticonurl: "https://cdn6.agoda.net/cdn-design-system/icons/34b21e05.svg",
                isGreenIcon: true,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Located in heart of [City]",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/location.svg",
                isGreenIcon: false,
                isLocationType: true,
                isCustomizable: false
            },
            {
                name: "Airport transfer",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/transfer.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Great Swimming pool",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/swimming-pool.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Great View",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/forest.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },
            {
                name: "Great food & dining",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/forkSpoon.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            },

            {
                name: "Excellent Room Comfort & quality",
                highlighticonurl: "https://cdn6.agoda.net/images/property/highlights/bedKing.svg",
                isGreenIcon: false,
                isLocationType: false,
                isCustomizable: false
            }
        ];

        res.json({ success: true, highlights: availableHighlights });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};