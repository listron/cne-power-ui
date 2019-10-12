import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ReportStation extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div>

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {

  };
};
const mapDispatchToProps = (dispatch) => ({


});
export default connect(mapStateToProps, mapDispatchToProps)(ReportStation);
