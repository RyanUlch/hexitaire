import { useRef, useContext, useState, useEffect, useTransition } from 'react';
import { isConstructorDeclaration } from 'typescript';

import { AppContext } from '../../context/context';
import { cardMidHeight, cardMidWidth, fontSize } from '../../helpers/globals';
import { validateAutoMove } from '../../helpers/moveValidator';

import classes from './PlayCard.module.css';

const PlayCard = (props: {
	parentPosition: number[],
	container: number[],
	positionInContainer: number,
	showOne: boolean,
	zIndex: number,
}) => {
	const [zIndex, setZIndex] = useState(props.zIndex);
	const [loaded, setLoaded] = useState(false);
	const {state, dispatch} = useContext(AppContext);
	const [position, setPosition] = useState({
		left: state.containers[props.container[0]][props.container[1]].containerDisplay[0],
		top: props.positionInContainer*2 * parseFloat(getComputedStyle(document.documentElement).fontSize),
	});

	// const [cardInfo, setCardInfo] = useState({
	// 	suit: -1,
	// 	number: -1,
	// 	isRed: true,
	// 	child: <></>,
	// });

	// useEffect(() => {
	// 	if (state.containers[props.container[0]][props.container[1]].cardContainer.length > 0) {
	// 		setCardInfo({
	// 			suit: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].suit,
	// 		number: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].number,
	// 		isRed: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].suit < 2,
	// 		child: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.positionInContainer+1 && !props.showOne
	// 			? <PlayCard 
	// 				zIndex={props.zIndex+1}
	// 				parentPosition={[position.left, position.top]}
	// 				container={props.container}
	// 				positionInContainer={props.positionInContainer+1}
	// 				showOne={false}
	// 			/>
	// 			: <></>,
	// 		})
	// 	}
	// }, [props.container[0], props.container[1]]);

	let cardInfo = (!state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer]) 
	? {
		suit: -1,
		number: -1,
		isRed: true,
		child: <></>,
	}
	: {
		suit: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].suit,
		number: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].number,
		isRed: state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer].suit < 2,
		child: state.containers[props.container[0]][props.container[1]].cardContainer.length > props.positionInContainer+1 && !props.showOne
			? <PlayCard 
				zIndex={props.zIndex+1}
				parentPosition={[position.left, position.top]}
				container={props.container}
				positionInContainer={props.positionInContainer+1}
				showOne={false}
			/>
			: <></>,
	}

	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

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

			element.ondblclick = (e: Event) => {
				console.log('auto begin')
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				if (props.container[0] === 3 || state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer) {
					console.log(cardInfo)
					const moveTo = validateAutoMove(state, props.container, props.positionInContainer);
					if (moveTo.position > -1) {
						dispatch({
							type: 'MOVECARD',
							payload: moveTo,
						});
					}
				}
			}


			element.onmousedown = (e: Event) => {
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				if (isMoving || state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer) {
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

	// useEffect(()=> {
	// 	// Set the initial position once the column info available
	// 	setPosition({
	// 		top: props.positionInContainer*2 * parseFloat(getComputedStyle(document.documentElement).fontSize),
	// 		left: state.containers[props.container[0]][props.container[1]].containerDisplay[0]
	// 	});
	// }, []);

	// const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>()
	let timeout: NodeJS.Timeout;
	// Move with the parent element
	useEffect(()=> {

		// timeout = setTimeout(() => {
		//setTimeoutID(setTimeout(() => {
			let addition = ((props.positionInContainer > 0) && !props.showOne) ? (2*fontSize) : 0;
			if (state.containers[props.container[0]][props.container[1]].cardContainer.length > 5) {
				addition = addition * Math.pow(0.975, state.containers[props.container[0]][props.container[1]].cardContainer.length);//(0.95 * state.containers[props.container[0]][props.container[1]].cardContainer.length);
			}
			setPosition({
					left: props.parentPosition[0],
					top: props.parentPosition[1] + addition,
			});
		// }, 1);

		// return () => {
		// 	clearTimeout(timeout);
		// }

	}, [state, props.parentPosition]);

	useEffect(() => {
		if (position.left !== 0 && position.top !== 0) {
			setLoaded(true);
		}
	}, [position]);

	return (

		<div ref={ref} style={{zIndex: props.zIndex, left: position.left, top: position.top}} className={cardInfo.number!==-1 && loaded ? `${classes.PlayCard} ${state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer ? classes.valid : classes.invalid} ${cardInfo.isRed ? classes.red : classes.black} ${props.parentPosition[1] === 0 ? classes.hidden : classes.shown}`: classes.empty}>
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