import React, {useEffect, useState } from 'react';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.sass';
import Logo from '../../assets/fable-icon.png';
import { useWallet, WalletConnectButton } from '@sei-js/react';
import { toFableBalance, withCommas } from '../../utils';
import { FABLE_TOKEN_DENOM } from '../../config';

const Header = () => {
	const location = useLocation();
	const [fableBalance, setFableBalance] = useState<string>();

	const { restUrl, accounts } = useWallet();

	const links: { route: string; title: string }[] = [
		{ route: '/', title: 'Teams' },
		{ route: '/schedule', title: 'Schedule' },
		{ route: '/leaderboard', title: 'Leaderboard' }
	];

	const getFableBalance = async () => {
		try {
			if (!restUrl || !accounts?.[0]?.address) return;
			const rawResponse = await fetch(`${restUrl}/cosmos/bank/v1beta1/balances/${accounts[0].address}/by_denom?denom=${FABLE_TOKEN_DENOM}`);
			const balanceResponse = await rawResponse.json();
			return balanceResponse?.balance?.amount;
		} catch (e) {
			return;
		}
	};

	useEffect(() => {
		getFableBalance().then(setFableBalance);
	}, [accounts?.[0]?.address]);

	return (
		<div className={styles.header}>
			<div className={styles.center}>
				<img alt='fable' src={Logo} className={styles.logo} />
				{links.map((link) => {
					let isLinkActive = location.pathname.startsWith(link.route);
					if (link.route === '/' && location.pathname !== '/') isLinkActive = false;
					return (
						<Link key={link.route} className={cn(styles.link, { [styles.linkActive]: isLinkActive })} to={link.route}>
							{link.title}
						</Link>
					);
				})}
			</div>
			<div className={styles.center}>	
					<div>Balance: {fableBalance ? withCommas(toFableBalance(fableBalance)) : '0' } $FABLE</div>
					<WalletConnectButton />
			</div>
		</div>
	);
};

export default Header;
