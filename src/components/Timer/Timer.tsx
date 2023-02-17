// React Imports
import { useEffect, useState, } from 'react';

// Timer is automatically used when a new game starts. It counts the seconds from the start of the game.
	// Will be stopped the moment the user "wins" by putting the last card into the Finished piles.
	// Will keep the current value until a new game is started, value not stored anywhere, could add local storage HighScores in future update
const Timer = (props: {
	timerReact: boolean,						// Whether timer should be running or not
	gameNumber: number,							// To indicate the user clicked a new game without necessarily finishing the last one
	classes: {readonly [key: string]: string},	// To share the same classes as rest of the gameContainer elements
}) => {
	// State Initialization:
	const [timer, setTimer] = useState([0,0]); // timer[0] = minutes, timer[1] == seconds
	const [intervalID, setIntervalID] = useState<NodeJS.Timer>();

/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: When running, tick the shown clock up for each second, stop when the user wins
	// Dependency: TimerReact boolean telling timer if it should be running or not, GameNumber so if a new game is started, it resets the time
		// Note: setInterval is not the most accurate timing function.
			// As there is no leader board, or even saved times, this is not much of an issue.
			// In future update, if there is a leader board, should switch this to measuring time from Date.now()
	useEffect(() => {
		if (props.timerReact) { // If timer should be going, and is being re-rendered, reset the count, and start new timer
			// Always try to remove previous interval. This should already be happening due to the useEffect return function, just a safety measure
			clearInterval(intervalID);
			// Reset timer as this is being triggered by a new game
			setTimer([0, 0]);
			// Set the interval to update the timer state every second. 
			setIntervalID(setInterval(() => {
				setTimer(prev => {
					const newTime = [...prev];
					newTime[1] += 1;
					if (newTime[1] === 59) {
						newTime[1] = 0;
						newTime[0] += 1;
					}
					return newTime;
				});
			}, 1000));
		} else {
			// {props.timerReact} is false, and the timer should be paused but not reset.
			// This only occurs when the user finishes the game for now, but could be used for a pause button in the future.
			clearInterval(intervalID);
		}
		// Return clearInterval so that if the component unmounts, it will not keep running the timer.
		return () => {clearInterval(intervalID)}
	}, [props.timerReact, props.gameNumber]);
/* useEffect Section End */

	// Simple display to show current time
	return (<div className={`${props.classes.fElement} ${props.classes.even}`}>{timer[0] < 10 ? ('0'+timer[0]) : timer[0]}:{timer[1] < 10 ? ('0'+timer[1]) : timer[1]}</div>);
}

export default Timer;