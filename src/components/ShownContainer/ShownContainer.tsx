import { useContext, useState, useEffect } from 'react';
import classes from './ShownContainer.module.css';
import PlayCard from '../PlayCard/PlayCard';
import { AppContext } from '../../context/context';
import { cardMidWidth } from '../../helpers/globals';

const ShownContainer = (props: {moves: number}) => {
	const {state, dispatch} = useContext(AppContext);
	const [shownCards, setShownCards] = useState<JSX.Element[]>([])
	const [bounds, setBounds] = useState({left: 0, top: 0});

	useEffect(() => {
		const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
		if (getBounds) {
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			});
		}
	}, []);

	useEffect(() => {
		setShownCards(() => {
			const cards = [];
			for (let i = 0; i < state.containers[0][0].cardContainer.length; ++i) {
				cards.push(<PlayCard
					parentPosition={[(bounds.left+(i*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					position={i}
					moves={props.moves}
					showOne={true}
					zIndex={i}
				/>)
			}
			return cards;	
		});
	}, [state]);

	console.log(props.moves);

	return (
		<div id='shown' className={classes.holder}>
			{shownCards}
			
		</div>
	);
}

export default ShownContainer;