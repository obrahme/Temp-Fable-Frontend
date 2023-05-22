import React, { useEffect, useState } from 'react';
import { StakeModalProps } from './types';
import styles from './StakeModal.module.sass';
import { Modal } from '../../../../components/Modal';
import { useWallet } from '@sei-js/react';
import { getSigningCosmWasmClient } from '@sei-js/core'
import { coins } from '@cosmjs/amino';
import { FABLE_TOKEN_DENOM, STAKING_VOTING_CONTRACT_ADDRESS } from '../../../../config';
import { toast } from 'react-toastify';
import { toFableBalance, fromFableBalance, withCommas } from '../../../../utils'

const StakeModal = ({ teamId, setShowStakeModal, refreshTotal }: StakeModalProps) => {
	const [stakeAmount, setStakeAmount] = useState<string>('');
	const [raceBalance, setRaceBalance] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { rpcUrl, restUrl, accounts, offlineSigner } = useWallet();

	const getRaceBalance = async () => {
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
		getRaceBalance().then(setRaceBalance);
	}, [accounts?.[0]?.address]);

	const onClickStake = async () => {
		try {
			const address = accounts?.[0]?.address;

			if (!address || !offlineSigner || !rpcUrl) return;
			setIsLoading(true);

			const client = await getSigningCosmWasmClient(rpcUrl, offlineSigner)
	
			const fee = {
				amount: coins(10000, 'usei'),
				gas: (300000).toString()
			};

			await client.execute(
				address,
				STAKING_VOTING_CONTRACT_ADDRESS,
				{ stake_to: { team: teamId } },
				fee,
				'stake to team',
				coins(fromFableBalance(stakeAmount), FABLE_TOKEN_DENOM)
			);

			refreshTotal();
			setIsLoading(false);
			toast.success('Staked $FABLE tokens successfully!');
			setShowStakeModal(false);
		} catch (e: any) {
			console.error('Staking Error: ', e.message);
			toast.error('Staking Error: ' + e.message);
			setIsLoading(false);
		}
	};

	return (
		<Modal closeModal={() => setShowStakeModal(false)} title='Join team'>
			<div className={styles.content}>
				<input
					className={styles.input}
					type='number'
					placeholder='Amount of $FABLE to stake...'
					value={stakeAmount}
					onChange={(e) => setStakeAmount(e.target.value)}
				/>
				{raceBalance && <p className={styles.balance}>Available to stake: {withCommas(toFableBalance(raceBalance))}</p>}
				<button className={styles.button} disabled={isLoading} onClick={onClickStake}>
					{isLoading ? '...' : 'stake'}
				</button>
			</div>
		</Modal>
	);
};

export default StakeModal;
