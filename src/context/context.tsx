// React Imports:
import React, { createContext, useReducer } from 'react';
// Type Imports:
import type { ReactNode } from 'react';
// Context (reducer) Import:
import{ cardReducer } from './reducers';

/* Type definitions Start *//* Some are used throughout program, so they are exported */
// Containing info to determine all card data
export type card = {
	number: number,	// 0 - 15 (10-15 are displayed as A-F)
	suit: number, 	// 0 = Hearts, 1 = Diamonds, 2 = Spades, 3 = Clubs
}

// All Information for individual containers
export type container = {
	cardContainer: card[],
	containerDisplay: number[],
	validFrom: number,
	changed: boolean,
}

// The type for all the information required by Hexitaire
export type gameContainer = {
	containers: container[][];
	middleLine: number,
	moves: number,
	difficulty: number,
	window: number[],
	lastMove: container[][],
	winCondition: boolean[],
}
/* Type definitions End */

/* Context Management Function Start */
// Create cards for entire Deck in order (suits: 0-3, numbers: 0-15)
	// Currently there are hard coded expectations for the cards (ex. highest number 15), cannot change these values unless they are also updated throughout
export const cardGenerator = () => {
	const orderedDeck: card[] = [];
	for (let suit = 0; suit < 4; ++suit) {
		for (let num = 0; num < 16; ++num) {
			orderedDeck.push({number: num, suit: suit});
		}
	}
	return orderedDeck;
}

// Take the deck and shuffle the order of all cards
	// Currently the randomness of this process means games are not always winnable.
	// Could change this process to produce games that always have a solution
const shuffle = (origDeck: card[]) => {
	const shuffleDeck = origDeck;
	let currentIndex = shuffleDeck.length
	let randomIndex: number;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		--currentIndex;
		[shuffleDeck[currentIndex], shuffleDeck[randomIndex]] = [shuffleDeck[randomIndex], shuffleDeck[currentIndex]];
	}
	return shuffleDeck;
}

// shuffleDeck is separated from shuffle to allow for changing out the deck if needed
export const shuffleDeck = () => {
	return shuffle(cardGenerator());
}

// Create an empty gameContainer.
const createStartingContainer = (): gameContainer =>  {
	return {
		containers: [
			[
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
			],
			[
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
			],
			[
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: -1, changed: false, },
			],
			[
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
			],
			[
				{ cardContainer: [], containerDisplay: [0, 0], validFrom: 0, changed: false, },
			],
		],
		middleLine: 0,		moves: 0,		difficulty: 0,
		window: [0, 0,],	lastMove: [],	winCondition: [false, false],
	}
}
/* Context Management Function End */

// The initial state of the gameContainer, no information for the containers bounds, or cards at first.
const initialState = createStartingContainer();
// Context Creations: - State and dispatch are separate as some components don't need both
const AppContext 			= createContext<{state: gameContainer;}>		({state: initialState,});
const AppDispatchContext 	= createContext<{dispatch: React.Dispatch<{ type: string; payload: any; }>}>({dispatch: () => null})

// AppProvider supplies entire game with the context.
const AppProvider = (props: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(cardReducer, initialState);
	return (
		<AppDispatchContext.Provider value={{dispatch}}>
			<AppContext.Provider value={{state}}>
				{props.children}
			</AppContext.Provider>
		</AppDispatchContext.Provider>
	)
}

export { AppContext, AppDispatchContext, AppProvider };