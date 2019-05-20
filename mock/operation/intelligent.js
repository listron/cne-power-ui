module.exports = [
  {
    api:'/mock/operation/MockIntelligentList',
    method:'post',
    response:{
      code: "10000",
      message: "请求成功",
      data: {
        total: 13,
        dataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(e => ({
          deviceTypeCode: `${e}`,
          deviceTypeName: `测试设备${e}`,
          faultName: `缺陷${e}`,
          faultTypeId: `${e}`,
          faultDescription: `缺陷${e}`,
          processingMethod: `${e}`,
          checkItems: `型号型号型号型号型号型号型号型号型号${e}`,
          requiredTools: `${e}`,
          processingMethod: `处理方法${e}`,
          update_time: `${e}`,
          like_count: `${e}`,
          knowledgeBaseId: `${e}`,
          remark: `${e}`,
          recorder: `${e}`,
        }))
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }
]