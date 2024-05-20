import { createProperty, getAllProperties, getPropertiesWithFilters } from '../models/property.mjs';

// Create a new property
export const createPropertyHandler = (req, res) => {
    let { property, location } = req.body;

    property.surface = parseInt(property.surface);
    property.price = parseInt(property.price);
    property.constructionYear = parseInt(property.constructionYear);

    try {
        const propertyId = createProperty(property, location);
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
    // let { propertyFilters, locationFilters } = req.body;

    let propertyFilters = req.body.property;

    console.log(propertyFilters);
    for (let key in propertyFilters) {
        if (propertyFilters[key] === '') {
            propertyFilters[key] = null;
        } else if (!isNaN(propertyFilters[key])) {
            propertyFilters[key] = parseInt(propertyFilters[key]);
        }
    }
    console.log(propertyFilters);


    try {
        let locationFilters = null;
        // const properties = getAllProperties();
        const properties = getPropertiesWithFilters(propertyFilters, locationFilters);
        console.log(properties);
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Error fetching properties' });
    }
};


