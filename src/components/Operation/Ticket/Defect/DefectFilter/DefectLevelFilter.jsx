import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './defectFilter.scss';
const CheckboxGroup = Checkbox.Group;

class DefectLevelFilter extends Component {
  static propTypes = {
    defectLevel: PropTypes.string,
    listQueryParams: PropTypes.object,
    getDefectList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  onLevelSelect = (defectLevels) => {
    this.props.getDefectList({
      ...this.props.listQueryParams,
      defectLevel: defectLevels.join(',')
    })
  }

  resetLevel = () => {
    this.props.getDefectList({
      ...this.props.listQueryParams,
      defectLevel: '0'
    })
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
        <span onClick={this.resetLevel} >不限</span>
        <CheckboxGroup options={levelOptions} value={defectLevel.split(',').filter(e=>e>0)} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default DefectLevelFilter;