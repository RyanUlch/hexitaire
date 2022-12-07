import { useContext, useEffect } from 'react';
import { classicNameResolver } from 'typescript';
import { useAppContext } from '../../../context/context';
import PlayCard from '../../PlayCard/PlayCard';

const InPlayContainer = (props: {containerNum: number}) => {
	const {state, dispatch} = useAppContext();

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
		}
	}, []);

	const cardDisplay = () => {
		if (state.containers[2][props.containerNum].cardContainer.length > 0) {
			return (
				<PlayCard
					parentPosition={[state.containers[2][props.containerNum].containerDisplay[0], state.containers[2][props.containerNum].containerDisplay[1]]}
					container={[2, props.containerNum]}
					position={0}
				/>
			);
		} else {
			return <div>No Cards</div>;
		}
		
	}

	return (
		<div id={`c${props.containerNum}`} className='container'>
			{cardDisplay()}
		</div>
	)
}

export default InPlayContainer;