import User from './models/User.js';

const UserRepository = {
  findOne: async (username) => {
    return await User.findOne({ username });
  },
  
  findById: async (id) => {
    return await User.findById(id);
  },
  
  create: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  }
};

export default UserRepository;
