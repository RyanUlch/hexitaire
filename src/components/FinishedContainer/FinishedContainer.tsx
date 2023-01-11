// React imports:
import { useState, useEffect, useContext } from 'react';
// CSS Module Import:
import classes from './FinishedContainer.module.css';
// Component Imports:
import PlayCard from '../PlayCard/PlayCard';
// Context imports:
import { AppContext, AppDispatchContext } from '../../context/context';

// FinishedContainer is the 4 boxes in the top-left of the screen. The player wins when they stack all the cards from 0 to F in these piles with the same suit
	// Note: In the Context, every FinishedContainer is within state.containers[3] - the literal is used below to access these containers easily
const FinishedContainer = (props: {containerNum: number,}) => {
	// UseContext Initializations:
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);
	// State Initialization - bounds is used to update the contained cards in case the screen sizing changes
	const [bounds, setBounds] = useState({left: 0, top: 0});

/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: Update the state to know where the container lives, this is to make sure you drop the card in the intended spot and to move the cards if needed
	// Dependencies: The window size from the context as there is a listener elsewhere when the screen changes size
	useEffect(() => {
		const getBounds = document.querySelector(String(`#f${props.containerNum}`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [3, props.containerNum],
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
		<div id={`f${props.containerNum}`} className={`${classes.container}`}>
			{/* Card on top - Conditional - Will display the card that is last in the pile (highest card) if there is any in the pile */}
				{/* User can drag this card elsewhere */}
			{state.containers[3][props.containerNum].cardContainer.length > 0 && !state.winCondition[1]
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-1}
					showOne={true}
					zIndex={1}
				/>
				: <></>
			}
			{/* The penultimate card in the pile - Conditional - Will display if there is at least 2 cards in pile */}
				{/* User cannot select this card, it is here so that when a user drags a card from the top of this pile, you can see the card underneath */}
			{state.containers[3][props.containerNum].cardContainer.length-2 >= 0 && !state.winCondition[1]
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-2}
					showOne={true}
					zIndex={0}
				/>
				: <></>
			}
			{/* Win State card - Used when the user has won the game. This prevents user from taking cards from this pile after the game is over */}
				{/* TODO: Update CSS to make the card look nicer - or make image for it */}
			{state.winCondition[1]
				? <div className={classes.finished}>You Win!</div>
				: <></>
			}
		</div>
	)
}

export default FinishedContainer;