import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

class GroupAchieve extends Component {

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

  // toArea = () => {
  //   const info = stringify({group: 'default', area: 50});
  //   this.props.history.push(`/statistical/achievement/analysis/area?${info}`);
  // }

  render() {
    return (
      <div style={{display: this.props.show?'block': 'none', backgroundColor: 'lightGreen'}} >
        <div>集团页面</div>
        <div>集团所有信息</div>
        <div>PBA排名</div>
        <button onClick={this.toArea}>
          查看区域信息
        </button>
      </div>
    );
  }
}

export default GroupAchieve;

