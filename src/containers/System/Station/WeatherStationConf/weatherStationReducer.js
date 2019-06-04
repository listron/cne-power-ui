import Immutable from 'immutable';

const weatherStationAction = {
  changeWeatherStationStore: Symbol('changeWeatherStationStore'),// 替换reducer参数
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getWeatherList: Symbol('getWeatherList'),
  getUpdateWeather: Symbol('getUpdateWeather'),
  getEditWeather: Symbol('getEditWeather'),
  getWeatherStation: Symbol('getWeatherStation'),
}

var initState = Immutable.fromJS({
  loading: false,
  weatherList: [],// 天气列表
  listParameter: {
    stationCodes: [],// 电站列表
    pageSize: 10,
    pageNum: 1,
    orderFiled: 'stationName',
    orderType: 1,
  },
  pageStatus:'list',
  weatherStation:[],// 气象站列表
});

 const weatherStationReducer = (state = initState, action) => {
  switch (action.type) {
    case weatherStationAction.changeWeatherStationStore:
      return state.merge(Immutable.fromJS(action.payload))
    case weatherStationAction.resetStore:
      return initState
  }
  return state;
}


export {weatherStationAction, weatherStationReducer}