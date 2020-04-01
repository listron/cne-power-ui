import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import { Radio } from 'antd';
const {Group, Button} = Radio;

class RadioSelect extends Component {
  static propTypes = {
    option: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    const value = e.target.value;
    const { option = {} } = this.props;
    option.checkedValue = value;
    this.props.onChangeFilter({ option });
  }

  render() {
    const { option } = this.props;
    const { checkedValue = '', data, rules = ['label', 'value'] } = option;
    const [label, value] = rules;
    const defaultValue = `${checkedValue||''}`;
    return (
      <div className={styles.radioSelectItem}>
        <Group onChange={this.onChange} defaultValue={defaultValue}>
            <Button checked={defaultValue === ''} value='' key=''>不限</Button>
            {data.map(e => {
              const k = e[value];
              return <Button checked={k.toString() === defaultValue} value={k} key={k}>{e[label]}</Button>;
            })}
        </Group>   
      </div>
    );
  }

}

export default RadioSelect;
