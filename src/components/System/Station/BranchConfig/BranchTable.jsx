import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Select, Button, InputNumber, Switch } from 'antd';

const { Option } = Select;
class BranchTable extends React.Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      focus: false,
      selectDeviceFullCode: false,
      isCheckStatus: false,
      saveEditArr: [],
    };
  }
  componentDidMount() {

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
  //编辑状态
  editNum = (e, focusCode, deviceFullCode) => {
    //如果是检测支路状态可以编辑
    const { isCheckStatus } = this.state;
    if (isCheckStatus) {
      this.setState({
        focus: focusCode,
        selectDeviceFullCode: deviceFullCode,
      });
    }
  }
  //改变支路条数
  changeBranchNum = (value) => {

    const { copyData, changeBranchStore } = this.props;
    const { focus, selectDeviceFullCode } = this.state;

    const selectedArr = copyData.filter((e, i) => e.deviceFullCode === focus);
    const selectedDevice = selectedArr[0];
    const branchList = selectedDevice ? selectedDevice.branchList : [];
    const length = branchList ? branchList.length : 0;

    // const arr = [];
    // const data = { deviceFullCode: focus, branchIndex, branchCode, pvNum, isDelete };
    //修改的支路大于原有支路时，就是新增的时候；
    if (value > length) {
      for (let i = 0; i < value; i++) {
        branchList.forEach((item, index) => {
          if (i > index) {
            //此处需要判断索引时从0开始的还是1开始的，0的话时i,1的话i+1；branchCode没有值，可以不填
            // arr.push({ deviceFullCode: focus, branchIndex: i, pvNums: 1, isDelete: 0 });
            const editArr = this.filterEditData(focus, i, 1, 0);
            this.setState({
              saveEditArr: editArr,
            });
          }
        });
      }
      const newTableData = copyData.map((e, i) => {
        if (e.deviceFullCode === selectDeviceFullCode) {
          const count = e.branchList.length;
          const newBranchData = Array.from({ length: +value }, (item, index) => ({ branchIndex: index, pvNums: 1, branchStatus: 1, checkStatus: 1, isChange: 0 })).slice(count);
          const branchList = e.branchList.concat(newBranchData);
          return { ...e, branchList };
        }
        return { ...e };
      });

      changeBranchStore({ copyData: newTableData });
    }
    if (value < length) {//删除的支路数对应的数据
      for (let i = 0; i < length; i++) {
        const item = branchList[i];
        const branchIndex = item.branchIndex;
        const pvNums = item.pvNums;
        if (i > value) {
          const editArr = this.filterEditData(focus, branchIndex, pvNums, 1);
          this.setState({
            saveEditArr: editArr,
          });
        }
      }

      const newTableData = copyData.map((e, i) => {
        if (e.deviceFullCode === selectDeviceFullCode) {
          //此处拿到新增的几个支路的branchIndex数据
          const branchList = e.branchList.slice(0, value);
          return { ...e, branchList };
        }
        return { ...e };
      });

      changeBranchStore({ copyData: newTableData });
    }
    // this.setState({
    //   saveEditArr: arr,
    // });
  }
  inputBlur = (value) => {
    this.setState({
      focus: false,
    });
  }
  //判断状态显示
  jugeStatus = (e) => {
    const { isCheckStatus } = this.state;
    const { branchStatus, checkStatus, isChange, pvNums } = e;
    if (isCheckStatus) {//当时检测支路状态
      return isChange && pvNums > 0 ? styles.change : checkStatus ? styles.link : styles.nolink;
    }
    return branchStatus ? styles.link : styles.nolink;
  }
  //更改table数据
  editTableData = (deviceFullCode, branchIndex, value) => {
    const { copyData = [] } = this.props;
    const newTableData = copyData.map((e, i) => {
      if (e.deviceFullCode === deviceFullCode) {
        const branchList = e.branchList.map((item, index) => {
          if (item.branchIndex === +branchIndex) {
            item.pvNums = value;
            item.isChange = 0;
            return { ...item };
          }
          return { ...item };
        });
        return { ...e, branchList };
      }
      return { ...e };
    });
    return newTableData;
  }
  //支路下拉框控制
  handleSelect = (value) => {
    const { changeBranchStore } = this.props;
    const { focus } = this.state;
    const deviceFullCode = focus.split('_')[0];//设备名的code
    const branchIndex = focus.split('_')[1];//拿到索引
    const newTableData = this.editTableData(deviceFullCode, branchIndex, value);
    changeBranchStore({ copyData: newTableData });
    const editArr = this.filterEditData(deviceFullCode, branchIndex, value);
    this.setState({
      saveEditArr: editArr,
    });
  }
  //筛选出已编辑的数据，并去重
  filterEditData = (deviceFullCode, branchIndex, value, isDelete) => {

    const { saveEditArr, selectDeviceFullCode } = this.state;

    const isExitCode = (deviceFullCode === selectDeviceFullCode) && saveEditArr.some((e) => (e.branchIndex === +branchIndex));

    const editItem = saveEditArr.map((e) => {
      if (deviceFullCode === selectDeviceFullCode && e.branchIndex === +branchIndex) {
        e.pvNums = value;
        return { ...e, deviceFullCode };
      }
      return { ...e, deviceFullCode };
    });
    const editArr = isExitCode ? editItem : [...saveEditArr, { deviceFullCode, branchIndex: +branchIndex, pvNums: value, isDelete }];
    return editArr;
  }

  render() {
    const { loadding, copyData, checkTime } = this.props;
    const { focus, isCheckStatus, saveEditArr } = this.state;
    console.log('saveEditArr: ', saveEditArr);
    const pvNumsArr = [0, 1, 2, 3, 4, 5];
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
                  // ref={item.deviceFullCode}
                  className={styles.number}
                  onClick={(e) => { this.editNum(e, item.deviceFullCode, item.deviceFullCode); }}
                  key={item}
                  value={item}
                >
                  {focus === item.deviceFullCode ?
                    <InputNumber min={1} max={20}
                      ref="input"
                      onBlur={this.inputBlur}
                      onChange={this.changeBranchNum}
                      defaultValue={item.branchList.length}
                    /> :
                    item.branchList.length}
                </div>
                {
                  item.branchList.map((e, i) => {
                    const styleStatus = this.jugeStatus(e);
                    const branchId = `${item.deviceFullCode}_${e.branchIndex}`;
                    return (
                      <div className={styles.titleStyle} key={branchId}>

                        {focus === branchId ?
                          <Select
                            defaultValue={e.pvNums}
                            style={{ width: 45 }}
                            onChange={this.handleSelect}
                            onBlur={this.inputBlur}
                          >
                            {pvNumsArr.map((pvNum, value) => (
                              <Option value={pvNum}>{pvNum}</Option>
                            ))}

                          </Select> :
                          <div
                            onClick={(info) => { this.editNum(info, branchId, item.deviceFullCode); }}
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
