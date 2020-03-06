import React, { Component, PureComponent } from 'react';
import styles from './alarmEvent.scss';
import PropTypes from 'prop-types';
import { Input, Select, Tree } from 'antd';
const { TreeNode, DirectoryTree } = Tree;
import SetVersionModal from './SetVersionModal';
import WarningTip from '../../../Common/WarningTip/index';
import searchUtil from '@utils/searchUtil';
import CneTips from '../../../Common/Power/CneTips/index';

class VersionSelect extends PureComponent {
  static propTypes = {
    changeStore: PropTypes.func,
    deviceTypeCode: PropTypes.number,
    diagConfigData: PropTypes.array,
    stations: PropTypes.array,
    editVersion: PropTypes.func,
    editVersionLoading: PropTypes.bool,
    delVersion: PropTypes.func,
    getVersionStation: PropTypes.func,
    getDiagVersion: PropTypes.func,
    getAlarmEvent: PropTypes.func,
    getVersionEvent: PropTypes.func,
    applyStations: PropTypes.array,
    FilterConditionStations: PropTypes.func,
    modifyStatus: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      addVersionModal: false,
      selectVersion: {}, // 编辑版本信息
      type: 'add', // 添加，edit 编辑
      showWarningTip: false, // 确定删除版本弹框
      showWarningVersion: false, // 不能删除版本弹框
      delVersionArr: [], // 删除的版本
      deviceTypeArr: [], // 设备类型版本
      modifytip: false, // 退出后信息无法保存的提示
      callback: null, // 回调函数
    };
  }


  componentDidMount() {
    const { history } = this.props;
    const { search } = history.location;
    const { applyStation = {} } = searchUtil(search).parse();
    if (Object.keys(applyStation).length > 0) {
      this.setState({ addVersionModal: true, type: 'add' });
      this.props.changeStore({ applyStations: [JSON.parse(applyStation)] }); // 应用电站信息
    }
  }

  componentWillReceiveProps(nextProps) {
    const { diagConfigData, deviceTypeCode, selectedNodesKey } = nextProps;
    if (diagConfigData.length !== this.props.diagConfigData.length || deviceTypeCode !== this.props.deviceTypeCode || !selectedNodesKey) {
      const initDiagConfigData = diagConfigData.filter(e => `${e.deviceTypeCode}` === `${deviceTypeCode}`) || [];
      const { manufactors = [] } = initDiagConfigData[0] || {};
      const { manufactorCode, deviceModes = [] } = manufactors.length > 0 && manufactors[0] || {};
      const { deviceModeCode, versions = [] } = deviceModes.length > 0 && deviceModes[0];
      const initTreeSelect = `${manufactorCode}_${deviceModeCode}`;
      const diagModeVersionId = versions.length > 0 && versions[0].diagModeVersionId || '';
      if (deviceModeCode && !selectedNodesKey) { // 初始加载的时候
        this.props.changeStore({ deviceModeCode, expandedKeys: [`${manufactorCode}`, initTreeSelect], selectedNodesKey: `${initTreeSelect}_${diagModeVersionId}` });
        this.props.getVersionEvent({ diagModeVersionId });
      }
    }
  }

  modifytip = (callback) => {
    this.setState({ modifytip: true, callback });
  }

  changeDeviceType = (value) => { // 改变设备类型
    const { modifyStatus } = this.props;
    const callback = () => {
      this.props.changeStore({ deviceTypeCode: value, selectedNodesKey: '', expandedKeys: [] });
      this.props.getAlarmEvent({ eventType: 1, deviceTypeCode: value });
    };
    if (!modifyStatus) {
      callback();
    }
    if (modifyStatus) {
      this.modifytip(callback);
    }
  }

  addVersion = (event, type, value) => { // 添加软件版本
    event.stopPropagation();
    const { modifyStatus } = this.props;
    const callback = () => {
      if (type === 'edit') {
        this.props.getVersionStation({ diagModeVersionId: value.diagModeVersionId });
      }
      if (value) {
        this.setState({ selectVersion: value });
      }
      this.setState({ addVersionModal: true, type });
    };

    if (!modifyStatus) {
      callback();
    }
    if (modifyStatus) {
      this.modifytip(callback);
    }
  }

  delVersion = (event, id) => { // 删除软件版本
    event.stopPropagation();
    this.setState({ showWarningTip: true, delVersionArr: [id] });
  }

  selectversion = (event, id, deviceModeCode, manufactorCode) => { //选择版本查看告警事件
    event.stopPropagation();
    const { modifyStatus } = this.props;
    const callback = () => {
      this.props.changeStore({ deviceModeCode, selectedNodesKey: `${manufactorCode}_${deviceModeCode}_${id}` });
      this.props.getVersionEvent({ diagModeVersionId: id });
    };
    if (!modifyStatus) {
      callback();
    }
    if (modifyStatus) {
      this.modifytip(callback);
    }

  }

  closeModal = (value) => { // 关闭软件版本的弹框
    this.setState({ addVersionModal: value });
    this.props.changeStore({ applyStations: [] });
  }

  cancelWarningTip = () => {
    this.setState({ showWarningTip: false });
  }

  confirmWarningTip = () => {
    const { delVersionArr } = this.state;
    this.props.delVersion({ diagModeVersionIds: delVersionArr, func: () => { this.setState({ showWarningVersion: true }); } });
    this.setState({ delVersionArr: [], showWarningTip: false });
  }

  onExpand = (expandedKeys) => { // 展开树节点
    this.props.changeStore({ expandedKeys });
  }

  tipConfirm = () => {
    setTimeout(() => this.setState({ modifytip: false }), 0);
    const { callback } = this.state;
    callback();
  }

  render() {
    const { addVersionModal, selectVersion, type, showWarningTip, showWarningVersion, modifytip } = this.state;
    const { stations = [], diagConfigData, deviceTypeCode, editVersion, editVersionLoading, applyStations, diagModeVersionId, expandedKeys } = this.props;
    const initDiagConfigData = diagConfigData.filter(e => `${e.deviceTypeCode}` === `${deviceTypeCode}`) || [];
    const deviceTypeArr = diagConfigData.map(e => ({ deviceTypeCode: e.deviceTypeCode, deviceTypeName: e.deviceTypeName }));
    return (
      <div className={styles.VersionSelectCont}>
        <CneTips
          onCancel={() => this.setState({ showWarningTip: false })}
          onConfirm={this.confirmWarningTip}
          visible={showWarningTip}
          tipText={'确定删除此软件版本的告警事件规则吗？'}
          tipClassname={styles.modalWidth}
          confirmText={'确认'}
        />
        <CneTips
          onCancel={() => this.setState({ showWarningVersion: false })}
          visible={showWarningVersion}
          tipText={'此软件版本的告警事件规则存在应用电站，不可删除!'}
          mode={'cancel'}
          tipClassname={styles.modalWidth}
          confirmText={'确认'}
        />
        <CneTips
          tipText={'退出后信息无法保存'}
          onConfirm={this.tipConfirm}
          onCancel={() => this.setState({ modifytip: false })}
          visible={modifytip}
          tipClassname={styles.modalWidth}
          confirmText={'确认'}
        />
        <div className={styles.icon} onClick={(e) => this.addVersion(e, 'add', {})}> <i className={'iconfont icon-newbuilt'} /> <span>添加软件版本</span>  </div>
        <div className={styles.deviceType}>
          <Select style={{ width: 212 }} onSelect={this.changeDeviceType} value={deviceTypeCode}>
            {deviceTypeArr.map(e => {
              return (<Select.Option value={e.deviceTypeCode} key={e.deviceTypeCode}>{e.deviceTypeName}</Select.Option>);
            })}
          </Select>
        </div>
        <div className={styles.cont}>
          <div className={styles.tree}>
            {
              initDiagConfigData.length > 0 &&
              <DirectoryTree showIcon={false} expandedKeys={this.props.expandedKeys} onExpand={this.onExpand} selectedKeys={[this.props.selectedNodesKey]}>
                {initDiagConfigData[0].manufactors.map(manufactors => {
                  return (
                    <TreeNode title={
                      <div className={styles.manufactorName} title={manufactors.manufactorName}>{manufactors.manufactorName}</div>} key={manufactors.manufactorCode}>
                      {manufactors.deviceModes.map(deviceMode =>
                        (<TreeNode key={`${manufactors.manufactorCode}_${deviceMode.deviceModeCode}`} title={
                          <div className={styles.deviceModeName} title={deviceMode.deviceModeName}>
                            <span>{deviceMode.deviceModeName}</span>
                            <i className="iconfont icon-newbuilt" onClick={(e) => {
                              this.addVersion(e, 'add', { deviceTypeCode: deviceTypeCode, manufactorCode: manufactors.manufactorCode, deviceModeCode: deviceMode.deviceModeCode });
                            }} />
                          </div>} >
                          {deviceMode.versions.map(ver => {
                            return (<TreeNode key={`${manufactors.manufactorCode}_${deviceMode.deviceModeCode}_${ver.diagModeVersionId}`} className={styles.version}
                              title={
                                <div className={styles.versionWrap} title={ver.version} onClick={(e) => {
                                  this.selectversion(e, ver.diagModeVersionId, deviceMode.deviceModeCode, manufactors.manufactorCode);
                                }}>
                                  <div className={`${styles.versionName} ${diagModeVersionId === ver.diagModeVersionId && styles.selectVersionName}`}>{ver.version}</div>
                                  <div className={styles.poerate}>
                                    <i className="iconfont icon-edit" title="编辑" onClick={(e) => {
                                      this.addVersion(e, 'edit', {
                                        deviceTypeCode: deviceTypeCode,
                                        manufactorCode: manufactors.manufactorCode,
                                        deviceModeCode: deviceMode.deviceModeCode,
                                        diagModeVersionId: ver.diagModeVersionId,
                                        version: ver.version,
                                      });
                                    }} />
                                    <i className="iconfont icon-del" title="删除" onClick={(e) => this.delVersion(e, ver.diagModeVersionId)} />
                                  </div>
                                </div>}
                            />);
                          })}
                        </TreeNode>)
                      )}
                    </TreeNode>
                  );
                })}
              </DirectoryTree>
            }
          </div>
        </div>
        {
          addVersionModal &&
          <SetVersionModal
            staticData={diagConfigData}
            stations={stations}
            closeModal={this.closeModal}
            selectVersion={selectVersion}
            type={type}
            editVersion={editVersion}
            editVersionLoading={editVersionLoading}
            deviceTypes={deviceTypeArr}
            applyStations={applyStations}
            FilterConditionStations={this.props.FilterConditionStations}
            filterStations={this.props.filterStations}
            changeStore={this.props.changeStore}
          />
        }
      </div>
    );
  }
}




export default VersionSelect;
