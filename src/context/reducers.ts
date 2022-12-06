export const cardReducer = (state: any, action: any) => {
	switch (action.type) {
		case 'SETCOLUMNBOUNDS':
			const updateState = state;
			updateState[action.payload.column[0]][action.payload.column[1]].containerDisplay[0] = action.payload.left;
			updateState[action.payload.column[0]][action.payload.column[1]].containerDisplay[1] = action.payload.right;
			return updateState;
		default:
			return new Error('Not an available Action Type');
	  }
}