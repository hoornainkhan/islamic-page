const express = require('express');
const router = express.Router();


const isLoggedIn = require('../middleware/authenticateToken');

const { registerAdmin , loginAdmin , getRegister , getLogin , logoutAdmin } = require('../controllers/AdminControllers')

router.post('/Darul_Hikmah_Academy_AdminRegister', registerAdmin);

router.post('/Darul_Hikmah_Academy_AdminLogin', loginAdmin);

router.get('/Darul_Hikmah_Academy_AdminRegister' , getRegister);

router.get('/Darul_Hikmah_Academy_AdminLogin' , getLogin);

router.get('/Darul_Hikmah_Academy_AdminLogout' , isLoggedIn ,  logoutAdmin);

module.exports = router;


