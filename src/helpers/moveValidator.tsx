export const validateAutoMove = (state: any, container: number[], position: number) => {
	const card = state.containers[container[0]][container[1]].cardContainer[position];

	if (card.number === 0) {
		for (let i = 0; i < 4; ++i) {
			if (state.containers[3][i].cardContainer.length === 0) {
				// return container info
				return {
					cardTop: state.middleLine-1,
					cardLeft: state.containers[3][i].containerDisplay[0]+1,
					StartingContainer: container,
					position: position,
				}
			}
		}
	}
	for (let i = 0; i < 4; ++i) {
		if (state.containers[3][i].cardContainer.length > 0) {
			const finCard = state.containers[3][i].cardContainer[state.containers[3][i].cardContainer.length-1];
			if (card.number === finCard.number+1 && card.suit === finCard.suit) {
				// return container info
				return {
					cardTop: state.middleLine-1,
					cardLeft: state.containers[3][i].containerDisplay[0]+1,
					StartingContainer: container,
					position: position,
				}
			}
		}
	}

	const emptyContainer = [];
	for (let i = 0; i < 7; ++i) {
		if (state.containers[2][i].cardContainer.length > 0) {
			const inPlayCard = state.containers[2][i].cardContainer[state.containers[2][i].cardContainer.length-1];
			if (card.number === inPlayCard.number-1 && card.suit<2 !== inPlayCard.suit<2) {
				// return container info
				return {
					cardTop: state.middleLine+1,
					cardLeft: state.containers[2][i].containerDisplay[0]+1,
					StartingContainer: container,
					position: position,
				}
			}
		} else {
			emptyContainer.push(i);
		}
	}
	if (emptyContainer.length > 0) {
		// return container info
		return {
			cardTop: state.middleLine+1,
			cardLeft: state.containers[2][emptyContainer[0]].containerDisplay[0]+1,
			StartingContainer: container,
			position: position,
		}
	}
	// return failed number
	return {
		position: -1,
	}




	// for (let i = 3; i > 1; --i) {
	// 	for (let j = 0; j < state.containers[i].length; ++j) {
	// 		if (state.containers[i][j].cardContainer.length > 0) {
	// 			const endCard = state.containers[i][j].cardContainer.slice(-1)[0];
	// 			console.log(endCard, action.payload.card);
	// 			if (endCard.number === action.payload.card.number+1) {
	// 				console.log('matched number')
	// 				if (i === 3 && state.containers[action.payload.container[0]][action.payload.container[1]].cardContainer.length-1 === action.payload.position && (endCard.suit === action.payload.card.suit)) {
	// 					console.log('Valid Drop in Finished')
	// 				} else if (i === 2 && ((endCard.suit<2) !== (action.payload.card.suit<2))) {
	// 					console.log('valid drop in inplay');
	// 					console.log(i, j);
	// 					// const newCards = 
	// 					//moveState.containers[action.payload.container[0]][action.payload.container[1]].cardContainer.splice(action.payload.position);
	// 					//containers[action.payload.container[0]][action.payload.container[1]].validFrom = containerCheck(containers[action.payload.container[0]][action.payload.container[1]]);
	// 					state.containers[i][j].cardContainer.push(containers[action.payload.container[0]][action.payload.container[1]].cardContainer.slice(action.payload.position));
	// 					state.containers[i][j].validFrom = containerCheck(state.containers[i][j]);
	// 					return {
	// 						...moveState,
	// 						containers: [...containers],
	// 						moves: moveState.moves+1,
	// 					};
	// 				}
	// 			}
	// 		} else if (i === 2) {
	// 			emptyContainer.push(j);
	// 		}
	// 	}
	// }
}