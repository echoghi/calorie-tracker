import moment from 'moment';

export const userData = {
	user: {
		height : '5\'10"',
		weight : 180,
		bloodType : null,
		goals: {
			nutrition: {
				calories: 1925,
				protein: 180,
				carbs: 200,
				fat: 80
			}
		}
	},
	calendar: [
		{
			day: moment([2017, 10, 24]),
			nutrition: {
				calories: 1525,
				fat: 65,
				carbs: 172,
				protein: 90,
				supplements: [
					{
						name: 'ephedrine sulfate',
						type: 'stimulant',
						dosage: 25,
						unit: 'miligrams',
						unitShort: 'mg'
					}
				]
			},
			fitness: {
				calories: 0,
				exercise: 0
			}
		},
		{
			day: moment([2017, 10, 25]),
			nutrition: {
				calories: 0,
				fat: 0,
				carbs: 0,
				protein: 0,
				supplements: [
				]
			},
			fitness: {
				calories: 0,
				exercise: 0
			}
		}
	]
};