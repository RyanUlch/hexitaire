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
		})
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
				<div className={classes.bottomButtons}>
					<div className={classes.buttons}>
						<button className={`${classes.button} ${classes.easy}`} onClick={newGame} value={1}>New Game (Easy)</button>
						<button className={`${classes.button} ${classes.medium}`} onClick={newGame} value={3}>New Game (Medium)</button>
						<button className={`${classes.button} ${classes.hard}`} onClick={newGame} value={5}>New Game (Hard)</button>
					</div>
					<div className={`${classes.footer} ${classes.footerTop}`}>
						<p className={classes.moves}>Moves: {state.moves}</p>
						<button disabled={state.lastMove.length === 0} className={`${classes.button} ${classes.undoBtn}`} onClick={undo}>Undo</button>
					</div>
					
					<footer className={`${classes.footer} ${classes.footerBottom}`}>
						<p className={classes.dedicaiton} onClick={openDedicationModal}>Dedications and Acknowledgements</p>
						<p className={classes.rulesBtn} onClick={openRulesModal}>What are the rules?</p>
						<p>A <a href='https:RyanUlch.com'><span  className={classes.name}>Ryan Ulch</span></a> website</p>
					</footer>
				</div>
			</div>
		</>
	)
}

export default GameContainer;