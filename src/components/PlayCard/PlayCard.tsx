import classes from './PlayCard.module.css'
import Draggable from "react-draggable";
import { useState } from 'react';

const PlayCard = (props: {onMove: any, cardID: number[], key: string, currentLoc: any}) => {
	// Sets the suit symbol as a string based on suit number
	const suitSymbol = (suitNum: number) => {
		switch(suitNum) {
			case 0:	return '♥';	case 1:	return '♦';
			case 2:	return '♠';	case 3:	return '♣';
			default:throw Error('Card Suit Not Defined');
		}
	}

	// Sets the number in a string (as using hexadecimal: 0-9, A-F)
	const numberSymbol = (cardNum: number) => {
		if (cardNum < 10) return String(cardNum);
		switch(cardNum) {
			case 10: return 'A'; case 11: return 'B';
			case 12: return 'C'; case 13: return 'D';
			case 14: return 'E'; case 15: return 'F';
			default: throw Error('Card Number Not Defined');
		}
	}

	const [cardInfo, setCardInfo] = useState(
		{
			isRed: props.cardID[0] < 2,
			suitSymbol: suitSymbol(props.cardID[0]),
			numberSymbol: numberSymbol(props.cardID[1]),
		}
	);

	return (
		<Draggable onStop={(event: any, data: any) => props.onMove(event, data, props.cardID)}>
			<div className={`${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`}>
				<p>{cardInfo.numberSymbol} {cardInfo.suitSymbol}</p>
			</div>
		</Draggable>
	);
}

export default PlayCard;