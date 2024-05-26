import { createFavorite, deleteFavorite, getFavoritesByUser, isFavorite } from '../models/favorites.mjs';
<<<<<<< HEAD
import { createInquiry, getInquiriesForUser, getInquiriesSentFromUser } from '../models/inquiry.mjs';
import { findUserByID } from '../models/user.mjs';
=======
import { createInquiry } from '../models/inquiry.mjs';
>>>>>>> c18fb1bc5eb307f6993741725297800fd5792cb6


// Add a favorite
export const toggleFavoriteHandler = (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const userId = req.session.loggedUserId;

        if (isFavorite(userId, propertyId)) {
            deleteFavorite(userId, propertyId);
        } else {
            createFavorite(userId, propertyId);
        }
        
        res.redirect(`/property/${propertyId}`);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding favorite' });
    }
};

// Show favorites
export const showFavoritesHandler = (req, res) => {
    try {
        const userId = req.session.loggedUserId;
        const favorites = getFavoritesByUser(userId);

        res.render('my-favorites', { title: 'Favorites', favorites: favorites, numOfFavorites: favorites.length, oneFavorite: favorites.length === 1});
    } catch (error) {
        console.error('Error showing favorites:', error);
        res.status(500).json({ message: 'Error showing favorites' });
    }
}

// Create a new inquiry
export const createInquiryHandler = (req, res) => {
    try {
        const message = req.body.message;
        const propertyId = parseInt(req.params.propertyId);
        const fromId = req.session.loggedUserId;

        const inquiryId = createInquiry({ fromId, propertyId, message });
        res.redirect(`/property/${propertyId}`);
        // res.json({ success: true, message: 'Inquiry created.', inquiryId });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ message: 'Error creating inquiry' });
    }
};
<<<<<<< HEAD


export const showUserInquiriesHandler = (req, res) => {
    const userId = req.session.loggedUserId;
    
    try {
        
        let inquiries = getInquiriesForUser(userId);
        let inquiry_user = findUserByID(inquiries[0].fromId);
        console.log('Inquiries:', inquiries);
        console.log('Inquiries:2', inquiry_user);
        res.render('my-inquiries', { title: 'My Inquiries', inquiries: inquiries,inquiry_user:inquiry_user});

    } catch (error) {
        console.error('Error loading my inquiries page:', error);
        res.status(500).json({ message: 'Error loading my inquiries page' });
    }

}
=======
>>>>>>> c18fb1bc5eb307f6993741725297800fd5792cb6
