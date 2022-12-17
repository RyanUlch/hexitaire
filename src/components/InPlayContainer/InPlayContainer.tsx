import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';
import { cardHeight } from '../../helpers/globals';

const InPlayContainer = (props: {containerNum: number, topLine: number | undefined}) => {
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
				top: getBounds.top,
			})
		}
	}, []);

	useEffect(() => {
		const getBounds = document.querySelector(String(`#c${props.containerNum}`))?.getBoundingClientRect();
		if (getBounds?.left && getBounds?.top) {
			setBounds({
				left: getBounds.left,
				top: getBounds.top,
			})
		}
	}, [props.topLine]);

	//const [containerCount, setContainerCount] = useState((state.containers[2][props.containerNum].cardContainer.length > 0) ? 0 : -1)
		
	// useEffect(()=> {
	// 	setContainerCount((state.containers[2][props.containerNum].cardContainer.length > 0) ? 0 : -1);
	// }, [state]);

	const [cardSet, setCardSet] = useState(<></>);

	useEffect(()=> {
		setCardSet(<PlayCard
			parentPosition={[bounds.left, bounds.top]}
			container={[2, props.containerNum]}
			positionInContainer={0}
			moves={state.moves}
			showOne={false}
			zIndex={1}
			//key={`${(state.containers[2][props.containerNum].cardContainer.length > 0) ? state.containers[2][props.containerNum].cardContainer[0].number+'-'+state.containers[2][props.containerNum].cardContainer[0].suit : 'InPlay'+props.containerNum}`}
		/>)
	}, [state]);

	return (
		<div id={`c${props.containerNum}`} className='container'>
			{cardSet}
			
		</div>
	)
}

export default InPlayContainer;