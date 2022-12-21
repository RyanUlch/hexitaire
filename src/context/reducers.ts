import { readlink } from 'fs';
import { shuffleDeck } from './context';

const dropCheckInPlay: (lVal: {number: number, suit: number}, rVal: {number: number, suit: number}, state: any) => boolean = (lVal, rVal, state) => {
	return ((lVal.number-1 === rVal.number) && lVal.suit < 2 !== rVal.suit < 2) ? true : false;
}

const dropCheckFinished: (lVal: {number: number, suit: number}, containers: any, starting: number[], position: number) => boolean = (lVal, containers, starting, position) => {
	const rVal = containers[starting[0]][starting[1]].cardContainer[position];
	if ((lVal.number+1 === rVal.number) && (lVal.suit === rVal.suit)) {
		if (containers[starting[0]][starting[1]].cardContainer.length > position+1) {
			return dropCheckFinished(rVal, containers, starting, position+1);
		} else {
			return true
		}
	} else {
		return false;
	}
}

const containerCheck = (container: any) => {
	// If the container is already valid from the start, or if the container has one or less cards, set validFrom to 0
	if (container.validFrom === 0 || container.cardContainer.length <= 1) {
		return 0;
	} else {
		// console.log(container.cardContainer.length-1);
		// Check the container starting with the last and second last card, iterate up until there is an invalid card pair
		for (let i = container.cardContainer.length-1; i > 0; --i) {
			//console.log(container.cardContainer[i].number, container.cardContainer[i-1].number-1);
			// If successful, either the suit colors are not opposite, or the two numbers are not sequential
			// Either way the container is not valid for in the next position, send the current position as valid.
			if ((container.cardContainer[i].suit < 2) === (container.cardContainer[i-1].suit < 2) || (container.cardContainer[i].number !== container.cardContainer[i-1].number-1)) {
				//console.log(i);
				return i;
			}
		}
		// There were no invalid cards, set validFrom to 0
		return 0;
	}
}


export const cardReducer = (state: any, action: any) => {
	switch (action.type) {
		case 'NEWGAME': {
			const newContainer = state;
			newContainer.difficulty = action.payload.difficulty;
			const deck = shuffleDeck();
			newContainer.containers = [
				[
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[1][0].containerDisplay],
						validFrom: state.containers[1][0].cardContainer.length -1,
					},
				],
				[
					{
						cardContainer: deck.slice(36),
						containerDisplay: [...state.containers[1][0].containerDisplay],
						validFrom: null,
					},
				],
				[
					{
						cardContainer: deck.slice(0, 1),
						containerDisplay: [...state.containers[2][0].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 1)]}),
					},
					{
						cardContainer: deck.slice(1, 3),
						containerDisplay: [...state.containers[2][1].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(1, 3)]}),
					},
					{
						cardContainer: deck.slice(3, 6),
						containerDisplay: [...state.containers[2][2].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(3, 6)]}),
					},
					{
						cardContainer: deck.slice(6, 10),
						containerDisplay: [...state.containers[2][3].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(6, 10)]}),
					},
					{
						cardContainer: deck.slice(10, 15),
						containerDisplay: [...state.containers[2][4].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(10, 15)]}),
					},
					{
						cardContainer: deck.slice(15, 21),
						containerDisplay: [...state.containers[2][5].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(15, 21)]}),
					},
					{
						cardContainer: deck.slice(21, 28),
						containerDisplay: [...state.containers[2][6].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(21, 28)]}),
					},
					{
						cardContainer: deck.slice(28, 36),
						containerDisplay: [...state.containers[2][7].containerDisplay],
						validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(28, 36)]}),
					},
				],
				[
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][0].containerDisplay],
						validFrom: state.containers[3][0].cardContainer.length - 1,
					},
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][1].containerDisplay],
						validFrom: state.containers[3][1].cardContainer.length - 1,
					},
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][2].containerDisplay],
						validFrom: state.containers[3][2].cardContainer.length - 1,
					},
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][3].containerDisplay],
						validFrom: state.containers[3][3].cardContainer.length - 1,
					},
				],
				[
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[4][0].containerDisplay],
						validFrom: null,
					},
				],
			]
			return {...newContainer};
		}

		// case 'ATTEMPTAUTOMOVE': {
		// 	const moveState = {...state};
		// 	const containers = [...moveState.containers];
		// 	console.log(containers);
		// 	if (moveState) {
		// 		let emptyContainer = [];
		// 		for (let i = 3; i > 1; --i) {
		// 			for (let j = 0; j < containers[i].length; ++j) {
		// 				if (containers[i][j].cardContainer.length > 0) {
		// 					const endCard = containers[i][j].cardContainer.slice(-1)[0];
		// 					console.log(endCard, action.payload.card);
		// 					if (endCard.number === action.payload.card.number+1) {
		// 						console.log('matched number')
		// 						if (i === 3 && containers[action.payload.container[0]][action.payload.container[1]].cardContainer.length-1 === action.payload.position && (endCard.suit === action.payload.card.suit)) {
		// 							console.log('Valid Drop in Finished')
		// 						} else if (i === 2 && ((endCard.suit<2) !== (action.payload.card.suit<2))) {
		// 							console.log('valid drop in inplay');
		// 							console.log(i, j);
		// 							// const newCards = 
		// 							//moveState.containers[action.payload.container[0]][action.payload.container[1]].cardContainer.splice(action.payload.position);
		// 							//containers[action.payload.container[0]][action.payload.container[1]].validFrom = containerCheck(containers[action.payload.container[0]][action.payload.container[1]]);
		// 							containers[i][j].cardContainer.push(containers[action.payload.container[0]][action.payload.container[1]].cardContainer.slice(action.payload.position));
		// 							containers[i][j].validFrom = containerCheck(moveState.containers[i][j]);
		// 							return {
		// 								...moveState,
		// 								containers: [...containers],
		// 								moves: moveState.moves+1,
		// 							};
		// 						}
		// 					}
		// 				} else if (i === 2) {
		// 					emptyContainer.push(j);
		// 				}
		// 			}
		// 		}
		// 	}
		// 	return {...moveState};
			// console.log('AUTO MOVE');
			// const autoMoveState = state;
			// //const startingContainer = autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]];
			
			// //let cardToMove = startingContainer.cardContainer[action.payload.position];
			// // Check Finished pile first, as it is most likely the user intends to send card to Finished Pile
			// 	// Remember, when double clicking, only one card is able to be dropped into Finished Containers.
			// if (autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer.length-1 === action.payload.position) {
			// 	// Clicked card has no children
			// 	for (let i = 0; i < autoMoveState.containers[3].length; ++i) {
			// 		const finishedContainer = autoMoveState.containers[3][i].cardContainer;
			// 		if (autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer[action.payload.position].number === 0 && finishedContainer.length === 0) {
			// 			const newCards = autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer.splice(-1);
			// 			if (action.payload.cardContainer[0] === 2 || action.payload.cardContainer[0] === 3) {
			// 				autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].validFrom = containerCheck(autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]]);
			// 			}
			// 			autoMoveState.containers[3][i].cardContainer.push(...newCards);
			// 			autoMoveState.containers[3][i].validFrom = containerCheck(autoMoveState.containers[2][i]);
			// 			return {...autoMoveState};
			// 		}

			// 		if (finishedContainer.length > 0 && finishedContainer[finishedContainer.length-1].suit === autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer[action.payload.position].suit && finishedContainer[finishedContainer.length-1].number === autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer[action.payload.position].number-1) {
			// 			const newCards = autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer.splice(-1);
			// 			if (action.payload.cardContainer[0] === 2 || action.payload.cardContainer[0] === 3) {
			// 				autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].validFrom = containerCheck(autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]]);
			// 			}
			// 			autoMoveState.containers[3][i].cardContainer.push(...newCards);
			// 			autoMoveState.containers[3][i].validFrom = containerCheck(autoMoveState.containers[2][i]);
			// 			return {...autoMoveState};
			// 		}
			// 	}
			// }
			// const emptyInPlay = [];

			// for (let i = 0; i < autoMoveState.containers[2].length; ++i) {
			// 	//const inPlayContainer = autoMoveState.containers[2][i];
				
			// 	if (autoMoveState.containers[2][i].cardContainer.length > 0) {
			// 		//const lastCard = autoMoveState.containers[2][i].cardContainer[autoMoveState.containers[2][i].cardContainer.length-1];
			// 		console.log(autoMoveState)
			// 		//if (autoMoveState.containers[2][i].cardContainer.length > 0 && autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer.length > 0) {
			// 			//if ((autoMoveState.containers[2][i].cardContainer[autoMoveState.containers[2][i].cardContainer.length-1].suit < 2) !== (autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer[action.payload.position].suit < 2) && autoMoveState.containers[2][i].cardContainer[autoMoveState.containers[2][i].cardContainer.length-1].number === autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer[action.payload.position].number+1) {
			// 				const newCards = autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer.splice(action.payload.position);
			// 				autoMoveState.containers[2][i].cardContainer.push(...newCards);
			// 				autoMoveState.containers[action.payload.container[0]][action.payload.container[1]].validFrom = containerCheck(autoMoveState.containers[action.payload.container[0]][action.payload.container[1]]);
			// 				autoMoveState.containers[2][i].validFrom = containerCheck(autoMoveState.containers[2][i]);
			// 				return {...autoMoveState};
			// 			//}
			// 		//}
			// 	} else {
			// 		emptyInPlay.push(i);
			// 	}
			// }
			// // if (emptyInPlay.length > 0) {
			// // 	const newCards = autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]].cardContainer.splice(action.payload.position);
			// // 	autoMoveState.containers[action.payload.container[0]][action.payload.container[1]].validFrom = containerCheck(autoMoveState.containers[action.payload.cardContainer[0]][action.payload.cardContainer[1]]);
			// // 	autoMoveState.containers[2][emptyInPlay[0]].cardContainer.push(...newCards);
			// // 	autoMoveState.containers[2][emptyInPlay[0]].validFrom = containerCheck(autoMoveState.containers[2][emptyInPlay[0]]);
			// // 	return {...autoMoveState};
			// // }
		//}
		case 'FLIPCARDS': {
			const flipState = state;
			const newCards = flipState.containers[1][0].cardContainer.splice(0, flipState.difficulty);
			flipState.containers[4][0].cardContainer.push(...flipState.containers[0][0].cardContainer.splice(0));
			flipState.containers[0][0].cardContainer.push(...newCards);
			flipState.moves += 1;
			flipState.containers[0][0].validFrom = flipState.containers[0][0].cardContainer.length -1;
			return {...flipState};
		}
		case 'RESETFLIPPEDCARDS': {
			const resetFlipState = state;
			resetFlipState.containers[4][0].cardContainer.push(...resetFlipState.containers[0][0].cardContainer.splice(0));
			resetFlipState.containers[1][0].cardContainer = resetFlipState.containers[4][0].cardContainer.splice(0);
			resetFlipState.moves += 1;
			return {...resetFlipState};
		}
		case 'SETCOLUMNBOUNDS': {
			const updateState = state;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return {...updateState};
		}
		case 'SETMIDDLELINE': {	// payload: number
			const midLineState = state;
			midLineState.middleLine = action.payload;
			return {...midLineState};
		}
		case 'MOVECARD': {		// payload: {cardTop: number, cardLeft: number, StartingContainer: number[]}
			let cardTop = action.payload.cardTop;
			let cardLeft = action.payload.cardLeft;
			let moveState = state;
			console.log(action.payload.cardTop, moveState.middleLine);
			if (cardTop < moveState.middleLine) {
				// Card is dropped above the middle line, can only be validly dropped into finished containers
				const containers = state.containers[3]; // 3 = Finished Containers
				for (let i = 0; i < containers.length; ++i) {
					// Check if cards are dropped within the bounds of the columns
					if (containers[i].containerDisplay[0] < cardLeft && cardLeft < containers[i].containerDisplay[1]) {
						if (3 === action.payload.StartingContainer[0] && i === action.payload.StartingContainer[1]) {
							// Card is from the same container as it was dropped, reset it
							return {...moveState};
						} else {
							// Card dropped within bounds of Finished Container
							if(containers[i].cardContainer.length > 0) {
								// check if the card being dropped is valid
								if (dropCheckFinished(moveState.containers[3][i].cardContainer.slice(-1)[0], moveState.containers, [action.payload.StartingContainer[0], action.payload.StartingContainer[1]], action.payload.StartingContainer[0] === 3 ? moveState.containers[3][action.payload.StartingContainer[1]].cardContainer.length-1 : action.payload.position)) {
									const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.StartingContainer[0] !== 3 ? action.payload.position : -1);
									moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].validFrom = containerCheck(moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]]);
									moveState.containers[3][i].cardContainer.push(...addToContainer);
									if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
										moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
										//moveState.containers[4][0].validFrom = containerCheck(moveState.containers[4][0]);
									}
									moveState.moves += 1;
									return {...moveState};
								} else {
									// If incorrect placement, reset position
									return {...moveState};
								}
							} else if (moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position].number === 0) {
								// Card being dropped is the 0 card to an empty container.
								if (moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.length === action.payload.position+1) {
									// card has no children, and can be added to finished container
									const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.StartingContainer[0] !== 3 ? action.payload.position : -1);
									moveState.containers[3][i].cardContainer.push(...addToContainer);
									moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].validFrom = containerCheck(moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]]);
									if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
										moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
										//moveState.containers[4][0].validFrom = containerCheck(moveState.containers[4][0]);
									}
									moveState.moves += 1;
									return {...moveState};
								} else {
									return {...moveState};
								}
							} else {
								// Card is not the 0th card, reset position
								return {...moveState};
							}
						}
					}
				}
				// If dropped anywhere else, reset position
				return {...moveState};
			} else {
				// Below Dividing Line (InPlay Containers)
				const containers = state.containers[2]; // 2 = InPlay containers
				for (let i = 0; i < containers.length; ++i) {
					// Check if cards are dropped within the bounds of the columns
					if ((containers[i].containerDisplay[0] < cardLeft) && (cardLeft < containers[i].containerDisplay[1])) {
						if (2 === action.payload.StartingContainer[0] && i === action.payload.StartingContainer[1]) {
							// Card is from the same container as it was dropped, reset it
							return {...moveState};
						} else {
							// Check if the container has any cards
							if(containers[i].cardContainer.length > 0) { 
								// check if the card being dropped is valid
								const secondCard = action.payload.StartingContainer[0] === 3 ? moveState.containers[3][action.payload.StartingContainer[1]].cardContainer.length-1 : moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position];
								if (dropCheckInPlay(moveState.containers[2][i].cardContainer.slice(-1)[0], secondCard, state)) {
									const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
									moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].validFrom = containerCheck(moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]]);
									moveState.containers[2][i].cardContainer.push(...addToContainer);
									moveState.containers[2][i].validFrom = containerCheck(moveState.containers[2][i]);
									if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
										moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
									}
									moveState.moves += 1;
									return {...moveState};
								} else {
									// Incorrect placement, reset position
									return {...moveState};
								}
							} else {
								// Is an empty container, can put any card there
								const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
								moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].validFrom = containerCheck(moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]]);
								moveState.containers[2][i].cardContainer.push(...addToContainer);
								moveState.containers[2][i].validFrom = containerCheck(moveState.containers[2][i]);
								if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
									moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
								}
								moveState.moves += 1;
								return {...moveState};
							}
						}
					}
				}
				// Dropped elsewhere, reset position
				return {...moveState};
			}
		}
		default:
			return new Error('Not an available Action Type');
	  }
}