import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import { scoreAction } from "./scoreAction";
import { commonAction } from '../../../alphaRedux/commonAction';
import styles from "./score.scss";
import PropTypes from 'prop-types';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import Footer from '../../../../components/Common/Footer';
const TabPane = Tabs.TabPane;

class Score extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    getSeriesData: PropTypes.func,
    getCleaningData: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
    listQueryParams: PropTypes.object,
    resetStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'warn',//默认显示低效组串
    }
  }

  componentDidMount() {
    const { enterpriseId, getStationOfEnterprise } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
  }

  componentWillUnmount() {
    this.props.resetStore(); // 重置数据
  }


  render() {
    const { enterpriseId, showPage } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.warningBox}>
        <CommonBreadcrumb breadData={[{ name: '预警配置' }]} style={{ paddingLeft: '38px', background: '#fff' }} />
        <div className={styles.warningContainer}>
          <div className={styles.warningContent}>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.system.warning.toJS(),
    stations: state.common.get('stations').toJS(),
  });
}


const mapDispatchToProps = (dispatch) => ({
  
  
});

export default connect(mapStateToProps, mapDispatchToProps)(Score)