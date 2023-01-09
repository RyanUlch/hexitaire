import { useContext, useState, useEffect } from 'react';
import classes from './ShownContainer.module.css';
import PlayCard from '../PlayCard/PlayCard';
import { AppContext, AppDispatchContext } from '../../context/context';
import { cardMidWidth } from '../../helpers/globals';

const ShownContainer = () => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext)
	const [bounds, setBounds] = useState({left: 0, top: 0});
	const [changed, setChanged] = useState(false);

	useEffect(() => {
		const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [0, 0],
					left: getBounds.left,
					right: getBounds.left+getBounds.width,
				}
			});
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			});
		}
	}, [state.window[0], state.window[1]]);

	useEffect(() => {
		setChanged(prevState => !prevState);
	}, [state.containers[0][0].changed]);

	return (
		<div id='shown' className={`${classes.container} ${changed}`}>
			{state.containers[0][0].cardContainer.length >= 5
				? <PlayCard
					parentPosition={[(bounds.left+(4*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					positionInContainer={4}
					showOne={true}
					zIndex={5}
					changed={changed}
				/> : <></>}
			{state.containers[0][0].cardContainer.length >= 4
				? <PlayCard
					parentPosition={[(bounds.left+(3*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					positionInContainer={3}
					showOne={true}
					zIndex={4}
					changed={changed}
				/> : <></>}
			{state.containers[0][0].cardContainer.length >= 3
				? <PlayCard
					parentPosition={[(bounds.left+(2*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					positionInContainer={2}
					showOne={true}
					zIndex={3}
					changed={changed}
				/> : <></>}
			{state.containers[0][0].cardContainer.length >= 2
				? <PlayCard
					parentPosition={[(bounds.left+(1*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					positionInContainer={1}
					showOne={true}
					zIndex={2}
					changed={changed}
				/> : <></>}
			{state.containers[0][0].cardContainer.length >= 1
				? <PlayCard
					parentPosition={[(bounds.left+(0*cardMidWidth)), bounds.top]}
					container={[0, 0]}
					positionInContainer={0}
					showOne={true}
					zIndex={1}
					changed={changed}
				/> : <></>}
			{state.containers[4][0].cardContainer.length > 0
			? <PlayCard
				parentPosition={[(bounds.left), bounds.top]}
				container={[4, 0]}
				positionInContainer={state.containers[4][0].cardContainer.length-1}
				showOne={true}
				zIndex={-1}
				changed={changed}
			/> : <></>}
		</div>
	);
}

export default ShownContainer;