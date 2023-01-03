import { useEffect, useState, useContext } from 'react';
import classes from './GameContainer.module.css'
import SelectionSpot from '../SelectionSpot/SelectionSpot';
import InPlayContainer from '../InPlayContainer/InPlayContainer';
import { AppContext, AppDispatchContext } from '../../context/context';
import FinishedContainer from '../FinishedContainer/FinishedContainer';
import ShownContainer from '../ShownContainer/ShownContainer';
import { autoFinish } from '../../helpers/moveValidator';
import RulesModal from '../Modal/RulesModal/RulesModal';
import DedicationModal from '../Modal/DedicationModal/DedicationModal';
import Timer from '../../Timer/Timer';

const GameContainer = () => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);

	const [windowSize, setWindowSize] = useState<{width: Number, height: number}>({
		width: 0,
		height: 0,
	});
	const [isShowRulesModal, setIsShowRulesModal] = useState(false);
	const [isShowDedicationModal, setIsShowDedicationModal] = useState(false);
	const [winConditions, setWinConditions] = useState([false, false]);
	const [timer, setTimer] = useState(-1);

	const undo = () => {
		if (state.lastMove.length > 0) {
			dispatch({
				type: 'UNDO',
			})
		}	
	}

	useEffect(() => {
		if (!winConditions[0] && !winConditions[1]) {
			let canWin = true;
			// Check that each InPlay container is valid from the top of the pile, if not, Can't win yet.
			for (let i = 0; i < state.containers[2].length; ++i) {
				if (state.containers[2][i].validFrom !== 0) {
					canWin = false;
				}
			}
			// Check there are no more cards in the draw, hidden, or reset piles, if all fails, the user has uncovered all cards, and can win!
			if (canWin && (state.containers[0][0].cardContainer.length > 0 || state.containers[1][0].cardContainer.length > 0 || state.containers[4][0].cardContainer.length > 0)) {
				canWin = false;
			}
			// If canWin is still true, the user has one and it can be automatically put into finished container
			if (canWin && !winConditions[0]) {
				// TODO: change pop-up to ask if they want to automatically finish
				const toComplete = window.confirm('All Cards are free, would you like to auto complete?');
				if (toComplete) {
					const finishSteps = autoFinish(state);
					for (let i = 0; i < finishSteps.length; ++i) {
						dispatch({
							type: 'MOVECARD',
							payload: finishSteps[i],
						});
					}
					setWinConditions([true, true]);
				}
			} else if (state.containers[3][0].cardContainer.length === 16 && state.containers[3][1].cardContainer.length === 16 && state.containers[3][2].cardContainer.length === 16 && state.containers[3][3].cardContainer.length === 16) {
				setWinConditions([true, true]);
			} else {
				setWinConditions([true, false]);
			}
		}
		if (winConditions[1]) {
			alert("You Won! Congrats");
			setTimer(1);
		}
	}, [state.moves]);

	useEffect(()=> {
		const middleLineElement = document.querySelector('#MiddleLine');
		dispatch({
			type: 'SETMIDDLELINE',
			payload: [middleLineElement?.getBoundingClientRect().top, windowSize.height, windowSize.width],
		})
	}, [windowSize.height, windowSize.width]);

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const newGame = (event: any) => {
		dispatch({
			type: 'NEWGAME',
			payload: {
				difficulty: Number(event.target.value),
			}
		});
		setTimer(2);
		setTimer(0);
	}

	const openRulesModal = () => {
		setIsShowRulesModal(true);
	}

	const closeRulesModal = () => {
		setIsShowRulesModal(false);
	}

	const openDedicationModal = () => {
		setIsShowDedicationModal(true);
	}

	const closeDedicationModal = () => {
		setIsShowDedicationModal(false);
	}

	return (
		<>
			{isShowRulesModal && <RulesModal onClose={closeRulesModal}/>}
			{isShowDedicationModal && <DedicationModal onClose={closeDedicationModal} />}
			<div className={classes.gameContainer}>
				<img className={classes.headerImage} src='\images\hexitairelaidoutThin.jpg' alt='Hexitaire Logo'/>
				<div id='TopLine' className={`${classes.containers} ${classes.top}`}>
					<FinishedContainer containerNum={0} />
					<FinishedContainer containerNum={1} />
					<FinishedContainer containerNum={2} />
					<FinishedContainer containerNum={3} />
					<SelectionSpot />
					<ShownContainer />
				</div>
				<div id='MiddleLine' />
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
				<div className={classes.footerContainer}>
					<div className={`${classes.footer} ${classes.buttons}`}>
						<button className={`${classes.even}`}>New Game:</button>
						<button className={`${classes.odd} ${classes.clickable}`} onClick={newGame} value={1}>Easy</button>
						<button className={`${classes.even} ${classes.clickable}`} onClick={newGame} value={3}>Medium</button>
						<button className={`${classes.odd} ${classes.clickable}`} onClick={newGame} value={5}>Hard</button>
					</div>
					<div className={`${classes.footer} ${classes.footerTop}`}>
						<button className={`${classes.even}`}>Moves: {state.moves}</button>
						<button className={`${classes.odd}  ${state.lastMove.length !== 0 ? classes.clickable : ''}`} disabled={state.lastMove.length === 0} onClick={undo}>Undo</button>
						<Timer timerReact={timer} classes={classes} />
					</div>
					
					<footer className={`${classes.footer} ${classes.footerBottom}`}>
						<button className={`${classes.odd}  ${classes.clickable}`} onClick={openDedicationModal}>Dedications and Acknowledgements</button>
						<button className={`${classes.even}  ${classes.clickable}`} onClick={openRulesModal}>What are the rules?</button>
						<button className={`${classes.odd} ${classes.clickable}`} onClick={() => {window.open('https:RyanUlch.com','_blank')}}>A <span className={classes.name}>Ryan Ulch</span> website</button>
					</footer>
				</div>
			</div>
		</>
	)
}

export default GameContainer;