import classes from './ColumnContainer.module.css';
import { useEffect } from 'react';

const ColumnContainer = (props: {onInit: any, containerID: string, set: JSX.Element[]}) => {
	
	useEffect(()=>{
		// const bounds = document.querySelector(`#${props.containerID}`)?.getBoundingClientRect();
		
		// Gets the bounds of the left and right side of the column
		// (from left edge of screen).
		// For test, using literal for QuerySelector
		const bounds = document.querySelector(`#col0`)?.getBoundingClientRect();
		if (bounds) {
			// Updates the state of 'dropSections' from props.
			// For test, using constant value of object property
			props.onInit((state: any) => {
				return {
					...state,
					//[props.containerID]: [bounds.left, bounds.left+bounds.width],
					col0: [bounds.left, bounds.left+bounds.width],
				}
			});
		}
	}, []);

	return (
		// <div id={props.containerID} className={classes.column}>
		<div id='col0' className={classes.column}>
			{props.set}
		</div>
	)
}

export default ColumnContainer;