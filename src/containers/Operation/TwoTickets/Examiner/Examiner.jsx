import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WorkExaminer from '../../../../components/Operation/TwoTickets/Examiner/WorkExaminer';
import HandleExaminer from '../../../../components/Operation/TwoTickets/Examiner/HandleExaminer';
import DetailModal from '../../../../components/Operation/TwoTickets/Examiner/DetailModal';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import { examinerAction } from './examinerReducer';
import styles from './examiner.scss';
// import { commonAction } from '../../../alphaRedux/commonAction';

class Examiner extends Component {

  static propTypes = {
    editModalShow: PropTypes.bool,
    detailModalShow: PropTypes.bool,
    templateType: PropTypes.number,
    tableParams: PropTypes.object,
    getSettingList: PropTypes.func,
    getSettableNodes: PropTypes.func,
    changeStore: PropTypes.func,
    resetStore: PropTypes.func,
  }
  
  componentDidMount(){
    const { tableParams, getSettingList, getSettableNodes } = this.props;
    getSettingList({ ...tableParams });
    getSettableNodes();
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  sideTransformChange = (sideTransform) => {
    this.setState({ sideTransform });
  }

  tabChange = (e) => { // 工作票 < = > 操作票
    const { innerHTML } = e.target;
    const { changeStore, getSettableNodes, getSettingList } = this.props;
    const tabInfo = {
      '工作票': 1,
      '操作票': 2,
    };
    const newTableParams = {
      selectedStation: [],
      sortField: '', //station_name state, create_time
      sortMethod: '', // 排序规则 "asc"：正序  "desc"：倒序
      pageNum: 1,
      pageSize: 10,
    }
    const tabName = tabInfo[innerHTML];
    if (tabName) {
      changeStore({
        templateType: tabInfo[innerHTML],
        tableParams: { ...newTableParams },
      });
      getSettableNodes();
      getSettingList({ ...newTableParams });
    }
  }
  
  render(){
    const { templateType, editModalShow, detailModalShow } = this.props;
    return (
      <div className={styles.examiner}>
        <CommonBreadcrumb  breadData={[{name: '审核人设置'}]} style={{ marginLeft: '38px' }} />
        <div className={styles.examinerList}>
          <div className={styles.listContent}>
            <div className={styles.tabs} onClick={this.tabChange}>
              <span className={templateType === 1 ? styles.active : styles.inactive}>工作票</span>
              <span className={templateType === 2 ? styles.active : styles.inactive}>操作票</span>
            </div>
            {templateType === 1 && <WorkExaminer {...this.props} />}
            {templateType === 2 && <HandleExaminer {...this.props} />}
          </div>
          {/* editModalShow && <EditModal {...this.props} /> */}
          {detailModalShow && <DetailModal {...this.props} />}
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.examiner.toJS(),
  stations: state.common.get('stations').toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: examinerAction.resetStore }),
  changeStore: payload => dispatch({ type: examinerAction.changeStore, payload }),
  getSettingList: payload => dispatch({ type: examinerAction.getSettingList, payload }),
  getSettedInfo: payload => dispatch({ type: examinerAction.getSettedInfo, payload }),
  getSettableNodes: () => dispatch({ type: examinerAction.getSettableNodes }),
  // getWarehouses: () => dispatch({ type: warehouseManageAction.getWarehouses }),
  // getManufactures: () => dispatch({ type: warehouseManageAction.getManufactures }),
  // getModes: payload => dispatch({ type: warehouseManageAction.getModes, payload }),
  // getWarehouseManageList: payload => dispatch({ type: warehouseManageAction.getWarehouseManageList, payload }),
  // deleteWarehouseMaterial: payload => dispatch({ type: warehouseManageAction.deleteWarehouseMaterial, payload }),
  // downLoadFile: payload => dispatch({
  //   type: commonAction.downLoadFile,
  //   payload: {
  //     ...payload,
  //     actionName: warehouseManageAction.changeStore
  //   }
  // }),
  // setStockMax: payload => dispatch({ type: warehouseManageAction.setStockMax, payload }),
  // importStockFile: payload => dispatch({ type: warehouseManageAction.importStockFile, payload }),
  // getGoodsList: payload => dispatch({ type: warehouseManageAction.getGoodsList, payload }),
  // addNewGood: payload => dispatch({ type: warehouseManageAction.addNewGood, payload }),
  // getAssetslist: payload => dispatch({ type: warehouseManageAction.getAssetslist, payload }),
  // getAssetsManufacture: payload => dispatch({ type: warehouseManageAction.getAssetsManufacture, payload }),
  // insertWarehouse: payload => dispatch({ type: warehouseManageAction.insertWarehouse, payload }),
  // getMaterialDetailsList: payload => dispatch({ type: warehouseManageAction.getMaterialDetailsList, payload }),
  // takeoutWarehouseMaterial: payload => dispatch({ type: warehouseManageAction.takeoutWarehouseMaterial, payload }),
  // getReserveDetail: payload => dispatch({ type: warehouseManageAction.getReserveDetail, payload }),
  // getReserveList: payload => dispatch({ type: warehouseManageAction.getReserveList, payload }),
  // deleteReserveInfo: payload => dispatch({ type: warehouseManageAction.deleteReserveInfo, payload }),
  // recallReserveInfo: payload => dispatch({ type: warehouseManageAction.recallReserveInfo, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Examiner);
