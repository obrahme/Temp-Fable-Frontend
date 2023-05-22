import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useCosmWasmClient } from '@sei-js/react';
import styles from './Leaderboard.module.sass';
import { Header, Wrapper } from '../../layout';
import { truncateAddress, getFableTeamFromSubDao } from '../../utils';
import { LEADERBOARD_CONTRACT_ADDRESS, DAO_CORE_CONTRACT_ADDRESS } from '../../config';
import { TeamStat } from './types';
import { ResponseError } from '../../components';
import { SubDao } from '../../routes/Teams/types';


const Leaderboard = () => {
	const { cosmWasmClient } = useCosmWasmClient();

	const [teamStats, setTeamStats] = useState<TeamStat[]>();
	const [isError, setIsError] = useState<boolean>(false);

	useEffect(() => {
		const getLeaderboard = async () => {
			try {
				if (!cosmWasmClient) return;
				const gameResults = await cosmWasmClient.queryContractSmart(LEADERBOARD_CONTRACT_ADDRESS, { game_results: {} });

				const subDaos: SubDao[] = await cosmWasmClient?.queryContractSmart(DAO_CORE_CONTRACT_ADDRESS, { list_sub_daos: {} });
				const teams = subDaos.map((subDao) => getFableTeamFromSubDao(subDao));

				let finalLeaderboard: { [teamName: string]: number } = {};

				// for each game in the game results
				for (let gameResult of gameResults.game_results) {
					gameResult.team_addrs.forEach((addr: any, index: number) => {
						finalLeaderboard[addr] = (finalLeaderboard[addr] || 0) + parseInt(gameResult.team_scores[index])
					});
				}

				const teamStats: TeamStat[] = teams.map(team => {
					return {
						name: team.charter!,
						addr: team.address, 
						point: finalLeaderboard[team.address].toString()
					}
				})

				// list of team stats with team addr and team points
				setTeamStats(teamStats);
				setIsError(false);
			} catch (e: any) {
				console.error('Error fetching leaderboard', e.message);
				setIsError(true);
			}
		};

		if (cosmWasmClient) getLeaderboard().then();
	}, [cosmWasmClient]);

	const renderScores = () => {
		if (isError) return <ResponseError text='Error fetching leaderboard' />;

		if (!teamStats) return <Skeleton containerClassName={styles.skeletonContainer} count={5} height={36} baseColor='#f1f1f101' highlightColor='#f1f1f111' />;

		const sortedTeamStats = teamStats.sort((a, b) => parseInt(b.point) - parseInt(a.point));

		return sortedTeamStats.map((team) => {
			return (
				<div key={team.addr} className={styles.row}>
					<Link className={styles.address} to={`/team/${team.addr}`}>
						{team.name}
					</Link>
					<p className={styles.points}>{team.point}</p>
				</div>
			);
		});
	};

	return (
		<Wrapper>
			<Header />
			<div className={styles.content}>
				<div className={styles.leaderboard}>
					<h1 className={styles.title}>Leaderboard</h1>
					<div>
						<hr className={styles.separator} />
						<div className={styles.row}>
							<p className={styles.label}>team</p>
							<p className={styles.label}>points</p>
						</div>
						<hr className={styles.separator} />
					</div>
					{renderScores()}
				</div>
			</div>
		</Wrapper>
	);
};

export default Leaderboard;
