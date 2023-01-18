// CSS Module Import:
import classes from './DedicationModal.module.css';
// Component Import:
import Modal from "../Modal";

// Dedication Modal is used to show the player a little bit about me, as well as give credit to the few resources used in building the game
const DedicationModal = (props: {onClose: () => void}) => {
	return (
		// Modal component handles the larger box, and dealing with closing the modal
		<Modal onClose={props.onClose}>
			{/* My dedication to my wife and our lovely pets */}
			<h3 className={classes.title}>Hexitare Dedication</h3>
			<div className={classes.textContainer}>
				<p>Hexitaire is a labor of love for solitaire games, and the hexadecimal system.</p>
				<p>I want to give a big thanks to my wonderful wife Lucy Frank for supporting me in this journey. She gives me the strength to keep improving, learning and trying new things.</p>
				<p>Also a dedication to our beloved pets, Soy Sauce, Sushi, and Miso (Yes there was a theme there)</p>
				<div className={classes.imageContainer}>
					<img src='/images/SoySauce.jpg' alt='Our cat Soy Sauce' />
					<img src='/images/Lucy.jpg' alt='My Lovely wife Lucy with our cat' />
					<img src='/images/sushiMiso.jpg' alt='Our guinea pigs Sushi, and Miso' />
				</div>
			</div>
			<br />
			{/* Acknowledgements for the resources used in making the game, some mandatory by license, some just to shout out others work */}
			<h3 className={classes.title}>Acknowledgements</h3>
			<div className={classes.textContainer}>
				<p className={classes.center}>Background Image by <a href="https://www.freepik.com/free-photo/top-view-felt-fabric-texture_27640942.htm#query=felt%20texture&position=40&from_view=search&track=sph">Freepik</a></p>
				<p>Fonts used with open license: <a className={classes.font1} href='https://fonts.google.com/specimen/Merriweather'>Merriweather</a>, <a className={classes.font2} href='https://fonts.google.com/specimen/Sigmar+One'>Sigmar One</a>, and <a className={classes.font3} href='https://fonts.google.com/specimen/Vujahday+Script'>Vujahday Script</a></p>
				<p>Made with <a href='https://reactjs.org/'>React</a> and <a href='https://www.typescriptlang.org/'>Typescript</a></p>
				<p>The Rules for Hexitaire were first generated by <a href='https://chat.openai.com/'>ChatGPT</a> and then edited by me.</p>
			</div>
			<br />
			{/* Contact info for if the player would like to contact me over an issue regarding the game */}
			<h3 className={classes.title}>Contact Me</h3>
			<div className={classes.textContainer}>
				<p>If you encounter a bug, have a suggestion or comment; you can contact me at RyanUlchDev@Gmail.com.</p>
				<p>If you've enjoyed playing Hexitaire, you should check out my personal website <a href='https://RyanUlch.com'>RyanUlch.com</a> for my other projects, and even more pictures of my family.</p>
				<p>P.S. I am also looking for a job within Web Development, so if you are an employer, or know someone looking for a web developer, please contact me at the e-mail above.</p>
				<br />
			</div>
			<h4 className={classes.title}>Thank you, and play on!</h4>
			<br />
			{/* Buy Me A Coffee link for anyone wishing to support my work monetarily */}
			<div className={classes.textContainer}>
				<a href="https://www.buymeacoffee.com/RyanUlch" target="_blank" rel='noreferrer'><img className={classes.bmac} src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Donate button for Hexitaire" /></a>
			</div>
		</Modal>
	);
}

export default DedicationModal;