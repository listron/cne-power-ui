import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectFilter.scss';

class FilteredItems extends Component {
  static propTypes = {
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    onChangeFilter: PropTypes.func,
    algorithmModalId: PropTypes.array,
    algorithmModalName: PropTypes.array,
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
    const { onChangeFilter, algorithmModalName, algorithmModalId } = this.props;
    // 删除多选数组
    for (let i = 0; i < algorithmModalId.length; i++) {
      if(`${e}` === algorithmModalId[i]) {
        algorithmModalId.splice(i, 1);
      }
    }
    // 删除显示的tag数组
    for (let i = 0; i < algorithmModalName.length; i++) {
      if(e === algorithmModalName[i].algorithmId) {
        algorithmModalName.splice(i, 1);
      }
    }
    onChangeFilter({
      algorithmModalId,
      algorithmModalName
    })
  };

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
      createTimeEnd: '',
      algorithmModalId: [],
      algorithmModalName: []
    });
  };

  render() {
    const {createTimeStart, createTimeEnd, algorithmModalName } = this.props;
    console.log(algorithmModalName, "algorithmModalName");
    if(createTimeStart === '' && createTimeEnd === '' && (!algorithmModalName || algorithmModalName.length === 0)) {
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
        {algorithmModalName.length > 0 && algorithmModalName.map(e=>(
          <Tag style={style} closable onClose={()=>this.onCancelAlgorithm(e.algorithmId)} key={e.algorithmId} >
            {`${e.algorithmName}`}
          </Tag>
        ))}
        <span className={styles.filterDeleteAll} onClick={this.resetAll}>清空条件</span>
      </div>
    );
  }

}

export default FilteredItems;
