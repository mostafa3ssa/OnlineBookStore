const express = require('express');
const { registerUser, loginUser, openLoginPage, openRegisterPage, viewUserProfile } = require('../controllers/user');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('register', openRegisterPage);

router.get('/login', openLoginPage);

router.get('/profile/:id', viewUserProfile);

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/user/login'); 
    });
});

module.exports = router;
