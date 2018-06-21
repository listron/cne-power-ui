import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from '../BasicInfo';
import HandleForm from '../HandleForm';
import TimeLines from '../../../../Common/TimeLines';
import styles from './style.scss';
import {Icon} from 'antd';

class Detail extends Component {
  static propTypes = {
    detail: PropTypes.object,
    commonList: PropTypes.object,
    onClose: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    onCloseDetail: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };  
  }

  onSubmit(data) {

  }

  renderForm() {
    let status = this.props.detail.get('defectStatus');
    if(status !== '0' && status !== '4') {
      return (
        <HandleForm 
          commonList={this.props.commonList}
          onSubmit={this.onSubmit}
          onCancel={this.props.onCloseDetail}
          status={status} />
      )
    } else {
      return null;
    }
  }

  render() {
    let detail = this.props.detail;
    return (
      <div className={styles.defectDetail}>
        <div className={styles.header}>
          <Icon type="up" onClick={this.props.onPrev} />
          <Icon type="down" onClick={this.props.onNext} />
          <Icon type="close" onClick={this.props.onCloseDetail} />
        </div>
        <div className={styles.content}>
          <div className={styles.basic}>
            <BasicInfo basicInfo={detail} />
          </div>
          <div className={styles.right}>
            <div className={styles.timeLines}>
              <TimeLines 
                processData={detail.get('processData')}
                status={detail.get('defectStatus')} />
            </div>
            <div className={styles.form}>
              {this.renderForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }  
}

export default Detail;