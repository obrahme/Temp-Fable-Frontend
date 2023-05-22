import { SubDao } from '../routes/Teams/types';
import { FableTeam } from '../types';


export const getFableTeamFromSubDao = (subDao: SubDao): FableTeam => {
	return {
		address: subDao.addr,
		charter: subDao.charter
	};
};