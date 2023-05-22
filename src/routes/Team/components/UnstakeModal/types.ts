export type UnstakeModalProps = {
	teamId: string;
	amountStaked: string | undefined;
	setShowStakeModal: (show: boolean) => void;
	refreshTotal: () => void;
};
