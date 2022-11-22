import classes from './FinishedContainer.module.css';
import { useEffect } from 'react';

const FinishedContainer = (props: {onInit: any,containerID: string, children: any}) => {
	useEffect(()=>{
		const bounds = document.querySelector(`#${props.containerID}`)?.getBoundingClientRect();
		if (bounds) {
			props.onInit((state: any) => {
				return {
					...state,
					[props.containerID]: [bounds.left, bounds.left+bounds.width],
				}
			});
		}
	}, []);

	return (
		<div id={props.containerID} className={classes.finished}>
			Finished Pile
			{props.children}
		</div>
	)
}

export default FinishedContainer;