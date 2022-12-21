import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/context';
import PlayCard from '../PlayCard/PlayCard';

const FinishedContainer = (props: {containerNum: number, topLine: number | undefined}) => {
	const {state, dispatch} = useContext(AppContext);
	const [bounds, setBounds] = useState({left: 0, top: 0});
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
	}, [props.topLine]);

	const [cardSet, setCardSet] = useState(<></>);

	useEffect(()=> {
		setCardSet((prevState) => {
			if (state.containers[3][props.containerNum].cardContainer.length > 0) {
				return (
					<>
						<PlayCard
							parentPosition={[bounds.left, bounds.top]}
							container={[3, props.containerNum]}
							positionInContainer={state.containers[3][props.containerNum].cardContainer.length-1}
							moves={state.moves}
							showOne={true}
							zIndex={1}
						/>
						{state.containers[3][props.containerNum].cardContainer.length-2 >= 0 ?
							<PlayCard
								parentPosition={[bounds.left, bounds.top]}
								container={[3, props.containerNum]}
								positionInContainer={state.containers[3][props.containerNum].cardContainer.length-2}
								moves={state.moves}
								showOne={true}
								zIndex={0}
							/>
							: <></>
						}

					</>
				);
			} else {
				return (<></>)
			}
		}
	);
	}, [state.containers[3][props.containerNum].cardContainer.length]);

	return (
		<div id={`f${props.containerNum}`} key={`f${props.containerNum}`} className='container'>
			{cardSet}
		</div>
	)
}

export default FinishedContainer;