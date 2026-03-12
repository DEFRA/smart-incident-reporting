const expectedAnswerIdsSets = [
  {
    name: '(1st IT) A River, Less than 10m, Cloudy or grey water',
    values: [
      501, 701, 1002, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2901
    ]
  },
  {
    name: '(1st IT) A lake or reservoir, Less than 100 sqm, Rainbow',
    values: [
      502, 801, 1001, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2902
    ]
  },
  {
    name: '(1st IT) The Sea, less than 100sqm, A foam or scum on top',
    values: [
      503, 801, 1003, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2903
    ]
  },
  {
    name: '(1st IT) A canal, less than 10m, Can see Something else, dead fish',
    values: [
      504, 701, 1004, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2904
    ]
  },
  {
    name: 'A River, Stretches 10-500m, Cloudy or grey water',
    values: [
      501, 702, 401, 1002, 2802, 2601, 901, 202, 102, 2901
    ]
  },
  {
    name: '(1st IT) A River, less than 10m, can see something else',
    values: [
      501, 701, 1004, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2902
    ]
  },
  {
    name: 'A River, Stretches 500m or more, Foam or scum on top, Cant tell how far across watercourse',
    values: [
      501, 702, 403, 1003, 2802, 2601, 901, 202, 102, 2903
    ]
  },
  {
    name: 'A River, Stretches 1km or more, Looks like something else, cant tell how far pollution stretches',
    values: [
      501, 702, 404, 1004, 2802, 2601, 901, 202, 102, 2904
    ]
  },
  {
    name: '(1st IT) Something else watercourse, spread less than 10m, Rainbow',
    values: [
      506, 701, 1001, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2906
    ]
  },
  {
    name: '(1st IT) A smaller stream or watercourse, Less than 10m, Cloudy or grey',
    values: [
      505, 701, 1002, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2905
    ]
  },
  {
    name: 'A River, Not sure how far it stretches, Cloudy or grey',
    values: [
      501, 702, 405, 1002, 2802, 2601, 901, 202, 102, 2905
    ]
  },
  {
    name: 'A River, Rainbow, stretches 100-500m, Rainbow, does not touch both sides',
    values: [
      501, 702, 402, 1001, 2802, 2601, 901, 202, 102, 2902
    ]
  },
  {
    name: '(1st IT) Do not know what kind of watercourse, spread less than 10m, foam or scum',
    values: [
      507, 701, 1003, 2801, 2602, 2701, 2702, 2703, 2704, 2705, 201, 203, 102, 2901
    ]
  },
  {
    name: 'Lake or Reservoir, A foam or scum, you do not know hw large an area pollution covers, CANT FIND 303 IN ANSWER CHOICE TABLE? TBC',
    values: [
      502, 802, 303, 1003, 2802, 2601, 901, 202, 102, 2903
    ]
  },
  {
    name: 'Lake or Reservoir, cloudy, >=100 sqm',
    values: [
      502, 802, 301, 1002, 2802, 2601, 901, 202, 102, 2901
    ]
  },
  {
    name: 'Lake or Reservoir, Rainbow, >=500sqm',
    values: [
      502, 802, 302, 1001, 2802, 2601, 901, 202, 102, 2902
    ]
  }
]
export default expectedAnswerIdsSets
