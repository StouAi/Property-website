import express from 'express';
import { loginUserHandler, logoutUserHandler, checkAuthenticated } from './controllers/userController.mjs';
import { createPropertyHandler, searchPropertiesHandler, showHomePropertiesHandler, showPropertyPageHandler } from './controllers/propertyController.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';
import { addFavoriteHandler, showFavoritesHandler } from './controllers/favoriteInquiryController.mjs';

const router = express.Router();

// Home Page
router.get('/', showHomePropertiesHandler);

router.get('/property/:id', showPropertyPageHandler);



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


// Create property page
router.get('/list-your-property', checkAuthenticated, (req, res) => {
    try{
        res.render('add-property', { title: 'Add property' });
    } catch (error) {
        console.error('Error loading add property page:', error);
        res.status(500).json({ message: 'Error loading add property page' });
    }
});
router.post('/list-your-property', createPropertyHandler);

router.get('/search', (req, res) => {
    try{
        res.render('filters', { title: 'Search', properties: []});
    } catch (error) {
        console.error('Error loading search page:', error);
        res.status(500).json({ message: 'Error loading search page' });
    }
});

router.post('/search', searchPropertiesHandler);


// Login / Logout
router.get('/login', (req, res) => {
    try{
        res.render('auth/login-signup', { layout: 'login-signup'});
    } catch (error) {
        console.error('Error loading login page:', error);
        res.status(500).json({ message: 'Error loading login page' });
    }
});
router.post('/login', loginUserHandler);
router.get('/logout', logoutUserHandler);

// Favorites
router.get('/favorites', checkAuthenticated, showFavoritesHandler);
router.get('/favorite/:id', checkAuthenticated, addFavoriteHandler);


// Inquiry
router.post('/inquiry', checkAuthenticated, (req, res) => {
    try{
        console.log(req.body)
        // res.render('inquiry', { title: 'Inquiry' });
    } catch (error) {
        console.error('Error loading inquiry page:', error);
        res.status(500).json({ message: 'Error loading inquiry page' });
    }
});

export default router;