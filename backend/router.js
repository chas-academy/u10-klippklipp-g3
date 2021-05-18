/**
 * API router
 *
 * v.0.0.1 July 2018
 */
const Auth = require('./auth/auth');
const passport = require('passport');

// create authenticate middleware,
// using passport jwt strategy,
// no session support (cookies session use by passport)
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

// other middlewares
// const checkAuthenticated = (req, res, next) => {
// 	// User is authenticated and logged in
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	// User should login
// 	res.redirect('http://localhost/login');
// };
// // Middleware for logged in users
// const checkNotAuthenticated = (req, res, next) => {
// 	// User is authenticated and logged in
// 	if (req.isAuthenticated()) {
// 		return res.redirect('http://localhost');
// 	}

// 	next();
// };

module.exports = (api) => {
	// api.get('/', checkAuthenticated, (req, res) => {
	// 	res.send('I am OK');
	// });

	api.get('/', (req, res) => {
		res.send('I am OK');
	});

	api.post('/signup', Auth.signup);

	api.post('/signin', requireSignin, Auth.sigin);

	api.get('/users', requireAuth, Auth.user);

	api.get('/users/:id', requireAuth, Auth.user);
};
