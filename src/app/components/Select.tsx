import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './theme';
import { IconProps } from '@material-ui/core/Icon';

interface Select {
    classes: any;
    label: string;
    name: string;
    id?: string;
    options: string[];
    error: boolean;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;
    type?: string;
    fullWidth?: boolean;
    style?: React.CSSProperties;
}

const handleIcon = (iconProps: IconProps) => (
    <i
        {...iconProps}
        style={{
            pointerEvents: 'none',
            position: 'absolute',
            right: 10,
            top: 'calc(50% - 7px)'
        }}
        className="icon-chevron-down"
    />
);

function Select({ classes, label, name, id, options, error, fullWidth, ...props }: Select) {
    return (
        <FormControl error={error} fullWidth={fullWidth} style={{ marginTop: 8 }}>
            <InputLabel
                disableAnimation={true}
                shrink={true}
                classes={{ formControl: classes.selectLabel }}
                htmlFor={id}
            >
                {label}
            </InputLabel>
            <NativeSelect
                {...props}
                classes={{
                    root: classes.bootstrapRoot,
                    select: classes.select
                }}
                inputProps={{
                    id,
                    name
                }}
                disableUnderline={true}
                IconComponent={handleIcon}
            >
                <option key="0" value="">
                    Select a Gender
                </option>
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
}

export default withStyles(styles)(Select);
