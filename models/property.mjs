import { db } from '../config/db.mjs';

// Create the property table
db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL,
        surface REAL NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        location TEXT NOT NULL,
        publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// Create a new property
export const createProperty = (title, description, price, location) => {
    try {
        const stmt = db.prepare('INSERT INTO properties (title, description, price, location) VALUES (?, ?, ?, ?)');
        const { lastInsertRowid } = stmt.run(title, description, price, location);
        return lastInsertRowid;
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    }
};

// Get all properties
export const getProperties = () => {
    try {
        const stmt = db.prepare('SELECT * FROM properties');
        return stmt.all();
    } catch (error) {
        console.error('Error getting properties:', error);
        throw error;
    }
};