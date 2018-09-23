import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import Mode from '../../mode';

const RadioButton = ({
    name, text, value, checked, onChange
}) => (
    <div className="controll-button">
        <input
            id={value}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
        />
        <label htmlFor={value}>{text}</label>
    </div>
);

RadioButton.propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOf(Object.values(Mode).map(mode => mode.value)).isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default RadioButton;
