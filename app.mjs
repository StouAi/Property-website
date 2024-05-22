import express from 'express';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import routes from './routes.mjs'
import { connectDB } from './config/db.mjs';
import session from './middleware/sessionMiddleware.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Create the express appb
const app = express();

// Set the view engine to use the 'handlebars' template engine
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './views/layouts',
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Database connection
connectDB();


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Middlewares
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
app.use(express.json());
app.use(session);
app.use((req, res, next) => {
    if (req.session) {
        res.locals.userId = req.session.loggedUserId;
     } else {
        res.locals.userId = 'επισκέπτης';
     }
     next();
});
app.use('/', routes);

export default app;
