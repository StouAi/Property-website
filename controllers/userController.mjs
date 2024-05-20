import jwt from 'jsonwebtoken';
import { findUserByUsername, registerUser, authenticateUser } from '../models/user.mjs';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register a new user
export const loginUserHandler = async (req, res) => {
    try {
        const { formType, username, password, alsoPassword } = req.body;

        if (formType === 'login') {
            if (!findUserByUsername(username)) {
                return res.json({ success: false, message: 'User does not exist.' });
            } 

            const authenticated = await authenticateUser(username, password);

            if (authenticated) {
                return res.json({ success: true, message: 'User authenticated.', redirect: '/' });
            } else {
                return res.json({ success: false, message: 'Invalid email or password.' });
            }
        } else if (formType === 'signup') {
            if (findUserByUsername(username)) {
                return res.json({ success: false, message: 'User already exists.' });
            } 

            if (password !== alsoPassword) {
                return res.json({ success: false, message: 'Passwords do not match.' });
            }

            const userId = await registerUser(username, password);
            const user = findUserByUsername(username);

            if (userId) {
                const token = generateToken(user);
                // return res.status(201).json({ userId, token });
                return res.json({ success: true, message: 'User registered.', redirect: '/' });
            } else {
                return res.json({ success: false, message: 'User registration failed.' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'User registration failed' });
    }
};

// Authenticate user
export const authenticateUserHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            res.redirect('/');
            // const token = generateToken(user);
            // res.json({ email: user.email, token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'User authentication failed' });
    }
};


// Check if user exists based on email
export const checkUserExists = async (req, res) => {
    const existingUser = findUserByUsername(req.body.username);
    if (existingUser) {
        res.render('auth/login-password', { title: 'Log in', layout: 'login-signup'});
    } else {
        res.render('auth/signup-password', { title: 'Sign up', layout: 'login-signup'});
    }
};

export const signupUserHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userId = await registerUser(username, password);
        // const user = findUserByUsername(username);

        if (userId) {
            res.redirect('/');
            // const token = generateToken(user);
            // res.status(201).json({ userId, token });
        } else {
            res.status(500).json({ message: 'User registration failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'User registration failed' });
    }
}
