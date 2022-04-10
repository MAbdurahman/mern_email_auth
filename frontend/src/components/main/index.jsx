import styles from './styles.module.css';

export default function Main() {
	const handleSignOut = () => {
		localStorage.removeItem('token');
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Website</h1>
				<button className={styles.white_btn} onClick={handleSignOut}>
					Logout
				</button>
			</nav>
		</div>
	);
}
