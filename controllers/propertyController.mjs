import { createProperty, getAllProperties, getPropertiesWithFilters } from '../models/property.mjs';
import { getPropertiesForRent, getPropertiesForSale } from '../models/property.mjs';
import { getPropertyFromID } from '../models/property.mjs';
import { findUserByID } from '../models/user.mjs';

// Create a new property
export const createPropertyHandler = (req, res) => {
    // let { userID, property, location } = req.body;
    let { property, location } = req.body;

    let userID = 1; // Hardcoded for now

    property.surface = parseInt(property.surface);
    property.price = parseInt(property.price);
    property.constructionYear = parseInt(property.constructionYear);

    try {
        const propertyId = createProperty(userID, property, location);
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
export const searchPropertiesHandler = (req, res) => {
    try {
        let locationQuery;
        let propertyFilters = {};
        if (req.body.tabs !== undefined) {
            locationQuery = req.body.locationQuery;
            propertyFilters.forRent = ((req.body.tabs === 'rent') ? 1 : 0);
        } else {
            locationQuery = req.body.locationQuery;
            propertyFilters = req.body.propertyFilters;
        }

        if (propertyFilters !== undefined ) {
            for (let key in propertyFilters) {
                if (propertyFilters[key] === '')
                    propertyFilters[key] = null;
                else if (!isNaN(propertyFilters[key]))
                    propertyFilters[key] = parseInt(propertyFilters[key]);
            }
        }

        // Check for invalid filter values
        if (!!propertyFilters.minPrice && !!propertyFilters.maxPrice)
            if (propertyFilters.minPrice > propertyFilters.maxPrice)
                res.status(400).json({ message: 'Minimum price cannot be greater than maximum price' });
        
        if (!!propertyFilters.minSurface && !!propertyFilters.maxSurface)
            if (propertyFilters.minSurface > propertyFilters.maxSurface)
                res.status(400).json({ message: 'Minimum surface cannot be greater than maximum surface' });

        if (!!propertyFilters.minConstructionYear && !!propertyFilters.maxConstructionYear)
            if (propertyFilters.minConstructionYear > propertyFilters.maxConstructionYear)
                res.status(400).json({ message: 'Minimum construction year cannot be greater than maximum construction year' });

        if (!!propertyFilters.minFloor && !!propertyFilters.maxFloor)
            if (propertyFilters.minFloor > propertyFilters.maxFloor)
                res.status(400).json({ message: 'Minimum floor cannot be greater than maximum floor' });

        if (!!propertyFilters.minLevels && !!propertyFilters.maxLevels)
            if (propertyFilters.minLevels > propertyFilters.maxLevels)
                res.status(400).json({ message: 'Minimum levels cannot be greater than maximum levels' });

        if (!!propertyFilters.minBedrooms && !!propertyFilters.maxBedrooms)
            if (propertyFilters.minBedrooms > propertyFilters.maxBedrooms)
                res.status(400).json({ message: 'Minimum bedrooms cannot be greater than maximum bedrooms' });

        if (!!propertyFilters.minBathrooms && !!propertyFilters.maxBathrooms)
            if (propertyFilters.minBathrooms > propertyFilters.maxBathrooms)
                res.status(400).json({ message: 'Minimum bathrooms cannot be greater than maximum bathrooms' });

        const properties = getPropertiesWithFilters(propertyFilters, locationQuery);
        res.render('filters', { title: 'Search', properties: properties, numOfResults: properties.length});
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Error fetching properties' });
    }
};

// Show home page properties
export const showHomePropertiesHandler = (req, res) => {
    try {
        let propertiesForSale = getPropertiesForSale().slice(0, 10);
        let propertiesForRent = getPropertiesForRent().slice(0, 10);
        propertiesForSale = propertiesForSale.map(property => getPropertyFromID(property.id));
        propertiesForRent = propertiesForRent.map(property => getPropertyFromID(property.id));

        res.render('home', {
            title: 'Property Finder',
            catchphrase: "Ακίνητα προς Αγορά",
            propertiesForSale: propertiesForSale,
            propertiesForRent: propertiesForRent
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ message: 'Error loading home page' });
    }
};

export const showPropertyPageHandler = (req, res) => {
    try {
        const property = getPropertyFromID(parseInt(req.params.id));
        const user = findUserByID(property.userId);

        console.log('Property: ', property);
        console.log('User: ', user);

        res.render('property', { property, user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
  };
