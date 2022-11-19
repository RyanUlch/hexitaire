// Used to verify if the card position is within any specific column/drop area
export const verifyPosition = (dropSections: any) => {
	// For test - expecting {col0: [Non-Zero Num, Non-Zero Num]}
	// Actual {col0: [0, 0]}
	console.log(dropSections);
	// Currently just checking if values are not zero. Would be checking
	// if it is within any bounds
	if (dropSections.col0[0] > 0 && dropSections.col0[1] > 0) {
		console.log('success');
	} else {
		console.log('failure');
	}
};