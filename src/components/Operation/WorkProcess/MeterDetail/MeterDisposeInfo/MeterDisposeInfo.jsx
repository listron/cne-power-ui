import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Input, Upload, message, Icon, Progress} from 'antd';
import axios from 'axios';
import CneButton from '@components/Common/Power/CneButton';
import MeterPicZoom from '../MeterPicZoom/MeterPicZoom';
import styles from './meterDisposeInfo.scss';

const dataString = ['总', '尖', '峰', '平', '谷'];
export default class MeterDisposeInfo extends React.Component {
  static propTypes = {
    meterDetail: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      zoomVisible: false,
      styleLocation: {},
      data: [
        {
          arr: [
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
          ],
          loading: false,
          percent: 0,
          imgArr: [],
        }, {
          arr: [
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
          ],
          loading: false,
          percent: 0,
          imgArr: [],
        }, {
          arr: [
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
          ],
          loading: false,
          percent: 0,
          imgArr: [],
        }, {
          arr: [
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
          ],
          loading: false,
          percent: 0,
          imgArr: [],
        }, {
          arr: [
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
            {
              value: 123456.22,
              type: 0,
            },
          ],
          loading: false,
          percent: 0,
          imgArr: [],
        }],
    };
  }

  // 编辑
  onEdit = () => {
  };

  // 取消编辑
  onCancelEdit = () => {
  };

  // 保存编辑
  onSaveEdit = () => {
  };

  // 查看图片
  lookPic = (flag) => {
    console.log(flag, 'flag');
    if (flag) {
      return this.setState({
        zoomVisible: true,
        styleLocation: {
          left: '245px',
        },
      });
    }
    return this.setState({
      zoomVisible: true,
      styleLocation: {
        right: '27%',
      },
    });
  };

  // 关闭查看图片
  closePicZoom = () => {
    this.setState({
      zoomVisible: false,
      styleLocation: {},
    });
  };

  changeStopCode = (e, index, itemIndex) => {
    const {data} = this.state;
    console.log(e.target.value, 'value');
    console.log(index, 'index');
    console.log(itemIndex, 'itemIndex');
    // 改变当前input值
    data[index].arr[itemIndex].value = e.target.value;
    // 改变当前input状态（颜色）
    data[index].arr[itemIndex].type = 1;
    this.setState({
      data,
    });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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

  handleChange = (info, index) => {
    console.log(info, 'info');
    console.log(index, 'index');
    const { data } = this.state;
    if (info.file.status === 'uploading') {
      data[index].loading = true;
      this.setState({
        data,
      });
      if(info.event) {
        console.log(info.event.percent, 'percent');
        data[index].percent = Math.floor(info.event.percent);
        this.setState({
          data,
        });
      }
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => {
        data[index].loading = false;
        data[index].percent = 0;
        data[index].imgArr.push(imageUrl);
        this.setState({
          data,
        });
      });
    }
  };

  render() {
    const {zoomVisible, styleLocation, data} = this.state;
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
          <Link to="/" className={styles.meterRouter}>抄表</Link>
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
          {editStatusBtn}
        </div>
        <div className={styles.disposeContent}>
          <div className={styles.disposeNav}>
            <div className={styles.navPrev}>
              <div className={styles.navPrevName}>
                上次抄表日期
              </div>
              <div className={styles.navPrevTime}>
                2019-10-15
              </div>
            </div>
            <div className={styles.navTime}>
              <div>
                结算月份
              </div>
              <div>
                2019年10月
              </div>
            </div>
            <div className={styles.navNow}>
              <div className={styles.navNowName}>
                本次抄表日期
              </div>
              <div className={styles.navNowTime}>
                2019-10-15
              </div>
            </div>
          </div>
          {/*{noDataRender}*/}
          <div className={styles.gaugeTableBox}>
            <div className={styles.netGaugeTable}>
              <div className={styles.netGaugeTitle}>
                上网计量表
              </div>
              <div className={`${styles.clear} ${styles.netWrap}`}>
                {data.map((cur, index) => {
                  return (
                    <div
                      className={(index % 2 === 0) ? `${styles.netGaugeListBox} ${styles.fl}` : `${styles.netGaugeListBox} ${styles.fr}`}>
                      <div className={styles.netTitle}>
                        <i className="iconfont icon-biao"/>
                        <span>110kV关口主表</span>
                      </div>
                      <div className={styles.netInfoBox}>
                        <div>
                          <span>表号：</span>
                          <span>12345678</span>
                        </div>
                        <div>
                          <span>倍率：</span>
                          <span>10000</span>
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
                            {cur.arr.map((item, itemIndex) => {
                              return (
                                <div className={styles.netTableTr}>
                                  <div>
                                    {dataString[itemIndex]}
                                  </div>
                                  <div>
                                    123456.22
                                  </div>
                                  <div className={styles.netEditStopCode}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        this.changeStopCode(e, index, itemIndex);
                                      }}
                                      value={item.value}
                                      className={(item.type === 0) ? styles.normalInput : (item.type === 1 ? styles.warnInput : styles.errorInput)}
                                      placeholder="请输入"
                                    />
                                    {(item.type === 2) && <div className={styles.errorTip}>最多6位整数+2位小数</div>}
                                  </div>
                                  {/*<div className={styles.netStopCode}>*/}
                                  {/*123456.22*/}
                                  {/*</div>*/}
                                </div>
                              );
                            })}
                          </div>
                          {/*<div className={styles.netNoPhoto}>*/}
                          {/*<img src="/img/noImg.png" alt=""/>*/}
                          {/*</div>*/}
                          <div className={`${styles.netTablePhoto} ${styles.clear}`}>
                            {cur.imgArr.map((cur, idx) => {
                              return (
                                <div
                                  onClick={() => {
                                    this.lookPic(index % 2 === 0);
                                  }}
                                  className={`${styles.netPhotoBox} ${styles.fl}`}
                                >
                                  <img src={cur} alt=""/>
                                  <div className={styles.shadeBox}/>
                                </div>
                              );
                            })}
                            {(cur.imgArr.length !== 5) && (
                              <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={this.beforeUpload}
                                onChange={(info) => {this.handleChange(info, index);}}
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
                {data.map((cur, index) => {
                  return (
                    <div
                      className={(index % 2 === 0) ? `${styles.electricityGaugeListBox} ${styles.fl}` : `${styles.electricityGaugeListBox} ${styles.fr}`}>
                      <div className={styles.electricityTitle}>
                        <i className="iconfont icon-biao"/>
                        <span>110kV关口主表</span>
                      </div>
                      <div className={styles.electricityInfoBox}>
                        <div>
                          <span>表号：</span>
                          <span>12345678</span>
                        </div>
                        <div>
                          <span>倍率：</span>
                          <span>10000</span>
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
                                123456.22
                              </div>
                              <div>
                                123456.22
                              </div>
                            </div>
                            <div className={styles.electricityTableTr}>
                              <div>
                                尖
                              </div>
                              <div>
                                12345.20
                              </div>
                              <div>
                                12345.20
                              </div>
                            </div>
                            <div className={styles.electricityTableTr}>
                              <div>
                                峰
                              </div>
                              <div>
                                12345.27
                              </div>
                              <div>
                                12345.27
                              </div>
                            </div>
                            <div className={styles.electricityTableTr}>
                              <div>
                                平
                              </div>
                              <div>
                                1234.20
                              </div>
                              <div>
                                --
                              </div>
                            </div>
                            <div className={styles.electricityTableTr}>
                              <div>
                                谷
                              </div>
                              <div>
                                34445.98
                              </div>
                              <div>
                                --
                              </div>
                            </div>
                          </div>
                          {/*<div className={styles.electricityNoPhoto}>*/}
                          {/*<img src="/img/noImg.png" alt=""/>*/}
                          {/*</div>*/}
                          <div className={`${styles.electricityTablePhoto} ${styles.clear}`}>
                            {data.map((cur, idx) => {
                              return (
                                <div
                                  onClick={() => {
                                    this.lookPic(index % 2 === 0);
                                  }}
                                  className={(idx % 2 === 0) ? `${styles.electricityPhotoBox} ${styles.fl}` : `${styles.electricityPhotoBox} ${styles.fr}`}
                                >
                                  <img src="/img/pic3.png" alt=""/>
                                  <div className={styles.shadeBox}/>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <MeterPicZoom
          onCancel={this.closePicZoom}
          style={styleLocation}
          visible={zoomVisible}
          width={630}
        />
      </div>
    );
  }
}
