const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const PublicationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    pdf: {
        type: String,
        required: true
    },
});
const Publications = mongoose.model('Publications', PublicationSchema);
module.exports= Publications;