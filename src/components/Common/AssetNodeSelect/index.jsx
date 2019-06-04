import React, { Component } from 'react';
import { Select, AutoComplete, message, Icon } from 'antd';
import AssetNodeModal from './AssetNodeModal'
import styles from './style.scss';
import PropTypes from 'prop-types';
const Option = Select.Option;
/*
  电站选择组件：
  参数:
  1. 必填 - 
  onChange函数，返回已选节点assetsIds:[];
  assetList，渲染树的数据

  2.选填
  stationTypeCount，控制风电站光电站权限，如果是值是multiple，
  则必传queryDataType函数，供组件请求风电或者光电的资产结构树数据。，
  stationType，数据所属的电站类型，1是光，0是风，默认选中光


  assetsIds:[],默认选中的节点
  checkedName:'',单选节点时默认展示的值。

  resetValue:bool,true时重置所选。
*/

class StationSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    assetsIds: PropTypes.array,
    visiable: PropTypes.bool,
    assetList: PropTypes.array,
    stationType: PropTypes.number,
    queryDataType: PropTypes.func,
    onChange: PropTypes.func,
    stationTypeCount: PropTypes.string,
  }
  static defaultProps = {
    multiple: false,
    holderText: '输入关键字快速查询',
    disabled: false,
    data: [],
    disabledStation: [],
    assetsIds: [],
    visiableModal: false,
    stationType: 1,
    stationTypeCount: 'single',
  }
  constructor(props) {
    super(props);
    this.state = {
      assetsIds: props.assetsIds,
      assetList: props.assetList,
      stationType: props.stationType,
      checkedName: props.checkedName,
      stationTypeCount: props.stationTypeCount
    }
  }
  componentWillReceiveProps(nextProps){
    const { resetValue} = nextProps;
    if(resetValue &&this.props.resetValue===false){
      this.setState({
        assetsIds: [],
        checkedName: '',
      })
    }
  }
  onModalHandelOK = (value, name) => {
    this.setState({
      visiableModal: false,
      assetsIds: value,
      checkedName: name,
    })
    this.props.onChange({ assetsIds: value,checkedName:name, });
  }
  getNodeNum = (data) => {//统计树的所有节点
    let numArr = [];
    data.forEach((e, i) => {
      if (e && e.childernNodes) {
        numArr.push(...this.getNodeNum(e.childernNodes))
      }
      if (e && e.assetsId) {
        numArr.push(e.assetsId)
      }
    })
    return numArr
  }
  hideModal = () => {
    this.setState({ visiableModal: false })
  }
  showModal = () => {
    this.setState({ visiableModal: true });
  }
  queryDataType = (value) => {
    this.setState({ stationType: value })
    this.props.queryDataType(value)
  }
  maxTagPlaceholder = () => {//显示已选中条数
    const { assetList, multiple, } = this.props;
    if (multiple) {
      let count = this.getNodeNum(assetList).length;
      return <div>已选{this.state.assetsIds.length}/{count}<span onClick={this.clearList}><Icon type="close" /></span></div>
    }
    return <div>{this.state.checkedName}</div>

  }
  clearList = () => {
    this.setState({ assetsIds: [] });
  }
  render() {
    const { multiple, assetList, } = this.props;
    const { visiableModal,  stationType, assetsIds,checkedName, stationTypeCount } = this.state;
    return (
      <div className={styles.stationSelect}>
        {
          <span className={styles.selectStyle} onClick={this.showModal}>
            {multiple ? <Select
              mode="multiple"
              placeholder="选择节点"
              value={assetsIds}
              onChange={this.handleChange}
              style={{ width: '198px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={[]}
              open={false}
            >
            </Select> : <AutoComplete
              disabled={false}
              style={{ width: '100%' }}
              onSearch={this.handleSearch}
              onSelect={this.onSelect}
              value={checkedName}
              placeholder={'选择节点'}
            >

              </AutoComplete>}
          </span>}
        <AssetNodeModal
          multiple={multiple}
          {...this.props}
          assetsIds={assetsIds}
          sourceData={assetList}
          stationType={stationType}
          handleOK={this.onModalHandelOK}
          visiable={visiableModal}
          hideModal={this.hideModal}
          showModal={this.showModal}
          queryDataType={this.queryDataType}
          stationTypeCount={stationTypeCount}
        />
      </div>
    )

  }
}
export default StationSelect;