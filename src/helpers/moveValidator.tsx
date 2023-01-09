// Type imports from Context
import type { card, container, gameContainer } from "../context/context";
import { deepCopyState } from "../context/reducers";

// Validate that the double clicked card can be put somewhere else.
	// Check in specific order so that most logical placement is used.
		// First if card can be put into one of the finished piles
		// Then if there is a card it can be put ontop of in the In-Play piles
		// If there still isn't a place, put into an empty In-Play column
		// Finally, if none of the above are valid, don't move
export const validateAutoMove = (
	containers: container[][],	// The Containers of the state. We don't know where the card is from, so we need all containers
/* Note: Technically both Draw and Hidden piles cannot have a card moved from them, since the function shallow copies arrays, this shouldn't take any more resources */
	container: number[],		// An array of where the clicked card is, if there is a valid placement, this will be used with {position} to make the {from} array
	position: number,			// The position in the container of the clicked card
): {to: number[], from?: number[]} => { // Returns an array with the to and from container positions to move card (or {to: []} for invalid card move)

	// Check if the card selected is valid as a movable card (both exists, and is in a "free" position)
	if (typeof containers[container[0]][container[1]].cardContainer[position] !== 'undefined'
		&& containers[container[0]][container[1]].validFrom <= position
		&& container[0] !== 1 && container[0] !== 4)
	{
		// Copy card info for easy access. Garenteed to exist as above check will catch an invalid selection
		const card: card = containers[container[0]][container[1]].cardContainer[position];

		// If the clicked card is the 0th card, find the first open finished container, place it there
			// Since it is the 0th card, there should be an open finished container as no other card can start the finished pile, with the exception
			// of it being double clicked from the finished pile, and the rest being full. In that case, if ends and will check rest of containers
		if (card.number === 0) {
			for (let i = 0; i < 4; ++i) {
				// If the selected card is from this container, don't check validity (if there is nowhere else, it will fail at the end)
				if (container[0] === 3 && container[1] === i) continue;
				// Check if finished container is empty
				if (containers[3][i].cardContainer.length === 0) {
					// return container info
					return {
						to: [3, i, -1],
						from: [container[0], container[1], position],
					}
				}
			}
		// Check if the user clicked a row of cards (a card with at least one child), if so, it can not go in a finished container, skip this search
		} else if (position === containers[container[0]][container[1]].cardContainer.length-1) {
				// This avoids checking finished containers again, as the 0th card can't go in finished container if already failed check above.
			// Check all finished containers, if there is a spot with that cards suit and is the next number, return that container info.
			for (let i = 0; i < 4; ++i) {
				// If the selected card is from this container, don't check validity (if there is nowhere else, it will fail at the end)
				if (container[0] === 3 && container[1] === i) continue;
				// Check that there is already cards in the pile here (the start of the pile (0th card) is handled in the top of the if statement)
				if (containers[3][i].cardContainer.length > 0) {
					// Get the last card in the container, will succeed since we checked there was at least one card above
					const finCard = containers[3][i].cardContainer[containers[3][i].cardContainer.length-1];
					// Check the two cards have the correct rules for being placed here
					if (card.number === finCard.number+1 && card.suit === finCard.suit) {
						// return container info
						return {
							to: [3, i, containers[3][i].cardContainer.length-1],
							from: [container[0], container[1], position],
						}
					}
				}
			}
		}
		// If it is not ready to be sent to finished container, look through the top cards of each InPlay container to see if it is allowed within that stack
		for (let i = 0; i < 8; ++i) {
			// If the selected card is from this container, don't check validity (if there is nowhere else, it will fail at the end)
			if (container[0] === 2 && container[1] === i) continue;
			// Check that there is already cards in the pile here. We handle moving to empty In-PlayContainer only if there is no other valid spot (below).
			if (containers[2][i].cardContainer.length > 0) {
				// Get the last card in the container, will succeed since we checked there was at least one card above
				const inPlayCard = containers[2][i].cardContainer[containers[2][i].cardContainer.length-1];
				// Check the two cards have the correct rules for being placed here
				if (card.number === inPlayCard.number-1 && card.suit<2 !== inPlayCard.suit<2) {
					// return container info
					return {
						to: [2, i, containers[2][i].cardContainer.length-1],
						from: [container[0], container[1], position],
					}
				}
			}
		}
		// If the card is not successful in any above check, but there is an empty spot in an In-Play container, place it there
		for (let i = 0; i < 8; ++i) {
			// If the selected card is from this container, don't check validity (if there is nowhere else, it will fail at the end)
			if (container[0] === 2 && container[1] === i) continue;
			// The container is empty, put the card/stack there; will always select left-most container.
			if (containers[2][i].cardContainer.length === 0) {
				return {
					to: [2, i, containers[2][i].cardContainer.length-1],
					from: [container[0], container[1], position],
				}
			}
		}
	}
	// Finally, there is no valid spot for the card to go or and invalid card selection, and should not be moved at all, send an object that indicated there is no valid spot
	return {
		to: [],
	}
}

// The user has every card free, all In-Play containers are valid from the 0th position, there are no cards in the Draw, Hidden, or Reset piles.
	// Find position of every card not in a Finished container and the container it should go in.
	// Return an array of all of the {to: number[], from: number[]} objects needed to finish game.
export const autoFinish = (containers: container[][]) : {to: number[], from: number[]}[] => {
	// Create starting variables, {finishSteps} to be returned at end, totalLeft to keep track of how many more cards to move
	const finishSteps = []; let totalLeft = 0;
	// Since all cards to move are in In-Play containers, add the length of each one to totalLeft, this is the amount of moves left to complete game.
	for (let i = 0; i < 8; ++i) { totalLeft += containers[2][i].cardContainer.length; }
	// Find how many cards are already in the finished containers
		// Used specifically for if I get animations for when the cards are submitted, I want to have the lowest value cards get put away first 
	const finishedTopCard = [
		containers[3][0].cardContainer.length-1,	containers[3][1].cardContainer.length-1,
		containers[3][2].cardContainer.length-1,	containers[3][3].cardContainer.length-1,
	];
	// Get the length of each In-Play container. Used to not manipulate provided {containers} state (-1 of length so it can be used as index)
	const InPlayLengths = [
		containers[2][0].cardContainer.length-1,	containers[2][1].cardContainer.length-1,
		containers[2][2].cardContainer.length-1,	containers[2][3].cardContainer.length-1,
		containers[2][4].cardContainer.length-1,	containers[2][5].cardContainer.length-1,
		containers[2][6].cardContainer.length-1,	containers[2][7].cardContainer.length-1,
	];
	// Go through all cards left in In-Play containers. There should always be a place for the cards, so {i} being lowered each time is ok since there will always be one less to put away.
		// {totalIndex} is not used as it is only to keep track of how many cards have already been marked as put away.
	for (let totalIndex = totalLeft; totalIndex > -1; --totalIndex) {
		// Find the Finished container with the lowest top value, again, used when there is animations present.
		let minContainer = Math.min(...finishedTopCard);
		// Get the first index of the Finished container with the lowest value card (will pick leftmost if there are 2 with the same value)
		let fIndex = finishedTopCard.findIndex((containerLength) => {return containerLength === minContainer});
		let cardInfo: card;
		if (containers[3][fIndex].cardContainer.length > 0) {
			// Get the number from {finishedTopCard} as we aren't actually updating the containers here. Get suit from the first card in pile, as we know it is not empty
			cardInfo = {number: finishedTopCard[fIndex], suit: containers[3][fIndex].cardContainer[0].suit};
		} else {
			cardInfo = {number: -1, suit: -1};
		}

		// Look through the top card of each In-Play container. Once found, add container positions to {finishSteps} and move on to next card. 
		for (let pIndex = 0; pIndex < 8; ++pIndex) {
			if (InPlayLengths[pIndex] >= 0 // Fail fast if there is no cards in container 
				// If the card if the 0th card, and the Finsihed pile is empty, put into {finishSteps}
				// If not, check if the suit and number matches selected Finished pile
					// Note: (same if check as either one of these passing has the same result)
				&& ((cardInfo.number === -1 && containers[2][pIndex].cardContainer[InPlayLengths[pIndex]].number === 0)
				|| (containers[2][pIndex].cardContainer[InPlayLengths[pIndex]].suit === cardInfo.suit
					&& containers[2][pIndex].cardContainer[InPlayLengths[pIndex]].number === cardInfo.number+1)
				)
			) {
				finishSteps.push({
					to: [3, fIndex, finishedTopCard[fIndex]],
					from: [2, pIndex, InPlayLengths[pIndex]],
				});
				// Update lengths of {InPlayLengths} and {finishedTopCard} as we use these to move through state.
				InPlayLengths[pIndex] -= 1;
				finishedTopCard[fIndex] += 1;
				break;
			}
		}
	}
	return finishSteps;
}