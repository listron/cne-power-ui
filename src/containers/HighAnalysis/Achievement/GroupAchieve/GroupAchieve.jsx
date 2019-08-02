import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { groupAchieveAction } from './groupAchieveReducer';
import AreaStation from '../../../../components/Common/AreaStation';
import AutoSelect from '../../../../components/Common/AutoSelect';

class GroupAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
    testGroup: PropTypes.func,
  }

  componentDidMount(){
    this.props.testGroup();
  }

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

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveGroup.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  testGroup: payload => dispatch({type: groupAchieveAction.testGroup, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAchieve);

