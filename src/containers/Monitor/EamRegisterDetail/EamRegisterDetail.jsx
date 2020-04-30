import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import {eamRegisterDetailAction} from './eamRegisterDetailReducer';
import CneFooter from '@components/Common/Power/CneFooter';
import CneTable from '@components/Common/Power/CneTable';
import searchUtil from '@utils/searchUtil';

import styles from './eamRegisterDetail.scss';

class EamRegisterDetail extends Component {
  static propTypes = {
    history: PropTypes.object,
    loading: PropTypes.bool,
    theme: PropTypes.string,
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
    const { history } = this.props;
    history.push('/monitor/diagnoseCenter');
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
    const { history } = this.props;
    const { search } = history.location;
    const { params } = searchUtil(search).parse(); // EAM查看信息
    const {
      eventName,
      eventDesc,
      deviceTypeName,
      deviceName,
      stationName,
    } = params && JSON.parse(params) || {}; // 判断从路由中过来的筛选条件
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


  render() {
    const { scroll, baseFlag, tableFlag } = this.state;
    const { loading, theme } = this.props;
    const listColumn = [
      {
        title: '工单编号',
        width: '14%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单描述',
        dataIndex: '2',
        width: '42%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '设备名称',
        dataIndex: '3',
        width: '27%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '状态',
        dataIndex: '4',
        width: '12%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '查看',
        dataIndex: '5',
        width: '5%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      },
    ];
    const faultColumn = [
      {
        title: '故障编号',
        width: '25%',
        dataIndex: '1',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单编号',
        dataIndex: '2',
        width: '25%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '故障类型',
        dataIndex: '3',
        width: '25%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '故障开始时间',
        dataIndex: '4',
        width: '15%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '查看',
        dataIndex: '5',
        width: '10%',
        render: (text) => (<div title={text || ''} >{text || '- -'}</div>),
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
        {loading ? <div className={styles.eamRegisterLoading}>
          <Spin />
        </div> : <div className={styles.eamRegisterContent}>
          <div className={styles.eamRegisterCenter}>
            <div className={styles.eamTopTitle}>
              <div>
                <i className="iconfont icon-gdxq" />
                <span>EAM故障列表</span>
              </div>
              <div>
                {`合计：${111}`}
              </div>
            </div>
            <div className={styles.faultListBox}>
              <CneTable
                columns={faultColumn}
                dataSource={[] || []}
                rowKey={(record, index) => index || 'key'}
                pagination={false}
                locale={{ emptyText: '暂无数据'}}
              />
            </div>
            <div className={styles.recordDetails}>
              <i className="iconfont icon-gdxq" />
              <span>{`EAM ${'故障'}记录详情`}</span>
            </div>
            <div className={styles.eamRegisterWrap}>
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
                        故障G20200403274564
                      </div>
                      <div className={styles.statusName}>
                        状态
                      </div>
                      <div className={styles.statusCode}>
                        已处理
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        电场(站)名称
                      </div>
                      <div className={styles.numberCode}>
                        <span>{'CNE325735664454675757' || '- -'}</span>
                        <i className="iconfont icon-rightarr" />
                        <span>{'道县审章塘风电场' || '- -'}</span>
                      </div>
                      <div className={styles.statusName}>
                        创建人
                      </div>
                      <div className={styles.statusCode}>
                        旭明
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        故障类型
                      </div>
                      <div className={styles.numberCode}>
                        风机
                      </div>
                      <div className={styles.statusName}>
                        创建时间
                      </div>
                      <div className={styles.statusCode}>
                        2020-01-20 09:10:12
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        设备编码
                      </div>
                      <div className={styles.numberCode}>
                        <span>{'4101000000445768' || '- -'}</span>
                        <i className="iconfont icon-rightarr" />
                        <span>{'35kV审章塘#1集电线路F22风机' || '- -'}</span>
                      </div>
                      <div className={styles.statusName}>
                        故障开始时间
                      </div>
                      <div className={styles.statusCode}>
                        2020-01-20 09:10:12
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        资产标识
                      </div>
                      <div className={styles.numberCode}>
                        <span>{'1123' || '- -'}</span>
                        <i className="iconfont icon-rightarr" />
                        <span>{'35kV审章塘#1集电线路F22风机' || '- -'}</span>
                      </div>
                      <div className={styles.statusName}>
                        恢复运行时间
                      </div>
                      <div className={styles.statusCode}>
                        2020-01-20 09:10:12
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.tableMoreBox}>
                        <div className={styles.tableMoreTd}>
                          <div className={styles.tableMoreName}>
                            故障代码
                          </div>
                          <div className={styles.tableMoreCode}>
                            <span>{'33' || '- -'}</span>
                            <i className="iconfont icon-rightarr" />
                            <span>{'变桨系统故障' || '- -'}</span>
                          </div>
                        </div>
                        <div className={styles.tableMoreTd}>
                          <div className={styles.tableMoreName}>
                            设备厂商
                          </div>
                          <div className={styles.tableMoreCode}>
                            设备厂商有限公司有限公司名称
                          </div>
                        </div>
                        <div className={`${styles.tableMoreTd} ${styles.deleteBorderBottom}`}>
                          <div className={styles.tableMoreName}>
                            设备型号
                          </div>
                          <div className={styles.tableMoreCode}>
                            WT200D121H87665
                          </div>
                        </div>
                      </div>
                      <div className={styles.statusName}>
                        故障原因
                      </div>
                      <div className={styles.statusCode}>
                        - -
                      </div>
                    </div>
                    <div className={`${styles.tableTr} ${styles.deleteBorderBottom}`}>
                      <div className={styles.tableMoreBox}>
                        <div className={styles.tableMoreTd}>
                          <div className={styles.tableMoreName}>
                            故障等级
                          </div>
                          <div className={styles.tableMoreCode}>
                            4
                          </div>
                        </div>
                        <div className={`${styles.tableMoreTd} ${styles.deleteBorderBottom}`}>
                          <div className={styles.tableMoreName}>
                            故障系统分类
                          </div>
                          <div className={styles.tableMoreCode}>
                            <span>{'20' || '- -'}</span>
                            <i className="iconfont icon-rightarr" />
                            <span>{'主控系统' || '- -'}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.statusName}>
                        监视系统显示故障
                      </div>
                      <div className={styles.statusCode}>
                        F22风机变桨系统故障，F22风机变桨系统
                        故障F22风机变桨系统故障
                      </div>
                    </div>
                  </div>
                </div>}
              </div>
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
                        缺JPF20200403274564
                      </div>
                      <div className={styles.statusName}>
                        状态
                      </div>
                      <div className={styles.statusCode}>
                        消缺中
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        电场(站)名称
                      </div>
                      <div className={styles.numberCode}>
                        <span>{'CNE325735664454675757' || '- -'}</span>
                        <i className="iconfont icon-rightarr" />
                        <span>{'江华界牌风电场' || '- -'}</span>
                      </div>
                      <div className={styles.statusName}>
                        创建人
                      </div>
                      <div className={styles.statusCode}>
                        徐明中
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        缺陷类别
                      </div>
                      <div className={styles.numberCode}>
                        一般缺陷
                      </div>
                      <div className={styles.statusName}>
                        创建时间
                      </div>
                      <div className={styles.statusCode}>
                        2020-01-20 09:10:12
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        工单专业
                      </div>
                      <div className={styles.numberCode}>
                        风机
                      </div>
                      <div className={styles.statusName}>
                        所属巡检项目名称
                      </div>
                      <div className={styles.statusCode}>
                        - -
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        设备编码
                      </div>
                      <div className={styles.numberCode}>
                        <span>{'4101000000445768' || '- -'}</span>
                        <i className="iconfont icon-rightarr" />
                        <span>{'集电#2线F12风机' || '- -'}</span>
                      </div>
                      <div className={styles.statusName}>
                        联系电话
                      </div>
                      <div className={styles.statusCode}>
                        17623283456
                      </div>
                    </div>
                    <div className={styles.tableTr}>
                      <div className={styles.numberName}>
                        资产标识
                      </div>
                      <div className={styles.numberCode}>
                        <span>{'1212' || '- -'}</span>
                        <i className="iconfont icon-rightarr" />
                        <span>{'集电#2线F12风机' || '- -'}</span>
                      </div>
                      <div className={styles.statusName}>
                        缺陷发现时间
                      </div>
                      <div className={styles.statusCode}>
                        2020-01-20 09:10:12
                      </div>
                    </div>
                    <div className={`${styles.tableTr} ${styles.deleteBorderBottom}`}>
                      <div className={styles.numberName}>
                        缺陷详情
                      </div>
                      <div className={styles.allText}>
                        35kV2#1界牌风机进线F12号风机发电机气隙温度1错误
                      </div>
                    </div>
                  </div>
                </div>}
              </div>
              <div className={styles.commonInfoBox}>
                <div className={styles.tableBar}>
                  <div className={styles.barProcess}>
                    {`${'故障'}关联的工单`}
                  </div>
                  <div className={styles.commonIconBox}>
                    <span>{`合计：${[] ? [].length : 0}`}</span>
                    <i onClick={this.tableFlagFunc} className={tableFlag ? 'iconfont icon-shouqi' : 'iconfont icon-zhankai'} />
                  </div>
                </div>
                {tableFlag && <div className={styles.commonWrap}>
                  <CneTable
                    columns={listColumn}
                    dataSource={[] || []}
                    rowKey={(record, index) => index || 'key'}
                    pagination={false}
                    locale={{ emptyText: '暂无数据'}}
                  />
                </div>}
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
  ...state.monitor.eamRegisterDetail,
  theme: state.common.get('theme'),
});
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: eamRegisterDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: eamRegisterDetailAction.changeStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EamRegisterDetail);
