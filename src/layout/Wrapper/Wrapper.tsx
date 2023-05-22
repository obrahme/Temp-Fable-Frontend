import React from 'react';
import { ToastContainer } from 'react-toastify';
import styles from './Wrapper.module.sass';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className={styles.wrapper}>
			{children}
			<ToastContainer />
		</div>
	);
};

export default Wrapper;
