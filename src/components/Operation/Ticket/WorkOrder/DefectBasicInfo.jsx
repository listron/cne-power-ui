import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './workOrder.scss';
import { getLevel, getSource } from '../../../../constants/ticket';
import ImgUploader from '../../../Common/Uploader/ImgUploader';
import { Modal, Button, Icon } from 'antd';

class DefectBasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object,
    defectTypes: PropTypes.object,
    getKnowledgebase: PropTypes.func,
    knowledgebaseList: PropTypes.array,
    likeKnowledgebase: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      dealVisible: false,
    };
  }

  componentDidMount() {
    // console.log('info',this.props.basicInfo)
  }

  componentDidUpdate(prevProps) {
    const prevDefectId = prevProps.basicInfo.defectId || '';
    const defectId = this.props.basicInfo.defectId || '';
    if (defectId !== prevDefectId) {
      const { defectTypeCode, deviceTypeCode } = this.props.basicInfo;
      this.props.getKnowledgebase({ deviceTypeCodes: [deviceTypeCode], faultTypeIds: [defectTypeCode] });
    }
  }


  showModal = () => {
    this.setState({ dealVisible: true });
  }

  modalCancle = () => {
    this.setState({ dealVisible: false });
  }

  knowledegeBask = (knowledgeBaseId) => {
    this.props.likeKnowledgebase({ knowledgeBaseId });
  }

  render() {
    const info = this.props.basicInfo;
    const images = info.photoAddress ? info.photoAddress.split(',') : [];
    const { knowledgebaseList } = this.props;
    return (
      <div className={styles.basicInfo}>
        <div className={styles.title}>
          <div className={styles.text}>
            基本信息
            <i className="iconfont icon-content" />
          </div>
          <div className={styles.warning}>
            {!(+info.isOverTime) && <div className={styles.overTime}>超时</div>}
            {!(+info.isCoordination) && <div className={styles.coordinate}>协调</div>}
          </div>
        </div>
        <div className={styles.basicContent}>
          <div className={styles.basicItem}>
            <div>电站名称</div>
            <span>{info.stationName}</span>
            <span>{info.stationType === '0' ? <i className="iconfont icon-windlogo" /> :
              <i className="iconfont icon-pvs" />}</span>
          </div>
          <div className={styles.basicItem}><div>设备类型</div><span>{info.deviceTypeName || '--'}</span></div>
          <div className={styles.basicItem}><div>设备名称</div><span>{info.deviceName || '--'}</span></div>
          <div className={styles.basicItem}>
            <div>缺陷类型</div><span>{`${info.defectParentTypeName}/${info.defectTypeName}` || '--'}</span>
            {knowledgebaseList.length > 0 && <Button type="default" onClick={this.showModal} className={styles.dealMethod}>查看解决方案</Button>}
          </div>
          <div className={styles.basicItem}><div>缺陷级别</div><span>{getLevel(`${info.defectLevel}`) || '--'}</span></div>
          <div className={styles.basicItem}><div>缺陷来源</div><span>{getSource(info.defectSource) || '--'}</span></div>
          <div className={styles.basicItem}><div>缺陷描述</div><span>{info.defectDescribe || '--'}</span></div>
          <div className={styles.viewImg}>
            <ImgUploader editable={false} data={images.map(item => ({
              uid: item,
              rotate: 0,
              thumbUrl: `${item}?${Math.random()}`,
            }))}
            />
          </div>
        </div>
        <div ref="dealMethod" className={styles.dealModal}> </div>
        <Modal
          title="解决方案查看"
          visible={this.state.dealVisible}
          onCancel={this.modalCancle}
          getContainer={() => this.refs.dealMethod}
          footer={null}
          mask={false}
          centered={true}
          wrapClassName={styles.deatilLike}
          width={800}
        >
          <div className={styles.modalbody}>
            {knowledgebaseList.map(list => {
              return (<div key={list.faultTypeId} className={styles.dealBox}>
                <div className={styles.column}>
                  <div className={styles.text}>缺陷描述</div>  <div> {list.faultDescription}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>检查项目</div>  <div> {list.checkItems}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>处理方法</div>  <div> {list.processingMethod}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>所需工具</div>  <div> {list.requiredTools}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>备注</div>  <div> {list.remark}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>点赞数</div>  <div> {list.likeCount}</div>
                </div>
                {list.liked ?
                  <div className={styles.liked} disabled>
                    已点赞 <Icon type="like" />
                  </div>
                  :
                  <div className={styles.like} onClick={()=>{this.knowledegeBask(list.knowledgeBaseId)}}>
                    点赞 <Icon type="like" />
                  </div> 
                }
              </div>
              );
            })}
          </div>

        </Modal>

      </div>
    );
  }
}

export default DefectBasicInfo;
