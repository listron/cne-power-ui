import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './basicInfo.scss';
// import {Icon, Modal} from 'antd';
// const confirm = Modal.confirm;

class BasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    
  }

  render() {   
    return (
      <div>

      </div>
    );
  }  
}

export default BasicInfo;