import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {message} from 'antd';
import styles from './defectDetail.scss';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import DefectDetailForm from '../../../../../components/Operation/Ticket/Defect/DefectDetailForm/DefectDetailForm';
// import CommonBreadcrumb from '../../../../../components/Common/CommonBreadcrumb';
// import Footer from '../../../../../components/Common/Footer';

class DefectDetail extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    defectId: PropTypes.string,
    defectList: PropTypes.object,
    defectIdList: PropTypes.object,
    defectDetail: PropTypes.object,
    commonList: PropTypes.object,
    getDefectDetail: PropTypes.func,
    getCommonList: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    onSend: PropTypes.func,
    onClose: PropTypes.func,
    onReject: PropTypes.func,
    onHandle: PropTypes.func,
    onCheck: PropTypes.func,
    changeDefectStore: PropTypes.func,
    location: PropTypes.object,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let pathname, defectId;
    if(this.props.location) {
      pathname = this.props.location.pathname;
      defectId = pathname.split('/')[4];
    }
    const realDefectId = this.props.defectId || defectId;
    if(realDefectId) {
      this.props.getDefectDetail({
        defectId: realDefectId
      });
      this.props.getCommonList({
        languageType: '1'
      });
    }  
    
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.defectId && nextProps.defectId !== this.props.defectId) {
      this.props.getDefectDetail({
        defectId: nextProps.defectId
      });
    }
  }

  onPrev = () => {
    const { defectIdList, defectId } = this.props;
    let index = defectIdList.findIndex(item => {
      return item === defectId
    });
    if(index !== -1) {
      if(index !== 0) {
        this.props.changeDefectStore({
          defectId: defectIdList.get(index-1)}
        );
      } else {
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是第一条');
      }
    }
  }

  onNext = () => {
    const { defectIdList, defectId } = this.props;
    let index = defectIdList.findIndex(item => {
      return item === defectId
    });
    if(index !== -1) {
      if(index !== defectIdList.size - 1) {
        this.props.changeDefectStore({
          defectId: defectIdList.get(index+1)}
        );
      } else {
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        
        message.info('已经是最后一条');
      }
    }
  }

  onCloseDefectDetail = () => {
    this.props.onChangeShowContainer({container: 'list'});
  }

  render() {
    let pathname, defectId;
    if(this.props.location) {
      pathname = this.props.location.pathname;
      defectId = pathname.split('/')[4];
    }
    //先放这，此页面没有徒步导航和尾部
   // <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
   //  <Footer />
    //  const breadCrumbData = {
    //   breadData: [
    //     {
    //       name: '工单列表',
    //     }
    //   ],
    // };
    return (
      // <div className={styles.detailWrapBox}>     
       <DefectDetailForm {...this.props}
        onCloseDefectDetail={this.onCloseDefectDetail}
        isFromAlarm={!!defectId}
        onPrev={this.onPrev}
        onNext={this.onNext} />          
        // </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  defectIdList: state.operation.defect.get('defectIdList'),
  loading: state.operation.defect.get('loading'),
  error: state.operation.defect.get('error'),
  defectDetail: state.operation.defect.get('defectDetail'),
  defectId: state.operation.defect.get('defectId'),
  commonList: state.operation.defect.get('commonList'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDefectStore: payload => dispatch({type:ticketAction.CHANGE_DEFECT_STORE_SAGA, payload}),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),
  getCommonList: payload => dispatch({ type: ticketAction.GET_DEFECT_LANGUAGE_SAGA, payload }),
  onSend: payload => dispatch({ type: ticketAction.SEND_DEFECT_SAGA, payload }),
  onReject: payload => dispatch({ type: ticketAction.REJECT_DEFECT_SAGA, payload }),
  onClose: payload => dispatch({ type: ticketAction.CLOSE_DEFECT_SAGA, payload }),
  onHandle: payload => dispatch({ type: ticketAction.HANDLE_DEFECT_SAGA, payload }),
  onCheck: payload => dispatch({ type: ticketAction.CHECK_DEFECT_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);