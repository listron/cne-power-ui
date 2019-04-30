import React from "react";
import PropTypes from "prop-types";
import {Icon, Modal} from 'antd';
import styles from "./faultResetTask.scss";

export default class FaultResetTask extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    taskFlag: PropTypes.bool,
    onTaskVisible: PropTypes.func,
    getResetTask: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {

  }

  handleCancel = () => {
    const { onTaskVisible } = this.props;
    onTaskVisible(false);
  };

  handleOk = () => {
    const { getResetTask, onTaskVisible } = this.props;
    const params = {
      taskId: "387294252779520"
    };
    getResetTask(params);
    onTaskVisible(false);
  };


  render() {
    const { taskFlag } = this.props;
    return (
      <Modal
        visible={taskFlag}
        width={300}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div className={styles.faultResetTask}>
          <Icon type="exclamation-circle" /><span>确定要重新执行吗？</span>
        </div>
      </Modal>
    );
  }
}
