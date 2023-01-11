// React Imports:
import { useState, useEffect, useContext } from 'react';
// CSS Module Import:
import classes from './InPlayContainers.module.css';
// Component Imports:
import PlayCard from '../PlayCard/PlayCard';
// Context Imports:
import { AppContext, AppDispatchContext } from '../../context/context';

// 8 containers below the first row of containers. Used as the main play area for user to move and free cards.
	// Note: In the Context, every InPlayContainer is within state.containers[2] - the literal is used below to access these containers easily
const InPlayContainer = (props: {containerNum: number}) => {
	// UseContext Initializations:
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);
	// State Initialization - bounds is used to update the contained cards in case the screen sizing changes
	const [bounds, setBounds] = useState({left: 0, top: 0});

/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: Update the state to know where the container lives, this is to make sure you drop the card in the intended spot and to move the cards if needed
	// Dependencies: The window size from the context as there is a listener elsewhere when the screen changes size
	useEffect(() => {
		const getBounds = document.querySelector(String(`#c${props.containerNum}`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [2, props.containerNum],
					left: getBounds.left,
					right: getBounds.left+getBounds.width,
				}
			});
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			})
		}
	}, [state.window[0], state.window[1]]);
/* useEffect Section End */

	return (
		// Main container - used to display border, as well as be accessible for useEffect to get the location of the container
		<div id={`c${props.containerNum}`} className={`${classes.container}`}>
			{/* Card on the bottom of the pile - Conditional - Only shown if there is a card within the pile*/}
				{/* Note, Play card uses recursion to display the rest of the pile, so there is no need to have more than the bottom card here */}
			{state.containers[2][props.containerNum].cardContainer.length > 0
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[2, props.containerNum]}
					positionInContainer={0}
					showOne={false}
					zIndex={1}
				/>
				: <></>
			} 
		</div>
	)
}

export default InPlayContainer;