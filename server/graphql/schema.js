import { createSchema } from 'graphql-yoga';
import _ from 'lodash';

import { typeDef as tours, resolvers as toursResolvers } from './tours.js';
import { typeDef as authentication, resolvers as authResolvers } from './authentication.js';
import { typeDef as uploadTypeDef, resolvers as uploadResolvers } from './upload.js'; // Added upload import

// Base Query and Mutation types
const query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [query, tours, authentication, uploadTypeDef]; // Added uploadTypeDef
const resolvers = _.merge({}, toursResolvers, authResolvers, uploadResolvers); // Added uploadResolvers

const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

export default schema;
