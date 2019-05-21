import React from 'react';
import {
    Icon,
    LegendWrapper,
    LegendBody,
    LegendHeader,
    LegendSubhead,
    LegendItem,
    LegendCalories,
    LegendCarbs,
    LegendProtein,
    LegendFat,
    LegendName
} from './styles';

const Legend = () => (
    <LegendWrapper>
        <LegendHeader>Legend</LegendHeader>
        <LegendBody>
            <LegendItem>
                <LegendCalories />
                <LegendName>Calories</LegendName>
            </LegendItem>
            <LegendItem>
                <LegendProtein />
                <LegendName>Protein</LegendName>
            </LegendItem>
            <LegendItem>
                <LegendCarbs />
                <LegendName>Carbs</LegendName>
            </LegendItem>
            <LegendItem>
                <LegendFat />
                <LegendName>Fat</LegendName>
            </LegendItem>
            <LegendItem>
                <LegendSubhead>Icons</LegendSubhead>
            </LegendItem>
            <LegendItem>
                <Icon className="notes legend" />
                <LegendName>Notes Recorded</LegendName>
            </LegendItem>
            <LegendItem>
                <i className="icon-info" />
                <LegendName>Day Breakdown</LegendName>
            </LegendItem>
        </LegendBody>
    </LegendWrapper>
);

export default Legend;
