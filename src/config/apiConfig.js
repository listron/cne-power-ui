import $ from 'jquery';
// import apiConfig from './api_config.json'
const randomNum = Math.random();
// console.log('my environment test',ENV, DEV, PRO);
const jsonText = $.ajax({
	type: 'get',
	dataType: 'json',
	url: `/powerp.json?${randomNum}`,
	async: false,
}).responseText;

const apiConfig = $.parseJSON(jsonText);

// cross-env NODE_ENV=development
// const apiUrlReal = {
// 	DEVELOP: 'http://10.10.15.51',
// 	TEST: 'http://10.10.15.83',
// 	AWS: '',
// 	PRODUCTION: '',
// };
// module.exports = {
// 	originUri: apiUrlReal,
//   apiHostUri: apiUrlReal + '/api',
// 	tokenUri: apiUrlReal + '/token',
// 	apiUrlReal: apiUrlReal,
// };


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
