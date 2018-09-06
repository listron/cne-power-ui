import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './defectFilter.scss';
const CheckboxGroup = Checkbox.Group;

class DefectTypeFilter extends Component {
  static propTypes = {
    defectTypes: PropTypes.object,
    defectTypeCode: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      defectTypeCode: value.join(',')
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      defectTypeCode: ''
    });
  }

  render() {
    const { defectTypes, defectTypeCode } = this.props;
    const options = defectTypes.map((item,i)=>({
      label: item.get('defectTypeName'),
      value: item.get('defectTypeCode').toString()
    })).toJS();
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={defectTypeCode.length!==''?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={options} value={defectTypeCode.split(',')} onChange={this.onChange} />
      </div>
    );
  }
}

export default DefectTypeFilter;