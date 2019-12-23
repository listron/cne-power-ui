const showNoData = {
  type: 'image',
  left: 'center',
  top: 'center',
  style: {
    fill: '#353535',
    text: [
      '暂无数据',
    ],
    font: '12px Microsoft YaHei',
  },
};

// const showNoData = {
//   type: 'image',
//   right: 'center',
//   top: 'center',
//   z: -10,
//   style: {
//     image: '/img/noChartdata.png',
//     width: 100,
//     height: 78,
//   },
// };


const hiddenNoData = {
  type: 'text',
  left: 'center',
  top: 'center',
  style: {
    fill: '#353535',
    text: [
      '',
    ],
    font: '12px Microsoft YaHei',
  },
};

const darkShowNoData = {
  type: 'text',
  left: 'center',
  top: 'center',
  style: {
    fill: '#bbcef7',
    text: [
      '暂无数据',
    ],
    font: '12px Microsoft YaHei',
  },
};

export { showNoData, hiddenNoData, darkShowNoData };
