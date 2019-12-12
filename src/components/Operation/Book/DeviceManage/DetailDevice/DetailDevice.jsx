import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../deviceSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import { baseFun, windTowerFun, windTimeFun, selcetbaseFun } from './detailInformation';
import DetailInfoPart from './DetailInfoPart';
import RecordTable from './RecordTable';
import moment from 'moment';
import { Icon, Button, Spin } from 'antd';
import searchUtil from '@utils/searchUtil';
class DetailDevice extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    onShowSideChange: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
    getStationDeviceDetail: PropTypes.func,
    getDevicePartInfo: PropTypes.func,
    detailloading: PropTypes.bool,
    history: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
    const { search } = props.history.location;
    const deviceFullCodeStr = searchUtil(search).getValue('deviceFullCode');
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      tableFilter: 'part',
      deviceFullCodeStr: deviceFullCodeStr,
    };
  }

  componentDidMount () {
    const { deviceFullCodeStr } = this.state;
    const { getStationDeviceDetail, getDevicePartInfo } = this.props;
    deviceFullCodeStr && getStationDeviceDetail({
      deviceFullCode: deviceFullCodeStr,
    });
    deviceFullCodeStr && getDevicePartInfo({
      deviceFullcode: deviceFullCodeStr,
    });
  }

  onShowSideChange = () => { // 编辑页
    const { getPvDevice, stationDeviceDetail, stationCode, getConnectDevice } = this.props;
    const { deviceTypeCode } = stationDeviceDetail;
    this.props.changeDeviceManageStore({ showPage: 'edit' });
    this.props.onShowSideChange('edit');
    getConnectDevice({
      stationCode: stationCode,
      deviceTypeCode: deviceTypeCode,
    });
    if (deviceTypeCode === '202' || deviceTypeCode === '206') {
      getPvDevice({
        stationCode,
        deviceTypeCode: '509',
      });
    }

  }
  preStation = () => { // 上一个电站详情
    const { queryParams, selectedStationIndex, pageNum, pageSize, getOtherPageDeviceDetail, getStationDeviceDetail, deviceList } = this.props;
    if (selectedStationIndex === 0 && pageNum === 1) { // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      });
    } else if (selectedStationIndex === 0 && pageNum > 1) { // 其他页向前翻页
      getOtherPageDeviceDetail({
        ...queryParams,
        pageNum: pageNum - 1,
        selectedStationIndex: pageSize - 1,
      });
    } else {
      getStationDeviceDetail({ // 正常请求上一条电站详情数据
        ...queryParams,
        selectedStationIndex: selectedStationIndex - 1,
        deviceFullCode: deviceList[selectedStationIndex - 1].deviceFullCode,
      });
      this.changeTableFilter('part');
      this.props.getDevicePartInfo({ deviceFullcode: deviceList[selectedStationIndex - 1].deviceFullCode });
    }
  }

  nextStation = () => { // 下一个电站详情
    const { queryParams, selectedStationIndex, pageNum, pageSize, getOtherPageDeviceDetail, totalNum, getStationDeviceDetail, deviceList } = this.props;

    // const deviceFullCode = deviceList[selectedStationIndex+1]['deviceFullCode'];
    const maxPage = Math.ceil(totalNum / pageSize); // 最后一页页码
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize;
    if (selectedStationIndex + 1 === lastPageMaxIndex && pageNum === maxPage) { // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      });
    } else if (selectedStationIndex === pageSize - 1 && pageNum < maxPage) { // 向后翻页
      getOtherPageDeviceDetail({
        ...queryParams,
        pageNum: pageNum + 1,
        selectedStationIndex: 0,
      });
    } else {
      getStationDeviceDetail({ // 请求下一条电站详情数据
        ...queryParams,
        selectedStationIndex: selectedStationIndex + 1,
        deviceFullCode: deviceList[selectedStationIndex + 1]['deviceFullCode'],
      });
      this.changeTableFilter('part');
      this.props.getDevicePartInfo({ deviceFullcode: deviceList[selectedStationIndex + 1]['deviceFullCode'] });
    }
  }
  confirmWarningTip = () => { // 提示框确认
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    });
  }
  backToList = () => { // 返回列表页
    const { history } = this.props;
    history.push('/operation/book/deviceManage');
    this.props.changeDeviceManageStore({
      showPage: 'list',
      selectedStationIndex: null,
    });
  }
  changeTableFilter = (value) => {
    this.setState({
      tableFilter: value,
    });
  }
  render() {
    const { stationDeviceDetail, detailloading } = this.props;
    const deviceTypeCode = stationDeviceDetail.deviceTypeCode;
    const deviceDetailMap = stationDeviceDetail.map;
    const connectedBranches = deviceDetailMap ? deviceDetailMap.connectedBranches : [];
    const baseInfo = baseFun(stationDeviceDetail);
    const selcetbaseInfo = selcetbaseFun(stationDeviceDetail);
    const windTower = windTowerFun(stationDeviceDetail);
    const windTime = windTimeFun(stationDeviceDetail);
    const { showWarningTip, warningTipText, tableFilter, deviceFullCodeStr } = this.state;
    return (
      <div className={styles.contentBox}>
        {detailloading ? <div className={styles.loadingStyle}> <Spin /></div> :
          <div className={styles.detailDevice}>
            {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
            <div className={styles.detailTop}>
              <span className={styles.topInfoShow}>
                <Button className={styles.title} onClick={this.onShowSideChange} disabled={deviceTypeCode === '509'}>编辑</Button>
              </span>
              <span className={styles.handleArea} >
                <i className="iconfont icon-last" title="上一个" onClick={deviceFullCodeStr ? () => {} : this.preStation} />
                <i className="iconfont icon-next" title="下一个" onClick={deviceFullCodeStr ? () => {} : this.nextStation} />
                <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
              </span>
            </div>
            <div className={styles.detailPart}>
              <div>
                <DetailInfoPart infoArray={baseInfo} />
                <DetailInfoPart infoArray={selcetbaseInfo} />
              </div>
              <div className={styles.rightPart}>
                {deviceTypeCode === '501' && <DetailInfoPart infoArray={windTower} />}
                {deviceTypeCode === '101' && <DetailInfoPart infoArray={windTime} />}
                {(deviceTypeCode === '202' || deviceTypeCode === '206') && <div className={styles.infoBox}>
                  <div className={styles.eachInfo}>
                    <div className={styles.infoName}>组件型号</div>
                    <div className={styles.infoValue} title={stationDeviceDetail.componentMode}>
                      {(deviceDetailMap && (deviceDetailMap.componentMode || deviceDetailMap.componentMode === 0)) ? deviceDetailMap.componentMode : '--'}
                    </div>
                  </div>
                  <div className={styles.eachInfo}>
                    <div className={styles.infoName}>支路个数</div>
                    <div className={styles.infoValue} title={stationDeviceDetail.componentCount}>
                      {(deviceDetailMap && (deviceDetailMap.componentCount || deviceDetailMap.componentCount === 0)) ? deviceDetailMap.componentCount : '--'}
                    </div>
                  </div>
                  <div className={styles.eachInfo}>
                    <div className={styles.infoName}>所用支路</div>
                    <div className={styles.checkGroup} >
                      <div className={styles.checkItem}>
                        {connectedBranches.map((e, i) => (
                          <span className={styles.branchItem} key={i}>
                            <span title={`第${i + 1}支路`} className={styles.itemName}>第{i + 1}支路</span>
                            <span>[{e}]</span>
                          </span>
                        ))}
                      </div>
                      <div className={styles.brachTip}>
                        (数值代表接入组串数, 0代表未接入)
                  </div>
                    </div>
                  </div>
                </div>
                }
                {deviceTypeCode === '304' && <div className={styles.infoBox}>
                  <div className={styles.eachInfo}>
                    <div className={styles.infoName}>所属方阵</div>
                    <div className={styles.infoValue} title={deviceDetailMap.belongMatrix}>
                      {(deviceDetailMap && (deviceDetailMap.belongMatrix || deviceDetailMap.belongMatrix === 0)) ? deviceDetailMap.belongMatrix : '--'}
                    </div>
                  </div>
                </div>}
              </div>
            </div>
            <div className={styles.tableFilter}>
              <RecordTable {...this.props} tableFilter={tableFilter} changeTableFilter={this.changeTableFilter} />
            </div>
          </div>
        }
      </div>
    );
  }
}
export default (DetailDevice);

