import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';

const FinishedContainer = (props: {containerNum: number}) => {
// 	const {state, dispatch} = useContext(AppContext);
// 	const [bounds, setBounds] = useState({left: 0, top: 0});
// 	useEffect(() => {
// 		const getBounds = document.querySelector(String(`#f${props.containerNum}`))?.getBoundingClientRect();

// 		if (getBounds) {
// 			dispatch({
// 				type: 'SETCOLUMNBOUNDS',
// 				payload: {
// 					column: [3, props.containerNum],
// 					left: getBounds.left,
// 					right: getBounds.left+getBounds.width,
// 				}
// 			});
// 			setBounds({
// 				left: getBounds.left,
// 				top: getBounds.top,
// 			})
// 		}
// 	}, []);

// 	// const [cardDisplay, setCardDisplay] = useState(()=> {
// 	// 	return (state.containers[2][props.containerNum].cardContainer.length > 0) ?
// 	// 		<PlayCard
// 	// 			parentPosition={[state.containers[2][props.containerNum].containerDisplay[0], state.containers[2][props.containerNum].containerDisplay[1]]}
// 	// 			container={[2, props.containerNum]}
// 	// 			position={0}
// 	// 		/>	:
// 	// 		<div>No Cards</div>;
// 	// });



// 	const [containerCount, setContainerCount] = useState((state.containers[3][props.containerNum].cardContainer.length > 0) ? 0 : -1)
		
// 	useEffect(()=> {
// 		setContainerCount((state.containers[3][props.containerNum].cardContainer.length > 0) ? 0 : -1);
// 	}, [state]);

// 	const [card, setCard] = useState<JSX.Element>();

// 	useEffect(() => {
// 		// setCard(<PlayCard
// 		// 	parentPosition={[bounds.top, bounds.left]}
// 		// 	container={[2, props.containerNum]}
// 		// 	position={containerCount}
// 		// 	moves={state.moves}
// 		// />)
// 	}, [...Object.values(state)]);


// 	// useEffect(()=> {
// 	// 	setCardDisplay((state: any) => state);
// 	// }, [state.containers[2][props.containerNum].cardContainer]);
// 	//{card}
// 	return (
// 		<div id={`f${props.containerNum}`} className='container'>
// {/* 			
// 			<PlayCard
// 			parentPosition={[bounds.left, bounds.top]}
// 			container={[3, props.containerNum]}
// 			position={containerCount}
// 			moves={state.moves}
// 		/> */}
// 		</div>
// 	)
}

export default FinishedContainer;