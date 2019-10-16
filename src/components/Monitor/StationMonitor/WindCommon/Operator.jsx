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
    this.scrollTimer = null; // 定时器
    this.spanHeight = 30;// 滚动距离 目前等于单条信息高度
    this.speed = 50;// 滚动速度
    this.delay = 5000;// 滚动的间歇时间
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
      this.slideFunc();
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

  slideFunc = () => {
    const { box, childBoxFirst, childBoxSecond } = this;
    // 赋值
    childBoxSecond.innerHTML = childBoxFirst.innerHTML;
    // 初始化
    setTimeout(() => this.startMove(box), this.delay);
  };

  startMove = (dom) => {
    dom.scrollTop ++;
    this.scrollTimer = setInterval(() => this.scrollUp(dom), this.speed);
  };

  scrollUp = (dom) => {
    if (dom.scrollTop % this.spanHeight === 0) {
      //如果滚动高度等于信息高度的整数倍
      clearInterval(this.scrollTimer);
      setTimeout(() => this.startMove(dom), this.delay);
    } else {
      dom.scrollTop ++;
      if (dom.scrollTop >= dom.scrollHeight / 2) {
        //area.scrollHeight/2的值等于con1.offsetHeight
        dom.scrollTop = 0;
      }
    }
  };

  onMouseEnter = () => {
    // 清除定时器
    clearInterval(this.scrollTimer);
  };

  onMouseLeave = () => {
    // 重新开启定时器
    this.slideFunc();
  };


  render() {
    const {operatorList = [], theme = 'light'} = this.props;
    return (
      <div className={`${styles.operator} ${styles[theme]}`}>
        {operatorList.length > 0 && <div className={styles.newOperatorList} ref={(ref) => (this.box = ref)} onMouseEnter={() => {this.onMouseEnter();}} onMouseLeave={() => {this.onMouseLeave();}}>
          <div className={styles.scrollAnmiate} ref={(ref) => (this.childBoxFirst = ref)}>
            {operatorList && operatorList.map((item, index) => {
              return <span key={index}
                           className={styles.spanLine}>{item.roleDesc} {item.userFullName || item.userName} {item.phoneNum}   </span>;
            })}
          </div>
          <div className={styles.scrollOtherAnimate} ref={(ref) => (this.childBoxSecond = ref)} />
        </div>}
      </div>
    );
  }
}

export default Operator;
