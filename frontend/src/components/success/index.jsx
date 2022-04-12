import React from 'react';
import { Link } from 'react-router-dom';
import SuccessImage from './../../img/success.svg';
import styles from './styles.module.css';

export default function Success() {
	return (
		<div className={styles.main}>
			<div className={styles.wrapper}>
				<img
					src={SuccessImage}
					className={styles.not_found_image}
					alt='success_img'
				/>
				<h3>Email Verified Successfully</h3>
				<h4>Click button to Sign In</h4>
				<Link to='/sign-in'>
					<button className={styles.green_btn}>Sign In</button>
				</Link>
			</div>
		</div>
	);
}
