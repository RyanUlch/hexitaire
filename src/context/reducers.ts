const dropCheckInPlay: (lVal: {number: number, suit: number}, rVal: {number: number, suit: number}) => boolean = (lVal, rVal) => {
	return ((lVal.number-1 === rVal.number) && lVal.suit < 2 !== rVal.suit < 2) ? true : false;
}

const dropCheckFinished: (lVal: {number: number, suit: number}, rVal: {number: number, suit: number}) => boolean = (lVal, rVal) => {
	return ((lVal.number+1 === rVal.number) && lVal.suit === rVal.suit) ? true : false;
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
				// above dividing line
				return {...moveState};
			} else {
				// Below Dividing Line (InPlay Containers)
				const containers = state.containers[2];
				for (let i = 0; i < containers.length; ++i) {
					// Check if cards are dropped within the bounds of the columns
					if (containers[i].containerDisplay[0] < cardLeft && cardLeft < containers[i].containerDisplay[1]) {
						// check if the card being dropped is valid
						if (dropCheckInPlay(moveState.containers[2][i].cardContainer.slice(-1)[0], moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer[action.payload.position])) {
							const addToContainer = moveState.containers[action.payload.StartingContainer[0]][action.payload.StartingContainer[1]].cardContainer.splice(action.payload.position);
							moveState.containers[2][i].cardContainer.push(...addToContainer);
							moveState.moves += 1;
							return {...moveState};
						} else {
							// If incorrect placement, reset position
							return {...moveState};
						}
					}
				}
				// If dropped anywhere else, reset position
				return {...moveState};
			}

		default:
			return new Error('Not an available Action Type');
	  }
}