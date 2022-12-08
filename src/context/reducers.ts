const dropCheckInPlay: (lVal: {number: number, suit: number}, rVal: {number: number, suit: number}) => boolean = (lVal, rVal) => {
	console.log(lVal);
	return ((lVal.number-1 === rVal.number) && lVal.suit < 2 !== rVal.suit < 2) ? true : false;
}

const dropCheckFinished: (lVal: {number: number, suit: number}, containers: any, starting: number[], position: number) => boolean = (lVal, containers, starting, position) => {
	const rVal = containers[starting[0]][starting[1]].cardContainer[position];
	console.log(lVal, rVal);
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
		case 'SETCOLUMNBOUNDS':
			const updateState = state;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return updateState;
  
		case 'SETMIDDLELINE':	// payload: number
			const midLineState = state;
			midLineState.middleLine = action.payload;
			return midLineState;

		case 'MOVECARD':		// payload: {cardTop: number, cardLeft: number, StartingContainer: number[]}
			const cardTop = action.payload.cardTop;
			const cardLeft = action.payload.cardLeft;
			const moveState = state;
			if (cardTop < moveState.middleLine) {
				const containers = state.containers[3];
				for (let i = 0; i < containers.length; ++i) {
					// Check if cards are dropped within the bounds of the columns
					if (containers[i].containerDisplay[0] < cardLeft && cardLeft < containers[i].containerDisplay[1]) {
						// Card dropped within bounds of Finished Container
						console.log('Card dropped within bounds of Finished Container');
						console.log(containers[i].cardContainer.length);
						if(containers[i].cardContainer.length > 0) {
							// check if the card being dropped is valid
							console.log('check if the card being dropped is valid')
							if (dropCheckFinished(moveState.containers[3][i].cardContainer.slice(-1)[0], moveState.containers, [action.payload.StartingContainer[0], action.payload.StartingContainer[1]], action.payload.position)) {
								const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
								moveState.containers[3][i].cardContainer.push(...addToContainer);
								moveState.moves += 1;
								return {...moveState};
							} else {
								// If incorrect placement, reset position
								console.log('Incorrect placement, reset position')
								return {...moveState};
							}
						} else if (moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position].number === 0) {
							// Card being dropped is the 0 card to an empty container.
							console.log('Card being dropped is the 0 card to an empty container')
							if (moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.length === action.payload.position+1) {
								// card has no children, and can be added to finished container
								console.log('card has no children, and can be added to finished container')
								const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
								moveState.containers[3][i].cardContainer.push(...addToContainer);
								moveState.moves += 1;
								return {...moveState};
							}
						} else {
							// Card is not the 0th card, reset position
							console.log('Card is not the 0th card, reset position')
							return {...moveState};
						}
					}
				}


				// If dropped anywhere else, reset position
				console.log('Dropped elsewhere, reset position')
				return {...moveState};



			} else {
				// Below Dividing Line (InPlay Containers)
				console.log('Below Dividing Line (InPlay Containers)')
				const containers = state.containers[2];
				for (let i = 0; i < containers.length; ++i) {
					// Check if cards are dropped within the bounds of the columns
					console.log('Check if cards are dropped within the bounds of the columns')
					if ((containers[i].containerDisplay[0] < cardLeft) && (cardLeft < containers[i].containerDisplay[1])) {
						
						// Check if the container has any cards
						console.log('Check if the container has any cards')

						if(containers[i].cardContainer.length > 0) { 
							// check if the card being dropped is valid
							console.log('check if the card being dropped is valid')
							if (dropCheckInPlay(moveState.containers[2][i].cardContainer.slice(-1)[0], moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position])) {
								const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
								moveState.containers[2][i].cardContainer.push(...addToContainer);
								moveState.moves += 1;
								return {...moveState};
							} else {
								// Incorrect placement, reset position
								console.log('Incorrect placement, reset position')
								return {...moveState};
							}
						} else {
							// Is an empty container, can put any card there
							console.log('Is an empty container, can put any card there')
							const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
								moveState.containers[2][i].cardContainer.push(...addToContainer);
								moveState.moves += 1;
								console.log(moveState);
								return {...moveState};
						}
					}
				}
				// Dropped elsewhere, reset position
				console.log('Dropped elsewhere, reset position')
				return {...moveState};
			}

		default:
			return new Error('Not an available Action Type');
	  }
}