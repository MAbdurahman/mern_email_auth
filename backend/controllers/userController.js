const User = require('../models/userModel');
const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');



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
/*===============================================================
      VerifyUser(GET) -> api/v1/users/:id/verify-user/:token
==================================================================*/