const morgan = require('morgan');
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const tourRouter = require('./routes/tourRouters');
const globalErrorHandler = require('./contoroller/errorController');
const AppError = require('./utilits/appError');
const userRouter = require('./routes/userRouters');
const viewRouters = require('./routes/viewRouters');
const bookingRoutes = require('./routes/bookingRoutes');

//const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 4;

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use(express.json());

// Set security HTTP headers
// app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100kb' }));
// cookie parser
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['fee', 'name']
  })
);
app.use((req, res, next) => {
  req.reqAt = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
app.use(compression());
// ROUTES
app.use('/', viewRouters);
app.use('/api/v1/tournaments', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/booking', bookingRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
