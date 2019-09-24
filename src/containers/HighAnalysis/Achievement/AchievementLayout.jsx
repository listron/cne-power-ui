import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import searchUtil from '../../../utils/searchUtil';
import { achieveAction } from './achieveReducer';
import GroupAchieve from './GroupAchieve/GroupAchieve';
import AreaAchieve from './AreaAchieve/AreaAchieve';
import StationAchieve from './StationAchieve/StationAchieve';
import StopStatus from './StopStatus/StopStatus';
import RunAchieve from './RunAchieve/RunAchieve';
import Actuator from './Actuator/Actuator';
import Footer from '../../../components/Common/Footer';
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
    const { search } = props.history.location;
    const { pages } = searchUtil(search).parse();
    const { pathKey } = props.match.params || {};
    this.tabs = ['group', 'area', 'station', 'run', 'stop', 'actuator'];
    this.tabNames = ['集团绩效分析', '区域绩效分析', '电站效能分析', '运行数据分析', '停机状态分析', '执行机构分析'];
    this.state = {
      pages: pages ? pages.split('_').filter(e => !!e) : [pathKey], // 页面内开启的页面 => tab数量
    };
  }

  componentDidMount(){
    // 预请求用户区域-电站信息, 指标信息
    this.props.getAreaStation();
    this.props.getQuotaInfo();
  }

  componentWillReceiveProps(nextProps){
    const { pages } = this.state;
    const { match, history, location } = this.props;
    const { search } = location; // 上次的search
    const { pathKey } = match.params || {};

    const nextMatchParam = nextProps.match.params || {};
    const nextLocation = nextProps.location;
    const nextSearch = nextLocation.search;
    const nexPathKey = nextMatchParam.pathKey;
    const pageExist = pages.includes(nexPathKey); // 新页面
    const pageChange = pathKey !== nexPathKey; // 当前激活页变化 => 1. 新开页面, 2. 页面切换, 3. 关闭页面
    if(pageChange && !pageExist){ // 新开页面
      pages.push(nexPathKey);
      this.setState({ pages }); // 存储页面
      nextSearch ? history.push( // 有指定的目标路径, 目标路径参数继承, pages参数更新
        `${nextLocation.pathname}?${searchUtil(nextSearch).add({pages: pages.join('_')}).stringify()}`
      ) : history.push( // 无目标路径, 新开一个初始页 => pages变化, 其他参数携带。 
        `${nextLocation.pathname}?${searchUtil(search).add({pages: pages.join('_')}).stringify()}`
      );
    } else if (pageChange && pageExist) { // 2. 切换至页面, 3. 关闭页面
      const nextPages = (searchUtil(nextSearch).parse().pages || '').split('_').filter(e => !!e);
      const pageClosed = nextPages.length > 0 ? pages.filter(e => !nextPages.includes(e)) : []; // 查找需要被关闭的页面
      pageClosed.length > 0 && (// 3. 关闭页面 最新的pages替换state的pages,并检查删除被关闭页面的search残余参数
        this.setState({ pages: nextPages }),
        history.push(
          `${nextLocation.pathname}?${searchUtil(search).replace({
            pages: nextPages.join('_'),
          }).delete(pageClosed).stringify()}`
        )
      );
      pageClosed.length === 0 && history.push( // 2. 切换页面，nextSearch不存在为单纯目录切换使用search, nextSearch存在指定跳转
        `${nextLocation.pathname}${nextSearch || search}`
      );
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
    this.props.history.push(`/analysis/achievement/analysis/${newPathKey || newPage[0]}?${newSearch}`);
  }

  render() {
    const { match } = this.props;
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
              {pages.length > 1 && <Icon className={styles.close} type="close" onClick={() => this.closeTab(e)} />}
            </div>
          ))}
        </div>
        <div className={styles.contents}>
          {pathKey === 'group' && <GroupAchieve {...this.props} />}
          {pathKey === 'area' && <AreaAchieve {...this.props} />}
          {pathKey === 'station' && <StationAchieve {...this.props} />}
          {pathKey === 'stop' && <StopStatus {...this.props} />}
          {pathKey === 'run' && <RunAchieve {...this.props} />}
          {pathKey === 'actuator' && <Actuator {...this.props} />}
        </div>
        <Footer />
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
