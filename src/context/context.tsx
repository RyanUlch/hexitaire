import React, { createContext, useReducer } from 'react';
import{ cardReducer } from './reducers';

// Containing info to determine all card data
type card = {
	number: number,	// 0 - 15 (10-15 are displayed as A-F)
	suit: number, 	// 0 = Hearts, 1 = Diamonds, 2 = Spades, 3 = Clubs
}

// All Information for individual containers
type container = {
	cardContainer: card[],
	containerDisplay: number[],
	validFrom: number,
	changed: boolean,
}

// The type for all the information required by Hexitaire
export type gameContainer = {
	containers: [
		// Container containing the not shown cards to pull from for flipped container
		container[],	// Draw Pile
		// Container Users can only pull cards from
		container[],	// Hidden Draw Pile
		// Containers User can drop cards to and from
		container[],	// In Play Containers
		container[],	// Finished containers
		container[],	// Reset Draw Pile
	],
	middleLine: number,
	moves: number,
	difficulty: number,
	window: number[],
	lastMove: {
		to: number[],
		from: number[],
	}
}

// Create cards for entire Deck in order (suits: 0-3, numbers: 0-15)
const cardGenerator = () => {
	const orderedDeck: card[] = [];
	for (let suit = 0; suit < 4; ++suit) {
		for (let num = 0; num < 16; ++num) {
			orderedDeck.push({number: num, suit: suit});
		}
	}
	return orderedDeck;
}

// Take the deck and shuffle the order of all cards
const shuffle = (origDeck: card[]) => {
	const shuffleDeck = origDeck;
	let currentIndex = shuffleDeck.length,  randomIndex;
	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		--currentIndex;
		// And swap it with the current element.
		[shuffleDeck[currentIndex], shuffleDeck[randomIndex]] = [
			shuffleDeck[randomIndex], shuffleDeck[currentIndex]
		];
	}
	return shuffleDeck;
}


export const shuffleDeck = () => {
	return shuffle(cardGenerator());
}

// Take the shuffled deck and give cards to containers to create the starting State
const createStartingDeck = (): gameContainer =>  {
	return {
		containers: [
			[
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
			],
			[
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
			],
			[
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: -1,
					changed: false,
				},
			],
			[
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
			],
			[
				{
					cardContainer: [],
					containerDisplay: [0, 0],
					validFrom: 0,
					changed: false,
				},
			],
		],
		middleLine: 0,
		moves: 0,
		difficulty: 0,
		window: [0, 0,],
		lastMove: {
			to: [-1, -1, -1],
			from: [-1, -1, -1],
		}
	}
}

// The initial state of the gameContainer, has an initial shuffled deck, but no information for the containers bounds at first.
const initialState = createStartingDeck();

const AppContext = createContext<{
	state: gameContainer;
	dispatch: React.Dispatch<any>;
}>({
	state: initialState,
	dispatch: () => null
});

const AppProvider = (props: { children: any }) => {
	const [state, dispatch] = useReducer(cardReducer, initialState);
	return (
		<AppContext.Provider value={{state, dispatch}}>
			{props.children}
		</AppContext.Provider>
	)
}

export { AppContext, AppProvider };