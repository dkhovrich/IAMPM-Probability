import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import RadioButton from '../radioButton';
import Mode from '../../mode';

const radioGroupName = 'controlls';

const ModeControlls = ({ mode, onChange }) => (
    <div className="controll-buttons">
        {Object.values(Mode).map(item => (
            <RadioButton
                key={item.value}
                name={radioGroupName}
                text={item.text}
                value={item.value}
                checked={mode === item.value}
                onChange={onChange}
            />
        ))}
    </div>
);

ModeControlls.propTypes = {
    mode: PropTypes.oneOf(Object.values(Mode).map(mode => mode.value)).isRequired,
    onChange: PropTypes.func.isRequired
};

export default ModeControlls;
