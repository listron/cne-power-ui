
const initColors = [ // 每一个元素为 一个色调从浅到深的渐变.可以错开列进行颜色选取。
  ['#ffb1bc', '#ff7a87', '#ff92a5', '#ff596c', '#ff6d88', '#ff3b50', '#fd435f', '#fb2031', '#fa0333', '#f30117', '#e51c48', '#c60c23', '#c50538', '#93021a',
  ], ['#ffafad', '#ff7775', '#ff8587', '#ff4d4f', '#fb4759', '#f5222d', '#e92945', '#cf1221', '#d31338', '#a8081a', '#b8002d', '#820014', '#950027', '#5c0011',
  ], ['#ffcba7', '#ff9c6e', '#ffb27a', '#ff7b44', '#fd8c3c', '#fa541c', '#ec6b1c', '#d4390c', '#d64703', '#ad2201', '#bc2d00', '#871400', '#9a1a03', '#610b01',
  ], ['#e9c986', '#cf994e', '#dcb559', '#b67e2d', '#d1a52b', '#a46c13', '#c29205', '#8f5902', '#ae7e08', '#764803', '#9f6705', '#663602', '#834e00', '#4c2600',
  ], ['#ffe1a2', '#ffc069', '#ffd474', '#ffa940', '#fdc02f', '#fa8c15', '#eca315', '#d46a09', '#d68603', '#ad4e01', '#bc6900', '#873800', '#9b4c00', '#622500',
  ], ['#fffb9f', '#fff566', '#fff770', '#ffeb3d', '#fdef2d', '#fadb14', '#ecd911', '#d4b107', '#d6bf03', '#ad8b01', '#bca103', '#876801', '#9a7d00', '#614700',
  ], ['#ebfa9a', '#d3f261', '#def467', '#bae636', '#ceee27', '#a0d911', '#b3da05', '#7cb302', '#95c005', '#5c8c02', '#729f00', '#3e6600', '#4c7400', '#254000',
  ], ['#c6f19d', '#95de64', '#abea6f', '#73d13c', '#89e438', '#51c41a', '#6bcd23', '#399e0f', '#4ab00c', '#247805', '#298a00', '#125200', '#135600', '#082b00',
  ], ['#95efeb', '#5cdbd3', '#67e9e6', '#36cfc9', '#2de3e3', '#14c2c3', '#0fc8cb', '#06979c', '#00a7ae', '#006e76', '#007d87', '#00474f', '#034753', '#012229',
  ], ['#a1e1ff', '#68c0ff', '#76d4ff', '#41a9ff', '#31c3ff', '#1690ff', '#17a6ee', '#0a6dd9', '#0088da', '#0050b3', '#036cc0', '#013a8c', '#004f9f', '#002766',
  ], ['#92c3e2', '#5990c1', '#5cb1de', '#2f7aba', '#03a2da', '#0169b3', '#0092d5', '#0059aa', '#0078cd', '#00439f', '#0074b6', '#00407f', '#006497', '#00345e',
  ], ['#dab6f6', '#b37fea', '#c48cf1', '#9254de', '#ab5aea', '#722ed1', '#8b3ed5', '#531dab', '#6b27bb', '#391185', '#471397', '#22085e', '#2d0085', '#19005a',
  ], ['#d8c7df', '#af96bb', '#c7b4d9', '#967db1', '#b5a0d2', '#7e67a6', '#a38ccb', '#6a549c', '#9986c7', '#604e96', '#8669be', '#4e388a', '#735daf', '#3f3077',
  ], ['#e3a5d6', '#c36cad', '#da8cd1', '#b354a4', '#d376cb', '#a7419b', '#c651c1', '#94288e', '#b41cb3', '#7d0c7c', '#a808ab', '#6f0372', '#8c0392', '#540159',
  ], ['#ffbbe1', '#ff85c0', '#fc92d5', '#f759ab', '#f75dc8', '#eb3097', '#e43eb6', '#c41d7f', '#cd27a1', '#9e1168', '#b01188', '#780750', '#8a086b', '#520339',
  ], ['#df8ea7', '#bb556e', '#d57897', '#aa435e', '#cd6b8c', '#9f3954', '#be5877', '#892c42', '#ab4a5f', '#732431', '#a42f4e', '#6b1526', '#8c0a3a', '#54041b',
  ],
];

const outputColors = [ // 按一定顺序将颜色矩阵错位取色的输出结果。数量较多的颜色列表。
  '#ffb1bc', '#ffe1a2', '#95efeb', '#d8c7df', '#fb2031', '#d46a09', '#06979c', '#6a549c', '#ff7a87', '#ffc069', '#5cdbd3', '#af96bb', '#fa0333', '#d68603', '#00a7ae', '#9986c7', '#ff92a5', '#ffd474', '#67e9e6', '#c7b4d9', '#f30117', '#ad4e01', '#006e76', '#604e96', '#ff596c', '#ffa940', '#36cfc9', '#967db1', '#e51c48', '#bc6900', '#007d87', '#8669be', '#ff6d88', '#fdc02f', '#2de3e3', '#b5a0d2', '#c60c23', '#873800', '#00474f', '#4e388a', '#ff3b50', '#fa8c15', '#14c2c3', '#7e67a6', '#c50538', '#9b4c00', '#034753', '#735daf', '#fd435f', '#eca315', '#0fc8cb', '#a38ccb', '#93021a', '#622500', '#012229', '#3f3077', '#ffafad', '#fffb9f', '#a1e1ff', '#e3a5d6', '#cf1221', '#d4b107', '#0a6dd9', '#94288e', '#ff7775', '#fff566', '#68c0ff', '#c36cad', '#d31338', '#d6bf03', '#0088da', '#b41cb3', '#ff8587', '#fff770', '#76d4ff', '#da8cd1', '#a8081a', '#ad8b01', '#0050b3', '#7d0c7c', '#ff4d4f', '#ffeb3d', '#41a9ff', '#b354a4', '#b8002d', '#bca103', '#036cc0', '#a808ab', '#fb4759', '#fdef2d', '#31c3ff', '#d376cb', '#820014', '#876801', '#013a8c', '#6f0372', '#f5222d', '#fadb14', '#1690ff', '#a7419b', '#950027', '#9a7d00', '#004f9f', '#8c0392', '#e92945', '#ecd911', '#17a6ee', '#c651c1', '#5c0011', '#614700', '#002766', '#540159', '#ffcba7', '#ebfa9a', '#92c3e2', '#ffbbe1', '#d4390c', '#7cb302', '#0059aa', '#c41d7f', '#ff9c6e', '#d3f261', '#5990c1', '#ff85c0', '#d64703', '#95c005', '#0078cd', '#cd27a1', '#ffb27a', '#def467', '#5cb1de', '#fc92d5', '#ad2201', '#5c8c02', '#00439f', '#9e1168', '#ff7b44', '#bae636', '#2f7aba', '#f759ab', '#bc2d00', '#729f00', '#0074b6', '#b01188', '#fd8c3c', '#ceee27', '#03a2da', '#f75dc8', '#871400', '#3e6600', '#00407f', '#780750', '#fa541c', '#a0d911', '#0169b3', '#eb3097', '#9a1a03', '#4c7400', '#006497', '#8a086b', '#ec6b1c', '#b3da05', '#0092d5', '#e43eb6', '#610b01', '#254000', '#00345e', '#520339', '#e9c986', '#c6f19d', '#dab6f6', '#df8ea7', '#8f5902', '#399e0f', '#531dab', '#892c42', '#cf994e', '#95de64', '#b37fea', '#bb556e', '#ae7e08', '#4ab00c', '#6b27bb', '#ab4a5f', '#dcb559', '#abea6f', '#c48cf1', '#d57897', '#764803', '#247805', '#391185', '#732431', '#b67e2d', '#73d13c', '#9254de', '#aa435e', '#9f6705', '#298a00', '#471397', '#a42f4e', '#d1a52b', '#89e438', '#ab5aea', '#cd6b8c', '#663602', '#125200', '#22085e', '#6b1526', '#a46c13', '#51c41a', '#722ed1', '#9f3954', '#834e00', '#135600', '#2d0085', '#8c0a3a', '#c29205', '#6bcd23', '#8b3ed5', '#be5877', '#4c2600', '#082b00', '#19005a', '#54041b'
];

const mainColors = [ // 数量较少时颜色较重的16中颜色
  '#c50538',
  '#9b4c00',
  '#034753',
  '#735daf',
  '#950027',
  '#9a7d00',
  '#004f9f',
  '#8c0392',
  '#9a1a03',
  '#4c7400',
  '#006497',
  '#8a086b',
  '#834e00',
  '#135600',
  '#2d0085',
  '#8c0a3a',
];

export default { initColors, outputColors, mainColors };



