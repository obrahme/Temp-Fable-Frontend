import React from 'react';
import { TabSelectProps } from './types';
import styles from './TabSelect.module.sass';
import cn from 'classnames';

const TabSelect = ({ tabs, selectedTab, setSelectedTab }: TabSelectProps) => {
	return (
		<div className={styles.tabSelect}>
			{tabs.map((tabItem) => {
				return (
					<button
						key={tabItem.title}
						className={cn(styles.tab, { [styles.tabActive]: tabItem.value === selectedTab })}
						onClick={() => setSelectedTab(tabItem.value)}>
						{tabItem.title}
					</button>
				);
			})}
		</div>
	);
};

export default TabSelect;
