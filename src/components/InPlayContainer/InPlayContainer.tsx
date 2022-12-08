import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';
import { cardHeight } from '../../helpers/globals';

const InPlayContainer = (props: {containerNum: number}) => {
	const {state, dispatch} = useContext(AppContext);
	const [bounds, setBounds] = useState({left: 0, top: 0});
	useEffect(() => {
		const getBounds = document.querySelector(String(`#c${props.containerNum}`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [2, props.containerNum],
					left: getBounds.left,
					right: getBounds.left+getBounds.width,
				}
			});
			setBounds({
				left: getBounds.left,
				top: cardHeight,
			})
		}
	}, []);

	const [containerCount, setContainerCount] = useState((state.containers[2][props.containerNum].cardContainer.length > 0) ? 0 : -1)
		
	useEffect(()=> {
		setContainerCount((state.containers[2][props.containerNum].cardContainer.length > 0) ? 0 : -1);
	}, [state]);

	const [card, setCard] = useState<JSX.Element>(<PlayCard
		parentPosition={[bounds.left, bounds.top]}
		container={[2, props.containerNum]}
		position={containerCount}
		moves={state.moves}
		showOne={false}
	/>);

	useEffect(()=> {
		setCard(
			<PlayCard
				parentPosition={[bounds.left, bounds.top]}
				container={[2, props.containerNum]}
				position={containerCount}
				moves={state.moves}
				showOne={false}
			/>
		);
	}, [state.containers[2][props.containerNum].cardContainer.length])

	return (
		<div id={`c${props.containerNum}`} className='container'>
			{/* {card} */}
			<PlayCard
			parentPosition={[bounds.left, bounds.top]}
			container={[2, props.containerNum]}
			position={containerCount}
			moves={state.moves}
			showOne={false}
		/>
		</div>
	)
}

export default InPlayContainer;