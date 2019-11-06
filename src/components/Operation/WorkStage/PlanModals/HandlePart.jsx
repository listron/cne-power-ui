import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './planModals.scss';

class HandlePart extends PureComponent {

  static propTypes = {
    record: PropTypes.object,
    publishOnce: PropTypes.func,
    deleteOnce: PropTypes.func,
  };

  handlePublish = () => {
    const { record } = this.props;
    this.props.publishOnce(record);
  }

  handleDelete = () => {
    const { record } = this.props;
    this.props.deleteOnce(record);
  }

  render(){
    return (
      <div className={styles.handleText}>
        <span className={styles.publishPlan} onClick={this.handlePublish}>立即下发</span>
        <span className={`iconfont icon-del ${styles.deletePlan}`} onClick={this.handleDelete} />
      </div>
    );
  }
}

export default HandlePart;
