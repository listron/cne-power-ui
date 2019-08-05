import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stationAchieveAction } from './stationAchieveReducer';

class StationAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
    testStation: PropTypes.func,
  }

  componentDidMount(){
    console.log(this.props);
    this.props.testStation();
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

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStation.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  testStation: payload => dispatch({type: stationAchieveAction.testStation, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

