import Tour from './models/Tour.js';

const TourRepository = {
  getAllTours: async () => {
    return await Tour.find().sort({ name: 1 });
  },
  
  getTourById: async (id) => {
    return await Tour.findById(id);
  },
  
  createTour: async (tourData) => {
    const newTour = new Tour(tourData);
    return await newTour.save();
  },
  
  updateTour: async (id, tourData) => {
    return await Tour.findByIdAndUpdate(id, tourData, { new: true });
  },
  
  deleteTour: async (id) => {
    return await Tour.findByIdAndDelete(id);
  },
  
  searchTours: async (criteria) => {
    const query = {};
    
    if (criteria.name) {
      query.name = { $regex: criteria.name, $options: 'i' };
    }
    
    if (criteria.minPrice && criteria.maxPrice) {
      query.price = { $gte: criteria.minPrice, $lte: criteria.maxPrice };
    } else if (criteria.minPrice) {
      query.price = { $gte: criteria.minPrice };
    } else if (criteria.maxPrice) {
      query.price = { $lte: criteria.maxPrice };
    }
    
    return await Tour.find(query).sort({ name: 1 });
  }
};

export default TourRepository;
