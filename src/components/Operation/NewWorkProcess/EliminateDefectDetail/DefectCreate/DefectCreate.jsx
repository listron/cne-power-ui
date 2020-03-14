import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectCreate.scss';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefectEventEdit from '../DefectEvent/DefectEventEdit';
import HandleInfo from '../HandleInfo/HandleInfo';


class DefectCreate extends Component {
  static propTypes = {
    actionCode: PropTypes.string,

  };

  render() {
    return (
      <React.Fragment>
        这是创建的页面
        <DefectBaseTitle />
        {/* <DefectBaseInfo /> */}
        <DefectEventEdit />
        <HandleInfo />
      </React.Fragment>
    );
  }
}



export default DefectCreate;
