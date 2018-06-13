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

  componentDidMount(){
    this.props.getInspectionList({
      inspectStatus: 2,
    });
  }

  render() {   
    return (
        <div>
          <div>巡检处理页面</div>
          <InspectionList inspectionList={this.props.inspectionList}  getInspectionList={this.props.getInspectionList} />
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inspectionList: state.operation.inspection.get('inspectionList'),
  isFetching: state.login.get('isFetching'),
  error: state.login.get('error'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectionList: parmas => dispatch({ type: GET_INSPECTION_LIST_SAGA }),
})

export default connect(mapStateToProps,mapDispatchToProps)(Inspection);