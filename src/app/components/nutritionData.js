//import firebase from './firebase.js';

export const userData = {
	user: {
		height : '5\'10"',
		weight : 180,
		bloodType : null,
		goals: {
			nutrition: {
				calories: 2000,
				protein: 180,
				carbs: 200,
				fat: 70
			}
		}
	},
	calendar: [
		{
			day: {
            	month: 10,
            	date: 24,
            	year: 2017
            },
			mood: 4,
			hasInfo: true,
			nutrition: {
				calories: 1525,
				fat: 65,
				carbs: 172,
				protein: 90,
				meals: [
					{
						name: 'ephedrine sulfate',
						type: 'Supplement',
						classification: 'stimulant',
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
			day: {
            	month: 10,
            	date: 25,
            	year: 2017
            },
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
			day: {
            	month: 10,
            	date: 26,
            	year: 2017
            },
			mood: 4,
			hasInfo: true,
			nutrition: {
				calories: 2010,
				fat: 131,
				carbs: 166,
				protein: 194,
				meals: [
					{
						name: 'In n\' Out 3x3',
						type: 'Fast Food',
						calories: 860,
						fat: 55,
						carbs: 39,
						protein: 52
					},
					{
						name: 'In n\' Out animal fries',
						type: 'Fast Food',
						calories: 750,
						fat: 42,
						carbs: 54,
						protein: 19
					},
					{
						name: 'ephedrine sulfate',
						type: 'Supplement',
						classification: 'stimulant',
						dosage: 50,
						unit: 'miligrams',
						unitShort: 'mg'
					},
					{
						name: 'Omega 3 (EPA/DHA)',
						type: 'Supplement',
						dosage: 230,
						unit: 'miligrams',
						unitShort: 'mg'
					},
					{
						name: 'Vitamin D',
						type: 'Supplement',
						dosage: 1080,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Vitamin A',
						type: 'Supplement',
						dosage: 150,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Vitamin E',
						type: 'Supplement',
						dosage: 2,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Creatine Monohydrate',
						type: 'Supplement',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
					}
				]
			},
			fitness: {
				calories: 2457,
				exercise: 76,
				stand: 15
			}
		},
		{
			day: {
            	month: 10,
            	date: 27,
            	year: 2017
            },
			mood: 4,
			hasInfo: true,
			nutrition: {
				calories: 1500,
				fat: 50,
				carbs: 121,
				protein: 138,
				meals: [
					{
						name: 'ephedrine sulfate',
						type: 'Supplement',
						classification: 'stimulant',
						dosage: 50,
						unit: 'miligrams',
						unitShort: 'mg'
					},
					{
						name: 'Omega 3 (EPA/DHA)',
						type: 'Supplement',
						dosage: 230,
						unit: 'miligrams',
						unitShort: 'mg'
					},
					{
						name: 'Vitamin D',
						type: 'Supplement',
						dosage: 1080,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Vitamin A',
						type: 'Supplement',
						dosage: 150,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Vitamin E',
						type: 'Supplement',
						dosage: 2,
						unit: 'IU',
						unitShort: 'iu'
					},
					{
						name: 'Creatine Monohydrate',
						type: 'Supplement',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
					}
				]
			},
			fitness: {
				calories: 2241,
				exercise: 1,
				stand: 13
			}
		},
        {
            day: {
            	month: 10,
            	date: 28,
            	year: 2017
            },
            mood: 3,
            hasInfo: true,
            nutrition: {
                calories: 1800,
                fat: 60,
                carbs: 151,
                protein: 165,
                meals: [
                ]
            },
            fitness: {
                calories: 2308,
                exercise: 0,
                stand: 14
            }
        },
        {
            day: {
            	month: 10,
            	date: 29,
            	year: 2017
            },
            mood: 4,
            hasInfo: true,
            nutrition: {
                calories: 2245,
                fat: 88,
                carbs: 115,
                protein: 156,
                meals: [
                	{
						name: 'Spaghetti w/ Meatballs',
						type: 'Home Cooked',
						calories: 780,
						fat: 27,
						carbs: 72,
						protein: 60
					},
					{
						name: 'Chipotle double chicken bowl w/queso',
						type: 'Mexican/Fast Food',
						calories: 1015,
						fat: 40,
						carbs: 81,
						protein: 55
					}
                ]
            },
            fitness: {
                calories: 0,
                exercise: 0,
                stand: 0
            }
        },
        {
            day: {
            	month: 10,
            	date: 30,
            	year: 2017
            },
            mood: 4,
            hasInfo: true,
            nutrition: {
                calories: 1530,
                fat: 70,
                carbs: 132,
                protein: 72,
                meals: [
                	{
						name: 'Whole Foods Golden Gate Sandwhich',
						type: 'Deli',
						calories: 1040,
						fat: 52,
						carbs: 75,
						protein: 53
					},
					{
						name: 'Whole Foods Breakfast Sandwhich',
						type: 'Frozen Food',
						calories: 360,
						fat: 18,
						carbs: 31,
						protein: 19
					}
                ],
                supplements: [
                ]
            },
            fitness: {
                calories: 0,
                exercise: 0,
                stand: 0
            }
        },
        {
            day: {
            	month: 11,
            	date: 1,
            	year: 2017
            },
            mood: 4,
            hasInfo: true,
            nutrition: {
                calories: 1200,
                fat: 45,
                carbs: 87,
                protein: 120,
                meals: [
                ],
                supplements: [
                ]
            },
            fitness: {
                calories: 0,
                exercise: 0,
                stand: 0
            }
        },
        {
            day: {
            	month: 11,
            	date: 2,
            	year: 2017
            },
            mood: 4,
            hasInfo: true,
            nutrition: {
                calories: 1015,
                fat: 40,
                carbs: 81,
                protein: 55,
                meals: [
                	{
						name: 'Chipotle double chicken bowl w/queso',
						type: 'Mexican/Fast Food',
						calories: 1015,
						fat: 40,
						carbs: 81,
						protein: 55
					}
                ],
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

//let usersRef = firebase.database().ref('users');

//usersRef.push(userData);