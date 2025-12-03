import Hotel from "../models/Hotel.js";

//API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const {  roomType, pricePerNight, amenities, images, isAvailable, RoomView, Adults, Bed, SquareFeet } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found." });
        }
    } catch (error) {
        
    }
};

//API to get all rooms
export const getRooms = async (req, res) => {

};

//API to get all rooms for a specific hotel
export const getRoomsByHotel = async (req, res) => {

};