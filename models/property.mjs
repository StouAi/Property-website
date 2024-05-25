import { db } from '../config/db.mjs';

// Create tables
// Property
db.exec(`
    CREATE TABLE IF NOT EXISTS Properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locationId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Residential', 'Commercial', 'Land')),
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        surface REAL NOT NULL CHECK (surface > 0),
        price REAL NOT NULL CHECK (price > 0),
        pricePerSquare REAL GENERATED ALWAYS AS (price / surface) VIRTUAL,
        constructionYear INTEGER NOT NULL CHECK (constructionYear >= 1000 AND constructionYear <= CAST(strftime('%Y', CURRENT_TIMESTAMP) AS INTEGER)),
        publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        forRent BOOLEAN NOT NULL,
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


// Get location IDs that match the user's input query
const getLocationsFromSearchQuery = (locationQuery) => {
    try {
        const stmt = db.prepare(`SELECT id FROM Locations WHERE
                                LOWER(country) GLOB '*' || LOWER(?) || '*'
                                OR LOWER(city) GLOB '*' || LOWER(?) || '*'
                                OR LOWER(zip) GLOB '*' || LOWER(?) || '*'
                                OR LOWER(neighborhood) GLOB '*' || LOWER(?) || '*'`);
        const rows = stmt.all(locationQuery, locationQuery, locationQuery, locationQuery);
        return rows.map(row => row.id);
    } catch (error) {
        console.error('Error getting location IDs:', error);
        throw error;
    }
};

// Get location ID
const getLocationID = (location) => {
    try {
        const stmt = db.prepare('SELECT id FROM Locations WHERE country = ? AND city = ? AND zip = ? AND neighborhood = ?');
        const row = stmt.get(location.country, location.city, location.zip, location.neighborhood);
        return row ? row.id : null;
    } catch (error) {
        console.error('Error getting location ID:', error);
        throw error;
    }
}

// Create a new location
export const createLocation = (location) => {
    try {
        db.exec('BEGIN TRANSACTION');
        const stmt = db.prepare('INSERT INTO Locations (country, city, zip, neighborhood) VALUES (?, ?, ?, ?)');
        const { lastInsertRowid } = stmt.run(location.country, location.city, location.zip, location.neighborhood);
        // stmt.finalize();
        db.exec('COMMIT');
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
        let locationId = getLocationID(location);
        if (!locationId) {
            locationId = createLocation(location);
        }

        // Add property to the database
        db.exec('BEGIN TRANSACTION');
        let stmt = db.prepare('INSERT INTO Properties (locationId, userId, type, address, description, surface, price, constructionYear, forRent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const { lastInsertRowid } = stmt.run(locationId, userID, property.type, property.address, property.description, property.surface, property.price, property.constructionYear, property.forRent);
        // stmt.finalize();
        db.exec('COMMIT');
        // Add property type to the database
        try {
            db.exec('BEGIN TRANSACTION');
            switch (property.type) {
                case 'Residential':
                    stmt = db.prepare('INSERT INTO Residential (propertyId, subtype, floor, levels, bedrooms, bathrooms) VALUES (?, ?, ?, ?, ?, ?)');
                    stmt.run(lastInsertRowid, property.subtype, property.floor, property.levels, property.bedrooms, property.bathrooms);
                    // stmt.finalize();
                    break;
                case 'Commercial':
                    stmt = db.prepare('INSERT INTO Commercial (propertyId, subtype, floor, levels, bathrooms, parking) VALUES (?, ?, ?, ?, ?, ?)');
                    stmt.run(lastInsertRowid, property.subtype, property.floor, property.levels, property.bathrooms, property.parking);
                    // stmt.finalize();
                    break;
                case 'Land':
                    stmt = db.prepare('INSERT INTO Land (propertyId, buildable) VALUES (?, ?)');
                    stmt.run(lastInsertRowid, property.buildable);
                    // stmt.finalize();
                    break;
                default:
                    throw new Error('Invalid property type');
            }
            db.exec('COMMIT');
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

// Get property from ID
export const getPropertyFromID = (propertyID) => {
    try {
        const propertyStmt = db.prepare('SELECT * FROM Properties WHERE id = ?');
        let property = propertyStmt.get(propertyID);

        if (!property) {
            throw new Error('Property not found');
        }

        let details;
        switch (property.type) {
            case 'Residential':
                const residentialStmt = db.prepare('SELECT * FROM Residential WHERE propertyId = ?');
                details = residentialStmt.get(propertyID);
                break;
            case 'Commercial':
                const commercialStmt = db.prepare('SELECT * FROM Commercial WHERE propertyId = ?');
                details = commercialStmt.get(propertyID);
                break;
            case 'Land':
                const landStmt = db.prepare('SELECT * FROM Land WHERE propertyId = ?');
                details = landStmt.get(propertyID);
                break;
            default:
                throw new Error('Invalid property type');
        }

        return { ...property, ...details };

    } catch (error) {
        console.error('Error getting property from ID:', error);
        throw error;
    }
}

export const getPropertiesForRent = () => {
    try {
        const stmt = db.prepare('SELECT * FROM Properties WHERE forRent = 1');
        return stmt.all();
    } catch (error) {
        console.error('Error getting properties for rent:', error);
        throw error;
    }
}

export const getPropertiesForSale = () => {
    try {
        const stmt = db.prepare('SELECT * FROM Properties WHERE forRent = 0');
        return stmt.all();
    } catch (error) {
        console.error('Error getting properties for sale:', error);
        throw error;
    }
}

export const getPropertiesWithFilters = (propertyFilters, locationQuery) => {
    console.log('Property filters:', propertyFilters);
    console.log('Location Query:', locationQuery ? locationQuery : '--');
    try {
        let query = 'SELECT * FROM Properties';
        const queryParams = [];
        // Property type filters
        if (propertyFilters.type) {

            if (propertyFilters.type === 'Residential') {
                query += ' JOIN (SELECT * FROM Residential WHERE 1=1';
            } else if (propertyFilters.type === 'Commercial') {
                query += ' JOIN (SELECT * FROM Commercial WHERE 1=1';
            } else if (propertyFilters.type === 'Land') {
                query += ' JOIN (SELECT * FROM Land WHERE 1=1';
            } else {
                throw new Error('Invalid property type');
            }

            if (propertyFilters.type === 'Residential' || propertyFilters.type === 'Commercial') {
                // Subtype
                if (!!propertyFilters.subtype) {
                    query += ' AND subtype = ?';
                    queryParams.push(propertyFilters.subtype);
                }

                // Floor
                if (!!propertyFilters.minFloor) {
                    query += ' AND floor >= ?';
                    queryParams.push(propertyFilters.minFloor);
                }
                if (!!propertyFilters.maxFloor) {
                    query += ' AND floor <= ?';
                    queryParams.push(propertyFilters.maxFloor);
                }

                // Levels
                if (!!propertyFilters.minLevels) {
                    query += ' AND levels >= ?';
                    queryParams.push(propertyFilters.minLevels);
                }
                if (!!propertyFilters.maxLevels) {
                    query += ' AND levels <= ?';
                    queryParams.push(propertyFilters.maxLevels);
                }

                // Bathrooms
                if (!!propertyFilters.minBathrooms) {
                    query += ' AND bathrooms >= ?';
                    queryParams.push(propertyFilters.minBathrooms);
                }
                if (!!propertyFilters.maxBathrooms) {
                    query += ' AND bathrooms <= ?';
                    queryParams.push(propertyFilters.maxBathrooms);
                }

                // Bedrooms
                if (propertyFilters.type === 'Residential') {
                    if (!!propertyFilters.minBedrooms) {
                        query += ' AND bedrooms >= ?';
                        queryParams.push(propertyFilters.minBedrooms);
                    }
                    if (!!propertyFilters.maxBedrooms) {
                        query += ' AND bedrooms <= ?';
                        queryParams.push(propertyFilters.maxBedrooms);
                    }
                }
                
                // Parking
                if (propertyFilters.type === 'Commercial') {
                    if (!!propertyFilters.parking) {
                        query += ' AND parking = ?';
                        queryParams.push(propertyFilters.parking);
                    }
                }
            } else if (propertyFilters.type === 'Land') {
                // Buildable
                if (!!propertyFilters.buildablefined) {
                    query += ' AND buildable = ?';
                    queryParams.push(propertyFilters.buildable);
                }
            }

            query += ') AS FilteredType ON Properties.id = FilteredType.propertyId';
        }

        query += ' WHERE 1=1';

        // General property filters
        if (!!propertyFilters.forRent) {
            query += ' AND forRent = ?';
            queryParams.push(propertyFilters.forRent);
        }
        if (!!propertyFilters.minSurface) {
            query += ' AND surface >= ?';
            queryParams.push(propertyFilters.minSurface);
        }
        if (!!propertyFilters.maxSurface) {
            query += ' AND surface <= ?';
            queryParams.push(propertyFilters.maxSurface);
        }
        if (!!propertyFilters.minPrice) {
            query += ' AND price >= ?';
            queryParams.push(propertyFilters.minPrice);
        }
        if (!!propertyFilters.maxPrice) {
            query += ' AND price <= ?';
            queryParams.push(propertyFilters.maxPrice);
        }
        if (!!propertyFilters.minConstructionYear) {
            query += ' AND constructionYear >= ?';
            queryParams.push(propertyFilters.minConstructionYear);
        }
        if (!!propertyFilters.maxConstructionYear) {
            query += ' AND constructionYear <= ?';
            queryParams.push(propertyFilters.maxConstructionYear);
        }

        // Location filtering
        if (locationQuery) {
            const locationIds = getLocationsFromSearchQuery(locationQuery);
            query += ' AND locationId IN (' + locationIds.map(() => '?').join(', ') + ')';
            queryParams.push(...locationIds);
        }

        console.log('Query:', query);
        console.log('Query params:', queryParams);
        const stmt = db.prepare(query);
        return stmt.all(...queryParams);
    } catch (error) {
        console.error('Error getting properties with filters:', error);
        throw error;
    }
}
