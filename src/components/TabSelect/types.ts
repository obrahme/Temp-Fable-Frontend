export type TabSelectItem = { title: string; value: string };
export type TabSelectProps = {
	tabs: TabSelectItem[];
	selectedTab: string;
	setSelectedTab: (selectedTab: string) => void;
};
