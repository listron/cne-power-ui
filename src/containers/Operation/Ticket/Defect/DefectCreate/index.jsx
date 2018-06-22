import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {
  GET_STATIONS_SAGA,
  GET_DEVICETYPES_SAGA,
  GET_DEVICES_SAGA,
  GET_DEFECTTYPES_SAGA,
  DEFECT_CREATE_SAGA,
} from '../../../../../constants/actionTypes/Ticket';
import DefectCreateForm from '../../../../../components/Operation/Ticket/Defect/CreateNewDefect/DefectCreateForm'

class DefectCreate extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.onChangeShowContainer = this.onChangeShowContainer.bind(this);
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

const mapStateToProps = (state) => ({
  isFetching: state.operation.defect.get('isFetching'),
  error: state.operation.defect.get('error'),
  stations: state.operation.defect.get('stations'),
  devieceTypes: state.operation.defect.get('devieceTypes'),
  devices: state.operation.defect.get('devices'),
  defectTypes: state.operation.defect.get('defectTypes'),
  createDefectParams: state.operation.defect.get('defectTypes'),
});

const mapDispatchToProps = (dispatch) => ({
  getStations: params => dispatch({ type: GET_STATIONS_SAGA, params }),
  getDevieceTypes: params => dispatch({ type: GET_DEVICETYPES_SAGA, params }),
  getDevieces: params => dispatch({ type: GET_DEVICES_SAGA, params }),
  getDefectTypes: params => dispatch({ type: GET_DEFECTTYPES_SAGA, params }),
  onDefectCreateNew: params => dispatch({type: DEFECT_CREATE_SAGA, params})
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

