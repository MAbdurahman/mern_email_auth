import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
/* import success from './../../img/check-mark.png';
import styles from './styles.module.css'; */
import NotFound from './../not_found';
import Success from './../success';

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
					<Success />
				) : (
					<NotFound />
				)}
			</>
		);
}
