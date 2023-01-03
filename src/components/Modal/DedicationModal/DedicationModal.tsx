import Modal from "../Modal";
import classes from './DedicationModal.module.css';

const DedicationModal = (props: {onClose: any}) => {
	return (
		<Modal onClose={props.onClose}>
			<h3 className={classes.title}>Hexitare Dedication</h3>
			<div className={classes.textContainer}>
				<p>Hexitaire is a labor of love for solitaire games, and the hexidecimal system.</p>
				<p>I want to give a big thanks to my wonderful wife Lucy Frank for supporting me in this journey. She is gives me the strength to keep improving, learning and trying new things.</p>
				<p>Also a dedication to our beloved pets, Soy Sauce, Sushi, and Miso (Yes there was a theme there)</p>
				<div className={classes.imageContainer}>
					<img src='/images/SoySauce.jpg' alt='Our cat Soy Sauce' />
					<img src='/images/Lucy.jpg' alt='My Lovely wife Lucy with our cat' />
					<img src='/images/sushiMiso.jpg' alt='Our guinea pigs Sushi, and Miso' />
				</div>
				<br />
				<h3 className={classes.title}>Acknowledgements</h3>
				<p className={classes.center}>Background Image by <a href="https://www.freepik.com/free-photo/top-view-felt-fabric-texture_27640942.htm#query=felt%20texture&position=40&from_view=search&track=sph">Freepik</a></p>
				<p>Fonts used with open license: <a className={classes.font1} href='https://fonts.google.com/specimen/Merriweather'>Merriweather</a>, <a className={classes.font2} href='https://fonts.google.com/specimen/Sigmar+One'>Sigmar One</a>, and <a className={classes.font3} href='https://fonts.google.com/specimen/Vujahday+Script'>Vujahday Script</a></p>
				<br />
				<h3 className={classes.title}>Contact Me</h3>
				<p>If you encounter a bug, or have a suggestion or comment, you can contact me at RyanUlchDev@Gmail.com.</p>
				<p>If you've enjoyed playing Hexitaire, you should check out my personal website <a href='https://RyanUlch.com'>RyanUlch.com</a> for my other projects, and even more pictures of my family.</p>
				<p>P.S. I am also looking for a job within Web Developement, so if you are an employer, or know someone looking for a web developer, please contact me at the e-mail above.</p>
				<br />
				<h4 className={classes.title}>Thank you, and play on!</h4>
			</div>
		</Modal>
	);
}

export default DedicationModal;