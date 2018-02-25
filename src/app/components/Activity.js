import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';

const mapStateToProps = state => ({
    activity: state.navigationState.activity
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Activity extends React.Component {
    state = {
        width: 0
    };

    componentWillMount() {
        const { reports, activatePage } = this.props;
        window.scrollTo(0, 0);

        if (!reports) {
            activatePage('activity');
        }
    }

    render() {
        return (
            <div>
                <div className="activity" />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
