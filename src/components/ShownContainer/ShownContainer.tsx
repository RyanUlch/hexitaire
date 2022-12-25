import { useContext, useState, useEffect } from 'react';
import classes from './ShownContainer.module.css';
import PlayCard from '../PlayCard/PlayCard';
import { AppContext } from '../../context/context';
import { cardMidWidth } from '../../helpers/globals';

const ShownContainer = (props: {moves: number, topLine: number | undefined}) => {
	const {state, dispatch} = useContext(AppContext);
	const [shownCards, setShownCards] = useState<JSX.Element[]>([])
	const [bounds, setBounds] = useState({left: 0, top: 0});

	// useEffect(() => {
	// 	const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
	// 	if (getBounds) {
	// 		setBounds({
	// 			left: getBounds.left,
	// 			top: getBounds.top,
	// 		});
	// 	}
	// }, []);

	useEffect(() => {
		const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
		if (getBounds?.left && getBounds?.top) {
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			})
		}
	}, [state.window[0], state.window[1]]);

	useEffect(() => {
		setShownCards(() => {
			const cards = [];
			for (let i = 0; i < state.containers[0][0].cardContainer.length; ++i) {
				cards.push(<PlayCard
					parentPosition={[(bounds.left+(i*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					positionInContainer={i}
					moves={props.moves}
					showOne={true}
					zIndex={i}
					key={`${state.containers[0][0].cardContainer.length > 0 ? state.containers[0][0].cardContainer[i].number+'-'+state.containers[0][0].cardContainer[i].suit+'-'+state.moves : 'ShownEmpty'}`}
				/>)
			}
			cards.push(<PlayCard
				parentPosition={[(bounds.left), bounds.top]}
				container={[4, 0]}
				positionInContainer={state.containers[4][0].cardContainer.length-1}
				moves={props.moves}
				showOne={true}
				zIndex={-1}
				key={`${state.containers[4][0].cardContainer.length > 0 ? state.containers[4][0].cardContainer[state.containers[4][0].cardContainer.length-1].number+'-'+state.containers[4][0].cardContainer[state.containers[4][0].cardContainer.length-1].suit+'-'+state.moves : 'ShownEmpty'}`}
			/>)
			return cards;	
		});
	}, [state]);

	return (
		<div id='shown' className={classes.container}>
			{shownCards}
			
		</div>
	);
}

export default ShownContainer;