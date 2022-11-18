import classes from './SelectionContainer.module.css';

const SelectionContainer = (props: {set: JSX.Element[]}) => {
	return (
		<div className={classes.selectionContainer}>
			{props.set}
		</div>
	);
}

export default SelectionContainer;