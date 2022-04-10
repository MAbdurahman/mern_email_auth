import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import success from './../../img/check-mark.png';
import styles from './styles.module.css';

export default function EmailVerify() {
		const [validUrl, setValidUrl] = useState(true);
		const param = useParams();

		useEffect(() => {
			const verifyEmailUrl = async () => {
				try {
					const url = `http://localhost:5000/api/v1/users/${param.id}/verify-user/${param.token}`;
					const { data } = await axios.get(url);
					console.log(data);
					setValidUrl(true);
				} catch (error) {
					console.log(error);
					setValidUrl(false);
				}
			};
			verifyEmailUrl();
		}, [param]);

		return (
			<>
				{validUrl ? (
					<div className={styles.container}>
						<img
							src={success}
							alt='success_img'
							className={styles.success_img}
						/>
						<h1>Email verified successfully</h1>
						<Link to='/login'>
							<button className={styles.green_btn}>Login</button>
						</Link>
					</div>
				) : (
					<h1>404 Not Found</h1>
				)}
			</>
		);
}
