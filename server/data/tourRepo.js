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

  // New method combining search, filter, sort, and pagination
  getToursAdvanced: async (options) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      searchTerm,
    } = options;

    const query = {};

    // Apply search term filter (searching the 'name' field)
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: 'i' };
    }

    // Apply price filter
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
      query.price = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
      query.price = { $lte: maxPrice };
    }

    // Determine sort order
    let sort = {};
    const validSortFields = ['name', 'price']; // Removed createdAt
    let sortField = validSortFields.includes(sortBy) ? sortBy : 'name'; // Default to name
    sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    try {
      // Get all tours for the query without pagination
      let tours = await Tour.find(query);
      
      // If sorting by name, use localeCompare for proper Vietnamese sorting
      if (sortField === 'name') {
        tours = tours.sort((a, b) => {
          // Use Vietnamese locale for proper sorting of Vietnamese characters
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name, 'vi')
            : b.name.localeCompare(a.name, 'vi');
        });
        
        // Apply pagination manually after sorting
        tours = tours.slice(skip, skip + limit);
      } else {
        // For other fields, use MongoDB's built-in sorting
        tours = await Tour.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit);
      }

      // Execute query to get total count for pagination
      const totalCount = await Tour.countDocuments(query);

      return { tours, totalCount };
    } catch (error) {
      console.error("Error in getToursAdvanced:", error);
      throw new Error("Failed to retrieve tours.");
    }
  },


  // searchTours method is removed as its functionality is merged into getToursAdvanced
};

export default TourRepository;
