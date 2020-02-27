import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InspectCreateForm from '../../../../../components/Operation/Ticket/Inspect/InspectCreateForm/InspectCreateForm';
import { commonAction } from '../../../../alphaRedux/commonAction';
import { ticketAction } from '../../ticketAction';
import { Icon } from 'antd';
import styles from './inspectCreate.scss';
import WarningTip from '../../../../../components/Common/WarningTip';
class InspectCreate extends Component {
  static propTypes = {
    deviceTypeItems: PropTypes.object,
    onChangeShowContainer: PropTypes.func,
    createInspect: PropTypes.func,
    stations: PropTypes.object,
    getStations: PropTypes.func,
    showContainer: PropTypes.string,
    changeInspectStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      editDataGet: false,
      showWarningTip: false,
    };
  }

  componentDidMount() {
  }

  onCloseInspectCreate = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!',
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
    this.props.onChangeShowContainer({ container: 'list' });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.inspectCreate}>
        {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>新建巡检</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onCloseInspectCreate} />
        </div>
        <div className={styles.createContent}>
          <InspectCreateForm {...this.props} />
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  container: state.operation.ticket.get('container'),
  stations: state.common.get('stations'),
  error: state.operation.inspect.get('error'),
  deviceTypeItems: state.operation.inspect.get('deviceTypeItems'),
});
const mapDispatchToProps = (dispatch) => ({
  createInspect: payload => dispatch({ type: ticketAction.CREATE_INSPECT_SAGA, payload }),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  onChangeCommonStore: payload => dispatch({ type: commonAction.changeCommonStore, payload }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: ticketAction.GET_INSPECT_FETCH_SUCCESS,
      resultName: 'deviceTypeItems',
    },
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(InspectCreate);
