import { useRef, useContext, useState, useEffect } from 'react';

import { AppContext } from '../../context/context';
import { cardMidHeight, cardMidWidth } from '../../helpers/globals';

import classes from './PlayCard.module.css';

const PlayCard = (props: {
	parentPosition: number[],
	container: number[],
	position: number
	moves: number,
}) => {
	const {state, dispatch} = useContext(AppContext);
	const [position, setPosition] = useState({left: state.containers[props.container[0]][props.container[1]].containerDisplay[0], top: 0});
	const [moved, setMoved] = useState(false);

	// const [cardInfo, setCardInfo] = useState(()=> {
	// 	if (props.position === -1) {
	// 		return {
	// 			suit: -1,
	// 			number: -1,
	// 			isRed: true,
	// 			hasChildren: false,
	// 		}
	// 	} else {
	// 		return {
	// 			//index: indexof(state.containers[props.container[0]][props.container[1]]
	// 			suit: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].suit,
	// 			number: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].number,
	// 			isRed: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].suit < 2,
	// 			hasChildren: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.position+1,
	// 		}
	// 	}
	// });
	//const [keyState, setKeyState] = useState(`${props.container[0]}${props.container[1]}${props.position}}`);

//console.log(state.containers[props.container[0]][props.container[1]].cardContainer, props.position);
	let cardInfo = (props.position === -1 || !state.containers[props.container[0]][props.container[1]].cardContainer[props.position]) 
	? {
		suit: -1,
		number: -1,
		isRed: true,
		child: <></>,
	}
	: {
		//index: indexof(state.containers[props.container[0]][props.container[1]]
		suit: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].suit,
		number: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].number,
		isRed: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].suit < 2,
		//hasChildren: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.position+1,
		child: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.position+1
			? <PlayCard parentPosition={[position.left, position.top]}container={props.container} position={props.position+1} moves={props.moves}/>
			: <></>
	}

	// useEffect(()=> {
	// 	console.log('update');
	// 	cardInfo = (props.position === -1 || !state.containers[props.container[0]][props.container[1]].cardContainer[props.position]) 
	// 	? {
	// 		suit: -1,
	// 		number: -1,
	// 		isRed: true,
	// 		child: <></>,
	// 	}
	// 	: {
	// 		//index: indexof(state.containers[props.container[0]][props.container[1]]
	// 		suit: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].suit,
	// 		number: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].number,
	// 		isRed: state.containers[props.container[0]][props.container[1]].cardContainer[props.position].suit < 2,
	// 		//hasChildren: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.position+1,
	// 		child: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.position+1
	// 			? <PlayCard parentPosition={[position.left, position.top]}container={props.container} position={props.position+1} containerLength={props.containerLength} />
	// 			: <></>
	// 	}
	// }, [state.moves])
	//[...Object.values(state), ...Object.values(state.containers), ...Object.values(state.containers[props.container[0]]), ...Object.values(state.containers[props.container[0]][props.container[1]]),*/ ...Object.values(state.containers[props.container[0]][props.container[1]].cardContainer)])
	

		
	

	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

	// Don't allow movement if every other card are not opposite color suits
	// And don't allow movement if the entire stack is not in descending order
	const recursiveCheck: (index: number, container: any) => boolean = (index,container) => {
		const lVal = container[index];
		const rVal = container[index+1];
		console.log(lVal, rVal);
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
		const container = state.containers[props.container[0]][props.container[1]].cardContainer;
		if (container.length > props.position+1) {
			return recursiveCheck(
				props.position,
				container,
			);
		} else {
			return true;
		}
	}

	// Attempt to drop the held card. If within the same container, just re-add to container
	const attemptCardDrop = (e: any) => {
		if (e.target) {
			const cardDropLocation = e.target.getBoundingClientRect();
			dispatch({
				type: 'MOVECARD',
				payload: {
					cardTop: cardDropLocation.top+cardMidHeight,
					cardLeft: cardDropLocation.left+cardMidWidth,
					StartingContainer: props.container,
					position: props.position,
				}
			})
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
						attemptCardDrop(e);
						setMoved((prev) => !prev);
					}
					canMove = true;
				};
				document.onmousemove = (e: any) => {
					if (canMove) {
						e = e || window.event;
						e.preventDefault();
						if (tryToMove()) {
							setPosition({
								top: e.clientY - cardMidHeight,
								left: e.clientX - cardMidWidth,
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
			left: state.containers[props.container[0]][props.container[1]].containerDisplay[0]
		});
	}, []);
	//}, [state.containers[props.container[0]][props.container[1]].containerDisplay[0], state.containers[props.container[0]][props.container[1]].cardContainer]);

	// Move with the parent element
	useEffect(()=> {
		//console.log(props.parentPosition);
		setPosition({
				left: props.parentPosition[0],
				top: props.parentPosition[1] + (2*parseFloat(getComputedStyle(document.documentElement).fontSize)),
		});
	}, [props.parentPosition, props.moves]);

	// useEffect(()=> {
	// 	console.log('update');
	// 	setPosition({
	// 			left: props.parentPosition[0],
	// 			top: props.parentPosition[1] + (2*parseFloat(getComputedStyle(document.documentElement).fontSize)),
	// 	})
	// }, []);

	return (
		cardInfo.number!==-1
			? <div ref={ref} style={{left: position.left, top: position.top}} className={`${classes.PlayCard} ${cardInfo.isRed ? classes.red : classes.black}`}>
				<p className={classes.cardText}>{numberSymbol()}{suitSymbol()}</p>
				{cardInfo.child}
			</div>
			: <></>
	);
}

export default PlayCard;