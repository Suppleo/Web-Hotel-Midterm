import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_management',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiration: '24h'
};
