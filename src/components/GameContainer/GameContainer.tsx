
import { useEffect, useState, useContext } from 'react';
import classes from './GameContainer.module.css'
import SelectionSpot from '../SelectionSpot/SelectionSpot';
import InPlayContainer from '../InPlayContainer/InPlayContainer';
import { AppContext } from '../../context/context';
import FinishedContainer from '../FinishedContainer/FinishedContainer';
import ShownContainer from '../ShownContainer/ShownContainer';
const GameContainer = () => {
	const {state, dispatch} = useContext(AppContext);
	const [windowSize, setWindowSize] = useState<{width: Number, height: number}>({
		width: 0,
		height: 0,
	});

	const [topLine, setTopLine] = useState<number | undefined>(0);

	useEffect(()=> {
		const middleLineElement = document.querySelector('#MiddleLine');
		dispatch({
			type: 'SETMIDDLELINE',
			payload: middleLineElement?.getBoundingClientRect().top,
		})
		setTopLine(middleLineElement?.getBoundingClientRect().top)
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
				difficulty: event.target.value,
			}
		})
	}

	return (
		<div className={classes.gameContainer}>
			<img className={classes.headerImage} src='\images\hexitairelaidoutThin.jpg' alt='Hexitaire Logo'/>
			<div id='TopLine' className={`${classes.containers} ${classes.top}`}>
				<FinishedContainer containerNum={0} topLine={topLine} />
				<FinishedContainer containerNum={1} topLine={topLine} />
				<FinishedContainer containerNum={2} topLine={topLine} />
				<FinishedContainer containerNum={3} topLine={topLine} />
				<SelectionSpot moves={state.moves} />
				<ShownContainer moves={state.moves} topLine={topLine}/>
			</div>
			<div id='MiddleLine' />
			<div className={`${classes.containers} ${classes.bottom}`}>		
				<InPlayContainer containerNum={0} topLine={state.middleLine} />
				<InPlayContainer containerNum={1} topLine={state.middleLine} />
				<InPlayContainer containerNum={2} topLine={state.middleLine} />
				<InPlayContainer containerNum={3} topLine={state.middleLine} />
				<InPlayContainer containerNum={4} topLine={state.middleLine} />
				<InPlayContainer containerNum={5} topLine={state.middleLine} />
				<InPlayContainer containerNum={6} topLine={state.middleLine} />
				<InPlayContainer containerNum={7} topLine={state.middleLine} />
			</div>
			<button className={classes.easy} onClick={newGame} value={1}>New Game (Easy)</button>
			<button className={classes.medium} onClick={newGame} value={3}>New Game (Medium)</button>
			<button className={classes.hard} onClick={newGame} value={5}>New Game (Hard)</button>
			<p className={classes.moves}>Moves: {state.moves}</p>
			<p className={classes.attribute}>Background Image by <a href="https://www.freepik.com/free-photo/top-view-felt-fabric-texture_27640942.htm#query=felt%20texture&position=40&from_view=search&track=sph">Freepik</a></p>
		</div>
	)
}

export default GameContainer;