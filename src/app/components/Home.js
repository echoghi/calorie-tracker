import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
// Components
import NavBar from './NavBar';
import moment from 'moment';

const mapStateToProps = state => ({
    home: state.navigationState.home
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Home extends React.Component {
    state = {
        loading: true,
        error: null
    };

    componentWillMount() {
        let { home, activatePage } = this.props;
        window.scrollTo(0, 0);

        if (!home) {
            activatePage('home');
        }
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="overview__container">
                    <h1>Overview</h1>
                    <h3>{moment().format('MMMM YYYY')}</h3>
                    <div className="overview">
                        <div className="overview--box">
                            <div className="overview--head">
                                <h1>0</h1>
                                <h3>Days Exercised</h3>
                            </div>
                        </div>
                        <div className="overview--box">
                            <div className="overview--head">
                                <h1>0</h1>
                                <h3>Consecutive Exercise Days</h3>
                            </div>
                        </div>
                        <div className="overview--box">
                            <div className="overview--head">
                                <h1>1500</h1>
                                <span>cal</span>
                                <h3>Caloric Defecit</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
