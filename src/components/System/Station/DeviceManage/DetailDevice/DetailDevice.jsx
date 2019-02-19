import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import WarningTip from '../../../../Common/WarningTip';
import { baseFun, windTowerFun, windTimeFun } from './detailInformation';
import DetailInfoPart from './DetailInfoPart';
import moment from 'moment';
import { Icon, Button,Checkbox ,Row, Col} from 'antd';
class DetailDevice extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  }
  preStation = () => { // 上一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, getStationDetail, stationList } = this.props;
    if (selectedStationIndex === 0 && pageNum === 1) { // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      })
    } else if (selectedStationIndex === 0 && pageNum > 1) { // 其他页向前翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum - 1,
        selectedStationIndex: pageSize - 1,
      })
    } else {
      getStationDetail({ // 正常请求上一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex - 1,
        stationCode: stationList[selectedStationIndex].stationCode,
      })
    }
  }

  nextStation = () => { // 下一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, totalNum, getStationDetail, stationList } = this.props;
    const maxPage = Math.ceil(totalNum / pageSize); // 最后一页页码
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (selectedStationIndex === lastPageMaxIndex && pageNum === maxPage) { // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      })
    } else if (selectedStationIndex === pageSize - 1 && pageNum < maxPage) { // 向后翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum + 1,
        selectedStationIndex: 0,
      })
    } else {
      getStationDetail({ // 请求下一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex + 1,
        stationCode: stationList[selectedStationIndex].stationCode,
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

  editDetail = () => { // 编辑页
    this.props.onShowSideChange({ showSidePage: 'edit' });
    this.props.changeDeviceManageStore({ showPage: 'edit' });
  }
  render() {
    const { stationDeviceDetail } = this.props;
    const baseInfo = baseFun(stationDeviceDetail);
    const windTower = windTowerFun(stationDeviceDetail);
    const windTime = windTimeFun(stationDeviceDetail);
    const { showWarningTip, warningTipText } = this.state;

    return (
      <div className={styles.detailDevice}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <Button className={styles.title}>编辑</Button>
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
            <div className={styles.infoBox}>
              <div className={styles.eachInfo}>
                <div className={styles.infoName}>组件型号</div>
                <div className={styles.infoValue} title={stationDeviceDetail.componentMode}>
                  {(stationDeviceDetail.componentMode||stationDeviceDetail.componentMode===0)?stationDeviceDetail.componentMode:'--'}
                </div>
              </div>
              <div className={styles.eachInfo}>
                <div className={styles.infoName}>组件个数</div>
                <div className={styles.infoValue} title={stationDeviceDetail.branchCount}>
                {(stationDeviceDetail.branchCount||stationDeviceDetail.branchCount===0)?stationDeviceDetail.branchCount:'--'}
              </div>
            </div>
              <div className={styles.eachInfo}>
            <div className={styles.infoName}>所用支路</div>
            <div className={styles.checkGroup} title={stationDeviceDetail.componentMode}>
            <Checkbox.Group disabled   >
            <Row>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11].map((e, i) => {
                return (
                  <Col span={3}>
                    <div>第{e}支路</div>
                    <Checkbox value={i} key={e}></Checkbox>
                  </Col>)
              })}



            </Row>
          </Checkbox.Group>,

       
            </div>
          </div>

            </div>


          </div>
        </div>



      </div>
    )
  }
}
export default (DetailDevice)
//  <DetailInfoPart infoArray={windTime} />
// <DetailInfoPart infoArray={windTower} />