import { useRef, useContext, useState, useEffect } from 'react';

import { useAppContext } from '../../context/context';

import classes from './PlayCard.module.css';

const PlayCard = (props: {
	parentPosition: number[],
	container: number[],
	position: number
}) => {
	const {state, dispatch} = useAppContext();
	const [position, setPosition] = useState({left: 0, top: 0});
	const [cardInfo, setCardInfo] = useState({
		suit: state[props.container[0]][props.container[1]].cardContainer[props.position].suit,
		number: state[props.container[0]][props.container[1]].cardContainer[props.position].number,
		isRed: state[props.container[0]][props.container[1]].cardContainer[props.position].suit < 2,
		hasChildren: state[props.container[0]][props.container[1]].cardContainer.length > props.position+1,
	});
	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

	// Don't allow movement if every other card are not opposite color suits
	// And don't allow movement if the entire stack is not in descending order
	const recursiveCheck: (isRed: boolean, index: number, lVal: number, rVal: number) => boolean = (isRed, index, lVal, rVal) => {
		const container = state[props.container[0]][props.container[1]].cardContainer;
		console.log(isRed, index, lVal, rVal);
		if ((lVal-1 !== rVal) || isRed === container[index].suit < 2) {
			return false;
		} else {
			if (container.length > index+1) {
				return recursiveCheck(
					container[index].suit < 2,
					index+1,
					container[index].number,
					container[index+1].number,
				);
			} else {
				return true;
			}
		}
	}

	// Don't move card stack if it's not valid
	const tryToMove = () => {
		// If the Card is the last card in the stack/pile, it can always be moved
		if (state[props.container[0]][props.container[1]].cardContainer.length > props.position+1) {
			return recursiveCheck(
				cardInfo.isRed,
				0,
				cardInfo.number,
				state[props.container[0]][props.container[1]].cardContainer[1].number,
			);
		} else {
			return true;
		}
	}

	// Move Cards if Possible
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
						//props.onMove(e, props.cardID, "");
					}
					canMove = true;
				};
				document.onmousemove = (e: any) => {
					if (canMove) {
						e = e || window.event;
						e.preventDefault();
						if (tryToMove()) {
							console.log('moving');
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

	// Sets the suit symbol as a string based on suit number
	const suitSymbol = () => {
		switch(cardInfo.suit) {
			case 0:	return '♥';	case 1:	return '♦';
			case 2:	return '♠';	case 3:	return '♣';
			default:throw Error('Card Suit Not Defined');
		}
	}

	// Sets the number in a string (as using hexadecimal: 0-9, A-F)
	const numberSymbol = () => {
		if (cardInfo.number < 10) return String(cardInfo.number);
		switch(cardInfo.number) {
			case 10: return 'A'; case 11: return 'B';
			case 12: return 'C'; case 13: return 'D';
			case 14: return 'E'; case 15: return 'F';
			default: throw Error('Card Number Not Defined');
		}
	}

	useEffect(()=> {
		// Set the initial position once the column info available
		setPosition({
			top: props.position*2 * parseFloat(getComputedStyle(document.documentElement).fontSize),
			left: state[props.container[0]][props.container[1]].containerDisplay[0]
		});
	}, [state[props.container[0]][props.container[1]].containerDisplay[0]]);

	// Move with the parent element
	useEffect(()=> {
		setPosition({
				left: props.parentPosition[0],
				top: props.parentPosition[1] + (2*parseFloat(getComputedStyle(document.documentElement).fontSize)),
		});
	}, [props.parentPosition]);

	return (
		<div ref={ref} style={{left: position.left, top: position.top}} className={`${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`}>
			<p className={classes.cardText}>{numberSymbol()}{suitSymbol()}</p>
			{cardInfo.hasChildren ? <PlayCard parentPosition={[position.left, position.top]}container={props.container} position={props.position+1}/> : ''}
		</div>
	)
}

export default PlayCard;