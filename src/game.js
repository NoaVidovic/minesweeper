import React from 'react';
import './button.css';

import blank from './img/blank.svg';
import flag from './img/flag.svg';
import icon1 from './img/1mines.svg';
import icon2 from './img/2mines.svg';
import icon3 from './img/3mines.svg';
import icon4 from './img/4mines.svg';
import icon5 from './img/5mines.svg';
import icon6 from './img/6mines.svg';
import icon7 from './img/7mines.svg';
import icon8 from './img/8mines.svg';

function getImage(state) {
    switch (state) {
        case 1:
            return icon1;
        case 2:
            return icon2;
        case 3:
            return icon3;
        case 4:
            return icon4;
        case 5:
            return icon5;
        case 6:
            return icon6;
        case 7:
            return icon7;
        case 8:
            return icon8;
        case '!':
            return flag;
        default:
            return blank;
    }
}

function Square(props) {
    let squareStyle = {
        height: props.size,
        width: props.size
    };

    return (
        <button
            className="active-square"
            style={squareStyle}
            disabled={props.disabled}
            onMouseDown={
                e => e.button === 0
                    ? props.onLeftClick()
                    : props.onRightClick()
            }
            onDragStart={e => e.preventDefault()}
        >
            <img
                src={getImage(props.state)}
                alt=''
                width='80%'
                height='80%'
            />
        </button>
    )
}

class Minefield extends React.Component {
    constructor(props) {
        super(props);

        //populates an array with mines
        let mine_list = Array(props.row_number * props.column_number);
        for (let i = 0; i < mine_list.length; i++)
            mine_list[i] = i < props.mine_number;

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

        let state = [...Array(props.row_number)].map(() => Array(props.column_number).fill(null));

        this.state = {
            mines: mines,
            state: state,
            opened: 0
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

                if (this.state.mines[a][b])
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

                if (this.state.state[a][b] == null)
                    this.updateSquare(a, b);
            }
        }
    }

    updateSquare(i, j) {
        //TODO: FIND A BETTER WAY TO DO THIS!
        this.state.opened += 1;

        let state = this.state.state;
        const mine_num = this.findMineNum(i, j);

        state[i][j] = mine_num;

        if (mine_num === 0)
            this.clearAroundZero(i, j);

        this.setState({state});
    }

    setFlag(i, j) {
        let state = this.state.state;
        if (state[i][j] === '!')
            state[i][j] = null;
        else
            state[i][j] = '!';

        this.setState({state});
    }

    handleClick = (i, j) => {
        if (this.state.state[i][j] !== '!')
            if (this.state.mines[i][j])
                alert('You lost!');
            else
                this.updateSquare(i, j);
    };

    renderSquare(i, j, size) {
        const state = this.state.state[i][j];

        return (
            <Square
                key={i + ': ' + j}
                state={state}
                onLeftClick={() => this.handleClick(i, j)}
                onRightClick={() => this.setFlag(i, j)}
                size={size}
                disabled={![null, '!'].includes(state)}
            />
        )
    }

    render = () => {
        let size = Math.min(
            0.96*this.props.height / this.props.row_number,
            0.9*this.props.width / this.props.column_number);

        const grid = [];

        for (let i = 0; i < this.props.row_number; i++) {
            const grid_row = [];

            for (let j = 0; j < this.props.column_number; j++)
                grid_row.push(this.renderSquare(i, j, size));

            grid.push(
                <div key={i} className="row">
                    {grid_row}
                </div>
            );
        }

        let won = this.state.opened === this.props.row_number*this.props.column_number - this.props.mine_number;
        if (won)
            alert('You won!');

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