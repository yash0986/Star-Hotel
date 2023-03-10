const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
const Schema= mongoose.Schema;

const reviewSchema = new Schema ({
    body: String,
    rating : Number,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports= mongoose.model("Review", reviewSchema);