import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

class AreaAchieve extends Component {

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

  toStation = () => {
    const info = stringify({station: 360, devices: [2, 3, 4, 5]});
    console.log(info);
    this.props.history.push(`/statistical/achievement/analysis/station?${info}`);
  }

  render() {
    const { active } = this.props;
    return (
      <div style={{display: active ? 'block': 'none', backgroundColor: 'lightGreen'}} >
        <div>这个就是传说中的区域</div>
        <div>那么大的区域</div>
        <button onClick={this.toStation}>
          我要去单电站
        </button>
      </div>
    );
  }
}

export default AreaAchieve;

