import React from 'react';
import PropTypes from 'prop-types';
import styles from './inspectDetail.scss';
import { Button } from 'antd';
import InspectTimeLine from './InspectTimeLine';

class InspectProcess extends React.Component {
  static propTypes = {
    setInspectCheck: PropTypes.func,
    inspectFlows: PropTypes.array,
    inspectDetail: PropTypes.object,
    inspectStatus: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  checkInspect = () => {
    const { setInspectCheck, inspectDetail } = this.props;
    const { inspectId } = inspectDetail;
    setInspectCheck({
      inspectId,
    });

  }
  render() {
    const { inspectFlows, inspectDetail } = this.props;
    const { inspectStatus, deviceTypeNames } = inspectDetail;

    return (
      <div className={styles.rightContent}>
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
