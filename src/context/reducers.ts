export const cardReducer = (state: any, action: any) => {
	switch (action.type) {
		case 'SETCOLUMNBOUNDS':
			const updateState = state;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState.containers[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return updateState;

		case 'SETMIDDLELINE':
			const midLineState = state;
			midLineState.middleLine = action.payload;
			return midLineState;

		case 'MOVECARD':
			const cardTop = action.payload.cardTop;
			const cardLeft = action.payload.cardLeft;
			if (cardTop > state[4]) {
				// above dividing line
			} else {

			}
			return state;


		default:
			return new Error('Not an available Action Type');
	  }
}