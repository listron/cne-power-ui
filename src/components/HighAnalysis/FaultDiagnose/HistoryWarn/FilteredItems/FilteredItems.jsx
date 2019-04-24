import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectFilter.scss';

class FilteredItems extends Component {
  static propTypes = {
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

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
      createTimeEnd: '',
      algorithmModalId: []
    });
  };

  render() {
    const {createTimeStart, createTimeEnd, algorithmModalId } = this.props;
    if(createTimeStart === '' && createTimeEnd === '' && algorithmModalId.length === 0) {
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
