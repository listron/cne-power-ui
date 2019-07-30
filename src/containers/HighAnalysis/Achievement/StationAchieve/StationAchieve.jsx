import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

class StationAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
    location: PropTypes.object,
  }

  componentDidMount(){
    
  }

  componentDidUpdate(){
    
  }

  componentWillUnmount(){
    
  }

  render() {
    const { active } = this.props;
    return (
      <div style={{display: active ? 'block': 'none', backgroundColor: 'lightGreen'}} >
        单电站信息-没啥了。
      </div>
    );
  }
}

export default StationAchieve;

