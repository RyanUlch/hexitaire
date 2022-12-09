import { useContext, useState, useEffect } from 'react';
import classes from './ShownContainer.module.css';
import PlayCard from '../PlayCard/PlayCard';
import { AppContext } from '../../context/context';

const ShownContainer = (props: {moves: number}) => {
	const {state, dispatch} = useContext(AppContext);
	const [shownCards, setShownCards] = useState(<></>)
	
	
	useEffect(() => {
		setShownCards(
			<>
				<PlayCard
					parentPosition={[0, 0]}
					container={[0, 0]}
					position={0}
					moves={props.moves}
					showOne={true}
					zIndex={0}
				/>
				<PlayCard
					parentPosition={[20, 0]}
					container={[0, 0]}
					position={1}
					moves={props.moves}
					showOne={true}
					zIndex={1}
				/>
				<PlayCard
					parentPosition={[40, 0]}
					container={[0, 0]}
					position={2}
					moves={props.moves}
					showOne={true}
					zIndex={2}
				/>
			</>
		);
	}, [props.moves]);

	console.log(props.moves);

	return (
		<div className={classes.holder}>
			{shownCards}
			
		</div>
	);
}

export default ShownContainer;