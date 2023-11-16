import bcrypt from 'bcryptjs';
import User from '../../models/user.js';
import { populateUser } from './merge.js';
import jwt from 'jsonwebtoken';

export default {
  users: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthorized operation');
      }
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
  login: async ({email, password}) => {
    const user = await User.findOne({email: email});
    if (!user) {
        throw new Error('Email is not correct');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual){
        throw new Error('Password is incorrect');
    }
    const token = jwt.sign({userId: user.id, email: user.email}, 'supersecretkey', {
        expiresIn: '4h'
    });
    return {
        userId: user.id,
        token: token,
        tokenExpiration: 4
    }
  }
};
