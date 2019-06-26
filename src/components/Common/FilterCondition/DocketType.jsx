import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class DocketType extends Component {
  static propTypes = {
    docketTypeList: PropTypes.array,
    docketTypes: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      docketTypes: value
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      docketTypes: []
    });
  }

  render() {
    const { docketTypeList, docketTypes = [] } = this.props;
    const options = docketTypeList.map((item, i) => ({
      label: item.name,
      value: `${item.code}`,
      key:i,
    }));
    return (
      <div className={styles.deviceTypeFilter}>
        <span onClick={this.onReset} className={docketTypeList.length === 0 ? styles.selected : styles.all}>不限</span>
        <CheckboxGroup options={options} value={docketTypes} onChange={this.onChange} />
      </div>
    );
  }
}

export default DocketType;