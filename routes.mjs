import express from 'express';
import { registerUserHandler, authenticateUserHandler } from './controllers/userController.mjs';
import { createPropertyHandler, getPropertiesHandler } from './controllers/propertyController.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';

const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    try{
        res.render('home', { title: 'Property Finder', properties: [] });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ message: 'Error loading home page' });
    }
});

// About Us Page
router.get('/about-us', (req, res) => {
    try{
        res.render('about-us', { title: 'About Us' });
    } catch (error) {
        console.error('Error loading about page:', error);
        res.status(500).json({ message: 'Error loading about page' });
    }
});

// Contact Page
router.get('/contact', (req, res) => {
    try{
        res.render('contact', { title: 'Contact' });
    } catch (error) {
        console.error('Error loading contact page:', error);
        res.status(500).json({ message: 'Error loading contact page' });
    }
});

// Log-in Page
router.get('/#', (req, res) => {
    try{
        res.render('log-in', { title: 'Log-in' });
    } catch (error) {
        console.error('Error loading login page:', error);
        res.status(500).json({ message: 'Error loading login page' });
    }
});

// // User Routes
// router.post('/users/register', registerUserHandler);
// router.post('/users/login', authenticateUserHandler);

// // Property Routes
// router.route('/properties')
//     .get(getPropertiesHandler)
//     .post(authMiddleware, createPropertyHandler);

// // Property Routes
// router.get('/properties', async (req, res) => {
//     try {
//         const properties = await getProperties();
//         res.json(properties);
//     } catch (error) {
//         console.error('Error fetching properties:', error);
//         res.status(500).json({ message: 'Error fetching properties' });
//     }
// });

// router.post('/properties', async (req, res) => {
//     const { title, description, price, location } = req.body;
//     try {
//         const propertyId = await createProperty(title, description, price, location);
//         res.status(201).json({ message: 'Property created', propertyId });
//     } catch (error) {
//         console.error('Error creating property:', error);
//         res.status(500).json({ message: 'Error creating property' });
//     }
// });

export default router;