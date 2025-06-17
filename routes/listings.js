const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingContoller = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync (listingContoller.index))
    .post(isLoggedIn, upload.single('listings[image]'),validateListing,  wrapAsync(listingContoller.createListings))

router.get("/new", isLoggedIn ,listingContoller.renderNewform);

router.route("/:id")
    .get(wrapAsync (listingContoller.showListings))
    .put(isLoggedIn, isOwner, upload.single('listings[image]'),  validateListing,  wrapAsync (listingContoller.updateListings))
    .delete(isLoggedIn, isOwner ,wrapAsync (listingContoller.destroyListings))

router.get('/category/:category', wrapAsync(listingContoller.showcategory));

router.get("/searching/search", wrapAsync(listingContoller.search));

router.route("/:id/reserve")
    .get(wrapAsync (listingContoller.reservepage))


//edit route
router.get("/:id/edit", isLoggedIn ,wrapAsync (listingContoller.renderEditForm))

module.exports = router;