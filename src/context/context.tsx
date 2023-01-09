import React, { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';

import{ cardReducer } from './reducers';

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

// Create cards for entire Deck in order (suits: 0-3, numbers: 0-15)
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
		lastMove: [],
		winCondition: [false, false],
	}
}

// The initial state of the gameContainer, has an initial shuffled deck, but no information for the containers bounds at first.
const initialState = createStartingDeck();

const AppContext = createContext<{state: gameContainer;}>({state: initialState,});
const AppDispatchContext = createContext<{dispatch: React.Dispatch<any>}>({dispatch: () => null})

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