import { shuffleDeck } from './context';
import type { gameContainer, container, card } from './context';

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

const deepCopyState = (state: gameContainer) => {
	const newState: gameContainer = {
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
		difficulty: state.difficulty,
		middleLine: state.middleLine,
		window: [...state.window],
		moves: state.moves,
		lastMove: [...state.lastMove],
	}
	return newState;
}

const compareCards = (isSameSuit: boolean, lCard: card, rCard: card, fromHasChildren: boolean) => {
	// Check if the suit of both cards are the same
	if (lCard.suit === rCard.suit || (rCard.suit === -1 && isSameSuit)) {
		// Check if it is supposed to be the same suit (Finished Container) and that the rCard has no children. If so, check if numbers are sequential.
		return (isSameSuit && !fromHasChildren && lCard.number === rCard.number+1);
	} else {	
		// Check if it is supposed to be different suits (In-Play Container), if so, check that the colors are different, and numbers are sequential
		return (rCard.suit === -1 || (!isSameSuit && lCard.suit < 2 !== rCard.suit <2 && lCard.number === rCard.number-1));
	}
}

const updateContainer = (containers: any, first: number, second: number) => {
	// Check if the container is "In-Play", if so, validate like normal. If it is from Draw Pile, check if Draw pile is empty, If not, validate last card in container.	
	if (first === 2) {
		containers[first][second].validFrom = containerCheck(containers[first][second]);
	} else if (first === 0 && containers[0][0].cardContainer.length === 0 && containers[4][0].cardContainer.length > 0) {
		const newCards = containers[4][0].cardContainer.splice(-1);
		containers[0][0].cardContainer.push(...newCards);
		containers[0][0].validFrom = containers[0][0].cardContainer.length -1;
		containers[4][0].changed = !containers[4][0].changed;
	} else {
		containers[first][second].validFrom = containers[first][second].cardContainer.length -1;
	}
	// It is ok to flip the container, as it will not be flipped twice, the checks will already have failed if the card was dropped into its own container
	containers[first][second].changed = !containers[first][second].changed;

	return containers;
}

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

export const cardReducer = (state: gameContainer, action: {type: string, payload: any}) => {
	switch (action.type) {
		case 'NEWGAME': {
			const deck = shuffleDeck();
			const newContainer : gameContainer = {
				difficulty: action.payload.difficulty,
				middleLine: state.middleLine,
				moves: 0,
				window: state.window,
				containers: [
					[
						{
							cardContainer: deck.slice(0, 0),
							containerDisplay: state.containers[0][0].containerDisplay,
							validFrom: 0,
							changed: !state.containers[0][0].changed,
						},
					],
					[
						{
							cardContainer: deck.slice(36),
							containerDisplay: state.containers[1][0].containerDisplay,
							validFrom: 0,
							changed: !state.containers[1][0].changed,
						},
					],
					[
						{
							cardContainer: deck.slice(0, 1),
							containerDisplay: state.containers[2][0].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(0, 1)]}),
							changed: !state.containers[2][0].changed,
						},
						{
							cardContainer: deck.slice(1, 3),
							containerDisplay: state.containers[2][1].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(1, 3)]}),
							changed: !state.containers[2][1].changed,
						},
						{
							cardContainer: deck.slice(3, 6),
							containerDisplay: state.containers[2][2].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(3, 6)]}),
							changed: !state.containers[2][2].changed,
						},
						{
							cardContainer: deck.slice(6, 10),
							containerDisplay: state.containers[2][3].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(6, 10)]}),
							changed: !state.containers[2][3].changed,
						},
						{
							cardContainer: deck.slice(10, 15),
							containerDisplay: state.containers[2][4].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(10, 15)]}),
							changed: !state.containers[2][4].changed,
						},
						{
							cardContainer: deck.slice(15, 21),
							containerDisplay: state.containers[2][5].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(15, 21)]}),
							changed: !state.containers[2][5].changed,
						},
						{
							cardContainer: deck.slice(21, 28),
							containerDisplay: state.containers[2][6].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(21, 28)]}),
							changed: !state.containers[2][6].changed,
						},
						{
							cardContainer: deck.slice(28, 36),
							containerDisplay: state.containers[2][7].containerDisplay,
							validFrom: containerCheck({validFrom: -1, cardContainer: [...deck.slice(28, 36)]}),
							changed: !state.containers[2][7].changed,
						},
					],
					[
						{
							cardContainer: deck.slice(0, 0),
							containerDisplay: state.containers[3][0].containerDisplay,
							validFrom: 0,
							changed: !state.containers[3][0].changed,
						},
						{
							cardContainer: deck.slice(0, 0),
							containerDisplay: state.containers[3][1].containerDisplay,
							validFrom: 0,
							changed: !state.containers[3][1].changed,
						},
						{
							cardContainer: deck.slice(0, 0),
							containerDisplay: state.containers[3][2].containerDisplay,
							validFrom: 0,
							changed: !state.containers[3][2].changed,
						},
						{
							cardContainer: deck.slice(0, 0),
							containerDisplay: state.containers[3][3].containerDisplay,
							validFrom: 0,
							changed: !state.containers[3][3].changed,
						},
					],
					[
						{
							cardContainer: deck.slice(0, 0),
							containerDisplay: state.containers[4][0].containerDisplay,
							validFrom: 0,
							changed: !state.containers[4][0].changed,
						},
					],
				],
				lastMove: [],
			};
			return {...newContainer};
		}

		case 'FLIPCARDS': {
			const flipState = deepCopyState(state);
			flipState.lastMove = containerCopy([...state.containers]);
			const newCards = flipState.containers[1][0].cardContainer.splice(0, flipState.difficulty);
			flipState.containers[1][0].changed = !flipState.containers[1][0].changed;
			flipState.containers[4][0].cardContainer.push(...flipState.containers[0][0].cardContainer.splice(0));
			flipState.containers[0][0].cardContainer.push(...newCards);
			flipState.moves += 1;
			flipState.containers[0][0].validFrom = flipState.containers[0][0].cardContainer.length -1;
			flipState.containers[0][0].changed = !flipState.containers[0][0].changed;
			
			return {...flipState};
		}
		case 'RESETFLIPPEDCARDS': {
			const resetFlipState = deepCopyState(state);
			resetFlipState.lastMove = containerCopy(state.containers);
			resetFlipState.containers[4][0].cardContainer.push(...resetFlipState.containers[0][0].cardContainer.splice(0));
			resetFlipState.containers[1][0].cardContainer = resetFlipState.containers[4][0].cardContainer.splice(0);
			resetFlipState.containers[1][0].changed = !resetFlipState.containers[1][0].changed;
			resetFlipState.moves += 1;
			return {...resetFlipState};
		}
		case 'SETCOLUMNBOUNDS': {
			const updateState = deepCopyState(state);
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return {...updateState};
		}
		case 'SETMIDDLELINE': {	// payload: number
			const midLineState = deepCopyState(state);
			midLineState.middleLine = action.payload[0];
			midLineState.window = [action.payload[1], action.payload[2]];
			return {...midLineState};
		}

		case 'MOVECARD': { 
				// payload: {to: [container 1, container 2, cardPosition] | [], from: [container 1, container 2, cardPosition], cardTop: number | null, cardLeft: number | null}
			const moveState = deepCopyState(state);
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
					// Update From Container, splice cards off of "from" container, Previous check prevents move than 1 card bein sent to Finished container
				moveState.lastMove = containerCopy(state.containers);
				const newCards = moveState.containers[pay.from[0]][pay.from[1]].cardContainer.splice(pay.from[2]);
				moveState.containers = updateContainer(moveState.containers, pay.from[0], pay.from[1]);
					// Add cards to "to" container, then validate like above
				moveState.containers[pay.to[0]][pay.to[1]].cardContainer.push(...newCards);
				moveState.containers = updateContainer(moveState.containers, pay.to[0], pay.to[1]);
				moveState.moves += 1;
				return {...moveState};
			} else {
				// Check Failed, update "from" container to allow resetting of dropped card
				moveState.containers[pay.from[0]][pay.from[1]].changed = !moveState.containers[pay.from[0]][pay.from[1]].changed
				return {...moveState}
			}
		}

		case 'UNDO': {
			if (state.lastMove.length > 0) {
				const newState = deepCopyState(state);
				console.log(newState.containers, newState.lastMove);
				newState.containers = [...newState.lastMove];
				newState.lastMove = [];
				newState.moves += 1;
				return {...newState};
			} else {
				return {...state};
			}
		}




		// case 'MOVECARD': {		// payload: {cardTop: number, cardLeft: number, StartingContainer: number[], isUndo?: boolean, endingContainer?: number[]}
		// 	let cardTop = action.payload.cardTop;
		// 	let cardLeft = action.payload.cardLeft;

		// 	let moveState = deepCopyState(state);

		// 	const cont0 = action.payload.StartingContainer[0];
		// 	const cont1 = action.payload.StartingContainer[1];

		// 	if (action.payload.isUndo) {
		// 		// User pressed undo button, move cards back
			
		// 		return {...moveState};
		// 	} else if (cardTop < moveState.middleLine) {
		// 		// Card is dropped above the middle line, can only be validly dropped into finished containers
		// 		const containers = state.containers[3]; // 3 = Finished Containers
		// 		for (let i = 0; i < containers.length; ++i) {
		// 			// Check if cards are dropped within the bounds of the columns
		// 			if (containers[i].containerDisplay[0] < cardLeft && cardLeft < containers[i].containerDisplay[1]) {
		// 				if (3 === cont0 && i === cont1) {
		// 					// Card is from the same container as it was dropped, reset it
		// 					moveState.containers[3][i].changed = !moveState.containers[3][i].changed;
		// 					return {...moveState};
		// 				} else {
		// 					// Card dropped within bounds of Finished Container
		// 					if(containers[i].cardContainer.length > 0) {
		// 						// check if the card being dropped is valid
		// 						if (dropCheckFinished(moveState.containers[3][i].cardContainer.slice(-1)[0], moveState.containers, [cont0, action.payload.StartingContainer[1]], cont0 === 3 ? moveState.containers[3][cont1].cardContainer.length-1 : action.payload.position)) {
		// 							const addToContainer = moveState.containers[cont0][cont1].cardContainer.splice(cont0 !== 3 ? action.payload.position : -1);
		// 							moveState.containers[cont0][cont1].changed = !moveState.containers[cont0][cont1].changed;
		// 							if (cont0 !== 0) {
		// 								moveState.containers[cont0][cont1].validFrom = containerCheck(moveState.containers[cont0][cont1]);
		// 							}
		// 							moveState.containers[3][i].cardContainer.push(...addToContainer);
		// 							moveState.containers[3][i].changed = !moveState.containers[3][i].changed;
		// 							if (cont0 === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
		// 								moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
		// 								//moveState.containers[4][0].validFrom = containerCheck(moveState.containers[4][0]);
		// 							}
		// 							moveState.moves += 1;
		// 							return {...moveState};
		// 						} else {
		// 							// If incorrect placement, reset position
		// 							moveState.containers[3][i].changed = !moveState.containers[3][i].changed;
		// 							return {...moveState};
		// 						}
		// 					} else if (moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position].number === 0) {
		// 						// Card being dropped is the 0 card to an empty container.
		// 						if (moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.length === action.payload.position+1) {
		// 							// card has no children, and can be added to finished container
		// 							const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.StartingContainer[0] !== 3 ? action.payload.position : -1);
		// 							moveState.containers[cont0][cont1].changed = !moveState.containers[cont0][cont1].changed;
		// 							moveState.containers[3][i].cardContainer.push(...addToContainer);
		// 							moveState.containers[3][i].changed = !moveState.containers[3][i].changed;
		// 							if (cont0 !== 0) {
		// 								moveState.containers[cont0][cont1].validFrom = containerCheck(moveState.containers[cont0][cont1]);
		// 							} else {
		// 								moveState.containers[0][0].validFrom = moveState.containers[0][0].cardContainer.length -1;
		// 							}
		// 							if (cont0 === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
		// 								moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
		// 								moveState.containers[0][0].changed = !moveState.containers[0][0].changed;
		// 							}
		// 							moveState.moves += 1;
		// 							return {...moveState};
		// 						} else {
		// 							moveState.containers[cont0][cont1].changed = !moveState.containers[cont0][cont1].changed;
		// 							return {...moveState};
		// 						}
		// 					} else {
		// 						// Card is not the 0th card, reset position
		// 						return {...moveState};
		// 					}
		// 				}
		// 			}
		// 		}
		// 		// If dropped anywhere else, reset position
		// 		return {...moveState};
		// 	} else {
		// 		// Below Dividing Line (InPlay Containers)
		// 		const containers = state.containers[2]; // 2 = InPlay containers
		// 		for (let i = 0; i < containers.length; ++i) {
		// 			// Check if cards are dropped within the bounds of the columns
		// 			if ((containers[i].containerDisplay[0] < cardLeft) && (cardLeft < containers[i].containerDisplay[1])) {
		// 				if (2 === action.payload.StartingContainer[0] && i === action.payload.StartingContainer[1]) {
		// 					// Card is from the same container as it was dropped, reset it
		// 					moveState.containers[2][i].changed = !moveState.containers[2][i].changed;
		// 					return {...moveState};
		// 				} else {
		// 					// Check if the container has any cards
		// 					if(containers[i].cardContainer.length > 0) { 
		// 						// check if the card being dropped is valid
		// 						const secondCard = action.payload.StartingContainer[0] === 3 ? moveState.containers[3][action.payload.StartingContainer[1]].cardContainer[moveState.containers[3][action.payload.StartingContainer[1]].cardContainer.length-1] : moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position];
		// 						if (dropCheckInPlay(moveState.containers[2][i].cardContainer.slice(-1)[0], secondCard, state)) {
		// 							const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
		// 							moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].changed = !moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]];
		// 							moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].validFrom = containerCheck(moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]]);
		// 							moveState.containers[2][i].cardContainer.push(...addToContainer);
		// 							moveState.containers[2][i].changed = !moveState.containers[2][i].changed;
		// 							moveState.containers[2][i].validFrom = containerCheck(moveState.containers[2][i]);
		// 							if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
		// 								moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
		// 								moveState.containers[0][0].changed = !moveState.containers[0][0].changed;
		// 							}
		// 							moveState.moves += 1;
		// 							return {...moveState};
		// 						} else {
		// 							// Incorrect placement, reset position
		// 							moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].changed = !moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]];
		// 							return {...moveState};
		// 						}
		// 					} else {
		// 						// Is an empty container, can put any card there
		// 						const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
		// 						moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].changed = !moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].changed;
		// 						moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].validFrom = containerCheck(moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]]);
		// 						moveState.containers[2][i].cardContainer.push(...addToContainer);
		// 						moveState.containers[2][i].changed = !moveState.containers[2][i].changed;
		// 						moveState.containers[2][i].validFrom = containerCheck(moveState.containers[2][i]);
		// 						if (action.payload.StartingContainer[0] === 0 && state.containers[0][0].cardContainer.length === 0 && state.containers[4][0].cardContainer.length > 0) {
		// 							moveState.containers[0][0].cardContainer = moveState.containers[4][0].cardContainer.splice(-1);
		// 							moveState.containers[0][0].changed = !moveState.containers[0][0].changed;
		// 						}
		// 						moveState.moves += 1;
		// 						return {...moveState};
		// 					}
		// 				}
		// 			}
		// 		}
		// 		// Dropped elsewhere, reset position
		// 		moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].changed = !moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]];
		// 		return {...moveState};
		// 	}
		// }
		default:
			return state;
}
}