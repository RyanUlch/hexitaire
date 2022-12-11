import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';

const FinishedContainer = (props: {containerNum: number}) => {
	const {state, dispatch} = useContext(AppContext);
	const [bounds, setBounds] = useState({left: 0, top: 0});
	useEffect(() => {
		const getBounds = document.querySelector(String(`#c${props.containerNum}`))?.getBoundingClientRect();
		console.log()
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
	}, []);

	const [containerCount, setContainerCount] = useState(state.containers[3][props.containerNum].cardContainer.length -1)
		
	useEffect(()=> {
		console.log(state.containers[3][props.containerNum].cardContainer.length)
		setContainerCount((state.containers[3][props.containerNum].cardContainer.length-1));
	}, [state]);

	return (
		<div id={`c${props.containerNum}`} className='container'>
			<PlayCard
				parentPosition={[bounds.left, bounds.top]}
				container={[3, props.containerNum]}
				position={containerCount}
				moves={state.moves}
				showOne={true}
				zIndex={1}
			/>
			{/* {containerCount-1 >= 0 ?
				<PlayCard
					parentPosition={[bounds.left, bounds.top]}
					container={[3, props.containerNum]}
					position={containerCount-1}
					moves={state.moves}
					showOne={true}
					zIndex={0}
				/>
				: <></>
			} */}
		</div>
	)
}

export default FinishedContainer;