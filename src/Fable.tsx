import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Leaderboard, Schedule, Team, Teams } from './routes';
import { useEffect } from 'react';
import { SubDao } from './routes/Teams/types';
import { DAO_CORE_CONTRACT_ADDRESS } from './config';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { allTeamsAtom } from './recoil/atoms/teams';
import { useCosmWasmClient } from '@sei-js/react';
import { FableTeam } from './types';

const getFableTeamFromSubDao = (subDao: SubDao): FableTeam => {
	return {
		address: subDao.addr,
		charter: subDao.charter
	};
};

const Fable = () => {
	const { cosmWasmClient } = useCosmWasmClient();

	const setTeams = useSetRecoilState(allTeamsAtom);


	const router = createBrowserRouter([
		{
			path: '/',
			element: <Teams />
		},
		{
			path: '/team/:id',
			element: <Team />
		},
		{
			path: '/schedule',
			element: <Schedule />
		},
		{
			path: '/leaderboard',
			element: <Leaderboard />
		}
	]);

	const getData = async () => {
		try {
			const subDaos: SubDao[] = await cosmWasmClient?.queryContractSmart(DAO_CORE_CONTRACT_ADDRESS, { list_sub_daos: {} });
			const teams = subDaos.map((subDao) => getFableTeamFromSubDao(subDao));
			setTeams(teams);
		} catch (e: any) {
			console.error('Error fetching teams', e.message);
		}
	};

	useEffect(() => {
		if (cosmWasmClient) getData().then();
	}, [cosmWasmClient]);

	return <RouterProvider router={router} />
}
export default Fable;
