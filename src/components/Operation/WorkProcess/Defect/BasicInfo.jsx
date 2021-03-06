import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import ImgUploader from '../../../Common/Uploader/ImgUploader';
import SolutionLibrary from './SolutionLibrary';

class DefectBasicInfo extends Component {
  static propTypes = {
    defectDetail: PropTypes.object,
    getKnowledgebase: PropTypes.func,
    knowledgebaseList: PropTypes.array,
    likeKnowledgebase: PropTypes.func,
    dockerDetail: PropTypes.object,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { defectTypeCode, deviceTypeCode, stationType, defectId } = nextProps.defectDetail;
    if (defectId !== this.props.defectDetail.defectId) {
      this.props.getKnowledgebase({ deviceTypeCodes: [deviceTypeCode], faultTypeIds: [defectTypeCode], type: +stationType });
    }
  }

  shouldComponentUpdate = (nextProps) => {
    const { defectId, dockerDetail = {} } = nextProps.defectDetail;
    const preDetail = this.props.dockerDetail.detail || [];
    const detail = dockerDetail || [];
    if (defectId !== this.props.defectDetail.defectId || (detail.length !== preDetail.length && detail.length > 0)) {
      return true;
    }
    return false;
  }


  deviceBaseInfo = [
    { label: '设备类型', value: 'deviceTypeName' },
    { label: '设备名称', value: 'deviceName' },
    { label: '缺陷类型', value: 'defectParentTypeName', sub: 'defectTypeName' },
    { label: '缺陷级别', value: 'defectLevel', data: ['', 'A级', 'B级', 'C级'] },
    { label: '缺陷来源', value: 'defectSource', data: ['告警', '上报', '巡检', '预警'] },
    { label: '缺陷描述', value: 'defectDescribe' },
  ]

  otherBaseInfo = [
    { label: '缺陷描述', value: 'defectDescribe' },
    { label: '缺陷来源', value: 'defectSource', data: ['告警', '上报', '巡检', '预警'] },
  ]

  ticket = [
    { label: '工作票', type: 1, num: 'workNumber', ticketMes: ['docketTypeName', 'docketCode'] },
    { label: '操作票', type: 2, num: 'operateNumber', ticketMes: ['docketName', 'docketCode'] },
  ]

  render() {
    const { defectDetail, knowledgebaseList, likeKnowledgebase, dockerDetail, getKnowledgebase } = this.props;
    const { detail = [] } = dockerDetail;
    const images = defectDetail.photoAddress ? defectDetail.photoAddress.split(',') : [];
    const carergory = defectDetail.defectTypeCode && this.deviceBaseInfo || this.otherBaseInfo;
    return (
      <div className={styles.basicInfo}>
        <div className={styles.title}>
          <div className={styles.text}> 基本信息 <i className="iconfont icon-content" /></div>
          <div className={styles.warning}>
            {defectDetail.defectId &&
              <React.Fragment>
                {!(+defectDetail.isOverTime) && <div className={styles.overTime}>超时</div>}
                {!(+defectDetail.isCoordination) && <div className={styles.coordinate}>协调</div>}
              </React.Fragment>}
          </div>
        </div>
        {defectDetail.defectId &&
          <div className={styles.basicContent}>
            <div className={styles.basicItem}>
              <div className={styles.label}>缺陷分类</div>
              <div className={styles.information}>{defectDetail.defectTypeCode && '设备缺陷' || '其他缺陷'}</div>
            </div>
            <div className={styles.basicItem}>
              <div className={styles.label}>电站名称</div>
              <div className={styles.information}>
                {defectDetail.stationName}{'   '}
                {[<i className="iconfont icon-windlogo" />, <i className="iconfont icon-pvs" />][defectDetail.stationType]}
              </div>
            </div>
            {carergory.map(item => {
              if (item.sub) {
                return ( // 如果是缺陷类型
                  <div className={styles.basicItem} key={item.value}>
                    <div className={styles.label}>{item.label}</div>
                    <div className={styles.information}>{`${defectDetail[item.value]}—${defectDetail[item.sub]}` || '--'}</div>
                    {knowledgebaseList.length > 0 &&
                      <SolutionLibrary
                        knowledgebaseList={knowledgebaseList}
                        likeKnowledgebase={likeKnowledgebase}
                        defectDetail={defectDetail}
                        getKnowledgebase={getKnowledgebase}
                      />}
                  </div>);
              }
              if (item.data) { // 缺陷来源数据处理
                return (
                  <div className={styles.basicItem} key={item.value}>
                    <div className={styles.label}>{item.label}</div>
                    <div className={styles.information}>{item.data[(defectDetail[item.value])] || '--'}</div>
                  </div>);
              }
              return (
                <div className={styles.basicItem} key={item.value}>
                  <div className={styles.label}>{item.label}</div>
                  <div className={styles.information}>{defectDetail[item.value] || '--'}</div>
                </div>);
            })}
            <div className={styles.basicItem}>
              <div className={styles.label}>关联两票</div>
              <div className={styles.information}>
                {detail.length > 0 &&
                  this.ticket.map((item, index) => {
                    const data = detail.filter(e => e.templateType === item.type);
                    const [name, code] = item.ticketMes;
                    return data.length > 0 &&
                      (<div className={styles.megCont} key={index}>
                        <div>【 {item.label} ({dockerDetail[item.num]}) 】</div>
                        <div className={styles.ticktCont}>
                          {data.map(e => {
                            const path = ['/operation/twoTickets/workflow', '/operation/twoTickets/operateflow'];
                            return (
                              <Link to={`${path[e.templateType - 1]}?docketId=${e.docketId}`} target="_blank" className={styles.tickets} key={e.docketId}>
                                {e[name]}/{e[code]}
                              </Link>);
                          })}
                        </div>
                      </div>);
                  }) || '无'
                }
              </div>
            </div>
            <div className={styles.viewImg}>
              <ImgUploader editable={false} data={images.map(item => ({
                uid: `${item}?${Math.random()}`,
                rotate: 0,
                thumbUrl: `${item}?${Math.random()}`,
              }))}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default DefectBasicInfo;
