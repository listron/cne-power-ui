import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmLevelFilter extends Component {
  static propTypes = {
    warningLevel: PropTypes.array,
    onChangeFilter: PropTypes.func,
    warningLevelName: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  onLevelSelect = (warningLevel) => {
    this.props.onChangeFilter({ warningLevel });
  }

  resetLevel = () => {
    this.props.onChangeFilter({
      warningLevel: []
    });
  }

  render() {
    const { warningLevel,warningLevelName } = this.props;
    const levels =warningLevelName ? warningLevelName: ['一级','二级','三级','四级'];
    const levelOptions = levels.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }));
    const levelArr = warningLevel;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={warningLevel.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={levelArr} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default AlarmLevelFilter;