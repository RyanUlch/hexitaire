import Modal from "../Modal";

const RulesModal = (props: {onClose: any}) => {
	return (
		<Modal onClose={props.onClose}>
			<h3>How to play Hexitaire</h3>
			<p>&emsp;The game is played with four finished piles (Green Border), 8 In-Play piles (), draw pile (Red Border), and the stock pile (Right of the Draw Pile).</p>
			<p>&emsp;The cards are generated from the Hexidecimal system. The system uses 16 unique symbols for the numbers (0-9, and A-F). (Remember, the A card is for number 10, not the Ace)</p>
			<p>&emsp;The finished piles are constructed with the same suit from 0 to F, with the 0th card being the lowest card and the Fth Card being the highest (last).</p>
			<p>&emsp;The in-play piles are constructed in alternating colors, with the cards being played in descending numbers. For example, a green 7th can be played on a pink 8th, but not on a green 8th.</p>
			<p>&emsp;Cards in a finished pile can be moved to other finished piles or to the in-play piles as long as they follow the construction of piles rules above.</p>
			<p>&emsp;If an in-play pile becomes empty, it can be filled with any card or sequence of cards that are built down in alternating colors.</p>
			<p>&emsp;The draw pile can be turned over to give you 1 (easy), 3 (medium), or 5 (hard) cards at a time to form the stock pile. The top card of the stock pile is available for play to the finished or in-play piles.</p>
			<p>The game is won when all the cards have been moved to the foundation piles.</p>
			<p>The game is lost when no more moves can be made and the draw pile is empty.</p>
		</Modal>
	)
}

export default RulesModal;