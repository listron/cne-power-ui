import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAbnormal.scss';
import { Button } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import AbnormalItem from '../../../../Common/AbnormalItem';

class InspectAbnormalo extends Component {
  static propTypes = {
    abnormalItems: PropTypes.object,
    status: PropTypes.string,
    selectedIds: PropTypes.object,
    onDeleteItem: PropTypes.func,
    onSelectItem: PropTypes.func,
    onWatchStandard: PropTypes.func,
  }

  static defaultProps = {

  }

  constructor(props){
    super(props);
    this.state = {
      showDetailId: null
    };
    this.onShowDetail = this.onShowDetail.bind(this);
  }

  onShowDetail(data) {
    this.setState({
      showDetailId: data.get('abnormalId')
    });
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

  renderItems(){
    let status = this.props.status;
    this.props.abnormalItems.map((item, index) => {
      if(status === '2') {
        return (
          <AbnormalItem 
            key={'abnormal'+index}
            status="delete"
            item={item}
            selected={this.state.showDetailId === item.get('abnormalId')}
            onShowDetail={this.onShowDetail}
            onDelete={this.props.onDeleteItem} />
        );
      } else if(status === '3') {
        return (
          <AbnormalItem 
            key={'abnormal'+index}
            status="select"
            item={item}
            disabled={item.get('isTransform') === '1'}
            selected={this.props.selectedIds.includes(item.get('abnormalId'))}
            onSelect={this.props.onSelectItem} />
        );
      } else if(status === '4') {
        return (
          <AbnormalItem 
            key={'abnormal'+index}
            status="view"
            item={item}
            disabled={item.get('isTransform') === '1'} />
        );
      }
    });
  }

  renderItemDetail() {
    let showDetailId = this.state.showDetailId;
    if(showDetailId) {
       let detail = this.props.abnormalItems.find((item) => {
        return item.get('abnormalId') === showDetailId
      });
      if(detail) {
        return (
          <div>
            <div>设备类型<span>{detail.get('deviceTypeName')}</span></div>
            <div>设备名称<span>{detail.get('deviceName')}</span></div>
            <div>缺陷类型<span>{detail.get('defectTypeName')}</span></div>
            <div>查看照片
              <div>
                <ImgUploader editable={false} data={this.getImagesData(detail)} />
              </div>
            </div>
          </div>
        );
      }
    }
  }

  render(){ 
    return (
      <div className={styles.inspectAbnormal} >
        <div>
          <span>异常设备</span>
          <Button onClick={this.props.onWatchStandard}>查看巡检标准</Button>
        </div>
        {this.renderItems()}
        {this.props.status === '2' ? this.renderItemDetail() : null}
      </div>
    )
  }

}

export default InspectAbnormalo;