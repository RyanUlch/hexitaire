import classes from './PlayCard.module.css'
import Draggable from "../Draggable/Draggable";
import { useEffect, useState } from 'react';

const PlayCard = (props: {onMove: any, cardInfo: number[], cardID: string, key: string, currentLoc: any, next: {cardID: number[], childKey: string}[]}) => {
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
			isRed: props.cardInfo[0] < 2,
			suitSymbol: suitSymbol(props.cardInfo[0]),
			numberSymbol: numberSymbol(props.cardInfo[1]),
		}
	);

	useEffect(()=> {
		console.log(cardInfo.numberSymbol, cardInfo.suitSymbol);
	}, [])

	return (
		<div>
			<Draggable className='dragElement' cardID={props.cardID}>
				<div className={`${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`}>
					<p>{cardInfo.numberSymbol} {cardInfo.suitSymbol}</p>
				</div>
			</Draggable>
			{props.next.length > 0 && <PlayCard onMove={props.onMove} cardInfo={props.next[0].cardID} cardID={props.next[0].childKey} key={props.next[0].childKey} currentLoc={props.currentLoc} next={props.next.slice(1)}/>}
		</div>
	);
}

export default PlayCard;

//onStop={(event: any, data: any) => props.onMove(event, data, props.cardID)}