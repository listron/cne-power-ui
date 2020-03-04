import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Select, Button, InputNumber, Switch, Icon, Spin } from 'antd';
import lodash from 'lodash';

const { Option } = Select;
class BranchTable extends React.Component {
  static propTypes = {
    loadding: PropTypes.bool,
    cancelloadding: PropTypes.bool,
    editLoadding: PropTypes.bool,
    changeBranchStore: PropTypes.func,
    getCheckData: PropTypes.func,
    saveEditArr: PropTypes.array,
    deviceBranchInfo: PropTypes.array,
    newAdd: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    stationCode: PropTypes.number,
    deviceCodes: PropTypes.array,
    editBranchData: PropTypes.func,
    copyData: PropTypes.array,
    focus: PropTypes.bool,
    selectDeviceFullCode: PropTypes.bool,
    isCheckStatus: PropTypes.bool,
    checked: PropTypes.bool,
    checkTime: PropTypes.str,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidUpdate() {
    this.refs.input && this.refs.input.focus();
  }
  queryCheckData = () => {//获取检测支路配置的状态
    this.props.changeBranchStore({ isCheckStatus: true });
    const { getCheckData, stationCode, deviceTypeCode, deviceCodes } = this.props;
    getCheckData({ stationCode, deviceTypeCode, deviceCodes });
  }
  changeSwitch = (checked) => {
    const { changeBranchStore } = this.props;
    changeBranchStore({ checked: checked });
  }
  filterData = (checked) => { //筛选变动的
    const { copyData } = this.props;
    if (checked) {
      const data = copyData.filter((e, i) => {
        const tets = e.branchList.find((e) => e.isChange === 1);
        return tets ? true : false;
      });
      return data;
    }
    return copyData;
  }
  contrastValue = () => {
    const { copyData, deviceBranchInfo = [], newAdd = [] } = this.props;
    const editArr = [];
    const rowNum = deviceBranchInfo.length ? deviceBranchInfo.length : 0;
    for (let i = 0; i < rowNum; i++) {
      const currentRowData = copyData[i] ? copyData[i] : {};
      const deviceFullCode = currentRowData.deviceFullCode;
      const deviceName = currentRowData.deviceName;
      const currentBranchList = currentRowData.branchList ? currentRowData.branchList : [];//当前展示的table的每一行的branchList
      const initrowData = deviceBranchInfo[i];
      const initBranchList = initrowData.branchList ? initrowData.branchList : [];//原table的每一行的branchList

      if (initBranchList.length <= currentBranchList.length) {//这一行的支路数新增的时候
        currentBranchList.forEach((item, index) => {
          const { pvNums, branchIndex } = item;
          //newadd此处通过branchIndex筛选出新增的数据，拿出其中的branchCode
          const addData = newAdd.filter(m => (m.branchIndex === branchIndex && m.deviceFullCode === deviceFullCode));
          const branchCode = addData[0] ? addData[0].branchCode : null;
          const initBranchListItem = initBranchList[index] ? initBranchList[index] : {};//这是原数据的每一个支路的数据
          //比较两个支路数据是否相等。不相等的话，将item存起
          if (Object.keys(initBranchListItem).length === 0) {//新增的支路数据
            editArr.push({ deviceCode: deviceFullCode, deviceName, branchIndex, pvNums, isDelete: 0 });
          } else {
            const isEqual = lodash.isEqual(item, initBranchListItem);
            if (!isEqual) {
              editArr.push({ branchCode: item.branchCode, pvNums, isDelete: 0 });
            }
          }
        });
      } else {//支路数减少的时候
        initBranchList.forEach((item, index) => {
          const curBranchListItem = currentBranchList[index] ? currentBranchList[index] : {};//这是当前数据的每一个支路的数据
          const { pvNums, branchCode } = curBranchListItem;
          if (Object.keys(curBranchListItem).length === 0) {//当前支路已经没有数据的情况下
            editArr.push({ branchCode: item.branchCode, pvNums: item.pvNums, isDelete: 1 });
          } else {
            const isEqual = lodash.isEqual(item, curBranchListItem);
            if (!isEqual) {
              editArr.push({ branchCode: item.branchCode, pvNums, isDelete: 0 });
            }
          }
        });
      }
    }
    return editArr;
  }
  saveCheckValue = () => {//保存更改的支路数据
    // const data = { deviceFullCode: focus, branchIndex, branchCode, pvNum, isDelete };
    //失去焦点的时候计算原table和当前table的差异
    const { editBranchData, copyData, stationCode, deviceTypeCode, deviceCodes } = this.props;
    const editArr = this.contrastValue();
    editBranchData({ saveEditArr: editArr, copyData, isgetTable: true, stationCode, deviceTypeCode, deviceCodes });
  }
  cancleCheckValue = () => {
    const { changeBranchStore, deviceBranchInfo } = this.props;
    changeBranchStore({ copyData: deviceBranchInfo, isCheckStatus: false, checked: false });
  }
  //点击表格变成可编辑状态
  editNum = (e, focusCode, deviceFullCode) => {
    //如果是检测支路状态可以编辑
    const { isCheckStatus, changeBranchStore } = this.props;
    // if (isCheckStatus) {
    changeBranchStore({
      focus: focusCode,
      selectDeviceFullCode: deviceFullCode,
    });
    // }
  }
  //改变支路条数
  changeBranchNum = (value) => {
    const { copyData, changeBranchStore, focus, selectDeviceFullCode } = this.props;
    const selectedArr = copyData.filter((e, i) => e.deviceFullCode === focus);//筛选的设备名称
    const selectedDevice = selectedArr[0];//选中的设备名称的数据{...}
    const branchList = selectedDevice ? selectedDevice.branchList : [];//支路的数据
    // const length = branchList ? branchList.length : 0;//支路得长度
    const length = selectedDevice ? selectedDevice.branchNums : 0;

    if (value > length) {
      const newTableData = copyData.map((e, i) => {
        if (e.deviceFullCode === selectDeviceFullCode) {
          const count = e.branchNums || 0;
          const newBranchData = Array.from({ length: +value }, (item, index) => {
            const branchItem = e.branchList[index] || {};
            return ({ branchCode: branchItem.branchCode, pvNums: 1, checkStatus: 1, branchStatus: 1, branchIndex: index + 1, isChange: 0 });
          }).slice(count);//添加支路数要，新增得数据,此处的branchIndex是和表头对上的所以是index+1
          const branchList = e.branchList.concat(newBranchData);//原有数据和新增数据拼接
          return { ...e, branchList, branchNums: value };
        }
        return { ...e };
      });

      changeBranchStore({ copyData: newTableData });
    } else {
      if (!value) {
        return;
      }
      const newTableData = copyData.map((e, i) => {
        if (e.deviceFullCode === selectDeviceFullCode) {
          //此处拿到新增的几个支路的branchIndex数据
          const branchList = e.branchList.slice(0, value);
          return { ...e, branchList, branchNums: value };
        }
        return { ...e };
      });
      changeBranchStore({ copyData: newTableData });
    }
  }
  //input失去焦点
  inputBlur = (value) => {
    const { isCheckStatus, changeBranchStore, editBranchData, copyData } = this.props;
    if (!isCheckStatus) {//非检测状态下编辑table
      const editArr = this.contrastValue();

      changeBranchStore({ saveEditArr: editArr });
      editBranchData({ saveEditArr: editArr, copyData });
    }
    this.props.changeBranchStore({
      focus: false,
    });
  }

  //判断状态显示的样式
  jugeStatus = (e) => {
    if (Object.keys(e).length === 0) {//判断是否是空{}
      return '';
    }
    const { isCheckStatus } = this.props;
    const { branchStatus, checkStatus, isChange, pvNums } = e;
    if (isCheckStatus) {//当为检测支路状态
      if (pvNums === 0) {//如果是连接条数为0就是未连接状态
        return styles.nolink;
      }
      //判断状态
      return isChange && pvNums > 0 ? styles.change : checkStatus === 1 ? styles.link : styles.nolink;
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
            item.branchStatus = value === 0 ? 0 : 1;
            item.checkStatus = value === 0 ? 0 : 1;
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
    const { changeBranchStore, focus } = this.props;
    const deviceFullCode = focus.split('_')[0];//设备名的code
    const branchIndex = focus.split('_')[1];//拿到索引
    const newTableData = this.editTableData(deviceFullCode, branchIndex, value);

    // const editArr = this.filterEditData(deviceFullCode, branchIndex, value);
    changeBranchStore({ copyData: newTableData });
  }
  //筛选出已编辑的数据，并去重
  filterEditData = (deviceFullCode, branchIndex, value, isDelete) => {
    const { selectDeviceFullCode } = this.props;
    const { saveEditArr } = this.props;
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
    const { loadding, editLoadding, cancelloadding, copyData, checkTime, isCheckStatus, focus, checked, newAdd } = this.props;

    const pvNumsArr = [1, 2, 3, 4, 5];
    const filterCopyData = this.filterData(checked);
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div className={styles.tablebox}>
        <div className={styles.checkstyle}>
          <div className={styles.leftInfo}>
            {!isCheckStatus ? <div> <Button type="primary"
              icon="deployment-unit"
              loading={loadding}
              disabled={!checkTime}
              onClick={this.queryCheckData}>
              {/* <i className="iconfont icon-save" /> */}
              支路检测
            </Button><span className={styles.tipsStyles}>至少需要三天的电流数据或基础配置才会有检测结果</span></div> :
              <div>
                <Button type="primary"
                  icon="save"
                  className={styles.btnStyle}
                  loading={editLoadding}
                  onClick={this.saveCheckValue}>
                  {/* <i className="iconfont icon-addto" /> */}
                  保存检测结果
                </Button>
                <Button type="primary"
                  loading={cancelloadding}
                  className={styles.btnStyle}
                  onClick={this.cancleCheckValue}>
                  取消
                </Button>
                <span className={styles.fontcolor}>
                  检测结果日期
                <span className={styles.dateMargin}>:</span>
                  <span>{checkTime}</span>
                </span>
                <Switch onChange={this.changeSwitch} checked={checked} />
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
            合计:{filterCopyData.length}
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

            {loadding ?
              <div className={styles.spin}>
                <Spin indicator={antIcon} tip="数据加载中" />
              </div> :
              copyData.length ? filterCopyData.map((item, index) => {
                const branchList = item.branchList;
                return (
                  <div className={index % 2 === 0 ? styles.tabletd : styles.tableEventd} key={index}>
                    <div className={styles.name}>{item.deviceName}</div>
                    <div
                      className={styles.number}
                      onClick={(e) => { this.editNum(e, item.deviceFullCode, item.deviceFullCode); }}
                    >
                      {focus === item.deviceFullCode ?
                        <InputNumber min={1} max={20}
                          ref="input"
                          onBlur={this.inputBlur}
                          onChange={this.changeBranchNum}
                          defaultValue={item.branchNums}
                        /> :
                        item.branchNums}
                    </div>
                    {Array.from({ length: 20 }, (e, i) => {
                      const branchListItem = branchList[i] ? branchList[i] : {};
                      const styleStatus = this.jugeStatus(branchListItem);
                      const branchId = `${item.deviceFullCode}_${branchListItem.branchIndex}`;
                      return (
                        <div className={styles.titleStyle} key={i}>
                          {focus === branchId ?
                            <Select
                              defaultValue={branchListItem.pvNums}
                              style={{ width: 45 }}
                              onChange={this.handleSelect}
                              onBlur={this.inputBlur}
                            >
                              <Option key={'未接入'} value={0} title={'未接入'}>未接入</Option>
                              {pvNumsArr.map((pvNum, value) => (
                                <Option key={pvNum} value={pvNum}>{pvNum}</Option>
                              ))}
                            </Select> :
                            <div
                              onClick={(info) => { this.editNum(info, branchId, item.deviceFullCode); }}
                              className={styleStatus}
                            >
                              {branchListItem.pvNums ? branchListItem.pvNums : null}
                              <div></div>
                            </div>}
                        </div>
                      );
                    })}
                  </div>
                );
              }) : <div className={styles.noData}>
                  <img src="/img/nodata.png" width="223" height="164" />
                </div>
            }
            {copyData.length > 20 && !loadding ?
              <div className={styles.nomoreData}>
                <div className={styles.noDataIcon} > <Icon type="appstore" /></div>
                <div className={styles.noDatatext}>没有更多得数据了</div>
              </div> : ''}
          </div>
        </div>
      </div >
    );
  }
}
export default (BranchTable);
