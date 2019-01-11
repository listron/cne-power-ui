// var Mock = require('mockjs');
// var data = Mock.mock({
//     // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//     'availability': Math.random() + 100,
//     "conversioneff": Math.random() + 1000,
//     "deviceModeName": /[a-z][A-Z][0-9]/,
//     "deviceTypeCode": /[a-z][A-Z][0-9]/,
//     "faultHours": Math.random(),
//     "faultNum": Math.random(),
//     "manufacturer": '@cparagraph()',
//     "powerRating": Math.random(),
//     "stationCode": Math.random(),
// })

const conversioneffList = [], deviceCapacityList = [], faultHoursList = [], faultNumList = [];

const data = {
    "availability": 234,
    "conversioneff": "1332219.02760000",
    "deviceModeName": "SG500MX",
    "deviceTypeCode": 201,
    "faultHours": "148.27327327",
    "faultNum": 24,
    "manufacturer": "阳光电源股份有限公司",
    "powerRating": "0.00",
    "stationCode": "350",
    "deviceCapacity":780,
  };
const length=Math.random()+10;
for (let i = 0; i < 30; i++) {
    conversioneffList.push(data)
    deviceCapacityList.push(data)
    faultHoursList.push(data)
    faultNumList.push(data)
}


module.exports = [{
    api: '/mock/performance/deviceanalysis/stationcontrastmore',
    method: 'post',
    response: {
        "code": "10000",
        "message": "请求成功",
        "data": {
            "conversioneffList": [
                {
                    "availability": null,
                    "conversioneff": "1332219.02760000",
                    "deviceModeName": "SG500MX",
                    "deviceTypeCode": 201,
                    "faultHours": "148.27327327",
                    "faultNum": 24,
                    "manufacturer": "阳光电源股份有限公司",
                    "powerRating": "0.00",
                    "stationCode": "350"
                  },{
                    "availability": null,
                    "conversioneff": "1332219.02760000",
                    "deviceModeName": "SG500MX",
                    "deviceTypeCode": 201,
                    "faultHours": "148.27327327",
                    "faultNum": 24,
                    "manufacturer": "阳光电源股份有限公司",
                    "powerRating": "0.00",
                    "stationCode": "350"
                  },{
                    "availability": null,
                    "conversioneff": "1332219.02760000",
                    "deviceModeName": "SG500MX",
                    "deviceTypeCode": 201,
                    "faultHours": "148.27327327",
                    "faultNum": 24,
                    "manufacturer": "阳光电源股份有限公司",
                    "powerRating": "0.00",
                    "stationCode": "350"
                  },{
                    "availability": null,
                    "conversioneff": "1332219.02760000",
                    "deviceModeName": "SG500MX",
                    "deviceTypeCode": 201,
                    "faultHours": "148.27327327",
                    "faultNum": 24,
                    "manufacturer": "阳光电源股份有限公司",
                    "powerRating": "0.00",
                    "stationCode": "350"
                  },{
                    "availability": null,
                    "conversioneff": "1332219.02760000",
                    "deviceModeName": "SG500MX",
                    "deviceTypeCode": 201,
                    "faultHours": "148.27327327",
                    "faultNum": 24,
                    "manufacturer": "阳光电源股份有限公司",
                    "powerRating": "0.00",
                    "stationCode": "350"
                  },{
                    "availability": null,
                    "conversioneff": "1332219.02760000",
                    "deviceModeName": "SG500MX",
                    "deviceTypeCode": 201,
                    "faultHours": "148.27327327",
                    "faultNum": 24,
                    "manufacturer": "阳光电源股份有限公司",
                    "powerRating": "0.00",
                    "stationCode": "350"
                  },
            ],
            "deviceCapacityList": deviceCapacityList,
            "faultHoursList": faultHoursList,
            "faultNumList": faultNumList
        }
    },
    delay: 1000,
    error: {}
}
]
