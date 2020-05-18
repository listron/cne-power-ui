

import React, { Component } from 'react';
import { Select, Pagination } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';

const { Option } = Select;
/*
  公用分页组件：
  说明：
    1. 要求组件必须传输属性：合计条数total合计条数(int),当前页码currentPage(当前页码int),每页条数pageSize(int);
    2. 选填属性： pageSizeArray,默认为[10,20,30,40];
    3. 输出为this.props.onPaginationChange调用，输入分页数组信息。this.props.onPaginationChange({
      pageSize: num,
      currentPage: num.
    })
*/


class CommonPagination extends Component {
  static propTypes = {
    total: PropTypes.number,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    pageSizeArray: PropTypes.array,
    onPaginationChange: PropTypes.func,
    theme: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizeArray: [10, 20, 30, 40],
  }

  constructor(props) {
    super(props);
    this.state = {
      pageSize: props.pageSize,
      currentPage: props.currentPage,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { pageSize, currentPage, total } = nextProps;
    const lastSize = this.props.pageSize;
    const lastPage = this.props.currentPage;
    const lastTotal = this.props.total;
    if (total === 0) { // 初始无数据
      this.setState({ currentPage: 0 });
    } else if (total > 0 && lastTotal === 0) { // 第一次得到数据
      this.setState({ pageSize, currentPage });
    } else if (lastSize !== pageSize || lastPage !== currentPage) { // 强制页码改变

      this.setState({ pageSize, currentPage });
    }
  }

  onPageSizeChange = (pageSize) => { // 每页条数变化
    const { currentPage } = this.state;
    const { total } = this.props;
    this.setState({ pageSize });
    this.props.onPaginationChange({
      pageSize,
      currentPage: total / pageSize > currentPage ? currentPage : Math.ceil(total / pageSize),
    });
  }

  onPageChange = (currentPage) => { // 页码变化
    const { pageSize } = this.state;
    this.setState({ pageSize });
    this.props.onPaginationChange({
      pageSize,
      currentPage,
    });
  }

  render() {
    const { total, pageSizeArray, theme, className } = this.props;
    const { pageSize, currentPage } = this.state;
    return (
      <div className={`${styles.commonPagination} ${className} ${styles[theme]} `}>
        <span>合计：{total}</span>
        <div className={styles.sizeSelector}>
          <span>每页：</span>
          <span ref={'pageNumber'} />
          <Select
            onChange={this.onPageSizeChange}
            getPopupContainer={() => this.refs.pageNumber}
            // defaultValue={pageSize}
            value={pageSize}
          >
            {pageSizeArray.map(e => (<Option value={e} key={e}>{e}</Option>))}
          </Select>
        </div>
        <div className={styles.pageSelector} >
          <span className={styles.text}>页数</span>
          <Pagination simple current={total === 0 ? 0 : currentPage} total={total} onChange={this.onPageChange} pageSize={pageSize} />
        </div>
      </div>
    );
  }
}

export default CommonPagination;
