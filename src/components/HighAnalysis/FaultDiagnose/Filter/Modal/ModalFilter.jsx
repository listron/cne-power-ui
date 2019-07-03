import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from 'antd';
import styles from './modalFilter.scss';

const CheckboxGroup = Checkbox.Group;

class ModalFilter extends Component {
  static propTypes = {
    algorithmModalId: PropTypes.array,
    algoOptionList: PropTypes.array,
    onChangeFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  onLevelSelect = (value) => {
    const {
      onChangeFilter,
      algoOptionList,
    } = this.props;
    const newSameArr = []; // 相同数据
    // 取到相同的数据
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < algoOptionList.length; j++) {
        if(value[i] === `${algoOptionList[j].algorithmId}`){
          newSameArr.push(algoOptionList[j]);
        }
      }
    }
    onChangeFilter({
      algorithmModalId: value,
      algorithmModalName: newSameArr,
    });
  };

  resetLevel = () => {
    const { onChangeFilter } = this.props;
    onChangeFilter({
      algorithmModalId: [],
      algorithmModalName: [],
    });
  };

  render() {
    const { algorithmModalId, algoOptionList } = this.props;

    const levelOptions = algoOptionList.map(cur => ({
      label: cur.algorithmName,
      value: `${cur.algorithmId}`,
    }));
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={algoOptionList.length === 0 ? styles.selected : styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={algorithmModalId} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default ModalFilter;
