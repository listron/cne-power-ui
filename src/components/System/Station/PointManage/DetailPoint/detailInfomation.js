export const leftInfo = (data) => {
  const leftArray = [
    { name: '电站名称', value: data.stationName },
    { name: '设备类型', value: data.deviceTypeName },
    { name: '设备型号', value: data.deviceModeName },
    { name: '生产厂家', value: data.manufatorName },
    { name: '创建者', value: data.createName },
    { name: '创建时间', value: data.createTime },
    { name: '最后修改人', value: data.recentUpdatedName },
    { name: '最后修改时间', value: data.recentUpdatedTime },
  ];
  return leftArray;
};
export const rightInfo = (data) => {
  const rightArray = [
    { name: '测点编号', value: data.devicePointStandardCode },
    { name: '测点描述', value: data.devicePointName },
    { name: '标准点描述', value: data.deviceStandardPointDesc },
    { name: '第三方测点名称', value: data.devicePointCode },
    { name: '英文名称', value: data.devicePointIecname },
    { name: '数据类型', value: data.devicePointDatatype },
    { name: '测点类型', value: data.devicePointType },
    { name: '单位', value: data.devicePointUnit },
    { name: '系数', value: data.devicePointIndex },
    { name: '小数点位数', value: data.devicePointDecimalplace },
    { name: '是否上传', value: data.isTransfer ? '是' : '否' },
    { name: '是否显示', value: data.isShow ? '是' : '否' },
    { name: '理论最大值', value: data.maxTheory },
    { name: '理论最小值', value: data.minTheory },
    { name: '偏差值', value: data.discrepancy },
  ];
  return rightArray;
};
export const showleftInfo = (data) => {
  const leftArr = [
    { name: '电站名称', value: data.stationName },
    { name: '设备类型', value: data.deviceTypeName },
    { name: '设备型号', value: data.deviceModeName },
    { name: '生产厂家', value: data.manufatorName },
  ];
  return leftArr;
};
