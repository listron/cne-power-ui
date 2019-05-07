import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import Footer from '../../../components/Common/Footer';
import { ticketAction } from './ticketAction';
import styles from './ticket.scss';
import DefectList from './Defect/DefectList/DefectList';
// import DefectDetail from './Defect/DefectDetail/DefectDetail';
import DefectCreate from './Defect/DefectCreate/DefectCreate';
import InspectList from './Inspect/InspectList/InspectList';
import InspectDetail from './Inspect/InspectDetail/InspectDetail';
import InspectCreate from './Inspect/InspectCreate/InspectCreate';
import InspectOrbit from './Inspect/InspectOrbit/InspectOrbit';
import InspectRecord from './Inspect/InspectRecord/InspectRecord';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';

import WorkOrder from './WorkOrder/WorkOrder';

const TabPane = Tabs.TabPane;

class Ticket extends Component {
  static propTypes = {
    container: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
    clearDefectState: PropTypes.func,
    clearInspectState: PropTypes.func,
    getDefectList: PropTypes.func,
    getDefectIdList: PropTypes.func,
    getInspectList: PropTypes.func,
    getInspectIdList: PropTypes.func,
    history: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      tab: "defect",
    };
  }

  componentDidMount() { }

  componentWillUnmount() {
    this.props.clearDefectState();
    this.props.clearInspectState();
    this.props.onChangeShowContainer({ container: 'list' });
  }

  onChangeTab = (tab) => {
    this.setState({ tab: tab });
    this.props.onChangeShowContainer({ container: 'list' });
    if (tab === "inspect") {
      this.props.clearDefectState();//清除缺陷状态
      var params = {
        stationType: '2',
        stationCodes: '',
        timeInterval: '0',
        status: '5',
        pageNum: 1,
        pageSize: 10,
        sort: '',
        createTimeStart: '',
        createTimeEnd: '',
        deviceTypeCode: '',
      }
      this.props.getInspectList(params);//获取巡检列表
      this.props.getInspectIdList(params);
    }
    if (tab === 'defect') {
      this.props.clearInspectState();//清除巡检状态
      var params = {
        stationType: '',
        stationCodes: [],
        defectSource: [],
        defectLevel: [],
        status: '',
        pageNum: 1,
        pageSize: 10,
        createTimeStart: '',
        createTimeEnd: '',
        deviceTypeCode: [],
        defectTypeCode: [],
        sortField: 'create_time',
        sortMethod: 'desc ',
        handleUser: '',      //处理人
      }
      this.props.getDefectList(params);//获取缺陷列表
      this.props.getDefectIdList(params); // 获取缺陷ID
    }
  }

  prevChange = (e) => {
    this.props.onChangeShowContainer({ container: e.pageName });
  }

  render() {
    const { container, onChangeShowContainer, defectId, pageSize, pageNum, defectIdList } = this.props;
    const { tab } = this.state;
    return (
      <div className={styles.ticketBox}>
        <CommonBreadcrumb breadData={[{ name: '工单列表' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.ticket}>
          {container === 'list' &&
            <Tabs activeKey={tab} onChange={this.onChangeTab} type="card">
              <TabPane tab="缺陷" key="defect">
                <DefectList showTab={tab} onChangeShowContainer={onChangeShowContainer} />
              </TabPane>
              <TabPane tab="巡检" key="inspect">
                <InspectList showTab={tab} onChangeShowContainer={onChangeShowContainer} />
              </TabPane>
            </Tabs>
          }

          {tab === 'defect' && container === 'detail' && defectId && defectIdList &&
            <WorkOrder
              defectId={defectId}
              otherFrom={false}
              pageName={'list'}
              onChange={this.prevChange}
              showPage={true}
              defectIdList={defectIdList} />}
          {tab === 'defect' && container === 'create' && <DefectCreate {...this.props} />}
          {tab === 'defect' && container === 'edit' && <DefectCreate {...this.props} editDefect={true} />}

          {tab === 'inspect' && container === 'detail' && <InspectDetail {...this.props} />}
          {tab === 'inspect' && container === 'inspectOrbit' && <InspectOrbit {...this.props} />}
          {tab === 'inspect' && container === 'inspectRecord' && <InspectRecord {...this.props} />}
          {tab === 'inspect' && container === 'create' && <InspectCreate {...this.props} />}
          {tab === 'inspect' && container === 'edit' && <InspectCreate {...this.props} />}
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.operation.ticket.toJS(),
    defectId: state.operation.defect.get('defectId'),
    pageNum: state.operation.defect.get('pageNum'),
    pageSize: state.operation.defect.get('pageSize'),
    defectDetail: state.operation.defect.get('defectDetail').toJS(),
    defectIdList: state.operation.defect.get('defectIdList').toJS()
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeShowContainer: payload => dispatch({ type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA, payload }),
  clearDefectState: payload => dispatch({ type: ticketAction.CLEAR_DEFECT_STATE_SAGA, payload }),
  clearInspectState: payload => dispatch({ type: ticketAction.CLEAR_INSPECT_STATE_SAGA, payload }),
  getDefectList: payload => dispatch({ type: ticketAction.GET_DEFECT_LIST_SAGA, payload }),
  getDefectIdList: payload => dispatch({ type: ticketAction.GET_DEFECT_ID_LIST_SAGA, payload }),
  getInspectList: payload => dispatch({ type: ticketAction.GET_INSPECT_LIST_SAGA, payload }),
  getInspectIdList: payload => dispatch({ type: ticketAction.GET_INSPECT_ID_LIST_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);