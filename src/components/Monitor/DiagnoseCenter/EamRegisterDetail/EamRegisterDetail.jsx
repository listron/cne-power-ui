import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import moment from 'moment';
import CneFooter from '@components/Common/Power/CneFooter';
import CneTable from '@components/Common/Power/CneTable';

import styles from './eamRegisterDetail.scss';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export default class EamRegisterDetail extends Component {
  static propTypes = {
    history: PropTypes.object,
    diagLoading: PropTypes.bool,
    detailLoading: PropTypes.bool,
    theme: PropTypes.string,
    getEamFaultDetails: PropTypes.func,
    getEamDefectDetails: PropTypes.func,
    eamFaultData: PropTypes.object,
    eamDefectData: PropTypes.object,
    workOrderList: PropTypes.array,
    eamDiagList: PropTypes.array,
    bgcIndex: PropTypes.number,
    changeStore: PropTypes.func,
    eamDetailParams: PropTypes.object,
  };

  constructor(props){
    super(props);
    this.state = {
      scroll: false,
      baseFlag: true,
      tableFlag: true,
    };
  }

  componentDidMount() {
    const main = document.getElementById('main');
    // 监听页面滚动
    main.addEventListener('scroll', this.bindScroll);
  }

  componentWillUnmount() { // 卸载的时候要注意
    const main = document.getElementById('main');
    main && main.removeEventListener('scroll', this.bindScroll, false);
  }

  bindScroll = () => {
    const main = document.getElementById('main');
    const scrollTop = main.scrollTop;
    const { scroll } = this.state;
    if (scrollTop > 0 && !scroll) {
      this.setState({ scroll: !scroll });
    }
    if (scrollTop === 0) {
      this.setState({ scroll: false });
    }
  };

  // 返回诊断中心
  onCancelEdit = () => {
    const { changeStore } = this.props;
    changeStore({showEamPage: false});
  };

  // 基本信息
  baseFlagFunc = () => {
    const { baseFlag } = this.state;
    this.setState({
      baseFlag: !baseFlag,
    });
  };

  // 关联工单
  tableFlagFunc = () => {
    const { tableFlag } = this.state;
    this.setState({
      tableFlag: !tableFlag,
    });
  };

  // 信息展示
  eamInfo = () => {
    const { eamDetailParams: {
      eventName,
      eventDesc,
      deviceTypeName,
      deviceName,
      stationName,
    }} = this.props;
    return (
      <div className={styles.eamInfo}>
        <b style={{marginLeft: '20px'}}>告警事件：</b><span>{eventName || '- -'}；</span>
        <b>告警描述：</b><span>{eventDesc || '- -'}；</span>
        <b>设备类型：</b><span>{deviceTypeName || '- -'}；</span>
        <b>设备名称：</b><span>{deviceName || '- -'}；</span>
        <b>电站名称：</b><span>{stationName || '- -'}；</span>
      </div>
    );
  };

  // 查看EAM工单详情
  lookEamDetailsFunc = (record) => {
    const { workOrderNo } = record;
    const { history } = this.props;
    workOrderNo && history.push(`/operation/eamDetails?workOrderNo=${workOrderNo}`);
  };

  // 查看EAM故障列表
  lookEamDiagFunc = (record, index) => {
    const { changeStore, getEamFaultDetails, getEamDefectDetails, eamDetailParams: { type } } = this.props;
    // type：1位故障详情，2位缺陷详情
    if(type === 1) {
      getEamFaultDetails({
        faultId: record.id,
      });
    }
    if(type === 2) {
      getEamDefectDetails({
        defectId: record.id,
      });
    }
    changeStore({
      bgcIndex: index,
    });
  };

  render() {
    const { scroll, baseFlag, tableFlag } = this.state;
    const {
      theme,
      diagLoading,
      detailLoading,
      eamFaultData: { // 获取EAM故障详情
        faultNo,
        stationName1: faultStationName1,
        stationName2: faultStationName2,
        stopType,
        assetNo1: faultAssetNo1,
        assetNo2: faultAssetNo2,
        location1: faultLocation1,
        location2: faultLocation2,
        faultCode1,
        faultCode2,
        manufacturer,
        model,
        faultLevel,
        faultSysType1,
        faultSysType2,
        monitorSysFault,
        status: faultStatus,
        createName: faultCreateName,
        createTime: faultCreateTime,
        faultStartTime: warnStartTime,
        faultEndTime,
        reason,
      },
      eamDefectData: {
        defectNo,
        stationName1,
        stationName2,
        defectType,
        assetNo1,
        assetNo2,
        location1,
        location2,
        defectDetail,
        status,
        createName,
        createTime,
        projectSource,
        phone,
        faultStartTime,
        woprofess,
      },
      workOrderList,
      eamDiagList,
      bgcIndex,
      eamDetailParams: { type }
    } = this.props;
    const listColumn = [
      {
        title: '工单编号',
        width: '14%',
        dataIndex: 'workOrderNo',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单描述',
        dataIndex: 'workOrderDesc',
        width: '42%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '设备名称',
        dataIndex: 'assetName',
        width: '27%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '状态',
        dataIndex: 'status',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '查看',
        dataIndex: '查看',
        width: '5%',
        align: 'center',
        className: styles.textAlignName,
        render: (text, record) => (
          <div title="查看" className={styles.listLookBox} >
            <i onClick={() => this.lookEamDetailsFunc(record)} className="iconfont icon-look" />
          </div>
        ),
      },
    ];
    const faultColumn = [
      {
        title: '故障编号',
        width: '25%',
        dataIndex: 'faultNo',
        render: (text, record, index) => (<div className={bgcIndex === index ? styles.activeBgc : styles.normalBgc} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单编号',
        dataIndex: 'workOrderNo',
        width: '25%',
        render: (text, record, index) => (<div className={bgcIndex === index ? styles.activeBgc : styles.normalBgc} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '故障类型',
        dataIndex: 'faultType',
        width: '25%',
        render: (text, record, index) => (<div className={bgcIndex === index ? styles.activeBgc : styles.normalBgc} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '故障开始时间',
        dataIndex: 'faultStartTime',
        width: '15%',
        render: (text, record, index) => (<div className={bgcIndex === index ? styles.activeBgc : styles.normalBgc} title={text || ''} >{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '- -'}</div>),
      }, {
        title: '查看',
        dataIndex: '5',
        width: '10%',
        align: 'center',
        className: styles.textAlignName,
        render: (text, record, index) => (
          <div title="查看" className={bgcIndex === index ? `${styles.activeBgc} ${styles.listLookBox}` : `${styles.normalBgc} ${styles.listLookBox}`}>
            <i onClick={() => this.lookEamDiagFunc(record, index)} className="iconfont icon-downlook" />
          </div>
        ),
      },
    ];
    return (
      <div className={`${styles.eamRegisterBox} ${theme}`}>
        <div className={styles.eamRegisterTop} style={ scroll ? {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        } : {}} >
          <div className={styles.eamRegisterTitle}>
            <div className={styles.titleBox}>
              <i className="iconfont icon-keam" />
            </div>
            <span className={styles.eamLook}>EAM查看</span>
            {this.eamInfo()}
          </div>
          <div className={styles.btnBack} onClick={this.onCancelEdit}>
            <i className="iconfont icon-fanhui" />
          </div>
        </div>
        <div className={styles.eamRegisterContent}>
          <div className={styles.eamRegisterCenter}>
            <div className={styles.eamTopTitle}>
              <div>
                <i className="iconfont icon-gdxq" />
                <span>EAM故障列表</span>
              </div>
              <div>
                {`合计：${eamDiagList ? eamDiagList.length : 0}`}
              </div>
            </div>
            <div className={styles.faultListBox}>
              <CneTable
                loading={diagLoading}
                columns={faultColumn}
                dataSource={eamDiagList || []}
                rowKey={(record, index) => index || 'key'}
                pagination={false}
                locale={{ emptyText: '暂无数据'}}
              />
            </div>
            <div className={styles.recordDetails}>
              <i className="iconfont icon-gdxq" />
              <span>{`EAM ${type === 1 ? '故障' : '缺陷'}记录详情`}</span>
            </div>
            {diagLoading || detailLoading ? <div className={styles.detailsLoadingBox}>
              <Spin />
            </div> : <div className={styles.eamRegisterWrap}>
              {type === 1 && (
                <div className={styles.eamRegisterInfoBox}>
                  <div className={styles.tableBar}>
                    <div className={styles.barProcess}>
                      故障基本信息
                    </div>
                    <i onClick={this.baseFlagFunc} className={baseFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                  </div>
                  {baseFlag && <div className={styles.tableWrap}>
                    <div className={styles.tableBox}>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          编号
                        </div>
                        <div className={styles.numberCode}>
                          {faultNo || '- -'}
                        </div>
                        <div className={styles.statusName}>
                          状态
                        </div>
                        <div className={styles.statusCode}>
                          {faultStatus || '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          电场(站)名称
                        </div>
                        <div className={styles.numberCode}>
                          <span>{faultStationName1 || '- -'}</span>
                          <i className="iconfont icon-rightarr" />
                          <span>{faultStationName2 || '- -'}</span>
                        </div>
                        <div className={styles.statusName}>
                          创建人
                        </div>
                        <div className={styles.statusCode}>
                          {faultCreateName || '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          故障类型
                        </div>
                        <div className={styles.numberCode}>
                          {stopType || '- -'}
                        </div>
                        <div className={styles.statusName}>
                          创建时间
                        </div>
                        <div className={styles.statusCode}>
                          {faultCreateTime ? moment(faultCreateTime).format(dateFormat) : '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          设备编码
                        </div>
                        <div className={styles.numberCode}>
                          <span>{faultAssetNo1 || '- -'}</span>
                          <i className="iconfont icon-rightarr" />
                          <span>{faultAssetNo2 || '- -'}</span>
                        </div>
                        <div className={styles.statusName}>
                          故障开始时间
                        </div>
                        <div className={styles.statusCode}>
                          {warnStartTime ? moment(warnStartTime).format(dateFormat) : '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          资产标识
                        </div>
                        <div className={styles.numberCode}>
                          <span>{faultLocation1 || '- -'}</span>
                          <i className="iconfont icon-rightarr" />
                          <span>{faultLocation2 || '- -'}</span>
                        </div>
                        <div className={styles.statusName}>
                          恢复运行时间
                        </div>
                        <div className={styles.statusCode}>
                          {faultEndTime ? moment(faultEndTime).format(dateFormat) : '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.tableMoreBox}>
                          <div className={styles.tableMoreTd}>
                            <div className={styles.tableMoreName}>
                              故障代码
                            </div>
                            <div className={styles.tableMoreCode}>
                              <span>{faultCode1 || '- -'}</span>
                              <i className="iconfont icon-rightarr" />
                              <span>{faultCode2 || '- -'}</span>
                            </div>
                          </div>
                          <div className={styles.tableMoreTd}>
                            <div className={styles.tableMoreName}>
                              设备厂商
                            </div>
                            <div className={styles.tableMoreCode}>
                              {manufacturer || '- -'}
                            </div>
                          </div>
                          <div className={`${styles.tableMoreTd} ${styles.deleteBorderBottom}`}>
                            <div className={styles.tableMoreName}>
                              设备型号
                            </div>
                            <div className={styles.tableMoreCode}>
                              {model || '- -'}
                            </div>
                          </div>
                        </div>
                        <div className={styles.statusName}>
                          故障原因
                        </div>
                        <div className={styles.statusCode}>
                          {reason || '- -'}
                        </div>
                      </div>
                      <div className={`${styles.tableTr} ${styles.deleteBorderBottom}`}>
                        <div className={styles.tableMoreBox}>
                          <div className={styles.tableMoreTd}>
                            <div className={styles.tableMoreName}>
                              故障等级
                            </div>
                            <div className={styles.tableMoreCode}>
                              {faultLevel || '- -'}
                            </div>
                          </div>
                          <div className={`${styles.tableMoreTd} ${styles.deleteBorderBottom}`}>
                            <div className={styles.tableMoreName}>
                              故障系统分类
                            </div>
                            <div className={styles.tableMoreCode}>
                              <span>{faultSysType1 || '- -'}</span>
                              <i className="iconfont icon-rightarr" />
                              <span>{faultSysType2 || '- -'}</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.statusName}>
                          监视系统显示故障
                        </div>
                        <div className={styles.statusCode}>
                          {monitorSysFault || '- -'}
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>
              )}
              {type === 2 && (
                <div className={styles.eamRegisterInfoBox}>
                  <div className={styles.tableBar}>
                    <div className={styles.barProcess}>
                      缺陷基本信息
                    </div>
                    <i onClick={this.baseFlagFunc} className={baseFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                  </div>
                  {baseFlag && <div className={styles.tableWrap}>
                    <div className={styles.tableBox}>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          编号
                        </div>
                        <div className={styles.numberCode}>
                          {defectNo || '- -'}
                        </div>
                        <div className={styles.statusName}>
                          状态
                        </div>
                        <div className={styles.statusCode}>
                          {status || '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          电场(站)名称
                        </div>
                        <div className={styles.numberCode}>
                          <span>{stationName1 || '- -'}</span>
                          <i className="iconfont icon-rightarr" />
                          <span>{stationName2 || '- -'}</span>
                        </div>
                        <div className={styles.statusName}>
                          创建人
                        </div>
                        <div className={styles.statusCode}>
                          {createName || '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          缺陷类别
                        </div>
                        <div className={styles.numberCode}>
                          {defectType || '- -'}
                        </div>
                        <div className={styles.statusName}>
                          创建时间
                        </div>
                        <div className={styles.statusCode}>
                          {createTime ? moment(createTime).format(dateFormat) : '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          工单专业
                        </div>
                        <div className={styles.numberCode}>
                          {woprofess || '- -'}
                        </div>
                        <div className={styles.statusName}>
                          所属巡检项目名称
                        </div>
                        <div className={styles.statusCode}>
                          {projectSource || '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          设备编码
                        </div>
                        <div className={styles.numberCode}>
                          <span>{assetNo1 || '- -'}</span>
                          <i className="iconfont icon-rightarr" />
                          <span>{assetNo2 || '- -'}</span>
                        </div>
                        <div className={styles.statusName}>
                          联系电话
                        </div>
                        <div className={styles.statusCode}>
                          {phone || '- -'}
                        </div>
                      </div>
                      <div className={styles.tableTr}>
                        <div className={styles.numberName}>
                          资产标识
                        </div>
                        <div className={styles.numberCode}>
                          <span>{location1 || '- -'}</span>
                          <i className="iconfont icon-rightarr" />
                          <span>{location2 || '- -'}</span>
                        </div>
                        <div className={styles.statusName}>
                          缺陷发现时间
                        </div>
                        <div className={styles.statusCode}>
                          {faultStartTime ? moment(faultStartTime).format(dateFormat) : '- -'}
                        </div>
                      </div>
                      <div className={`${styles.tableTr} ${styles.deleteBorderBottom}`}>
                        <div className={styles.numberName}>
                          缺陷详情
                        </div>
                        <div className={styles.allText}>
                          {defectDetail || '- -'}
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>
              )}
              <div className={styles.commonInfoBox}>
                <div className={styles.tableBar}>
                  <div className={styles.barProcess}>
                    {`${type === 1 ? '故障' : '缺陷'}关联的工单`}
                  </div>
                  <div className={styles.commonIconBox}>
                    <span>{`合计：${workOrderList ? workOrderList.length : 0}`}</span>
                    <i onClick={this.tableFlagFunc} className={tableFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                  </div>
                </div>
                {tableFlag && <div className={styles.commonWrap}>
                  <CneTable
                    loading={detailLoading}
                    columns={listColumn}
                    dataSource={workOrderList || []}
                    rowKey={(record, index) => index || 'key'}
                    pagination={false}
                    locale={{ emptyText: '暂无数据'}}
                  />
                </div>}
              </div>
            </div>}
          </div>
        </div>
        <CneFooter />
      </div>
    );
  }
}
