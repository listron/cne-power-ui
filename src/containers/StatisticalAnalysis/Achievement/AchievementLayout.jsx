import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { parse, stringify } from 'qs';
import GroupAchieve from './GroupAchieve/GroupAchieve';
import AreaAchieve from './AreaAchieve/AreaAchieve';
import StationAchieve from './StationAchieve/StationAchieve';

// 暂时3个页面 集团 => 区域 => 电站(电站内三个子滚动页面)
// 菜单点击目录, 页面内tabs一直增加新页面, 新页面参数为默认参数
// 页面内下钻, 页面呢tabs一直增加新页面, 新页面参数为下钻前选中参数
// 关闭tab页面, 关闭的tab页从路径内删除.
// 路径参数(pathKey)?group=groupParams&area=areaParams&station=stationParams结构用于构造。
// 封装函数1: 获取当前路径并添加某页面 => 同时pathKey变化用于切换当前页面, 返回新路径
// 封装函数2: 移除当前路径集合中的某个指定页面 => 同时可以选择制定切换当前路径。
// 封装函数3: 比较并处理两个路径 => 确定是路径的变化规则
// 封装函数4: 取出路径中的信息 => 得到active页面及基础的路径解析信息.

class AchievementLayout extends Component {

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  }

  constructor(props){
    super(props);
    const { pathKey } = props.match.params || {};
    const { group, area, station } = this.getSearchInfo();// search路径携带参数格式{group=xxx,area=xxx,station=xxx}
    this.state = {
      pathKey,
      group,
      area,
      station,
    };
    this.tabs = [{
      name: '集团绩效分析',
      key: 'group',
    }, {
      name: '区域绩效分析',
      key: 'area',
    }, {
      name: '电站能效分析',
      key: 'station',
    }];
  }

  componentDidMount(){
    // tab存在标识: group全部区域, area区域, station电站, 
    // path = (activeKey)?group={stations:[1,2,3,4],mode:[1,2,3,4]}&station={area:[1,2,3],devices:[2,3,4]}&area={station:[1,2,3,4]}
  }

  componentDidUpdate(preProps){
    // 1. 左侧目录切换(target的search为空) - 1.1 有数据的页面点击左侧, 1.2默认页面点击 
    // 2. 页面下钻 - 携带数据进入下一页面 => 此处不必处理
    // 3. 页面关闭 -  切掉当前search参数, 根据情况调整当前激活页是否变化. => 此处不必处理.
    // 4. tab切换 - 变化当前active - page, search不变。
    // const { pathKey } = props.match.params || {};
    console.log('update')
    const pathInfo = this.getSearchInfo(); // 拿到最新的路径
    const pathChange = this.tabs.find(e => !(this.state[e.key]) && !!(pathInfo[e.key])); // 有新的模块
    if (pathChange) { // 新开某个模块
      this.addNewPage(pathChange, pathInfo);
    }
  }

  getSearchInfo = () => { // 1. 暂存，该函数不要动。
    const { search } = this.props.location;
    const searchInfo = (search.indexOf('?') === 0 && search.substring(1)) || '';
    const pathInfo = parse(searchInfo); // 格式{group=xxx,area=xxx,station=xxx}
    return pathInfo; // 解析当前search参数
  }

  addNewPage = (pathChange, pathInfo) => { // 在原页面基础 + 新开页面
    const { key } = pathChange;
    this.setState({
      pathKey: key,
      [key]: pathInfo[key],
    });
  }

  tabChange = (key) => { // 2. 暂存, tab实现, 携带原search字符切换页面。
    const { search } = this.props.location;
    this.props.history.push(`/statistical/achievement/analysis/${key}${search}`);
  }

  closeTab = (key) => {
    const { pathKey, group, area, station } = this.state;
    const searchInfo = {group, area, station};
    delete searchInfo[key];
    const newSearch = stringify(searchInfo);
    if (key !== pathKey) { // 非关闭当前页 => search删除即可
      this.props.history.push(`/statistical/achievement/analysis/${pathKey}?${newSearch}`);
    } else { // 关闭当前页, 寻找上一级作为默认页面
      const nextPathInfo = [...this.tabs].reverse.find((e, i, tabs) => (i > 0) && tabs[i - 1].key === key) || {};
      this.props.history.push(`/statistical/achievement/analysis/${nextPathInfo.key}?${newSearch}`);
    }
  }

  render() {
    const { match, history } = this.props;
    const { pathKey } = match.params || {};
    // 取出当前的路径与激活页面
    return (
      <div>
        <div>
          <h3>tab区域</h3>
          {this.tabs.map(e => (
            this.state[e.key] ? <div style={{background: 'lightBlue', marginBottom: '20px'}} key={e.key}>
              <button onClick={() => this.tabChange(e.key)}>{e.name}</button>
              <button onClick={() => this.closeTab(e.key)}>X</button>
            </div> : null
          ))}
        </div>
        <div>
          <h3>这里应该就是内容区域</h3>
          <GroupAchieve show={pathKey === 'group'} history={history} />
          <AreaAchieve show={pathKey === 'area'} history={history} />
          <StationAchieve show={pathKey === 'station'} history={history} />
        </div>
      </div>
    );
  }
}

export default AchievementLayout;


