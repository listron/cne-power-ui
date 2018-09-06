import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './defectFilter.scss';
const CheckboxGroup = Checkbox.Group;

class DefectLevelFilter extends Component {
  static propTypes = {
    defectLevel: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onLevelSelect = (defectLevels) => {
    this.props.onChangeFilter({
      defectLevel: defectLevels.join(',')
    });
  }

  resetLevel = () => {
    this.props.onChangeFilter({
      defectLevel: '0'
    });
  }

  render() {
    const { defectLevel } = this.props;
    const levels = ['一级','二级','三级','四级'];
    const levelOptions = levels.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }))
    return (
      <div className={styles.defectLevelFilter}>
        <span onClick={this.resetLevel} className={defectLevel==='0'?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={defectLevel.split(',')} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default DefectLevelFilter;