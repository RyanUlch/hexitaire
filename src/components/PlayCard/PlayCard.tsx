import classes from './PlayCard.module.css'
import Draggable from "../Draggable/Draggable";
import React, { useState, useEffect, useRef } from 'react';
import { nextTick } from 'process';

const PlayCard = (props: {
		parentPosition: {left: number, top: number},
		onMove: any,
		cardInfo: number[],
		cardID: string,
		key: string,
		currentLoc: any,
		next: {cardID: number[], childKey: string}[],
		colBounds: number[],
		linePos: number,
	}) => {

	const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
	const [position, setPosition] = useState({left: 0, top: 0});

	// Don't allow movement if every other card are not opposite color suits
	// And don't allow movement if the entire stack is not in descending order
	const recursiveCheck: (isRed: boolean, length: number, index: number, lVal: number, rVal: number) => boolean = (isRed, length, index, lVal, rVal) => {
		if ((lVal-1 !== rVal) || isRed === props.next[index].cardID[1] < 2) {
			return false;
		} else {
			if (length > 1) {
				return recursiveCheck(
					props.next[index].cardID[1] < 2,
					--length,
					index+1,
					props.next[index].cardID[0],
					props.next[index+1].cardID[0]
				);
			} else {
				return true;
			}
		}
	}

	// Don't move card stack if it's not valid
	const tryToMove = () => {
		// If the Card is the last card in the stack/pile, it can always be moved
		if (props.next.length > 0) {
			return recursiveCheck(
				cardInfo.isRed,
				props.next.length,
				0,
				props.cardInfo[0],
				props.next[0].cardID[0],
			);
		} else {
			return true;
		}
	}

	useEffect(()=> {
		const element = ref.current;
		let canMove = true;
		if (element) {
			element.onmousedown = (e: Event) => {
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				document.onmouseup = () => {
					document.onmouseup = null;
					document.onmousemove = null;
					if (canMove) {
						props.onMove(e, props.cardID, "");
					}
					canMove = true;
				};
				document.onmousemove = (e: any) => {
					if (canMove) {
						e = e || window.event;
						e.preventDefault();
						if (tryToMove()) {
							setPosition({
								top: e.clientY - 3.5 * parseFloat(getComputedStyle(document.documentElement).fontSize),
								left: e.clientX - 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize),
							})
						} else {
							canMove = false;
						}
					}
				};
			};
		}
	}, []);

	useEffect(()=> {
		// Move with the parent element
		setPosition({
				left: props.parentPosition.left,
				top: props.parentPosition.top + (2*parseFloat(getComputedStyle(document.documentElement).fontSize)),
		});
	}, [props.parentPosition]);

	useEffect(()=> {
		// Set the initial position once the column info available
		setPosition({
			top: props.linePos*2 * parseFloat(getComputedStyle(document.documentElement).fontSize),
			left: props.colBounds[0]
		});
	}, [props.colBounds]);
	
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

	// Card info set on initialization, does not change.
	const [cardInfo] = useState(
		{
			isRed: props.cardInfo[1] < 2,
			suitSymbol: suitSymbol(props.cardInfo[1]),
			numberSymbol: numberSymbol(props.cardInfo[0]),
		}
	);

	return (
		<>
			<div ref={ref} style={{ left: position.left, top: position.top }}  className={`${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`}>
				<p className={classes.cardText}>{cardInfo.numberSymbol} {cardInfo.suitSymbol}</p>
				{props.next.length > 0 && <PlayCard parentPosition={position} onMove={props.onMove} cardInfo={props.next[0].cardID} cardID={props.next[0].childKey} key={props.next[0].childKey} currentLoc={props.currentLoc} next={props.next.slice(1)} colBounds={props.colBounds} linePos={props.linePos+1}/>}
			</div>
		</>
	);
}

export default PlayCard;