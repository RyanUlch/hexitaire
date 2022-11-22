import classes from './SelectionContainer.module.css';

const SelectionContainer = (props: {children: any}) => {
	return (
		<div className={classes.selectionContainer}>
			{props.children}
		</div>
	);
}

export default SelectionContainer;