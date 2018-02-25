import React from 'react';

const ProgressBar = props => (
    <div className="progressbar__container">
        <div
            className="progressbar"
            style={{ height: `${props.options.height}px`, maxHeight: `${props.options.height}px`, width: '100%' }}
        >
            <div
                style={{
                    height: '100%',
                    width: props.progress > 1 ? '100%' : `${props.progress * 100}%`,
                    background: props.options.color,
                    marginBottom: `-${props.options.height}px`,
                    zIndex: '2'
                }}
            />
            <div
                style={{
                    width: '100%',
                    height: `${props.options.height}px`,
                    background: props.options.trailColor
                }}
            />
        </div>
        <span className="progressbar__text" style={props.options.text.style}>
            {props.options.text.value}
        </span>
    </div>
);

export default ProgressBar;
