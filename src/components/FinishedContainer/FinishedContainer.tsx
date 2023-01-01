import { useState, useEffect, useContext } from 'react';
import { AppContext, AppDispatchContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';
import classes from './FinishedContainer.module.css';

const FinishedContainer = (props: {containerNum: number}) => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);
	const [bounds, setBounds] = useState({left: 0, top: 0});
	const [containerState, setContainerState] = useState(state.containers[3][props.containerNum]);
	const [changed, setChanged] = useState(false);
	useEffect(() => {
		const getBounds = document.querySelector(String(`#f${props.containerNum}`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [3, props.containerNum],
					left: getBounds.left,
					right: getBounds.left+getBounds.width,
				}
			});
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			})
		}
	}, [state.window[0], state.window[1]]);

	const [cardSet, setCardSet] = useState(<></>);

	// useEffect(()=> {
	// 	if (state.containers[3][props.containerNum].cardContainer.length > 0) {
	// 		setCardSet(
	// 			<>
	// 				<PlayCard
	// 					parentPosition={[bounds.left, bounds.top]}
	// 					container={[3, props.containerNum]}
	// 					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-1}
	// 					showOne={true}
	// 					zIndex={1}
	// 					// key={`${(state.containers[2][props.containerNum].cardContainer.length > 0) ? state.containers[2][props.containerNum].cardContainer[0].number+'-'+state.containers[2][props.containerNum].cardContainer[0].suit : 'InPlay'+props.containerNum}`}
	// 				/>
	// 				{state.containers[3][props.containerNum].cardContainer.length-2 >= 0 ?
	// 					<PlayCard
	// 						parentPosition={[bounds.left, bounds.top]}
	// 						container={[3, props.containerNum]}
	// 						positionInContainer={state.containers[3][props.containerNum].cardContainer.length-2}
	// 						showOne={true}
	// 						zIndex={0}
	// 					/>
	// 					: <></>
	// 				}
	// 			</>
	// 		)
	// 	} else {
	// 		setCardSet(<></>);
	// 	}
	// }, [state.containers[3][props.containerNum].changed]);

	useEffect(() => {
		setChanged(prevState => !prevState);
	}, [state.containers[3][props.containerNum].changed]);

	return (
		<div id={`f${props.containerNum}`} className={`${classes.container} ${changed}`}>
			{state.containers[3][props.containerNum].cardContainer.length > 0
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-1}
					showOne={true}
					zIndex={1}
					changed={changed}
					// key={'finished1'}

					// key={`${(state.containers[2][props.containerNum].cardContainer.length > 0) ? state.containers[2][props.containerNum].cardContainer[0].number+'-'+state.containers[2][props.containerNum].cardContainer[0].suit : 'InPlay'+props.containerNum}`}
				/>
				: <></>
			}
			{  state.containers[3][props.containerNum].cardContainer.length-2 >= 0
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-2}
					showOne={true}
					zIndex={0}
					changed={changed}
					// key={'finishedUnder'}

				/>
				: <></>
			}
		</div>
	)
}

export default FinishedContainer;


