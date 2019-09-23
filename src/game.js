import React from 'react';

function Square(props) {
    return (
        <button
            className="square"
            style={{height: props.size, width: props.size}}
            onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Minefield extends React.Component {
    constructor(props) {
        super(props);

        //populates an array with mines
        let mines = Array(props.difficulty[0]*props.difficulty[1]);
        for (let i = 0; i < mines.length; i++)
            mines[i] = i < props.difficulty[2];

        //shuffles mines
        for (let i = mines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mines[i], mines[j]] = [mines[j], mines[i]];
        }

        let squares = [];
        let num = 0;
        for (let i = 0; i < props.difficulty[0]; i++) {
            squares.push([]);

            for (let j = 0; j < props.difficulty[1]; j++)
                squares[i].push(mines[num++]);
        }

        this.state = {
            squares: squares
        };
    }

    updateSquare() {
        alert('Square cleared');
    }

    handleClick = (i, j) => {
        if (this.state.squares[i][j])
            alert('You lost!');
        else
            this.updateSquare();
    };

    renderSquare(i, j, size) {
        return (
            <Square
                key={i + ': ' + j}
                value={this.state.squares[i][j]}
                onClick={() => this.handleClick(i, j)}
                size={size}
            />
        )
    }

    render = () => {
        let size = Math.min(0.96*this.props.height / this.props.difficulty[0], 0.9*this.props.width / this.props.difficulty[1]);

        const grid = [];

        for (let i = 0; i < this.state.squares.length; i++) {
            const grid_row = [];

            for (let j = 0; j < this.state.squares[i].length; j++)
                grid_row.push(this.renderSquare(i, j, size));

            grid.push(
                <div key={i} className="row">
                    {grid_row}
                </div>
            );
        }

        return (
            <div>
                {grid}
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <Minefield
                    difficulty={this.props.difficulty}
                    width={this.props.width}
                    height={this.props.height} />
            </div>
        );
    }
}

export default Game