import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

class DeviceItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onSelectItem = () => {
    const deviceCode = this.props.item.deviceCode;
    this.props.onSelect(deviceCode);
  }

  render() {
    const { selected, } = this.props;
    return (
      <div
        className={styles.deviceItem}
        style={selected ? { backgroundColor: '#199475', color: '#fff' } : { backgroundColor: '#f1f1f1', color: '#353535' }}
        onClick={this.onSelectItem}
        title={this.props.item.deviceName}
      >
        {this.props.item.deviceName}
      </div>
    );
  }
}

export default DeviceItem;