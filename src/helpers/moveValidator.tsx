export const validateAutoMove = (state: any, container: number[], position: number) => {
	const card = state.containers[container[0]][container[1]].cardContainer[position];

	// If the clicked card is the 0th card, find the first open finished container, place it there
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

	// Check all finished containers first, if there is a spot with that cards suit and is the next number, place it there
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

	// If it is not ready to be sent to finished container, look through the top cards of each InPlay container to see if it is allowed within that stack
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

	// If the card is not able to be allowed in any container, but there was a free spot in an InPlay container, place it there
	if (emptyContainer.length > 0) {
		// return container info
		return {
			cardTop: state.middleLine+1,
			cardLeft: state.containers[2][emptyContainer[0]].containerDisplay[0]+1,
			StartingContainer: container,
			position: position,
		}
	}

	// Finally, there is no valid spot for the card to go, and should not be moved at all, send an object that indicated there is no valid spot (position: -1)
	return {
		position: -1,
	}
}


export const autoFinish = (state: any) => {
	const usedState = structuredClone(state);
		
	const finishSteps = [];

	const InPlayLeft = [
		usedState.containers[2][0].cardContainer.length,
		usedState.containers[2][1].cardContainer.length,
		usedState.containers[2][2].cardContainer.length,
		usedState.containers[2][3].cardContainer.length,
		usedState.containers[2][4].cardContainer.length,
		usedState.containers[2][5].cardContainer.length,
		usedState.containers[2][6].cardContainer.length,
	];

	let totalLeft = 0;

	for (let i = 0; i < InPlayLeft.length; ++i) {
		totalLeft += InPlayLeft[i];
	}

	const finishedTopCard = [
		usedState.containers[3][0].cardContainer.length-1,
		usedState.containers[3][1].cardContainer.length-1,
		usedState.containers[3][2].cardContainer.length-1,
		usedState.containers[3][3].cardContainer.length-1,
	]

	for (let i = totalLeft; i > -1; --i) {
		console.log(i, totalLeft);
		let minimum = Math.min(...finishedTopCard);
		console.log(minimum)
		let finishedIndex = finishedTopCard.findIndex((topCard) => {return topCard === minimum});
		console.log(finishedIndex);
		let container = {...usedState.containers[3][finishedIndex]};
		console.log(container);
		let cardInfo = {...container.cardContainer[container.cardContainer.length-1]};
		console.log(cardInfo);
		for (let j = 0; j < 8; ++j) {
			console.log(j);
			
			if (usedState.containers[2][j].cardContainer.length > 0 && usedState.containers[2][j].cardContainer[usedState.containers[2][j].cardContainer.length-1].suit === cardInfo.suit && usedState.containers[2][j].cardContainer[usedState.containers[2][j].cardContainer.length-1].number === cardInfo.number+1) {
				finishSteps.push({
					cardTop: usedState.middleLine-1,
					cardLeft: container.containerDisplay[0]+1,
					StartingContainer: [2, j],
					position: usedState.containers[2][j].cardContainer.length-1,
				});
				usedState.containers[2][j].cardContainer.splice(-1);
				usedState.containers[3][finishedIndex].cardContainer.push({number: cardInfo.number+1, suit: cardInfo.suit});
				finishedTopCard[finishedIndex] += 1;
				break;
			}
		}
	}
	return finishSteps;
}