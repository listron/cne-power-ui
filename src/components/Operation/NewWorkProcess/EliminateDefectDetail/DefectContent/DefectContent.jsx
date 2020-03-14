import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefcetEventTitle from '../DefectEvent/DefcetEventTitle';
import DefectEventEdit from '../DefectEvent/DefectEventEdit';
import DefectEventDetail from '../DefectEvent/DefectEventDetail';
import DefectEvent from '../DefectEvent/DefectEvent';
import HandleInfo from '../HandleInfo/HandleInfo';


class DefectContent extends Component {
  static propTypes = {
    actionCode: PropTypes.string,
    eventInfos: PropTypes.array,
    eventStatus: PropTypes.array,
    // changeStore: PropTypes.func,
    warnEventInfos: PropTypes.array,
    baseInfo: PropTypes.object,
  };

  render() {
    const { baseInfo } = this.props;
    const allowedActions = [
      {
        'actionType': 1,
        'actionPosition': null,
        'actionIcon': '30020',
        'actionColorCode': '3004',
        'actionUrl': '/opms/defect/add',
        'isPermission': 1,
        'actionCode': '3',
        'actionName': '接单人',
      },
      {
        'actionType': null,
        'actionPosition': null,
        'actionIcon': '30017',
        'actionColorCode': '3006',
        'actionUrl': null,
        'isPermission': 1,
        'actionCode': '16',
        'actionName': '修改时间',
      },
      {
        'actionType': null,
        'actionPosition': null,
        'actionIcon': '30021',
        'actionColorCode': '3007',
        'actionUrl': null,
        'isPermission': 1,
        'actionCode': '14',
        'actionName': '添加缺陷',
      },
      {
        'actionType': null,
        'actionPosition': null,
        'actionIcon': '30021',
        'actionColorCode': '3007',
        'actionUrl': null,
        'isPermission': 1,
        'actionCode': '15',
        'actionName': '添加记录',
      },
      {
        'actionType': null,
        'actionPosition': null,
        'actionIcon': null,
        'actionColorCode': null,
        'actionUrl': null,
        'isPermission': 1,
        'actionCode': '20',
        'actionName': '修改工单说明',
      },
      {
        'actionType': null,
        'actionPosition': null,
        'actionIcon': null,
        'actionColorCode': null,
        'actionUrl': null,
        'isPermission': 1,
        'actionCode': '21',
        'actionName': '编辑缺陷',
      },

    ];
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo baseInfo={baseInfo} {...this.props} allowedActions={allowedActions} />
        <DefcetEventTitle {...this.props} allowedActions={allowedActions} />
        <DefectEvent {...this.props} allowedActions={allowedActions} edit={true} />
        <HandleInfo {...this.props} editDisplay={true} allowedActions={allowedActions} />
      </React.Fragment>
    );
  }
}



export default DefectContent;
