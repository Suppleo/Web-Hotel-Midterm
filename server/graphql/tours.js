import TourRepository from '../data/tourRepo.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

const typeDef = `
  type Tour {
    id: ID!
    name: String!
    price: Float!
    description: String!
    imageFilename: String # Added field
    createdAt: String!
    isActive: Boolean!
  }

  input TourInput {
    name: String!
    price: Float!
    description: String!
    imageFilename: String # Added field
    isActive: Boolean
  }

  input TourUpdateInput {
    name: String
    price: Float
    description: String
    imageFilename: String # Added field
    isActive: Boolean
  }

  # Response type for the tours query including pagination info
  type TourListResponse {
    tours: [Tour]!
    totalCount: Int!
  }

  extend type Query {
    # Updated tours query with pagination, sorting, filtering, and search
    tours(
      page: Int = 1
      limit: Int = 10
      sortBy: String = "createdAt"
      sortOrder: String = "desc"
      minPrice: Float
      maxPrice: Float
      searchTerm: String
    ): TourListResponse!
    tour(id: ID!): Tour
    # searchTours is removed, functionality merged into tours query
  }

  extend type Mutation {
    createTour(tourInput: TourInput!): Tour!
    updateTour(id: ID!, tourInput: TourUpdateInput!): Tour!
    deleteTour(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    // Updated tours resolver to handle new arguments
    tours: async (_, { page, limit, sortBy, sortOrder, minPrice, maxPrice, searchTerm }) => {
      const options = {
        page: Math.max(1, page), // Ensure page is at least 1
        limit: Math.max(1, limit), // Ensure limit is at least 1
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        searchTerm,
      };
      // This repository method will need to be implemented/updated
      // It should return { tours: [], totalCount: number }
      return await TourRepository.getToursAdvanced(options);
    },
    tour: async (_, { id }) => {
      return await TourRepository.getTourById(id);
    },
    // searchTours resolver removed
  },
  Mutation: {
    createTour: isAuthenticated(hasRole('manager')(async (_, { tourInput }, { user }) => {
      return await TourRepository.createTour(tourInput);
    })),
    updateTour: isAuthenticated(hasRole('manager')(async (_, { id, tourInput }) => {
      return await TourRepository.updateTour(id, tourInput);
    })),
    deleteTour: isAuthenticated(hasRole('manager')(async (_, { id }) => {
      const result = await TourRepository.deleteTour(id);
      return !!result;
    })),
  },
  Tour: {
    id: (parent) => parent._id.toString(),
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
};

export { typeDef, resolvers };
