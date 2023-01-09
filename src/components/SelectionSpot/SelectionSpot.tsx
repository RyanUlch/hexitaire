import { AppContext, AppDispatchContext } from "../../context/context";
import { useContext, useEffect, useState } from "react";
import classes from './SelectionSpot.module.css';
const SelectionSpot = () => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);	const [isEmpty, setIsEmpty] = useState(false);
	const [bounds, setBounds] = useState({left: 0, top: 0})
	
	const showMore = () => {
		if (state.containers[1][0].cardContainer.length > 0) {
			dispatch({
				type: 'FLIPCARDS',
			});
		} else if (state.containers[0][0].cardContainer.length > 0) {
			dispatch({
				type: 'RESETFLIPPEDCARDS',
			})
		} // If both are false, there are no more available cards. Do nothing.
	}

	useEffect(() => {
		const getBounds = document.querySelector(String(`#shown`))?.getBoundingClientRect();
		if (getBounds) {
			dispatch({
				type: 'SETCOLUMNBOUNDS',
				payload: {
					column: [1, 0],
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

	useEffect(()=> {
		setIsEmpty(state.containers[1][0].cardContainer.length > 0 ? false : true);
	},[state.containers[1][0].changed]);

	return (
		<div onClick={showMore} className={classes.container}>
			{isEmpty ? <></> : <img src='\images\hexBack.png' className={classes.img} alt='' />}
		</div>
	)
}

export default SelectionSpot;