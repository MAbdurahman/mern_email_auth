import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import success from './../../img/check-mark.png';
import styles from './styles.module.css';
import NotFound from './../../not_found';

export default function EmailVerify() {
		const [validUrl, setValidUrl] = useState(true);
		const param = useParams();

		useEffect(() => {
			const verifyEmailUrl = async () => {
				try {
					const url = `${process.env.REACT_APP_SERVER_URL}/api/v1/users/${param.id}/verify-user/${param.token}`;
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
						<h1>Email Verified Successfully</h1>
						<Link to='/sign-in'>
							<button className={styles.green_btn}>Sign In</button>
						</Link>
					</div>
				) : (
					<NotFound />
				)}
			</>
		);
}
