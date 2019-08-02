import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchUtil from '../searchUtil';
import { groupAchieveAction } from './groupAchieveReducer';
import GroupSearch from '../../../../components/HighAnalysis/Achievement/GroupAchieve/GroupSearch';

class GroupAchieve extends Component {

  static propTypes = {
    topStringify: PropTypes.string,
    history: PropTypes.func,
    location: PropTypes.func,
  }

  componentDidMount(){
    // 若是上级页面下钻进入 => search中的area与之前记录有变化。
    const { topStringify, location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('area');
    if (topStringify && infoStr !== topStringify) {
      this.queryCharts(search);
    }
  }

  componentWillReceiveProps(nextProps){ // search中的area字符串对比, 不同 => 解析+请求图表数据.
    const nextLocation = nextProps.location;
    const nextSearch = nextLocation.search || '';
    const { topStringify } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('area');
    if (infoStr !== topStringify) {
      this.queryCharts(nextSearch);
    }
  }

  queryCharts = (search) => {
    console.log(search);// todo 将对应的JSON.stringify信息存入reducer;
    console.log('发起请求的集合');// todo 发起请求图表
  }

  searchCharts = () => { // 查询按钮
    // 将查询参数进行JSON.stringify后直接存入location.search;
    // history.push('...newParams');
  }

  toAreaPage = () => { // 携带选中信息进入区域页面
    // 页面路径参数结构/{pathKey}?pages=['group','area']&group={a:1,b:2}&area={c:1,d:4}&station={e:2,ff:12};
    // 其中group, area, station后面的选中内容为JSON.stringify后的字符串
    const { location, history } = this.props;
    const { search } = location || {};
    const areaInfo = {a: Math.random(), b: Math.random};
    // 新的search: pages参数不变, area参数变为选中项内容集合
    const newSearch = searchUtil(search).replace({ area: JSON.stringify(areaInfo) }).stringify(); // 删除search中页面的记录信息
    history.push(`/analysis/achievement/analysis/area?${newSearch}`);
  }

  render() {
    return (
      <div style={{width: '100%'}}>
        <GroupSearch />
        <button onClick={this.toAreaPage}>
          查看区域信息
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveGroup.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  testGroup: payload => dispatch({type: groupAchieveAction.testGroup, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAchieve);