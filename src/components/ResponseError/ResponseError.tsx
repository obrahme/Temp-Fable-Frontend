import React from 'react';
import { ResponseErrorProps } from './types';
import styles from './ResponseError.module.sass';
import { GoAlert } from 'react-icons/all';

const ResponseError = ({ text }: ResponseErrorProps) => {
	return (
		<div className={styles.wrapper}>
			<GoAlert className={styles.icon} />
			<p className={styles.text}>{text}</p>
		</div>
	);
};

export default ResponseError;
