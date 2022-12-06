
import classes from './GameContainer.module.css'

import InPlayContainer from './InPlayContainer/InPlayContainer';

const GameContainer = () => {

	return (
		<div className='columns'>		
			<InPlayContainer containerNum={0} />
			<InPlayContainer containerNum={1} />
			<InPlayContainer containerNum={2} />
			<InPlayContainer containerNum={3} />
			<InPlayContainer containerNum={4} />
			<InPlayContainer containerNum={5} />
			<InPlayContainer containerNum={6} />
			<InPlayContainer containerNum={7} />
		</div>
	)
}

export default GameContainer;