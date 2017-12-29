//import firebase from './firebase.js';

const userData = {
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
					},
					{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
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
                calories: 2253,
                exercise: 2,
                stand: 11
            }
        },
        {
            day: {
            	month: 10,
            	date: 30,
            	year: 2017
            },
            mood: 4,
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
                ]
            },
            fitness: {
                calories: 2441,
                exercise: 11,
                stand: 13
            }
        },
        {
            day: {
            	month: 11,
            	date: 1,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 1480,
                fat: 49,
                carbs: 99,
                protein: 170,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
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
                calories: 2743,
                exercise: 66,
                stand: 12
            }
        },
        {
            day: {
            	month: 11,
            	date: 2,
            	year: 2017
            },
            mood: 3,
            nutrition: {
                calories: 1705,
                fat: 62,
                carbs: 150,
                protein: 112,
                meals: [
                	{
						name: 'Chipotle double chicken bowl w/queso',
						type: 'Mexican/Fast Food',
						calories: 1015,
						fat: 40,
						carbs: 81,
						protein: 55
					},
					{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
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
                calories: 2622,
                exercise: 58,
                stand: 11
            }
        },
        {
            day: {
            	month: 11,
            	date: 3,
            	year: 2017
            },
            mood: 3,
            nutrition: {
                calories: 3110,
                fat: 166,
                carbs: 222,
                protein: 161,
                meals: [
                	{
						name: 'Five Guys fries',
						type: 'Fast Food',
						calories: 500,
						fat: 20,
						carbs: 72,
						protein: 4
					},
					{
						name: 'Five Guys cheeseburger',
						type: 'Fast Food',
						calories: 720,
						fat: 43,
						carbs: 45,
						protein: 36
					},
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
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
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
                calories: 2482,
                exercise: 44,
                stand: 13 
            }
        },
        {
            day: {
            	month: 11,
            	date: 4,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2285,
                fat: 80,
                carbs: 170,
                protein: 165,
                meals: [
					{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					},
					{
						name: 'Creatine Monohydrate',
						type: 'Supplement',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
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
                calories: 2387,
                exercise: 10,
                stand: 14
            }
        },
        {
            day: {
            	month: 11,
            	date: 5,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2160,
                fat: 70,
                carbs: 230,
                protein: 75,
                meals: [
                ]
            },
            fitness: {
                calories: 2392,
                exercise: 12,
                stand: 14
            }
        },
        {
            day: {
            	month: 11,
            	date: 6,
            	year: 2017
            },
            mood: 2,
            nutrition: {
                calories: 1450,
                fat: 90,
                carbs: 60,
                protein: 85,
                meals: [
                ]
            },
            fitness: {
                calories: 2310,
                exercise: 3,
                stand: 16
            }
        },
        {
            day: {
            	month: 11,
            	date: 7,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2205,
                fat: 80,
                carbs: 208,
                protein: 138,
                meals: [
                	{
						name: 'Whole Foods Breakfast Sandwhich',
						type: 'Frozen Food',
						calories: 360,
						fat: 18,
						carbs: 31,
						protein: 19
					},
                	{
						name: 'Chipotle double chicken bowl w/queso',
						type: 'Mexican/Fast Food',
						calories: 1015,
						fat: 40,
						carbs: 81,
						protein: 55
					},
					{
						name: 'Starbucks Venti Peppermint Mocha w/no whip',
						type: 'Starbucks',
						calories: 540,
						fat: 16,
						carbs: 83,
						protein: 14
					},
					{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					}
                ]
            },
            fitness: {
            	calories: 2335,
                exercise: 8,
                stand: 14
            }
        },
        {
            day: {
            	month: 11,
            	date: 8,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 1000,
                fat: 35,
                carbs: 50,
                protein: 40,
                meals: [
                ]
            },
            fitness: {
            	calories: 2638,
                exercise: 52,
                stand: 12
            }
        },
        {
            day: {
            	month: 11,
            	date: 9,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2120,
                fat: 60,
                carbs: 164,
                protein: 150,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					}
                ]
            },
            fitness: {
            	calories: 2688,
                exercise: 68,
                stand: 15
            }
        },
        {
            day: {
            	month: 11,
            	date: 10,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2433,
                fat: 120,
                carbs: 140,
                protein: 190,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					}
                ]
            },
            fitness: {
            	calories: 2685,
                exercise: 68,
                stand: 14
            }
        },
        {
            day: {
            	month: 11,
            	date: 11,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2282,
                fat: 89,
                carbs: 181,
                protein: 155,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					},
					{
						name: 'Creatine Monohydrate',
						type: 'Supplement',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
					},
					{
						name: 'Chipotle double chicken bowl w/queso',
						type: 'Mexican/Fast Food',
						calories: 1015,
						fat: 40,
						carbs: 81,
						protein: 55
					},
					{
						name: 'Whole Foods Breakfast Sandwhich',
						type: 'Frozen Food',
						calories: 360,
						fat: 18,
						carbs: 31,
						protein: 19
					}
                ]
            },
            fitness: {
            	calories: 2071,
                exercise: 1,
                stand: 12
            }
        },
        {
            day: {
            	month: 11,
            	date: 12,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2000,
                fat: 60,
                carbs: 150,
                protein: 150,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					},
					{
						name: 'Creatine Monohydrate',
						type: 'Supplement',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
					},
					{
						name: 'Whole Foods Breakfast Sandwhich',
						type: 'Frozen Food',
						calories: 360,
						fat: 18,
						carbs: 31,
						protein: 19
					}
                ]
            },
            fitness: {
            	calories: 2225,
                exercise: 1,
                stand: 12
            }
        },
        {
            day: {
            	month: 11,
            	date: 13,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 1467,
                fat: 58,
                carbs: 124,
                protein: 82,
                meals: [
           	 		{
						name: 'Whole Foods Breakfast Sandwhich',
						type: 'Frozen Food',
						calories: 360,
						fat: 18,
						carbs: 31,
						protein: 19
					}
                ]
            },
            fitness: {
            	calories: 2226,
                exercise: 1,
                stand: 11
            }
        },
        {
            day: {
            	month: 11,
            	date: 14,
            	year: 2017
            },
            mood: 3,
            nutrition: {
                calories: 2500,
                fat: 100,
                carbs: 200,
                protein: 160,
                meals: [
                	{
						name: 'Whole Foods Breakfast Sandwhich',
						type: 'Frozen Food',
						calories: 360,
						fat: 18,
						carbs: 31,
						protein: 19
					}
                ]
            },
            fitness: {
            	calories: 2327,
                exercise: 1,
                stand: 15
            }
        },
        {
            day: {
            	month: 11,
            	date: 15,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2300,
                fat: 109,
                carbs: 130,
                protein: 170,
                meals: [
                ]
            },
            fitness: {
            	calories: 2715,
                exercise: 48,
                stand: 13
            }
        },
     	{
            day: {
            	month: 11,
            	date: 16,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2500,
                fat: 74,
                carbs: 210,
                protein: 160,
                meals: [
					{
						name: 'Starbucks Sausage, Cheddar & Egg Breakfast Sandwich',
						type: 'Breakfast/Starbucks',
						calories: 500,
						fat: 28,
						carbs: 41,
						protein: 15
					},
					{
						name: 'Starbucks Grande Peppermint Mocha',
						type: 'Breakfast/Starbucks',
						calories: 360,
						fat: 8,
						carbs: 60,
						protein: 12
					}
                ]
            },
            fitness: {
            	calories: 2631,
                exercise: 23,
                stand: 16
            }
        },
        {
            day: {
            	month: 11,
            	date: 17,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2275,
                fat: 90,
                carbs: 213,
                protein: 116,
                meals: [
                	{
						name: 'Starbucks Sausage, Cheddar & Egg Breakfast Sandwich',
						type: 'Breakfast',
						calories: 500,
						fat: 28,
						carbs: 41,
						protein: 15
					},
					{
						name: 'Starbucks Grande Peppermint Mocha',
						type: 'Breakfast/Starbucks',
						calories: 360,
						fat: 8,
						carbs: 60,
						protein: 12
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
            	calories: 2301,
                exercise: 3,
                stand: 12
            }
        },
        {
            day: {
            	month: 11,
            	date: 18,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2015,
                fat: 75,
                carbs: 150,
                protein: 140,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
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
            	calories: 2311,
                exercise: 5,
                stand: 14
            }
        },
        {
            day: {
            	month: 11,
            	date: 19,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 1600,
                fat: 75,
                carbs: 135,
                protein: 120,
                meals: [
                	{
						name: 'Guru Lite',
						type: 'Energy Drink',
						calories: 10,
						fat: 0,
						carbs: 2,
						protein: 0
					}
                ]
            },
            fitness: {
            	calories: 2321,
                exercise: 7,
                stand: 13
            }
        },
        {
            day: {
            	month: 11,
            	date: 20,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 3240,
                fat: 130,
                carbs: 250,
                protein: 190,
                meals: [
                	{
						name: 'Starbucks Venti Peppermint Mocha w/no whip',
						type: 'Starbucks',
						calories: 540,
						fat: 16,
						carbs: 83,
						protein: 14
					},
					{
						name: 'Starbucks Sausage, Cheddar & Egg Breakfast Sandwich',
						type: 'Breakfast/Starbucks',
						calories: 500,
						fat: 28,
						carbs: 41,
						protein: 15
					},
					{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					},
					{
						name: '4 Chick-Fil-A Chicken Strips',
						type: 'Fast Food',
						calories: 470,
						fat: 23,
						carbs: 29,
						protein: 37
					},
					{
						name: '8 Chick-Fil-A Fried Chicken Nuggets',
						type: 'Fast Food',
						calories: 260,
						fat: 12,
						carbs: 9,
						protein: 28
					},
					{
						name: 'Chick-Fil-A Sauce',
						type: 'Fast Food',
						calories: 140,
						fat: 13,
						carbs: 6,
						protein: 0
					},
					{
						name: 'Chick-Fil-A Waffle Fries',
						type: 'Fast Food',
						calories: 360,
						fat: 18,
						carbs: 43,
						protein: 5
					}
                ]
            },
            fitness: {
            	calories: 2424,
                exercise: 9,
                stand: 16
            }
        },
        {
            day: {
            	month: 11,
            	date: 21,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2000,
                fat: 90,
                carbs: 160,
                protein: 110,
                meals: [
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
            	calories: 2380,
                exercise: 7,
                stand: 15
            }
        },
         {
            day: {
            	month: 11,
            	date: 22,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2250,
                fat: 85,
                carbs: 160,
                protein: 190,
                meals: [
                	{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					}
                ]
            },
            fitness: {
            	calories: 2604,
                exercise: 42,
                stand: 15
            }
        },
        {
            day: {
            	month: 11,
            	date: 23,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2700,
                fat: 90,
                carbs: 238,
                protein: 78,
                meals: [
                	{
						name: 'Starbucks Grande Peppermint Mocha w/whip',
						type: 'Starbucks',
						calories: 440,
						fat: 15,
						carbs: 63,
						protein: 13
					}
                ]
            },
            fitness: {
            	calories: 2625,
                exercise: 31,
                stand: 19
            }
        },
        {
            day: {
            	month: 11,
            	date: 24,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 1800,
                fat: 70,
                carbs: 190,
                protein: 70,
                meals: [
                ]
            },
            fitness: {
            	calories: 2426,
                exercise: 10,
                stand: 17
            }
        },
        {
            day: {
            	month: 11,
            	date: 25,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2200,
                fat: 90,
                carbs: 170,
                protein: 115,
                meals: [
                	{
						name: 'Bai Bolivia Black Cherry',
						type: 'Energy Drink',
						calories: 5,
						fat: 0,
						carbs: 9,
						protein: 0
					},
					{
						name: 'Bai Bogota Blackberry Lime',
						type: 'Energy Drink',
						calories: 5,
						fat: 0,
						carbs: 9,
						protein: 0
					}
                ]
            },
            fitness: {
            	calories: 2336,
                exercise: 15,
                stand: 15
            }
        },
        {
            day: {
            	month: 11,
            	date: 26,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2200,
                fat: 95,
                carbs: 175,
                protein: 120,
                meals: [
                	{
						name: 'Bai Bolivia Black Cherry',
						type: 'Energy Drink',
						calories: 5,
						fat: 0,
						carbs: 9,
						protein: 0
					}
                ]
            },
            fitness: {
            	calories: 2360,
                exercise: 19,
                stand: 13
            }
        },
        {
            day: {
            	month: 11,
            	date: 27,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 2100,
                fat: 85,
                carbs: 110,
                protein: 150,
                meals: [
                	{
						name: 'Creatine Monohydrate',
						type: 'Supplement',
						dosage: 5,
						unit: 'grams',
						unitShort: 'g'
					},
					{
						name: '2 scoops of Syntha 6 protein powder',
						type: 'Supplement',
						calories: 280,
						fat: 6,
						carbs: 12,
						protein: 50
					}
                ]
            },
            fitness: {
            	calories: 2941,
                exercise: 93,
                stand: 14
            }
        },
        {
            day: {
            	month: 11,
            	date: 28,
            	year: 2017
            },
            mood: 4,
            nutrition: {
                calories: 0,
                fat: 0,
                carbs: 0,
                protein: 0,
                meals: [
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

//const usersRef = firebase.database().ref('users');

//usersRef.push(userData);