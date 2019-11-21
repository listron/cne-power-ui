import React from 'react';
import PropTypes from 'prop-types';
import styles from './inspectDetail.scss';
import { Button } from 'antd';
import InspectTimeLine from './InspectTimeLine';
import WarningTip from '../../../Common/WarningTip/index';

class InspectProcess extends React.Component {
  static propTypes = {
    setInspectCheck: PropTypes.func,
    inspectFlows: PropTypes.array,
    inspectDetail: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '确认验收此巡检工单吗?',
    };
  }
  checkInspect = () => {
    this.setState({
      showWarningTip: true,
    });
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    const { setInspectCheck, inspectDetail, location, history } = this.props;
    const { inspectId } = inspectDetail;
    setInspectCheck({
      inspectId,
    });
    const { pathname } = location;
    history.push(`${pathname}?page=list&tab=inspect`);
    this.setState({
      showWarningTip: false,
    });


  }
  render() {
    const { inspectFlows, inspectDetail } = this.props;
    const { inspectStatus, deviceTypeNames } = inspectDetail;
    const { showWarningTip, warningTipText } = this.state;

    return (
      <div className={styles.rightContent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}

        {inspectStatus === '2' && <div className={styles.checkinspect}>
          <div className={styles.title}>
            <div className={styles.border}></div>
            <div className={styles.text}>巡检处理</div>
            <div className={styles.border}></div>
          </div>
          <Button className={styles.checkBtn} onClick={this.checkInspect} > 验收</Button>
        </div>}
        <InspectTimeLine processData={inspectFlows} status={inspectStatus} inspectdescribe={deviceTypeNames} />

      </div>
    );
  }
}
export default (InspectProcess);
