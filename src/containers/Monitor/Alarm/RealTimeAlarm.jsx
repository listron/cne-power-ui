import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class RealTimeAlarm extends Component {
  static propTypes = {
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>            
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
});
export default connect(mapStateToProps)(RealTimeAlarm);
