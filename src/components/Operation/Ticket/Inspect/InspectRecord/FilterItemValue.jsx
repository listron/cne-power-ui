import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectRecord.scss';

class FilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.object,
   
    inspectTimeStart: PropTypes.string,
    inspectTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }
  onCancelStartTime = () => {//取消开始时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      inspectTimeStart: '',
    });
  }
  onCancelEndTime = () => { //取消结束时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      inspectTimeEnd: '',
    })
  }
  

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      inspectTimeStart: '',
      inspectTimeEnd: '',
     
    });
  }

  render() {
    const {inspectTimeStart, inspectTimeEnd,  } = this.props;  
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
        {inspectTimeStart !== '' && <Tag style={style} closable onClose={this.onCancelStartTime}>开始 {inspectTimeStart}</Tag>}
        {inspectTimeEnd !== '' && <Tag style={style} closable onClose={this.onCancelEndTime}>结束 {inspectTimeEnd}</Tag>}
              
        <Tag closable onClose={this.resetAll}>清空条件</Tag>
      </div>
    );
  }

}

export default FilteredItems;