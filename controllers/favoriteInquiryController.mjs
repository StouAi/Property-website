import { createFavorite, getFavoritesByUser } from '../models/favorites.mjs';


// Add a favorite
export const addFavoriteHandler = (req, res) => {
    try {
        const { userId, propertyId } = req.body;
        const favoriteId = createFavorite(userId, propertyId);
        res.redirect(`/property/${propertyId}`)
        // res.json({ success: true, message: 'Favorite added.', favoriteId });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding favorite' });
    }
};

export const showFavoritesHandler = (req, res) => {
    try {
        const userId = req.session.userId;
        const favorites = getFavoritesByUser(userId);
        res.render('favorites', { title: 'Favorites', favorites });
    } catch (error) {
        console.error('Error showing favorites:', error);
        res.status(500).json({ message: 'Error showing favorites' });
    }
}


// Create a new inquiry
export const createInquiryHandler = (req, res) => {
    try {
        const message = req.body.message;
        const propertyId = parseInt(req.body.propertyId);
        const fromId = parseInt(req.body.fromId);

        const inquiryId = createInquiry({ fromId, propertyId, message });
        res.json({ success: true, message: 'Inquiry created.', inquiryId });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ message: 'Error creating inquiry' });
    }
};