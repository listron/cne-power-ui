


export const enterpriseAction = {
  fetching: Symbol('fetching'),//loading
  changeEnterpriseStore: Symbol('changeEnterpriseStore'),//改变reducer参数
  enterpriseRuducerReplace: Symbol('enterpriseRuducerReplace'),//替换reducer参数
  getEnterprisList: Symbol('getEnterprisList'),//获取企业列表
  saveEnterpriseInfor: Symbol('saveEnterpriseInfor'),//企业详情保存(编辑+新增)
  enterpriseFetchSuccess: Symbol('enterpriseFetchSuccess'),//api请求成功
  getEnterpriseDetail: Symbol('getEnterpriseDetail'),//获取企业详情
  ignoreEnterpirseEdit: Symbol('ignoreEnterpirseEdit'),//忽略企业编辑提示
}




