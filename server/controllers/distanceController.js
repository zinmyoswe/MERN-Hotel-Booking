import Distance from '../models/Distance.js';

// Get distance for a hotel
export const getDistance = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const distance = await Distance.findOne({ hotel: hotelId });

    if (!distance) {
      return res.json({ success: true, distance: null });
    }

    res.json({ success: true, distance });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create or update distance for a hotel
export const createOrUpdateDistance = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { mainDistance, subDistances } = req.body;

    // Validate required fields
    if (!mainDistance) {
      return res.json({ success: false, message: 'Main distance is required' });
    }

    // Find existing distance or create new one
    let distance = await Distance.findOne({ hotel: hotelId });

    if (distance) {
      // Update existing
      distance.mainDistance = mainDistance;
      distance.subDistances = subDistances || [];
      await distance.save();
      res.json({ success: true, message: 'Distance updated successfully', distance });
    } else {
      // Create new
      distance = new Distance({
        hotel: hotelId,
        mainDistance,
        subDistances: subDistances || []
      });
      await distance.save();
      res.json({ success: true, message: 'Distance created successfully', distance });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete distance for a hotel
export const deleteDistance = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const distance = await Distance.findOneAndDelete({ hotel: hotelId });

    if (!distance) {
      return res.json({ success: false, message: 'Distance not found' });
    }

    res.json({ success: true, message: 'Distance deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};