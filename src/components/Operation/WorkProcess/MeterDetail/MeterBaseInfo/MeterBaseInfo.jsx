import React from 'react';
import PropTypes from 'prop-types';
import {Popover, Checkbox} from 'antd';
import styles from './meterBaseInfo.scss';

let operatorFlag = false;
let stationFlag = false;

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['张一鸣', '李月明', '李尔萨'];

export default class MeterBaseInfo extends React.Component {
  static propTypes = {
    meterDetail: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      visible: false, // 控制添加执行人弹框
    };
  }

  componentDidMount() {
    const {operatorContent, stationContent} = this;
    console.log(stationContent.clientHeight, '1111');
    console.log(operatorContent.clientHeight, '2222');

    if (Number(operatorContent.clientHeight) > 40) {
      operatorFlag = true;
      console.log(33333);
    }

    if (Number(stationContent.clientHeight) > 40) {
      stationFlag = true;
      console.log(444444);
    }
  }

  onChange = (checkedList) => {
    console.log(checkedList, '1111');
    this.setState({
      checkedList,
    });
  };

  render() {
    console.log(555555);
    const { visible, checkedList } = this.state;
    return (
      <div className={styles.meterBaseInfo}>
        <div className={styles.baseTitleBox}>
          <div className={styles.baseBanner}>
            基本信息
          </div>
          <div className={styles.baseIconBox}>
            <i className={`iconfont icon-chaoshi ${styles.baseTimeout}`}/>
            {/*<i className={`iconfont icon-jiedan ${styles.baseEnd}`} />*/}
            <div className={styles.baseStatus}>
              待领取
            </div>
          </div>
        </div>
        <div className={styles.baseTableInfo}>
          <div className={styles.baseTableContent}>
            <div className={styles.tableTop}>
              <div className={styles.stationNameBox}>
                <div className={styles.stationName}>
                  电站名称
                </div>
                <div className={styles.stationContent} style={stationFlag ? {padding: '12px 0 12px 10px'} : {}}
                     ref={ref => {
                       this.stationContent = ref;
                     }}>
                  这是电站名称，前端注意：文字超出折行，文字行高22px，见已结单执行人效果这是电站名称，前端注意：文字超出折行，文字行高22px，见已结单执行人效果
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
                  计划下发
                </div>
              </div>
              <div className={styles.workProcessTimeBox}>
                <div className={styles.workProcessTime}>
                  工单创建时间
                </div>
                <div className={styles.workProcessTimeContent}>
                  2019-11-16 18:00
                </div>
              </div>
              <div className={styles.finishTimeBox}>
                <div className={styles.finishTime}>
                  要求完成时间
                </div>
                <div className={styles.finishTimeContent}>
                  2019-11-16 18:00
                </div>
              </div>
            </div>
            <div className={styles.tableBottom}>
              <div className={styles.operatorBox}>
                <div className={styles.operator}>
                  执行人
                </div>
                <div className={styles.operatorContent} style={operatorFlag ? {padding: '12px 0 12px 10px'} : {}}
                     ref={ref => {
                       this.operatorContent = ref;
                     }}>
                  <span>
                    王某某、李某某、张某膜、江某某、奇谋、李某某、张某膜、江某某、、李某某、张某膜、江某某、、李某某、张某膜、江某某、
                    <Popover
                      visible={visible}
                      placement="rightTop"
                      overlayClassName={styles.operatorWrap}
                      content={(
                        <div className={styles.operatorCenter}>
                          <div className={styles.operatorList}>
                            <Checkbox.Group style={{width: '100%'}} value={checkedList}
                                            onChange={this.onChange}>
                              <div className={styles.operatorItemBox}>
                                <div className={styles.operatorItem}>
                                  <Checkbox value="A">张一鸣</Checkbox>
                                </div>
                                <div className={styles.operatorItem}>
                                  <Checkbox value="B">李月明</Checkbox>
                                </div>
                              </div>
                              <div className={styles.operatorItemBox}>
                                <div className={styles.operatorItem}>
                                  <Checkbox value="C">李尔萨</Checkbox>
                                </div>
                                <div className={styles.operatorItem}>
                                  <Checkbox value="D">李一点点</Checkbox>
                                </div>
                              </div>
                              <div className={styles.operatorItemBox}>
                                <div className={styles.operatorItem}>
                                  <Checkbox value="E">李越少</Checkbox>
                                </div>
                              </div>
                            </Checkbox.Group>
                          </div>
                          <div className={styles.operatorBtn}>
                            <div className={styles.cancelBtn}>取消</div>
                            <div className={`${styles.btnGreen} ${styles.am} ${styles.amGreenScale}`}>
                              <span>确定</span>
                            </div>
                          </div>
                        </div>
                      )} trigger="click">
                      <i className="iconfont icon-addman"/>
                    </Popover>
                  </span>
                </div>
              </div>
              <div className={styles.acceptorBox}>
                <div className={styles.acceptor}>
                  验收人
                </div>
                <div className={styles.acceptorContent}>
                  王某某
                </div>
              </div>
              <div className={styles.actualTimeBox}>
                <div className={styles.actualTime}>
                  实际完成时间
                </div>
                <div className={styles.actualTimeContent}>
                  2019-11-17 17:10
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
