import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import path from '../../../constants/path';
import CommonPagination from '../../../components/Common/CommonPagination';
import WarningTip from '../../../components/Common/WarningTip';
import UploadModal from './UploadModal';
import { handleRight } from '@utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';
const { originUri } = path.basePaths;
const { operation } = path.APISubPaths;

class CaseHandle extends React.Component {
  static propTypes = {
    changeCasePartStore: PropTypes.func,
    selectedRowData: PropTypes.array,
    deleteCasePart: PropTypes.func,
    casePartTableData: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    total: PropTypes.number,
    stations: PropTypes.array,
    deviceModeData: PropTypes.array,
    questionTypeList: PropTypes.array,
    userData: PropTypes.array,
    getQuestionList: PropTypes.func,
    getDeviceMode: PropTypes.func,
    getCasePartList: PropTypes.func,
    queryUseName: PropTypes.func,
    faultDescription: PropTypes.string,
    userName: PropTypes.string,
    userId: PropTypes.number,
    questionTypeCodes: PropTypes.array,
    deviceModeList: PropTypes.array,
    stationCodes: PropTypes.array,
    orderFiled: PropTypes.string,
    orderType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '确定要删除解决方案吗?',
      showUpload: false,

    };
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    const { selectedRowData, deleteCasePart } = this.props;
    const caseBaseIds = selectedRowData.map(e => (e.caseBaseId));
    deleteCasePart({
      caseBaseIds,
    });


  }
  showAddPage = () => {
    this.props.changeCasePartStore({
      caseDetail: {},
      uploadUrlArr: [],
      showPage: 'add',
    });
  }

  uploadFile = () => {
    this.setState({
      showUpload: true,
    });
  }
  deleteCasePart = () => {
    // const { selectedRowData, deleteCasePart } = this.props;
    // const caseBaseIds = selectedRowData.map(e => (e.caseBaseId));
    // deleteCasePart({
    //   caseBaseIds,
    // });
    this.setState({
      showWarningTip: true,
    });
  }
  cancelModal = () => {
    this.setState({
      showUpload: false,
    });
  }
  onPaginationChange = ({ pageSize, currentPage }) => {
    const { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, orderFiled, orderType, getCasePartList } = this.props;
    const queryParams = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, orderFiled, orderType };
    getCasePartList({
      ...queryParams,
      pageNum: currentPage,
      pageSize,
    });
    this.props.changeCasePartStore({
      selectedRowKeys: [],
    });
  }

  render() {
    const { showWarningTip, warningTipText, showUpload } = this.state;
    const { casePartTableData, selectedRowKeys, pageSize, pageNum, total } = this.props;
    const downloadTemplet = `${originUri}${operation.downCaseTemplate}`;//当前没有链接
    const caseHandleRight = handleRight('operation_case_operate');//操作权限
    return (
      <div className={styles.caseHandle}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        {caseHandleRight ? <div className={styles.leftHandler}>
          <CneButton lengthMode="short" className={styles.addButton} onClick={this.showAddPage}>
            <div className={styles.icon}>
                <span className={'iconfont icon-newbuilt'} />
            </div> 添加
          </CneButton>
          <CneButton lengthMode="short" className={styles.alldel} disabled={casePartTableData.length === 0 || selectedRowKeys.length === 0} onClick={this.deleteCasePart} > 批量删除 </CneButton>
          <CneButton lengthMode="short" className={styles.intoFile} onClick={this.uploadFile}> 批量导入 </CneButton>
          {showUpload && <UploadModal {...this.props} showModal={showUpload} cancelModal={this.cancelModal} />}
          <CneButton
            lengthMode="short" 
            className={styles.downloadStyle}
            href={downloadTemplet}
            download={downloadTemplet}
            target="_blank"
          >模板下载
          </CneButton>

        </div> : <div />}
        <CommonPagination className={styles.pagination} pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />

      </div>
    );
  }
}
export default (CaseHandle);
