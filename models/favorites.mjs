import { db } from '../config/db.mjs';

// Create tables
// Favorites
db.exec(`
    CREATE TABLE IF NOT EXISTS Favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        propertyId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users (id),
        FOREIGN KEY (propertyId) REFERENCES Properties (id)
    )
`);

// Create a new favorite
export const createFavorite = (userId, propertyId) => {
    try {
        const stmt = db.prepare('INSERT INTO Favorites (userId, propertyId) VALUES (?, ?)');
        const { lastInsertRowid } = stmt.run(userId, propertyId);
        return lastInsertRowid;
    } catch (error) {
        console.error('Error creating favorite:', error);
        throw error;
    }
};

// Get all favorites for a user
export const getFavoritesByUser = (userId) => {
    try {
        const stmt = db.prepare('SELECT * FROM Favorites WHERE userId = ?');
        return stmt.all(userId);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};