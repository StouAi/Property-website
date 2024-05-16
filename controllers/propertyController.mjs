import { createProperty, getProperties } from '../models/property.mjs';

// Create a new property
export const createPropertyHandler = (req, res) => {
    const { title, description, price, location } = req.body;

    try {
        const propertyId = createProperty(title, description, price, location);
        if (propertyId) {
            res.status(201).json({ propertyId });
        } else {
            res.status(500).json({ message: 'Property creation failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Property creation failed' });
    }
};

// Get all properties
export const getPropertiesHandler = (req, res) => {
    try {
        const properties = getProperties();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties' });
    }
};