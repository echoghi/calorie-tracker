import React from 'react';
import runnerIcon from '../../assets/images/apple-runner.png';
import { Icon } from './styles';

const Legend = () => (
    <div className="legend">
        <div className="legend__header">Legend</div>
        <div className="legend__body">
            <div className="legend__body--item">
                <div className="legend__body--calories" />
                <div className="legend__body--name">Calories</div>
            </div>
            <div className="legend__body--item">
                <div className="legend__body--protein" />
                <div className="legend__body--name">Protein</div>
            </div>
            <div className="legend__body--item">
                <div className="legend__body--carbs" />
                <div className="legend__body--name">Carbs</div>
            </div>
            <div className="legend__body--item">
                <div className="legend__body--fat" />
                <div className="legend__body--name">Fat</div>
            </div>
            <div className="legend__body--item">
                <div className="legend__body--subhead">Icons</div>
            </div>
            <div className="legend__body--item">
                <img src={runnerIcon} />
                <div className="legend__body--name">Exercise Recorded</div>
            </div>
            <div className="legend__body--item">
                <Icon className="icon-feather legend" />
                <div className="legend__body--name">Notes Recorded</div>
            </div>
            <div className="legend__body--item">
                <Icon className="icon-star-full legend" />
                <div className="legend__body--name">Notes & Exercise</div>
            </div>
            <div className="legend__body--item">
                <i className="icon-info" />
                <div className="legend__body--name">Day Breakdown</div>
            </div>
        </div>
    </div>
);

export default Legend;
