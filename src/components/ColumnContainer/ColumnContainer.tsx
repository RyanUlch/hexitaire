import classes from './ColumnContainer.module.css';
import { useEffect, useState } from 'react';

import PlayCard from '../PlayCard/PlayCard';

const ColumnContainer = (props: {column: {cardID: number[], childKey: string}[], onInit: any, onMove: any, containerID: string}) => {
	useEffect(()=>{
		// Gets the bounds of the left and right side of the column
		// (from left edge of screen).
		const bounds = document.querySelector(`#${props.containerID}`)?.getBoundingClientRect();
		if (bounds) {
			// Updates the state of 'dropSections' from props.
			props.onInit((state: {col0: number[]}) => {
				return {
					...state,
					[props.containerID]: [bounds.left, bounds.left+bounds.width],
				}
			});
		}
		console.log(props.column);
	}, []);

	

	return (
		<div id={props.containerID} className={classes.column}>
			<PlayCard onMove={props.onMove} cardInfo={props.column[0].cardID} cardID={props.column[0].childKey} key={props.column[0].childKey} currentLoc={props.containerID} next={props.column.slice(1)} />
		</div>
	)
}

export default ColumnContainer;