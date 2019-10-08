import React from 'react';
import PropTypes from 'prop-types';
import styles from '../CasePartSide.scss';
import EditCase from '../EditCase/EditCase';
import { Icon, Button } from 'antd';
import WarningTip from '../../../../components/Common/WarningTip';
import path from '../../../../constants/path';
import Cookie from 'js-cookie';
const { originUri } = path.basePaths;
class DetailCase extends React.Component {
  static propTypes = {
    changeCasePartStore: PropTypes.func,
    downLoadFile: PropTypes.func,
    likeCase: PropTypes.func,
    caseDetail: PropTypes.object,
    showPage: PropTypes.string,
    getCasePartList: PropTypes.func,
    faultDescription: PropTypes.string,
    orderFiled: PropTypes.string,
    orderType: PropTypes.string,
    userName: PropTypes.string,
    userId: PropTypes.number,
    questionTypeCodes: PropTypes.array,
    deviceModeList: PropTypes.array,
    stationCodes: PropTypes.array,
    tableLoading: PropTypes.bool,

  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }
  componentDidMount() {
    const main = document.getElementById('main');
    main && main.scroll(0, 0);

  }
  onWarningTipShow = () => {
    const { changeCasePartStore, getCasePartList, questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, orderFiled, orderType, pageSize, pageNum } = this.props;
    changeCasePartStore({
      showPage: 'list',
    });
    const queryParams = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, orderFiled, orderType, pageSize, pageNum };

    getCasePartList({
      ...queryParams,
    });
  }
  showEditPage = () => {
    this.props.changeCasePartStore({
      showPage: 'edit',
    });
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changeCasePartStore({
      showPage: 'list',
    });
  }
  likeBtn = () => {
    const { caseDetail } = this.props;
    const { caseBaseId } = caseDetail;
    this.props.likeCase({
      caseBaseId,
    });
  }
  detailInfo = (data) => {
    const detailArr = [
      { name: '机型', value: data.deviceModes && data.deviceModes.map(e => (e.deviceModeName)) },
      { name: '风场', value: data.stations && data.stations.map(e => (e.stationName)) },
      { name: '问题类别', value: data.questionTypes && data.questionTypes.map(e => (e.questionTypeName)) },
      { name: '相关故障代码', value: data.faultCode },
      { name: '问题描述', value: data.faultDescription },
      { name: '问题分析', value: data.faultAnalyse },
      { name: '处理措施', value: data.processingMethod },
      { name: '所需工具', value: data.requiredTools },
      { name: '反馈人', value: data.feedbackUserName },
      { name: '联系方式', value: data.feedbackUserPhone },
      { name: '上传附件', value: data.annexs && data.annexs },
      // { name: '上传附件', value: data.annexs && data.annexs.map(e => (e.annex)) },
      { name: '填报人', value: data.createUserName },
      { name: '联系方式', value: data.createUserPhone },
      { name: '更新时间', value: data.updateTime },
      { name: '点赞数', value: data.likeCount },
    ];
    return detailArr;
  }
  downFile = (file, fileName) => {
    const { downLoadFile } = this.props;
    const downloadTemplet = `${path.basePaths.APIBasePath}${path.APISubPaths.operation.downloadCaseFile}`; // 下载文件
    downLoadFile({
      defineOriginName: true,
      url: downloadTemplet,
      method: 'post',
      params: { filePath: file },
      fileName: fileName,
    });
  }
  render() {
    const { showWarningTip, warningTipText } = this.state;
    const { caseDetail, showPage } = this.props;
    const dataDom = this.detailInfo(caseDetail);
    const { likeCount } = caseDetail;
    const rightkey = Cookie.get('userRight').includes('operation_case_operate');//操作权限
    if (showPage === 'detail') {
      return (
        <div className={styles.caseDetail}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
          <div className={styles.pageTop}>
            <div className={styles.pageTopLeft}>
              <span className={styles.text}>查看案例集</span>
              {rightkey && <Button type="primary" onClick={this.showEditPage} >编辑</Button>}
            </div>
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
          </div>
          <div className={styles.detailBox}>

            {dataDom.map((e, i) => {
              let value;
              if (e.value || e.value === 0) {
                value = e.value;
              } else {
                value = '无';
              }
              return (
                <div key={e.name} className={styles.eachInfo} key={`${e.name}${i}`} >
                  <div className={styles.infoName}>{e.name}</div>
                  {e.name === '上传附件' ? <div className={styles.downHref}>
                    {e.value && e.value.map((item, i) => (<a
                      // href={`${originUri}${item.url}`} download={`${originUri}${item.url}`} 
                      onClick={() => this.downFile(item.url, item.name)}
                      target="_blank"
                      key={i}
                    ><span>{`${item.name}`} 【点击下载】{i === (e.value.length - 1) ? '' : '、'}</span>
                    </a>))}
                  </div> : <div
                    className={styles.infoValue}
                    title={`${value}${e.unit || ''}`}
                  >{`${value}${e.unit || ''}`}
                    </div>
                  }
                </div>
              );
            })}
            <div className={styles.eachInfo}>
              <div className={styles.infoName}></div>
              <div className={styles.infoValue} >
                {likeCount === 0 ?
                  <Button type="primary" style={{ width: '200px' }} onClick={this.likeBtn}>点赞<Icon type="like" /></Button>
                  :
                  <Button style={{ width: '200px' }} disabled>已点赞<Icon type="like" /></Button>
                }
              </div>
            </div>
          </div>
        </div>

      );
    } else if (showPage === 'edit') {
      return (<EditCase {...this.props} />);
    }
    return (<div></div>);

  }
}
export default (DetailCase);
