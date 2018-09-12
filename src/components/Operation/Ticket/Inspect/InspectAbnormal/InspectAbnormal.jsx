import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAbnormal.scss';
import { Button, Modal, Tabs } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import AbnormalItem from '../AbnormalItem/AbnormalItem';

const TabPane = Tabs.TabPane;

class InspectAbnormal extends Component {
  static propTypes = {
    abnormalItems: PropTypes.object,
    status: PropTypes.string,
    selectedIds: PropTypes.object,
    onDeleteAbnormal: PropTypes.func,
    onSelectItem: PropTypes.func,
    onWatchStandard: PropTypes.func,
    stationType: PropTypes.string,
    getInspectStandard: PropTypes.func,
    inspectStandard: PropTypes.object,
    inspectDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      abnormalId: null,
      showInspectStandard: false,
    };
  }

  onShowDetail = (data) => {
    this.setState({
      abnormalId: data.get('abnormalId'),
      standardInfo: ''
    });
  }

  onShowModal = () =>{
    this.setState({showInspectStandard: true})
    const stationType = this.props.inspectDetail.get('stationType');
    const deviceTypeCodes = this.props.inspectDetail.get('deviceTypeCodes');
    this.props.getInspectStandard({stationType, deviceTypeCodes});
  }

  onCloseModal = () => {
    this.setState({
      showInspectStandard: false,
    })
  }

  getImagesData(data) {
    if(data.get('photoAddress')) {
      let images = data.get('photoAddress').split(',');
      return images.map((item, index) => {
        return {
          uid: index,
          rotate: 0,
          thumbUrl: item
        }
      });
    } else {
      return [];
    } 
  }

  getStandardInfo(standardInfo) {
    this.setState({
      standardInfo
    });
  }

  renderItems(){
    let status = this.props.status;
    return this.props.abnormalItems.map((item, index) => {
      if(status === '2') {
        return (
          <AbnormalItem 
            key={'abnormal'+index}
            status="delete"
            item={item}
            selected={this.state.abnormalId === item.get('abnormalId')}
            onShowDetail={this.onShowDetail}
            onDelete={this.props.onDeleteAbnormal}
          />
        );
      } else if(status === '3') {
        return (
          <AbnormalItem 
            key={'abnormal'+index}
            status="select"
            item={item}
            onShowDetail={this.onShowDetail}
            disabled={item.get('isTransform') === '1'}
            checked={this.props.selectedIds.includes(item.get('abnormalId'))}
            selected={this.state.abnormalId === item.get('abnormalId')}
            onSelect={this.props.onSelectItem}
          />
        );
      } else if(status === '4') {
        return (
          <AbnormalItem 
            key={'abnormal'+index}
            status="view"
            onShowDetail={this.onShowDetail}
            item={item}
            checked={item.get('isTransform') === '1'}
            selected={this.state.abnormalId === item.get('abnormalId')}
          />
        );
      }
    });
  }

  renderMenu(inspectStandard) {
    if(inspectStandard.size === 0) {
      return null;
    }
    return inspectStandard.map((item, index) => {
      return (
        <div className={styles.mainMenu} key={index}>
          <div className={styles.mainMenuTitle}>{item.get('standardTitle')}</div>
          <div className={styles.subMenu}>
            {item.get('standardData').map((subItem, i) => {
              return (
                <div style={this.state.standardInfo===subItem.get('standardInfo')?{backgroundColor:'#666'}:{}} className={styles.subMenuTitle} key={i} onClick={()=>this.getStandardInfo(subItem.get('standardInfo'))}>
                  {subItem.get('standardItem')}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }

  renderStandard(){
    let inspectStandard = this.props.inspectStandard;
    return (
      <Modal
        className={styles.defectStandardModal} 
        visible={true}
        footer={null}
        mask={false}
        onCancel={this.onCloseModal}
        width={606}
      >
        <div className={styles.defectStandard}>
          <div className={styles.menu}>
            {this.renderMenu(inspectStandard)}
          </div>
          <div className={styles.content}>
            <div className={styles.standardTitle}>巡检标准</div>
            {this.state.standardInfo}
          </div>
        </div>
      </Modal>
    )
  }

  renderItemDetail() {
    let abnormalId = this.state.abnormalId;
    if(abnormalId) {
       let detail = this.props.abnormalItems.find((item) => {
        return item.get('abnormalId') === abnormalId
      });
      if(detail) {
        return (
          <div className={styles.abnormalDetail}>
            <div className={styles.detailItem}>
              设备类型<span>{detail.get('deviceTypeName')}</span>
            </div>
            <div className={styles.detailItem}>
              设备名称<span>{detail.get('deviceName')}</span>
            </div>
            <div className={styles.detailItem}>
              缺陷类型<span>{detail.get('defectTypeName')}</span>
            </div>
            <div className={styles.detailItem}>
              异常描述<span>{detail.get('abnormalDescribe')}</span>
            </div>
            <div className={styles.viewImg}>
              <ImgUploader editable={false} data={this.getImagesData(detail)} />
            </div>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  render(){
    return (
      <div className={styles.inspectAbnormal}>
        <div className={styles.title}>
          <div className={styles.text}>
            异常设备
            <i className="iconfont icon-content" />
          </div>
          <Button onClick={this.onShowModal} className={styles.viewStandard}>查看巡检标准</Button>
        </div>
        <div className={styles.abnormalItems}>
          {this.renderItems()}
        </div>
        {this.renderItemDetail()}
        {this.state.showInspectStandard&&this.renderStandard()}
      </div>
    )
  }
}

export default InspectAbnormal;