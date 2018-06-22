import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InspectList from './InspectList';


class Inspect extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        {/* {this.props.showContainer === 'detail' && (<DefectDetail />)} */}
        {this.props.showContainer === 'list' && (<InspectList />)}
      </div>
    );
  }
}

export default Inspect;