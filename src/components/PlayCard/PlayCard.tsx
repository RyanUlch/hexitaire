import classes from './PlayCard.module.css'
import Draggable from "../Draggable/Draggable";
import React, { useState, useEffect, useRef } from 'react';

const PlayCard = (props: {onMove: any, cardInfo: number[], cardID: string, key: string, currentLoc: any, next: {cardID: number[], childKey: string}[]}) => {
	const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
	
	const [position, setPosition] = useState({left: 0, top: 0});

	// Make the DIV element draggable:
	// const [element, setElement] = useState<HTMLElement>()
	
	// useEffect(() => {
	// 	setElement(ref.current);	
	// 	console.log(ref.current);	
	// }, []);

	useEffect(()=> {
		const element = ref.current;
		if (element) {
			console.log(element);

			element.onmousedown = (e: Event) => {
				console.log(element);
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				document.onmouseup = () => {
					document.onmouseup = null;
					document.onmousemove = null;
				};
				document.onmousemove = (e: any) => {
					console.log(element);
					if (element) {

						e = e || window.event;
						e.preventDefault();
						setPosition({
							top: e.clientY,
							left: e.clientX,
						})
						
					}
				};
			};
		}
	}, []);

	// const closeDragElement = () => {
	// 	document.onmouseup = null;
	// 	document.onmousemove = null;
	// }

	// const elementDrag = (e: any) => {
	// 	if (element) {
	// 		e = e || window.event;
	// 		e.preventDefault();
	// 		element.style.top = e.clientY + "px";
	// 		element.style.left = e.clientX + "px";
	// 	}
	// }

	// function dragMouseDown(e: Event) {
	// 	e = e || window.event;
	// 	e.preventDefault();
	// 	document.onmouseup = closeDragElement;
	// 	document.onmousemove = elementDrag;
	// }
	
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

	return (
		<>
			<div ref={ref} style={{ left: position.left, top: position.top }} className={`${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`}>
				<p className={classes.cardText}>{cardInfo.numberSymbol} {cardInfo.suitSymbol}</p>
				{props.next.length > 0 && <PlayCard onMove={props.onMove} cardInfo={props.next[0].cardID} cardID={props.next[0].childKey} key={props.next[0].childKey} currentLoc={props.currentLoc} next={props.next.slice(1)}/>}
			</div>
		</>
	);
}

export default PlayCard;

//onStop={(event: any, data: any) => props.onMove(event, data, props.cardID)} 