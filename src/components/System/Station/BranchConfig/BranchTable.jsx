import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Select, Button, Input, Switch } from 'antd';

const { Option } = Select;
class BranchTable extends React.Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      focus: false,
      isCheckStatus: false,
    };
  }
  componentDidMount() {
    console.log('this.refs', this.refs);
    // var textBox = document.createElement('INPUT');
    // console.log('textBox: ', textBox);
    // const value = this.myref.innerHTML;
    // console.log('value: ', value);
    // textBox.value = value;
    // textBox.appendChild(this.myref);
  }
  componentDidUpdate() {
    this.refs.input && this.refs.input.focus();
  }
  queryCheckData = () => {
    this.setState({
      isCheckStatus: true,
    });
    // const { stationCode, deviceTypeCode, deviceFullCodes } = this.props;
    // this.props.getCheckData(stationCode, deviceTypeCode, deviceFullCodes);
  }
  changeSwitch = () => {

  }
  saveCheckValue = () => {

  }
  cancleCheckValue = () => {

  }
  editNum = (e, deviceFullCode) => {
    console.log('deviceFullCode: ', deviceFullCode);
    // console.log('e.target: ', e.target);
    // console.log('e.target.value: ', e.target.value);
    // console.log('e.target.textContent: ', e.target.textContent);
    const value = e.target.textContent ? e.target.textContent : e.target.value;
    const { isCheckStatus } = this.state;
    if (isCheckStatus) {
      this.setState({
        focus: deviceFullCode,
      });
    }

  }
  // editNum2 = (e, branchCode) => {
  //   console.log('branchCode: ', branchCode);
  //   const value = e.target.textContent ? e.target.textContent : e.target.value;
  //   this.setState({
  //     focus: branchCode,
  //   });
  // }

  inputBlur = (value) => {
    console.log('value: ', value);
  }
  //判断状态显示
  jugeStatus = (e) => {
    console.log('状态');
    const { isCheckStatus } = this.state;
    const { branchStatus, checkStatus, isChange, pvNums } = e;
    if (isCheckStatus) {//当时检测支路状态
      return isChange && pvNums > 0 ? styles.change : checkStatus ? styles.link : styles.nolink;
    }
    return branchStatus ? styles.link : styles.nolink;
  }
  handleSelect = (value) => {
    console.log('value: ', value);

  }
  render() {
    const { loadding, copyData, checkTime } = this.props;
    const { focus, isCheckStatus } = this.state;
    return (
      <div className={styles.tablebox}>
        <div className={styles.checkstyle}>
          <div className={styles.leftInfo}>
            {!isCheckStatus ? <Button type="primary"
              icon="poweroff"
              loading={loadding}
              disabled={!checkTime}
              onClick={this.queryCheckData}>
              {/* <i className="iconfont icon-save" /> */}
              支路检测
            </Button> :
              <div>
                <Button type="primary"
                  icon="save"
                  className={styles.btnStyle}
                  loading={loadding}
                  onClick={this.saveCheckValue}>
                  {/* <i className="iconfont icon-addto" /> */}
                  保存检测结果
                </Button>
                <Button type="primary"
                  loading={loadding}
                  className={styles.btnStyle}
                  onClick={this.cancleCheckValue}>
                  取消
                </Button>
                <span className={styles.fontcolor}>
                  检测结果日期
                <span className={styles.dateMargin}>:</span>
                  <span>{checkTime}</span>
                </span>
                <Switch onChange={this.changeSwitch} />
                <span>只看变更</span>

              </div>
            }
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.icon}></div>
            <span className={styles.iconmargin}>未接入</span>
            <div className={styles.icon2}></div>
            <span className={styles.iconmargin}>接入支路数</span>
            <div className={styles.icon3}></div>
            <span className={styles.iconmargin}>有变更(单击可修改配置)</span>
            合计:{copyData.length}
          </div>

        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableTitle}>
            <div className={styles.name}>设备名称</div>
            <div className={styles.number}>支路条数</div>
            {Array.from({ length: 20 }, (item, index) => (
              <div className={styles.titleStyle} key={index + 1}>I{index + 1}</div>
            ))}
          </div>
          <div className={styles.tablePart}>
            {copyData.length ? copyData.map((item, index) => (
              <div className={index % 2 === 0 ? styles.tabletd : styles.tableEventd} key={index}>
                <div className={styles.name}>{item.deviceName}</div>
                <div
                  ref={item.deviceFullCode}
                  className={styles.number}
                  onClick={(e) => { this.editNum(e, item.deviceFullCode); }}
                  key={item}
                  value={item}
                >
                  {focus === item.deviceFullCode ? <Input ref="input" onBlur={this.inputBlur} defaultValue={item.branchList.length} /> : item.branchList.length}
                </div>
                {
                  item.branchList.map((e, i) => {
                    const styleStatus = this.jugeStatus(e);
                    return (
                      <div className={styles.titleStyle} key={e.branchCode}>

                        {focus === e.branchCode ? <Select defaultValue={'' + e.pvNums} style={{ width: 45 }} onChange={this.handleSelect}>
                          <Option value="0">0</Option>
                          <Option value="1">1</Option>
                          <Option value="2">2</Option>
                          <Option value="3" >3</Option>
                          <Option value="4">4</Option>
                          <Option value="5">5</Option>
                        </Select> :
                          <div
                            onClick={(info) => { this.editNum(info, e.branchCode); }}
                            value={e.pvNums}
                            className={styleStatus}
                          >
                            {e.pvNums}
                            <div></div>
                          </div>}
                      </div>
                    );
                  })
                }
              </div>
            )) :
              <div className={styles.noData}>
                <img src="/assets/img/nodata.png" width="223" height="164" />

              </div>
            }
            <div className={styles.tabletd}></div>
          </div>
        </div>
      </div >
    );
  }
}
export default (BranchTable);
