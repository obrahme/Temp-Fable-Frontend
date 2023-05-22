import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './Team.module.sass';
import { Header, Wrapper } from '../../layout';
import { useWallet, useCosmWasmClient, WalletConnectButton } from '@sei-js/react';
import { StakeModal, UnstakeModal } from './components';
import { truncateAddress, toFableBalance, withCommas } from '../../utils';
import { FABLE_TOKEN_DENOM, STAKING_VOTING_CONTRACT_ADDRESS } from '../../config';
import { useRecoilValue } from 'recoil';
import { allTeamsAtom } from '../../recoil/atoms/teams';
import { toast } from 'react-toastify';


const Team = () => {
	const { id } = useParams();

	const { restUrl, accounts } = useWallet();
	const { cosmWasmClient } = useCosmWasmClient();
	const teams = useRecoilValue(allTeamsAtom);

	const [teamTotalPower, setTeamTotalPower] = useState<string>();
	const [stakerData, setStakerData] = useState<{ balance: string; team: string }>({balance: '0', team: ''});
	const [fableBalance, setFableBalance] = useState<string>('0');

	const [showStakeModal, setShowStakeModal] = useState<boolean>(false);
	const [showUnstakeModal, setShowUnstakeModal] = useState<boolean>(false);

	const [refreshToken, setRefreshToken] = useState<number>(0);


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
		const getTeamInfo = async () => {
			const teamPowerDetail = await cosmWasmClient?.queryContractSmart(STAKING_VOTING_CONTRACT_ADDRESS, { team: { team: id } });
			setTeamTotalPower(teamPowerDetail.team.balance);

			const totalPower = await cosmWasmClient?.queryContractSmart(STAKING_VOTING_CONTRACT_ADDRESS, { total_power_at_height: {} });

			if (accounts?.[0]?.address) {
				const connectedWalletStake = await cosmWasmClient?.queryContractSmart(STAKING_VOTING_CONTRACT_ADDRESS, {
					staker: { address: accounts[0].address }
				});
		
				if (connectedWalletStake.staker) {
					
					setStakerData({
						balance: id === connectedWalletStake.staker.team ? connectedWalletStake.staker.balance : '0',
						team: connectedWalletStake.staker.team || ''
					});

				}

				getFableBalance().then(setFableBalance)
			} else {
				setStakerData({
					balance: '0',
					team: ''
				})

				setFableBalance('0')
			}
		};

		if (cosmWasmClient && id) getTeamInfo().then();
	}, [cosmWasmClient, id, refreshToken, accounts?.[0]?.address]);

	const refreshTotal = () => setRefreshToken(refreshToken + 1);

	const onClickStake = () => {
		try {

			if (fableBalance === '0') {
				throw new Error('Must have a FABLE token balance in your wallet')
			}

			if (stakerData.team !== id && stakerData.team.length > 0) {
				throw new Error('Cannot stake to more than one team at a time')
			} 
				
			setShowStakeModal(true)
			
		} catch (e: any) {
			console.error('Staking Error: ', e.message);
			toast.error('Staking Error: ' + e.message);
		}
	}

	const onClickUnstake = () => {
		try {
			
			if (stakerData.balance === '0') {
				throw new Error('There is nothing to unstake')
			}

			setShowUnstakeModal(true)
 		} catch (e: any) {
			console.error('Staking Error: ', e.message);
			toast.error('Staking Error: ' + e.message);
		}
	}

	if (!id) return <div />;

	const renderButtons = () => {
		if (!accounts?.[0]?.address) return <WalletConnectButton />;

		return (
			<div className={styles.buttons}>
				<button className={styles.button} onClick={onClickStake}>
					stake
				</button>
				{stakerData.balance && (
					<button className={styles.button} onClick={onClickUnstake}>
						unstake
					</button>
				)}
			</div>
		);
	};

	const renderTeamCharter = () => {
		const team = teams?.find(team => team.address === id)
		if (!team) return null;
		return (
			<div>
				<p className={styles.section}>Team charter:</p>
				<p className={styles.value}>
					{team.charter}
				</p>
			</div>
		)
	}

	return (
		<Wrapper>
			<Header />
			<div className={styles.content}>
				<div className={styles.header}>
					{renderTeamCharter()}
					<div>
						<p className={styles.section}>Team address:</p>
						<a href={`https://sei.explorers.guru/account/${id}`} target='__blank' className={styles.value}>
							{truncateAddress(id)}
						</a>
					</div>
					{teamTotalPower && (
						<div>
							<p className={styles.section}>Team total:</p>
							<p className={styles.value}>{withCommas(toFableBalance(teamTotalPower))} $FABLE</p>
						</div>
					)}
					<div>
						<p className={styles.section}>My stake:</p>
						<p className={styles.value}>{stakerData.balance ? withCommas(toFableBalance(stakerData.balance)) : 0} $FABLE</p>
					</div>
					{renderButtons()}
				</div>
			</div>
			{showStakeModal && <StakeModal teamId={id} setShowStakeModal={() => setShowStakeModal(false)} refreshTotal={refreshTotal} />}
			{showUnstakeModal && <UnstakeModal teamId={id} amountStaked={stakerData.balance} setShowStakeModal={() => setShowUnstakeModal(false)} refreshTotal={refreshTotal} />}
		</Wrapper>
	);
};

export default Team;
