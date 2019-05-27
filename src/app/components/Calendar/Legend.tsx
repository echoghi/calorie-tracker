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
import OptionsIcon from '../Icons/OptionsIcons';

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
                <OptionsIcon height={16} width={16} />
                <LegendName>Day Options</LegendName>
            </LegendItem>
        </LegendBody>
    </LegendWrapper>
);

export default Legend;
