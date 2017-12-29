import React from 'react';
import Dialog from 'material-ui/Dialog';

class Loading extends React.Component {
    render() {
        return (
            <Dialog open={true} title="Loading...">
                <div className="loading__spinner" />
            </Dialog>
        );
    }
}

export default Loading;