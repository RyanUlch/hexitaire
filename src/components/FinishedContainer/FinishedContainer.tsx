import classes from './FinishedContainer.module.css';

import PlayCard from "../PlayCard/PlayCard";

const FinishedContainer = (props: {set: JSX.Element[]}) => {

	return (
		<div className={classes.finished}>
			Finished Pile
			{props.set}
		</div>
	)
}

export default FinishedContainer;