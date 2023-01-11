// These globals are used to make sure that the card size updates appropriately with the clamped font-size

// The base font Size to use for card sizing
export const fontSize		= parseFloat(getComputedStyle(document.documentElement).fontSize);

// The cards are sized to the font size above
export const cardWidth		= fontSize*5;
export const cardHeight		= fontSize*7;

// Used to get the middle of the card when dragging cards
export const cardMidWidth	= cardWidth/2;
export const cardMidHeight	= cardHeight/2;