
export const allStationAction = {
  changeMonitorstationStore: Symbol('changeMonitorstationStore'),
  resetMonitorData: Symbol('resetMonitorData'),
  getMonitorStation: Symbol('getMonitorStation'),
  stopRealMonitorData: Symbol('stopRealMonitorData'),
  getRealMonitorData: Symbol('getRealMonitorData'),
  getRealChartsData: Symbol('getRealChartsData'), // 出力图和散点图
  getRealMonitorPower: Symbol('getRealMonitorPower'), // 出力图和散点图
  stopRealCharstData: Symbol('stopRealCharstData'), // 停止计时器
  getPvChartsData: Symbol('getPvChartsData'), // 光伏图表
  getPvRealData: Symbol('getPvRealData'), // 光伏实时数据
  getPvCapabilitydiagrams: Symbol('getPvCapabilitydiagrams'), // 光伏实时数据
  getPvRealChartsData: Symbol('getPvRealChartsData'), // 光伏实时数据
}

