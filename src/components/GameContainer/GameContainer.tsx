
import { useEffect, useContext } from 'react';
import classes from './GameContainer.module.css'
import SelectionSpot from '../SelectionSpot/SelectionSpot';
import InPlayContainer from '../InPlayContainer/InPlayContainer';
import { AppContext } from '../../context/context';
import FinishedContainer from '../FinishedContainer/FinishedContainer';
import ShownContainer from '../ShownContainer/ShownContainer';
const GameContainer = () => {
	const {state, dispatch} = useContext(AppContext);

	
	useEffect(()=> {
		const middleLineElement = document.querySelector('#MiddleLine');
		dispatch({
			type: 'SETMIDDLELINE',
			payload: middleLineElement?.getBoundingClientRect().top,
		})
	}, []);

	return (
		<>
			<div className={`${classes.containers} ${classes.top}`}>
				<FinishedContainer containerNum={0} />
				<FinishedContainer containerNum={1} />
				<FinishedContainer containerNum={2} />
				<FinishedContainer containerNum={3} />
				<SelectionSpot moves={state.moves} />
				<ShownContainer moves={state.moves} />
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
		</>
	)
}

export default GameContainer;