import { db } from '../config/db.mjs';
import bcrypt from 'bcrypt';

// Create the user table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Register a new user
export const registerUser = async (username, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        const { lastInsertRowid } = stmt.run(username, email, hashedPassword);
        return lastInsertRowid;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Find a user by username
export const findUserByUsername = (username) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username);
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

// Find a user by email
export const findUserByEmail = (email) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

// Authenticate user
export const authenticateUser = async (email, password) => {
    try {
        const user = findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
};