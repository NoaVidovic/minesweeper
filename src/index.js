import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	)
}

class Minefield extends React.Component {
	constructor(props) {
		super(props);

		let array = Array(9);
		for (let i = 0; i < 9; i++)
			array[i] = i;

		this.state = {
			squares: array
		};
	}

	renderSquare(i) {
		return (
			<Square
				value={this.state.squares[i]}
				onClick={() => alert(i)}
			/>
		)
	}

	render() {
		return (
			<div>
				<div className="row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Screen extends React.Component {
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Minefield />
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Screen />,
	document.getElementById('root')
);
