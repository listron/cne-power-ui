import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectContent.scss';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefectEventEdit from '../DefectEvent/DefectEventEdit';
import DefectEventDetail from '../DefectEvent/DefectEventDetail';
import DefectEvent from '../DefectEvent/DefectEvent';
import HandleInfo from '../HandleInfo/HandleInfo';


class DefectContent extends Component {
  static propTypes = {
    actionCode: PropTypes.string,

  };

  render() {
    const { baseInfo } = this.props;
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo baseInfo={baseInfo} />
        <DefectEvent />
        <HandleInfo />
      </React.Fragment>
    );
  }
}



export default DefectContent;
