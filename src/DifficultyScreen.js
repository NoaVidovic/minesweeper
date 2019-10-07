import React from 'react';

import './DifficultyScreen.css';


//TODO: prettify the screen using CSS
//TODO: center buttons on screen
const DifficultyScreen = props => (
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
        <button className="difficulty-button" onClick={() => props.onClick({ row_number: 80, column_number: 100, mine_number: 800 })}>
            Hardcore!
        </button>
    </div>
);

export default DifficultyScreen;