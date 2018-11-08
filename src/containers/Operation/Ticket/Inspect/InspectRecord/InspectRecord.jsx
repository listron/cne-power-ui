import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { commonAction } from '../../../../alphaRedux/commonAction';
import { ticketAction } from '../../ticketAction';
import { Icon } from 'antd';
import styles from './inspectRecord.scss';
import WarningTip from '../../../../../components/Common/WarningTip';
import InspectRecordFilter from '../../../../../components/Operation/Ticket/Inspect/InspectRecord/InspectRecordFilter';
import InspectRecordTable from '../../../../../components/Operation/Ticket/Inspect/InspectRecord/InspectRecordTable';
class inspectRecord extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func, 
    stations: PropTypes.object,
    getStations: PropTypes.func,
    showContainer: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      editDataGet: false,
      showWarningTip: false,
    }
  }

  componentDidMount() {
  }

  onCloseInspectCreate = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!'
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.onChangeShowContainer({ container: 'detail' });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    const{inspectDeviceType}=this.props;
    // console.log(inspectDeviceType);
    return (
      <div className={styles.inspectCreate}>
        {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>巡检记录</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCloseInspectCreate} />
        </div>
        <div className={styles.createContent}>
          <InspectRecordFilter {...this.props}  />
          <InspectRecordTable {...this.props}  />
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
...state.operation.inspect.toJS()
})
const mapDispatchToProps = (dispatch) => ({
  onChangeFilter: payload => dispatch({type:ticketAction.CHANGE_INSPECT_STORE_SAGA, payload}),
  getInspectDetailRecord: payload => dispatch({ type: ticketAction.getInspectDetailRecord, payload}),
  // getStationDeviceTypes: params => dispatch({
  //   type: commonAction.getStationDeviceTypes,
  //   payload: {
  //     params, 
  //     deviceTypeAction: ticketAction.GET_INSPECT_FETCH_SUCCESS,
  //     resultName: 'stationDeviceTypes'
  //   }
  // }),
})
export default connect(mapStateToProps, mapDispatchToProps)(inspectRecord);