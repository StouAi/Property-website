import { db } from '../config/db.mjs';

// Create tables
// Favorites
db.exec(`
    CREATE TABLE IF NOT EXISTS Favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        propertyId INTEGER NOT NULL 
    )
`);

// Create a new property
export const createProperty = (property) => {
    try {
        const stmt = db.prepare('INSERT INTO Properties (title, description, price, location) VALUES (?, ?, ?, ?)');
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
        const stmt = db.prepare('SELECT * FROM Properties');
        return stmt.all();
    } catch (error) {
        console.error('Error getting properties:', error);
        throw error;
    }
};