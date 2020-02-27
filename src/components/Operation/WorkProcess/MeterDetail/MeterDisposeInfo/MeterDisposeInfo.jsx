import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Input, Upload, Progress, DatePicker} from 'antd';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
import MeterPicZoom from '../MeterPicZoom/MeterPicZoom';
import path from '@path';
import styles from './meterDisposeInfo.scss';

const {basePaths, APISubPaths} = path;
const {APIBasePath} = basePaths;
const {ticket} = APISubPaths;

const dateFormat = 'YYYY-MM-DD';
export default class MeterDisposeInfo extends React.Component {
  static propTypes = {
    readMeterData: PropTypes.object,
    changeStore: PropTypes.func,
    processActionData: PropTypes.array,
    editFlag: PropTypes.bool,
    getSaveAction: PropTypes.func,
    meterBaseData: PropTypes.object,
    thisReadTimeFlag: PropTypes.bool,
    getRotateImg: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      zoomVisible: false,
      styleLocation: {},
      changeDateFlag: false,
      imgIndex: 0, // 当前图片下标
      curIndex: 0, // 当前表格下标
      arrStr: '', // 当前字段名称
    };
  }

  // 编辑
  onEdit = () => {
    const { changeStore, readMeterData } = this.props;
    this.setState({
      changeDateFlag: false,
    }, () => {
      // 编辑状态
      // 修改数据状态
      changeStore({
        editFlag: true,
        thisReadTimeFlag: true,
        readMeterData: {
          ...readMeterData,
          onlineDatas: readMeterData.onlineDatas.map(cur => {
            return Object.assign(cur, {
              flag1: true,
              flag2: true,
              flag3: true,
              flag4: true,
              flag5: true,
              type1: cur.totalEndCode === '' || cur.totalEndCode === null ? 1 : 0,
              type2: cur.topEndCode === '' || cur.topEndCode === null ? 1 : 0,
              type3: cur.peakEndCode === '' || cur.peakEndCode === null ? 1 : 0,
              type4: cur.flatEndCode === '' || cur.flatEndCode === null ? 1 : 0,
              type5: cur.lowEndCode === '' || cur.lowEndCode === null ? 1 : 0,
              errorFlag1: false,
              errorFlag2: false,
              errorFlag3: false,
              errorFlag4: false,
              errorFlag5: false,
              imgFlag: true,
              loading: false,
              percent: 0,
            });
          }),
          generationDatas: readMeterData.generationDatas.map(cur => {
            return Object.assign(cur, {
              flag1: true,
              flag2: true,
              flag3: true,
              flag4: true,
              flag5: true,
              type1: cur.totalEndCode === '' || cur.totalEndCode === null ? 1 : 0,
              type2: cur.topEndCode === '' || cur.topEndCode === null ? 1 : 0,
              type3: cur.peakEndCode === '' || cur.peakEndCode === null ? 1 : 0,
              type4: cur.flatEndCode === '' || cur.flatEndCode === null ? 1 : 0,
              type5: cur.lowEndCode === '' || cur.lowEndCode === null ? 1 : 0,
              errorFlag1: false,
              errorFlag2: false,
              errorFlag3: false,
              errorFlag4: false,
              errorFlag5: false,
              imgFlag: true,
              loading: false,
              percent: 0,
            });
          }),
        },
      });
    });
  };

  // 取消编辑
  onCancelEdit = () => {
    const { changeStore, readMeterData } = this.props;
    this.setState({
      changeDateFlag: false,
    }, () => {
      changeStore({
        editFlag: false,
        thisReadTimeFlag: false,
        readMeterData: {
          ...readMeterData,
          onlineDatas: readMeterData.onlineDatas.map(cur => {
            return Object.assign(cur, {
              flag1: false,
              flag2: false,
              flag3: false,
              flag4: false,
              flag5: false,
              errorFlag1: false,
              errorFlag2: false,
              errorFlag3: false,
              errorFlag4: false,
              errorFlag5: false,
              type1: cur.totalEndCode ? 0 : 1,
              type2: cur.topEndCode ? 0 : 1,
              type3: cur.peakEndCode ? 0 : 1,
              type4: cur.flatEndCode ? 0 : 1,
              type5: cur.lowEndCode ? 0 : 1,
              imgFlag: false,
              loading: false,
              percent: 0,
            });
          }),
          generationDatas: readMeterData.generationDatas.map(cur => {
            return Object.assign(cur, {
              flag1: false,
              flag2: false,
              flag3: false,
              flag4: false,
              flag5: false,
              errorFlag1: false,
              errorFlag2: false,
              errorFlag3: false,
              errorFlag4: false,
              errorFlag5: false,
              type1: cur.totalEndCode ? 0 : 1,
              type2: cur.topEndCode ? 0 : 1,
              type3: cur.peakEndCode ? 0 : 1,
              type4: cur.flatEndCode ? 0 : 1,
              type5: cur.lowEndCode ? 0 : 1,
              imgFlag: false,
              loading: false,
              percent: 0,
            });
          }),
        },
      });
    });
  };

  // 保存编辑
  onSaveEdit = () => {
    const {
      readMeterData: {
        readmeterId,
        docketId,
        lastReadTime,
        thisReadTime,
        settleMonth,
        onlineDatas,
        generationDatas,
      },
      getSaveAction,
      meterBaseData: {
        stateId,
      },
      changeStore,
    } = this.props;
    const updateReadMeterInputs = onlineDatas.concat(generationDatas).map(cur => {
      const obj = {};
      obj.magnification = cur.magnification;
      obj.flatStartCode = cur.flatStartCode;
      obj.meterNumber = cur.meterNumber;
      obj.meterName = cur.meterName;
      obj.totalEndCode = cur.totalEndCode;
      obj.lowStartCode = cur.lowStartCode;
      obj.topEndCode = cur.topEndCode;
      obj.detailId = cur.detailId;
      obj.lowEndCode = cur.lowEndCode;
      obj.peakEndCode = cur.peakEndCode;
      obj.topStartCode = cur.topStartCode;
      obj.peakStartCode = cur.peakStartCode;
      obj.meterImgs = cur.meterImgs;
      obj.totalStartCode = cur.totalStartCode;
      obj.flatEndCode = cur.flatEndCode;
      obj.meterId = cur.meterId;
      return obj;
    });
    const params = {
      readmeterId,
      docketId,
      stateId,
      lastReadTime,
      thisReadTime: thisReadTime ? moment(thisReadTime).format(dateFormat) : null,
      settleMonth,
      actionCode: '4',
      updateReadMeterInputs,
      func: () => {
        changeStore({
          editFlag: false,
          thisReadTimeFlag: false,
        });
        this.setState({
          changeDateFlag: false,
        });
      },
    };
    // 保存修改
    getSaveAction(params);
  };

  // 查看图片
  lookPic = (flag, curIndex, imgIndex, str) => {
    if (flag) {
      return this.setState({
        zoomVisible: true,
        styleLocation: {
          left: '245px',
        },
        imgIndex,
        curIndex,
        arrStr: str,
      });
    }
    return this.setState({
      zoomVisible: true,
      styleLocation: {
        right: '27%',
      },
      imgIndex,
      curIndex,
      arrStr: str,
    });
  };

  // 关闭查看图片
  closePicZoom = () => {
    this.setState({
      zoomVisible: false,
      styleLocation: {},
    });
  };

  // 改变输入框
  changeStopCode = (e, index, arrStr, filed, type) => {
    const { readMeterData, changeStore } = this.props;
    // 判断最多是6位整数和两位小数
    const reg = /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/;
    // 改变当前input值
    // e当前event对象
    // index当前表格
    // arrStr需要改变的数组
    // filed需要改变的value
    // type 样式类型
    readMeterData[arrStr][index][filed] = e.target.value === '' ? e.target.value : Number(e.target.value);
    readMeterData[arrStr][index][type] = reg.test(e.target.value) ? 0 : 2;
    changeStore({readMeterData});
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      // message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      // message.error('Image must smaller than 2MB!');
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  handleChange = (info, index, arrStr) => {
    const { readMeterData, changeStore } = this.props;
    if (info.file.status === 'uploading') {
      // 改变上传状态
      readMeterData[arrStr][index].loading = true;
      changeStore({
        readMeterData,
      });
      if(info.event) {
        // 改变上传进度
        readMeterData[arrStr][index].percent = Math.floor(info.event.percent);
        changeStore({
          readMeterData,
        });
      }
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // 上传保存图片url->恢复默认
      readMeterData[arrStr][index].loading = false;
      readMeterData[arrStr][index].percent = 0;
      readMeterData[arrStr][index].meterImgs.push(info.file.response.data);
      changeStore({
        readMeterData,
      });
    }
  };

  dateChange = (date) => {
    const { readMeterData, changeStore } = this.props;
    this.setState({
      changeDateFlag: true,
    }, () => {
      changeStore({
        readMeterData: {
          ...readMeterData,
          thisReadTime: date,
        },
      });
    });
  };

  // 改变下标
  changeStateFunc = (index) => {
    this.setState({
      imgIndex: index,
    });
  };

  render() {
    const {zoomVisible, styleLocation, changeDateFlag, imgIndex, curIndex, arrStr} = this.state;
    const {
      readMeterData: {
        onlineDatas,
        generationDatas,
        settleMonth,
        lastReadTime,
        thisReadTime,
      },
      readMeterData,
      processActionData,
      editFlag,
      thisReadTimeFlag,
      changeStore,
      getRotateImg,
    } = this.props;
    const url = `${APIBasePath}${ticket.getUploadFile}`;
    const authData = localStorage.getItem('authData') || '';
    // 没有电表数据
    const noDataRender = (
      <div className={styles.disposeNoDataBox}>
        <div className={styles.noDataIcon}>
          <i className="iconfont icon-biao"/>
        </div>
        <div className={styles.noDataText}>
          还没有电表，请先配置电表。
        </div>
        <div className={styles.noDataRouter}>
          <span>点击前往：运维管理-电站运行-</span>
          <Link to="/operation/running/meterReadSet" className={styles.meterRouter}>抄表</Link>
        </div>
      </div>
    );
    // 编辑状态下按钮
    const editStatusBtn = (
      <div className={styles.disposeEditBtn}>
        <CneButton
          onClick={this.onCancelEdit}
          style={{width: '46px'}}
        >
          取消
        </CneButton>
        <CneButton
          onClick={this.onSaveEdit}
          style={{width: '92px'}}
        >
          <i className="iconfont icon-save"/>
          <span>保存</span>
        </CneButton>
      </div>
    );
    // 正常状态下按钮
    const normalStatusBtn = (
      <div className={styles.disposeNormalBtn}>
        <CneButton
          onClick={this.onEdit}
          style={{width: '92px'}}
        >
          <i className="iconfont icon-edit"/>
          <span>编辑</span>
        </CneButton>
      </div>
    );
    return (
      <div className={styles.meterDisposeInfo}>
        <div className={styles.disposeBannerBox}>
          <div className={styles.disposeBanner}>
            处理信息
          </div>
          {processActionData.map(cur => cur.actionCode).includes('4') && (editFlag ? editStatusBtn : normalStatusBtn)}
        </div>
        <div className={styles.disposeContent}>
          <div className={styles.disposeNav}>
            <div className={styles.navPrev}>
              <div className={styles.navPrevName}>
                上次抄表日期
              </div>
              <div className={styles.navPrevTime}>
                {lastReadTime ? moment(lastReadTime).format(dateFormat) : '- -'}
              </div>
            </div>
            <div className={styles.navTime}>
              <div>
                结算月份
              </div>
              <div>
                {settleMonth ? moment(settleMonth).format('YYYY年MM月') : '- -'}
              </div>
            </div>
            <div className={styles.navNow}>
              <div className={styles.navNowName}>
                本次抄表日期
              </div>
              <div className={styles.navNowTime}>
                {thisReadTimeFlag ? (
                  <DatePicker
                    allowClear={false}
                    value={thisReadTime ? moment(thisReadTime, dateFormat) : null}
                    className={changeDateFlag ? styles.normalDate : styles.warnDate}
                    suffixIcon={<i className="iconfont icon-date" />}
                    showToday={false}
                    onChange={this.dateChange}
                  />
                ) : (thisReadTime ? moment(thisReadTime).format(dateFormat) : '- -')}
              </div>
            </div>
          </div>
          {(onlineDatas.length === 0 && generationDatas.length === 0) ? noDataRender : (
            <div className={styles.gaugeTableBox}>
              <div className={styles.netGaugeTable}>
                <div className={styles.netGaugeTitle}>
                  上网计量表
                </div>
                <div className={`${styles.clear} ${styles.netWrap}`}>
                  {onlineDatas && onlineDatas.map((cur, index) => {
                    return (
                      <div
                        key={index.toString()}
                        className={(index % 2 === 0) ? `${styles.netGaugeListBox} ${styles.fl}` : `${styles.netGaugeListBox} ${styles.fr}`}>
                        <div className={styles.netTitle}>
                          <i className="iconfont icon-biao" />
                          <span>{cur.meterName}</span>
                        </div>
                        <div className={styles.netInfoBox}>
                          <div>
                            <span>表号：</span>
                            <span>{cur.meterNumber}</span>
                          </div>
                          <div>
                            <span>倍率：</span>
                            <span>{cur.magnification}</span>
                          </div>
                        </div>
                        <div className={styles.netTableBox}>
                          <div className={styles.netTableHead}>
                            <div>时段</div>
                            <div>起码</div>
                            <div>止码</div>
                            <div>照片</div>
                          </div>
                          <div className={styles.netTableBody}>
                            <div className={styles.netTableLeft}>
                              <div className={styles.netTableTr}>
                                <div>
                                  总
                                </div>
                                <div>
                                  {cur.totalStartCode}
                                </div>
                                {cur.flag1 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'onlineDatas', 'totalEndCode', 'type1');
                                      }}
                                      value={cur.totalEndCode}
                                      className={(cur.type1 === 0) ? styles.normalInput : (cur.type1 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type1 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag1 ? styles.netErrorStopCode : styles.netStopCode}>
                                    {cur.totalEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  尖
                                </div>
                                <div>
                                  {cur.topStartCode}
                                </div>
                                {cur.flag2 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'onlineDatas', 'topEndCode', 'type2');
                                      }}
                                      value={cur.topEndCode}
                                      className={(cur.type2 === 0) ? styles.normalInput : (cur.type2 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type2 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag2 ? styles.netErrorStopCode : styles.netStopCode}>
                                    {cur.topEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  峰
                                </div>
                                <div>
                                  {cur.peakStartCode}
                                </div>
                                {cur.flag3 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'onlineDatas', 'peakEndCode', 'type3');
                                      }}
                                      value={cur.peakEndCode}
                                      className={(cur.type3 === 0) ? styles.normalInput : (cur.type3 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type3 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag3 ? styles.netErrorStopCode : styles.netStopCode}>
                                    {cur.peakEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  平
                                </div>
                                <div>
                                  {cur.flatStartCode}
                                </div>
                                {cur.flag4 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'onlineDatas', 'flatEndCode', 'type4');
                                      }}
                                      value={cur.flatEndCode}
                                      className={(cur.type4 === 0) ? styles.normalInput : (cur.type4 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type4 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag4 ? styles.netErrorStopCode : styles.netStopCode}>
                                    {cur.flatEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  谷
                                </div>
                                <div>
                                  {cur.lowStartCode}
                                </div>
                                {cur.flag5 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'onlineDatas', 'lowEndCode', 'type5');
                                      }}
                                      value={cur.lowEndCode}
                                      className={(cur.type5 === 0) ? styles.normalInput : (cur.type5 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type5 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag5 ? styles.netErrorStopCode : styles.netStopCode}>
                                    {cur.lowEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                            </div>
                            {cur.imgFlag ? (
                              <div className={`${styles.netTablePhoto} ${styles.clear}`}>
                                {cur.meterImgs.map((cur, idx) => {
                                  return (
                                    <div
                                      key={idx.toString()}
                                      onClick={() => {
                                        this.lookPic(index % 2 === 0, index, idx, 'onlineDatas');
                                      }}
                                      className={`${styles.netPhotoBox} ${styles.fl}`}
                                    >
                                      <img src={cur} alt="" />
                                      <div className={styles.shadeBox} />
                                    </div>
                                  );
                                })}
                                {(cur.meterImgs.length !== 5) && (
                                  <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    headers={{'Authorization': 'bearer ' + authData}}
                                    showUploadList={false}
                                    action={url}
                                    beforeUpload={this.beforeUpload}
                                    onChange={(info) => {this.handleChange(info, index, 'onlineDatas');}}
                                  >
                                    <div>
                                      <div className={styles.uploadButton}>
                                        {cur.loading ? <div className={styles.antLoadingText}>上传中</div> : <img src="/img/uploadImg.png" alt=""/>}
                                        {cur.loading ? <Progress strokeColor="#199475" percent={cur.percent} /> : <div className="ant-upload-text">上传图片</div>}
                                      </div>
                                    </div>
                                  </Upload>
                                )}
                              </div>
                            ) : (
                              <div className={styles.netNoPhoto}>
                                <img src="/img/noImg.png" alt=""/>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.electricityGaugeTable}>
                <div className={styles.electricityGaugeTitle}>
                  发电计量表
                </div>
                <div className={`${styles.clear} ${styles.electricityWrap}`}>
                  {generationDatas && generationDatas.map((cur, index) => {
                    return (
                      <div
                        key={index.toString()}
                        className={(index % 2 === 0) ? `${styles.electricityGaugeListBox} ${styles.fl}` : `${styles.electricityGaugeListBox} ${styles.fr}`}>
                        <div className={styles.electricityTitle}>
                          <i className="iconfont icon-biao" />
                          <span>{cur.meterName}</span>
                        </div>
                        <div className={styles.electricityInfoBox}>
                          <div>
                            <span>表号：</span>
                            <span>{cur.meterNumber}</span>
                          </div>
                          <div>
                            <span>倍率：</span>
                            <span>{cur.magnification}</span>
                          </div>
                        </div>
                        <div className={styles.electricityTableBox}>
                          <div className={styles.electricityTableHead}>
                            <div>时段</div>
                            <div>起码</div>
                            <div>止码</div>
                            <div>照片</div>
                          </div>
                          <div className={styles.electricityTableBody}>
                            <div className={styles.electricityTableLeft}>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  总
                                </div>
                                <div>
                                  {cur.totalStartCode}
                                </div>
                                {cur.flag1 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'generationDatas', 'totalEndCode', 'type1');
                                      }}
                                      value={cur.totalEndCode}
                                      className={(cur.type1 === 0) ? styles.normalInput : (cur.type1 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type1 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag1 ? styles.electricityErrorStopCode : styles.electricityStopCode}>
                                    {cur.totalEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  尖
                                </div>
                                <div>
                                  {cur.topStartCode}
                                </div>
                                {cur.flag2 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'generationDatas', 'topEndCode', 'type2');
                                      }}
                                      value={cur.topEndCode}
                                      className={(cur.type2 === 0) ? styles.normalInput : (cur.type2 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type2 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag2 ? styles.electricityErrorStopCode : styles.electricityStopCode}>
                                    {cur.topEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  峰
                                </div>
                                <div>
                                  {cur.peakStartCode}
                                </div>
                                {cur.flag3 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'generationDatas', 'peakEndCode', 'type3');
                                      }}
                                      value={cur.peakEndCode}
                                      className={(cur.type3 === 0) ? styles.normalInput : (cur.type3 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type3 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag3 ? styles.electricityErrorStopCode : styles.electricityStopCode}>
                                    {cur.peakEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  平
                                </div>
                                <div>
                                  {cur.flatStartCode}
                                </div>
                                {cur.flag4 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'generationDatas', 'flatEndCode', 'type4');
                                      }}
                                      value={cur.flatEndCode}
                                      className={(cur.type4 === 0) ? styles.normalInput : (cur.type4 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type4 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag4 ? styles.electricityErrorStopCode : styles.electricityStopCode}>
                                    {cur.flatEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  谷
                                </div>
                                <div>
                                  {cur.lowStartCode}
                                </div>
                                {cur.flag5 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, 'generationDatas', 'lowEndCode', 'type5');
                                      }}
                                      value={cur.lowEndCode}
                                      className={(cur.type5 === 0) ? styles.normalInput : (cur.type5 === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(cur.type5 === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                ) : (
                                  <div className={cur.errorFlag5 ? styles.electricityErrorStopCode : styles.electricityStopCode}>
                                    {cur.lowEndCode || '- -'}
                                  </div>
                                )}
                              </div>
                            </div>
                            {cur.imgFlag ? (
                              <div className={`${styles.electricityTablePhoto} ${styles.clear}`}>
                                {cur.meterImgs.map((cur, idx) => {
                                  return (
                                    <div
                                      key={idx.toString()}
                                      onClick={() => {
                                        this.lookPic(index % 2 === 0, index, idx, 'generationDatas');
                                      }}
                                      className={`${styles.electricityPhotoBox} ${styles.fl}`}
                                    >
                                      <img src={cur} alt="" />
                                      <div className={styles.shadeBox} />
                                    </div>
                                  );
                                })}
                                {(cur.meterImgs.length !== 5) && (
                                  <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    headers={{'Authorization': 'bearer ' + authData}}
                                    showUploadList={false}
                                    action={url}
                                    beforeUpload={this.beforeUpload}
                                    onChange={(info) => {this.handleChange(info, index, 'generationDatas');}}
                                  >
                                    <div>
                                      <div className={styles.uploadButton}>
                                        {cur.loading ? <div className={styles.antLoadingText}>上传中</div> : <img src="/img/uploadImg.png" alt=""/>}
                                        {cur.loading ? <Progress strokeColor="#199475" percent={cur.percent} /> : <div className="ant-upload-text">上传图片</div>}
                                      </div>
                                    </div>
                                  </Upload>
                                )}
                              </div>
                            ) : (
                              <div className={styles.electricityNoPhoto}>
                                <img src="/img/noImg.png" alt=""/>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        {zoomVisible && (
          <MeterPicZoom
            getRotateImg={getRotateImg}
            changeStore={changeStore}
            onCancel={this.closePicZoom}
            changeStateFunc={this.changeStateFunc}
            style={styleLocation}
            visible={zoomVisible}
            width={630}
            imgIndex={imgIndex}
            curIndex={curIndex}
            data={readMeterData}
            arrStr={arrStr}
          />
        )}
      </div>
    );
  }
}
