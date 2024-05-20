import express from 'express';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import routes from './routes.mjs'
import { connectDB } from './config/db.mjs';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Create the express app
const app = express();

// Set the view engine to use the 'handlebars' template engine
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './views/layouts',
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Database connection
connectDB();

// // Add a middleware to set the userId in the locals object
// app.use((req, res, next) => {
//     res.locals.userId = "mitsos";
//     next();
// })

// Routes
app.use('/', routes);


export default app;
