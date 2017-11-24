import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    tracker: state.navigationState.tracker
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Nutrition extends React.Component {
	state = {
		calories: 0,
		fats: 0,
		carbs: 0
	};

	componentWillMount() {
		let { tracker, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!tracker) {
			activatePage('nutrition');
		}
	}

	render() {
		return (
			<div>
				<NavBar />
				<div className="nutrition">
					<h1>Nutrition</h1>
					<div className="nutrition__overview">
						<div className="nutrition__overview--box">
							<div className="nutrition__overview--head">
								<h1>227</h1>
								<span>g</span>
								<h3>Protein</h3>
							</div>
						</div>
						<div className="nutrition__overview--box">
							<div className="nutrition__overview--head">
								<h1>150</h1>
								<span>g</span>
								<h3>Carbohydrates</h3>
							</div>
						</div>
						<div className="nutrition__overview--box">
							<div className="nutrition__overview--head">
								<h1>40</h1>
								<span>g</span>
								<h3>Fat</h3>
							</div>
						</div>
					</div>
					<div className="nutrition__add">
					</div>
				</div>
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Nutrition);