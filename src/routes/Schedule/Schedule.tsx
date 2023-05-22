import React, { useState } from 'react';
import { FaFlagCheckered, MdOutlineSchedule } from 'react-icons/all';
import { ScheduleEvent } from './types';
import styles from './Schedule.module.sass';
import { Header, Wrapper } from '../../layout';
import moment from 'moment';
import SCHEDULE from './schedule.json';
import { GameResult } from './components';

const EVENTS = SCHEDULE as ScheduleEvent[];

const Schedule = () => {
	const [showResultsForGameResult, setShowResultsForGameResult] = useState<string>();

	const renderEvent = (scheduleEvent: ScheduleEvent) => {
		const renderIcon = () => {
			if (scheduleEvent.gameResultId) {
				return <FaFlagCheckered className={styles.icon} />;
			} else {
				return <MdOutlineSchedule className={styles.icon} />;
			}
		};

		const renderGameResult = () => {
			if (!scheduleEvent.gameResultId) return null;

			return (
				<p onClick={() => setShowResultsForGameResult(scheduleEvent.gameResultId)} className={styles.gameResult}>
					view game result
				</p>
			);
		};

		return (
			<div key={scheduleEvent.date} className={styles.event}>
				<div className={styles.eventInfo}>
					<div className={styles.eventHeader}>
						{renderIcon()}
						<h2>{scheduleEvent.title}</h2>
					</div>
					<p className={styles.eventDate}>{moment(scheduleEvent.date).local().format('MMMM Do YYYY, h:mm a')}</p>
					<p className={styles.eventDescription}>{scheduleEvent.description}</p>
					{renderGameResult()}
				</div>
			</div>
		);
	};

	return (
		<Wrapper>
			<Header />
			<div className={styles.content}>
				<h1 className={styles.title}>Schedule</h1>
				<hr className={styles.separator} />
				{/* <div className={styles.events}>{EVENTS.map(renderEvent)}</div> */}
				<div className={styles.events}>
					<div key="1683741600000" className={styles.event}>
						<div className={styles.eventInfo}>
							<div className={styles.eventHeader}>
								<MdOutlineSchedule className={styles.icon} />
								<h2>Act II: Pokémon Champions league</h2>
							</div>
							<p className={styles.eventDate}>{moment(1683741600000).local().format('MMMM Do YYYY, h:mm a')}</p>
							<p className={styles.eventDescription}>The second leg of the race has begun! Check out our mission and win FABLE tokens.</p>
							<p className={styles.eventDescription}><a href="https://medium.com/@thefableleague/mission-two-pokémon-champions-league-e1297dcdb0ab">https://medium.com/@thefableleague/mission-two-pokémon-champions-league-e1297dcdb0ab</a></p>
							<p className={styles.eventDescription}>Hurry up, the mission ends on {moment(1684306740000).local().format('MMMM Do YYYY, h:mm a')}</p>
							{/* {renderGameResult()} */}
						</div>
					</div>
					<div key="1682956800000" className={styles.event}>
						<div className={styles.eventInfo}>
							<div className={styles.eventHeader}>
								<FaFlagCheckered className={styles.icon} />
								<h2>Act I: Checkmate the Competition</h2>
							</div>
							<p className={styles.eventDate}>{moment(1682956800000).local().format('MMMM Do YYYY, h:mm a')}</p>
							<p className={styles.eventDescription}>The first leg of the race has begun! Check out our mission and win FABLE tokens.</p>
							<p className={styles.eventDescription}><a href="https://medium.com/@thefableleague/mission-one-checkmate-the-competition-c6f6159c9aac">https://medium.com/@thefableleague/mission-one-checkmate-the-competition-c6f6159c9aac</a></p>
							<p className={styles.eventDescription}>Hurry up, the mission ends on {moment(1683356340000).local().format('MMMM Do YYYY, h:mm a')}</p>
							{/* {renderGameResult()} */}
						</div>
					</div>
				</div>
			</div>
			{showResultsForGameResult && <GameResult gameResultId={showResultsForGameResult} closeModal={() => setShowResultsForGameResult(undefined)} />}
		</Wrapper>
	);
};

export default Schedule;
