import { useState, useEffect } from 'react';

const Timer = (props: {timerReact: number, classes: any}) => {
	const [timer, setTimer] = useState([0,0]);

	useEffect(() => {
		let intervalID: NodeJS.Timer;
		switch(props.timerReact) {
			case 0: {
				console.log('set interval');
				intervalID = setInterval(() => {
					setTimer(prev => {
						const newTime = [...prev];
						newTime[1] += 1;
						if (newTime[1] === 59) {
							newTime[1] = 0;
							newTime[0] += 1;
						}
						return newTime;
					});
				}, 1000);
				break;
			}
			case 1: {
				break;
			}
			case 2: {
				setTimer([0, 0, 0]);
				break;
			}
		}
		return () => {clearInterval(intervalID)}

	}, [props.timerReact]);
	
	return (
		<button className={props.classes.even}>Minutes: {timer[0]} Seconds: {timer[1]}</button>
	)
}

export default Timer;