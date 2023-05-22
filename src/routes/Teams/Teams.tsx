import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { SubDao } from './types';
import styles from './Teams.module.sass';
import { Header, Wrapper } from '../../layout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { allTeamsAtom } from '../../recoil/atoms/teams';
import { UITeam } from './components';
import { FableTeam } from '../../types';
import { useWallet, useCosmWasmClient } from '@sei-js/react';
import { ResponseError, TabSelect } from '../../components';
import { DAO_CORE_CONTRACT_ADDRESS, STAKING_VOTING_CONTRACT_ADDRESS } from '../../config';
import { truncateAddress, toFableBalance, withCommas } from '../../utils';

type StakeDetail = { balance: string; team: string };

const TABS = [
	{ title: 'all teams', value: 'allTeams' },
	{ title: 'my teams', value: 'myTeams' }
];

const Teams = () => {
	const { accounts } = useWallet();
	const { cosmWasmClient } = useCosmWasmClient();

	const teams = useRecoilValue(allTeamsAtom);
	const [isError, setIsError] = useState<boolean>(false);

	const [totalStaked, setTotalStaked] = useState<number>(0);
	const [selectedTab, setSelectedTab] = useState<string>(TABS[0].value);
	const [stakingDetails, setStakingDetails] = useState<StakeDetail[]>();

	useEffect(() => {
		const fetchUserStakes = async () => {
			if (!accounts?.[0]?.address || !cosmWasmClient) return;
			const connectedWalletStakes = await cosmWasmClient.queryContractSmart(STAKING_VOTING_CONTRACT_ADDRESS, {
				staker: { address: accounts[0].address }
			});

			if (connectedWalletStakes.staker) {
				setStakingDetails([{ team: connectedWalletStakes.staker.team, balance: connectedWalletStakes.staker.balance }]);
			}
		};
		fetchUserStakes().then();
	}, [cosmWasmClient, accounts?.[0]?.address]);

	const getData = async () => {
		try {
			const totalPower = await cosmWasmClient?.queryContractSmart(DAO_CORE_CONTRACT_ADDRESS, { total_power_at_height: {} });
			setTotalStaked(parseInt(totalPower.power));
		} catch (e: any) {
			console.error('Error fetching teams', e.message);
			setIsError(true);
		}
	};

	useEffect(() => {
		if (cosmWasmClient) getData().then();
	}, [cosmWasmClient]);

	const renderTabsIfNecessary = () => {
		if (accounts?.[0]?.address) {
			return (
				<>
					<div className={styles.separator} />
					<TabSelect tabs={TABS} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
				</>
			);
		}
	};

	const renderSectionHeader = () => {
		if (selectedTab === 'allTeams') {
			return (
				<p className={styles.stakedTotal}>
					Total staked: <span className={styles.stakedValue}>{withCommas(toFableBalance(totalStaked.toString()))} $FABLE</span>
				</p>
			);
		} else if (selectedTab === 'myTeams' && stakingDetails?.[0]) {
			return (
				<>
					<p className={styles.stakedTotal}>
						My stake: <span className={styles.stakedValue}>{withCommas(toFableBalance(stakingDetails[0].balance))} $FABLE</span>
					</p>
					<div className={styles.separator} />
					<div className={styles.row}>
						<p className={styles.label}>team</p>
						<p className={styles.label}>$FABLE staked</p>
					</div>
				</>
			);
		}
	};

	const renderTeams = () => {
		if (isError) {
			return <ResponseError text='Error fetching teams' />;
		}

		if (!teams) {
			return <Skeleton containerClassName={styles.skeletonContainer} className={styles.skeletonItem} count={5} baseColor='#f1f1f101' highlightColor='#f1f1f111' />;
		}

		if (selectedTab === 'allTeams') {
			return teams.map((team) => <UITeam key={team.address} team={team} />);
		}

		if (stakingDetails?.length === 0) {
			return (
				<div className={styles.row}>
					<p>You have not joined any teams...</p>
				</div>
			);
		}

		return stakingDetails?.map((team) => (
			<div className={styles.row}>
				<Link to={`/team/${team.team}`} className={styles.link}>
					{truncateAddress(team.team)}
				</Link>
				<p className={styles.stakeAmount}>{withCommas(toFableBalance(team.balance))}</p>
			</div>
		));
	};

	return (
		<Wrapper>
			<Header />
			<div className={styles.content}>
				<h1 className={styles.title}>Fable Teams</h1>
				<div className={styles.tabInfo}>
					{renderTabsIfNecessary()}
					{renderSectionHeader()}
					<div className={styles.separator} />
				</div>
				<div className={styles.teams}>{renderTeams()}</div>
			</div>
		</Wrapper>
	);
};

export default Teams;
