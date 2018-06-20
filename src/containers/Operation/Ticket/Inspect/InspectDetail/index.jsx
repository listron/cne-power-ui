import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import Detail from '../../../../../components/Operation/Ticket/Inspect/Detail';
import { GET_INSPECT_DETAIL_SAGA } from '../../../../../constants/actionTypes/Ticket';

class InspectDetail extends Component{
  static propTypes = {
    inspectDetail: PropTypes.object,
    onCloseDetail: PropTypes.func,
    onClose: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    isFetching: PropTypes.bool,
    inspectId: PropTypes.string,
    getInspectDetail: PropTypes.func,
  }
  constructor(props){
    super(props);
    this.state={

    }
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
  }
  
  componentDidMount(){
    this.props.getInspectDetail({
      inspectId: this.props.inspectId,
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.inspectId !== this.props.inspectId){
      this.props.getInspectDetail({
        inspectId: nextProps.inspectId,
      })
    }
  }

  onPrev(){

  }

  onNext(){

  }

  render(){
    return(
      
      <Detail 
        inspectDetail={this.props.inspectDetail}
        onCloseDetail={this.props.onCloseDetail}
        onClose={this.props.onClose}
        onSend={this.props.onSend}
        onReject={this.props.onReject}
        isFetching={this.props.isFetching}
        onNext={this.onNext}
        onPrev={this.onPrev}
      />
    )
  }

}

const mapStateToProps = (state) => ({
  isFetching: state.operation.inspect.get("isFetching"),
  inspectList: state.operation.inspect.get("inspectList"),
  error: state.operation.inspect.get("error"),
  inspectDetail: state.operation.inspect.get("inspectDetail"),
  inspectId: state.operation.inspect.get("inspectId"),
}) 

const mapDispatchToProps = (dispatch) => ({
  getInspectDetail: params => dispatch({ type: GET_INSPECT_DETAIL_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectDetail);










