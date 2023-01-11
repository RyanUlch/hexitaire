import './App.css';
import GameContainer from './components/GameContainer/GameContainer';
import { AppProvider } from './context/context';

function App() {
	return (
		<AppProvider>
			<GameContainer />
		</AppProvider>
	);
}

export default App;