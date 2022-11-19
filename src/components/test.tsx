import PlayCard from './PlayCard/PlayCard';
import ColumnContainer from './ColumnContainer/ColumnContainer';
import { useState, useEffect, useCallback } from 'react';

const TestState = () => {
	// An Object that contains the bounds of different areas you can drop
	// cards into (for test, just one column)
	const [dropSections, setDropSections] = useState({col0: [0, 0]});

	// Creates 64 unique cards (16 cards of each suit)
	// For test, only 1 card is generated (0 of Hearts)
	const cardGenerator = () => {
		const orderedDeck = [];
		for (let suit = 0; suit < 1; ++suit) {
			for (let num = 0; num < 1; ++num) {
				orderedDeck.push(<PlayCard ctx={dropSections} isRed={suit<2} key={`${suit}${num}`}num={num} suit={suit}/>);
			}
		}
		return orderedDeck;
	}

	// The full deck in ascending order
	// For Test, just the one card from cardGenerator 
	const [orderedDeck] = useState(cardGenerator());

	// An object of arrays that keeps track of where each card currently is.
	// Probably could be moved to a global context, but does not produce unwanted
	// results as is.
	// For test, again, only the one card.
	const [cardLayout, setCardLayout] = useState({ Col0: orderedDeck.slice(0, 1)});

	// Just to log what is happening with dropSections whenever it changes
	useEffect(()=>{
		console.log(dropSections);
	}, [dropSections]);

	return (	
			<ColumnContainer onInit={setDropSections} containerID='col0' key='col0' set={cardLayout.Col0} />
	)
}


export default TestState;