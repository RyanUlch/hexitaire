// React Imports:
import { useRef, useContext, useState, useEffect } from 'react';
// CSS Module Import:
import classes from './PlayCard.module.css';
// Context Imports:
import { AppContext, AppDispatchContext,  } from '../../context/context';
// Helper Imports:
import { cardMidHeight, cardMidWidth, fontSize } from '../../helpers/globals';
import { validateAutoMove } from '../../helpers/moveValidator';

// PlayCard at 64 unique cards to display in multiple areas of the game
	// These are complicated due to them needing specific conditions when they are in different containers, or being moved by the player
const PlayCard = (props: {
	parentPosition: number[],		// The current position of it's parent (container or parent PlayCard)
										// Used to set where the card should be located, as well as moving with its parent when that card moves
	container: number[],			// The container that the Card currently exists in, passed down through children as any child of PlayCard will be in the same container
	positionInContainer: number,	// Where in the container the card is. This is used mainly for InPlay Containers so the cards can easily know where they are
	showOne: boolean,				// A Simple boolean to indicate which type of container the card is in.
										// Containers where every card is in a pile and you only see the top card this is set to "true"
										// This helps prevent PlayCard to not render all of the cards underneath it
	zIndex: number,					// Used to ensure that the cards are stacked properly
}) => {
	// Context Initializations:
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);

	// Single Component use variables - These do not use state functionality as they are needed immediately (update race conditions), set once and used multiple times,
		// or simply; putting them in a state variable caused position bugs (cardInfo)
	// Set Additional space needed to put columns of cards in the correct places. Used in initialization, and when setting position.
	const addition = (((props.positionInContainer > 0) && !props.showOne) ? (2*fontSize) : 0) * Math.pow(0.975, state.containers[props.container[0]][props.container[1]].cardContainer.length);
	// Timeout ID for when the parent card (or container) moves, wait a millisecond to see if more movement occurs (prevents too many re-renders)
	let moveTimeout: NodeJS.Timeout;
	// Click (or tap) counter to check if user is double clicking/tapping a card. Prevents reducer running for no reason
		// Used to prevent case of picking up a card, putting it down, reducer running to see it was put back into same container, and player clicking again.
		// Should prevent a fair amount of reducer calls for a player that used mostly double click/tap functionality 
	let clickCount = 0;
	// Ref used to access this specific card
	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
	// State Initialization - position is used to let children know when PlayCard is moving
	const [position, setPosition] = useState({ left: props.parentPosition[0], top: props.parentPosition[1] + addition, });
	// Set the cards info (suit, number, if the card is red or black)
		// Using a check, as cards can be rendered before Context has been initialized. If so, give card invalid info
	let cardInfo = (!state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer]) 
	? {	suit: -1, number: -1, isRed: true, } // Used to show that Context is not loaded, won't display card below
	: {
		suit: state?.containers[props.container[0]][props.container[1]]?.cardContainer[props.positionInContainer]?.suit,
		number: state?.containers[props.container[0]][props.container[1]]?.cardContainer[props.positionInContainer]?.number,
		isRed: state?.containers[props.container[0]][props.container[1]]?.cardContainer[props.positionInContainer]?.suit < 2,
	}

/* WORKING ON THIS *//* WORKING ON THIS *//* WORKING ON THIS *//* WORKING ON THIS *//* WORKING ON THIS *//* WORKING ON THIS */
	// Trying to use state to let card change z-index to be on top when it is moving, currently not working on mobile, may not need depending on solution
	const [isMoving, setIsMoving] = useState(false);
/* End Work*/

/* useEffect Section Start *//* Descriptions before each one include the dependencies */
	// Use: Move with the parent element, wait 1 millisecond incase there is more movement to prevent too many re-renders
	// Dependencies: Parent Card/Container position, and if this container updated (as this may move the card slightly due to "crunching" when columns get too large)
	useEffect(()=> {
		moveTimeout = setTimeout(() => {
			setPosition({
					left: props.parentPosition[0],
					top: props.parentPosition[1] + addition,
				});
		}, 1);
		return () => {
			clearTimeout(moveTimeout);
		}
	}, [props.parentPosition[0], props.parentPosition[1], state.containers[props.container[0]][props.container[1]].changed]);
/* useEffect Section End */

/* Component Management Section Start */
	// Attempt to drop the held card, Reducer handles logic, including if it was dropped into the same container
	const attemptCardDrop = (target: HTMLInputElement) => {
		if (target) {
			let cardDropLocation = target.getBoundingClientRect();
			dispatch({
				type: 'MOVECARD',
				payload: {
					to: [],
					from: [props.container[0], props.container[1], props.container[0] === 2 ? props.positionInContainer : state.containers[props.container[0]][props.container[1]].cardContainer.length-1],
					cardTop: cardDropLocation.top+cardMidHeight,
					cardLeft: cardDropLocation.left+cardMidWidth,
				}
			})
		}
	}

	// Handle double click event (same for clicking and tapping) 
	const onDblClick = () => {
		// Make sure card being clicked is either from the finished container (top card can always be attempted to be moved), or that the card is from a different container and is valid to be moved
		if (props.container[0] === 3 || (props.container[0] !== 4 && state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer)) {
			const moveCard = validateAutoMove(state.containers, props.container, props.container[0] === 3 ? state.containers[props.container[0]][props.container[1]].cardContainer.length-1: props.positionInContainer);
			// moveCard.to will be empty if the card has no valid moves
			if (moveCard.to.length > 0) {
				dispatch({
					type: 'MOVECARD',
					payload: moveCard,
				});
			}
		}
	}
	
	// Event handler for when a touch device taps and holds, This is to move cards around on screen
	const onTouch = (target: HTMLInputElement, held: boolean) => {
		// NOTE: setMoving is here while trying to fix z-index issue on mobile, may not be needed depending on fix
		setIsMoving(state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer);

		// Check that the card can be moved at all, and that the player is still holding down on the screen after the timeout
		if (state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer, held) {
			// When screen is let go, reset handlers and see if card can be dropped in current location
			document.ontouchend = () => {
				document.ontouchend = null;
				document.ontouchmove = null;
				document.ontouchcancel = null;
				attemptCardDrop(target);
				// NOTE: again, may not need after fixing z-index on mobile issue
				setIsMoving(false);
			};
			// When player moves while still holding down on screen, move the tapped valid card with pointer
			document.ontouchmove = (e: TouchEvent) => { setPosition({ top: e.touches[0].clientY - cardMidHeight, left: e.touches[0].clientX - cardMidWidth, }); };
			// When player cancels move, reset handlers
				// NOTE: I am unsure about what constitutes a cancelled touch event, may need to run {attemptCardDrop()} for this as well
			document.ontouchcancel = (e: TouchEvent) => { document.ontouchend = null; document.ontouchmove = null;	document.ontouchcancel = null; }
		} else {
			// Reset event listeners
			document.ontouchend = null;
			document.ontouchmove = null;
			document.ontouchcancel = null;
		}
	}

	// Event handler for when a mouse/pointer device clicks and holds, This is to move cards around on screen
	const onMouseDown = (target: HTMLInputElement, held: boolean) => {
		// Check that the card can be moved at all, and that the mouse is still being held down after the timeout
		if (state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer && held) {
			// When mouse button is let go, reset handlers and see if card can be dropped in current location
			document.onmouseup = () => { document.onmouseup = null;	document.onmousemove = null; attemptCardDrop(target); };
			// When mouse moves while still clicked, move the clicked valid card with mouse
			document.onmousemove = (e: MouseEvent) => { setPosition({ top: e.clientY - cardMidHeight, left: e.clientX - cardMidWidth, }); };
		} else {
			// Reset event listeners
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	// Check if the mouse is being double clicked based on the timeout. Don't run single click event if so to prevent rerenders
	const clickCounter = (event: React.SyntheticEvent) => {
		event = event || window.event;
		event.stopPropagation();
		event.preventDefault();
		let target = event.target as HTMLInputElement;
		clickCount++;
		if (clickCount === 1) {
			let held = true;
			document.onmouseup = () => {held = false}
			setTimeout(function(){
				(clickCount === 1) ? onMouseDown(target, held) : onDblClick();
				clickCount = 0;
			}, 200);
		}
	}

	// Check if the player is double tapping screen based on the timeout. Don't run single tap event if so to prevent rerenders
		// Note had to use code duplication due to the fact that handling click and touch events are different
	const tapCounter = (event: React.SyntheticEvent) => {
		event = event || window.event;
		event.stopPropagation();
		event.preventDefault();
		let target = event.target as HTMLInputElement;
		clickCount++;
		if (clickCount === 1) {
			let held = true
			document.ontouchend = () => {held = false}
			setTimeout(function(){
				(clickCount === 1) ? onTouch(target, held) : onDblClick();
				clickCount = 0;
			}, 200);
		}
	}

	// Sets the suit symbol as a string based on suit number
	const suitSymbol = () => {
		switch(cardInfo.suit) {
			case 0:	return '♥';	case 1:	return '♦';
			case 2:	return '♠';	case 3:	return '♣';
			case -1: return '';
			default:throw Error('Card Suit Not Defined');
		}
	}

	// Sets the number in a string (as using hexadecimal: 0-9, A-F)
	const numberSymbol = () => {
		if (cardInfo.number < 10) return String(cardInfo.number);
		switch(cardInfo.number) {
			case 10: return 'A'; case 11: return 'B';
			case 12: return 'C'; case 13: return 'D';
			case 14: return 'E'; case 15: return 'F';
			default: throw Error('Card Number Not Defined');
		}
	}
/* Component Management Section End */

	return (
		// Containing div has lots of attributes, so it is exploded out
		<div
			// Handlers for when user clicks or taps on this specific card
			onMouseDown={clickCounter}
			onTouchStart={tapCounter}
			// Ref to access this specific card in event handlers
			ref={ref} 
			// Styles set with state
			style={{zIndex: props.zIndex, left: position.left, top: position.top}} 
			// All ClassNames for PlayCard - Can have many different classes (valid/invalid/red/black/moving/empty)
			className={
				(cardInfo.number !== -1 && cardInfo.number !== undefined)
					? `${classes.PlayCard} ${state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer ? classes.valid : classes.invalid} ${cardInfo.isRed ? classes.red : classes.black} ${isMoving ? classes.moving : ''}`
					: classes.empty
			}>
			{/* Card Info being displayed on card conditionally (if the card/context is loaded) */}
			{cardInfo.number !== -1 && cardInfo.number !== undefined 
				? <div className={classes.cardText}>
					{/* If the screen width makes the cards crowded, don't show top and bottom text */}
					{state.window[1] > 500 ? <p className={classes.top}>{numberSymbol()}{suitSymbol()}</p> : <></>}
					<p className={classes.middle}>{numberSymbol()}{suitSymbol()}</p>
					{state.window[1] > 500 ? <p className={classes.bottom}>{numberSymbol()}{suitSymbol()}</p> : <></>}
				</div>
				: <></>
			}
			{/* When the PlayCard has a child, and is in an InPlayContainer, then add card recursively  */}
			{state.containers[props.container[0]][props.container[1]].cardContainer.length > props.positionInContainer+1 && !props.showOne
				? <PlayCard 
					zIndex={props.zIndex+1}
					parentPosition={[position.left, position.top]}
					container={props.container}
					positionInContainer={props.positionInContainer+1}
					showOne={false}
				/> 
				: <></>
			}
		</div>
	);
}

export default PlayCard;