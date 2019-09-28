import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game.js';



function DifficultyScreen(props){
	return (
		<div className="difficulty-screen">
			<button className="difficulty-button" onClick={() => props.onClick({ row_number: 8, column_number: 8, mine_number: 10 })}>
				Easy
			</button>
			<button className="difficulty-button" onClick={() => props.onClick({ row_number: 16, column_number: 16, mine_number: 40 })}>
				Intermediate
			</button>
			<button className="difficulty-button" onClick={() => props.onClick({ row_number: 16, column_number: 30, mine_number: 99 })}>
				Advanced
			</button>
		</div>
	);
}

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			row_number: null,
			column_number: null,
			mine_number: null
		};
	}

	handleClick = (difficulty) => {
		let { row_number, column_number, mine_number } = difficulty;
		this.setState({ row_number, column_number, mine_number });
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
				{!(this.state.row_number && this.state.column_number && this.state.mine_number)
					? <DifficultyScreen
						onClick={this.handleClick} />
					: <Game
						row_number={this.state.row_number}
						column_number={this.state.column_number}
						mine_number={this.state.mine_number}
						width={this.state.width}
						height={this.state.height} />
				}
			</div>
		);
	}
}

document.body.style = 'background: #31363c;';

ReactDOM.render(
	<Home />,
	document.getElementById('root')
);
