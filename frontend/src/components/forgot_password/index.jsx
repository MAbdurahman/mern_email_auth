import { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

export default function ForgotPassword() {
	//**************** variables ****************//
	const [email, setEmail] = useState('');
	const [msg, setMsg] = useState('');
	const [error, setError] = useState('');

	//**************** functions ****************//
	const handleSubmit = async e => {
		e.preventDefault();
		try {
			// const url = `http://localhost:8080/api/password-reset`;
			const url = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/send-password-link`;
			const { data } = await axios.post(url, { email });
			setMsg(data.message);
			setError('');
			setTimeout(() => {
				setMsg('');
			}, 5000);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
				setMsg('');
				setTimeout(() => {
					setError('');
				}, 5000);
			}
		}
	};
	return (
		<div className={styles.container}>
			<form className={styles.form_container} onSubmit={handleSubmit}>
				<h1>Forgot Password</h1>
				<input
					type='email'
					placeholder='Email'
					name='email'
					onChange={e => setEmail(e.target.value)}
					value={email}
					required
					className={styles.input}
				/>
				{error && <div className={styles.error_msg}>{error}</div>}
				{msg && <div className={styles.success_msg}>{msg}</div>}
				<button type='submit' className={styles.green_btn}>
					Submit
				</button>
			</form>
		</div>
	);
}
