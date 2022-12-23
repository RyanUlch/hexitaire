// CSS Import
import classes from './Modal.module.css';
// Library Imports
import ReactDOM from 'react-dom';

// Modal Backdrop, used to check if user has clicked off the modal
const ModalBackdrop = (props: any) => {
	return (
		<div className={classes.backdrop} onClick={props.onClick}></div>
	)
}

// Modal popup, contains children where implimented, will always give confirm alert when clicked off of
const Modal = (props: {onClose: any, children: any}) => {
	const clickOffHandler = () => {
		props.onClose();
	}

	const modalElement = document.getElementById('modal-root');
	if (modalElement) {
		// Portals to the top of HTML page found in public/index.html to always be the top element when selected
		return ReactDOM.createPortal(
			<>
				<ModalBackdrop onClick={clickOffHandler}/>
					<section className={classes.modal}>
						{props.children}
					</section>
			</>, modalElement
		) as React.ReactElement;
	} else {
		return (<p>Error</p>)
	}


	 
}

export default Modal;