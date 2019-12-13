
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import styles from './brachFormItem.scss';

  /*
 *该组件, 复用至EditDevice, 若有变更，请注意同时考虑edit的情况。 
 */

 class EachBranch extends Component {

  static propTypes = {
    branchArr: PropTypes.array,
    index: PropTypes.number,
    onChange: PropTypes.func,
  };

  changeBranchSubNumber = ({ target }) => {
    const { value } = target || {};
    const invalidValue = isNaN(value) || value.includes('.') || value < 0 || value > 99; // 非法数值;
    if ((value && !invalidValue) || !value) { // value不存在 或 value为数字
      this.changeValue(() => value ? value.trim() : '');
    }
  }

  addBranch = () => {
    this.changeValue(value => {
      if(value){
        return value >= 99 ? '99' : `${++value}`;
      }
      return '1';
    });
  }

  reduceBranch = () => {
    this.changeValue(value => `${(value && value > 1) ? --value : 0}`);
  }

  changeValue = callback => {
    const { branchArr, index } = this.props;
    const preValue = branchArr[index];
    const newBranch = [...branchArr];
    newBranch[index] = callback(preValue);
    if (preValue !== newBranch[index]) { // 数据变化再触发, 降低render次数。
      this.props.onChange(newBranch);
    }
  }

  render(){
    const { index, branchArr } = this.props;
    return (
      <span className={styles.eachBranch}>
        <span className={styles.branchName}>第{index + 1}支路</span>
        <Input
          value={branchArr[index]}
          placeholder="请输入..."
          onChange={this.changeBranchSubNumber}
          className={styles.branchNumInput}
          addonAfter={<span className={styles.inputIconGroup}>
            <Icon type="up" onClick={this.addBranch} />
            <Icon type="down" onClick={this.reduceBranch} />
          </span>}
        />
      </span>
    );
  }
}

// 接收参数: value: 各支路信息数组[0, 1, 2, 3, 2, 1, 0], 支路个数branchCount, onChange修改各支路信息 
class BrachFormItem extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    branchCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  branchChange = (branchesResult) => {
    this.props.onChange(branchesResult);
  }

  render(){
    const { value = [], branchCount } = this.props;
    const branchArr = [];
    for (let i = 0; i < parseInt(branchCount, 10); i ++ ) {
      branchArr.push(value[i] === undefined ? '1' : value[i]);
    }
    return (
      <div className={styles.brachFormContent}>
        {branchArr.length > 0 && <div className={styles.branchBox}>
          {branchArr.map((e, i) => (
            <EachBranch key={i} index={i} branchArr={branchArr} onChange={this.branchChange} />
          ))}
        </div>}
        <span>(数值代表接入组串数, 0代表未接入)</span>
      </div>
    );
  }
}

export default BrachFormItem;
