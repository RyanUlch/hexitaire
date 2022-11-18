import classes from './DrawContainer.module.css';

const DrawContainer = (props: {flipCards: ()=>void, isEmpty: boolean}) => {

	return (
		<div className={classes.drawContainer} onClick={props.flipCards}>
			{props.isEmpty ? 'Draw Pile - Empty' : 'Draw Pile - Card Back'}
		</div>
	);
}

export default DrawContainer;