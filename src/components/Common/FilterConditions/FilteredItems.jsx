import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './filterCondition.scss';

class FilteredItems extends Component {
  static propTypes = {
    onChangeFilterChecked: PropTypes.func,
    options: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  cancleFilter = (value, optionlist, typeStatus) => {
    const { options = [] } = this.props;
    const { type, checkedValue } = optionlist;
    if (typeStatus === 'allChange') {
      optionlist.checkedValue = value;
    } else {
      optionlist.checkedValue = checkedValue.filter(e => e !== value);
    }
    options.slice(options.findIndex(e => e.type === type), 1, optionlist);
    this.props.onChangeFilterChecked({ options });
  }

  resetAll = () => {
    const { options = [] } = this.props;
    options.map(e => {
      e.checkedValue = [];
    });
    this.props.onChangeFilterChecked({ options });
  }

  render() {
    const { options = [] } = this.props;
    // belong: 'multipleSelect',
    const filterOptions = options.filter(item => item.checkedValue.length > 0);
    const multipleSelect = options.filter(item => item.belong === 'multipleSelect' && item.checkedValue.length > 0);
    const rangeTime = options.filter(item => item.type === 'rangeTime' && item.checkedValue.length > 0);
    const time = options.filter(item => item.type === 'time' && item.checkedValue.length > 0);
    return (
      <div className={styles.filteredItems}>
        {
          filterOptions.length > 0 &&
          <React.Fragment>
            <p className={styles.selectText}> 已选 </p>
            <div className={styles.tagWrap}>
              {
                multipleSelect.map(item => {
                  const { data = [], checkedValue = [], rules = ['label', 'value'] } = item;
                  const [label, value] = rules;
                  const selectedDeviceType = data.filter(e => checkedValue.some(m => m === e[value]));
                  return selectedDeviceType.map(e => <div className={styles.tag} onClick={() => this.cancleFilter(e[value], item)} key={e[value]}>{e[label]} <Icon type="close" /></div>);
                })
              }
              { // 时间阶段
                rangeTime.map(item => {
                  const { checkedValue = [], name, typeName } = item;
                  const [startTime, endTime] = checkedValue;
                  console.log(startTime, endTime);
                  return <div className={styles.tag} onClick={() => this.cancleFilter([], item, 'allChange')} key={typeName}>{name}{startTime} - {endTime} <Icon type="close" /></div>;
                })
              }
              { // 时间阶段 开始时间，结束时间
                time.map(item => {
                  const { checkedValue = [], name, typeName } = item;
                  const [startTime, endTime] = checkedValue;
                  return (<React.Fragment>
                    {startTime && <div className={styles.tag} onClick={() => this.cancleFilter([null, endTime], item, 'allChange')} key={'startTime'}>
                      {'开始时间'}{startTime} <Icon type="close" /></div>}
                    {endTime && <div className={styles.tag} onClick={() => this.cancleFilter([startTime, null], item, 'allChange')} key={'endTime'}>
                      {'结束时间'}{endTime} <Icon type="close" /></div>}
                  </React.Fragment>)
                    ;
                })
              }
              <i onClick={this.resetAll} className={styles.resetAll}>清空条件</i>
            </div>

          </React.Fragment>
        }
      </div>
    );
  }
}

export default FilteredItems;