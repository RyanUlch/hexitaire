import { useState, useEffect, useContext } from 'react';
import { AppContext, AppDispatchContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';
import classes from './FinishedContainer.module.css';

const FinishedContainer = (props: {containerNum: number,}) => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);
	const [bounds, setBounds] = useState({left: 0, top: 0});
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

	useEffect(() => {
		setChanged(prevState => !prevState);
	}, [state.containers[3][props.containerNum].changed]);

	return (
		<div id={`f${props.containerNum}`} className={`${classes.container} ${changed}`}>
			{state.containers[3][props.containerNum].cardContainer.length > 0 && !state.winCondition[1]
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-1}
					showOne={true}
					zIndex={1}
					changed={changed}
				/>
				: <></>
			}
			{state.containers[3][props.containerNum].cardContainer.length-2 >= 0 && !state.winCondition[1]
				? <PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					positionInContainer={state.containers[3][props.containerNum].cardContainer.length-2}
					showOne={true}
					zIndex={0}
					changed={changed}
				/>
				: <></>
			}
			{state.winCondition[1]
				? <div className={classes.finished}>You Win!</div>
				: <></>
			}
		</div>
	)
}

export default FinishedContainer;