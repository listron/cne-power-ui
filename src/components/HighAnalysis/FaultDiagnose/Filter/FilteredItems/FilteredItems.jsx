import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectFilter.scss';

class FilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.object,
    stationCodes: PropTypes.string,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    onChangeFilter: PropTypes.func,
    algorithmModalId: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.resetAll = this.resetAll.bind(this);
  }

  onCancelStartTime = () => {//取消开始时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
    });
  };

  onCancelEndTime = () => { //取消结束时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeEnd: '',
    })
  };

  onCancelAlgorithm = (e) => { //取消算法模型
    const { onChangeFilter, algorithmModalId } = this.props;
    Array.prototype.remove = function(val) {
      const index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    algorithmModalId.remove(e);
    onChangeFilter({
      algorithmModalId: algorithmModalId,
    })
  };

  onCancelProvince = (cancelStations) => {//删除某省电站
    const { stationCodes, onChangeFilter } = this.props;
    const newStationCode = stationCodes.split(',').filter(code=>
      !cancelStations.some(station=>station.get('stationCode').toString()===code)
    );
    onChangeFilter({
      stationCodes: newStationCode.join(','),
    });
  };

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
      createTimeEnd: '',
      stationCodes: '',
      algorithmModalId: []
    });
  };

  render() {
    const {createTimeStart, createTimeEnd, stationCodes, stations, algorithmModalId } = this.props;
    const tmpSelectedStation = stationCodes.split(',');//选中电站的数组
    const selectedStation = stations.filter(e=>
      tmpSelectedStation.some(m=>
        m === e.get('stationCode').toString()
      )).groupBy(item=>item.get('provinceCode')).toList();//选中电站详情,按省分组
    if(createTimeStart === '' && createTimeEnd === '' && stationCodes === '' && algorithmModalId.length === 0) {
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
    };

    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {createTimeStart !== '' && <Tag style={style} closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
        {createTimeEnd !== '' && <Tag style={style} closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
        {selectedStation.size > 0 && selectedStation.map(e=>(
          <Tag style={style} closable onClose={()=>this.onCancelProvince(e)} key={e.getIn([0, 'provinceCode']) && e.getIn([0, 'provinceCode']).toString()} >
            {`${e.getIn([0, 'provinceName'])} ${e.size}`}
          </Tag>
        ))}
        {algorithmModalId.length > 0 && algorithmModalId.map(e=>(
          <Tag style={style} closable onClose={()=>this.onCancelAlgorithm(e)} key={e} >
            {`${e}`}
          </Tag>
        ))}
        <span className={styles.filterDeleteAll} onClick={this.resetAll}>清空条件</span>
      </div>
    );
  }

}

export default FilteredItems;
