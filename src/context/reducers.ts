// Context Function Imports:
import { cardGenerator, shuffleDeck } from './context';
// Type Imports:
import type { gameContainer, container, card } from './context';

/* Reducer Functions Start *//* Separated out for code reuse */
// Check validity of the cards within the container, used for InPlay Containers only, as every other container is valid only on the last card in pile
const containerCheck = (container: {cardContainer: card[], validFrom: number}) => {
	// If the container is already valid from the start, or if the container has one or less cards, set validFrom to 0
		// This is because a fully valid InPlay container cannot have invalid card stacks placed there (undo button resets the validFrom for each container)
	if (container.validFrom === 0 || container.cardContainer.length <= 1) {
		return 0;
	} else {
		// Check the container starting with the last and second last card, iterate up until there is an invalid card pair
		for (let i = container.cardContainer.length-1; i > 0; --i) {
			// If successful, either the suit colors are not opposite, or the two numbers are not sequential
			// Either way the container is not valid for in the next position, send the current position as valid.
			if ((container.cardContainer[i].suit < 2) === (container.cardContainer[i-1].suit < 2) || (container.cardContainer[i].number !== container.cardContainer[i-1].number-1)) {
				return i;
			}
		}
		// There were no invalid cards, set validFrom to 0
		return 0;
	}
}

//  Create deep copy of state - this helps prevent altering the state variable during the operations
export const deepCopyState = (state: gameContainer) => {
	// Could go through containers programmatically, however since they need different amounts of containers, it is less verbose to write it out (I know, but it is)
	return {
		containers: [
			[
				{cardContainer: [...state.containers[0][0].cardContainer], containerDisplay: [...state.containers[0][0].containerDisplay], changed: state.containers[0][0].changed, validFrom: state.containers[0][0].validFrom},
			],
			[
				{cardContainer: [...state.containers[1][0].cardContainer], containerDisplay: [...state.containers[1][0].containerDisplay], changed: state.containers[1][0].changed, validFrom: state.containers[1][0].validFrom},
			],
			[
				{cardContainer: [...state.containers[2][0].cardContainer], containerDisplay: [...state.containers[2][0].containerDisplay], changed: state.containers[2][0].changed, validFrom: state.containers[2][0].validFrom},
				{cardContainer: [...state.containers[2][1].cardContainer], containerDisplay: [...state.containers[2][1].containerDisplay], changed: state.containers[2][1].changed, validFrom: state.containers[2][1].validFrom},
				{cardContainer: [...state.containers[2][2].cardContainer], containerDisplay: [...state.containers[2][2].containerDisplay], changed: state.containers[2][2].changed, validFrom: state.containers[2][2].validFrom},
				{cardContainer: [...state.containers[2][3].cardContainer], containerDisplay: [...state.containers[2][3].containerDisplay], changed: state.containers[2][3].changed, validFrom: state.containers[2][3].validFrom},
				{cardContainer: [...state.containers[2][4].cardContainer], containerDisplay: [...state.containers[2][4].containerDisplay], changed: state.containers[2][4].changed, validFrom: state.containers[2][4].validFrom},
				{cardContainer: [...state.containers[2][5].cardContainer], containerDisplay: [...state.containers[2][5].containerDisplay], changed: state.containers[2][5].changed, validFrom: state.containers[2][5].validFrom},
				{cardContainer: [...state.containers[2][6].cardContainer], containerDisplay: [...state.containers[2][6].containerDisplay], changed: state.containers[2][6].changed, validFrom: state.containers[2][6].validFrom},
				{cardContainer: [...state.containers[2][7].cardContainer], containerDisplay: [...state.containers[2][7].containerDisplay], changed: state.containers[2][7].changed, validFrom: state.containers[2][7].validFrom},

			],
			[
				{cardContainer: [...state.containers[3][0].cardContainer], containerDisplay: [...state.containers[3][0].containerDisplay], changed: state.containers[3][0].changed, validFrom: state.containers[3][0].validFrom},
				{cardContainer: [...state.containers[3][1].cardContainer], containerDisplay: [...state.containers[3][1].containerDisplay], changed: state.containers[3][1].changed, validFrom: state.containers[3][1].validFrom},
				{cardContainer: [...state.containers[3][2].cardContainer], containerDisplay: [...state.containers[3][2].containerDisplay], changed: state.containers[3][2].changed, validFrom: state.containers[3][2].validFrom},
				{cardContainer: [...state.containers[3][3].cardContainer], containerDisplay: [...state.containers[3][3].containerDisplay], changed: state.containers[3][3].changed, validFrom: state.containers[3][3].validFrom},
			],
			[
				{cardContainer: [...state.containers[4][0].cardContainer], containerDisplay: [...state.containers[4][0].containerDisplay], changed: state.containers[4][0].changed, validFrom: state.containers[4][0].validFrom},
			],
		],
		difficulty: state.difficulty,	middleLine: state.middleLine,		window: [...state.window],
		moves: state.moves,				lastMove: [...state.lastMove],		winCondition: [...state.winCondition],
		cardSizes: [...state.cardSizes],
	}
}

// Similar to {deepCopyState}, Create a copy of just the containers, used to get containers state to save it for the undo button
const containerCopy = (containers: container[][]) => {
	return [
		[
			{cardContainer: [...containers[0][0].cardContainer], containerDisplay: [...containers[0][0].containerDisplay], changed: containers[0][0].changed, validFrom: containers[0][0].validFrom},
		],
		[
			{cardContainer: [...containers[1][0].cardContainer], containerDisplay: [...containers[1][0].containerDisplay], changed: containers[1][0].changed, validFrom: containers[1][0].validFrom},
		],
		[
			{cardContainer: [...containers[2][0].cardContainer], containerDisplay: [...containers[2][0].containerDisplay], changed: containers[2][0].changed, validFrom: containers[2][0].validFrom},
			{cardContainer: [...containers[2][1].cardContainer], containerDisplay: [...containers[2][1].containerDisplay], changed: containers[2][1].changed, validFrom: containers[2][1].validFrom},
			{cardContainer: [...containers[2][2].cardContainer], containerDisplay: [...containers[2][2].containerDisplay], changed: containers[2][2].changed, validFrom: containers[2][2].validFrom},
			{cardContainer: [...containers[2][3].cardContainer], containerDisplay: [...containers[2][3].containerDisplay], changed: containers[2][3].changed, validFrom: containers[2][3].validFrom},
			{cardContainer: [...containers[2][4].cardContainer], containerDisplay: [...containers[2][4].containerDisplay], changed: containers[2][4].changed, validFrom: containers[2][4].validFrom},
			{cardContainer: [...containers[2][5].cardContainer], containerDisplay: [...containers[2][5].containerDisplay], changed: containers[2][5].changed, validFrom: containers[2][5].validFrom},
			{cardContainer: [...containers[2][6].cardContainer], containerDisplay: [...containers[2][6].containerDisplay], changed: containers[2][6].changed, validFrom: containers[2][6].validFrom},
			{cardContainer: [...containers[2][7].cardContainer], containerDisplay: [...containers[2][7].containerDisplay], changed: containers[2][7].changed, validFrom: containers[2][7].validFrom},
		],
		[
			{cardContainer: [...containers[3][0].cardContainer], containerDisplay: [...containers[3][0].containerDisplay], changed: containers[3][0].changed, validFrom: containers[3][0].validFrom},
			{cardContainer: [...containers[3][1].cardContainer], containerDisplay: [...containers[3][1].containerDisplay], changed: containers[3][1].changed, validFrom: containers[3][1].validFrom},
			{cardContainer: [...containers[3][2].cardContainer], containerDisplay: [...containers[3][2].containerDisplay], changed: containers[3][2].changed, validFrom: containers[3][2].validFrom},
			{cardContainer: [...containers[3][3].cardContainer], containerDisplay: [...containers[3][3].containerDisplay], changed: containers[3][3].changed, validFrom: containers[3][3].validFrom},
		],
		[
			{cardContainer: [...containers[4][0].cardContainer], containerDisplay: [...containers[4][0].containerDisplay], changed: containers[4][0].changed, validFrom: containers[4][0].validFrom},
		],
	];
}

// Compare the two provided cards. Can either be using the InPlay or Finished placement rules. Logic is complicated, but solid
const compareCards = (isSameSuit: boolean, lCard: card, rCard: card, fromHasChildren: boolean) => {
	// Check if the suit of both cards are the same || If being dropped onto an empty space in a Finished Container, return next check
	if (lCard.suit === rCard.suit || (rCard.suit === -1 && isSameSuit)) {
		// Check if it is supposed to be the same suit (Finished Container) and that the rCard has no children. If so, check if numbers are sequential.
			// 1. If being dropped to InPlay, isSameSuit will be false, and will fail immediately
			// 2. This stops stacks of cards being dropped into Finished Containers (!fromHasChildren)
			// 3. Finally, check that the numbers are in order based on Finished Container rules (dropped card 1 higher than existing card)
					// Even for empty containers this works as rCard will be given number -1 which will match the 0th card
		return (isSameSuit && !fromHasChildren && lCard.number === rCard.number+1);
	} else {	
		// Check if it is supposed to be different suits (In-Play Container), if so, check that the colors are different, and numbers are sequential
			// 1. If there is no card in the container, you can drop any card or stack of cards into InPlay containers
			// 2. Check that the suits are different colors (0-1: red, 2-3: black)
			// 3. Check that the numbers are in order based on InPlay Container rules (dropped card 1 less than existing card)
		return ((rCard.suit === -1) || (!isSameSuit && (lCard.suit < 2) !== (rCard.suit < 2) && lCard.number === rCard.number-1));
	}
}

// Update the containers - Check validity for InPlay Containers. Move top card if pulled from Draw pile and there is at least one card in Hidden pile
const updateContainer = (containers: container[][], first: number, second: number) => {
	// Check if the container is "In-Play", if so, validate like normal. 
	if (first === 2) {
		containers[first][second].validFrom = containerCheck(containers[first][second]);
		// If it is from Draw Pile, check if Draw pile is empty. If not, validate last card in container.	
	} else if (first === 0 && containers[0][0].cardContainer.length === 0 && containers[4][0].cardContainer.length > 0) {
		const newCards = containers[4][0].cardContainer.splice(-1);
		containers[0][0].cardContainer.push(...newCards);
		containers[0][0].validFrom = containers[0][0].cardContainer.length -1;
		containers[4][0].changed = !containers[4][0].changed;
	} else {
		// Container is valid from it's top card (will set to -1 for empty containers, but will be updated when a card is added)
		containers[first][second].validFrom = containers[first][second].cardContainer.length -1;
	}
	// It is ok to flip the container.changed boolean, as it will not be flipped twice, the checks will already have failed if the card was dropped into its own container
	containers[first][second].changed = !containers[first][second].changed;
	return containers;
}
/* Reducer Functions Start */

// Reducer - for each action.type I provide the expected payload (if any), Typescript has no check for these outside of run-time
export const cardReducer = (state: gameContainer, action: {type: string, payload: any}) => {
	switch (action.type) {
		// Run a new game with a specific difficulty
		case 'NEWGAME': {	// Payload: { difficulty: number }
			//  Get a fresh shuffled deck
			const deck = shuffleDeck();
			return {
				containers: [
					[
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[0][0].containerDisplay, validFrom: 0,	changed: !state.containers[0][0].changed, },
					],
					[
						{ cardContainer: deck.slice(36), containerDisplay: state.containers[1][0].containerDisplay,	validFrom: 0, changed: !state.containers[1][0].changed,	},
					],
					[
						{ cardContainer: deck.slice(0, 1),	 containerDisplay: state.containers[2][0].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 1)]}),	changed: !state.containers[2][0].changed, },
						{ cardContainer: deck.slice(1, 3),	 containerDisplay: state.containers[2][1].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(1, 3)]}),	changed: !state.containers[2][1].changed, },
						{ cardContainer: deck.slice(3, 6),	 containerDisplay: state.containers[2][2].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(3, 6)]}),	changed: !state.containers[2][2].changed, },
						{ cardContainer: deck.slice(6, 10),	 containerDisplay: state.containers[2][3].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(6, 10)]}),	changed: !state.containers[2][3].changed, },
						{ cardContainer: deck.slice(10, 15), containerDisplay: state.containers[2][4].containerDisplay,	validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(10, 15)]}),	changed: !state.containers[2][4].changed, },
						{ cardContainer: deck.slice(15, 21), containerDisplay: state.containers[2][5].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(15, 21)]}), changed: !state.containers[2][5].changed, },
						{ cardContainer: deck.slice(21, 28), containerDisplay: state.containers[2][6].containerDisplay,	validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(21, 28)]}),	changed: !state.containers[2][6].changed, },
						{ cardContainer: deck.slice(28, 36), containerDisplay: state.containers[2][7].containerDisplay,	validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(28, 36)]}),	changed: !state.containers[2][7].changed, },
					],
					[
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[3][0].containerDisplay, validFrom: 0,	changed: !state.containers[3][0].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[3][1].containerDisplay, validFrom: 0, changed: !state.containers[3][1].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[3][2].containerDisplay, validFrom: 0,	changed: !state.containers[3][2].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[3][3].containerDisplay, validFrom: 0,	changed: !state.containers[3][3].changed, },
					],
					[
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[4][0].containerDisplay, validFrom: 0,	changed: !state.containers[4][0].changed, },
					],
				],
				difficulty: action.payload.difficulty,	middleLine: state.middleLine,	window: state.window,
				moves: 0,								lastMove: [], 					winCondition: [false, false],
				cardSizes: [...state.cardSizes],
			};
		}

		// action.type only for dev purposes, puts game into almost won state where finishing game can be tested easily
		case 'NEWGAMEDEV': {	// Payload: null
			// Get a deck of non-shuffled cards
			const deck = cardGenerator(); 
			return {
				containers: [
					[
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[0][0].containerDisplay, validFrom: 0, changed: !state.containers[0][0].changed, },
					],
					[
						{ cardContainer: deck.slice(62), containerDisplay: state.containers[1][0].containerDisplay,	validFrom: 0, changed: !state.containers[1][0].changed,	},
					],
					[
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][0].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][0].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][1].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][1].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][2].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][2].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][3].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][3].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][4].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][4].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][5].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][5].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][6].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][6].changed, },
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[2][7].containerDisplay, validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 0)]}),	changed: !state.containers[2][7].changed, },
					],
					[
						{ cardContainer: deck.slice(0, 16),  containerDisplay: state.containers[3][0].containerDisplay, validFrom: 0, changed: !state.containers[3][0].changed, },
						{ cardContainer: deck.slice(16, 32), containerDisplay: state.containers[3][1].containerDisplay,	validFrom: 0, changed: !state.containers[3][1].changed,	},
						{ cardContainer: deck.slice(32, 48), containerDisplay: state.containers[3][2].containerDisplay,	validFrom: 0, changed: !state.containers[3][2].changed,	},
						{ cardContainer: deck.slice(48, 62), containerDisplay: state.containers[3][3].containerDisplay, validFrom: 0, changed: !state.containers[3][3].changed, },
					],
					[
						{ cardContainer: deck.slice(0, 0), containerDisplay: state.containers[4][0].containerDisplay, validFrom: 0,	changed: !state.containers[4][0].changed, },
					],
				],
				difficulty: 1,	middleLine: state.middleLine,	window: state.window,
				moves: 0,		lastMove: [],					winCondition: [false, false],
				cardSizes: [...state.cardSizes],
			};
		}
		// Flip cards from the draw pile into the shown pile. Won't be triggered when there are no more cards (logic in {SelectionSpot})
		case 'FLIPCARDS': {		// Payload: null
			const flipState = deepCopyState(state);
			flipState.lastMove = containerCopy([...state.containers]);
			// Update Draw Pile Container
			const newCards = flipState.containers[1][0].cardContainer.splice(0, flipState.difficulty);
			flipState.containers[1][0].changed = !flipState.containers[1][0].changed;
			flipState.containers[4][0].cardContainer.push(...flipState.containers[0][0].cardContainer.splice(0));
			// Update Shown Pile container
			flipState.containers[0][0].cardContainer.push(...newCards);
			flipState.containers[0][0].validFrom = flipState.containers[0][0].cardContainer.length -1;
			flipState.containers[0][0].changed = !flipState.containers[0][0].changed;
			//  Updated Moves
			flipState.moves += 1;
			return {...flipState};
		}
		// There are cards that can be reset to the draw pile. Do that
		case 'RESETFLIPPEDCARDS': {	// Payload: null
			const resetFlipState = deepCopyState(state);
			resetFlipState.lastMove = containerCopy(state.containers);
			// Update Hidden Pile Container
			resetFlipState.containers[4][0].cardContainer.push(...resetFlipState.containers[0][0].cardContainer.splice(0));
			// Update Draw Pile Container
			resetFlipState.containers[1][0].cardContainer	= resetFlipState.containers[4][0].cardContainer.splice(0);
			resetFlipState.containers[1][0].changed			= !resetFlipState.containers[1][0].changed;
			// Update Moves
			resetFlipState.moves += 1;
			return {...resetFlipState};
		}
		// Set the column bounds of specific container. Used for when cards are dropped to check which one it was dropped over.
		case 'SETCOLUMNBOUNDS': {	// Payload: {column: number[], left: number, right: number}
			const updateState = deepCopyState(state);
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return {...updateState};
		}
		// Update the windows height and width, used to display cards in the correct position
		case 'SETWINDOWVALUES': {	// payload: {middleLine: number, wHeight: number, wWidth: number}
			const windowState = deepCopyState(state);
			windowState.middleLine = action.payload.middleLine;
			windowState.window = [action.payload.wHeight, action.payload.wWidth];
			windowState.cardSizes = [action.payload.cHeight, action.payload.cMidHeight, action.payload.cWidth, action.payload.cMidWidth];
			return {...windowState};
		}
		// Attempt to move card to a new container. Run in two phases.
			// The first runs if the 'to' array was not provided (need to use containerDisplays to find the 'to' container)
			// The second takes the 'to' and 'from' arrays (either supplied or found in phase 1), to check and move cards
			// Also checks if the user has won, or can win. Might be able to separate this out later, but needs to be done in this dispatch
				// as checking within GameContainer causes too many re-renders
		case 'MOVECARD': { 
			/* payload: {
				to: [container 1, container 2, cardPosition] | [],
				from: [container 1, container 2, cardPosition],
				cardTop: number | null,
				cardLeft: number | null}
			} */
			const moveState = deepCopyState(state);
			// Payload is used a lot here. Using shorthand for better readability
			const pay = action.payload;
			// If "to" array isn't set, then using coordinate system. Set "to" array using middleLine/ContainerDisplays
			if (pay.to.length === 0) {
				// Find which container it was dropped in to set "to" array.
				if (pay.cardTop < moveState.middleLine) {
					// Card was dropped above the middle line, check if it was dropped in Finished Container
					for (let i = 0; i < 4; ++i) {
						if (moveState.containers[3][i].containerDisplay[0] < pay.cardLeft && pay.cardLeft < moveState.containers[3][i].containerDisplay[1]) {
							pay.to.push(3, i, moveState.containers[3][i].cardContainer.length-1);
						}
					}
				} else {
					// Card was dropped below middle line, check if it was dropped in In-Play Container
					for (let i = 0; i < 8; ++i) {
						if (moveState.containers[2][i].containerDisplay[0] < pay.cardLeft && pay.cardLeft < moveState.containers[2][i].containerDisplay[1]) {
							pay.to.push(2, i, moveState.containers[2][i].cardContainer.length-1);
						}
					}
				}
			}
			// Check the "to" array was either provided, or set using coordinate system.
			// Then using the container system, check if dropped card is valid with the card on to[]
			if (pay.to.length > 0 && !(pay.to[0] === pay.from[0] && pay.to[1] === pay.from[1]) && compareCards(
				// If Finished container, suits of both cards should be the same
				pay.to[0] === 3,
				// First card (lCard)
				moveState.containers[pay.from[0]][pay.from[1]].cardContainer[pay.from[2]],
				// Second card (rCard)
				pay.to[2] === -1 ? {number: -1, suit: -1} : moveState.containers[pay.to[0]][pay.to[1]].cardContainer[pay.to[2]],
				// If "from" container has more cards than the "from" card position (since Finished container can't take more than 1 card at a time)
				moveState.containers[pay.from[0]][pay.from[1]].cardContainer.length > pay.from[2]+1,
			)) {
				// Check Succeeded, update both containers
					// Update From Container, splice cards off of "from" container, Previous check prevents move than 1 card being sent to Finished container
				moveState.lastMove = containerCopy(state.containers);
				const newCards = moveState.containers[pay.from[0]][pay.from[1]].cardContainer.splice(pay.from[2]);
				moveState.containers = updateContainer(moveState.containers, pay.from[0], pay.from[1]);
					// Add cards to "to" container, then validate like above
				moveState.containers[pay.to[0]][pay.to[1]].cardContainer.push(...newCards);
				moveState.containers = updateContainer(moveState.containers, pay.to[0], pay.to[1]);
				moveState.moves += 1;
				let canWin = true;
				if (moveState.containers[3][0].cardContainer.length === 16 && moveState.containers[3][1].cardContainer.length === 16 && moveState.containers[3][2].cardContainer.length === 16 && moveState.containers[3][3].cardContainer.length === 16) {
					alert("You Won! Congrats");
					// setTimer(false);
					moveState.winCondition = [true, true];
					canWin = false;
				} else if (!moveState.winCondition[1] && (moveState.containers[0][0].cardContainer.length > 0 || moveState.containers[1][0].cardContainer.length > 0 || moveState.containers[4][0].cardContainer.length > 0)) {
					// Check there are no more cards in the draw, hidden, or reset piles, if all fails, the user has uncovered all cards, and can win!
					moveState.winCondition = [false, false];
					canWin = false;
				} else if (!moveState.winCondition[1]) {
					// Check that each InPlay container is valid from the top of the pile, if not, Can't win yet.
					for (let i = 0; i < moveState.containers[2].length; ++i) {
						if (moveState.containers[2][i].validFrom !== 0) {
							moveState.winCondition = [false, false];
							canWin = false;
							break;
						}
					}
				}
				if (canWin){
					moveState.winCondition = [true, false];
				}
				return {...moveState};
			} else {
				// Check Failed, update "from" container to allow resetting of dropped card
				moveState.containers[pay.from[0]][pay.from[1]].changed = !moveState.containers[pay.from[0]][pay.from[1]].changed
				return {...moveState}
			}
		}
		// Set if the user can, or has already won.
		case 'SETWINCONDITIONS': {	// Payload: boolean[]
			const newState = deepCopyState(state);
			newState.winCondition = action.payload;
			return {...newState};
		}
		// Undo last action. Copy the containers from {lastMove} back into containers
			// Update moves as this action still is a valid move
			// Currently only 1 undo can be used. Can add an array of containers to allow for more undo's, but many changes need to be implemented for that.
		case 'UNDO': {	// Payload: null
			if (state.lastMove.length > 0) {
				const newState = deepCopyState(state);
				newState.containers = [...newState.lastMove];
				newState.lastMove = [];
				newState.moves += 1;
				return {...newState};
			} else {
				return {...state};
			}
		}
		// Shouldn't happen, but to prevent player getting breaking error, just send back the same state
		default:
			return state;
	}
}