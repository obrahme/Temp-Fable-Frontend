import React from 'react';
import { UITeamProps } from './types';
import styles from './UITeam.module.sass';
import { useNavigate } from 'react-router';
import { truncateAddress } from '../../../../utils';

const UITeam = ({ team }: UITeamProps) => {
	const navigate = useNavigate();

	const { charter, address, stake } = team;

	return (
		<div key={address} className={styles.wrapper} onClick={() => navigate(`/team/${address}`)}>
			{charter && <h1 className={styles.teamName}>{charter}</h1>}
			<h3 className={styles.teamAddress}>{truncateAddress(address)}</h3>
			{stake && <p>{stake}</p>}
		</div>
	);
};

export default UITeam;
