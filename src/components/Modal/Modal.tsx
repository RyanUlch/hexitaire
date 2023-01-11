// CSS Module Import:
import classes from './Modal.module.css';
// React Import:
import ReactDOM from 'react-dom';
import { ReactNode } from 'react';

// Modal Backdrop, used to check if user has clicked off the modal - Not exported as it can only be used by Modal
const ModalBackdrop = (props: {onClick: () => void}) => {
	return (<div className={classes.backdrop} onClick={props.onClick}></div>);
}

// Modal popup, contains children where implemented, will always give confirm alert when clicked off of
const Modal = (props: {onClose: () => void, children: ReactNode}) => {
	// Handler to close the modal when player click the ModalBackdrop	
	const clickOffHandler = () => {
		props.onClose();
	}

	// Try and get the modal-root - Should always exist since it is hard coded in public/index.html
	const modalElement = document.getElementById('modal-root');
	if (modalElement) {
		// Portals to the top of HTML page found in public/index.html to always be the top element when selected
		return ReactDOM.createPortal(
			<>
				<ModalBackdrop onClick={clickOffHandler}/>
					<section className={classes.modal}>
						{/* Button to close modal, can also click anywhere on the backdrop to close */}
						<button className={classes.closebtn} onClick={clickOffHandler} type='button'>close</button>
						{props.children}
					</section>
			</>, modalElement
		) as React.ReactElement;
	} else {
		return (<p>Error</p>)
	}
}

export default Modal;