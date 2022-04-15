import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';
import NotFound from './../not_found';

export default function ResetPassword() {
	//**************** variables ****************//
	const [validUrl, setValidUrl] = useState(false);
	const [password, setPassword] = useState('');
	const [msg, setMsg] = useState('');
	const [error, setError] = useState('');
	const param = useParams();
	// const url = `http://localhost:8080/api/password-reset/${param.id}/${param.token}`;
  const url = `${process.env.REACT_APP_SERVER_URL}/auth/reset-password/${param.id}/${param.token}`;

	//**************** functions ****************//
	useEffect(() => {
		const verifyUrl = async () => {
			try {
				await axios.get(url);
				setValidUrl(true);
			} catch (error) {
				setValidUrl(false);
			}
		};
		verifyUrl();
	}, [param, url]);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const { data } = await axios.post(url, { password });
			setMsg(data.message);
			setError('');
			setTimeout(() => {
				setMsg('');
        window.location = '/sign-in';
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
		<>
			{validUrl ? (
				<div className={styles.container}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Reset Password</h1>
						<input
							type='password'
							placeholder='Password'
							name='password'
							onChange={e => setPassword(e.target.value)}
							value={password}
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
			) : (
				<NotFound />
			)}
		</>
	);
}
