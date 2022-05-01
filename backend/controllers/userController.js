const User = require('../models/userModel');
const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
const filterObject = require('../utils/filterObject');



/*===============================================================
      getAllUsers(GET) -> api/v1/users/
==================================================================*/
exports.getAllUsers = catchAsyncHandler(async (req, res, next) => {
	const users = await User.find({});

	//**************** send response ****************//
	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
}); 
	
/*===============================================================
      createUser(POST) -> api/v1/users/
==================================================================*/
exports.createUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
}
/*===============================================================
      getSingleUser(GET) -> api/v1/users/:id
==================================================================*/
exports.getSingleUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
}
/*===============================================================
      updateUser(PATCH) -> api/v1/users/:id
==================================================================*/
exports.updateUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
};
/*===============================================================
      deleteUser(DELETE) -> api/v1/users/:id
==================================================================*/
exports.deleteUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
};
/*==================================================================
      updateMyProfile(PATCH) -> api/v1/users/update-my-profile 
=====================================================================*/
exports.updateMyProfile = catchAsyncHandler(async (req, res, next) => {
	//**************** if user post password data, app error ****************//
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppErrorHandler(
				'Password update not allowed! Use forgot or reset password!',
				400
			)
		);
	}

	//**************** filter out field names to be updated ****************//
	const filteredBody = filterObject(req.body, 'name', 'email');

	//**************** update user document ****************//
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});
	//**************** send response ****************//
	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
})
/*===========================================================================
      deleteMyProfile -> api/v1/users/delete-my-profile
==============================================================================*/
exports.deleteMyProfile = catchAsyncHandler(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
/*===============================================================
      
==================================================================*/