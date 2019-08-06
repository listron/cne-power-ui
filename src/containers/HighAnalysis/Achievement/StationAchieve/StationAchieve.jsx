import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchUtil from '../../../../utils/searchUtil';
import StationSearch from '../../../../components/HighAnalysis/Achievement/StationAchieve/StationSearch';
import AnimationBox from '../../../../components/HighAnalysis/Achievement/StationAchieve/AnimationBox';
import LostAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/LostAnalysis/LostAnalysis';
import { stationAchieveAction } from './stationAchieveReducer';
import styles from './station.scss';

class StationAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
  }

  static propTypes = {
    topStringify: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    changeStore: PropTypes.func,
  }

  componentDidMount(){
    const { topStringify, location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    if (topStringify && infoStr !== topStringify) {
      this.queryCharts(search);
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
    const nextSearch = nextLocation.search || '';
    const { topStringify } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    if (infoStr !== topStringify) {
      this.queryCharts(nextSearch);
    }
  }

  queryCharts = (search) => {
    // console.log(search);// todo 将对应的JSON.stringify信息存入reducer;
    // console.log('发起请求的集合');// todo 发起解析search为json请求后台 => 图表
  }

  searchCharts = () => { // 查询按钮
    // 将查询参数进行JSON.stringify后直接存入location.search;
    // history.push('...newParams');
  }

  // toAreaPage = () => { // 携带选中信息进入区域页面
  //   // 页面路径参数结构/{pathKey}?pages=['group','area']&group={a:1,b:2}&area={c:1,d:4}&station={e:2,ff:12};
  //   // 其中group, area, station后面的选中内容为JSON.stringify后的字符串
  //   const { location, history } = this.props;
  //   const { search } = location || {};
  //   const areaInfo = {a: Math.random(), b: Math.random};
  //   // 新的search: pages参数不变, area参数变为选中项内容集合
  //   const newSearch = searchUtil(search).replace({ area: JSON.stringify(areaInfo) }).stringify(); // 删除search中页面的记录信息
  //   history.push(`/analysis/achievement/analysis/area?${newSearch}`);
  // }

  render() {
    const { active, changeStore } = this.props;
    const modeDevices = [{
      value: 1001123142,
      label: '金风科技',
      children: [{
        value: 'M12011M221M13',
        label: 'SD-13',
        children: [{
          value: 'M12#1',
          label: 'M12#1',
        }],
      }, {
        value: 'M12011M221M11',
        label: 'SD-11',
      }],
    }, {
      value: 10011231445,
      label: '湘电',
      children: [{
        value: 'M35011M221M221',
        label: 'XD-221',
      }, {
        value: 'M35011M221M222',
        label: 'XD-222',
      }],
    }];
    return (
      <div className={styles.stationAchieve} >
        <StationSearch {...this.props} modeDevices={modeDevices} />
        <AnimationBox changeStore={changeStore} active={active}>
          <LostAnalysis {...this.props} active={active === 'lost'} />
          <div
            className={`${styles.eachPage} ${active === 'stop' ? styles.active : styles.inactive}`}
            style={{backgroundColor: 'yellowGreen'}}
          >停机数据</div>
          <div
            className={`${styles.eachPage} ${active === 'curve' ? styles.active : styles.inactive}`}
            style={{backgroundColor: 'gray'}}
          >功率曲线</div>
        </AnimationBox>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStation.toJS(),
  areaStation: state.highAanlysisReducer.achieveLayout.get('areaStation').toJS(),
  quotaInfo: state.highAanlysisReducer.achieveLayout.get('quotaInfo').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: stationAchieveAction.changeStore, payload }),
  getDevices: payload => dispatch({ type: stationAchieveAction.getDevices, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

