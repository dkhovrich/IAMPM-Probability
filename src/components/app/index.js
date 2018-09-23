import React, { Component } from 'react';
import './styles.css';

import ModeControlls from '../modeControlls';
import Button from '../button';

import Mode from '../../mode';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: Mode.cubes.value
        };

        this.onModeChange = this.onModeChange.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onModeChange(event) {
        const mode = event.target.value;
        this.setState({ mode });
    }

    onButtonClick() {
        console.log('click');
    }

    render() {
        const { mode } = this.state;

        return (
            <div className="container">
                <i className="logo" />
                <ModeControlls mode={mode} onChange={this.onModeChange} />
                <Button text={Mode[mode].text} onClick={this.onButtonClick} />
                <a className="game-link" href="http://iampm.club/igra/" rel="noopener noreferrer" target="_blank">Подробнее об игре</a>
            </div>
        );
    }
}

export default App;
