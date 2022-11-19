import classes from './PlayCard.module.css'
import Draggable from "react-draggable";
import { useState, useRef } from 'react';

import { verifyPosition } from '../../helpers/verifyPosition';

const PlayCard = (props: {ctx: any, isRed: boolean, key: string, num: number, suit: number}) => {
	// Sets the suit symbol as a string based on suit number
	const suitSymbol = (suitNum: number) => {
		switch(suitNum) {
			case 0:	return '♥';	case 1:	return '♦';
			case 2:	return '♠';	case 3:	return '♣';
			default:throw Error('Card Suit Not Defined');
		}
	}

	// Sets the number in a string (as using hexidecimal: 0-9, A-F)
	const numberSymbol = (cardNum: number) => {
		if (cardNum < 10) return String(cardNum);
		switch(cardNum) {
			case 10: return 'A'; case 11: return 'B';
			case 12: return 'C'; case 13: return 'D';
			case 14: return 'E'; case 15: return 'F';
			default: throw Error('Card Number Not Defined');
		}
	}

	// Removed Draggable for test, instead of onStop (dropping a card),
	// The div runs verifyPosition helper function with the state value passed from
	// Game Container
	return (
		// <Draggable onStop={(event: any, data: any) => props.onMove(event, data)}>
			<div onClick={(e: any) => verifyPosition(props.ctx)} className={`${classes.PlayCard} ${props.isRed ? classes.red : classes.black}`}>
				<p>{numberSymbol(props.num)} {suitSymbol(props.suit)}</p>
			</div>
		// </Draggable>
	);
}

export default PlayCard;