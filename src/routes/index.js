const express = require('express');
const router = express.Router();
const ApiRoutes = require('./api');

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/profile', (req, res) => {
    res.render('profile');
});
router.get('/shop', (req, res) => {
    res.render('shop');
});
router.get('/cart', (req, res) => {
    res.render('cart');
});
router.get('/admin', (req, res) => {
    res.render('admin');
});

router.use('/api', ApiRoutes);

module.exports = router;
