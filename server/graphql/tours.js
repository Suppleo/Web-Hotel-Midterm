import TourRepository from '../data/tourRepo.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

const typeDef = `
  type Tour {
    id: ID!
    name: String!
    price: Float!
    description: String!
    createdAt: String!
    isActive: Boolean!
  }

  input TourInput {
    name: String!
    price: Float!
    description: String!
    isActive: Boolean
  }

  input TourUpdateInput {
    name: String
    price: Float
    description: String
    isActive: Boolean
  }

  input TourSearchInput {
    name: String
    minPrice: Float
    maxPrice: Float
  }

  extend type Query {
    tours: [Tour]!
    tour(id: ID!): Tour
    searchTours(criteria: TourSearchInput): [Tour]!
  }

  extend type Mutation {
    createTour(tourInput: TourInput!): Tour!
    updateTour(id: ID!, tourInput: TourUpdateInput!): Tour!
    deleteTour(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    tours: async () => {
      return await TourRepository.getAllTours();
    },
    tour: async (_, { id }) => {
      return await TourRepository.getTourById(id);
    },
    searchTours: async (_, { criteria }) => {
      return await TourRepository.searchTours(criteria);
    },
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
