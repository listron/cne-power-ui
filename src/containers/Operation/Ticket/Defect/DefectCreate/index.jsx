import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {
  GET_DEFECTTYPES_SAGA,
  DEFECT_CREATE_SAGA,
} from '../../../../../constants/actionTypes/Ticket';
import {
  GET_STATIONS_SAGA,
  GET_DEVICETYPES_SAGA,
  GET_DEVICES_SAGA,
} from '../../../../../constants/actionTypes/commonAction';
import DefectCreateForm from '../../../../../components/Operation/Ticket/Defect/CreateNewDefect/DefectCreateForm';

class DefectCreate extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func,
    getStations: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.onChangeShowContainer = this.onChangeShowContainer.bind(this);
  } 
  componentDidMount(){
    this.props.getStations({
      domainName: "cne", 
      stationType: 0, 
      app: "bi"
    });
  } 
  onChangeShowContainer(){
    this.props.onChangeShowContainer('list')
  }
  

  render() {   
    return (
      <div className={styles.defectCreate} >
        <h3><span>缺陷创建</span>    <span onClick={this.onChangeShowContainer }>关闭x</span></h3>
        <DefectCreateForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state) 
  return{
    isFetching: state.operation.defect.get('isFetching'),
    commonFetching: state.common.defect.get('commonFetching'),
    stations: state.common.defect.get('stations'),
    devieceTypes: state.common.defect.get('devieceTypes'),
    devices: state.common.defect.get('devices'),
    error: state.operation.defect.get('error'),
    defectTypes: state.operation.defect.get('defectTypes'),
    createDefectParams: state.operation.defect.get('createDefectParams'),
  }
};

const mapDispatchToProps = (dispatch) => ({
  getStations: params => dispatch({ type: GET_STATIONS_SAGA, params }),
  getDevieceTypes: params => dispatch({ type: GET_DEVICETYPES_SAGA, params }),
  getDevieces: params => dispatch({ type: GET_DEVICES_SAGA, params }),
  getDefectTypes: params => dispatch({ type: GET_DEFECTTYPES_SAGA, params }),
  onDefectCreateNew: params => dispatch({type: DEFECT_CREATE_SAGA, params})
});


export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

