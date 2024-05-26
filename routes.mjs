import express from 'express';
import { loginUserHandler, logoutUserHandler, checkAuthenticated } from './controllers/userController.mjs';
import { createPropertyHandler, searchPropertiesHandler, showHomePropertiesHandler} from './controllers/propertyController.mjs';
import{ showPropertyPageHandler, showUserPropertiesHandler } from './controllers/propertyController.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';
import { toggleFavoriteHandler, showFavoritesHandler,showUserInquiriesHandler ,createInquiryHandler} from './controllers/favoriteInquiryController.mjs';


const router = express.Router();


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

// Home Page
router.get('/', showHomePropertiesHandler);
router.get('/home', (req, res) => {res.redirect('/')});

// Search Page
router.get('/search', (req, res) => {
    try{
        res.render('filters', { title: 'Search', properties: []});
    } catch (error) {
        console.error('Error loading search page:', error);
        res.status(500).json({ message: 'Error loading search page' });
    }
});
router.post('/search', searchPropertiesHandler);

// Property Page
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



// List your property Page

router.get('/list-your-property', checkAuthenticated, (req, res) => {
    try{
        res.render('add-property', { title: 'Add property' });
    } catch (error) {
        console.error('Error loading add property page:', error);
        res.status(500).json({ message: 'Error loading add property page' });
    }
});
router.post('/list-your-property', createPropertyHandler);



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


// My Listings
router.get('/my-listings', checkAuthenticated,showUserPropertiesHandler);


// Favorites Page
router.get('/favorites', checkAuthenticated, showFavoritesHandler);
router.get('/favorite/:propertyId', checkAuthenticated, toggleFavoriteHandler);

// Inquiry Page
router.post('/inquiry/:propertyId', checkAuthenticated, createInquiryHandler);


// My-inquires page

router.get('/my-inquiries', checkAuthenticated,showUserInquiriesHandler);


export default router;