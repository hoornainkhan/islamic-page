const passport = require('passport');
const Admin = require('../models/AdminModel');

// Serialize Admin (convert Admin object to an ID)
passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

// Deserialize Admin (convert ID to an Admin object)
passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
        done(err, admin);
    });
});

module.exports = passport;
