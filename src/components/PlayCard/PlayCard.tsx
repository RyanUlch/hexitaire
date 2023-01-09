import { useRef, useContext, useState, useEffect } from 'react';

import { AppContext, AppDispatchContext, gameContainer } from '../../context/context';
import { cardMidHeight, cardMidWidth, fontSize } from '../../helpers/globals';
import { validateAutoMove } from '../../helpers/moveValidator';

import classes from './PlayCard.module.css';

const PlayCard = (props: {
	parentPosition: number[],
	container: number[],
	positionInContainer: number,
	showOne: boolean,
	zIndex: number,
	changed: boolean,
}) => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);
	const [position, setPosition] = useState({
		left: props.parentPosition[0],
		top: props.parentPosition[1],
	});

	let cardInfo = (!state.containers[props.container[0]][props.container[1]].cardContainer[props.positionInContainer]) 
	? {
		suit: -1,
		number: -1,
		isRed: true,
	}
	: {
		suit: state?.containers[props.container[0]][props.container[1]]?.cardContainer[props.positionInContainer]?.suit,
		number: state?.containers[props.container[0]][props.container[1]]?.cardContainer[props.positionInContainer]?.number,
		isRed: state?.containers[props.container[0]][props.container[1]]?.cardContainer[props.positionInContainer]?.suit < 2,
	}

	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
	
	// Attempt to drop the held card. If within the same container, just re-add to container
	const attemptCardDrop = (e: any) => {
		if (e.target) {
			let cardDropLocation = e.target.getBoundingClientRect();
			dispatch({
				type: 'MOVECARD',
				payload: {
					to: [],
					from: [props.container[0], props.container[1], props.container[0] === 2 ? props.positionInContainer : state.containers[props.container[0]][props.container[1]].cardContainer.length-1],
					cardTop: cardDropLocation.top+cardMidHeight,
					cardLeft: cardDropLocation.left+cardMidWidth,
				}
			})
		}
	}

	function onTouch(eve: any) {
		eve = eve || window.event;
		eve.preventDefault();
		eve.stopPropagation();

		let isMoving = state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer;

		if (isMoving) {
			document.ontouchend = () => {
				document.ontouchend = null;
				document.ontouchmove = null;
				document.ontouchcancel = null;
				if (isMoving) {
					attemptCardDrop(eve);
					isMoving = false;
				}
			};

			document.ontouchmove = (e: any) => {
				e = e || window.event;
				e.preventDefault();
					setPosition({
						top: e.clientY - cardMidHeight,
						left: e.clientX - cardMidWidth,
					})
			};

			document.ontouchcancel = (e: any) => {
				document.ontouchend = null;
				document.ontouchmove = null;
				document.ontouchcancel = null;
			}
		} else {
			document.ontouchend = null;
			document.ontouchmove = null;
			document.ontouchcancel = null;
		}
	}

	function onMouseDown(eve: any) { //MouseEventHandler<HTMLDivElement>) {
		eve = eve || window.event;
		eve.preventDefault();
		eve.stopPropagation();
		
		let isMoving = state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer;
				
		if (isMoving) {
			document.onmouseup = () => {
				document.onmouseup = null;
				document.onmousemove = null;
				if (isMoving) {
					attemptCardDrop(eve);
					isMoving = false;
				}
			};

			document.onmousemove = (e: any) => {
				e = e || window.event;
				e.preventDefault();
					setPosition({
						top: e.clientY - cardMidHeight,
						left: e.clientX - cardMidWidth,
					})
			};
		} else {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	function onDblClick(e: any) {
		e = e || window.event;
		e.preventDefault();
		e.stopPropagation();
		if (props.container[0] === 3 || (props.container[0] !== 4 && state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer)) {
			const moveCard = validateAutoMove(state.containers, props.container, props.container[0] === 3 ? state.containers[props.container[0]][props.container[1]].cardContainer.length-1: props.positionInContainer);
			if (moveCard.to.length > 0) {
				dispatch({
					type: 'MOVECARD',
					payload: moveCard,
				});
			}
		}
	}

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

	let timeout: NodeJS.Timeout;
	// Move with the parent element
	useEffect(()=> {
		timeout = setTimeout(() => {
			let addition = ((props.positionInContainer > 0) && !props.showOne) ? (2*fontSize) : 0;
			if (state.containers[props.container[0]][props.container[1]].cardContainer.length > 1) {
				addition = addition * Math.pow(0.975, state.containers[props.container[0]][props.container[1]].cardContainer.length);
			}
			setPosition({
					left: props.parentPosition[0],
					top: props.parentPosition[1] + addition,
			});
		}, 1);
		return () => {
			clearTimeout(timeout);
		}
	}, [props.parentPosition[0], props.parentPosition[1], state.containers[props.container[0]][props.container[1]].changed]);
console.log(state)
	return (
		<div
			onMouseDown={onMouseDown}
			onTouchStart={onTouch}
			onDoubleClick={onDblClick}

			ref={ref} 
			style={{zIndex: props.zIndex, left: position.left, top: position.top}} 
			className={
				cardInfo.number !== -1 && cardInfo.number !== undefined 
					? `${classes.PlayCard} ${state.containers[props.container[0]][props.container[1]].validFrom <= props.positionInContainer ? classes.valid : classes.invalid} ${cardInfo.isRed ? classes.red : classes.black} ${props.parentPosition[1] === 0 ? classes.hidden : classes.shown}`
					: classes.empty}>
			{cardInfo.number !== -1 && cardInfo.number !== undefined 
			? <div className={classes.cardText}>
				{state.window[1] > 500 ? <p className={classes.top}>{numberSymbol()}{suitSymbol()}</p> : <></>}
				<p className={classes.middle}>{numberSymbol()}{suitSymbol()}</p>
				{state.window[1] > 500 ? <p className={classes.bottom}>{numberSymbol()}{suitSymbol()}</p> : <></>}
			</div> : <></>}
			{state.containers[props.container[0]][props.container[1]].cardContainer.length > props.positionInContainer+1 && !props.showOne
				? <PlayCard 
					zIndex={props.zIndex+1}
					parentPosition={[position.left, position.top]}
					container={props.container}
					positionInContainer={props.positionInContainer+1}
					showOne={false}
					changed={props.changed}
				/> 
				: <></>
			}
		</div>
	);
}

export default PlayCard;