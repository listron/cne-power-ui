import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {Icon} from 'antd';

class DeviceItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    width: 153,
    height: 30
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onSelectItem = this.onSelectItem.bind(this);
    
  }

  onSelectItem() {
    this.props.onSelect(this.props.item.get('deviceCode'));
  }

  render() {
    if(this.props.selected) {
      return (
        <div 
          className={styles.selectedItem} 
          style={{height: this.props.height, width: this.props.width}}
        >
          <div className={styles.itemLabel}>{this.props.item.get('deviceName')}</div>
          <Icon type="check-circle-o" />
        </div>
      )
    } else {
      return ( 
        <div 
          className={styles.unSelectedItem} 
          style={{height: this.props.height, width: this.props.width}}
          onClick={this.onSelectItem}
        >
          <div className={styles.itemLabel}>{this.props.item.get('deviceName')}</div>
        </div>
      );
    }
    
  }
}

export default DeviceItem;