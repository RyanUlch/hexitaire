import classes from './ColumnContainer.module.css';
import { useEffect } from 'react';

import PlayCard from '../PlayCard/PlayCard';

const ColumnContainer = (props: {set: JSX.Element[]}) => {
	useEffect(() => {

	}, [props.set]);

	return (
		<div className={classes.column}>
			{props.set}
		</div>
	)
}

export default ColumnContainer;