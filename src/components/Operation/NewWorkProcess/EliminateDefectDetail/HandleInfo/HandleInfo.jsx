import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import InfoDetail from './InfoDetail';
import InfoEdit from './InfoEdit';
import styles from './handle.scss';
import PropTypes from 'prop-types';

export default class HandleInfo extends Component {

  static propTypes = {
    handleInfos: PropTypes.array,
    addhandleList: PropTypes.array,
    changeStore: PropTypes.func,
    editDisplay: PropTypes.bool,
    allowedActions: PropTypes.array,
    addDefectHandle: PropTypes.func,
    isFinish: PropTypes.string,
  };

  componentDidMount = () => {
    const { editDisplay, addhandleList, docketId } = this.props;
    if (editDisplay) {
      const handleInfo = {
        index: 0,
        docketId,
        handleDesc: null,
        isChangePart: 0,
        isCoordinate: 0,
        partName: null,
        coordinateDesc: null,
        handleImg: [],
        handleVideo: [],
      };
      addhandleList.push(handleInfo);
      this.props.changeStore({ addhandleList });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { editDisplay, addhandleList, docketId } = nextProps;
    if (!this.props.editDisplay && editDisplay) {
      const handleInfo = {
        index: 0,
        docketId,
        handleDesc: null,
        isChangePart: 0,
        isCoordinate: 0,
        partName: null,
        coordinateDesc: null,
        handleImg: [],
        handleVideo: [],
      };
      addhandleList.push(handleInfo);
      this.props.changeStore({ addhandleList });
    }
  }

  addHandleInfo = () => {
    // 添加记录, 新增一个新的可填写表单区域
    const { addhandleList, docketId } = this.props;
    const index = addhandleList.length > 0 && addhandleList[0].index || -1; // 用于创建的删除使用
    const handleInfo = {
      index: index + 1,
      docketId: docketId,
      handleDesc: null,
      isChangePart: 0,
      isCoordinate: 0,
      partName: null,
      coordinateDesc: null,
      handleImg: [],
      handleVideo: [],
    };
    addhandleList.unshift(handleInfo);
    this.props.changeStore({ addhandleList });
  }

  exchangeActioncode = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }

  infoChange = (value) => { // 处理信息的发生改变
    const { index, ...rest } = value;
    const { addhandleList } = this.props;
    addhandleList[index] = { ...addhandleList[index], ...rest };
    this.props.changeStore({ addhandleList });
  }

  saveHandle = (record) => { // 保存处理信息(单独)
    const { index } = record;
    const { addhandleList, addDefectHandle } = this.props;
    addDefectHandle({
      record,
      func: () => {
        addhandleList.splice(index, 1);
        this.props.changeStore({ addhandleList });
      },
    });
  }

  delHandle = (record) => {
    const { index } = record;
    const { addhandleList } = this.props;
    addhandleList.splice(index, 1);
    this.props.changeStore({ addhandleList });
  }

  render() {
    const { handleInfos = [], allowedActions = [], addhandleList = [], isVertify, addMultipleEvent } = this.props;
    const isAdd = this.exchangeActioncode(allowedActions, '15'); // 添加的权限是14
    const canAdd = addMultipleEvent ? isAdd : addhandleList.length === 0 && isAdd; // 可以添加一条还是添加多条
    return (
      <section className={styles.handleInfo}>
        {!(addhandleList.length === 0 && handleInfos.length === 0) && <h4 className={styles.handleTitle}>
          <div className={styles.titleName}>处理信息</div>
          {canAdd && <CneButton className={styles.addBtn} onClick={this.addHandleInfo}>
            <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
            <span className={styles.text}>添加记录</span>
          </CneButton>}
        </h4>}

        <div className={styles.handleContents}>
          {addhandleList.map((e, i) => (
            <InfoEdit
              key={e.index}
              record={e}
              saveChange={this.saveHandle}
              onChange={this.infoChange}
              delChange={this.delHandle}
              isVertify={isVertify}
            />
          ))}
          {handleInfos.map((e, i) => (
            <InfoDetail key={i} {...e} />
          ))}
        </div>
      </section>
    );
  }
}
