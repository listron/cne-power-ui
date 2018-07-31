import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './defectFilter.scss';
const CheckboxGroup = Checkbox.Group;

// defectLevel: '0',	   // String	是	缺陷级别（0：全部，1：一级，2：二级，3：三级，4：四级）
class DefectLevelFilter extends Component {
  static propTypes = {
    defectLevel: PropTypes.string,
    changeDefectStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  onLevelSelect = (defectLevels) => {
    this.props.changeDefectStore({defectLevel: defectLevels.join(',')});
  }

  resetLevel = () => {
    this.props.changeDefectStore({defectLevel: ''});
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
        <CheckboxGroup options={levelOptions} value={defectLevel.split(',').filter(e=>!!e)} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default DefectLevelFilter;