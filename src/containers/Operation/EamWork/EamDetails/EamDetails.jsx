import React from 'react';
import PropTypes from 'prop-types';
import CneFooter from '@components/Common/Power/CneFooter';
import CneTable from '@components/Common/Power/CneTable';
import {eamDetailsAction} from './eamDetailsAction';
import {connect} from 'react-redux';
import {Spin, Checkbox} from 'antd';

import styles from './eamDetails.scss';


class EamDetails extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    loading: PropTypes.bool,
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
    const main = document.getElementById('main');
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

  // 返回
  onCancelEdit = () => {
    const { history } = this.props;
    history.push('/operation/eam');
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
    const { theme, loading } = this.props;
    const listColumn1 = [
      {
        title: '序号',
        width: '8%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '检查项(设备名称)',
        dataIndex: '2',
        width: '18%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '异常类别',
        dataIndex: '3',
        width: '16%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '是否为故障主要原因',
        dataIndex: '4',
        width: '14%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '异常原因分析',
        dataIndex: '5',
        width: '23%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '异常解决方案',
        dataIndex: '6',
        width: '23%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn2 = [
      {
        title: '设备编码',
        width: '8%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '设备名称',
        dataIndex: '2',
        width: '38%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '位置编码',
        dataIndex: '3',
        width: '16%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '位置名称',
        dataIndex: '4',
        width: '38%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn3 = [
      {
        title: '编号',
        width: '8%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工作票编号',
        dataIndex: '2',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '类型',
        dataIndex: '3',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工作内容',
        dataIndex: '4',
        width: '22%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '计划开始时间',
        dataIndex: '5',
        width: '14%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '计划完成时间',
        dataIndex: '6',
        width: '14%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工作负责人',
        dataIndex: '7',
        width: '10%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: '8',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn4 = [
      {
        title: '编号',
        width: '8%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '操作票编号',
        dataIndex: '2',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '操作任务',
        dataIndex: '3',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '操作票类型',
        dataIndex: '4',
        width: '22%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '操作人',
        dataIndex: '5',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '监护人',
        dataIndex: '6',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '电场(站)描述',
        dataIndex: '7',
        width: '22%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: '8',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn5 = [
      {
        title: '编号',
        width: '12%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '领料单编号',
        dataIndex: '2',
        width: '39%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '用途',
        dataIndex: '3',
        width: '39%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '状态',
        dataIndex: '4',
        width: '10%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn6 = [
      {
        title: '物资编码',
        width: '12%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '物资描述',
        dataIndex: '2',
        width: '26%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '库存类型',
        dataIndex: '3',
        width: '18%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '数量',
        dataIndex: '4',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '单位成本',
        dataIndex: '5',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '行成本',
        dataIndex: '6',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '库房',
        dataIndex: '7',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '库房名称',
        dataIndex: '8',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];

    const listColumn7 = [
      {
        title: '编号',
        width: '6%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单编号',
        dataIndex: '2',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单描述',
        dataIndex: '3',
        width: '14%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单类型',
        dataIndex: '4',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备资产信息',
        dataIndex: '5',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备资产名称',
        dataIndex: '6',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单负责人',
        dataIndex: '7',
        width: '8%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单关闭时间',
        dataIndex: '8',
        width: '13%',
        className: styles.textAlignName,
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: '9',
        width: '7%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '完成情况',
        dataIndex: '10',
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
            <span>缺陷工单详情</span>
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
                      工WHYG2020040327
                    </div>
                    <div className={styles.deviceName}>
                      设备编码
                    </div>
                    <div className={styles.deviceCode}>
                      41010000004021
                    </div>
                    <div className={styles.statusName}>
                      工单状态
                    </div>
                    <div className={styles.statusText}>
                      消缺工单
                    </div>
                  </div>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      电场(站)名称
                    </div>
                    <div className={styles.workCode}>
                      江华桥头铺风电场
                    </div>
                    <div className={styles.deviceName}>
                      资产标识
                    </div>
                    <div className={styles.deviceCode}>
                      1343
                    </div>
                    <div className={styles.statusName}>
                      创建人
                    </div>
                    <div className={styles.statusText}>
                      旭明
                    </div>
                  </div>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      工单专业
                    </div>
                    <div className={styles.workCode}>
                      风机
                    </div>
                    <div className={styles.deviceName}>
                      是否领料
                    </div>
                    <div className={styles.deviceCode}>
                      否
                    </div>
                    <div className={styles.statusName}>
                      创建日期
                    </div>
                    <div className={styles.statusText}>
                      2020-01-20 09:10:12
                    </div>
                  </div>
                  <div className={styles.tableTr}>
                    <div className={styles.workName}>
                      工单类型
                    </div>
                    <div className={styles.workCode}>
                      缺陷工单
                    </div>
                    <div className={styles.deviceName}>
                      计划停机检修审批
                    </div>
                    <div className={styles.deviceCode}>
                      - -
                    </div>
                    <div className={styles.statusName}>
                      父工单编号
                    </div>
                    <div className={styles.statusText}>
                      我是父工单编号
                    </div>
                  </div>
                  <div className={`${styles.tableTr} ${styles.deleteBorderBottom}`}>
                    <div className={styles.workName}>
                      缺陷描述
                    </div>
                    <div className={styles.workCode}>
                      我是描述，我是描述文字，我是描述，我是描述文字，我是描述，我是描述文字，我是描述，我是描述文字。
                    </div>
                    <div className={styles.deviceName}>
                      工作负责人
                    </div>
                    <div className={styles.deviceCode}>
                      李阵郁
                    </div>
                    <div className={styles.statusName}>
                      工单关闭时间
                    </div>
                    <div className={styles.statusText}>
                      2020-01-20 09:10:12
                    </div>
                  </div>
                </div>
              </div>}
            </div>
            <div className={styles.explainInfoBox}>
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
                      一般缺陷
                    </div>
                    <div className={styles.faultName}>
                      交代人
                    </div>
                    <div className={styles.faultCode}>
                      张怡儿 》李大米
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      缺陷发现时间
                    </div>
                    <div className={styles.typeCode}>
                      2019-12-29 17:30:20
                    </div>
                    <div className={styles.faultName}>
                      验收人员
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      工作开始时间
                    </div>
                    <div className={styles.typeCode}>
                      - -
                    </div>
                    <div className={styles.faultName}>
                      值长
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      工作结束时间
                    </div>
                    <div className={styles.typeCode}>
                      - -
                    </div>
                    <div className={styles.faultName}>
                      原因分析
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      检修设备与内容
                    </div>
                    <div className={styles.typeCode}>
                      我是描述，我是描述文字，我是描述，我是描述文字，我是描述，我是描述文字。
                    </div>
                    <div className={styles.faultName}>
                      检修设备试验情况
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      结论
                    </div>
                    <div className={styles.typeCode}>
                      我就是结论
                    </div>
                    <div className={styles.faultName}>
                      检修设备验收情况
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={`${styles.explainTr} ${styles.deleteBorderBottom}`}>
                    <div className={styles.typeName}>
                      检修设备所更换的备件
                    </div>
                    <div className={styles.allText}>
                      - -
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
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        日常维护问题
                      </div>
                      <Checkbox checked={true} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        备件质量问题
                      </div>
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        不可抗力
                      </div>
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        场外因素
                      </div>
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '7px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        其他
                      </div>
                      <div className={styles.rightNote}>11111</div>
                    </div>
                  </div>
                </div>
              </div>}
            </div>
            <div className={styles.explainInfoBox}>
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
                      2019-12-29 17:30:20
                    </div>
                    <div className={styles.faultName}>
                      检修设备试验情况
                    </div>
                    <div className={styles.faultCode}>
                      张怡儿 》李大米
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障恢复时间
                    </div>
                    <div className={styles.typeCode}>
                      - -
                    </div>
                    <div className={styles.faultName}>
                      交代人
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障持续时间(分钟)
                    </div>
                    <div className={styles.typeCode}>
                      - -
                    </div>
                    <div className={styles.faultName}>
                      验收人员
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障代码
                    </div>
                    <div className={styles.typeCode}>
                      - -
                    </div>
                    <div className={styles.faultName}>
                      值长
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={styles.explainTr}>
                    <div className={styles.typeName}>
                      故障所属系统
                    </div>
                    <div className={styles.typeCode}>
                      我是描述，我是描述文字，我是描述，我是描述文字，我是描述，我是描述文字。
                    </div>
                    <div className={styles.faultName}>
                      工作开始时间
                    </div>
                    <div className={styles.faultCode}>
                      - -
                    </div>
                  </div>
                  <div className={`${styles.explainTr} ${styles.deleteBorderBottom}`}>
                    <div className={styles.typeName}>
                      备品备件更换记录
                    </div>
                    <div className={styles.typeCode}>
                      - -
                    </div>
                    <div className={styles.faultName}>
                      工作结束时间
                    </div>
                    <div className={styles.faultCode}>
                      - -
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
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        部件质量问题
                      </div>
                      <Checkbox checked={true} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        日常维护问题
                      </div>
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        环境因素
                      </div>
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        电网因素
                      </div>
                      <Checkbox checked={false} disabled />
                    </div>
                    <div style={{padding: '5px 0'}} className={styles.rightTr}>
                      <div className={styles.rightName}>
                        其他
                      </div>
                      <div className={styles.rightNote}>11111</div>
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
                      <span>{`合计：${1}`}</span>
                      <i onClick={this.processFlagFunc} className={processFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                    </div>
                  </div>
                  {processFlag && <div className={styles.explainProcessTable}>
                    <CneTable
                      columns={listColumn1}
                      dataSource={[{
                        1: '86925',
                        2: 'XG-WFJ-20-086',
                        3: '工WHYG2020040327',
                        4: '是',
                        5: '41010000002044',
                        6: '27#方阵09#汇流箱07#支路',
                      }, {
                        1: '86925',
                        2: 'XG-WFJ-20-086',
                        3: '工WHYG2020040327',
                        4: '否',
                        5: '41010000002044',
                        6: '27#方阵09#汇流箱07#支路',
                      }]}
                      rowKey={(record, index) => index || 'key'}
                      pagination={false}
                      locale={{ emptyText: '暂无数据'}}
                    />
                  </div>}
                </div>
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  相关设备
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${1}`}</span>
                  <i onClick={this.deviceFlagFunc} className={deviceFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {deviceFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn2}
                  dataSource={[{
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '工WHYG2020040327',
                    4: '升压站PT箱基础台水泥脱落，升压站围栏基础起皮脱落，主控楼顶起砂严重护栏水泥脱落严重，主控楼内墙面裂纹',
                  }, {
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '工WHYG2020040327',
                    4: '升压站PT箱基础台水泥脱落，升压站围栏基础起皮脱落，主控楼顶起砂严重护栏水泥脱落严重，主控楼内墙面裂纹',
                  }]}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单&nbsp;<span>{`${'工YJWF2020010008'}`}</span>&nbsp;的工作票
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${1}`}</span>
                  <i onClick={this.workFlagFunc} className={workFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {workFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn3}
                  dataSource={[{
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '集电#1234风机集电#1234风机风机集电',
                    5: '2019-12-29 17:30:20',
                    6: '2019-12-29 17:30:20',
                    7: '李鸣宇',
                    8: '执行中',
                  }, {
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '集电#1234风机集电#1234风机风机集电',
                    5: '2019-12-29 17:30:20',
                    6: '2019-12-29 17:30:20',
                    7: '李鸣宇',
                    8: '执行中',
                  }]}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单&nbsp;<span>{`${'工YJWF2020010008'}`}</span>&nbsp;的操作票
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${1}`}</span>
                  <i onClick={this.operationFlagFunc} className={operationFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {operationFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn4}
                  dataSource={[{
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '集电#1234风机集电#1234风机风机集电',
                    5: '张大滴',
                    6: '李二世',
                    7: '李鸣宇',
                    8: '执行中',
                  }, {
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '集电#1234风机集电#1234风机风机集电',
                    5: '张大滴',
                    6: '李二世',
                    7: '李鸣宇',
                    8: '执行中',
                  }]}
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
                  <span>{`合计：${1}`}</span>
                  <i onClick={this.pickListFlagFunc} className={pickListFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {pickListFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn5}
                  dataSource={[{
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '执行中',
                  }, {
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '执行中',
                  }]}
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
                  <span>{`合计：${1}`}</span>
                  <i onClick={this.detailFlagFunc} className={detailFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {detailFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn6}
                  dataSource={[{
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '1212',
                    5: '张大滴',
                    6: '李二世',
                    7: '李鸣宇',
                    8: '执行中',
                  }, {
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '12313',
                    5: '张大滴',
                    6: '李二世',
                    7: '李鸣宇',
                    8: '执行中',
                  }]}
                  rowKey={(record, index) => index || 'key'}
                  pagination={false}
                  locale={{ emptyText: '暂无数据'}}
                />
              </div>}
            </div>
            <div className={styles.commonInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  工单&nbsp;<span>{`${'工YJWF2020010008'}`}</span>&nbsp;的子工单
                </div>
                <div className={styles.commonIconBox}>
                  <span>{`合计：${1}`}</span>
                  <i onClick={this.childFlagFunc} className={childFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                </div>
              </div>
              {childFlag && <div className={styles.commonWrap}>
                <CneTable
                  columns={listColumn7}
                  dataSource={[{
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '集电集电电',
                    5: '张大滴',
                    6: '李二世',
                    7: '李鸣宇',
                    8: '2019-12-29 17:30:20',
                    9: '李鸣宇',
                    10: '执行中',
                  }, {
                    1: '86925',
                    2: 'XG-WFJ-20-086',
                    3: '外包风机工作票',
                    4: '集电集电电',
                    5: '张大滴',
                    6: '李二世',
                    7: '李鸣宇',
                    8: '2019-12-29 17:30:20',
                    9: '李鸣宇',
                    10: '执行中',
                  }]}
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
const mapStateToProps = (state) => ({
  ...state.operation.eamDetails.toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: eamDetailsAction.resetStore }),
  changeStore: payload => dispatch({ type: eamDetailsAction.changeStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EamDetails);
