const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewform = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListings = async (req,res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id; 
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listings Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListings = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings});   
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    } 
    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.showcategory = async (req, res) => {
    const { category } = req.params;
    const categoryListing = await Listing.find({ category: category });
    if (!categoryListing || categoryListing.length === 0) {
        req.flash("error", "No listings found for this category!");
        return res.redirect("/listings");
    }

    res.render("listings/category.ejs", { categoryListing });
};

module.exports.search = async(req,res) => {
    let location = req.query.location;
    if (!location || location.trim() === "") {
        return res.redirect("/listings");
    }
    let updatedLocation = location.toLowerCase().trim();

    let search = await Listing.find({
        $or: [
            { location: { $regex: "^" + updatedLocation, $options: "i" } },
            { country: { $regex: "^" + updatedLocation, $options: "i" } }
        ]
});

     if(search.length > 0){
        res.render("listings/search.ejs", { search, query: location });
     }
     else{
        req.flash("error", "No listings found for this location!");
        return res.redirect("/listings");
     }
}

module.exports.reservepage = async(req,res) => {
    let {id} = req.params;
    let {username, email} = req.body
    let finding = await Listing.findById(id).populate("owner");
    if (!finding) {
        req.flash("error", "Nothing to reserve");
        return res.redirect(`/listings/${id}`);
    }
    res.render("listings/reserve.ejs", { listing: finding, username, email });
}