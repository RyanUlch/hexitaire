// React Imports:
import { useContext, useEffect, useState } from "react";
// CSS Module Import:
import classes from './SelectionSpot.module.css';
// Context Imports:
import { AppContext, AppDispatchContext } from "../../context/context";

// Selection Spot is the simplest container. It is directly to the right of the FinishedContainers
	// It does not display any cards. It just shows whether or not there are cards to draw from.
	// When clicked and there are cards to be drawn, send dispatch to reducer in order to flip the cards over
	// Note: In the Context, SelectionSpot is within state.containers[1] - the literal is used below to access these containers easily
const SelectionSpot = () => {
	// Context Initializations:
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);
	// State Initialization - isEmpty is used to determine if the card back should be shown to player
	const [isEmpty, setIsEmpty] = useState(true);
	
/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: Update the state to know where the container lives, this is to make sure you drop the card in the intended spot and to move the cards if needed
	// Dependencies: The window size from the context as there is a listener elsewhere when the screen changes size
	useEffect(() => {
		const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [1, 0],
					left: getBounds.left,
					right: getBounds.left+getBounds.width,
				}
			});
		}
	}, [state.window[0], state.window[1]]);

	// Use: To update the display for when there are no more cards available in the pile
	// Dependency: When this specific container is changed in the context
	useEffect(()=> {
		setIsEmpty(state.containers[1][0].cardContainer.length > 0 ? false : true);
	},[state.containers[1][0].changed]);
/* useEffect Section End */

/* Component Management Section Start */
	// When this div is clicked, attempt to flip cards over to shown pile
	const showMore = () => {
		if (state.containers[1][0].cardContainer.length > 0) {
			dispatch({
				type: 'FLIPCARDS',
				payload: null,
			});
			// If there are no cards to flip, but the reset pile, or draw pile does contain at least one card, reset the SelectionSpot container
		} else if (state.containers[0][0].cardContainer.length > 0 || state.containers[4][0].cardContainer.length > 0) {
			dispatch({
				type: 'RESETFLIPPEDCARDS',
				payload: null,
			})
		} // If both are false, there are no more available cards. Do nothing.
	}
/* Component Management Section End */

	return (
		// If not empty, show the back of the cards (an image), if not, show empty container
		<div onClick={showMore} className={classes.container}>
			{isEmpty ? <></> : <img src='\images\hexBack.png' className={classes.img} alt='' />}
		</div>
	)
}

export default SelectionSpot;