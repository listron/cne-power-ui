import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './windCommon.scss';


class Operator extends Component {
  static propTypes = {
    operatorList: PropTypes.array,
    operatorTime: PropTypes.number,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.scrollTimer = null;
  }

  shouldComponentUpdate(nextProps) {
    const preTime = this.props.operatorTime;
    const {operatorTime, theme} = nextProps;
    return operatorTime !== preTime || theme !== this.props.theme;
  }

  componentDidUpdate = (prevProps) => {
    const { operatorList: prevOperatorList } = prevProps;
    const { operatorList: currentOperatorList } = this.props;
    if (prevOperatorList.length === 0 && currentOperatorList.length > 0) {
      this.slideFunc(currentOperatorList);
      return false;
    }
    // 没有数据停止定时器
    if(prevOperatorList.length === 0 && currentOperatorList.length === 0) {
      clearInterval(this.scrollTimer);
    }

  };

  componentWillUnmount() {
    clearInterval(this.scrollTimer);
  }

  slideFunc = (list) => {
    const { box, childBox } = this;
    const scrollHeight = list.length * 30;
    this.scrollTimer = setInterval(() => {
      if (childBox.offsetHeight + box.scrollTop >= scrollHeight) {
        box.scrollTop = 0;
      } else {
        box.scrollTop += 30;
      }
    }, 5000);
  };

  onMouseEnter = () => {
    // 清除定时器
    clearInterval(this.scrollTimer);
  };

  onMouseLeave = () => {
    // 重新开启定时器
    const { operatorList } = this.props;
    this.slideFunc(operatorList);
  };


  render() {
    const {operatorList = [], theme = 'light'} = this.props;
    return (
      <div className={`${styles.operator} ${styles[theme]}`}>
        {operatorList.length > 0 && <div className={styles.newOperatorList} ref={(ref) => (this.box = ref)} onMouseEnter={() => {this.onMouseEnter();}} onMouseLeave={() => {this.onMouseLeave();}}>
          <div className={styles.scrollAnmiate} ref={(ref) => (this.childBox = ref)}>
            {operatorList && operatorList.map((item, index) => {
              return <span key={index}
                           className={styles.spanLine}>{item.roleDesc} {item.userFullName || item.userName} {item.phoneNum}   </span>;
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default Operator;
