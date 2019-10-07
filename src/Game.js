import React from 'react';
import './Game.css';

import blank from './img/blank.svg';
import flag from './img/flag.svg';
import mine from './img/mine.svg';
import exploded from './img/exploded.svg';
import incorrect from './img/incorrect.svg';
import icon1 from './img/1mines.svg';
import icon2 from './img/2mines.svg';
import icon3 from './img/3mines.svg';
import icon4 from './img/4mines.svg';
import icon5 from './img/5mines.svg';
import icon6 from './img/6mines.svg';
import icon7 from './img/7mines.svg';
import icon8 from './img/8mines.svg';

const Store = window.require('electron-store');
const store = new Store();


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
        case 'mine':
            return mine;
        case 'exploded':
            return exploded;
        case 'incorrect':
            return incorrect;
        default:
            return blank;
    }
}

function writeHighscore(time, {row_number, column_number, mine_number}) {
    const difficulty = `${row_number} ${column_number} ${mine_number}`;
    const highscores = store.get(difficulty);

    console.log(time);

    if (!highscores) {
        alert('Congrats! Top 10 score!');

        const highs = [time];
        store.set(difficulty, highs);

        console.log(highs);
    } else if (highscores.some(hs => hs > time) || highscores.length < 10) {
        alert('Congrats! Top 10 score!');

        highscores.push(time);
        highscores.sort((a, b) => a-b);

        if (highscores.length > 10)
            highscores.pop();

        store.set(difficulty, highscores);
        console.log(highscores);
    } else console.log('not a top 10;');

    //TODO: add pop-up that shows highscores and highlights current score
}

function Square(props) {
    let squareStyle = {
        height: props.size,
        width: props.size
    };

    if ([null, '!', 'mine', 'incorrect'].includes(props.state)) {
        return (
            <button
                className="unopened-square"
                style={squareStyle}
                onMouseDown={
                    e => props.gameOver
                        ? null
                        : e.button === 0
                            ? props.onLeftClick()
                            : props.onRightClick()
                }
                onDragStart={e => e.preventDefault()}
                onClick={e => e.preventDefault()}
                onContextMenu={e => e.preventDefault()}
                disabled={props.gameOver}
            >
                <img
                    src={getImage(props.state)}
                    alt=''
                    width='70%'
                    height='70%'
                />
            </button>
        );
    } else {
        return (
            <button
                className="number-square"
                style={squareStyle}
                onMouseDown={
                    props.gameOver
                        ? null
                        : props.onNumberClick
                }
                onDragStart={e => e.preventDefault()}
                onClick={e => e.preventDefault()}
                onContextMenu={e => e.preventDefault()}
            >
                <img
                    src={getImage(props.state)}
                    alt=''
                    width='70%'
                    height='70%'
                />
            </button>
        );
    }
}

class Minefield extends React.Component {
    constructor(props) {
        super(props);

        let state = [...Array(this.props.row_number)].map(() => Array(this.props.column_number).fill(null));
        this.state = {
            state: state,
            opened: 0,
        };
    }

    spawnMines(a, b) {
        //populates an array with mines
        let mine_list = Array(this.props.row_number * this.props.column_number - 9);
        for (let i = 0; i < mine_list.length; i++)
            mine_list[i] = i < this.props.mine_number;

        //shuffles mines
        for (let i = mine_list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mine_list[i], mine_list[j]] = [mine_list[j], mine_list[i]];
        }

        //turns the mine array into a grid
        let mines = [];
        let num = 0;
        for (let i = 0; i < this.props.row_number; i++) {
            mines.push([]);

            for (let j = 0; j < this.props.column_number; j++) {
                if (a-1 <= i && i <= a+1 && b-1 <= j && j <= b+1)
                    mines[i].push(false);
                else
                    mines[i].push(mine_list[num++]);
            }
        }

        this.setState({
            mines: mines,
        }, () => this.openSquare(a, b));
    }

    handleWin() {
        writeHighscore(new Date() - this.state.time, this.props);

        this.setState({disabled: true});
    }

    handleLoss(a, b) {
        let state = this.state.state;

        for (let i = 0; i < this.props.row_number; i++)
            for (let j = 0; j < this.props.column_number; j++) {
                if (this.state.mines[i][j] && this.state.state[i][j] !== '!')
                    state[i][j] = 'mine';

                if (!this.state.mines[i][j] && this.state.state[i][j] === '!')
                    state[i][j] = 'incorrect';
            }

        state[a][b] = 'exploded';

        this.setState({state: state, disabled: true});
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
                    this.openSquare(a, b);
            }
        }
    }

    openSquare(i, j) {
        let state = this.state.state;
        const mine_num = this.findMineNum(i, j);

        state[i][j] = mine_num;

        if (mine_num === 0)
            this.clearAroundZero(i, j);

        this.setState(prevState => {
            return {
                state: state,
                opened: prevState.opened + 1
            };
        });
    }

    clearAroundNumber(i, j) {
        let flags = 0;

        for (let a = i-1; a <= i+1; a++) {
            if (a < 0 || a >= this.props.row_number)
                continue;

            for (let b = j-1; b <= j+1; b++) {
                if (b < 0 || b >= this.props.column_number)
                    continue;

                if (this.state.state[a][b] === '!')
                    flags++;
            }
        }

        if (flags === this.state.state[i][j]) {
            for (let a = i-1; a <= i+1; a++) {
                if (a < 0 || a >= this.props.row_number)
                    continue;

                for (let b = j-1; b <= j+1; b++) {
                    if (b < 0 || b >= this.props.column_number)
                        continue;

                    if (this.state.state[a][b] == null)
                        this.handleClick(a, b)
                }
            }
        }
    }

    setFlag(i, j) {
        let state = this.state.state;
        if (state[i][j] === '!') {
            this.props.increaseFlags(-1);
            state[i][j] = null;
        } else {
            this.props.increaseFlags(1);
            state[i][j] = '!';
        }

        this.setState({state});
    }

    refreshTime = (start) => {
        if (!this.state.disabled) {
            const checkTime = i => i<10 ? '0'+i : i;
            let secs = (new Date() - start)/1000 | 0; // bitwise or with 0 truncates the decimal part

            let mins = checkTime(secs/60 | 0);
            secs = checkTime(secs - mins*60);

            document.getElementById("time").innerHTML = `${mins}:${secs}`;

            setTimeout(() => this.refreshTime(start), 500);
        }
    };

    handleClick = (i, j) => {
        const allNull = arr => arr.every(l => l.every(el => el == null));

        if (allNull(this.state.state)) {
            console.log("All null; spawning board");
            this.spawnMines(i, j);

            const time = new Date();
            this.setState({time});
            this.refreshTime(time);
        } else {
            if (this.state.state[i][j] !== '!')
                if (this.state.mines[i][j])
                    this.handleLoss(i, j);
                else
                    this.openSquare(i, j);
        }
    };

    renderSquare(i, j, size) {
        const state = this.state.state[i][j];

        return (
            <Square
                key={i + ': ' + j}
                state={state}
                onLeftClick={() => this.handleClick(i, j)}
                onRightClick={() => this.setFlag(i, j)}
                onNumberClick={() => this.clearAroundNumber(i, j)}
                size={size}
                gameOver={this.state.disabled}
            />
        )
    }

    render = () => {
        if (this.state.opened === this.props.row_number*this.props.column_number - this.props.mine_number
            && !this.state.disabled)
            this.handleWin();

        const grid = [];

        for (let i = 0; i < this.props.row_number; i++) {
            const grid_row = [];

            for (let j = 0; j < this.props.column_number; j++)
                grid_row.push(this.renderSquare(i, j, this.props.size));

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
    constructor(props) {
        super(props);

        this.state = {
            flags: 0,
        }
    }

    increaseFlags = i => {
        let flags = this.state.flags + i;

        this.setState({flags});
    };

    render() {
        const size = Math.min(
            0.96*this.props.height / this.props.row_number,
            0.9*this.props.width / this.props.column_number);
        const sidebarWidth = 0.08 * this.props.width;

        return (
            <div className="game">
                <div className="minefield">
                    <Minefield
                        row_number={this.props.row_number}
                        column_number={this.props.column_number}
                        mine_number={this.props.mine_number}
                        size={size}
                        increaseFlags={this.increaseFlags} />
                </div>
                <div className="sidebar" style={{width: sidebarWidth}}>
                    <div style={{color: '#ffffff', fontSize: 30}}>
                        {this.state.flags}/{this.props.mine_number}
                    </div>
                    <div id="time" style={{color: '#ffffff', fontSize: 30}}>
                        00:00
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;