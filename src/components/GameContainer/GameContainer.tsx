import PlayCard from '../PlayCard/PlayCard';
import ColumnContainer from '../ColumnContainer/ColumnContainer';
import FinishedContainer from '../FinishedContainer/FinishedContainer';
import DrawContainer from '../DrawContainer/DrawContainer';
import SelectionContainer from '../SelectionContainer/SelectionContainer';

import classes from './GameContainer.module.css'

import { useState, useEffect, useCallback } from 'react';

const GameContainer = () => {
	const [dropSections, setDropSections] = useState({
		middleLine: 0,
		fin0: [0, 0], fin1: [0, 0],	fin2: [0, 0], fin3: [0, 0],
		col0: [0, 0], col1: [0, 0],	col2: [0, 0], col3: [0, 0],
		col4: [0, 0], col5: [0, 0],	col6: [0, 0], col7: [0, 0],
		finished: [[0, 0], [0, 0], [0, 0], [0, 0]],
		columns: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	});

	const verifyPosition = useCallback((event: any, data: any, cardID: string, prevSection: string) => {
		event.preventDefault();
		const cardLocation = data.node.getBoundingClientRect();
		if (dropSections) {
			if (cardLocation.top < dropSections.middleLine)
			console.log('up');
			else {
				for (let i = 0; i < dropSections.columns.length; ++i) {
					if (dropSections.columns[i][0] < cardLocation.left && dropSections.columns[i][1] > cardLocation.left) {
						// Card drop is within the bounds of a column, and should be taken out of old column and into new one here.
						break;
					}
				}
			}
		} else {
			console.log('Window Size not found');
		}
	}, [dropSections]);


	const cardGenerator = () => {
		const orderedDeck = [];
		for (let suit = 0; suit < 4; ++suit) {
			for (let num = 0; num < 16; ++num) {
				orderedDeck.push({suit: suit, num: num});
			}
		}
		return orderedDeck;
	}


	const [orderedDeck] = useState(cardGenerator());

	const shuffle = (origDeck: {suit: number, num: number}[]) => {
		const shuffleDeck = origDeck;
		let currentIndex = shuffleDeck.length,  randomIndex;
		// While there remain elements to shuffle.
		while (currentIndex != 0) {
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

	const [shuffledDeck, setShuffledDeck] = useState(shuffle(orderedDeck));

	const [cardLayout, setCardLayout] = useState(
		{
			Draw: shuffledDeck.slice(36, 63),
			Shown: shuffledDeck.slice(0, 0),
			Hidden: shuffledDeck.slice(0, 0),
			Fin0: shuffledDeck.slice(0, 0), Fin1: shuffledDeck.slice(0, 0),
			Fin2: shuffledDeck.slice(0, 0), Fin3: shuffledDeck.slice(0, 0),
			Col0: shuffledDeck.slice(0, 1), Col1: shuffledDeck.slice(1, 3),
			Col2: shuffledDeck.slice(3, 6), Col3: shuffledDeck.slice(6, 10),
			Col4: shuffledDeck.slice(10, 15), Col5: shuffledDeck.slice(15, 21),
			Col6: shuffledDeck.slice(21, 28), Col7: shuffledDeck.slice(28, 36),
		}
	);

	const flipCards = () => {
		setCardLayout((state) => {
			if (state.Draw.length === 0 && state.Hidden.length > 0) {
				return {
					...state,
					Draw: [...state.Hidden, ...state.Shown],
					Hidden: [],
					Shown: [],
				}
			} else {
				return {
					...state,
					Draw: state.Draw.slice(4),
					Hidden: [...state.Hidden, ...state.Shown],
					Shown: state.Draw.slice(0, 4),
				}
			}
		});
	}

	useEffect(()=>{
		const bounds = document.querySelector(`#separatingLine`)?.getBoundingClientRect();
		if (bounds) {
			setDropSections((state: any) => {
				return {
					...state,
					middleLine: bounds.top-(bounds.height/2),
				}
			});
		}
	}, []);

	const createSets = (cardSet: {suit: number, num: number}[], location: string) => {
		const cardArray = [];
		for (let i = 0; i < cardSet.length; ++i) {
			const key = `${cardSet[0]}${cardSet[1]}`;
			cardArray.push(<PlayCard onMove={verifyPosition} cardID={[cardSet[i].suit, cardSet[i].num]} key={key} currentLoc={location}/>);
		}
		return cardArray;
	}

	return (
		<>		
			<div className={classes.topContainer}>
				<DrawContainer flipCards={flipCards} isEmpty={cardLayout.Draw.length === 0}/>
				<SelectionContainer>{createSets(cardLayout.Shown, 'Shown')}</SelectionContainer>
				<FinishedContainer onInit={setDropSections} containerID='fin0' key='fin0'>{createSets(cardLayout.Fin0, 'Fin0')}</FinishedContainer>
				<FinishedContainer onInit={setDropSections} containerID='fin1' key='fin1'>{createSets(cardLayout.Fin1, 'Fin1')}</FinishedContainer>
				<FinishedContainer onInit={setDropSections} containerID='fin2' key='fin2'>{createSets(cardLayout.Fin2, 'Fin2')}</FinishedContainer>
				<FinishedContainer onInit={setDropSections} containerID='fin3' key='fin3'>{createSets(cardLayout.Fin3, 'Fin3')}</FinishedContainer>
			</div>
			<div id='separatingLine' />
			<div className={classes.columns}>
				<ColumnContainer onInit={setDropSections} containerID='col0' key='col0'>{createSets(cardLayout.Col0, 'Col0')}</ColumnContainer> 
				<ColumnContainer onInit={setDropSections} containerID='col1' key='col1'>{createSets(cardLayout.Col1, 'Col1')}</ColumnContainer>
				<ColumnContainer onInit={setDropSections} containerID='col2' key='col2'>{createSets(cardLayout.Col2, 'Col2')}</ColumnContainer> 
				<ColumnContainer onInit={setDropSections} containerID='col3' key='col3'>{createSets(cardLayout.Col3, 'Col3')}</ColumnContainer> 
				<ColumnContainer onInit={setDropSections} containerID='col4' key='col4'>{createSets(cardLayout.Col4, 'Col4')}</ColumnContainer> 
				<ColumnContainer onInit={setDropSections} containerID='col5' key='col5'>{createSets(cardLayout.Col5, 'Col5')}</ColumnContainer> 
				<ColumnContainer onInit={setDropSections} containerID='col6' key='col6'>{createSets(cardLayout.Col6, 'Col6')}</ColumnContainer> 
				<ColumnContainer onInit={setDropSections} containerID='col7' key='col7'>{createSets(cardLayout.Col7, 'Col7')}</ColumnContainer> 
			</div>
		</>
	)
}

export default GameContainer;