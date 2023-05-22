import { atom } from 'recoil';
import { FableTeam } from '../../types';

export const allTeamsAtom = atom<FableTeam[]>({
	key: 'allTeamsAtom',
	default: undefined
});

