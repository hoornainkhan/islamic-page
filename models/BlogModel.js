const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    sections: [{
        subheading: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],

    image: {
        type: String,
        required: true
    },

},
    { timestamps: true });

const blogs = mongoose.model('blogs', blogSchema);

module.exports = blogs;