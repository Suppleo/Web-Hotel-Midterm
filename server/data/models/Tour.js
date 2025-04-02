import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageFilename: { // Added for photo feature
    type: String,
    required: false, // Not required initially
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.model('Tour', TourSchema);
