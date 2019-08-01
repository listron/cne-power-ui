import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AreaStation from '../../../../components/Common/AreaStation';
import AutoSelect from '../../../../components/Common/AutoSelect';

class GroupAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
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
    const { active } = this.props;
    return (
      <div style={{display: active ? 'block': 'none', backgroundColor: 'lightGreen'}} >
        <div>集团页面</div>
        <div>集团所有信息</div>
        <div>PBA排名</div>
        <button onClick={this.toArea}>
          查看区域信息
        </button>
        <AreaStation />
        <AutoSelect />
      </div>
    );
  }
}

export default GroupAchieve;

