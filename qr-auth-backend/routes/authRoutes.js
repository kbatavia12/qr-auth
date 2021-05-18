const express = require('express');
const { postLogin, postSignup } = require('../controller/authController');
const { Router } = express;
const router = Router();


router.post('/login', postLogin);
router.post('/signup', postSignup);

module.exports = router;