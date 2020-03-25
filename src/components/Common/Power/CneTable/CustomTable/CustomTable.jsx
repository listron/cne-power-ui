import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './custom.scss';

/**
 * thead: 表头元素
 * children: 内容元素
 */

export default class CustomTable extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    thead: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.any,
    dataError: PropTypes.bool,
    scrollY: PropTypes.number,
    noMoreDataPic: PropTypes.bool,
  }

  static defaultProps = {
    theme: 'light',
    children: [],
  }

  state = {
    showHeaderShadow: false,
  }

  componentDidMount(){
    const { scrollY } = this.props;
    if (scrollY) { // 顶部冻结
      this.tableScrollWatching();
    }
  }

  componentDidUpdate(prevProps){
    const { scrollY } = this.props;
    const preScroll = prevProps.scrollY || {};
    if (!preScroll && scrollY > 0) {
      this.tableScrollWatching();
    }
    if (preScroll > 0 && !scrollY) {
      this.tableUnWatching();
    }
  }

  componentWillUnmount() {
    this.tableUnWatching();
  }

  tableScrollWatching = () => {
    const tableScrollBody = this.tableRef && this.tableRef.querySelector('.tbody');
      tableScrollBody && tableScrollBody.addEventListener('scroll', this.shadowFixed);
  }

  tableUnWatching = () => {
    const tableScrollBody = this.tableRef && this.tableRef.querySelector('.tbody');
    tableScrollBody && tableScrollBody.removeEventListener('scroll', this.shadowFixed);
  }

  shadowFixed = () => {
    const tableScrollHead = this.tableRef && this.tableRef.querySelector('.thead');
    const tableScrollBody = this.tableRef && this.tableRef.querySelector('.tbody');
    const { showHeaderShadow } = this.state;
    if (!showHeaderShadow && tableScrollBody && tableScrollBody.scrollTop > 0) { // 滚动开始
      this.setState({ showHeaderShadow: true });
      tableScrollHead.style.boxShadow = '0 4px 2px rgba(0, 0, 0, 0.3)';
      tableScrollHead.style.zIndex = '99';
    }
    if (showHeaderShadow && tableScrollBody && tableScrollBody.scrollTop === 0) { // 回到顶部
      this.setState({ showHeaderShadow: false });
      tableScrollHead.style.boxShadow = 'none';
      tableScrollHead.style.zIndex = '99';
    }
  }

  render(){
    const { theme, className, thead, children, dataError, scrollY, noMoreDataPic } = this.props;
    return (
      <div
        ref={ref => { this.tableRef = ref; }}
        className={`${styles.customTable} ${className || ''} ${styles[theme] || ''}`}
      >
        {thead}
        <div
          className="tbody"
          style={scrollY > 0 ? { overflowY: 'scroll', height: `${scrollY}px` } : {}}
        >
          {children && children.length > 0 ? children : (
            dataError ? <img
              width="84" height="77" src="/img/datawrong.png"
            /> : <img width="223" height="164" src="/img/nodata.png"
            />
          )}
          {noMoreDataPic && <img height="80px" src="/img/notabdata97-72.png" /> }
        </div>
      </div>
    );
  }
}
