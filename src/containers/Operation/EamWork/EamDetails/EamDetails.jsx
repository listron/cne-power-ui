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
      flag: true,
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

  render() {
    const { scroll, flag } = this.state;
    const { theme, loading } = this.props;
    const listColumn1 = [
      {
        title: '序号',
        dataIndex: '1',
        render: (text) => (<div className={styles.projectCompany} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '检查项(设备名称)',
        dataIndex: '2',
        render: (text) => (<div className={styles.stationName} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '异常类别',
        dataIndex: '3',
        render: (text) => (<div className={styles.workCode} onClick={() => this.detailsFunc(text)} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '是否为故障主要原因',
        dataIndex: '4',
        render: (text) => (<div className={styles.workDesc} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '异常原因分析',
        dataIndex: '5',
        render: (text) => (<div className={styles.deviceCode} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '异常解决方案',
        dataIndex: '6',
        render: (text) => (<div className={styles.deviceName} title={text || ''} >{text || '- -'}</div>),
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
                <i className={flag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
              </div>
              <div className={styles.tableWrap}>
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
              </div>
            </div>
            <div className={styles.explainInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  检修交代
                </div>
                <i className={flag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
              </div>
              <div className={styles.explainWrap}>
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
              </div>
            </div>
            <div className={styles.explainInfoBox}>
              <div className={styles.tableBar}>
                <div className={styles.barProcess}>
                  检修交代
                </div>
                <i className={flag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
              </div>
              <div className={styles.explainWrap}>
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
              </div>
              <div className={styles.explainProcessWrap}>
                <div className={styles.explainProcessBox}>
                  <div className={styles.explainProcessInfo}>
                    <div className={styles.explainProcessName}>
                      <i className="iconfont icon-gdxq" />
                      <span>检修过程记录</span>
                    </div>
                    <div className={styles.explainProcessIcon}>
                      <span>{`合计：${1}`}</span>
                      <i className={flag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                    </div>
                  </div>
                  <div className={styles.explainProcessTable}>
                    <CneTable
                      columns={listColumn1}
                      className={styles.tableStyles}
                      dataSource={[]}
                      rowKey={(record, index) => index || 'key'}
                      pagination={false}
                      locale={{ emptyText: '暂无数据'}}
                    />
                  </div>
                </div>
              </div>
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
