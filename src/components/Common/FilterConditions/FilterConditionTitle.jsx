import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import { Button, Switch, Icon } from 'antd';

class FilterConditionTitle extends Component {
  static propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      showFilter: '',
    };
  }

  onFilterShowChange = (type) => { //筛选出应该展示哪一个
    const { showFilter } = this.state;
    let showFilterType = type;
    if (showFilter === type) {
      showFilterType = '';
    }
    this.setState({ showFilter: showFilterType });
    this.props.onChange({ showFilter: showFilterType });
  }

  render() {
    const { options } = this.props;
    const { showFilter } = this.state;
    return (
      <div className={`${styles.filterConditionTitle}`}>
        <span className={styles.text}>筛选条件</span>
        {
          options.map(item => {
            return (
              <div onClick={() => this.onFilterShowChange(item.type)} key={item.type} className={styles.filterlist}>
                {item.name}
                {showFilter === item.type ? <Icon type="up" /> : <Icon type="down" />}
              </div>);
          })
        }
      </div>
    );
  }

}

export default FilterConditionTitle;