import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

class Detail extends Component {
  static propTypes = {
    detail: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func
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

export default Detail;