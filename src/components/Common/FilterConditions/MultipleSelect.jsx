import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class MultipleSelect extends Component {
  static propTypes = {
    onChangeFilter: PropTypes.func,
    option: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => { // 改变值
    const { option = {} } = this.props;
    option.checkedValue = value;
    this.props.onChangeFilter({ option });
  }

  onReset = () => { // 置空
    const { option = {} } = this.props;
    option.checkedValue = [];
    this.props.onChangeFilter({ option });
  }

  render() {
    const { option = {} } = this.props;
    const { data = [], rules = ['label', 'value'], checkedValue = [] } = option;
    const [label, value] = rules;
    const optionArr = [];
    data.forEach((item, i) => {
      if (item[label]) {
        optionArr.push({
          label: item[label],
          value: item[value],
        });
      }
    });
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={checkedValue.length === 0 ? styles.selected : styles.all}>不限</span>
        <CheckboxGroup options={optionArr} value={checkedValue} onChange={this.onChange} />
      </div>
    );
  }
}

export default MultipleSelect;
