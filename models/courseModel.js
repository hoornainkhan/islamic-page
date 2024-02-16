const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    image:{
        type: String,
    },
    description:{
        type: String,
        required: true
    }
  
})
const courses = mongoose.model('courses', courseSchema);
module.exports= courses;
