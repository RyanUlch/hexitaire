// React Imports:
import { useContext, useState, useEffect } from 'react';
// CSS Module Import:
import classes from './ShownContainer.module.css';
// Component Import:
import PlayCard from '../PlayCard/PlayCard';
// Context Imports:
import { AppContext, AppDispatchContext } from '../../context/context';

// ShownContainer shows the cards that are "flipped" off of the {SelectionSpot} pile in 1, 3 or 5 card increments
	// User can only access the top card from these flipped cards
	// Note: In the Context, every ShownContainer is within state.containers[0] - the literal is used below to access these containers easily
	// This component also access the 'hidden' pile which in the context is within state.containers[4] and is used as a literal as well
const ShownContainer = () => {
	// Context Initializations:
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext)
	// State Initialization - bounds is used to update the contained cards in case the screen sizing changes
	const [bounds, setBounds] = useState({left: 0, top: 0});

/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: Update the state to know where the container lives, this is to make sure you drop the card in the intended spot and to move the cards if needed
	// Dependencies: The window size from the context as there is a listener elsewhere when the screen changes size
	useEffect(() => {
		const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [0, 0],
					left: getBounds.left,
					right: getBounds.left+getBounds.width,
				}
			});
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			});
		}
	}, [state.window[0], state.window[1]]);

	// console.log([(bounds.left+(3*state.cardSizes[3])), bounds.top])
/* useEffect Section End */
	return (
		// Main container - used to as be accessible for useEffect to get the location of the container
		<div id='shown' className={`${classes.container}`}>
			{/* Conditional Cards 1-5 are shown based on how many cards are available in the Draw Pile */}
			{/* There cannot be more than 5 cards in this pile as that is the highest difficulty setting */}
			{/* Conditional Card 5 */}
			{state.containers[0][0].cardContainer.length >= 5
				? <PlayCard
					parentPosition={[(bounds.left+(4*state.cardSizes[3])), bounds.top]}
					container={[0, 0]}
					positionInContainer={4}
					showOne={true}
					zIndex={1}
				/> : <></>
			}
			{/* Conditional Card 4 */}
			{state.containers[0][0].cardContainer.length >= 4
				? <PlayCard
					parentPosition={[(bounds.left+(3*state.cardSizes[3])), bounds.top]}
					container={[0, 0]}
					positionInContainer={3}
					showOne={true}
					zIndex={-99}
				/> : <></>
			}
			{/* Conditional Card 3 */}
			{state.containers[0][0].cardContainer.length >= 3
				? <PlayCard
					parentPosition={[(bounds.left+(2*state.cardSizes[3])), bounds.top]}
					container={[0, 0]}
					positionInContainer={2}
					showOne={true}
					zIndex={-199}
				/> : <></>
			}
			{/* Conditional Card 2 */}
			{state.containers[0][0].cardContainer.length >= 2
				? <PlayCard
					parentPosition={[(bounds.left+(1*state.cardSizes[3])), bounds.top]}
					container={[0, 0]}
					positionInContainer={1}
					showOne={true}
					zIndex={-299}
				/> : <></>
			}
			{/* Conditional Card 1 */}
			{state.containers[0][0].cardContainer.length >= 1
				? <PlayCard
					parentPosition={[(bounds.left+(0*state.cardSizes[3])), bounds.top]}
					container={[0, 0]}
					positionInContainer={0}
					showOne={true}
					zIndex={-399}
				/> : <></>
			}
			{/* Conditional Card - Under the pile */}
				{/* This conditional card is slightly different. If the player uses all the cards on top and there is at least one card in the 'Hidden' pile */}
				{/* Show the top card from that pile as player can keep playing the top card from that pile until it is empty */}
			{state.containers[4][0].cardContainer.length > 0
				? <PlayCard
					parentPosition={[(bounds.left), bounds.top]}
					container={[4, 0]}
					positionInContainer={state.containers[4][0].cardContainer.length-1}
					showOne={true}
					zIndex={-499}
				/> : <></>
			}
		</div>
	);
}

export default ShownContainer;