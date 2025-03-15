import express from 'express';
import { createYoga } from 'graphql-yoga';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './data/init.js';
import schema from './graphql/schema.js';
import config from './config.js';
import UserRepository from './data/userRepo.js';
import TourRepository from './data/tourRepo.js';

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Get the Codespace name from environment or use a default
const codespacePrefix = process.env.CODESPACE_NAME || 'jubilant-space-acorn-wrg46x79wr6cgqqg';
const frontendUrl = `https://${codespacePrefix}-5173.app.github.dev`;

// Apply CORS middleware with specific configuration
app.use(cors({
  origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Create GraphQL Yoga server with context
const yoga = createYoga({ 
  schema,
  context: async ({ request }) => {
    // Get the user token from the headers
    const auth = request.headers.get('authorization') || '';
    const token = auth.split('Bearer ')[1];
    
    let user = null;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        
        // Get the user from the database
        user = await UserRepository.findOne(decoded.username);
      } catch (err) {
        console.error('Error verifying token:', err.message);
      }
    }
    
    // Add the repositories to the context
    return { 
      user,
      db: {
        users: UserRepository,
        tours: TourRepository
      }
    };
  },
  cors: {
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['POST', 'GET', 'OPTIONS']
  }
});

// Apply GraphQL Yoga middleware
app.use('/graphql', yoga);

// Redirect root to /graphql
app.get('/', (req, res) => {
  res.redirect('/graphql');
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`GraphQL endpoint: http://localhost:${config.port}/graphql`);
});
