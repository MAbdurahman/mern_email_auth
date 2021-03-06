import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export default function SignUp() {
	//**************** variables ****************//
	const [data, setData] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [msg, setMsg] = useState('');

	//**************** functions ****************//
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const url = `${process.env.REACT_APP_SERVER_URL}/api/v1/users/sign-up`;
			const { data: res } = await axios.post(url, data);
			setMsg(res.message);
			setTimeout(() => {
				setMsg('');
			},5000)
			
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
				setTimeout(() => {
					setError('');
				}, 5000)
			}
		}
	
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h2>Welcome Back !</h2>
					<Link to='/sign-in'>
						<button type='button' className={styles.white_btn}>
							Sign In
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h2>Sign Up</h2>
						<input
							type='text'
							placeholder='Name'
							name='name'
							onChange={handleChange}
							value={data.name}
							required
							className={styles.input}
						/>

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
						{msg && <div className={styles.success_msg}>{msg}</div>}
						<button type='submit' className={styles.green_btn}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
