import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAbnormal.scss';
import { Button, Modal } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import AbnormalItem from '../AbnormalItem/AbnormalItem';

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

  constructor(props) {
    super(props);
    this.state = {
      abnormalId: null,
      showInspectStandard: false,
      showAbnormal: false
    };
  }

  componentDidMount() {
    const stationType = this.props.inspectDetail.get('stationType');
    const deviceTypeCodes = this.props.inspectDetail.get('deviceTypeCodes');
    this.props.getInspectStandard({ stationType, deviceTypeCodes });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inspectDetail.get('inspectId') !== this.props.inspectDetail.get('inspectId')) {
      const stationType = nextProps.inspectDetail.get('stationType');
      const deviceTypeCodes = nextProps.inspectDetail.get('deviceTypeCodes');
      this.props.getInspectStandard({ stationType, deviceTypeCodes });
    }
  }

  onShowDetail = (data) => {
    const abnormalId = this.state.abnormalId;
    if (abnormalId === data.get('abnormalId')) {
      this.setState({
        abnormalId: null,
        showAbnormal: false
      });
    } else {
      this.setState({
        abnormalId: data.get('abnormalId'),
        showAbnormal: true
      });
    }
  }

  onShowModal = () => {
    this.setState({ showInspectStandard: true })
    // const stationType = this.props.inspectDetail.get('stationType');
    // const deviceTypeCodes = this.props.inspectDetail.get('deviceTypeCodes');
    // this.props.getInspectStandard({stationType, deviceTypeCodes});
  }

  onCloseModal = () => {
    this.setState({
      showInspectStandard: false,
    })
  }

  getStandardInfo(standardInfo) {
    this.setState({
      standardInfo
    });
  }

  renderItems() {
    let status = this.props.status;
    return this.props.abnormalItems.map((item, index) => {
      if (status === '2') {
        return (
          //   <AbnormalItem 
          //   key={'abnormal'+index}
          //   status="delete"
          //   item={item}
          //   selected={this.state.abnormalId === item.get('abnormalId')}
          //   onShowDetail={this.onShowDetail}
          //   onDelete={this.props.onDeleteAbnormal}
          // /> 
          <AbnormalItem
            key={'abnormal' + index}
            status="delete"
            item={item}
            onShowDetail={this.onShowDetail}
            disabled={item.get('isTransform') === '1'}
            checked={this.props.selectedIds.includes(item.get('abnormalId'))}
            selected={this.state.abnormalId === item.get('abnormalId')}
            onSelect={this.props.onSelectItem}
            onDelete={this.props.onDeleteAbnormal}
          />

        );
      } else if (status === '3') {
        return (
          <AbnormalItem
            key={'abnormal' + index}
            status="select"
            item={item}
            onShowDetail={this.onShowDetail}
            disabled={item.get('isTransform') === '1'}
            checked={this.props.selectedIds.includes(item.get('abnormalId'))}
            selected={this.state.abnormalId === item.get('abnormalId')}
            onSelect={this.props.onSelectItem}
          />
        );
      } else if (status === '4') {
        return (
          <AbnormalItem
            key={'abnormal' + index}
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
    if (inspectStandard.size === 0) {
      return null;
    }
    return inspectStandard.map((item, index) => {
      return (
        <div className={styles.mainMenu} key={index}>
          <div className={styles.mainMenuTitle} title={item.get('standardTitle')} >
            {item.get('standardTitle')}
            <i className="iconfont icon-triangle" />
          </div>
          <div className={styles.subMenu}>
            {item.get('standardData').map((subItem, i) => {
              return (
                <div style={this.state.standardInfo === subItem.get('standardInfo') ? { backgroundColor: '#353535' } : {}} className={styles.subMenuTitle} key={i} onClick={() => this.getStandardInfo(subItem.get('standardInfo'))} title={subItem.get('standardItem')}>
                  {subItem.get('standardItem')}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }

  renderStandard() {
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
    if (abnormalId) {
      let detail = this.props.abnormalItems.find((item) => {
        return item.get('abnormalId') === abnormalId
      });
      if (detail) {
        const defectTypeName = detail.get('defectTypeName');
        const defectParentTypeName = detail.get('defectParentTypeName') || '';
        const defectTypeText = `${defectParentTypeName}/${defectTypeName}`;
        const detailImages = detail.get('photoAddress') ? detail.get('photoAddress').split(',') : [];
        return (
          <div className={styles.abnormalDetail}>
            <div className={styles.detailItem}>
              设备类型<span title={detail.get('deviceTypeName')}>{detail.get('deviceTypeName')}</span>
            </div>
            <div className={styles.detailItem}>
              设备名称<span title={detail.get('deviceName')}>{detail.get('deviceName')}</span>
            </div>
            <div className={styles.detailItem}>
              缺陷类型<span title={defectTypeText}>{defectTypeText}</span>
            </div>
            <div className={styles.detailItem}>
              异常描述<span title={detail.get('abnormalDescribe')}>{detail.get('abnormalDescribe')}</span>
            </div>
            <div className={styles.viewImg}>
              <ImgUploader editable={false} data={detailImages.map(e => ({
                uid: e,
                rotate: 0,
                thumbUrl: `${e}?${Math.random()}`
              }))} />
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

  render() {
    const { inspectStandard } = this.props;
    return (
      <div className={styles.inspectAbnormal}>
        <div className={styles.title}>
          <div className={styles.text}>
            异常设备
            <i className="iconfont icon-content" />
          </div>
          <Button disabled={inspectStandard && inspectStandard.size < 1} onClick={this.onShowModal} className={inspectStandard && inspectStandard.size < 1 ? styles.disabledStandard : styles.viewStandard}>查看巡检标准</Button>
        </div>
        <div className={styles.abnormalItems}>
          {this.renderItems()}
        </div>
        {this.state.showAbnormal && this.renderItemDetail()}
        {this.state.showInspectStandard && this.renderStandard()}
      </div>
    )
  }
}

export default InspectAbnormal;