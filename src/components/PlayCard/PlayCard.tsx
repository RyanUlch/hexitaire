import classes from './PlayCard.module.css'
import Draggable from "react-draggable";
import { useState } from 'react';

const PlayCard = (props: {isRed: boolean, key: string, num: number, suit: number}) => {
	const [position, setPosition] = useState({x: 0, y: 0});
	
	const trackPos = (data: {x: number, y: number}) => {
		setPosition({ x: data.x, y: data.y });
	};

	const suitSymbol = (suitNum: number) => {
		switch(suitNum) {
			case 0:	return '♥';	case 1:	return '♦';
			case 2:	return '♠';	case 3:	return '♣';
			default:throw Error('Card Suit Not Defined');
		}
	}

	const numberSymbol = (cardNum: number) => {
		if (cardNum < 10) return String(cardNum);
		switch(cardNum) {
			case 10: return 'A'; case 11: return 'B';
			case 12: return 'C'; case 13: return 'D';
			case 14: return 'E'; case 15: return 'F';
			default: throw Error('Card Number Not Defined');
		}
	}

	return (
		<Draggable onDrag={(event, data) => trackPos(data)}>
			<div className={`${classes.PlayCard} ${props.isRed ? classes.red : classes.black}`}>
				<p>{numberSymbol(props.num)} {suitSymbol(props.suit)}</p>
			</div>
		</Draggable>
	);
}

export default PlayCard;