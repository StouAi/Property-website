import { createFavorite, deleteFavorite, getFavoritesByUser, isFavorite } from '../models/favorites.mjs';
import { createInquiry, getInquiriesForUser } from '../models/inquiry.mjs';
import { getPropertyFromID } from '../models/property.mjs';
import { findUserByID } from '../models/user.mjs';


// Add a favorite
export const toggleFavoriteHandler = (req, res, next) => {
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
        next(error);
        // console.error('Error adding favorite:', error);
        // res.status(500).json({ message: 'Error adding favorite' });
    }
};

// Show favorites
export const showFavoritesHandler = (req, res, next) => {
    try {
        const userId = req.session.loggedUserId;
        const favorites = getFavoritesByUser(userId);

        res.render('my-favorites', { title: 'Favorites', favorites: favorites, numOfFavorites: favorites.length, oneFavorite: favorites.length === 1});
    } catch (error) {
        next(error);
        // console.error('Error showing favorites:', error);
        // res.status(500).json({ message: 'Error showing favorites' });
    }
}

// Create a new inquiry
export const createInquiryHandler = (req, res, next) => {
    try {
        const message = req.body.message;
        const propertyId = parseInt(req.params.propertyId);
        const fromId = req.session.loggedUserId;

        const inquiryId = createInquiry({ fromId, propertyId, message });
        res.redirect(`/property/${propertyId}`);
    } catch (error) {
        next(error);
        // console.error('Error creating inquiry:', error);
        // res.status(500).json({ message: 'Error creating inquiry' });
    }
};


export const showUserInquiriesHandler = (req, res, next) => {
    const userId = req.session.loggedUserId;
    
    try {
        
        let inquiries = getInquiriesForUser(userId);
        let senders = inquiries.map(inquiry => findUserByID(inquiry.fromId))
        let properties = inquiries.map(inquiry => getPropertyFromID(inquiry.propertyId));
        let extendedInquiries = inquiries.map((item, index) => {
            return {...item, ...senders[index],...properties[index]};
        });
        console.log('Inquiries:', extendedInquiries);
        res.render('my-inquiries', { title: 'My Inquiries', inquiries: extendedInquiries});

    } catch (error) {
        next(error);
        // console.error('Error loading my inquiries page:', error);
        // res.status(500).json({ message: 'Error loading my inquiries page' });
    }

}

