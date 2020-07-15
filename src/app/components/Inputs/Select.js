import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import { IconProps } from '@material-ui/core/Icon';
import { styles } from '../theme';

const handleIcon = (iconProps) => (
    <i
        {...iconProps}
        style={{
            pointerEvents: 'none',
            position: 'absolute',
            right: 10,
            top: 'calc(50% - 7px)',
        }}
        className="icon-chevron-down"
    />
);

function Select({ classes, label, name, id, options, error, fullWidth, ...props }) {
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
                    select: classes.select,
                }}
                inputProps={{
                    id,
                    label: name,
                    name,
                }}
                disableUnderline={true}
                IconComponent={handleIcon}
            >
                <option key="0" value="">
                    Select a Gender
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
}

export default withStyles(styles)(Select);
