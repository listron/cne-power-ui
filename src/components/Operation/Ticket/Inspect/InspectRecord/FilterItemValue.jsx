import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectRecord.scss';

class FilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.object,

    inspectTimeStart: PropTypes.string,
    inspectTimeEnd: PropTypes.string,
    inspectUserId: PropTypes.string,
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
  onCancelDeviceType = (cancelCode) => {//删除某巡检人
    const { inspectUserId, onChangeFilter } = this.props;
    const newInspectUserId = inspectUserId.split(',').filter(e => e !== cancelCode);
    onChangeFilter({
      inspectUserId: newInspectUserId.join(',')
    });
  }

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      inspectTimeStart: '',
      inspectTimeEnd: '',
      inspectUserId: '',
    });
  }

  render() {
    const { inspectTimeStart, inspectTimeEnd, inspectUserId, inspectPersonList } = this.props;
    const inspectUserArray = inspectUserId.split(',');
    // console.log(inspectPersonList);
    // console.log(inspectUserArray);


    const selectedInspectPerson = inspectUserArray.map(e => {
      return inspectPersonList.filter(item => item.inspectUserId === e)
    });
   // console.log(selectedInspectPerson);
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
        {selectedInspectPerson.length > 0 && selectedInspectPerson.map((e,i) => (
          <Tag style={style} closable onClose={() => this.onCancelDeviceType(e.inspectUserId)} key={i}>
            {e[0]&&e[0].inspectUserName}
          </Tag>
        ))}
        <Tag closable onClose={this.resetAll}>清空条件</Tag>
      </div>
    );
  }

}

export default FilteredItems;