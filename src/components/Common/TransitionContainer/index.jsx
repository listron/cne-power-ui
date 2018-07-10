import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import styles from './style.scss';

/*
  动画组件：
  说明：
    1.要求组件必须传输属性：effect, children
 */

class TransitionContainer extends Component {
  static propTypes = {
    show: PropTypes.bool,
    effect: PropTypes.string,//'modal':对话框淡入-中心放大，'picture':图片放大效果从上向下，'side'：列表页面新建/详情/编辑弹出效果
    children: PropTypes.object,
    timeout: PropTypes.number,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CSSTransition
          in={this.props.show}
          onEnter={this.props.onEnter}
          onExited={this.props.onExited}
          timeout={this.props.timeout}
          classNames={this.props.effect}
        >
        {this.props.children}
      </CSSTransition>
    );
  }
}

export default TransitionContainer;