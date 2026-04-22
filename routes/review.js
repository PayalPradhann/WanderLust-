const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");

//Aquiring listing controller
const listingController = require("../controllers/review.js");

//Review 
// post route
router.post("/",isLoggedIn ,validateReview,wrapAsync(listingController.createReview));
   
// delete route for reviews
router.delete("/:reviewId",isLoggedIn ,isReviewAuthor, wrapAsync(listingController.deleteReview));

   module.exports = router;