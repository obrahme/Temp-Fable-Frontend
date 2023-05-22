export type GameResultProps = { gameResultId: string; closeModal: () => void };

export type GameResultResponse = {
	id: string;
	team_addrs: string[];
	team_scores: string[];
	winner: string;
};
