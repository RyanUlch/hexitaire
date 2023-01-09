import { useState, useEffect, useContext } from 'react';
import { AppContext, AppDispatchContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';
import classes from './InPlayContainers.module.css';

const InPlayContainer = (props: {containerNum: number}) => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);	const [bounds, setBounds] = useState({left: 0, top: 0});
	const [changed, setChanged] = useState(false);

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
				top: getBounds.top,
			})
		}
	}, [state.window[0], state.window[1]]);

	useEffect(() => {
		setChanged(prevState => !prevState);
	}, [state.containers[2][props.containerNum].changed]);

	return (
		<div id={`c${props.containerNum}`} className={`${classes.container}`}>
			{state.containers[2][props.containerNum].cardContainer.length > 0
				? <PlayCard
					changed={changed}
					parentPosition={[bounds.left, bounds.top]}
					container={[2, props.containerNum]}
					positionInContainer={0}
					showOne={false}
					zIndex={1}
				/>
				: <></>
			} 
		</div>
	)
}

export default InPlayContainer;