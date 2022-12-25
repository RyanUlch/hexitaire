import { AppContext } from "../../../context/context";
import { useContext, useEffect, useState } from "react";
import classes from './SelectionSpot.module.css';
const SelectionSpot = (props: {moves: number}) => {
	const {state, dispatch} = useContext(AppContext);
	const [isEmpty, setIsEmpty] = useState(false);
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

	useEffect(()=> {
		setIsEmpty(state.containers[1][0].cardContainer.length > 0 ? false : true);
	},[props.moves]);

	return (
		<div onClick={showMore} className={`${isEmpty ? classes.empty : classes.full} ${classes.container}`}>
		
		</div>
	)
}

export default SelectionSpot;