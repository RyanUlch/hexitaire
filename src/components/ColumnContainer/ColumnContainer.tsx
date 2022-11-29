import classes from './ColumnContainer.module.css';
import { useEffect, useState } from 'react';

import PlayCard from '../PlayCard/PlayCard';

const ColumnContainer = (props: {column: {cardID: number[], childKey: string}[], onInit: any, onMove: any, containerID: string}) => {
	
	const [colBounds, setColBounds] = useState([0,0]);
	
	useEffect(()=>{
		// Gets the bounds of the left and right side of the column
		// (from left edge of screen).
		const getBounds = document.querySelector(`#${props.containerID}`)?.getBoundingClientRect();
		if (getBounds) {
			setColBounds([getBounds.left, getBounds.left+getBounds.width]);
			// Updates the state of 'dropSections' from props.
			props.onInit((state: any) => {
				return {
					...state,
					[props.containerID]: [getBounds.left, getBounds.left+getBounds.width],
				}
			});
		}
		console.log(getBounds);
	}, []);

	return (
		<div id={props.containerID} className={classes.column}>
			<PlayCard
				parentPosition={{left: 0, top: 0}}
				onMove={props.onMove}
				cardInfo={props.column[0].cardID}
				cardID={props.column[0].childKey}
				key={props.column[0].childKey}
				currentLoc={props.containerID}
				next={props.column.slice(1)}
				colBounds={colBounds}
				linePos={0}
			/>
		</div>
	)
}

export default ColumnContainer;