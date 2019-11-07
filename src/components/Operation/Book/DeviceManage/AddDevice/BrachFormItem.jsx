
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './deviceSide.scss';

class EachBranch extends Component {

  static propTypes = {
    index: PropTypes.number,
  };

  changeBranchSubNumber = (e) => {
    console.log(this.props.index);
    console.log(e, e.target, e.target.value);
  }

  render(){
    const { index } = this.props;
    return (
      <span>
        <span>第{index}支路</span>
        <Input type="number" onChange={this.changeBranchSubNumber} />
      </span>
    );
  }
}


class BrachFormItem extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    branchNum: PropTypes.number,
  };

  render(){
    const { value, onChange, branchNum } = this.props;
    console.log(value, onChange, branchNum);
    return (
      <div className={styles.brachFormItem}>
        {branchNum.map((e, i) => (
          <EachBranch key={i} index={i} />
        ))}
        <span>(数值代表接入串数, 0代表未接入)</span>
      </div>
    );
  }
}

export default BrachFormItem;
