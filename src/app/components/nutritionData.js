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
			mood: 4,
			hasInfo: true,
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
				calories: 2215,
				exercise: 6,
				stand: 12
			}
		},
		{
			day: moment([2017, 10, 25]),
			mood: 4,
			hasInfo: true,
			nutrition: {
				calories: 2106,
				fat: 94,
				carbs: 220,
				protein: 104,
				supplements: [
				]
			},
			fitness: {
				calories: 2375,
				exercise: 21,
				stand: 14
			}
		},
		{
			day: moment([2017, 10, 26]),
			mood: 4,
			hasInfo: true,
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
				exercise: 0,
				stand: 0
			}
		}
	]
};