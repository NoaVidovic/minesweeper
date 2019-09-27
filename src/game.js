import React from 'react';

function Square(props) {
    return (
        <button
            className="Square"
            style={{height: props.size, width: props.size}}
            onClick={props.onClick}>
            {props.state}
        </button>
    )
}

class Minefield extends React.Component {
    constructor(props) {
        super(props);

        //populates an array with mines
        let mine_list = Array(props.row_number * props.column_number);
        for (let i = 0; i < mine_list.length; i++)
            mine_list[i] =
                i < props.mine_number
                    ? 'mine'
                    : 'idle';

        //shuffles mines
        for (let i = mine_list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mine_list[i], mine_list[j]] = [mine_list[j], mine_list[i]];
        }

        //turns the mine array into a grid
        let mines = [];
        let num = 0;
        for (let i = 0; i < props.row_number; i++) {
            mines.push([]);

            for (let j = 0; j < props.column_number; j++)
                mines[i].push(mine_list[num++]);
        }

        this.state = {
            mines: mines
        };
    }

    findMineNum(i, j) {
        let num = 0;
        for (let a = i-1; a <= i+1; a++) {
            if (a < 0 || a >= this.props.row_number)
                continue;

            for (let b = j-1; b <= j+1; b++) {
                if (b < 0 && b >= this.props.column_number)
                    continue;

                if (this.state.mines[a][b] === 'mine')
                    num++;
            }
        }
        return num;
    }

    clearAroundZero(i, j) {
        for (let a = i-1; a <= i+1; a++) {
            if (a < 0 || a >= this.props.row_number)
                continue;

            for (let b = j-1; b <= j+1; b++) {
                if (b < 0 || b >= this.props.column_number)
                    continue;

                if (this.state.mines[a][b] === 'idle')
                        this.updateSquare(a, b);
            }
        }
    }

    updateSquare(i, j) {
        //TODO: change css for clicked square state

        let mines = this.state.mines;
        const mine_num = this.findMineNum(i, j);

        if (mine_num === 0) {
            mines[i][j] = '.';
            this.clearAroundZero(i, j);
        } else {
            mines[i][j] = mine_num;
        }

        this.setState({mines});
    }

    handleClick = (i, j) => {
        if (this.state.mines[i][j] === 'mine')
            alert('You lost!');
        else
            this.updateSquare(i, j);
    };

    renderSquare(i, j, size) {
        const square = this.state.mines[i][j];

        return (
            <Square
                key={i + ': ' + j}
                state={
                    ['mine', 'idle'].includes(square)
                        ? null : square
                }
                onClick={() => this.handleClick(i, j)}
                size={size}
            />
        )
    }

    render = () => {
        let size = Math.min(
            0.96*this.props.height / this.props.row_number,
            0.9*this.props.width / this.props.column_number);

        const grid = [];

        for (let i = 0; i < this.state.mines.length; i++) {
            const grid_row = [];

            for (let j = 0; j < this.state.mines[i].length; j++)
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
                    row_number={this.props.row_number}
                    column_number={this.props.column_number}
                    mine_number={this.props.mine_number}
                    width={this.props.width}
                    height={this.props.height} />
            </div>
        );
    }
}

export default Game