import $ from 'jquery';
// import apiConfig from './api_config.json'

const jsonText = $.ajax({
	type: "get",
	dataType: "json",
	url: "/powerp.json?",
	async: false,
}).responseText;

const apiConfig = $.parseJSON(jsonText);

// 搭配环境调整环境只需要在powerp.json中找到public内environment对应字符串匹配develop，demo，test或official即可,
// 同时为了保证cookie登录权限：powerp.json中将domain由chinacloudsites.cn改为localhost
const environmentUrl = apiConfig.public.environment

module.exports = {
  apiHostUri: apiConfig[environmentUrl].apiUrlReal + '/api',
	tokenUri: apiConfig[environmentUrl].apiUrlReal + '/token',
	outUrl: '',
	apiUrlReal: apiConfig[environmentUrl].apiUrlReal,
	signalrReal: apiConfig[environmentUrl].signalrReal,
	environment: environmentUrl,
}