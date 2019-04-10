import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class BelongMatrixs extends Component {
  static propTypes = {
    matrixList: PropTypes.array,
    belongMatrixs: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      belongMatrixs: value
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      belongMatrixs: []
    });
  }

  render() {
    const { matrixList, belongMatrixs } = this.props;
    const options = matrixList.map((item,i)=>({
      label: item,
      value: `${item}`,
    }));
    const belongMatrixsArr = belongMatrixs;
    return (
      <div className={styles.deviceTypeFilter}>
        <span onClick={this.onReset} className={matrixList.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={options} value={belongMatrixsArr} onChange={this.onChange} />
      </div>
    );
  }
}

export default BelongMatrixs;