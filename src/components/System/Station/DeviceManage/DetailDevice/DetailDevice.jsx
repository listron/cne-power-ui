import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import { baseFun, windTowerFun, windTimeFun } from './detailInformation';
import DetailInfoPart from './DetailInfoPart';
import moment from 'moment';
import { Icon, Button, Checkbox, Row, Col } from 'antd';
class DetailDevice extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    onShowSideChange: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  }
  onShowSideChange = () => { // 编辑页
    const { getPvDevice, stationDeviceDetail, stationCode, getConnectDevice } = this.props;
    const { deviceTypeCode, } = stationDeviceDetail;
    this.props.changeDeviceManageStore({ showPage: 'edit' });
    this.props.onShowSideChange('edit');
    getConnectDevice({
      stationCode: stationCode,
      deviceTypeCode: deviceTypeCode,
    })
    if (deviceTypeCode === '202' || deviceTypeCode === '206') {
      getPvDevice({
        stationCode,
        deviceTypeCode: '509',
      })
    }

  }
  preStation = () => { // 上一个电站详情
    const { queryParams, selectedStationIndex, pageNum, pageSize, getOtherPageDeviceDetail, getStationDeviceDetail, deviceList } = this.props;
    if (selectedStationIndex === 0 && pageNum === 1) { // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      })
    } else if (selectedStationIndex === 0 && pageNum > 1) { // 其他页向前翻页
      getOtherPageDeviceDetail({
        ...queryParams,
        pageNum: pageNum - 1,
        selectedStationIndex: pageSize - 1,
      })
    } else {
      getStationDeviceDetail({ // 正常请求上一条电站详情数据
        ...queryParams,
        selectedStationIndex: selectedStationIndex - 1,
        deviceFullCode: deviceList[selectedStationIndex - 1].deviceFullCode,
      })
    }
  }

  nextStation = () => { // 下一个电站详情
    const { queryParams, selectedStationIndex, pageNum, pageSize, getOtherPageDeviceDetail, totalNum, getStationDeviceDetail, deviceList } = this.props;

    const deviceFullCode = deviceList[selectedStationIndex]['deviceFullCode'];
    const maxPage = Math.ceil(totalNum / pageSize); // 最后一页页码
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (selectedStationIndex === lastPageMaxIndex && pageNum === maxPage) { // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      })
    } else if (selectedStationIndex === pageSize - 1 && pageNum < maxPage) { // 向后翻页
      getOtherPageDeviceDetail({
        ...queryParams,
        pageNum: pageNum + 1,
        selectedStationIndex: 0,
      })
    } else {
      getStationDeviceDetail({ // 请求下一条电站详情数据
        ...queryParams,
        selectedStationIndex: selectedStationIndex + 1,
        deviceFullCode: deviceFullCode,
      })
    }
  }
  confirmWarningTip = () => { // 提示框确认
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    })
  }
  backToList = () => { // 返回列表页
    this.props.changeDeviceManageStore({
      showPage: 'list',
      selectedStationIndex: null,
    });
  }
  render() {
    const { stationDeviceDetail } = this.props;
    const { deviceTypeCode, connectedBranches } = stationDeviceDetail;
    const baseInfo = baseFun(stationDeviceDetail);
    const windTower = windTowerFun(stationDeviceDetail);
    const windTime = windTimeFun(stationDeviceDetail);
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.detailDevice}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <Button className={styles.title} onClick={this.onShowSideChange}>编辑</Button>
          </span>
          <span className={styles.handleArea} >
            <i className="iconfont icon-last" title="上一个" onClick={this.preStation} />
            <i className="iconfont icon-next" title="下一个" onClick={this.nextStation} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.detailPart}>
          <DetailInfoPart infoArray={baseInfo} />
          <div className={styles.rightPart}>
            {deviceTypeCode === '501' && <DetailInfoPart infoArray={windTower} />}
            {deviceTypeCode === '101' && <DetailInfoPart infoArray={windTime} />}
            {(deviceTypeCode === '202' || deviceTypeCode === '206') && <div className={styles.infoBox}>
              <div className={styles.eachInfo}>
                <div className={styles.infoName}>组件型号</div>
                <div className={styles.infoValue} title={stationDeviceDetail.componentMode}>
                  {(stationDeviceDetail.componentMode || stationDeviceDetail.componentMode === 0) ? stationDeviceDetail.componentMode : '--'}
                </div>
              </div>
              <div className={styles.eachInfo}>
                <div className={styles.infoName}>组件个数</div>
                <div className={styles.infoValue} title={stationDeviceDetail.branchCount}>
                  {(stationDeviceDetail.branchCount || stationDeviceDetail.branchCount === 0) ? stationDeviceDetail.branchCount : '--'}
                </div>
              </div>
              <div className={styles.eachInfo}>
                <div className={styles.infoName}>所用支路</div>
                <div className={styles.checkGroup} >
                  <Row>
                    {connectedBranches.map((e, i) => {
                      return (
                        <Col span={3}>
                          <div>第{i + 1}支路</div>
                          <Checkbox checked={!!e} key={i}></Checkbox>
                        </Col>)
                    })}
                  </Row>
                  <div className={styles.linestyle}>
                    <div className={styles.box}>( <span className={styles.selectRingStyle}></span>接入<span className={styles.ringStyle}></span>未接入 )
                </div>
                  </div>
                </div>
              </div>
            </div>
            }
            {deviceTypeCode === '304' && <div className={styles.infoBox}>
              <div className={styles.eachInfo}>
                <div className={styles.infoName}>所属方阵</div>
                <div className={styles.infoValue} title={stationDeviceDetail.belongMatrix}>
                  {(stationDeviceDetail.belongMatrix || stationDeviceDetail.belongMatrix === 0) ? stationDeviceDetail.belongMatrix : '--'}
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}
export default (DetailDevice)
//(deviceTypeCode === 202||deviceTypeCode === 206)