
import { useEffect, useContext } from 'react';
import classes from './GameContainer.module.css'

import InPlayContainer from '../InPlayContainer/InPlayContainer';
import { AppContext } from '../../context/context';
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
			<div id='MiddleLine' />
			<div className='columns'>		
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