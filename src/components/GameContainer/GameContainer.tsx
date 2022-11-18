import PlayCard from '../PlayCard/PlayCard';
import ColumnContainer from '../ColumnContainer/ColumnContainer';
import FinishedContainer from '../FinishedContainer/FinishedContainer';
import DrawContainer from '../DrawContainer/DrawContainer';
import SelectionContainer from '../SelectionContainer/SelectionContainer';

import classes from './GameContainer.module.css'

import { useState } from 'react';
 
const GameContainer = () => {
	
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

	const cardGenerator = () => {
		const orderedDeck = [];
		for (let suit = 0; suit < 4; ++suit) {
			for (let num = 0; num < 16; ++num) {
				orderedDeck.push(<PlayCard isRed={suit<2} key={`${suit}${num}`}num={num} suit={suit}/>);
			}
		}
		return orderedDeck;
	}

	const shuffle = (origDeck: JSX.Element[]) => {
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

	const [orderedDeck] = useState(cardGenerator());
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
	)

	return (
		<>
			<div className={classes.topContainer}>
				<DrawContainer flipCards={flipCards} isEmpty={cardLayout.Draw.length === 0}/>
				<SelectionContainer set={cardLayout.Shown} />
				<FinishedContainer key={'fin0'} set={cardLayout.Fin0} />
				<FinishedContainer key={'fin1'} set={cardLayout.Fin1} />
				<FinishedContainer key={'fin2'} set={cardLayout.Fin2} />
				<FinishedContainer key={'fin3'} set={cardLayout.Fin3} />
			</div>
			<div className={classes.columns}>
				<ColumnContainer key={0} set={cardLayout.Col0} />
				<ColumnContainer key={1} set={cardLayout.Col1} />
				<ColumnContainer key={2} set={cardLayout.Col2} />
				<ColumnContainer key={3} set={cardLayout.Col3} />
				<ColumnContainer key={4} set={cardLayout.Col4} />
				<ColumnContainer key={5} set={cardLayout.Col5} />
				<ColumnContainer key={6} set={cardLayout.Col6} />
				<ColumnContainer key={7} set={cardLayout.Col7} />
			</div>
		</>
	)
}

export default GameContainer;