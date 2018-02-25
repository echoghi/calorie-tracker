import React from 'react';
import { Route } from 'react-router-dom';

// Components
import NavBar from './NavBar';
import Home from './Home';
import Calendar from './Calendar';
import Nutrition from './Nutrition';
import Activity from './Activity';
import Settings from './Settings';

class AppIndex extends React.PureComponent {
    render() {
        return (
            <div>
                <NavBar />
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/settings" component={Settings} name="Settings" />
                    <Route path="/calendar" component={Calendar} name="Calendar" />
                    <Route path="/nutrition" component={Nutrition} name="Nutrition" />
                    <Route path="/activity" component={Activity} name="Activity" />
                </div>
            </div>
        );
    }
}

export default AppIndex;
