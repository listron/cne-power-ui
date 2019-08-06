import config from '../config/apiConfig';
export default {
  basePaths: {
    originUri: config.originUri,
    APIBasePath: config.apiHostUri,
    TokenBasePath: config.tokenUri,
  },
  commonPaths: {
    imgUploads: '/v3/uploadfile', //上传文件
    getStations: '/v3/station/datalist', //按照用户权限获取电站
    getDevicetypes: '/v3/station/devicetype',
    getMonitorDataUnit: '/v3/station/monitor/conf', //获取电站监控单位的单位以及精确值接口名
    getStationDevicetypes: '/v3/station/devicetypes',
    getDevices: '/v3/station/stationdevices',
    getPartitions: '/v3/station/partitions',
    getDeviceModel: '/v3/management/devicemodecode', // 获取电站(必填), 设备类型下的设备型号
    getStationPoints: '/v3/management/devicepointcode', // 电站(必填) 设备类型，设备型号，获取所有测点基本信息
    findDeviceExist: '/v3/performance/queryByDeviceName', // 验证设备是否存在
    getLostGenType: '/v3/faulttype/getlist', // 故障损失类型
    getStationBelongTypes: '/v3/management/total', // 获取电站可能的所属的各种分类信息
    getStationTargetInfo: '/v3/management', // 获取电站指定指标分类： 省市县等。
    getWeather: '/v3/monitor/weather', // 单电站未来天气
    // getRefreshToken: '/v3/oauth/token' --todo 根据过期token中携带的refreshToken获取新token接口。
    getDictionaryInfo: '/v3/management/dictionary', //获取覆盖类型、并网电压等级、所属电网（区域）忽略原因列表
    getRegion: '/v3/wind/report/fan/region',
    getRegionStation: '/v3/wind/report/fan/station',
    getStationDevicemode: '/v3/wind/report/fan/devicemode',
    getRegionStationDevice: '/v3/wind/report/fan/device',
  },
  APISubPaths: {
    // 新的登陆注册接口
    userNameLogin: '/v3/login',
    getVerificationCode: '/v3/login/verificationcode',
    getEnterpriseInfo: '/v3/login/enterpriseinfo',
    phoneCodeLogin: '/v3/login/phonecode',
    joinEnterprise: '/v3/login/userenterprise',
    loginPhoneRegister: '/v3/login/phoneregister',
    checkEnterpriseDomain: '/v3/login/enterprisedomain',
    checkEnterpriseName: '/v3/login/enterprise',
    resetPassword: '/v3/login/password',
    registerEnterprise: '/v3/login/enterpriseregister',
    checkUserRegister: '/v3/login/userregister',
    phoneCodeRegister: '/v3/login/phoneregister',
    inviteUserLink: '/v3/user/link',
    login: {
      userNameLogin: '/v3/login',
      getVerificationCode: '/v3/login/verificationcode',
      getEnterpriseInfo: '/v3/login/enterpriseinfo',
      phoneCodeLogin: '/v3/login/phonecode',
      joinEnterprise: '/v3/login/userenterprise',
      loginPhoneRegister: '/v3/login/phoneregister',
      checkEnterpriseDomain: '/v3/login/enterprisedomain',
      checkEnterpriseName: '/v3/login/enterprise',
      resetPassword: '/v3/login/password',
      registerEnterprise: '/v3/login/enterpriseregister',
      checkUserRegister: '/v3/login/userregister',
      phoneCodeRegister: '/v3/login/phoneregister',
      inviteUserLink: '/v3/user/link',
    },
    homepage: {
      realTimeData: '/v3/monitor/largescreen/websummary', // 电站概况，实时监控，设备状态等
      completeRate: '/v3/monitor/largescreen/completionrate', // 完成率
      energySaving: '/v3/monitor/largescreen/energysaving', // 节能减排
      monthPower: '/v3/monitor/largescreen/monthpower', // 每月发电量
      eqpHours: '/v3/monitor/largescreen/equivalenthours', // 等效利用小时数
      faultNumber: '/v3/monitor/largescreen/faultnumber', // 故障台次
      mapStationList: '/v3/monitor/largescreen/map', // 地图坐标及统计
      alarmList: '/v3/monitor/largescreen/warninglist', // 告警列表
      outputDiagram: '/v3/monitor/largescreen/capabilitydiagram', // 出力图表
      operationInfo: '/v3/monitor/largescreen/worklistcount', // 运维情况
      singleStation: '/v3/monitor/largescreen/stationdetail', // 单电站详情
    },
    ticket: {
      // 工单
      getDefectList: '/v3/defect/worklist/pc',
      getDefectIdList: '/v3/defect/worklist/getallid',
      batchDeleteDefect: '/v3/defect/delete/batch',
      getInspectList: '/v3/inspect/worklist/pc',
      getInspectIdList: '/v3/inspect/worklist/getallid',
      batchSendDefect: '/v3/defect/distribute/batch',
      batchCloseDefect: '/v3/defect/close/batch',
      batchRejectDefect: '/v3/defect/reject/batch',
      batchCheckDefect: '/v3/defect/check/batch',
      getInspectionList: '/v3/inspect/worklist/pc',
      getDefectDetail: '/v3/defect',
      getInspectDetail: '/v3/inspect',
      getCommonList: '/v3/language',
      addInspectAbnormal: '/v3/inspect/abnormal',
      sendDefect: '/v3/defect/distribute',
      rejectDefect: '/v3/defect/reject',
      closeDefect: '/v3/defect/close',
      handleDefect: '/v3/defect/handle',
      checkDefect: '/v3/defect/check',
      getDefectTypes: '/v3/defect/type',
      createNewDefect: '/v3/defect',
      submitDefect: '/v3/defect/reject/change',
      transformDefect: '/v3/inspect/defect',
      setInspectCheck: '/v3/inspect/check',
      finishInspect: '/v3/inspect/finish',
      createInspect: '/v3/inspect',
      deleteAbnormal: '/v3/inspect/deleteabnormal',
      getInspectStandard: '/v3/inspect/getstandard',
      inspectCheckBatch: '/v3/inspect/check/batch',
      getInspectDetailRecord: '/v3/inspect/record', //获取巡检记录
      getPersonnelGpsData: '/v3/location', //获取员工位置
      getInspectUsers: '/v3/user/getusers', //获取巡检人员
      getInspectOrbit: '/v3/inspect/track', //获取巡航轨迹
      getKnowledgebase: '/v3/knowledgebase/list', // 获取智能专家库列表
      likeKnowledgebase: '/v3/knowledgebase/like/', // 点赞智能专家
    },
    operation: {
      // 运维管理
      getDayReportList: '/v3/performance/dailyreportlist', //获取各电站日报统计列表
      getDayReportConfig: '/v3/performance/conf', // 获取日报上报必填项配置
      getStationBaseReport: '/v3/performance/ownstationcodeextlist', // 选中日期+电站后各待上传数据电站基础情况
      getReportUploadedStation: '/v3/performance/getdailyreportstation', // 选中日期已上报日报电站组
      uploadDayReport: '/v3/performance/dailyreport', // 上报日报
      dayReportDetail: '/v3/performance/detail', // 获取选中日报详情
      dayReportUpdate: '/v3/performance/dailyReport/mulitUpdate', // 日报详情编辑

      getImportIntelligent: '/v3/knowledgebase/import', // 智能专家库导入
      getIntelligentTable: '/v3/knowledgebase/list', // 智能专家库列表
      // getKnowledgebase: '/v3/knowledgebase', // 智能专家库详情
      getLike: '/v3/knowledgebase/like', // 智能专家库点赞
      downloadIntelligentTemplet: '/template/knowledgeBase.zip', // 下载导入模板
      operationIntelligent: '/v3/knowledgebase', // 删除、添加、编辑智能专家库
      getUserName: '/v3/user/related', // 获取相关用户名

      getAssetTree: '/v3/ledger/assetslist', //台账生产资产树
      getNodeDetail: '/v3/ledger/assets/detail', //台账生产资产树
      addAssetNode: '/v3/ledger/assets/add', //台账增加生产资产节点
      deleteAssetNode: '/v3/ledger/assets/delete', //台账删除生产资产树
      editAssetNode: '/v3/ledger/assets/update', //台账编辑生产资产节点
      getDeviceFactorsList: '/v3/ledger/devicemanufactors/list', //获取设备厂家列表
      addDeviceFactors: '/v3/ledger/devicemanufactors/add', //新建设备厂家
      editDeviceFactors: '/v3/ledger/devicemanufactors/update', //编辑设备厂家
      deleteDeviceFactors: '/v3/ledger/devicemanufactors/delete', //删除设备厂家
      getDeviceModesList: '/v3/ledger/devicemodes/list', //获取设备型号列表
      addDeviceModes: '/v3/ledger/devicemodes/add', //新建设备型号
      editDeviceModes: '/v3/ledger/devicemodes/update', //编辑设备型号
      deleteDeviceModes: '/v3/ledger/devicemodes/delete', //删除设备型号
      getEnterprisecodes: '/v3/ledger/operator/enterprisecodes', //获取可操作主设备类型的企业编码
//设备管理
      getfactorsDeviceMode: '/v3/ledger/devicemodes', //获取某设备厂家下的设备型号
      getDevicePartInfo: '/v3/ledger/device/parts/list', //获取某设备的部件信息
      getDevicefixRecord: '/v3/ledger/device/defect/list', //获取某设备检修记录
      getDevicehistoryWarning: '/v3/alarm/device', //获取某设备的历史告警

      //部件
      getDeviceTypeList: '/v3/ledger/devicetype',
      getDeviceComList: '/v3/ledger/parts/list',
      addPartInfo: '/v3/ledger/parts/add',
      copyPartInfo: '/v3/ledger/parts/copy',
      editPartInfo: '/v3/ledger/parts/update',
      getDetailPartInfo: '/v3/ledger/partsdetail/list',
      deletePartInfo: '/v3/ledger/delete',

      importParts: '/v3/ledger/parts/import',
      exportParts: '/v3/ledger/parts/export',
      downloadPartInfoTemplet: '/template/ComponentImport.xlsx',
      getPartAssetsTree: '/v3/ledger/assets', //获取某设备下的生产资产列表

      // 台账-仓库配置
      warehouseList: '/v3/warehouse/pageList', // 仓库列表分页查询 || 模糊搜索
      warehouseAdd: '/v3/warehouse/add', // 仓库添加
      warehouseDel: '/v3/warehouse/del', // 仓库删除
      warehouseUpdate: '/v3/warehouse/update', // 仓库编辑
      goodsList: '/v3/goods/pageList', // 物品（物资）清单分页列表
      goodsAdd: '/v3/goods/add', // 物品增加
      goodsDel: '/v3/goods/del', // 物品删除
      goodsUpdate: '/v3/goods/update', // 物品（物资）修改
      // 台账-设备台账
      deviceAccountList: '/v3/ledger/list', // 设备台账列表
      stationsManufactors: '/v3/ledger/stations/manufactors', // 获取电站下的厂家列表
      deviceModeList: '/v3/ledger/devicemodes', // 获取厂家下的设备型号列表
      attachmentsList: '/v3/ledger/attachments/list', // 台账备件列表
      regionStation: '/v3/station/region', // 获取区域

      // 台账-仓库管理
      getWarehouses: '/v3/warehouse/list', // 所有仓库下拉项
      getManufactures: '/v3/manufactor/user/manufactors', // 所有厂家下拉项
      getModes: '/v3/manufactor/user', // 所有厂家下拉项
      getGoodsList: '/v3/goods/listByType', // 物品类别下所有物品列表下拉
      getWarehouseManageList: '/v3/inventory/pageList', // 获取仓库管理下-备品备件/工器具/物资列表
      insertWarehouse: '/v3/inventory/entry', // 备品备件/工器具/物资列表 => 入库||再入库
      deleteWarehouseMaterial: '/v3/inventory/del', // 删除 备品备件/工器具/物资列表
      takeoutWarehouseMaterial: '/v3/inventory/out', // 出库 备品备件/工器具/物资列表
      setStockMax: '/v3/inventory/thresholdSet', // 设置库存阈值
      exportStockFile: '/v3/inventory/export', // 导出备品备件/工器具/物资列表
      downloadStockTemplete: '/v3/inventory/downLoad', // 下载导入模板
      importStockFile: '/v3/inventory/importEntry', // 导入备品备件/工器具/物资列表
      getMaterialDetailsList: '/v3/inventory/materialList', // 指定物资内所有物品列表(编码+物资名)
      getReserveDetail: '/v3/inventory/inventoryInfo', // 获取某库存详情
      getReserveList: '/v3/inventory/inventoryInfoPageList', // 获取某库存信息列表
      deleteReserveInfo: '/v3/inventory/record/del', // 删除库存中某物资
      recallReserveInfo: '/v3/inventory/record/reCall', // 撤回库存中某物资的出库
      getWarehouseStationType: '/v3/warehouse/stationType', // 仓库所属电站类型
      // 台账-出入库记录
      warehouseName: '/v3/warehouse/list', // 用户权限下仓库下拉列表
      warehouseType: '/v3/manufactor/user', // 规格/型号下拉列表
      inRecordExport: '/v3/inventory/inRecord/export', // 入库导出
      outRecordExport: '/v3/inventory/outRecord/export', // 出库导出
      inRecordList: '/v3/inventory/inRecord/pageList', // 入库记录分页查询
      outRecordList: '/v3/inventory/outRecord/pageList', // 出库记录分页查询

      // 两票 - 审核人设置
      getSettingList: '/v3/workflow/station/distribution/pageList', // 获取设置列表
      getSettableNodes: '/v3/workflow/template', // 获取可配置属性节点
      createSettedInfo: '/v3/workflow/station/distribution/add', // 生成已配置电站信息
      editSettedInfo: '/v3/workflow/station/distribution/update', // 编辑已配置电站
      getSettedInfo: '/v3/workflow/station/distribution/detail', // 查看已配置电站
      getSettableUsers: '/v3/workflow/node/ableCheckUser', // 查看可配置的人员列表
      // 两票管理
      getDocketList: '/v3/docket/pageList', //列表
      getDocketStatus: '/v3/docket/state/total', //票据状态及总数
      getDocketType: '/v3/docket/typeList', //票据类型
      getNewImg: '/v3/docket/imgs/new', // 票据最新图片查看
      getNewImgDown: '/v3/docket/downloadImgs/new', //票据最新图片下载
      stopNodes: '/v3/workflow/template',
      addDocket: '/v3/docket/add', // 新建工作/操作票
      noDistribution: '/v3/workflow/station/distribution/noDistribution', //获取未分配人员电站
      getDocketDetail: '/v3/docket/detail', // 工作票详情
      nodeImg: '/v3/docket/imgs', // 节点图片
      downloadImgs: '/v3/docket/downloadImgs', // 下载节点图片
      getDocketHandle: '/v3/docket/handle', //审核/执行/消票 票据
      newImg: '/v3/docket/imgs/new', // 最新节点图片
      downNewImgs: '/v3/docket/downloadImgs/new', // 票据最新图片下载
      handleBatch: '/v3/docket/handleBatch', // 批量审核/执行/消票 票据
      stopBatch: '/v3/docket/stopBatch', // 批量终止票据（作废）
      delDocket: '/v3/docket/del', // 票据删除

    },
    system: {
      //系统管理
      getEnterprisList: '/v3/enterprise/list', //企业列表
      getEnterprisDetail: '/v3/enterprise', //企业详情获取
      saveEnterpriseDetail: '/v3/enterprise/change', //保存企业详情
      getDepartmentList: '/v3/department/list', //部门列表
      departmentInfo: '/v3/department', //部门信息新增，编辑，详情，删除
      getAllDepartment: '/v3/department/all', //所有部门列表
      getDepartmentUser: '/v3/department/user', //所有用户列表，用于为部门分配用户
      getDepartmentStation: '/v3/department/station', //所有电站列表，用于为部门分配电站
      setDepartmentUser: '/v3/department/user', //设置部门成员
      setDepartmentStation: '/v3/department/station', //设置部门电站

      getRoleList: '/v3/role/list',
      getMenuList: '/v3/right',
      getDefaultRight: '/v3/role/defaultright', // 获取角色下的默认权限
      createRole: '/v3/role',
      editRole: '/v3/role/{enterpriseId}',
      deleteRole: '/v3/role',

      getUserList: '/v3/user/list', //用户列表
      changeUserStatus: '/v3/user/status', //更改用户状态
      getUserDetail: '/v3/user/', //用户详情
      editUserInfo: '/v3/user', //编辑用户
      createUserInfo: '/v3/user', //新建用户
      getInviteLink: '/v3/user/link', //邀请用户
      getRoleAllList: '/v3/role/all/list', //获取企业角色
      importUserBatch: '/v3/user/batch', //批量导入用户

      // 电站管理部分
      uploadStationFile: '/v3/management/stationimport', // 导入电站信息
      downloadStationTemplet: '/template/StationInfoTemplate.zip', // 下载电站配置模板
      getStationList: '/v3/management/stationList', // 获取电站列表
      getStationDetail: '/v3/management/stationDetail', // 获取电站详情
      saveStationDetail: '/v3/management/upateStation', // 编辑后保存电站详情
      deleteStation: '/v3/management/tryDelete', // 删除电站(及以下设备及设备信息)
      setStationDepartment: '/v3/management/alarmevent/station/department', // 分配部门
      importStationInfo: '/v3/management/station/devices', // 导入电站+设备信息
      getAllStationBaseInfo: '/v3/management/datalist', // 获取该用户所在企业的所有电站(与token无关)

      getDeviceList: '/v3/management/devicelist', // 获取设备列表
      downloadDeviceInfo: '/v3/management/station/devices', // 导出设备信息表
      downloadDeviceTemplet: '/template/DeviceInfoTemplate.zip', // 下载设备配置模板
      addDeviceInfo: '/v3/management/device', // 新增设备信息表
      showDeviceInfo: '/v3/management/device', // 设备详情信息表
      editDeviceInfo: '/v3/management/device', // 编辑设备信息表
      getConnectDevice: '/v3/management/queryParentDeviceBySubType', //关联设备
      deleteDevice: '/v3/management/device', //删除设备信息
      importStationDevice: '/v3/management/stationimport', //批量导入设备
      deleteStationDevice: '/v3/management/emptydevice', //删除设备
      checkDeviceMode: '/v3/management/queryModeExits', //查询设备型号是否重复
      addDeviceType: '/v3/management/deviceType', //添加设备类型
      addDeviceMode: '/v3/management/deviceMode', //添加设备型号
      addPvDeviceMode: '/v3/management/deviceMode', //添加pv设备型号
      checkDeviceName: '/v3/management/queryDeviceExits', //查询设备名字是否重复
      checkDeviceType: '/v3/management/queryTypeExits', //查询设备类型是否重复
      getStationDeviceType: '/v3/management/queryDevicesTypeByStation', //查询电站下的设备类型

      getPointList: '/v3/management/station/device/point/list', // 获取点表列表
      deletePoints: '/v3/management/station/device/modes', // 删除点表信息
      importPointsInfo: '/v3/management/station/device/points', //导入点表信息
      downloadPointInfo: '/v3/management/station/device/points', // 导出测点表

      importAlarmInfo: '/v3/management/alarmevent/import', //导入告警信息
      getAlarmList: '/v3/management/alarmevent/list', //获取告警列表
      deleteAlarms: '/v3/management/alarmevent/delete', // 删除告警
      downloadAlarmInfo: '/v3/management/alarmevent/export', // 导出告警事件

      getPowercurveList: '/v3/management/powercurve', // 功率曲线列表
      getPowercurveDetail: '/v3/management/powercurve/detail', // 功率曲线详情图
      importPowercurve: '/v3/management/powercurve/import', //导入功率曲线
      downloadPowercurve: '/v3/management/powercurve/export', // 导出功率曲线

      // 计划配置
      getPlanList: '/v3/performance/stationplanlist', //查看生产计划列表
      addPlanList: '/v3/performance/stationplan', //  添加生产计划
      eddPlanList: '/v3/performance/stationplan', //  编辑生产计划
      getYearList: '/v3/station/yearlist', // 生产计划的年份
      importPlan: '/v3/performance/plan/import', // 批量导入生产计划

      getSeriesData: '/v3/forewarning/conf', //获取低效组串预警配置
      addSeriesData: '/v3/forewarning/conf', //设置低效组串预警配置
      getCleaningData: '/v3/pvclean/conf', //获取清洗模型预警配置
      addCleaningData: '/v3/pvclean/conf', //设置清洗模型预警配置
      warnConf: '/v3/smartalarm/conf', // 预警配置 增删改查
      getStationPoints: '/v3/smartalarm/devicepointcode', // 测点，已预警的测点删除
      ScoreConfig: '/v3/performance/score/conf', //	评分配置

      // 气象站配置
      WeatherStaion: '/v3/pv/monitor/weather',
      getWeatherStation: '/v3/pv/monitor/weather/list/',
    },
    monitor: {
      //实时监控
      getStationType: '/v3/monitor/stations/',
      stationDeviceList: '/v3/station/devicelist', // 单电站设备列表获取
      seriesinverterDetail: '/v3/monitor/seriesinverter', //组串式逆变器详情
      inverterSubList: '/v3/monitor/seriesinverter/sublist', // 逆变器下级设备信息
      seriesinverterTenMin: '/v3/monitor/seriesinverter/sequencechart', //组串式逆变器10min时序图
      seriesBranchTenMin: '/v3/monitor/seriesinverter/sequencechart/zl', // 组串式逆变器下支路电流10min时序图
      confluenceboxDetail: '/v3/monitor/confluencebox', //汇流箱详情
      confluenceboxSubList: '/v3/monitor/confluencebox/sublist', // 汇流箱下级设备信息
      confluenceboxTenMin: '/v3/monitor/confluencebox/sequencechart', //汇流箱10min时序图
      boxtransformerDetail: '/v3/monitor/boxtransformer', //箱变详情
      boxtransformerSubList: '/v3/monitor/boxtransformer/sublist', // 箱变下级设备
      boxtransformerTenMin: '/v3/monitor/boxtransformer/sequencechart', //箱变10min时序图
      weatherstationDetail: '/v3/monitor/weatherstation', //气象站详情
      integrateDetail: '/v3/monitor/collectorline', // 集电线路详情
      integrateSubList: '/v3/monitor/collectorline/sublist', // 集电线路下级信息
      boosterDetail: '/v3/monitor/boosterstation', // 升压站详情
      boosterSubList: '/v3/monitor/boosterstation/subList', // 升压站下级信息
      monitorPointData: '/v3/monitor/point', //设备测点数据
      deviceAlarmData: '/v3/alarm/device', // 单设备告警信息
      monitorEvents: '/v3/monitor/device/eventlist', // 单设备事件
      getRealtimeAlarm: '/v3/alarm/station/alarmlist', //实时告警信息
      exportAlarmStatistic: '/v3/alarm/station/alarmsummary/export', //导出告警统计

      getPvmoduleList: '/v3/monitor/pvmodule/datalist/', //光伏组件列表 实时
      getInverterList: '/v3/monitor/seriesinverter/datalist/', // 组串式逆变器列表 实时
      getBoxTransformerList: '/v3/monitor/boxtransformer/datalist/', //箱变列表 实时
      getConfluenceBoxList: '/v3/monitor/confluencebox/datalist/', // 汇流箱列表 实时
      getCollectorLine: '/v3/monitor/collectorline/datalist/', // 集电线路列表 实时
      getBoosterstation: '/v3/monitor/boosterstation/datalist/', // 升压站列表 实时
      getPowerNet: '/v3/monitor/powercollection/datalist/', // 电网列表 实时
      getSingleStation: '/v3/monitor/station/', //单电站实时数据
      getSingleWindleStation: '/v3/wind/monitor/station/', // 单电站风电站实时数据
      getSinglePvStation: '/v3/pv/monitor/station/', // 单电站光伏电站实时数据
      getCapabilityDiagram: '/v3/pv/monitor/station/capabilitychart/', //单电站出力图表
      getMonitorPower: '/v3/monitor/power/', //单电站理论发电量-实际发电量图表
      getPvMonitorPower: '/v3/pv/monitor/station/power/', // 光伏 发电量
      getStationList: '/v3/station/datalist/', //电站列表
      getWeatherList: '/v3/monitor/weather', //单电站未来天气
      getOperatorList: '/v3/station/user/', //单电站运维人员列表
      getAlarmList: '/v3/alarm/station/alarmnum/', //单电站活动告警数统计
      getWorkList: '/v3/monitor/worklist/', //单电站工单数统计
      getDeviceTypeFlow: '/v3/station/devicetypeflow/', //单电站设备类型流程图
      getNewDeviceTypeFlow: '/v3/station/typeflow/', //单电站设备类型流程图
      getSketchmap: '/v3/station/sketchmap/', //单电站设备类型流程图数据
      getStationDeviceList: '/v3/station/devicelist/', //单电站设备列表
      getSingleStationDeviceList: '/v3/wind/monitor/station/devices/', //风单电站设备列表
      editData: '/v3/management/stationgen', //编辑月，年的累计发电量
      radiationchart: '/v3/monitor/weather/radiationchart/', // 获取气象站日辐射图表

      getHistoryAlarm: '/v3/alarm/station/historyalarmlist', //历史告警
      getStationsAlarmStatistic: '/v3/alarm/stations/alarmsummary', //多电站统计
      getSingleStationAlarmStatistic: '/v3/alarm/station/alarmsummary', //单电站统计
      getAlarmNum: '/v3/alarm/stations/alarmnum', //多电站告警数
      getTicketInfo: '/v3/alarm/worklist/getbyid', //告警工单详情
      getRelieveInfo: '/v3/alarm/getrelievealarm', //屏蔽详情
      transferAlarm: '/v3/alarm', //告警转工单
      relieveAlarm: '/v3/alarm/relievealarm', //屏蔽告警
      resetRelieveAlarm: '/v3/alarm/delrelievealarm', //取消屏蔽告警

      getFanList: '/v3/monitor/windturbine/datalist', // 风机实时数据列表
      getNewFanList: '/v3/wind/monitor/station/devices', // 新的风机实时数据列表
      windturbine: '/v3/monitor/windturbine', //风机实时数据
      newWindturbine: '/v3/wind/monitor/windturbine', //新的风机实时数据
      sequencechart: '/v3/monitor/windturbine/sequencechart', // 风机图表数据
      sequencediagram: '/v3/wind/monitor/windturbine/sequencediagram', // 单风机时序图
      scatterpoint: '/v3/wind/monitor/windturbine/scatterpoint', // 单风机散点图

      //功率曲线
      getAllDeviceCurveData: '/v3/wind/powercurve/fans/chart', //功率曲线图表-多风机
      getPowerdeviceList: '/v3/wind/powercurve/fans/list', //..功率曲线列表-多风机
      exportPowerdevice: '/v3/wind/powercurve/fans/export', //功率曲线导出-多风机/单风机
      getSingleDeviceCurveData: '/v3/wind/powercurve/fan/powercurvechart', //功率曲线图表-功率曲线-单风机
      getSingleDeviceCurveList: '/v3/wind/powercurve/fan/list', //功率曲线列表-单风机
      getRoseChart: '/v3/wind/powercurve/fan/windrosechart', //功率曲线图表-风向玫瑰图-单风机
      getpowerspeedchart: '/v3/wind/powercurve/fan/powerspeedchart', //功率曲线图表-功率&转速-单风机
      getpitchanglespeedchart: '/v3/wind/powercurve/fan/pitchanglespeedchart', //功率曲线图表-桨距角&风速-单风机
      getwinddistributionchart: '/v3/wind/powercurve/fan/winddistributionchart', //功率曲线图表-风频分布-单风机
      getsequencechart: '/v3/wind/powercurve/fan/sequencechart', //功率曲线图表-时序图-单风机
      getDeviceInfo: '/v3/management/device', // 设备详情信息表

      // 数据分析
      getPointsInfo: '/v3/wind/analysis/devicepoint', // 数据趋势可用测点信息
      getAvailableDeviceType: '/v3/wind/analysis/devicetypelist', // 获取有测点的设备类型
      getListHistory: '/v3/wind/analysis/history/devicedata', // 历史数据 - 列表数据
      getAllHistory: '/v3/wind/analysis/history/devicechart', // 历史趋势 - 图表数据
      exportHistory: '/v3/wind/analysis/history/export', // 导出历史数据
      getSecendInteral: '/v3/wind/analysis/second', // 可用时间间隔
      getRealtimeChart: '/v3/wind/analysis/devicechart', // 实时数据 - 图表
      getRealtimeList: '/v3/wind/analysis/devicedata', // 实时数据 - 表格
      exportRealtime: '/v3/wind/analysis/export', // 导出实时数据
      getAllScatterDiagram: '/v3/wind/scatterpoint/fan/chart', // 散点图 - 图标数据
      getListScatterDiagram: '/v3/wind/scatterpoint/fan/list', // 散点图 - 列表数据
      exportScatterDiagram: '/v3/wind/scatterpoint/fan/export', // 导出散点图数据
      getPoints: '/v3/wind/scatterpoint/fan/point', // 散点图X/Y轴测点数据
      getDataExport: '/v3/wind/analysis/export/task', // 数据导出

      getWindMonitorPower: '/v3/wind/monitor/stations/power', // 全部风电站的理论发电量图表
      getWindStation: '/v3/wind/monitor/stations', // 全部风电站
      getWindCapability: '/v3/wind/monitor/stations/capabilitydiagram', // 风电站出力图
      getWindScatter: '/v3/wind/monitor/stations/equivalenthours', // 等效小时数
      getSingleWindScatter: '/v3/wind/monitor/station/equivalenthours', // 等效小时数
      getPointparams: '/v3/wind/monitor/station/pointparams', // 单电站测点参数(风电站)

      getDayPower: '/v3/pv/monitor/stations/daypower/', // 多电站日发电量与等效时图(光伏电站)
      getMonthPower: '/v3/pv/monitor/stations/monthpower/', // 多电站月发电量与等效时图(光伏电站)
      getMonthPalnPower: '/v3/pv/monitor/stations/monthplanpower/', // 多电站月累计与计划发电量图(光伏电站)
      getSingleMonthPalnPower: '/v3/pv/monitor/station/monthplanpower/', // 多电站月累计与计划发电量图(光伏电站)

      getPvStation: '/v3/pv/monitor/stations', // 全部风电站
      getPvCapabilitydiagrams: '/v3/pv/monitor/stations/capabilitydiagrams', //光伏多电站出力图列表

      //报表
      getPowerReportList: '/v3/wind/report/fan/gen', //电量报表汇总
      exportGen: '/v3/wind/report/fan/gen/export', //导出电量报表
      getDeviceStatusList: '/v3/wind/report/fan/devicestatus', //电设备状态报表汇总
      getDeviceStatusDetail: '/v3/wind/report/fan/devicestatus/detail', //电设备状态报表明细
      exportDeviceStatus: '/v3/wind/report/fan/devicestatus/export', //导出设备状态
      getMalfunctionList: '/v3/wind/report/fan/devicefault', //故障报表汇总
      getMalfunctionDetail: '/v3/wind/report/fan/devicefault/detail', //故障报表明细
      exportDevicefault: '/v3/wind/report/fan/devicefault/export', //导出设备故障报表
      getPowerLostList: '/v3/wind/report/fan/lostpower', //损失电量报表汇总
    },
    other: {
      editPassword: '/v3/user/password', // 更变密码
      editUserName: '/v3/user', // 更变姓名
      editPhone: '/v3/user/phone', // 更变电话
    },
    statisticalAnalysis: {
      getAllStationAvaliba: '/v3/performance/comprehensive/dataavaliba',
      getAllStationStatistic: '/v3/performance/comprehensive/plans',
      getAllStationStatisticTable: '/v3/performance/comprehensive/statistics',
      getAllStationMonthBar: '/v3/performance/comprehensive/chart/monthOrYear',
      getAllStationMonthPie: '/v3/performance/comprehensive/piecharts/month',
      //getAllStationYearBar:'v3/performance/comprehensive/chart/year',
      getSingleStationStatistic: '/v3/performance/comprehensive/plan',
      getSingleStationTarget:
        '/v3/performance/comprehensive/power/monthsorYear',
      getSingleStationMonthPie: '/v3/performance/comprehensive/piechart/month',

      getSingleStationYearTarget: '/v3/performance/comprehensive/power/year',
      getSingleStationPlanRate: '/v3/performance/comprehensive/planrate/years',
      getSingleStationDayCompleteRate:
        '/v3/performance/comprehensive/planrate/day',
      getSingleStationPvCompare: '/v3/performance/comprehensive/light/months',
      getSingleStationYearPvCompare: '/v3/performance/comprehensive/light/year',
      getSingleStationPowerEffective:
        '/v3/performance/comprehensive/efficiencygen',
      // 电站对比
      getStationContrast: '/v3/performance/stationcontrast',
      getStationContrastDetail: '/v3/performance/stationcontrast/list',
      //生产分析
      ProductionPlanComplete: '/v3/performance/productanalysis/plan',
      // 运行分析
      getOperatePlanComplete: '/v3/performance/operationanalysis/plan',
      getOperateComponentPower: '/v3/performance/operationanalysis/devicepower',
      getOperateUsageRate: '/v3/performance/operationanalysis/utilizationratio',
      getOperateLostPowerType: '/v3/performance/operationanalysis/lostpower',
      getOperateLimitPowerRate:
        '/v3/performance/operationanalysis/limitpower/months',
      getOperateYearLimitPower:
        '/v3/performance/operationanalysis/limitpower/year',
      getOperatePlantPower: '/v3/performance/operationanalysis/plantpower',
      // 资源分析
      getResourcePlan: '/v3/performance/resource/plan',
      getResourceMonthLight: '/v3/performance/resource/distribution/months',
      getResourceYearLight: '/v3/performance/resource/distribution/year',
      getResourceMonthWeather: '/v3/performance/resource/weather/years',
      getResourceDayWeather: '/v3/performance/resource/weather/day',
      //设备分析
      getEleLineCode: '/v3/performance/deviceanalysis/getEleLineCode', //集成线路接口
      getconversioneff: '/v3/performance/deviceanalysis/conversioneff', //转换效率
      getconversioneffContrast:
        '/v3/performance/deviceanalysis/conversioneff/contrast', //转换效率对比
      getHours: '/v3/performance/deviceanalysis/hours', //等效小时数、故障次数、故障时长
      getHoursContrast: '/v3/performance/deviceanalysis/hours/contrast', //等效小时数、故障次数、故障时长对比
      getAvailability: '/v3/performance/deviceanalysis/availability', //利用率及损失电量
      getAvailabilityContrast:
        '/v3/performance/deviceanalysis/availability/contrast', //利用率及损失电量对比
      getManufacturer: '/v3/performance/deviceanalysis/manufacturer', // 获取所有的生产厂家
      getDevicemode: '/v3/performance/deviceanalysis/devicemode', // 获取电站下的所有设备型号
      getDevicemodes: '/v3/performance/deviceanalysis/manufacturer/devicemode', // 获取电站下的所有设备型号
      getDevicecontrast: '/v3/performance/deviceanalysis/devicecontrast', // 设备对比数据
      getStationcontrast: '/v3/performance/deviceanalysis/stationcontrast', // 设备电站对比数据
      getStationcontrastmore:
        '/v3/performance/deviceanalysis/stationcontrastmore', // 设备对比(多电站)
      getEleDeviceData: '/v3/performance/deviceanalysis/devicemodeandtype', //查询集电线路下的设备型号和设备类型数据
      //通用报表
      dailyreport: 'v3/performance/dailyreport',
      faultReport: 'v3/performance/generalreport/fault',
      genReport: 'v3/performance/generalreport/gen',
      indicatorReport: 'v3/performance/generalreport/indicator',
      // 电站评分
      singleStaionScore: '/v3/performance/score',
      getScoreList: '/v3/performance/score/list',
      getPvStationType: '/v3/performance/score/reporttype', //用户电站下的光伏电站类型
      // 智能分析报告
      getIntelligent: '/v3/intelligence/analysis/station', // 单电站分析
      exportIntelligent: '/v3/intelligence/analysis/station/export', // 导出单电站分析导出
      getArea: '/v3/intelligence/analysis/area', // 同区域电站对比
      exportAreaStation: '/v3/intelligence/analysis/area/export', // 导出同区域电站对比
      getAreaCompare: '/v3/intelligence/analysis/areacompare', // 区域对比分析报告
      exportAreaCompare: '/v3/intelligence/analysis/areacompare/export', // 区域对比分析报告导出
    },
    highAnalysis: {
      getCleanWarningList: '/v3/pvclean/warning/list', // 清洗预警列表
      getCleanWarningDetail: '/v3/pvclean/warning/details', // 指定清洗预警详情
      getTotalDustEffect: '/v3/pvclean/station/dustinfluence', // 全局灰尘影响
      getMatrixDustEffect: '/v3/pvclean/matrix/dustinfluence', // 方阵灰尘影响

      getUnhandleList: '/v3/forewarning/unhandlelist', // 待处理预警／历史预警
      getIgnorelist: '/v3/forewarning/ignorelist', //已忽略历史预警
      getTransferlist: '/v3/forewarning/toorderlist', // 已转工单列表
      toorder: '/v3/forewarning/toorder', //预警转工单
      ignore: '/v3/forewarning/ignore', // 忽略预警
      warnDetail: '/v3/forewarning', //预警信息
      getSequencechart: '/v3/pv/sequencechart', //电流时序图
      getMatrixList: '/v3/station/matrix', //获取电站下方阵
      getStationDust: '/v3/pvclean/station/dustinfluence',
      getMatrixDust: '/v3/pvclean/matrix/dustinfluence',
      unignore: '/v3/forewarning/unignore', //取消忽略列表
      //清洗模型的首页
      getMainList: '/v3/pvclean/plan/list',
      //清洗模型点击进入单电站清洗详情
      getDetailList: '/v3/pvclean/plan/details',
      //加，编辑，获取，删除，清洗计划
      getAddCleanPlan: '/v3/pvclean/plan/insertartificial',
      getEditCleanPlan: '/v3/pvclean/plan/updateartificial',
      getCleanPlanDetail: '/v3/pvclean/plan/getartificial',
      deleteCleanPlan: '/v3/pvclean/plan/deleteartificial',
      //加，编辑，获取，下雨清洗计划
      getAddRainPlan: '/v3/pvclean/plan/rainfall',
      getEditRainPlan: '/v3/pvclean/plan/rainfall',
      getRainPlanDetail: '/v3/pvclean/plan/rainfall',
      //清洗记录列表，增，编辑，获取，删记录
      getPlanRecordList: '/v3/pvclean/record/list',
      getAddCleanRecord: '/v3/pvclean/record',
      editCleanRecord: '/v3/pvclean/record',
      getCleanRecordDetail: '/v3/pvclean/record',
      deleteCleanRecord: '/v3/pvclean/record',
      //通用报表
      dailyreport: 'v3/performance/dailyreport', // 日报
      faultReport: 'v3/performance/generalreport/fault', // 故障日报
      genReport: 'v3/performance/generalreport/gen', // 发电量信息
      indicatorReport: 'v3/performance/generalreport/indicator', // 生产运营指标

      // 风机故障检测与诊断
      warnSummary: '/v3/wtfdd/warning/summary', // 获取多风场故障预警汇总列表
      algoModel: '/v3/wtfdd/warning/algomodel', // 获取单风场故障预警汇总-按模型
      listView: '/v3/wtfdd/warning/list', // 获取单风场故障预警汇总-按模型
      fanList: '/v3/wtfdd/warning/windturbine', // 获取单风场故障预警汇总-按风机
      algoList: '/v3/wtfdd/task/algomodel', // 获取预警任务列表-算法模型视图
      algoOptionList: '/v3/wtfdd/algorithm', // 获取算法列表
      addWarnTask: '/v3/wtfdd/task', // 新增预警任务
      downloadFile: '/v3/wtfdd/task', // 下载故障发生概率文件
      warnHistory: '/v3/wtfdd/warning/history', // 获取历史预警列表
      resetTask: '/v3/wtfdd/task/redo', // 重新执行
      faultTaskList: '/v3/wtfdd/task/list', // 获取预警任务列表-列表视图
      standAlone: '/v3/wtfdd/result/residual', // 获取单风机自适应模块检测结果
      similarityList: '/v3/wtfdd/result/similarity', // 获取风机相似性结果
      allFanResult: '/v3/wtfdd/result/std', // 获取多机协同模块检测结果-严重程度及识别（所有风机）
      tenMinutesLine: '/v3/wtfdd/pt10m', // 获取风机10分钟数据
      faultInfo: '/v3/wtfdd/task/detail', // 获取故障预警任务详情
      statusInfo: '/v3/wtfdd/task/status', // 获取预警任务状态统计

      // 风电分析
      getAreaStation: '/v3/station/regionstaion', // 区域 - 电站信息
      getQuotaInfo: '/v3/fan/efficiency/indicator', // 风机指标信息
      getModesInfo: '/v3/ledeger/manufactormode', // 查询指定电站的厂家型号
      getStationCapacity: '/v3/fan/efficiency/stationcapacity', // 各电站装机容量

      getLostRank: '/v3/fan/efficiency/origin/indicatorrank', // 损失根源 - 指标排名
      getLostTrend: '/v3/fan/efficiency/origin/indicatortrend', // 损失根源 - 指标趋势
      getLostTypes: '/v3/fan/efficiency/origin/lostgenhour', // 损失根源 - 损失电量分解
      getStopElec: '/v3/fan/efficiency/stopgen', // 停机 - 损失电量
      getStopRank: '/v3/fan/efficiency/stoprank', // 停机 - 设备停机时长及次数
      getStopTrend: '/v3/fan/efficiency/stoptrend', // 停机 - 日月年 停机时长次数趋势图
      getStopTypes: '/v3/fan/efficiency/stoptype', // 停机 - 各类停机时长及次数
    },
  },
};





