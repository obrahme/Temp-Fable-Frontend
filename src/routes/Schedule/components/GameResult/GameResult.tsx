import React, { useEffect, useState } from 'react';
import { GameResultProps, GameResultResponse } from './types';
import { Modal } from '../../../../components/Modal';
import { useCosmWasmClient } from '@sei-js/react';
import { LEADERBOARD_CONTRACT_ADDRESS } from '../../../../config';
import { truncateAddress } from '../../../../utils';
import styles from './GameResult.module.sass';
import cn from 'classnames';
import Skeleton from 'react-loading-skeleton';

const GameResult = ({ gameResultId, closeModal }: GameResultProps) => {
	const { cosmWasmClient } = useCosmWasmClient();

	const [gameResult, setGameResult] = useState<GameResultResponse>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchGameResult = async () => {
		try {
			setIsLoading(true);
			return cosmWasmClient?.queryContractSmart(LEADERBOARD_CONTRACT_ADDRESS, { game_result_by_id: { id: gameResultId } });
		} catch (e: any) {
			console.error('Error fetching game result.', e.message);
			setIsLoading(false);
			return;
		}
	};

	useEffect(() => {
		if (cosmWasmClient)
			fetchGameResult().then((gameResult) => {
				setGameResult(gameResult);
				setIsLoading(false);
			});
	}, [cosmWasmClient]);

	const LoadingComponent = <Skeleton containerClassName={styles.skeletonContainer} count={3} height={23} baseColor='#f1f1f101' highlightColor='#f1f1f111' />;

	const renderTeamAddresses = () => {
		if (isLoading) return LoadingComponent;

		return gameResult?.team_addrs.map((addr) => (
			<a href={`/team/${addr}`} className={cn(styles.link, { [styles.winner]: gameResult?.winner === addr })}>
				{truncateAddress(addr)}
			</a>
		));
	};

	const renderTeamScores = () => {
		if (isLoading) return LoadingComponent;

		return gameResult?.team_scores.map((score) => <p className={styles.score}>{score}</p>);
	};

	return (
		<Modal closeModal={closeModal} title={`Game ${gameResultId} result`}>
			<div className={styles.table}>
				<div className={styles.column}>
					<p className={styles.label}>Address</p>
					{renderTeamAddresses()}
				</div>
				<div className={styles.column}>
					<p className={styles.label}>Score</p>
					{renderTeamScores()}
				</div>
			</div>
		</Modal>
	);
};

export default GameResult;

// seid tx wasm execute sei1ts83c0ldh0jjmdmqtv33k74pljr0jsm5t3csyndrsealujwtsfwsx0tw0d '{"stake_to":{"team":"sei1lrukzqekdmcgqrl43g9c6aw9h8dsd6vp2608mh28ljjvh5uupfwszw3u8p"}}' --amount=100factory/sei1stk0nlqr2gkhvdah7ryd6vz9vsxwvyfpuq9lxy6j7g7akef5l7psuch4at/RACE -y --from=fe-devs --chain-id=sei-devnet-3 --fees=1000000usei --gas=50000000 --broadcast-mode=block --node=https://rpc.sei-devnet-3.seinetwork.io
// seid q wasm  contract-state smart sei1dleyten7mel5zzlsq28flkjkdqgpz9evalcj7n50l6a2rt684kyqfue2m4 '{"leaderboard": {}}' --chain-id=sei-devnet-3 --node=https://rpc.sei-devnet-3.seinetwork.io
