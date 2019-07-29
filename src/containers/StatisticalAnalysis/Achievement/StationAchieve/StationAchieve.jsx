import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

class StationAchieve extends Component {

  static propTypes = {
    location: PropTypes.object,
  }

  componentDidMount(){
    
  }

  componentDidUpdate(){
    
  }

  componentWillUnmount(){
    
  }

  render() {
    return (
      <div style={{display: this.props.show?'block': 'none', backgroundColor: 'gray'}}>
        单电站信息-没啥了。
      </div>
    );
  }
}

export default StationAchieve;

