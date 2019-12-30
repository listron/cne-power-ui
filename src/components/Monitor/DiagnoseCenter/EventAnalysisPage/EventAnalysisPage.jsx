import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Switch, Popconfirm, Spin } from 'antd';
import styles from './eventAnalysis.scss';

class EventAnalysisPage extends PureComponent {

  static propTypes = {
    // theme: PropTypes.string,
    // planDetailHandleLoading: PropTypes.bool,
    // planDetail: PropTypes.object,
    // setWorkPlanStatus: PropTypes.func,
    // getStationDeviceTypes: PropTypes.func,
    // changeStore: PropTypes.func,
  };

  backList = () => this.props.changeStore({ planPageKey: 'list', planDetail: {} })

  render(){
    const { pageKey } = this.props;
    return (
      <section className={styles.eventAnalysis}>
        <h3 className={styles.detailTop}>
          <span>诊断分析</span>
          <span className={styles.topHandle}>
            <Button onClick={this.showMore}>更多数据</Button>
            <Icon onClick={this.backList} type="arrow-left" className={styles.backIcon} />
          </span>
        </h3>
        <div className={styles.analysisContent}>
          
        </div>
      </section>
    );
  }
}

export default EventAnalysisPage;
