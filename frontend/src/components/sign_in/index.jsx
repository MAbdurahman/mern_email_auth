import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export default function SignIn() {
	const [data, setData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const url = `${process.env.REACT_APP_SERVER_URL}/api/v1/users/:id/verify-user/:token`;
			const { data: res } = await axios.post(url, data);
			localStorage.setItem('token', res.data);
			window.location = '/';
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Sign In</h1>
						<input
							type='email'
							placeholder='Email'
							name='email'
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type='password'
							placeholder='Password'
							name='password'
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type='submit' className={styles.green_btn}>
							Sign In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h2>Have not Signed Up?</h2>
					<Link to='/sign-up'>
						<button type='button' className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
