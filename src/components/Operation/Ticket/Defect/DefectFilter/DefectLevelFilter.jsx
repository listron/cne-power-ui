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
    let defectLevel;
    if(defectLevels.length === 0) {
      defectLevel = '0';
    } else {
      defectLevel = defectLevels.join(',');
    }
    this.props.onChangeFilter({
      defectLevel
    });
  }

  resetLevel = () => {
    this.props.onChangeFilter({
      defectLevel: '0'
    });
  }

  render() {
    const { defectLevel } = this.props;
    const levels = ['A级','B级','C级'];
    const levelOptions = levels.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }));
    const levelArr = defectLevel==='0' ? []: defectLevel.split(',');
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={defectLevel==='0'?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={levelArr} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default DefectLevelFilter;