import React, { useState } from 'react';
import { coins } from '@cosmjs/amino';
import { UnstakeModalProps } from './types';
import styles from './UnstakeModal.module.sass';
import { Modal } from '../../../../components/Modal';
import { useWallet } from '@sei-js/react';
import { getSigningCosmWasmClient } from '@sei-js/core'
import { STAKING_VOTING_CONTRACT_ADDRESS } from '../../../../config';
import { toast } from 'react-toastify';
import { toFableBalance, fromFableBalance, withCommas } from '../../../../utils';

const UnstakeModal = ({ teamId, amountStaked, setShowStakeModal, refreshTotal }: UnstakeModalProps) => {
	const [stakeAmount, setStakeAmount] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { accounts, offlineSigner, rpcUrl } = useWallet();

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
				{ unstake_from: { amount: fromFableBalance(stakeAmount) } },
				fee,
				'unstake from team'
			);
			refreshTotal();
			setIsLoading(false);
			toast.success('Unstaked $FABLE tokens successfully!');
			setShowStakeModal(false);
		} catch (e: any) {
			console.error('Unstaking Error: ', e.message);
			toast.error('Unstaking Error: ' + e.message);
			setIsLoading(false);
		}
	};

	return (
		<Modal closeModal={() => setShowStakeModal(false)} title='Unstake $FABLE tokens'>
			<div className={styles.content}>
				<input
					className={styles.input}
					type='number'
					placeholder='Amount of $FABLE to unstake...'
					value={stakeAmount}
					onChange={(e) => setStakeAmount(e.target.value)}
				/>
				{amountStaked && <p className={styles.balance}>Available to unstake: {withCommas(toFableBalance(amountStaked))}</p>}
				<button className={styles.button} disabled={isLoading} onClick={onClickStake}>
					{isLoading ? '...' : 'unstake'}
				</button>
			</div>
		</Modal>
	);
};

export default UnstakeModal;
