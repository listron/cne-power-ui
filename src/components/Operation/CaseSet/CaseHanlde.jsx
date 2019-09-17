import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import path from '../../../constants/path';
import { Button } from 'antd';
import CommonPagination from '../../../components/Common/CommonPagination';
import WarningTip from '../../../components/Common/WarningTip';
import Cookie from 'js-cookie';
import UploadModal from './UploadModal';
const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

class CaseHandle extends React.Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '确认要删除?',
      showUpload: false,

    };
  }
  showAddPage = () => {
    this.props.changeCasePartStore({
      showPage: 'add',
    });
  }

  uploadFile = () => {
    this.setState({
      showUpload: true,
    });
  }
  deleteCasePart = () => {
    const { selectedRowData, deleteCasePart } = this.props;
    const caseBaseIds = selectedRowData.map(e => (e.caseBaseId));
    deleteCasePart({
      caseBaseIds,
    });
  }
  cancelModal = () => {
    this.setState({
      showUpload: false,
    });
  }

  render() {
    const { showWarningTip, warningTipText, showUpload } = this.state;
    const { casePartTableData, selectedRowKeys, pageSize, pageNum, total } = this.props;
    const downloadTemplet = `${APIBasePath}${operation.downCaseTemplate}`;//当前没有链接
    const rightkey = Cookie.get('userRight').includes('operation_case_operate');//操作权限
    return (
      <div className={styles.caseHandle}>
        {rightkey && <div className={styles.leftHandler}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}

          <Button onClick={this.showAddPage} className={styles.addButton}>
            <span className={styles.plus}>+</span>
            <span className={styles.name}>{'添加'}</span>
          </Button>
          <Button disabled={casePartTableData.length === 0 || selectedRowKeys.length === 0} onClick={this.deleteCasePart}> 批量删除 </Button>
          <Button className={styles.intoFile} onClick={this.uploadFile}> 批量导入 </Button>
          {showUpload && <UploadModal {...this.props} showModal={showUpload} cancelModal={this.cancelModal} />}
          <Button
            className={styles.downloadStyle}
            href={downloadTemplet}
            download={downloadTemplet}
            target="_blank"
          >模板下载
          </Button>

        </div>}
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />

      </div>
    );
  }
}
export default (CaseHandle);
