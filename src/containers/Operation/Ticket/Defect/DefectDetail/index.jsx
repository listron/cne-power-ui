import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GET_DEFECT_DETAIL_SAGA } from '../../../../../constants/actionTypes/Ticket';
import Detail from '../../../../../components/Operation/Ticket/Defect/Detail';

class DefectDetail extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    defectId: PropTypes.string,
    defectList: PropTypes.object,
    defectDetail: PropTypes.object,
    getDefectDetail: PropTypes.func,
    onCloseDetail: PropTypes.func,
    onSend: PropTypes.func,
    onClose: PropTypes.func,
    onReject: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
  }

  componentDidMount() {
    this.props.getDefectDetail({
      defectId: this.props.defectId
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.defectId !== this.props.defectId) {
      this.props.getDefectDetail({
        defectId: nextProps.defectId
      });
    }
  }

  onPrev() {

  }

  onNext() {

  }

  render() {   
    return (
      <div>
        <Detail 
          detail={this.props.defectDetail} 
          onCloseDetail={this.props.onCloseDetail}
          onClose={this.props.onClose}
          onSend={this.props.onSend}
          onReject={this.props.onReject}
          isFetching={this.props.isFetching}
          onNext={this.onNext}
          onPrev={this.onPrev} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  isFetching: state.operation.defect.get('isFetching'),
  error: state.operation.defect.get('error'),
  defectDetail: state.operation.defect.get("defectDetail"),
  defectId: state.operation.defect.get("defectId"),
});

const mapDispatchToProps = (dispatch) => ({
  getDefectDetail: params => dispatch({ type: GET_DEFECT_DETAIL_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);