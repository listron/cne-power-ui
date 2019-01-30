import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class DefectLevelFilter extends Component {
  static propTypes = {
    defectLevel: PropTypes.array,
    onChangeFilter: PropTypes.func,
    defectLevelName: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  onLevelSelect = (defectLevels) => {
    let defectLevel=defectLevels;
    this.props.onChangeFilter({
      defectLevel
    });
  }

  resetLevel = () => {
    this.props.onChangeFilter({
      defectLevel: []
    });
  }

  render() {
    const { defectLevel,defectLevelName } = this.props;
    const levels =defectLevelName ? defectLevelName: ['A级','B级','C级'];
    const levelOptions = levels.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }));
    const levelArr = defectLevel;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={defectLevel.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={levelArr} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default DefectLevelFilter;