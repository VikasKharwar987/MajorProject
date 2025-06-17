const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewContoller = require("../controllers/review.js");

//Review
//post Review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewContoller.createReview))

//Review Delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,  wrapAsync(reviewContoller.destroyReview))

module.exports = router;