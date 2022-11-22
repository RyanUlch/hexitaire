import classes from './ColumnContainer.module.css';
import { useEffect, useState } from 'react';

const ColumnContainer = (props: {children: any, onInit: any, containerID: string}) => {
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
	}, []);

	return (
		<div id={props.containerID} className={classes.column}>
			{props.children}
		</div>
	)
}

export default ColumnContainer;