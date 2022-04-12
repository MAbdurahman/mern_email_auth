import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImage from './../img/not-found.svg';
import styles from './styles.module.css';

export default function NotFound() {
	return (
		<div className={styles.main}>
			<div className={styles.wrapper}>
				<img
					src={NotFoundImage}
					className={styles.not_found_image}
					alt='not found'
				/>
				<h3>Ugh oh! Page Not Found</h3>
				<h4>We Cannot Find That Page</h4>
				<Link to='/sign-in'>
					<button className={styles.green_btn}>Sign In</button>
				</Link>
			</div>
		</div>
	);
}
