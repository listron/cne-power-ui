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

  onLevelSelect = (algorithmModalId) => {
    const { onChangeFilter } = this.props;
    onChangeFilter({
      algorithmModalId
    });
  };

  resetLevel = () => {
    const { onChangeFilter } = this.props;
    onChangeFilter({
      algorithmModalId: []
    });
  };

  render() {
    const { algorithmModalId, algoOptionList } = this.props;
    const levelOptions = algoOptionList.map(cur => ({
      label: cur.algorithmName,
      value: `${cur.algorithmId}`
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
