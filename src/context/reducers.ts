import { shuffleDeck } from './context';

const dropCheckInPlay: (lVal: {number: number, suit: number}, rVal: {number: number, suit: number}, state: any) => boolean = (lVal, rVal, state) => {
	console.log(lVal, rVal);
	return ((lVal.number-1 === rVal.number) && lVal.suit < 2 !== rVal.suit < 2) ? true : false;
}

const dropCheckFinished: (lVal: {number: number, suit: number}, containers: any, starting: number[], position: number) => boolean = (lVal, containers, starting, position) => {
	const rVal = containers[starting[0]][starting[1]].cardContainer[position];
	if ((lVal.number+1 === rVal.number) && (lVal.suit === rVal.suit)) {
		if (containers[starting[0]][starting[1]].cardContainer.length > position+1) {
			return dropCheckFinished(rVal, containers, starting, position+1);;
		} else {
			return true
		}
	} else {
		return false;
	}
}

export const cardReducer = (state: any, action: any) => {
	switch (action.type) {
		case 'NEWGAME':
			const newContainer = state;
			newContainer.difficulty = action.payload.difficulty;
			const deck = shuffleDeck();
			console.log(deck);
			newContainer.containers = [
				[
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[1][0].containerDisplay],
					},
				],
				[
					{
						cardContainer: deck.slice(36),
						containerDisplay: [...state.containers[1][0].containerDisplay],

					},
				],
				[
					{
						cardContainer: deck.slice(0, 1),
						containerDisplay: [...state.containers[2][0].containerDisplay],

					},
					{
						cardContainer: deck.slice(1, 3),
						containerDisplay: [...state.containers[2][1].containerDisplay],

					},
					{
						cardContainer: deck.slice(3, 6),
						containerDisplay: [...state.containers[2][2].containerDisplay],

					},
					{
						cardContainer: deck.slice(6, 10),
						containerDisplay: [...state.containers[2][3].containerDisplay],

					},
					{
						cardContainer: deck.slice(10, 15),
						containerDisplay: [...state.containers[2][4].containerDisplay],

					},
					{
						cardContainer: deck.slice(15, 21),
						containerDisplay: [...state.containers[2][5].containerDisplay],

					},
					{
						cardContainer: deck.slice(21, 28),
						containerDisplay: [...state.containers[2][6].containerDisplay],

					},
					{
						cardContainer: deck.slice(28, 36),
						containerDisplay: [...state.containers[2][7].containerDisplay],

					},
				],
				[
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][0].containerDisplay],

					},
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][1].containerDisplay],

					},
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][2].containerDisplay],

					},
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[3][3].containerDisplay],

					},
				],
				[
					{
						cardContainer: deck.slice(0, 0),
						containerDisplay: [...state.containers[4][0].containerDisplay],

					},
				],
			]
			return {...newContainer};

		case 'FLIPCARDS':
			const flipState = state;
			const newCards = flipState.containers[1][0].cardContainer.splice(0, flipState.difficulty);
			flipState.containers[4][0].cardContainer.push(...flipState.containers[0][0].cardContainer.splice(0));
			flipState.containers[0][0].cardContainer.push(...newCards);
			flipState.moves += 1;
			return {...flipState};

		case 'RESETFLIPPEDCARDS':
			const resetFlipState = state;
			resetFlipState.containers[4][0].cardContainer.push(...resetFlipState.containers[0][0].cardContainer.splice(0));
			resetFlipState.containers[1][0].cardContainer = resetFlipState.containers[4][0].cardContainer.splice(0);
			resetFlipState.moves += 1;
			return {...resetFlipState};

		case 'SETCOLUMNBOUNDS':
			const updateState = state;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return {...updateState};
  
		case 'SETMIDDLELINE':	// payload: number
			const midLineState = state;
			midLineState.middleLine = action.payload;
			return {...midLineState};

		case 'MOVECARD':		// payload: {cardTop: number, cardLeft: number, StartingContainer: number[]}
			const cardTop = action.payload.cardTop;
			const cardLeft = action.payload.cardLeft;
			const moveState = state;
			if (cardTop < moveState.middleLine) {
				const containers = state.containers[3];
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
									const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
									moveState.containers[3][i].cardContainer.push(...addToContainer);
									if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
										moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
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
									const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
									moveState.containers[3][i].cardContainer.push(...addToContainer);
									console.log(action.payload.StartingContainer[0], state.containers[0][0].cardContainer, moveState.containers[4][0].cardContainer)
									if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
										moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
									}
									moveState.moves += 1;
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
				const containers = state.containers[2];
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
									moveState.containers[2][i].cardContainer.push(...addToContainer);
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
									moveState.containers[2][i].cardContainer.push(...addToContainer);
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

		default:
			return new Error('Not an available Action Type');
	  }
}