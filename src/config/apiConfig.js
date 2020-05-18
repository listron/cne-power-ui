
const apiConfig = {
	"public": {
		"name": "CNE",
		"prefix": "antdAdmin",
		"footerText": "版权所有 © 2017 北京动力协合科技有限公司",
		"logoText": "",
		"needLogin": true,
		"biUriPrefix": "/bi/",
		"environment": "test"
	},
	"demo": {
		"apiUrlReal": "http://cnedemoapi.chinacloudsites.cn"
	},
	"develop": {
		"htUrl": "http://10.10.11.3",
		"apiUrlReal": "http://10.10.15.51",
		"signalrReal": "http://dev-api.cnecloud.cn"
	},
	"local": {
		"apiUrlReal": "http://localhost:802",
		"signalrReal": "http://localhost:802"
	},
	"test": {
		"htUrl": "http://10.10.11.3",
		"apiUrlReal": "http://10.10.15.83",
		"signalrReal": "http://dev-api.cnecloud.cn"
	},
	"official": {
		"apiUrlReal": "http://pv-api.cnecloud.cn",
		"signalrReal": "http://real-time.cnecloud.cn"
	}
};

// 搭配环境调整环境只需要在powerp.json中找到public内environment对应字符串匹配develop，demo，test或official即可,
// 同时为了保证cookie登录权限：powerp.json中将domain由chinacloudsites.cn改为localhost
const environmentUrl = apiConfig.public.environment;
export default {
	originUri: apiConfig[environmentUrl].apiUrlReal,
  apiHostUri: apiConfig[environmentUrl].apiUrlReal + '/api',
	tokenUri: apiConfig[environmentUrl].apiUrlReal + '/token',
	outUrl: '',
	apiUrlReal: apiConfig[environmentUrl].apiUrlReal,
	environment: environmentUrl,
};
