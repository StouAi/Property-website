import jwt from 'jsonwebtoken';
import { findUserByEmail, registerUser, authenticateUser } from '../models/user.mjs';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register a new user
export const registerUserHandler = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userId = await registerUser(username, email, password);
        const user = findUserByEmail(email);

        if (userId) {
            const token = generateToken(user);
            res.status(201).json({ userId, token });
        } else {
            res.status(500).json({ message: 'User registration failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'User registration failed' });
    }
};

// Authenticate user
export const authenticateUserHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            const token = generateToken(user);
            res.json({ email: user.email, token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'User authentication failed' });
    }
};