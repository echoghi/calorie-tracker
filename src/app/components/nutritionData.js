import moment from 'moment';

export const userData = {
	user: {
		height : '5\'10"',
		weight : 180,
		bloodType : null
	},
	calendar: [
		{
			day: moment([2017, 10, 24]),
			nutrition: {
				calories: 250,
				fat: 15,
				carbs: 50,
				protein: 10,
				supplements: [
					{
						name: 'ephedrine sulfate',
						type: 'stimulant',
						dosage: 25,
						unit: 'miligrams',
						unitShort: 'mg'
					}
				]
			}
		}
	]
};