import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectRecord.scss';

class FilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.object,
   
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }
  onCancelStartTime = () => {//取消开始时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
    });
  }
  onCancelEndTime = () => { //取消结束时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeEnd: '',
    })
  }
  

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
      createTimeEnd: '',
     
    });
  }

  render() {
    const {createTimeStart, createTimeEnd, stations } = this.props;

   
    const selectedStation = stations.filter(e=>
      tmpSelectedStation.some(m=>
        m === e.get('stationCode').toString()
      )).groupBy(item=>item.get('provinceCode')).toList();//选中电站详情,按省分组
    const selectedDeviceType = deviceTypes.filter(e=>tmpSelectedDeviceType.some(m=>m===e.get('deviceTypeCode').toString()));//选中的设备类型详情
    if(createTimeStart===''&&createTimeEnd===''&&stationType==='2'&&stationCodes===''&&deviceTypeCode==='') {
      return null;
    }
    const style = {
      background: '#fff', 
      borderStyle: 'dashed',
      padding: '0 10px',
      height: '30px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginRight: '16px',
    }
    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {createTimeStart !== '' && <Tag style={style} closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
        {createTimeEnd !== '' && <Tag style={style} closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
       
       
        
        <Tag closable onClose={this.resetAll}>清空条件</Tag>
      </div>
    );
  }

}

export default FilteredItems;