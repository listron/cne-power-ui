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
    total: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    status: PropTypes.string,
    getDefectList: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
  }

  componentDidMount() {
    var params = {
      defectSource: "0",
      stationType: "2",
      status: this.props.status,
      pageNum: this.props.currentPage - 1,
      pageSize: this.props.currentPageSize
    }
    this.props.getDefectList(params);
  }

  onChangePage(page) {
    if(page !== this.currentPage) {
      let params = {
        defectSource: "0",
        stationType: "2",
        status: this.props.status,
        pageNum: page - 1,
        pageSize: this.props.currentPageSize
      }
      this.props.getDefectList(params);
    }
  }

  onChangePageSize(pageSize) {
    var params = {
      defectSource: "0",
      stationType: "2",
      status: this.props.status,
      pageNum: this.props.currentPage - 1,
      pageSize: pageSize
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
            currentPageSize={this.props.currentPageSize}
            total={this.props.total}
            status={this.props.status}
            isFetching={this.props.isFetching}
            onChangePage={this.onChangePage}
            onChangePageSize={this.onChangePageSize} />
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
  total: state.operation.defect.get("total"),
  status: state.operation.defect.get("status")
});

const mapDispatchToProps = (dispatch) => ({
  getDefectList: params => dispatch({ type: GET_DEFECT_LIST_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Defect);