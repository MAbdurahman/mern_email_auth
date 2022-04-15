import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './../components/main';
import SignUp from './../components/sign_up';
import SignIn from './../components/sign_in';
import EmailVerify from './../components/email_verify';
import ForgotPassword from './../components/forgot_password';
import ResetPassword from './../components/reset_password';

export default function App() {
	const user = localStorage.getItem('token');

	return (
		<Routes>
			{user && <Route path='/' exact element={<Main />} />}
			<Route path='/sign-up' exact element={<SignUp />} />
			<Route path='/sign-in' exact element={<SignIn />} />
			<Route path='/' element={<Navigate replace to='/sign-in' />} />
			<Route
				path='/users/:id/verify-user/:token'
				element={<EmailVerify />}
			/>
			<Route path='/forgot-password' element={<ForgotPassword />} />
			<Route path='/reset-password/:id/:token' element={<ResetPassword />} />
		</Routes>
	);
}
