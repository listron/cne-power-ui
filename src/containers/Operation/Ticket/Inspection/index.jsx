import React, { Component } from 'react';
import InspectionList from '../../../../components/Operation/Ticket/Inspection/InspectionList';
import { GET_INSPECTION_LIST_SAGA } from "../../../../constants/actionTypes/Ticket";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

class Inspection extends Component {
  static propTypes={
    inspectionList: PropTypes.object,
    isFetching : PropTypes.bool,
    error: PropTypes.string,
    getInspectionList: PropTypes.func,
  }

  constructor(props,context) {
    super(props);
    this.state = {};
  }

  render() {   
    return (
        <div>
          <div>巡检处理页面</div>
          <InspectionList list={this.props.inspectionList} />
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inspectionList: state.operation.inspection.get('inspectionList'),
  isFetching: state.operation.inspection.get('isFetching'),
  error: state.operation.inspection.get('error'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectionList: parmas => dispatch({ type: GET_INSPECTION_LIST_SAGA }),
})

export default connect(mapStateToProps,mapDispatchToProps)(Inspection);