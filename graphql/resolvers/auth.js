import bcrypt from 'bcryptjs';
import User from '../../models/user.js';
import { populateUser } from './merge.js';

export default {
  users: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return populateUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User Exists!");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
