import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GET_DEFECT_LIST_SAGA } from '../../../../constants/actionTypes/Ticket';
import DefectList from '../../../../components/Operation/Ticket/Defect/List';

class Defect extends Component {
  static propTypes = {
    defectList: PropTypes.object,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    getDefectList: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getDefectList();
  }

  render() {   
    return (
        <div>
          缺陷处理页面
          <DefectList list={this.props.defectList} />
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  isFetching: state.login.get('isFetching'),
  error:state.login.get('error'),
});

const mapDispatchToProps = (dispatch) => ({
  getDefectList: parmas => dispatch({ type: GET_DEFECT_LIST_SAGA }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Defect);