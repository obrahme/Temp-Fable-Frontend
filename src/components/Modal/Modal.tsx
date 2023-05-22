import React from 'react';
import { ModalProps } from './types';
import styles from './Modal.module.sass';
import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ children, closeModal, title }: ModalProps) => {
	return (
		<div className={styles.modalBackground}>
			<div className={styles.modalCard}>
				<div className={styles.header}>
					<div className={styles.modalClose} onClick={closeModal}>
						<HiOutlineX />
					</div>
					{title && <p className={styles.title}>{title}</p>}
				</div>
				{children}
			</div>
		</div>
	);
};

export default Modal;
