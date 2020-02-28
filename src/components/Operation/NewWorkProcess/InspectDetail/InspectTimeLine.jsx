import React, { Component } from 'react';
import { Timeline, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './inspectTimeLine.scss';
import ImgUploader from '../../../Common/Uploader/ImgUploader';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程信息progressData
 */

class InspectTimeLine extends Component {
  static propTypes = {
    status: PropTypes.string,
    processData: PropTypes.array,
    inspectdescribe: PropTypes.string,
    // inspectDeviceType: PropTypes.array,
    // deviceTypeName: PropTypes.string,
    // inspectId: PropTypes.string,
    // abnormalItems: PropTypes.object,
    // onChangeShowContainer: PropTypes.func,
    // getInspectUsers: PropTypes.func,
    // getInspectDetailRecord: PropTypes.func,
    // changeInspectStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      openOther: false,
      curOther: '',
      openMatri: {},
    };
  }

  openMatrixe = (m) => {
    const { openMatri } = this.state;
    if (openMatri[m]) {
      this.setState({
        openMatri: { ...openMatri, [m]: !openMatri[m] },
      });
    } else {
      this.setState({
        openMatri: { ...openMatri, [m]: true },
      });
    }
  }
  openOther = (i) => {
    const { openOther } = this.state;
    this.setState({
      openOther: !openOther,
      curOther: i,
    });
  }
  renderIcon(flowType) {
    // 2 创建巡检
    // 3 提交验收
    // 4 验收工单
    // 5 执行工单
    switch (flowType) {
      case 2:
        return <i className="iconfont icon-begin" />;
      case 3:
        return <i className="iconfont icon-doing" />;
      case 4:
        return <i className="iconfont icon-review" />;
      case 5:
        return <i className="iconfont icon-doing" />;
      default:
        return;
    }
  }

  renderDeviceTypeDetail = (deviceTypes = []) => {
    return deviceTypes.length > 0 && deviceTypes.map((deviceType, index) => (
      <div className={styles.deviceTypes} key={'设备类型' + index}>
        <div>
          <div>{deviceType.deviceTypeName}:</div>
          {deviceType.devices.map((device, id) => (
            <div key={`${index}-${id}`}>
              <span>{device.deviceName}</span>
              <span className={styles.numStyle}>{device.status ? '正常' : `缺陷  ${device.defectIds.length}`}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  }
  render() {

    const { processData, status, inspectdescribe } = this.props;
    const { openOther, curOther, openMatri } = this.state;
    const flowName = { 2: '创建巡检', 3: '提交验收', 4: '验收工单', 5: '执行工单' };
    //status==='4'，代表着已完成状态
    return (
      <div className={styles.timeLineWrap}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>流程信息</div>
          <div className={styles.border}></div>
        </div>
        <Timeline className={styles.timeLines} >
          {status === '4' &&
            <Timeline.Item
              dot={<i className="iconfont icon-doned" />}
              key={'已完成'}>
              <div className={styles.flowName}>已完成</div>
            </Timeline.Item>
          }
          {status === '3' &&
            <Timeline.Item
              dot={<i className="iconfont icon-goon" />}
              key={'待验收'}>
              <div className={styles.flowName}>验收工单</div>

            </Timeline.Item>
          }
          {processData.map((item, index) => {
            const matrixes = item.flowItem ? item.flowItem.matrixes : [];
            const deviceTypes = item.flowItem ? item.flowItem.deviceTypes : [];
            const otherDefectIds = item.flowItem ? item.flowItem.otherDefectIds : [];
            const images = item.images ? item.images : [];
            return (
              <Timeline.Item
                dot={this.renderIcon(item.flowType)}
                key={'timeline' + index}>

                <div className={styles.processItem}>
                  <div className={styles.basic}>
                    <div className={styles.flowName}>{flowName[item.flowType]}</div>
                    <div className={styles.operateTime}>{item.startTime}{item.endTime ? '~' : ''}{item.endTime}</div>
                    <div className={styles.operateUser}>{item.userName}</div>
                  </div>
                  {item.flowType === 2 &&
                    (<div className={styles.descStyle}>
                      <div className={styles.flowName}>巡检描述</div>
                      <div>{inspectdescribe}</div>
                    </div>)}
                  {item.flowType === 5 && (
                    <div className={styles.descStyle}>
                      <div className={styles.flowName}>巡检内容</div>
                      <div className={styles.inspectTypedetail}>
                        {/* //方阵详情 */}
                        {matrixes.length > 0 && matrixes.map((m, i) => {
                          const deviceTypeData = m.deviceTypes ? m.deviceTypes : [];
                          return (
                            <div className={styles.matrixeBox} key={'方阵' + i} >
                              <div className={styles.matrixe}>
                                <div>{m.belongMatrix}</div>
                                <div className={styles.rightCont}>
                                  <span>缺陷<span className={styles.numStyle}>{`  ${m.defectIds.length}`}</span></span>
                                  <span onClick={() => this.openMatrixe(m.belongMatrix)}>{(openMatri[m.belongMatrix]) ? <Icon type="down" /> : <Icon type="right" />}</span>
                                </div>
                              </div>
                              {(openMatri[m.belongMatrix]) &&
                                <div>
                                  {this.renderDeviceTypeDetail(deviceTypeData)}
                                </div>
                              }
                            </div>
                          );
                        })}
                        {/* //设备类型详情 */}
                        {this.renderDeviceTypeDetail(deviceTypes)}
                        {/* //其他缺陷详情 */}
                        {otherDefectIds.length > 0 &&
                          <div className={styles.matrixeBox}>
                            <div className={styles.matrixe}>
                              <div>其他缺陷</div>
                              <div className={styles.rightCont}>
                                <span>缺陷<span className={styles.numStyle}>{`  ${otherDefectIds.length}`}</span></span>
                                <span onClick={() => this.openOther(index)}>{(openOther && curOther === index) ? <Icon type="down" /> : <Icon type="right" />}</span>
                              </div>
                            </div>
                            {(openOther && curOther === index) &&
                              <div>{otherDefectIds.map((other, i) => (
                                <div>缺陷描述：<span style={{ whiteSpace: 'pre-wrap' }}>{other}</span></div>
                              ))}</div>
                            }
                          </div>
                        }
                        <ImgUploader editable={false} data={images.map(item => ({
                          uid: item,
                          rotate: 0,
                          thumbUrl: `${item}?${Math.random()}`,
                        }))}
                        />
                      </div>

                    </div>
                  )}
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    );
  }
}

export default InspectTimeLine;
