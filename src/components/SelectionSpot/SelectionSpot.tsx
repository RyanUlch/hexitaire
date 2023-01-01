import { AppContext, AppDispatchContext } from "../../context/context";
import { useContext, useEffect, useState } from "react";
import classes from './SelectionSpot.module.css';
const SelectionSpot = () => {
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppDispatchContext);	const [isEmpty, setIsEmpty] = useState(false);
	const showMore = () => {
		console.log('showing more')
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