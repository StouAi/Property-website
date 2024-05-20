import { db } from '../config/db.mjs';
import bcrypt from 'bcrypt';

// Create the user table
db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);


// Register a new user
export const registerUser = async (username, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = db.prepare('INSERT INTO Users (username, password) VALUES (?, ?)');
        const { lastInsertRowid } = stmt.run(username, hashedPassword);
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

// Authenticate user
export const authenticateUser = async (username, password) => {
    try {
        const user = findUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
};