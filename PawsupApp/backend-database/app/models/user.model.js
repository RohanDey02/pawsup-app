module.exports = mongoose => {
	const User = mongoose.model(
		"users",
		mongoose.Schema(
			{
				username: String,
				password: String,
				email: String,
				fullname: String,
				dateofbirth: String,
				phonenumber: String,
				accounttype: String,
				pettype: String
			},
			{ timestamps: true }
		)
	);

	return User;
};