const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encrypt = require('../auth/hash');
const bcrypt = require('bcryptjs');

//define use model
const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
	},
	password: String,
});

/**
 * mongoDB custom function on Save Hook,
 * Encrypt password using bcrypt
 * note! we need to use function keywoard to
 * get user object from this context
 * DO NOT USE arrow function (you know why!)
 */
userSchema.pre('save', function (next) {
	//use function to have this context
	//to be a instace of a user model
	//note! do not use arrow fn
	const user = this;

	//encrypt the password before saving
	encrypt.hashPass(user.password).then(
		(hash) => {
			user.password = hash;
			next();
		},
		(err) => {
			//return error
			return next(err);
		},
	);
});

/**
 * mongoDB custom methods/functions
 * these methods are available on each record (object) accessed
 * NOTE! we need to use function keywoard to preserve the context
 * of this keywoard (so do not use arrow function)
 */

/**
 * Compare password provided by user and the one saved and hashed
 * in mongoDB. Because this method is part of the schema we have
 * direct access to saved (hashed) user password. Then we use
 * bcrypt method to compare provided pass with saved (hashed) pass
 */
userSchema.methods.comparePassword = function (providedPassword, next) {
	// let bcrypt compare the passwords
	bcrypt.compare(providedPassword, this.password, (err, isMatch) => {
		//reject with error
		if (err) {
			next(err);
		}
		//otherwise resolve
		next(null, isMatch);
	});
};

//create model class
const userModel = mongoose.model('user', userSchema);
const getUserById = (id, callback) => {
	userModel.findById(id, callback);
};
const getUserByEmail = (email, callback) => {
	userModel.findOne({ email: email }, callback);
};
const createUser = (user, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err) => {
			if (err) {
				throw err;
			}
			user.password = hash;
			user.save(callback);
		});
	});
};
const comparePassword = (password, hash, callback) => {
	bcrypt.compare(password, hash, (err, isMatch) => {
		if (err) {
			throw err;
		}
		callback(null, isMatch);
	});
};

//export model class
module.exports = userModel;
// module.exports = {
// 	userModel,
// 	getUserById,
// 	getUserByEmail,
// 	createUser,
// 	comparePassword,
// };