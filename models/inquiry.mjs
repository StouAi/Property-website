import { db } from '../config/db.mjs';

// Create tables
// Inquiry
db.exec(`
    CREATE TABLE IF NOT EXISTS Inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromId INTEGER NOT NULL,
        propertyId INTEGER NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message TEXT NOT NULL,
        FOREIGN KEY (fromId) REFERENCES Users (id),
        FOREIGN KEY (propertyId) REFERENCES Properties (id)
    )
`);


// Create a new inquiry
export const createInquiry = (inquiry) => {
    try {
        const stmt = db.prepare('INSERT INTO Inquiries (fromId, propertyId, message) VALUES (?, ?, ?)');
        const { lastInsertRowid } = stmt.run(inquiry.fromId, inquiry.propertyId, inquiry.message);
        return lastInsertRowid;
    } catch (error) {
        console.error('Error creating inquiry:', error);
        throw error;
    }
};

// Get all inquiries for a property
export const getInquiriesByProperty = (propertyId) => {
    try {
        const stmt = db.prepare('SELECT * FROM Inquiries WHERE propertyId = ?');
        const inquiries = stmt.all(propertyId);
        return inquiries;
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        throw error;
    }
};

// Get all inquiries for a user
export const getInquiriesByUser = (userId) => {
    try {
        const stmt = db.prepare('SELECT * FROM Inquiries WHERE fromId = ?');
        const inquiries = stmt.all(userId);
        return inquiries;
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        throw error;
    }
};