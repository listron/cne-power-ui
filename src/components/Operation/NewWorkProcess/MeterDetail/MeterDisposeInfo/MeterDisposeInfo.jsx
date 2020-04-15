import React from 'react';
import PropTypes from 'prop-types';
import {Input, Upload, Progress, DatePicker} from 'antd';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
import MeterPicZoom from '../MeterPicZoom/MeterPicZoom';
import path from '@path';
import styles from './meterDisposeInfo.scss';
import {dataFormats} from '@utils/utilFunc';

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
    newReadMeterData: PropTypes.object,
    otherReadMeterData: PropTypes.object,
    readLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      zoomVisible: false,
      styleLocation: '',
      changeDateFlag: false,
      imgIndex: '', // 当前图片下标
      curIndex: '', // 当前表格下标
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
    const { changeStore, otherReadMeterData } = this.props;
    this.setState({
      changeDateFlag: false,
    }, () => {
      changeStore({
        editFlag: false,
        thisReadTimeFlag: false,
        readMeterData: {
          ...otherReadMeterData, // 用备份数组恢复默认
        },
      });
    });
  };

  // 保存编辑
  onSaveEdit = () => {
    const {
      newReadMeterData: {
        readmeterId,
        docketId,
        lastReadTime,
        thisReadTime,
        settleMonth,
        onlineDatas,
        generationDatas,
      },
      readMeterData, // 判断是否有输入的值有错误的
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
    // 参数
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
    //
    let flag = true;
    // 合并上网计量表和发电计量表
    readMeterData.onlineDatas.concat(readMeterData.generationDatas).forEach(cur => {
      // 判断每个表的止码是否填写错误
      if(cur.type1 === 2 || cur.type2 === 2 || cur.type3 === 2 || cur.type4 === 2 || cur.type5 === 2) {
        flag = false;
      }
    });
    // 请求
    if(flag) {
      // 保存修改
      getSaveAction(params);
    }
  };

  // 查看图片
  lookPic = (flag, curIndex, imgIndex, str) => {
    const { curIndex: thisIndex, imgIndex: thisImgIndex } = this.state;
    // // 判断如果当前图片二次点击关闭弹框
    if(curIndex === thisIndex && imgIndex === thisImgIndex) {
      return this.setState({
        zoomVisible: false,
        styleLocation: '',
        imgIndex: '',
        curIndex: '',
      });
    }
    if (flag) {
      return this.setState({
        zoomVisible: true,
        styleLocation: 'left',
        imgIndex,
        curIndex,
        arrStr: str,
      });
    }
    return this.setState({
      zoomVisible: true,
      styleLocation: 'right',
      imgIndex,
      curIndex,
      arrStr: str,
    });
  };

  // 关闭查看图片
  closePicZoom = () => {
    this.setState({
      zoomVisible: false,
      styleLocation: '',
      imgIndex: '',
      curIndex: '',
      arrStr: '',
    });
  };

  // 改变输入框
  changeStopCode = (e, index, arrStr, filed, type) => {
    const { readMeterData, newReadMeterData, otherReadMeterData, changeStore } = this.props;
    /**
     * readMeterData 可以修改的和渲染用
     * otherReadMeterData 作对比用
     * newReadMeterData 最后传给后端的数据
     * */
    // 判断最多是6位整数和两位小数
    const reg = /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/;
    // 小数点正则
    const pointReg = /(^[0-9]{1,6}[\.]{1}$)/;
    // 判断输入只能是数字
    const numberReg = /^\d+(\.\d+)?$/;
    // 改变当前input值
    // e当前event对象
    // index当前表格
    // arrStr需要改变的数组
    // filed需要改变的value
    // type 样式类型
    readMeterData[arrStr][index][filed] = e.target.value === '' || !numberReg.test(e.target.value) ? e.target.value : Number(e.target.value);
    readMeterData[arrStr][index][type] = pointReg.test(e.target.value) || reg.test(e.target.value) ? 0 : (e.target.value === '' ? 1 : 2);
    // 判断当前改变输入框的值和otherReadMeterData里面当前的值对比是否一样
    // 一样是-1，不一样就是当前e.target.value
    if(e.target.value !== '' && Number(e.target.value) === otherReadMeterData[arrStr][index][filed]) {
      // 修改当前值为-1
      newReadMeterData[arrStr][index][filed] = -1;
      changeStore({newReadMeterData});
    }else {
      // 修改当前值为e.target.value
      newReadMeterData[arrStr][index][filed] = e.target.value === '' ? e.target.value : Number(e.target.value);
      changeStore({newReadMeterData});
    }
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
    const { readMeterData, changeStore, newReadMeterData } = this.props;
    if (info.file.status === 'uploading') {
      // 改变上传状态
      readMeterData[arrStr][index].loading = true;
      changeStore({
        readMeterData,
        newReadMeterData,
      });
      if(info.event) {
        // 改变上传进度
        readMeterData[arrStr][index].percent = Math.floor(info.event.percent);
        changeStore({
          readMeterData,
          newReadMeterData,
        });
      }
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // 上传保存图片url->恢复默认
      readMeterData[arrStr][index].loading = false;
      readMeterData[arrStr][index].percent = 0;
      readMeterData[arrStr][index].meterImgs.push({
        url: info.file.response.data,
        imgId: '',
      });
      // 发送后端的数据
      newReadMeterData[arrStr][index].meterImgs.push({
        url: info.file.response.data,
        updateSign: 1,
        imgId: '',
      });
      changeStore({
        readMeterData,
        newReadMeterData,
      });
    }
  };

  dateChange = (date) => {
    const { readMeterData, newReadMeterData, changeStore } = this.props;
    this.setState({
      changeDateFlag: true,
    }, () => {
      changeStore({
        readMeterData: { // 原始数据
          ...readMeterData,
          thisReadTime: date,
        },
        newReadMeterData: { // 改变传送后端的数据
          ...newReadMeterData,
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

  meterSetFunc = () => {
    // 跳转到抄表设置/operation/running/meterReadSet
    const {
      meterBaseData: {
        stationCode,
        stationName,
      },
    } = this.props;
    // 跳转参数
    const params = {
      stationCode,
      stationName,
      showPage: 'singleStation',
    };
    window.open(`/#/operation/running/meterReadSet?searchParams=${JSON.stringify(params)}`, '_blank');
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
      newReadMeterData,
      readLoading,
    } = this.props;
    const url = `${APIBasePath}${ticket.getUploadFile}`;
    const authData = localStorage.getItem('authData') || '';
    // 没有电表数据
    const noDataRender = (
      <div className={styles.disposeNoDataBox}>
        <div className={styles.noDataIcon}>
          <i className="iconfont icon-biao" />
        </div>
        <div className={styles.noDataText}>
          还没有电表，请先配置电表。
        </div>
        <div className={styles.noDataRouter}>
          <span>点击前往：运维管理-电站运行-</span>
          <div onClick={this.meterSetFunc} className={styles.meterRouter}>抄表设置</div>
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
          <i className="iconfont icon-save" />
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
          <i className="iconfont icon-edit" />
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
          {processActionData.filter(cur => cur.actionCode === '4' && cur.isPermission === 0).length > 0 && (editFlag ? editStatusBtn : normalStatusBtn)}
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
          {(onlineDatas.length === 0 && generationDatas.length === 0) ? (readLoading ? '' : noDataRender) : (
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
                                  {dataFormats(cur.totalStartCode, '--', -1)}
                                </div>
                                {cur.flag1 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.totalEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  尖
                                </div>
                                <div>
                                  {dataFormats(cur.topStartCode, '--', -1)}
                                </div>
                                {cur.flag2 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.topEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  峰
                                </div>
                                <div>
                                  {dataFormats(cur.peakStartCode, '--', -1)}
                                </div>
                                {cur.flag3 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.peakEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  平
                                </div>
                                <div>
                                  {dataFormats(cur.flatStartCode, '--', -1)}
                                </div>
                                {cur.flag4 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.flatEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.netTableTr}>
                                <div>
                                  谷
                                </div>
                                <div>
                                  {dataFormats(cur.lowStartCode, '--', -1)}
                                </div>
                                {cur.flag5 ? (
                                  <div className={styles.netEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.lowEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                            </div>
                            {cur.imgFlag ? (
                              <div className={styles.netTablePhotoBox}>
                                <div className={`${styles.netTablePhoto} ${styles.clear}`}>
                                  {cur.meterImgs.map((cur, idx) => {
                                    return (
                                      <div
                                        key={idx.toString()}
                                        onClick={() => {
                                          this.lookPic(index % 2 === 0, index, idx, 'onlineDatas');
                                        }}
                                        className={arrStr === 'onlineDatas' && curIndex === index && idx === imgIndex ? `${styles.netActivePhotoBox} ${styles.fl}` : `${styles.netPhotoBox} ${styles.fl}`}
                                      >
                                        <img src={cur.url} alt="" />
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
                                          {cur.loading ? <div className={styles.antLoadingText}>上传中</div> : <img src="/img/uploadImg.png" alt="" />}
                                          {cur.loading ? <Progress strokeColor="#199475" percent={cur.percent} /> : <div className="ant-upload-text">上传图片</div>}
                                        </div>
                                      </div>
                                    </Upload>
                                  )}
                                </div>
                              </div>
                            ) : cur.meterImgs.length > 0 ? (
                                <div className={styles.netTablePhotoBox}>
                                  <div className={`${styles.netTablePhoto} ${styles.clear}`}>
                                    {cur.meterImgs.map((cur, idx) => {
                                      return (
                                        <div
                                          key={idx.toString()}
                                          onClick={() => {
                                            this.lookPic(index % 2 === 0, index, idx, 'onlineDatas');
                                          }}
                                          className={arrStr === 'onlineDatas' && curIndex === index && idx === imgIndex ? `${styles.netActivePhotoBox} ${styles.fl}` : `${styles.netPhotoBox} ${styles.fl}`}
                                        >
                                          <img src={cur.url} alt="" />
                                          <div className={styles.shadeBox} />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ): (
                                <div className={styles.netNoPhoto}>
                                  <img src="/img/noImg.png" alt="" />
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
                                  {dataFormats(cur.totalStartCode, '--', -1)}
                                </div>
                                {cur.flag1 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.totalEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  尖
                                </div>
                                <div>
                                  {dataFormats(cur.topStartCode, '--', -1)}
                                </div>
                                {cur.flag2 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.topEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  峰
                                </div>
                                <div>
                                  {dataFormats(cur.peakStartCode, '--', -1)}
                                </div>
                                {cur.flag3 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.peakEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  平
                                </div>
                                <div>
                                  {dataFormats(cur.flatStartCode, '--', -1)}
                                </div>
                                {cur.flag4 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.flatEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                              <div className={styles.electricityTableTr}>
                                <div>
                                  谷
                                </div>
                                <div>
                                  {dataFormats(cur.lowStartCode, '--', -1)}
                                </div>
                                {cur.flag5 ? (
                                  <div className={styles.electricityEditStopCode}>
                                    <Input
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
                                    {dataFormats(cur.lowEndCode, '--', -1)}
                                  </div>
                                )}
                              </div>
                            </div>
                            {cur.imgFlag ? (
                              <div className={styles.electricityTablePhotoBox}>
                                <div className={`${styles.electricityTablePhoto} ${styles.clear}`}>
                                  {cur.meterImgs.map((cur, idx) => {
                                    return (
                                      <div
                                        key={idx.toString()}
                                        onClick={() => {
                                          this.lookPic(index % 2 === 0, index, idx, 'generationDatas');
                                        }}
                                        className={arrStr === 'generationDatas' && curIndex === index && idx === imgIndex ? `${styles.electricityActivePhotoBox} ${styles.fl}` : `${styles.electricityPhotoBox} ${styles.fl}`}
                                      >
                                        <img src={cur.url} alt="" />
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
                                          {cur.loading ? <div className={styles.antLoadingText}>上传中</div> : <img src="/img/uploadImg.png" alt="" />}
                                          {cur.loading ? <Progress strokeColor="#199475" percent={cur.percent} /> : <div className="ant-upload-text">上传图片</div>}
                                        </div>
                                      </div>
                                    </Upload>
                                  )}
                                </div>
                              </div>
                            ) : cur.meterImgs.length > 0 ? (
                              <div className={styles.electricityTablePhotoBox}>
                                <div className={`${styles.electricityTablePhoto} ${styles.clear}`}>
                                  {cur.meterImgs.map((cur, idx) => {
                                    return (
                                      <div
                                        key={idx.toString()}
                                        onClick={() => {
                                          this.lookPic(index % 2 === 0, index, idx, 'generationDatas');
                                        }}
                                        className={arrStr === 'generationDatas' && curIndex === index && idx === imgIndex ? `${styles.electricityActivePhotoBox} ${styles.fl}` : `${styles.electricityPhotoBox} ${styles.fl}`}
                                      >
                                        <img src={cur.url} alt="" />
                                        <div className={styles.shadeBox} />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              ) : (
                              <div className={styles.electricityNoPhoto}>
                                <img src="/img/noImg.png" alt="" />
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
            editFlag={editFlag}
            changeStore={changeStore}
            onCancel={this.closePicZoom}
            changeStateFunc={this.changeStateFunc}
            tipClassname={styleLocation === 'left' ? styles.modalLeft : styles.modalRight}
            visible={zoomVisible}
            width={630}
            imgIndex={imgIndex}
            curIndex={curIndex}
            data={readMeterData}
            newReadMeterData={newReadMeterData}
            arrStr={arrStr}
          />
        )}
      </div>
    );
  }
}
