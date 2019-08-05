import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { areaAchieveAction } from './areaAchieveReducer';

class AreaAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
    testArea: PropTypes.func,
  }

  componentDidMount(){
    console.log('did mount')
    console.log(this.props.location)
    console.log('did mount')
    this.props.testArea();
  }

  componentWillReceiveProps(nextProps){
    console.log('did componentWillReceiveProps')
    console.log(nextProps.location)
    console.log(this.props.location)
    console.log('did componentWillReceiveProps')
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

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveArea.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  testArea: () => dispatch({type: areaAchieveAction.testArea}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

