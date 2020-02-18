import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import { Button, Switch, Icon } from 'antd';

class FilterConditionTitle extends Component {
  static propTypes = {
    showFilterBox: PropTypes.bool,
    options: PropTypes.array,
    onChange: PropTypes.func,
    onChangeFilter: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      showFilter: {},
    };
  }

  onFilterShowChange = (item) => { //筛选出应该展示哪一个
    const { type, typeName } = item;
    const { showFilterBox } = this.props;
    const { showFilter } = this.state;
    let showFilterType = { type, typeName };
    if (
      showFilter.type === item.type
      && showFilter.typeName === item.typeName
      && showFilterBox
      // showFilterBox: true-默认情况; false有外部控制, 继续进行展示
    ) {
      showFilterType = { type: '', typeName: '' };
    }
    this.setState({ showFilter: showFilterType });
    this.props.onChange({ showFilter: showFilterType });
  }

  switchChange = (value, option) => {
    option.checkedValue = value;
    this.props.onChangeFilter({ option });
  }

  render() {
    const { options, showFilterBox } = this.props;
    const { showFilter } = this.state;
    return (
      <div className={`${styles.filterConditionTitle}`}>
        <span className={styles.text}>筛选条件</span>
        <div className={styles.filterlistBox}>
          {
            options.map((item, key) => {
              if (item.type === 'switch') {
                return (
                  <div className={styles.switch} key={key}>
                    <Switch onChange={(value) => this.switchChange(value, item)} checked={!!item.checkedValue} disabled={item.disabled || false} />
                    <span className={styles.switchText}>{item.name || '我参与的'}</span>
                  </div>);
              }
              return (
                <div
                  onClick={() => this.onFilterShowChange(item)}
                  key={key}
                  className={`${styles.filterlist} ${item.disabled && styles.disabled}`}>
                  {item.name} {(
                    showFilter.type === item.type
                      && showFilter.typeName === item.typeName
                      && !item.disabled
                      && showFilterBox
                    ) ? <Icon type="up" /> : <Icon type="down" />}
                </div>);
            })
          }
        </div>
      </div>
    );
  }

}

export default FilterConditionTitle;
