import React from 'react';
import PropTypes from 'prop-types';
import {Popover, Checkbox} from 'antd';
import moment from 'moment';
import searchUtil from '@utils/searchUtil';
import CneTips from '@components/Common/Power/CneTips';
import styles from './meterBaseInfo.scss';

const dateFormat = 'YYYY-MM-DD HH:mm';

export default class MeterBaseInfo extends React.Component {
  static propTypes = {
    meterBaseData: PropTypes.object,
    changeStore: PropTypes.func,
    operatorFlag: PropTypes.bool,
    stationFlag: PropTypes.bool,
    operableUserData: PropTypes.array,
    usernameList: PropTypes.array,
    checkedUserList: PropTypes.array,
    getAddUser: PropTypes.func,
    history: PropTypes.object,
    addVisible: PropTypes.bool,
    processActionData: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
    };
  }

  componentDidUpdate() {
    const {
      operatorContent,
      stationContent,
      props: {
        changeStore,
      }} = this;
    // 执行人
    if(operatorContent && operatorContent.offsetHeight > 42) {
      changeStore({
        operatorFlag: true,
      });
    }
    // 电站名称
    if(stationContent && stationContent.offsetHeight > 40) {
      changeStore({
        stationFlag: true,
      });
    }
  }

  onChange = (checkedList) => {
    const { changeStore } = this.props;
    changeStore({
      checkedUserList: checkedList,
    });
  };

  // 添加执行人 打开二次弹框
  addUsername = () => {
    const { changeStore } = this.props;
    this.setState({
      showWarningTip: true,
    }, () => {
      // 关闭弹框
      changeStore({
        addVisible: false,
      });
    });
  };

  handleVisibleChange = (visible) => {
    const { changeStore } = this.props;
    changeStore({
      addVisible: visible,
    });
  };

  // 取消
  cancelAdd = () => {
    const { changeStore } = this.props;
    changeStore({
      addVisible: false,
    });
  };

  // 关闭二次弹框
  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  };

  onConfirmWarningTip = () => {
    const {
      history,
      checkedUserList,
      getAddUser,
      meterBaseData: {
        stateId,
      },
      processActionData,
    } = this.props;
    const { search } = history.location;
    const { meterId } = searchUtil(search).parse(); // 抄表详情页
    // 关闭二次弹框
    this.setState({
      showWarningTip: false,
    });
    // 添加执行人
    if(checkedUserList.length !== 0) {
      processActionData.forEach(cur => {
        if(cur.actionCode === '3') {
          // 添加执行人
          getAddUser({
            stateId,
            docketId: meterId,
            ids: checkedUserList.toString(),
            actionCode: cur.actionCode,
          });
        }
      });
    }
  };

  render() {
    const { showWarningTip } = this.state;
    const {
      stationFlag,
      operatorFlag,
      meterBaseData: {
        stationName,
        createUser,
        createTime,
        planEndTime,
        endTime,
        stateName,
        isOverTime,
      },
      operableUserData,
      checkedUserList,
      addVisible,
      usernameList,
      processActionData,
    } = this.props;
    return (
      <div className={styles.meterBaseInfo}>
        <div className={styles.baseTitleBox}>
          <div className={styles.baseBanner}>
            基本信息
          </div>
          <div className={styles.baseIconBox}>
            {isOverTime === 2 ? <i /> : <i className={`iconfont icon-chaoshi ${styles.baseTimeout}`} />}
            {endTime && <i className={`iconfont icon-jiedan ${styles.baseEnd}`} />}
            {!endTime && <div className={isOverTime === 2 ? styles.baseStatus : styles.errorStatus}>
              {stateName || '- -'}
            </div>}
          </div>
        </div>
        <div className={styles.baseTableInfo}>
          <div className={styles.baseTableContent}>
            <div className={styles.tableTop}>
              <div className={styles.stationNameBox}>
                <div className={styles.stationName}>
                  电站名称
                </div>
                <div className={styles.stationContent} style={stationFlag ? {padding: '12px 0 12px 10px'} : {lineHeight: '40px', paddingLeft: '10px'}}
                     ref={ref => {
                       this.stationContent = ref;
                     }}>
                  {stationName || '- -'}
                </div>
              </div>
              <div className={styles.workProcessBox}>
                <div className={styles.workProcessType}>
                  工单类型
                </div>
                <div className={styles.workProcessContent}>
                  抄表工单
                </div>
              </div>
            </div>
            <div className={styles.tableMid}>
              <div className={styles.creatorBox}>
                <div className={styles.creator}>
                  创建人
                </div>
                <div className={styles.creatorContent}>
                  {createUser || '- -'}
                </div>
              </div>
              <div className={styles.workProcessTimeBox}>
                <div className={styles.workProcessTime}>
                  工单创建时间
                </div>
                <div className={styles.workProcessTimeContent}>
                  {createTime ? moment(createTime).format(dateFormat) : '- -'}
                </div>
              </div>
              <div className={styles.finishTimeBox}>
                <div className={styles.finishTime}>
                  要求完成时间
                </div>
                <div className={styles.finishTimeContent}>
                  {planEndTime ? moment(planEndTime).format(dateFormat) : '- -'}
                </div>
              </div>
            </div>
            <div className={styles.tableBottom}>
              <div className={styles.operatorBox}>
                <div className={styles.operator}>
                  {operableUserData[0].stateName || '- -'}
                </div>
                <div className={styles.operatorContent} style={operatorFlag ? {padding: '12px 0 12px 10px'} : {lineHeight: '40px', paddingLeft: '10px'}}>
                  <span ref={ref => {this.operatorContent = ref;}}>
                    {operableUserData[0].ableUsers ? operableUserData[0].ableUsers.split(',').join('、') : '- -'}
                    {processActionData.filter(cur => cur.actionCode === '3' && cur.isPermission === 0).length > 0 && (
                      <Popover
                        trigger="click"
                        placement="rightTop"
                        visible={addVisible}
                        onVisibleChange={this.handleVisibleChange}
                        overlayClassName={styles.operatorWrap}
                        content={(
                          <div className={styles.operatorCenter}>
                            <div className={styles.operatorList}>
                              <Checkbox.Group style={{width: '100%'}} value={checkedUserList}
                                              onChange={this.onChange}>
                                {usernameList.map((cur, index) => {
                                  return (
                                    <div className={styles.operatorItemBox} key={index.toString()}>
                                      {cur.map(item => {
                                        return (
                                          <div className={styles.operatorItem} title={item.userName} key={item.userId}>
                                            <Checkbox value={item.userId}>{item.userName}</Checkbox>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </Checkbox.Group>
                            </div>
                            <div className={styles.operatorBtn}>
                              <div className={styles.cancelBtn} onClick={this.cancelAdd}>取消</div>
                              <div className={`${styles.btnGreen} ${styles.am} ${styles.amGreenScale}`} onClick={this.addUsername}>
                                <span>确定</span>
                              </div>
                            </div>
                          </div>
                        )}>
                        <i title="添加执行人" className="iconfont icon-addman" />
                      </Popover>
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.acceptorBox}>
                <div className={styles.acceptor}>
                  {operableUserData[1].stateName || '- -'}
                </div>
                <div className={styles.acceptorContent}>
                  {operableUserData[1].ableUsers ? operableUserData[1].ableUsers.split(',').join('、') : '- -'}
                </div>
              </div>
              <div className={styles.actualTimeBox}>
                <div className={styles.actualTime}>
                  实际完成时间
                </div>
                <div className={styles.actualTimeContent}>
                  {endTime ? moment(endTime).format(dateFormat) : '- -'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CneTips
          visible={showWarningTip}
          width={260}
          onCancel={this.onCancelWarningTip}
          onConfirm={this.onConfirmWarningTip}
          tipText="添加后不可删除，确认添加？"
        />
      </div>
    );
  }
}
