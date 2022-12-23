import Modal from "../Modal";

const RulesModal = (props: {onClose: any}) => {


	return (
		<Modal onClose={props.onClose}>
			<p>Rules Modal</p>
		</Modal>
	)
}

export default RulesModal;