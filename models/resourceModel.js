const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const ResourceSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
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
const Resources = mongoose.model('Resources', ResourceSchema);
module.exports= Resources;