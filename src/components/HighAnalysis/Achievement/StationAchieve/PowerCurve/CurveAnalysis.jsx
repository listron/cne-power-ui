import React, { Component } from 'react';
import PropTypes from 'prop-types';
import searchUtil from '../../../../../utils/searchUtil';
import styles from './curve.scss';

class CurveAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
  }

  componentDidMount(){
    // const { lostQuota, lostStringify, location } = this.props;
    // const { search } = location;
    // const infoStr = searchUtil(search).getValue('station');
    // const originLoad = infoStr && !lostStringify; // // 初次加载
    // const pageBack = lostStringify && infoStr && infoStr !== lostStringify; // 其他两个页面修改路径信息后返回
    // if (originLoad || pageBack) {
    //   this.queryTypes(infoStr); // 初次加载只重新请求损失电量分解
    //   pageBack && lostQuota && this.queryRank(infoStr, lostQuota);
    //   pageBack && lostQuota && this.queryTrend(infoStr, lostQuota);
    // }
  }

  componentWillReceiveProps(nextProps){
    // const nextLocation = nextProps.location;
    // const nextQuota = nextProps.quotaInfo;
    // const nextQuotaParam = nextProps.lostQuota;
    // const nextSearch = nextLocation.search || '';
    // const { lostStringify, quotaInfo, changeStore } = this.props;
    // const infoStr = searchUtil(nextSearch).getValue('station');
    // if (infoStr && infoStr !== lostStringify && nextQuotaParam) { // 搜索信息有变
    //   changeStore({ lostStringify: infoStr });
    //   this.queryTypes(infoStr);
    //   this.queryRank(infoStr, nextQuotaParam);
    //   this.queryTrend(infoStr, nextQuotaParam);
    // }
    // if (quotaInfo.length === 0 && nextQuota.length > 0) { // 得到指标数据
    //   this.propsQuotaChange(nextQuota, infoStr);
    // }
  }

  render() {
    const { active } = this.props;
    return (
      <div className={`${styles.curveAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <section>
          <h3>
            <span>功率曲线邻比分析</span>
            <span>?</span>
          </h3>
          <div>
            <div selectDevice={this.selectDevice}>chart图</div>
            <div checkDevicesTime={this.checkDevicesTime}>月份选择</div>
            <div selectDevice={this.selectDevice}>chart图两个</div>
          </div>
        </section>
        <section>
          <h3>
            <span>功率曲线环比分析</span>
            <span>i</span>
          </h3>
          <div>
            <div >chart图</div>
            <div checkEachMonths={this.checkEachMonths}>参数选择</div>
            <div>chart图两个</div>
          </div>
        </section>
      </div>
    );
  }
}

export default CurveAnalysis;

