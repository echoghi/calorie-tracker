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
				],
				meals: [
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
				calories: 2577,
				fat: 111,
				carbs: 260,
				protein: 142,
				supplements: [
				],
				meals: [
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
				calories: 1170,
				fat: 102,
				carbs: 99,
				protein: 121,
				meals: [
					{
						name: 'In n\' Out 3x3',
						calories: 860,
						fat: 55,
						carbs: 39,
						protein: 52
					},
					{
						name: 'In n\' Out animal fries',
						calories: 750,
						fat: 42,
						carbs: 54,
						protein: 19
					}
				],
				supplements: [
					{
						name: 'ephedrine sulfate',
						type: 'stimulant',
						dosage: 50,
						unit: 'miligrams',
						unitShort: 'mg'
					},
					{
						name: 'Omega 3 (EPA/DHA)',
						type: 'fatty acid',
						dosage: 230,
						unit: 'miligrams',
						unitShort: 'mg'
					},
					{
						name: 'Vitamin D',
						type: 'vitamin',
						dosage: 1080,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Vitamin A',
						type: 'vitamin',
						dosage: 150,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Vitamin E',
						type: 'vitamin',
						dosage: 2,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Creatine Monohydrate',
						type: 'organic acid',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
					}
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