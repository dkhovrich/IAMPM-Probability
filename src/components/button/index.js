import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const Button = ({ text, onClick }) => (
    <button
        type="button"
        className="action-button"
        onClick={onClick}
    >
        {text}
    </button>
);

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Button;
