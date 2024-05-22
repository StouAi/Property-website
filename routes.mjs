import express from 'express';
import { loginUserHandler, authenticateUserHandler } from './controllers/userController.mjs';
import { checkUserExists, signupUserHandler} from './controllers/userController.mjs';
import { createPropertyHandler, getPropertiesHandler, showHomePropertiesHandler, showPropertyPageHandler } from './controllers/propertyController.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';

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

// Buy / Rent Page
router.get('/buy', (req, res) => {
    try{
        res.render('home', { title: 'Property Finder', catchphrase: "Ακίνητα προς Αγορά", properties: [] });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ message: 'Error loading home page' });
    }
});

router.get('/rent', (req, res) => {
    try{
        res.render('home', { title: 'Property Finder', catchphrase: "Ακίνητα προς Ενοικίαση", properties: [] });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ message: 'Error loading home page' });
    }
});



// Create property page
router.get('/createProperty', (req, res) => {
    try{
        res.render('add-property', { title: 'Add property' });
    } catch (error) {
        console.error('Error loading add property page:', error);
        res.status(500).json({ message: 'Error loading add property page' });
    }
});

router.get('/getProperties', getPropertiesHandler);
router.post('/createProperty', createPropertyHandler);

router.get('/search', (req, res) => {
    try{
        res.render('filters', { title: 'Search', properties: []});
    } catch (error) {
        console.error('Error loading search page:', error);
        res.status(500).json({ message: 'Error loading search page' });
    }
});

router.post('/search', getPropertiesHandler);


// Login
router.get('/login', (req, res) => {
    try{
        res.render('auth/login-signup', { layout: 'login-signup'});
    } catch (error) {
        console.error('Error loading login page:', error);
        res.status(500).json({ message: 'Error loading login page' });
    }
});

router.post('/login', loginUserHandler);
// router.post('/authUser', authenticateUserHandler);
// router.post('/signupUser', signupUserHandler);

export default router;