const router = require('express').Router();
const passport = require('passport');
const generatePassword = require('../utils/utils').generatePassword;
const User = require('../config/database').models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

router.post('/register', async (req, res) => {
	if (!req.body.username || !req.body.password) {
		// missing required fields
		res.redirect('/register');
	} else if (await User.findOne({ username: req.body.username }) !== null) {
		// user already exists in database
		res.redirect('/login');
	} else {
		const { hash, salt } = generatePassword(req.body.password);
		const newUser = new User({
			username: req.body.username,
			hash: hash,
			salt: salt,
			admin: true
		});
		newUser.save().then((user) => {
            console.log(user);
        });
		res.redirect('/login');
	}
});

router.get('/register', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/register.html');
});

router.get('/login', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/login.html');
});

router.get('/', (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/pre.html');
});

router.get('/dashboard', isAuth, (req, res) => {
	res.sendFile(__dirname.substring(0, __dirname.lastIndexOf('/')) + '/static/success.html');
});

router.get('/auth-route', isAuth, (req, res) => {
	res.send('<div>Auth only route <a href="/logout">Logout</a></div>');
});

router.get('/admin-route', isAdmin, (req, res) => {
	res.send('<div>Admin only route</div>');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

router.get('/login-success', (req, res) => {
	res.redirect('/dashboard');
});

router.get('/login-failure', (req, res) => {
	res.redirect('login');
});

module.exports = router;