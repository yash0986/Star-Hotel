const express= require('express');

const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {validateReview,isLoggedIn,isReviewAuthor}= require('../middleware');

const Hotel = require('../models/hotel');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

router.post('/',isLoggedIn, validateReview ,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports= router;