import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './../filterCondition.scss';

class FilteredItems extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    defectTypeCode: PropTypes.array,
    defectSourceName: PropTypes.array,
    onChangeFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visiable: false,
    };
  }

  onCancelDeviceType = (cancelCode) => {//删除某设备类型
    const { deviceTypeCode, onChangeFilter } = this.props;
    onChangeFilter({
      deviceTypeCode: deviceTypeCode.filter(e => e !== `${cancelCode}`),
    });
  };

  onCancelDefectType = (cancelId) => { // 删除某缺陷类型
    const { defectTypeCode, onChangeFilter } = this.props;
    onChangeFilter({
      defectTypeCode: defectTypeCode.filter(e => e !== cancelId),
    });
  };

  getDefectInfoArr = (defectTypes, selectedTypes) => {
    const defectInfoArr = [];
    defectTypes.forEach(e => {
      if (e.list && e.list.length > 0) {
        defectInfoArr.push(...this.getDefectInfoArr(e.list, selectedTypes));
      }
      if (selectedTypes.includes(e.id)) {
        defectInfoArr.push({
          name: e.name,
          id: e.id,
        });
      }
    });
    return defectInfoArr;
  };

  resetAll = () => {// 删除所有筛选条件
    const { onChangeFilter, deviceTypeCode, defectTypeCode } = this.props;
    const prams = {};
    deviceTypeCode.length > 0 ? prams.deviceTypeCode = [] : null;
    defectTypeCode.length > 0 ? prams.defectTypeCode = [] : null;
    onChangeFilter(prams);
  };

  render() {
    const { deviceTypeCode, defectTypeCode, deviceTypes, defectTypes, theme } = this.props;
    if ((!deviceTypeCode || deviceTypeCode.length === 0) && (!defectTypeCode || defectTypeCode.length === 0)) {
      return null;
    }
    const selectedDeviceType = deviceTypes.filter(e => deviceTypeCode.some(m => +m === e.deviceTypeCode));
    const defectInfoArr = this.getDefectInfoArr(defectTypes, defectTypeCode); //选中的缺陷类型数组

    return (
      <div className={`${styles.filteredItems} ${styles[theme]}`}>
        <span>已选条件</span>
        {deviceTypeCode.length > 0 && selectedDeviceType.map((e, index) => ( // 设备类型
          <Tag className={styles.tag} closable onClose={() => this.onCancelDeviceType(e.deviceTypeCode)} key={index}>
            {e.deviceTypeName}
          </Tag>
        ))}
        {defectInfoArr.length > 0 && defectInfoArr.map(e => (//  缺陷类型
          <Tag className={styles.tag} closable onClose={() => this.onCancelDefectType(e.id)} key={e.id}>
            {e.name}
          </Tag>
        ))}
        <span onClick={this.resetAll} className={styles.clearAll}>清空条件</span>
      </div>
    );
  }

}

export default FilteredItems;
