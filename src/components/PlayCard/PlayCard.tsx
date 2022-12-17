import { useRef, useContext, useState, useEffect } from 'react';

import { AppContext } from '../../context/context';
import { cardMidHeight, cardMidWidth, fontSize } from '../../helpers/globals';
import GameContainer from '../GameContainer/GameContainer';

import classes from './PlayCard.module.css';

const PlayCard = (props: {
	parentPosition: number[],
	container: number[],
	positionInContainer: number
	moves: number,
	showOne: boolean,
	zIndex: number,
}) => {
	const [zIndex, setZIndex] = useState(props.zIndex);

	const {state, dispatch} = useContext(AppContext);
	const [position, setPosition] = useState({left: state.containers[props.container[0]][props.container[1]].containerDisplay[0], top: 0});
	//const [position, setPosition] = useState({left: props.parentPosition[0], top: 0});
	//const [containerPosition, setContainerPosition] = useState(0);
	let cardInfo = (!state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer]) 
	? {
		suit: -1,
		number: -1,
		isRed: true,
		child: <></>,
	}
	: {
		//index: indexof(state.containers[props.container[0]][props.container[1]]
		suit: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].suit,
		number: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].number,
		isRed: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].suit < 2,
		//hasChildren: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.position+1,
		child: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.positionInContainer+1 && !props.showOne
			? <PlayCard 
				zIndex={props.zIndex+1}
				parentPosition={[position.left, position.top]}
				container={props.container}
				positionInContainer={props.positionInContainer+1}
				moves={props.moves}
				showOne={false}
			/>
			: <></>,
	}

	const [containerPosition, setContainerPosition] = useState(props.positionInContainer);


	useEffect(()=> {
		setContainerPosition(props.positionInContainer)
	}, [props.positionInContainer]);

	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

	// Don't allow movement if every other card are not opposite color suits
	// And don't allow movement if the entire stack is not in descending order
	const recursiveCheck: (index: number, container: any) => boolean = (index,container) => {
		const lVal = container[index];
		const rVal = container[index+1];
		if ((lVal.number-1 === rVal.number) && lVal.suit < 2 !== rVal.suit < 2) {
			if (container.length > index+2) {
				return recursiveCheck(
					index+1,
					container,
				);
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	// Don't move card stack if it's not valid
	const tryToMove = () => {
		
		// If the Card is the last card in the stack/pile, it can always be moved
		let container = state.containers[props.container[0]][props.container[1]].cardContainer;
		console.log(container.length, containerPosition);
		if (container.length > containerPosition+1 && props.container[0] !== 3) {
			return recursiveCheck(
				containerPosition,
				container,
			);
		} else {
			return true;
		}
	}

	// Attempt to drop the held card. If within the same container, just re-add to container
	const attemptCardDrop = (e: any) => {
		if (e.target) {
			let cardDropLocation = e.target.getBoundingClientRect();
			dispatch({
				type: 'MOVECARD',
				payload: {
					cardTop: cardDropLocation.top+cardMidHeight,
					cardLeft: cardDropLocation.left+cardMidWidth,
					StartingContainer: props.container,
					position: props.container[0] === 3 ? state.containers[props.container[0]][props.container[1]].cardContainer.length-1: props.positionInContainer,
				}
			})
		}
	}

	// Move Cards if Possible
	useEffect(()=> {
		const element = ref.current;
		let isMoving = false;
		if (element) {
			element.onmousedown = (e: Event) => {
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				if (isMoving || tryToMove()) {
					isMoving = true;
				} else {
					isMoving = false;
				}
				document.onmouseup = () => {
					document.onmouseup = null;
					document.onmousemove = null;
					setZIndex(props.zIndex);
					if (isMoving) {
						attemptCardDrop(e);
						isMoving = false;
					}
				};
				document.onmousemove = (e: any) => {
					e = e || window.event;
					e.preventDefault();
					if (isMoving) {
						setPosition({
							top: e.clientY - cardMidHeight,
							left: e.clientX - cardMidWidth,
						})
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
			top: props.positionInContainer*2 * parseFloat(getComputedStyle(document.documentElement).fontSize),
			left: state.containers[props.container[0]][props.container[1]].containerDisplay[0]
		});
	}, []);

	// Move with the parent element
	useEffect(()=> {
		const addition = ((props.positionInContainer > 0) && !props.showOne) ? (2*fontSize) : 0;
		setPosition({
				left: props.parentPosition[0],
				top: props.parentPosition[1] + addition,
		});
	}, [props.parentPosition, props.moves]);


	return (
		<div ref={ref} style={{zIndex: zIndex, left: position.left, top: position.top}} className={cardInfo.number!==-1 ? `${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`: classes.empty}>
			{cardInfo.number!==-1 
			? <div className={classes.cardText}>
				<p className={classes.top}>{numberSymbol()}{suitSymbol()}</p>
				<p className={classes.middle}>{numberSymbol()}{suitSymbol()}</p>
				<p className={classes.bottom}>{numberSymbol()}{suitSymbol()}</p>
			</div> : <></>}
			{cardInfo.child}
		</div>
	);
}

export default PlayCard;