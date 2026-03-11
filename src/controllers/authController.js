import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import { HTTP } from '../constants/errorCodes.js';
import { ERR } from '../constants/errorCodes.js';


 // Register user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(HTTP.CONFLICT).json({ message: 'User already exists' });
        }   

    }catch (error) {
        res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }   
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });

};

 // Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(HTTP.BAD_REQUEST).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(HTTP.BAD_REQUEST).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

 // Logout user
export const logout = (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(HTTP.UNAUTHORIZED).json({ message: 'No token provided' });
    }
    res.json({ message: 'Logged out successfully' });


    
};
