import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game.js';



function DifficultyScreen(props){
	return (
		<div className="difficulty-screen">
			<button className="difficulty-button" onClick={() => props.onClick(8, 8, 10)}>
				Easy
			</button>
			<button className="difficulty-button" onClick={() => props.onClick(16, 16, 40)}>
				Intermediate
			</button>
			<button className="difficulty-button" onClick={() => props.onClick(16, 30, 99)}>
				Advanced
			</button>
		</div>
	);
}

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			difficulty: null
		};
	}

	handleClick = (rows, columns, mines) => {
		this.setState({
			difficulty: [rows, columns, mines]
		});
	};

	updateDimensions = () =>
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight
		});

	componentWillMount() {
		this.updateDimensions();
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	render() {
		return (
			<div className="Home">
				{!this.state.difficulty
					? <DifficultyScreen
						onClick={this.handleClick} />
					: <Game
						difficulty={this.state.difficulty}
						width={this.state.width}
						height={this.state.height} />
				}
			</div>
		);
	}
}

ReactDOM.render(
	<Home />,
	document.getElementById('root')
);
