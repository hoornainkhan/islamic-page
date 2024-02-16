// middleware.js
const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login'); // Redirect to login page if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user information to request
    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/login'); // Redirect to login page for invalid token
  }
};

module.exports = isLoggedIn;


