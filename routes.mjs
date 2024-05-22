import express from 'express';
import { loginUserHandler, authenticateUserHandler } from './controllers/userController.mjs';
import { checkUserExists, signupUserHandler} from './controllers/userController.mjs';
import { createPropertyHandler, getPropertiesHandler } from './controllers/propertyController.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';

const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    try{
        const properties = getPropertiesHandler(req, res);
        res.render('home', { title: 'Property Finder', catchphrase: "Όλα τα ακίνητα ενα κλικ μακριά", properties: properties });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ message: 'Error loading home page' });
    }
});

router.get('/property/:id', (req, res) => {
    try {
        console.log('Property ID:', req.params.id)
        res.render('property', { address: 'dieuthinsi', price: '5 eurw', surface: '100 metros cuadrados' })
        // const property = await Property.findById(req.params.id);
        // if (!property) {
        //     return res.status(404).send('Property not found');
        // }
        // res.render('property', { property });
    } catch (err) {
        res.status(500).send('Server Error');
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