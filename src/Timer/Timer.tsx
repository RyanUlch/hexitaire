import { useState, useEffect } from 'react';

const Timer = (props: {timerReact: number}) => {
	const [timer, setTimer] = useState([0,0,0]);

	useEffect(() => {
		let intervalID: NodeJS.Timer;
		switch(props.timerReact) {
			case 0: {
				console.log('set interval');
				intervalID = setInterval(() => {
					setTimer(prev => {
						const newTime = [...prev];
						if (newTime[2] === 59) {
							newTime[2] = 0;
							newTime[1] += 1;
							if (newTime[1] === 59) {
								newTime[1] = 0;
								newTime[0] += 1;
							}
						}
						newTime[2] += 1;
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
		<p>Timer: Hours: {timer[0]}, Minutes: {timer[1]}, Seconds: {timer[2]}</p>
	)
}

export default Timer;