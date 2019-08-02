import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import searchUtil from './searchUtil';
import { achieveAction } from './achieveReducer';
import GroupAchieve from './GroupAchieve/GroupAchieve';
import AreaAchieve from './AreaAchieve/AreaAchieve';
import StationAchieve from './StationAchieve/StationAchieve';
import styles from './layout.scss';

// 页面路径参数结构/{pathKey}?pages=['group','area']&group={a:1,b:2}&area={c:1,d:4}&station={e:2,ff:12};
class AchievementLayout extends Component {

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    areaStation: PropTypes.array,
    quotaInfo: PropTypes.array,
    getAreaStation: PropTypes.func,
    getQuotaInfo: PropTypes.func,
  }

  constructor(props){
    super(props);
    const { search } = props.location;
    const { pages } = searchUtil(search).parse();
    const { pathKey } = props.match.params || {};
    this.tabs = ['group', 'area', 'station'];
    this.tabNames = ['集团绩效分析', '区域绩效分析', '电站效能分析'];
    this.state = {
      pages: pages ? pages.split('_') : [pathKey], // 页面内开启的页面 => tab数量
    };
  }

  componentDidMount(){
    // 预请求用户区域-电站信息, 指标信息
    this.props.getQuotaInfo();
    this.props.getAreaStation();
  }

  componentWillReceiveProps(nextProps){
    const { pages } = this.state;
    const { match, location, history } = this.props;
    const { search } = location; // 上次的search
    const { pathKey } = match.params || {};

    const nextMatchParam = nextProps.match.params || {};
    const nextLocation = nextProps.location;
    const nextSearch = nextLocation.search;
    const nexPathKey = nextMatchParam.pathKey;
    const pageExist = pages.includes(nexPathKey); // 新页面
    const pageChange = pathKey !== nexPathKey; // 激活页变化
    if(pageChange && !pageExist && !nextSearch){ // 目录新开一个未开启页面: 切换至新页面, search信息中只添加入新的pages
      pages.push(nexPathKey);
      this.setState({pages});
      const searchResult = searchUtil(search).add({pages: pages.join('_')}).stringify();
      history.push(`${nextLocation.pathname}?${searchResult}`);
    } else if (pageChange && pageExist && !nextSearch) {// 2. 目录处点击已开启页面 => 切换至页面, search信息不变
      history.push(`${nextLocation.pathname}${search}`);
    }
  }

  tabChange = (key) => { // 暂存, tab实现, 携带原search字符切换页面。
    const { search } = this.props.location;
    this.props.history.push(`/analysis/achievement/analysis/${key}${search}`);
  }

  closeTab = (key) => {
    const { location, match } = this.props;
    const { pages } = this.state;
    const { search } = location || {};
    const { pathKey } = match.params || {}; // 当前激活页
    const newPage = pages.filter(e => e !== key);
    this.setState({ pages: newPage }); // pages删除关闭项;
    const newSearch = searchUtil(search).delete([key]).replace({ pages: newPage.join('_') }).stringify(); // 删除search中页面的记录信息
    let newPathKey = pathKey;
    if (pathKey === key) { // 关闭的是当前页
      const reverseArr = this.tabs.filter(e => pages.includes(e)).reverse();
      newPathKey = reverseArr.find((e, i, tabs) => (i > 0 && tabs[i - 1] === key));
    }
    this.props.history.push(`/analysis/achievement/analysis/${newPathKey}?${newSearch}`);
  }

  render() {
    const { match, areaStation, quotaInfo } = this.props;
    const { pathKey } = match.params;
    const { pages } = this.state;
    return (
      <div className={styles.layout}>
        <div className={styles.tabs}>
          {this.tabs.map((e, i) => (
            <div
              key={e}
              className={styles.eachTab}
              style={{display: pages.includes(e) ? 'block' : 'none'}}
            >
              <span
                className={`${styles.button} ${pathKey === e ? styles.actievButton : ''}`}
                onClick={() => this.tabChange(e)}
              >{this.tabNames[i]}</span>
              <Icon className={styles.close} type="close" onClick={() => this.closeTab(e)} />
            </div>
          ))}
        </div>
        <div className={styles.contents}>
          <h3>这里应该就是内容区域</h3>
          <GroupAchieve active={pathKey === 'group'} history={history} areaStation={areaStation} quotaInfo={quotaInfo} />
          <AreaAchieve active={pathKey === 'area'} history={history} areaStation={areaStation} quotaInfo={quotaInfo} />
          <StationAchieve active={pathKey === 'station'} history={history} areaStation={areaStation} quotaInfo={quotaInfo} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveLayout.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  // resetStore: () => dispatch({type: achieveAction.resetStore}),
  getAreaStation: payload => dispatch({type: achieveAction.getAreaStation, payload}),
  getQuotaInfo: payload => dispatch({type: achieveAction.getQuotaInfo, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AchievementLayout);


