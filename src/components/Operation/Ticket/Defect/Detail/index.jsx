import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from '../BasicInfo';
import ReviewForm from '../ReviewForm';
import TimeLines from '../../../../Common/TimeLines';
import styles from './style.scss';
import {Icon} from 'antd';

class Detail extends Component {
  static propTypes = {
    detail: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
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

  renderForm() {

  }

  render() {   
    return (
      <div className={styles.defectDetail}>
        <div className={styles.header}>
          <Icon type="up" onClick={this.props.onPrev} />
          <Icon type="down" onClick={this.props.onNext} />
          <Icon type="close" onClick={this.props.onClose} />
        </div>
        <div className={styles.content}>
          <div className={styles.basic}>
            <BasicInfo basicInfo={this.props.detail} />
          </div>
          <div className={styles.right}>
            <div className={styles.timeLines}>

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