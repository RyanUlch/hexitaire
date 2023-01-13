// React Imports:
import { useContext, useEffect, useState, }	from 'react';
// CSS Module Import:
import classes								from './GameContainer.module.css'
// Component Imports:
import DedicationModal						from '../Modal/DedicationModal/DedicationModal';
import FinishedContainer					from '../FinishedContainer/FinishedContainer';
import InPlayContainer						from '../InPlayContainer/InPlayContainer';
import RulesModal							from '../Modal/RulesModal/RulesModal';
import SelectionSpot						from '../SelectionSpot/SelectionSpot';
import ShownContainer						from '../ShownContainer/ShownContainer';
import Timer 								from '../Timer/Timer';
// Context Imports:
import { AppContext, AppDispatchContext }	from '../../context/context';
// Helper Import:
import { autoFinish }						from '../../helpers/moveValidator';

// Game container is the main component within Hexitaire,
// It is used to display all the containers, as well as handle logic related to the game State
const GameContainer = () => {
	// UseContext Initializations:
	const { state }		= useContext(AppContext);
	const { dispatch }	= useContext(AppDispatchContext);
	// State Initializations:
		// Number of games since first loading the page. Not currently displayed to user anywhere
			// Note: in future update, could load a localStorage value to count total games.
			// Currently being used to make sure timer gets updated when there is a new game selected
	const [gameNumber, setGameNumber] = useState(0);
		// Modal States, true when user clicks related button
	const [isShowRulesModal, setIsShowRulesModal] = useState(false);
	const [isShowDedicationModal, setIsShowDedicationModal] = useState(false);
		// boolean value to indicate if timer should be running or not
	const [timer, setTimer] = useState(false);
		// Window size state handled by GameContainer, as it needs to detect when the screen changes to make sure the cards get moved as well
	const [windowSize, setWindowSize] = useState<{width: Number, height: number}>({width: 0, height: 0,});

	// Undo button was clicked, try to reset back to the last State set
	const undo = () => {
		// Check if there is a lastMove available, and that the user hasn't won already.
		if (state.lastMove.length > 0 && !state.winCondition[1]) {
			dispatch({
				type: 'UNDO',
				payload: null,
			})
		}	
	}




/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: Check and set the winCondition of the state. Used when the user is able to win (all cards free), but haven't yet finished.
		// User can choose to auto-finish the game. Should not trigger more than once, as either user auto-finished or chose not to
	// Dependency: {state.winCondition[0]} - Only update when the user frees all cards (winCondition[0]), but not when game is actually won (winCondition[1])
	useEffect(() => {
		if (state.winCondition[0] && !state.winCondition[1] && window.confirm('All Cards are free, would you like to auto complete?')) {
			// Get the steps needed to finish game
			const finishSteps = autoFinish(state.containers);
			// For every step, send a new dispatch to update State
				// Note: This is slightly inefficient as I could write a dispatch type to handle this, however I want to add smooth animations in a future
				// update and will need these steps to be separate to be able to animate them individually.
			for (let i = 0; i < finishSteps.length; ++i) {
				dispatch({
					type: 'MOVECARD',
					payload: finishSteps[i],
				});
			}
			// Set the states winCondition to indicate this game is complete
			dispatch({
				type: 'SETWINCONDITIONS',
				payload: [true, true],
			})
		}		 
	}, [state.winCondition[0]]);

	// Use: Stop the timer once the game has been won (state.winCondition[1]), ignore all else, as the timer is started elsewhere
	// Dependency: state.winCondition[1] - only worry about if the game is fully won, not if all cards are free (state.winCondition[0])
	useEffect(() => {
		if (state.winCondition[1]) {
			setTimer(false);
		}
	}, [state.winCondition[1]])

	// Use: Set the middleLine height, and window values in State. Used in containers to properly position elements.
	// Dependencies: WindowSize state (separated as we want to update on value change)
	useEffect(()=> {
		const middleLineElement = document.querySelector('#MiddleLine');
		const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
		dispatch({
			type: 'SETWINDOWVALUES',
			payload: {
				middleLine: middleLineElement?.getBoundingClientRect().top, 
				wHeight: windowSize.height, wWidth: windowSize.width,
				fSize: fontSize,
				cHeight: fontSize*7, 	cMidHeight:  (fontSize*7)/2,
				cWidth: fontSize*5, 	cMidWidth: (fontSize*5)/2,
			},
		});
	}, [windowSize.height, windowSize.width]);

	// Use: set window listener to check when the window changes size. Used in previous useEffect to update spacing
	// Dependencies: None - run once when component mounts
	useEffect(() => {
		// Function defined as it needs to be called in two places
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		// add event listener to window as this is the only resize event listener in whole program
		window.addEventListener("resize", handleResize);
		// call handleResize() immediately to get the initial window size.
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);
/* useEffect Section End */

/* Component Management Section Start */
	// Create new game using the value of the button selected as the difficulty
	const newGame = (event: React.SyntheticEvent) => {
		let target = event.target as HTMLInputElement;
		if (Number(target.value) > 0) {
			dispatch({
				type: 'NEWGAME',
				payload: {
					difficulty: Number(target.value),
				}
			});
		// There is also a DEV button in Development mode to start game nearly finished.
		} else {
			dispatch({
				type: 'NEWGAMEDEV',
				payload: null,
			})
		}
		// Start timer on any new game
		setTimer(true);
		// Add one to the game number
		setGameNumber(prev => prev+1);
	}

	// Functions to open and close modals
		// Rules Modal opens to show the rules of Hexitaire
	const openRulesModal = 			() => { setIsShowRulesModal(true); }
	const closeRulesModal = 		() => {	setIsShowRulesModal(false);	}
		// Dedication Modal opens to see a few pictures of my family, links to my other work, and to give credit to third parties
	const openDedicationModal = 	() => { setIsShowDedicationModal(true);	}
	const closeDedicationModal = 	() => { setIsShowDedicationModal(false); }
/* Component Management Section End */

	// Most complicated Component render, comments are short explanations. Go to Components to get a more detailed explanation.
	return (
		<>
			{/* Modals to pop up when user selects associated button in the footer */}
			{isShowRulesModal		&& <RulesModal		onClose={closeRulesModal}		/>}
			{isShowDedicationModal	&& <DedicationModal onClose={closeDedicationModal}	/>}

			{/* Container of the entire game, used in CSS to position the game together */}
			<div className={classes.gameContainer}>

				{/* Image of the Hexitaire logo, not clickable, as this is a single page app */}
				<img className={classes.headerImage} src='\images\hexitairelaidoutThin.jpg' alt='Hexitaire Logo' />

				{/* The top row of containers */}
				<div id='TopLine' className={`${classes.containers} ${classes.top}`}>
					{/* Finished containers is where users put the suits back in order. Won once all cards are in place here */}
					<FinishedContainer containerNum={0} />
					<FinishedContainer containerNum={1} />
					<FinishedContainer containerNum={2} />
					<FinishedContainer containerNum={3} />
					{/* A section to indicate the pile of not shown cards, clicked to show more */}
					<SelectionSpot />
					{/* Cards user can grab to use in Finished or In-Play containers */}
					<ShownContainer />
				</div>

				{/* The middle line is invisible, it is simply meant to indicate the location where the In-Play containers start */}
					{/* Could probably remove this line if using the In-Play Container div to find height */}
				<div id='MiddleLine' />

				{/* The containers users play within to move cards around before putting them in the Finished containers */}
				<div className={`${classes.containers} ${classes.bottom}`}>		
					<InPlayContainer containerNum={0} />
					<InPlayContainer containerNum={1} />
					<InPlayContainer containerNum={2} />
					<InPlayContainer containerNum={3} />
					<InPlayContainer containerNum={4} />
					<InPlayContainer containerNum={5} />
					<InPlayContainer containerNum={6} />
					<InPlayContainer containerNum={7} />
				</div>

				{/* Footer Boxes (<footer> tag used on last line), positioned at the bottom of screen */}
				<div className={classes.footerContainer}>
					{/* Buttons for starting a new game, currently all difficulties are separate buttons, might change to one "New Game" button with settings stored in local storage */}
					<div className={`${classes.footer}`}>
						{/* <div 	className={`${classes.fElement} ${classes.even}	${classes.topLeft}	`}>New:</div> */}
						<button className={`${classes.fElement} ${classes.odd}	${classes.topLeft}	`} onClick={newGame} value={1}>Easy	</button>
						<button className={`${classes.fElement} ${classes.even}						`} onClick={newGame} value={3}>Medium</button>
						<button className={`${classes.fElement} ${classes.odd}	${classes.topRight}	`} onClick={newGame} value={5}>Hard</button>
						{/* Used only in Development, not shown in Production */}
						{!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? <button className={`${classes.fElement} ${classes.even} ${classes.dev}`} onClick={newGame} value={-1}>DEV</button> : <></>}
					</div>

					{/* Game Specific Information, Amount of moves, Undo button and current time */}
					<div className={`${classes.footer} ${classes.footerTop}`}>
						<div	className={`${classes.fElement} ${classes.even}	`}>{state.moves}</div>
						<button	className={`${classes.fElement} ${classes.odd}	${state.lastMove.length === 0 || state.winCondition[1] ? classes.disabled : ''}`} disabled={state.lastMove.length === 0 || state.winCondition[1]} onClick={undo}>Undo</button>
						<Timer	timerReact={timer} gameNumber={gameNumber} classes={classes} />
					</div>

					{/* Links to Modals and my Website */}
					<footer className={`${classes.footer} ${classes.footerBottom}`}>
						<button className={`${classes.fElement} ${classes.odd}	`} onClick={openDedicationModal}>Tributes</button>
						<button className={`${classes.fElement} ${classes.even}	`} onClick={openRulesModal}>Rules</button>
						<button className={`${classes.fElement} ${classes.odd}	${classes.name}`} onClick={() => {window.open('https:RyanUlch.com','_blank')}}>Ryan Ulch</button>
					</footer>
				</div>
			</div>
		</>
	)
}

export default GameContainer;