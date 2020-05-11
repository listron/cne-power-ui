import React from 'react';
import PropTypes from 'prop-types';
import CneFooter from '@components/Common/Power/CneFooter';
import CneTable from '@components/Common/Power/CneTable';
import {Spin, Checkbox} from 'antd';
import moment from 'moment';

import styles from './eamDetail.scss';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';


export default class EamDetail extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
    loading: PropTypes.bool,
    getEamDetails: PropTypes.func,
    changeStore: PropTypes.func,
    eamDetailData: PropTypes.object,
    workOrderNo: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      scroll: false,
      baseFlag: true, // 工单基本信息
      defectFlag: true, // 缺陷-检修交代
      faultFlag: true, // 故障-检修交代
      processFlag: true, // 检修过程记录
      deviceFlag: true, // 相关设备
      workFlag: true, // 工作票
      operationFlag: true, // 操作票
      pickListFlag: true, // 关联的领料单
      detailFlag: true, // 领料明细
      childFlag: true, // 子工单
    };
  }

  componentDidMount() {
    const { getEamDetails, workOrderNo } = this.props;
    const main = document.getElementById('main');
    // 监听页面滚动
    main.addEventListener('scroll', this.bindScroll);
    // 获取EAM详情
    workOrderNo && getEamDetails({workOrderNo});
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

  // 返回
  onCancelEdit = () => {
    const { changeStore } = this.props;
    changeStore({
      detailFlag: false,
    });
  };

  // 工单基本信息
  baseFlagFunc = () => {
    const { baseFlag } = this.state;
    this.setState({
      baseFlag: !baseFlag,
    });
  };

  // 缺陷-检修交代
  defectFlagFunc = () => {
    const { defectFlag } = this.state;
    this.setState({
      defectFlag: !defectFlag,
    });
  };

  // 故障-检修交代
  faultFlagFunc = () => {
    const { faultFlag } = this.state;
    this.setState({
      faultFlag: !faultFlag,
    });
  };

  // 检修过程记录
  processFlagFunc = () => {
    const { processFlag } = this.state;
    this.setState({
      processFlag: !processFlag,
    });
  };

  // 相关设备
  deviceFlagFunc = () => {
    const { deviceFlag } = this.state;
    this.setState({
      deviceFlag: !deviceFlag,
    });
  };

  // 工作票
  workFlagFunc = () => {
    const { workFlag } = this.state;
    this.setState({
      workFlag: !workFlag,
    });
  };

  // 操作票
  operationFlagFunc = () => {
    const { operationFlag } = this.state;
    this.setState({
      operationFlag: !operationFlag,
    });
  };

  // 关联的领料单
  pickListFlagFunc = () => {
    const { pickListFlag } = this.state;
    this.setState({
      pickListFlag: !pickListFlag,
    });
  };

  // 领料明细
  detailFlagFunc = () => {
    const { detailFlag } = this.state;
    this.setState({
      detailFlag: !detailFlag,
    });
  };

  // 子工单
  childFlagFunc = () => {
    const { childFlag } = this.state;
    this.setState({
      childFlag: !childFlag,
    });
  };

  render() {
    const {
      scroll,
      baseFlag, // 工单基本信息
      defectFlag, // 缺陷-检修交代
      faultFlag, // 故障-检修交代
      processFlag, // 检修过程记录
      deviceFlag, // 相关设备
      workFlag, // 工作票
      operationFlag, // 操作票
      pickListFlag, // 关联的领料单
      detailFlag, // 领料明细
      childFlag, // 子工单
    } = this.state;
    const {
      theme,
      loading,
      eamDetailData: {
        workOrder: {
          workOrderNo,
          assetNo1,
          assetNo2,
          status,
          stationName1,
          stationName2,
          location1,
          location2,
          createName,
          woprofess,
          isPick,
          createTime,
          workOrderType,
          stopCheck1,
          stopCheck2,
          parentWorkOrderNo,
          workOrderDesc,
          operName1,
          operName2,
          closeTime,
          faultLevel,
          clientName1,
          clientName2,
          faultDiscoverTime,
          checkName,
          workStartTime,
          workEndTime,
          leadName,
          reason,
          content,
          overRhaulsy,
          overRhaulys,
          conclusion,
          overhaulbj,
          designFault,
          dayMaintenanceFault,
          partQualityFault,
          environmentFault,
          powerGridFault,
          otherFault,
          faultStartTime,
          faultEndTime,
          keeplength,
          faultCode1,
          faultCode2,
          faultSource,
          overRhaulby,
        },
        jcx,
        assets,
        works,
        operations,
        peaks,
        peakDetails,
        childOrders,
      },
    } = this.props;
    const listColumn1 = [
      {
        title: '序号',
        width: '8%',
        dataIndex: 'number',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '检查项(设备名称)',
        dataIndex: 'assetName',
        width: '18%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '异常类别',
        dataIndex: 'exceptionType',
        width: '16%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '是否为故障主要原因',
        dataIndex: 'isFaultMainReason',
        width: '14%',
        className: styles.textAlignName,
        render: (text) => (<div title={text === null ? '' : (text === '1' ? '是' : '否')} >{text === null ? '' : (text === '1' ? '是' : '否')}</div>),
      },
      {
        title: '异常原因分析',
        dataIndex: 'exceptionAnalyse',
        width: '23%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '异常解决方案',
        dataIndex: 'exceptionSolution',
        width: '23%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn2 = [
      {
        title: '设备编码',
        width: '8%',
        dataIndex: 'assetNo',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '设备名称',
        dataIndex: 'assetName',
        width: '38%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '位置编码',
        dataIndex: 'locationCode',
        width: '16%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '位置名称',
        dataIndex: 'locationName',
        width: '38%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn3 = [
      {
        title: '编号',
        width: '8%',
        dataIndex: 'woNum',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工作票编号',
        dataIndex: 'wotkNum',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '类型',
        dataIndex: 'type',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工作内容',
        dataIndex: 'content',
        width: '22%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '计划开始时间',
        dataIndex: 'schedStartTime',
        width: '14%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text ? moment(text).format(dateFormat) : '- -'}</div>),
      },
      {
        title: '计划完成时间',
        dataIndex: 'schedEndTime',
        width: '14%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text ? moment(text).format(dateFormat) : '- -'}</div>),
      },
      {
        title: '工作负责人',
        dataIndex: 'operName',
        width: '10%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn4 = [
      {
        title: '编号',
        width: '8%',
        dataIndex: 'sid',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '操作票编号',
        dataIndex: 'czpNum',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '操作任务',
        dataIndex: 'czpTask',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '操作票类型',
        dataIndex: 'type',
        width: '22%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '操作人',
        dataIndex: 'operName',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '监护人',
        dataIndex: 'checkName',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '电场(站)描述',
        dataIndex: 'stationDesc',
        width: '22%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn5 = [
      {
        title: '编号',
        width: '12%',
        dataIndex: 'woNum',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '领料单编号',
        dataIndex: 'number',
        width: '39%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '用途',
        dataIndex: 'purpose',
        width: '39%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn6 = [
      {
        title: '物资编码',
        width: '12%',
        dataIndex: 'itemNum',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '物资描述',
        dataIndex: 'itemDesc',
        width: '26%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '库存类型',
        dataIndex: 'itemType',
        width: '18%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '数量',
        dataIndex: 'itemQuantity',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '单位成本',
        dataIndex: 'unit',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '行成本',
        dataIndex: 'line',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '库房',
        dataIndex: 'location',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '库房名称',
        dataIndex: 'locationName',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn7 = [
      {
        title: '编号',
        width: '6%',
        dataIndex: 'woNum',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单编号',
        dataIndex: 'workOrderNo',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单描述',
        dataIndex: 'workOrderDesc',
        width: '14%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单类型',
        dataIndex: 'workOrderType',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备资产信息',
        dataIndex: 'assetNum',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备资产名称',
        dataIndex: 'assetName',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单负责人',
        dataIndex: 'operName',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单关闭时间',
        dataIndex: '8',
        width: '13%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text ? moment(text).format(dateFormat) : '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '7%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '完成情况',
        dataIndex: 'finishStatus',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    return (
      <div className={`${styles.eamDetailBox} ${theme}`}>
        <div className={styles.eamTop} style={ scroll ? {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        } : {}} >
          <div className={styles.eamTopTitle}>
            <div className={styles.titleBox}>
              <i className="iconfont icon-gdxq" />
            </div>
            <span>{`${workOrderType}详情`}</span>
          </div>
          <div className={styles.btnBack} onClick={this.onCancelEdit}>
            <i className="iconfont icon-fanhui" />
          </div>
        </div>
        {loading ? <div className={styles.eamLoading}>
          <Spin />
        </div> : <div className={styles.eamContent}>
          <div className={styles.eamBox}>
            <div className={styles.baseInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单基本信息
                </div>
                <i onClick={this.baseFlagFunc} className={baseFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
              </div>
              {baseFlag && <div className={styles.tableWrap}>
                <div className={styles.tableBox}>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      工单编号
                    </div>
                    <div className={styles.workCode}>
                      {workOrderNo || '- -'}
                    </div>
                    <div className={styles.deviceName}>
                      设备编码
                    </div>
                    <div className={styles.deviceCode}>
                      <span>{assetNo1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{assetNo2 || '- -'}</span>
                    </div>
                    <div className={styles.statusName}>
                      工单状态
                    </div>
                    <div className={styles.statusText}>
                      {status || '- -'}
                    </div>
                  </div>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      电场(站)名称
                    </div>
                    <div className={styles.workCode}>
                      <span>{stationName1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{stationName2 || '- -'}</span>
                    </div>
                    <div className={styles.deviceName}>
                      资产标识
                    </div>
                    <div className={styles.deviceCode}>
                      <span>{location1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{location2 || '- -'}</span>
                    </div>
                    <div className={styles.statusName}>
                      创建人
                    </div>
                    <div className={styles.statusText}>
                      {createName || '- -'}
                    </div>
                  </div>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      工单专业
                    </div>
                    <div className={styles.workCode}>
                      {woprofess || '- -'}
                    </div>
                    <div className={styles.deviceName}>
                      是否领料
                    </div>
                    <div className={styles.deviceCode}>
                      {isPick || '- -'}
                    </div>
                    <div className={styles.statusName}>
                      创建日期
                    </div>
                    <div className={styles.statusText}>
                      {createTime ? moment(createTime).format(dateFormat) : '- -'}
                    </div>
                  </div>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      工单类型
                    </div>
                    <div className={styles.workCode}>
                      {workOrderType || '- -'}
                    </div>
                    <div className={styles.deviceName}>
                      计划停机检修审批
                    </div>
                    <div className={styles.deviceCode}>
                      <span>{stopCheck1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{stopCheck2 || '- -'}</span>
                    </div>
                    <div className={styles.statusName}>
                      父工单编号
                    </div>
                    <div className={styles.statusText}>
                      {parentWorkOrderNo || '- -'}
                    </div>
                  </div>
                  <div className={`${styles.tableTr} ${styles.deleteBorderBottom}`}>
                    <div className={styles.workName}>
                      缺陷描述
                    </div>
                    <div className={styles.workCode}>
                      {workOrderDesc || '- -'}
                    </div>
                    <div className={styles.deviceName}>
                      工作负责人
                    </div>
                    <div className={styles.deviceCode}>
                      <span>{operName1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{operName2 || '- -'}</span>
                    </div>
                    <div className={styles.statusName}>
                      工单关闭时间
                    </div>
                    <div className={styles.statusText}>
                      {closeTime ? moment(closeTime).format(dateFormat) : '- -'}
                    </div>
                  </div>
                </div>
              </div>}
            </div>
            {workOrderType === '缺陷工单' && <div className={styles.explainInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  检修交代
                </div>
                <i onClick={this.defectFlagFunc} className={defectFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
              </div>
              {defectFlag && <div className={styles.explainWrap}>
                <div className={styles.tableBoxLeft}>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      缺陷类别
                    </div>
                    <div className={styles.typeCode}>
                      {faultLevel || '- -'}
                    </div>
                    <div className={styles.faultName}>
                      交代人
                    </div>
                    <div className={styles.faultCode}>
                      <span>{clientName1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{clientName2 || '- -'}</span>
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      缺陷发现时间
                    </div>
                    <div className={styles.typeCode}>
                      {faultDiscoverTime ? moment(faultDiscoverTime).format(dateFormat) : '- -'}
                    </div>
                    <div className={styles.faultName}>
                      验收人员
                    </div>
                    <div className={styles.faultCode}>
                      {checkName || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      工作开始时间
                    </div>
                    <div className={styles.typeCode}>
                      {workStartTime ? moment(workStartTime).format(dateFormat) : '- -'}
                    </div>
                    <div className={styles.faultName}>
                      值长
                    </div>
                    <div className={styles.faultCode}>
                      {leadName || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      工作结束时间
                    </div>
                    <div className={styles.typeCode}>
                      {workEndTime ? moment(workEndTime).format(dateFormat) : '- -'}
                    </div>
                    <div className={styles.faultName}>
                      原因分析
                    </div>
                    <div className={styles.faultCode}>
                      {reason || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      检修设备与内容
                    </div>
                    <div className={styles.typeCode}>
                      {content || '- -'}
                    </div>
                    <div className={styles.faultName}>
                      检修设备试验情况
                    </div>
                    <div className={styles.faultCode}>
                      {overRhaulsy || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      结论
                    </div>
                    <div className={styles.typeCode}>
                      {conclusion || '- -'}
                    </div>
                    <div className={styles.faultName}>
                      检修设备验收情况
                    </div>
                    <div className={styles.faultCode}>
                      {overRhaulys || '- -'}
                    </div>
                  </div>
                  <div className={`${styles.explainTr} ${styles.deleteBorderBottom}`}>
                    <div className={styles.typeName}>
                      检修设备所更换的备件
                    </div>
                    <div className={styles.allText}>
                      {overhaulbj || '- -'}
                    </div>
                  </div>
                </div>
                <div style={{height: '300px'}} className={styles.tableBoxRight}>
                  <div className={styles.rightTitle}>
                    缺陷原因类别
                  </div>
                  <div style={{height: '259px'}} className={styles.rightContent}>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        设计问题
                      </div>
                      <Checkbox checked={designFault === '1'} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        日常维护问题
                      </div>
                      <Checkbox checked={dayMaintenanceFault === '1'} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        备件质量问题
                      </div>
                      <Checkbox checked={partQualityFault === '1'} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        不可抗力
                      </div>
                      <Checkbox checked={environmentFault === '1'} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        场外因素
                      </div>
                      <Checkbox checked={powerGridFault === '1'} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        其他
                      </div>
                      <div className={styles.rightNote}>{otherFault || '- -'}</div>
                    </div>
                  </div>
                </div>
              </div>}
            </div>}
            {workOrderType === '故障工单' && <div className={styles.explainInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  检修交代
                </div>
                <i onClick={this.faultFlagFunc} className={faultFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
              </div>
              {faultFlag && <div className={styles.explainWrap}>
                <div className={styles.tableBoxLeft}>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障开始时间
                    </div>
                    <div className={styles.typeCode}>
                      {faultStartTime ? moment(faultStartTime).format(dateFormat) : '- -'}
                    </div>
                    <div className={styles.faultName}>
                      检修设备试验情况
                    </div>
                    <div className={styles.faultCode}>
                      {overRhaulys || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障恢复时间
                    </div>
                    <div className={styles.typeCode}>
                      {faultEndTime ? moment(faultEndTime).format(dateFormat) : '- -'}
                    </div>
                    <div className={styles.faultName}>
                      交代人
                    </div>
                    <div className={styles.faultCode}>
                      <span>{clientName1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{clientName2 || '- -'}</span>
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障持续时间(分钟)
                    </div>
                    <div className={styles.typeCode}>
                      {keeplength || '- -'}
                    </div>
                    <div className={styles.faultName}>
                      验收人员
                    </div>
                    <div className={styles.faultCode}>
                      {checkName || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障代码
                    </div>
                    <div className={styles.typeCode}>
                      <span>{faultCode1 || '- -'}</span>
                      <i className="iconfont icon-rightarr" />
                      <span>{faultCode2 || '- -'}</span>
                    </div>
                    <div className={styles.faultName}>
                      值长
                    </div>
                    <div className={styles.faultCode}>
                      {leadName || '- -'}
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障所属系统
                    </div>
                    <div className={styles.typeCode}>
                      {faultSource || '- -'}
                    </div>
                    <div className={styles.faultName}>
                      工作开始时间
                    </div>
                    <div className={styles.faultCode}>
                      {workStartTime ? moment(workStartTime).format(dateFormat) : '- -'}
                    </div>
                  </div>
                  <div className={`${styles.explainTr} ${styles.deleteBorderBottom}`}>
                    <div className={styles.typeName}>
                      备品备件更换记录
                    </div>
                    <div className={styles.typeCode}>
                      {overRhaulby || '- -'}
                    </div>
                    <div className={styles.faultName}>
                      工作结束时间
                    </div>
                    <div className={styles.faultCode}>
                      {workEndTime ? moment(workEndTime).format(dateFormat) : '- -'}
                    </div>
                  </div>
                </div>
                <div style={{height: '240px'}} className={styles.tableBoxRight}>
                  <div className={styles.rightTitle}>
                    缺陷原因类别
                  </div>
                  <div style={{height: '200px'}} className={styles.rightContent}>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        设计问题
                      </div>
                      <Checkbox checked={designFault === '1'} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        部件质量问题
                      </div>
                      <Checkbox checked={partQualityFault === '1'} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        日常维护问题
                      </div>
                      <Checkbox checked={dayMaintenanceFault === '1'} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        环境因素
                      </div>
                      <Checkbox checked={environmentFault === '1'} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        电网因素
                      </div>
                      <Checkbox checked={powerGridFault === '1'} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        其他
                      </div>
                      <div className={styles.rightNote}>{otherFault || '- -'}</div>
                    </div>
                  </div>
                </div>
              </div>}
              {faultFlag && <div className={styles.explainProcessWrap}>
                <div className={styles.explainProcessBox}>
                  <div className={styles.explainProcessInfo}>
                    <div className={styles.explainProcessName}>
                      <i className="iconfont icon-gdxq" />
                      <span>检修过程记录</span>
                    </div>
                    <div className={styles.explainProcessIcon}>
                      <span>{`合计：${jcx ? jcx.length : 0}`}</span>
                      <i onClick={this.processFlagFunc} className={processFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                    </div>
                  </div>
                  {processFlag && <div className={styles.explainProcessTable}>
                    <CneTable
                      columns={listColumn1}
                      dataSource={jcx || []}
                      rowKey={(record, index) => index || 'key'}
                      pagination={false}
                      locale={{ emptyText: '暂无数据'}}
                    />
                  </div>}
                </div>
              </div>}
            </div>}
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  相关设备
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${assets ? assets.length : 0}`}</span>
                  <i onClick={this.deviceFlagFunc} className={deviceFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {deviceFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn2}
                  dataSource={assets || []}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单&nbsp;<span>{`${workOrderNo}`}</span>&nbsp;的工作票
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${works ? works.length : 0}`}</span>
                  <i onClick={this.workFlagFunc} className={workFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {workFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn3}
                  dataSource={works || []}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单&nbsp;<span>{`${workOrderNo}`}</span>&nbsp;的操作票
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${operations ? operations.length : 0}`}</span>
                  <i onClick={this.operationFlagFunc} className={operationFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {operationFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn4}
                  dataSource={operations || []}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  关联的领料单
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${peaks ? peaks.length : 0}`}</span>
                  <i onClick={this.pickListFlagFunc} className={pickListFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {pickListFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn5}
                  dataSource={peaks || []}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  领料明细
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${peakDetails ? peakDetails.length : 0}`}</span>
                  <i onClick={this.detailFlagFunc} className={detailFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {detailFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn6}
                  dataSource={peakDetails || []}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单&nbsp;<span>{`${workOrderNo}`}</span>&nbsp;的子工单
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${childOrders ? childOrders.length : 0}`}</span>
                  <i onClick={this.childFlagFunc} className={childFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {childFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn7}
                  dataSource={childOrders || []}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
          </div>
        </div>}
        <CneFooter />
      </div>
    );
  }
}
