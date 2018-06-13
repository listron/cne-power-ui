import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GET_DEFECT_LIST_SAGA } from '../../../../constants/actionTypes/Ticket';
import DefectList from '../../../../components/Operation/Ticket/Defect/List';

class Defect extends Component {
  static propTypes = {
    defectList: PropTypes.object,
    currentPage: PropTypes.number,
    currentPageSize: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    getDefectList: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var params = {
      defectSource: "0",
      stationType: "2",
      pageNum: this.props.currentPage,
      pageSize: this.props.currentPageSize
    }
    this.props.getDefectList(params);
  }

  render() {   
    return (
        <div>
          缺陷处理页面
          <DefectList 
            list={this.props.defectList} 
            currentPage={this.props.currentPage}
            currentPageSize={this.props.currentPageSize} />
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  isFetching: state.operation.defect.get('isFetching'),
  error: state.operation.defect.get('error'),
  currentPage: state.operation.defect.get("currentPage"),
  currentPageSize: state.operation.defect.get("currentPageSize"),
});

const mapDispatchToProps = (dispatch) => ({
  getDefectList: params => dispatch({ type: GET_DEFECT_LIST_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Defect);