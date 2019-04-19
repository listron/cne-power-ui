import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from 'antd';
import styles from './modalFilter.scss';

const CheckboxGroup = Checkbox.Group;

class ModalFilter extends Component {
  static propTypes = {
    algorithmModalId: PropTypes.array,
    onChangeFilter: PropTypes.func,
    algorithmModalName: PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  onLevelSelect = (algorithmModalId) => {
    this.props.onChangeFilter({ algorithmModalId });
  };

  resetLevel = () => {
    this.props.onChangeFilter({
      algorithmModalId: []
    });
  };

  render() {
    const { algorithmModalId, algorithmModalName } = this.props;
    const levels = algorithmModalName.length > 0 ? algorithmModalName : ['一级','二级','三级','四级'];
    const levelOptions = levels.map((e,i)=>({
      label: e,
      // value: `${i+1}`
      value: `${e}`
    }));
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={algorithmModalId.length === 0 ? styles.selected : styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={algorithmModalId} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default ModalFilter;
