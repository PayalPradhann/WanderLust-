// creating model for listing purpose 
// after its creation we will export it to app.js

// aquire mongoose
const mongoose = require("mongoose");
const review = require("./review");
// schema creation
const Schema = mongoose.Schema;

// schema defining 
let listingSchema = new Schema({
    title :
    { 
        type : String,
        required: true,
    },
    description : String,
    image : { 
        url: String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref : "User",
    },
});

// 
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in : listing.reviews }});
    }
});

// model creation of the defined schema
const Listing = mongoose.model("Listing",listingSchema);
// exporting the module to app.js
module.exports = Listing;