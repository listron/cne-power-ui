import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import InfoDetail from './InfoDetail';
import InfoEdit from './InfoEdit';
import styles from './handle.scss';
import PropTypes from 'prop-types';
import { MyMessage } from '../../Common/MyMessage/MyMessage';

export default class HandleInfo extends Component {

  static propTypes = {
    handleInfos: PropTypes.array,
    addhandleList: PropTypes.array,
    changeStore: PropTypes.func,
    editDisplay: PropTypes.bool,
    allowedActions: PropTypes.array,
    addDefectHandle: PropTypes.func,
    isFinish: PropTypes.string,
    myMessageFlag: PropTypes.bool,
    isVertify: PropTypes.bool,
    addMultipleEvent: PropTypes.bool,
    singleSave: PropTypes.bool,
    handleMessageFlag: PropTypes.bool,
    docketId: PropTypes.string,
  };


  componentDidMount() {
    const { editDisplay, addhandleList, docketId } = this.props;
    if (editDisplay) {
      const handleInfo = {
        index: 1,
        docketId,
        handleDesc: null,
        isChangePart: 0,
        isCoordinate: 0,
        partName: null,
        coordinateDesc: null,
        handleImgs: [],
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
        index: 1,
        docketId,
        handleDesc: null,
        isChangePart: 0,
        isCoordinate: 0,
        partName: null,
        coordinateDesc: null,
        handleImgs: [],
        handleVideo: [],
      };
      addhandleList.push(handleInfo);
      this.props.changeStore({ addhandleList });
    }
  }

  addHandleInfo = () => { // 添加记录, 新增一个新的可填写表单区域
    const { addhandleList, docketId } = this.props;
    const index = addhandleList.length > 0 && addhandleList[0].index || 0; // 用于创建的删除使用
    const handleInfo = {
      index: index + 1,
      docketId: docketId,
      handleDesc: null,
      isChangePart: 0,
      isCoordinate: 0,
      partName: null,
      coordinateDesc: null,
      handleImgs: [],
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
    const curIndex = addhandleList.findIndex(e => e.index === index);
    addhandleList[curIndex] = { ...addhandleList[curIndex], ...rest };
    this.props.changeStore({ addhandleList });
  }


  saveHandle = (record) => { // 保存处理信息(单独)
    const { index } = record;
    const { handleImgs = [], handleVideos = [], ...rest } = record;
    const curImg = handleImgs.length > 0 && handleImgs.map(e => e.url) || [];
    const { addhandleList, addDefectHandle } = this.props;
    const curIndex = addhandleList.findIndex(e => e.index === index);
    addDefectHandle({
      record: {
        ...rest,
        handleImg: curImg,
        handleVideo: handleVideos,
      },
      func: () => {
        addhandleList.splice(curIndex, 1);
        this.props.changeStore({ addhandleList, handleMessageFlag: true });
        setTimeout(() => {
          this.props.changeStore({ handleMessageFlag: false });
        }, 2000);
      },
    });
  }

  delHandle = (record) => { // 删除处理信息
    const { index } = record;
    const { addhandleList } = this.props;
    const curIndex = addhandleList.findIndex(e => e.index === index);
    addhandleList.splice(curIndex, 1);
    this.props.changeStore({ addhandleList });
  }

  render() {
    const { handleInfos = [], allowedActions = [], addhandleList = [], isVertify, addMultipleEvent, isFinish, singleSave, handleMessageFlag } = this.props;
    const isAdd = this.exchangeActioncode(allowedActions, '15'); // 添加缺陷事件的权限是14
    const canAdd = addMultipleEvent ? isAdd : addhandleList.length === 0 && isAdd; // 可以添加一条还是添加多条
    // const editRight = this.exchangeActioncode(allowedActions, '23');
    return (
      <section className={styles.handleInfo}>
        {<h4 className={styles.handleTitle}>
          <div className={styles.titleName}>处理信息</div>
          {canAdd && <CneButton className={styles.btn} onClick={this.addHandleInfo}>
            <i className={`iconfont icon-newbuilt ${styles.btnIcon}`} />
            <span className={styles.actionName}>添加记录</span>
          </CneButton>}
        </h4>}
        {handleMessageFlag && <MyMessage message={'保存成功'} />}
        <div className={styles.handleContents}>
          {addhandleList.map((e, i) => (
            <InfoEdit
              key={e.index}
              record={e}
              saveChange={this.saveHandle}
              onChange={this.infoChange}
              delChange={this.delHandle}
              isVertify={isVertify}
              closeIconisShow={isFinish === '1'}
              singleSave={singleSave}
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
