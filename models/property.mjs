import { db } from '../config/db.mjs';

// Create tables
// Property
db.exec(`
    CREATE TABLE IF NOT EXISTS Properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locationId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        surface REAL NOT NULL CHECK (surface > 0),
        price REAL NOT NULL CHECK (price > 0),
        pricePerSquare REAL GENERATED ALWAYS AS (price / surface) VIRTUAL,
        constructionYear INTEGER NOT NULL CHECK (constructionYear >= 1000 AND constructionYear <= CAST(strftime('%Y', CURRENT_TIMESTAMP) AS INTEGER)),
        publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (locationId) REFERENCES Locations (id),
        FOREIGN KEY (userId) REFERENCES Users (id)
    )
`);

// Property subtypes
db.exec(`
    CREATE TABLE IF NOT EXISTS Residential (
        propertyId INTEGER NOT NULL,
        subtype TEXT NOT NULL,
        floor INTEGER NOT NULL CHECK (floor >= 0),
        levels INTEGER NOT NULL CHECK (levels >= 0),
        bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
        bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
        FOREIGN KEY (propertyId) REFERENCES Properties (id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Commercial (
        propertyId INTEGER NOT NULL,
        subtype TEXT NOT NULL,
        floor INTEGER NOT NULL CHECK (floor >= 0),
        levels INTEGER NOT NULL CHECK (levels >= 0),
        bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
        parking BOOLEAN NOT NULL,
        FOREIGN KEY (propertyId) REFERENCES Properties (id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Land (
        propertyId INTEGER NOT NULL,
        buildable BOOLEAN NOT NULL,
        FOREIGN KEY (propertyId) REFERENCES Properties (id)
    )
`);

// Location
db.exec(`
    CREATE TABLE IF NOT EXISTS Locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        zip TEXT NOT NULL,
        neighborhood TEXT NOT NULL,
        UNIQUE (country, city, zip, neighborhood)
    )
`);


// Get location IDs that match the provided filters
const getLocationIds = (locationFilters) => {
    try {
        let query = 'SELECT id FROM Locations WHERE 1=1';
        const queryParams = [];

        // Add filters based on provided params
        if (locationFilters.country) {
            query += ' AND country = ?';
            queryParams.push(locationFilters.country);
        }
        if (locationFilters.city) {
            query += ' AND city = ?';
            queryParams.push(locationFilters.city);
        }
        if (locationFilters.zip) {
            query += ' AND zip = ?';
            queryParams.push(locationFilters.zip);
        }
        if (locationFilters.neighborhood) {
            query += ' AND neighborhood = ?';
            queryParams.push(locationFilters.neighborhood);
        }

        const stmt = db.prepare(query);
        const rows = stmt.all(...queryParams);

        return rows.map(row => row.id);
    } catch (error) {
        console.error('Error getting location IDs:', error);
        throw error;
    }
};

// Create a new location
const createLocation = (location) => {
    try {
        const stmt = db.prepare('INSERT INTO Locations (country, city, zip, neighborhood) VALUES (?, ?, ?, ?)');
        const { lastInsertRowid } = stmt.run(location.country, location.city, location.zip, location.neighborhood);
        return lastInsertRowid;
    } catch (error) {
        console.error('Error creating location:', error);
        throw error;
    }
}

// Create a new property
export const createProperty = (userID, property, location) => {
    try {
        // Get location ID
        let locationId = getLocationIds(location);
        if (!locationId) {
            locationId = createLocation(location);
        }

        // Add property to the database
        let stmt = db.prepare('INSERT INTO Properties (locationId, userId, address, description, surface, price, constructionYear) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const { lastInsertRowid } = stmt.run(locationId, userID, property.address, property.description, property.surface, property.price, property.constructionYear);

        // Add property type to the database
        try {
            switch (property.type) {
                case 'residential':
                    stmt = db.prepare('INSERT INTO Residential (propertyId, subtype, floor, levels, bedrooms, bathrooms) VALUES (?, ?, ?, ?, ?, ?)');
                    stmt.run(lastInsertRowid, property.subtype, property.floor, property.levels, property.bedrooms, property.bathrooms);
                    break;
                case 'commercial':
                    stmt = db.prepare('INSERT INTO Commercial (propertyId, subtype, floor, levels, bathrooms, parking) VALUES (?, ?, ?, ?, ?, ?)');
                    stmt.run(lastInsertRowid, property.subtype, property.floor, property.levels, property.bathrooms, property.parking);
                    break;
                case 'land':
                    stmt = db.prepare('INSERT INTO Land (propertyId, buildable) VALUES (?, ?)');
                    stmt.run(lastInsertRowid, property.buildable);
                    break;
                default:
                    throw new Error('Invalid property type');
            }
        } catch (error) {
            console.error('Error creating property type:', error);
            throw error;
        }
        
        return lastInsertRowid;
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    }
};

// Get all properties
export const getAllProperties = () => {
    try {
        const stmt = db.prepare('SELECT * FROM Properties');
        return stmt.all();
    } catch (error) {
        console.error('Error getting properties:', error);
        throw error;
    }
};

// export const getResidentialProperties = () => {
//     try {
//         const stmt = db.prepare(`SELECT (id, address, description, surface, price, pricePerSquare, constructionYear, publishedAt, floor, levels, bedrooms, bathrooms)
//                                  FROM Properties JOIN Residential ON Properties.id = Residential.propertyId`);
//         return stmt.all();
//     } catch (error) {
//         console.error('Error getting residential properties:', error);
//         throw error;
//     }
// };

// export const getCommercialProperties = () => {
//     try {
//         const stmt = db.prepare(`SELECT (id, address, description, surface, price, pricePerSquare, constructionYear, publishedAt, floor, levels, bathrooms)
//                                  FROM Properties JOIN Commercial ON Properties.id = Commercial.propertyId`);
//         return stmt.all();
//     } catch (error) {
//         console.error('Error getting commercial properties:', error);
//         throw error;
//     }
// };

// const getLandProperties = () => {
//     try {
//         const stmt = db.prepare(`SELECT (id, address, description, surface, price, pricePerSquare, constructionYear, publishedAt, buildable)
//                                  FROM Properties JOIN Land ON Properties.id = Land.propertyId`);
//         return stmt.all();
//     } catch (error) {
//         console.error('Error getting land properties:', error);
//         throw error;
//     }
// };


export const getPropertiesWithFilters = (propertyFilters, locationFilters) => {
    console.log('Property filters:', propertyFilters);
    console.log('Location filters:', locationFilters);
    try {
        let query = 'SELECT * FROM Properties';
        const queryParams = [];

        // Property type filters
        if (propertyFilters.type) {

            if (propertyFilters.type === 'residential') {
                query += ' JOIN (SELECT * FROM Residential WHERE 1=1';
            } else if (propertyFilters.type === 'commercial') {
                query += ' JOIN (SELECT * FROM Commercial WHERE 1=1';
            } else if (propertyFilters.type === 'land') {
                query += ' JOIN (SELECT * FROM Land WHERE 1=1';
            } else {
                throw new Error('Invalid property type');
            }

            if (propertyFilters.type === 'residential' || propertyFilters.type === 'commercial') {
                // Subtype
                if (propertyFilters.subtype !== null) {
                    query += ' AND subtype = ?';
                    queryParams.push(propertyFilters.subtype);
                }

                // Floor
                if (propertyFilters.minFloor !== null) {
                    query += ' AND floor >= ?';
                    queryParams.push(propertyFilters.minFloor);
                }
                if (propertyFilters.maxFloor !== null) {
                    query += ' AND floor <= ?';
                    queryParams.push(propertyFilters.maxFloor);
                }

                // Levels
                if (propertyFilters.minLevels !== null) {
                    query += ' AND levels >= ?';
                    queryParams.push(propertyFilters.minLevels);
                }
                if (propertyFilters.maxLevels !== null) {
                    query += ' AND levels <= ?';
                    queryParams.push(propertyFilters.maxLevels);
                }

                // Bathrooms
                if (propertyFilters.minBathrooms !== null) {
                    query += ' AND bathrooms >= ?';
                    queryParams.push(propertyFilters.minBathrooms);
                }
                if (propertyFilters.maxBathrooms !== null) {
                    query += ' AND bathrooms <= ?';
                    queryParams.push(propertyFilters.maxBathrooms);
                }

                // Bedrooms
                if (propertyFilters.type === 'residential') {
                    if (propertyFilters.minBedrooms !== null) {
                        query += ' AND bedrooms >= ?';
                        queryParams.push(propertyFilters.minBedrooms);
                    }
                    if (propertyFilters.maxBedrooms !== null) {
                        query += ' AND bedrooms <= ?';
                        queryParams.push(propertyFilters.maxBedrooms);
                    }
                }
                
                // Parking
                if (propertyFilters.type === 'commercial') {
                    if (propertyFilters.parking !== null) {
                        query += ' AND parking = ?';
                        queryParams.push(propertyFilters.parking);
                    }
                }
            } else if (propertyFilters.type === 'land') {
                // Buildable
                if (propertyFilters.buildable !== null) {
                    query += ' AND buildable = ?';
                    queryParams.push(propertyFilters.buildable);
                }
            }

            query += ') AS FilteredType ON Properties.id = FilteredType.propertyId';
        }

        query += ' WHERE 1=1';

        // General property filters
        if (propertyFilters.minSurface !== null) {
            query += ' AND surface >= ?';
            queryParams.push(propertyFilters.minSurface);
        }
        if (propertyFilters.maxSurface !== null) {
            query += ' AND surface <= ?';
            queryParams.push(propertyFilters.maxSurface);
        }
        if (propertyFilters.minPrice !== null) {
            query += ' AND price >= ?';
            queryParams.push(propertyFilters.minPrice);
        }
        if (propertyFilters.maxPrice !== null) {
            query += ' AND price <= ?';
            queryParams.push(propertyFilters.maxPrice);
        }
        if (propertyFilters.minConstructionYear !== null) {
            query += ' AND constructionYear >= ?';
            queryParams.push(propertyFilters.minConstructionYear);
        }
        if (propertyFilters.maxConstructionYear !== null) {
            query += ' AND constructionYear <= ?';
            queryParams.push(propertyFilters.maxConstructionYear);
        }

        // Location filters
        if (locationFilters) {
            const locationIds = getLocationIds(locationFilters);
            if (locationIds.length > 0) {
                query += ' AND locationId IN (' + locationIds.map(() => '?').join(', ') + ')';
                queryParams.push(...locationIds);
            } 
        }

        console.log('Query:', query);
        const stmt = db.prepare(query);
        return stmt.all(...queryParams);
    } catch (error) {
        console.error('Error getting properties with filters:', error);
        throw error;
    }
}
