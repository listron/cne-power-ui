

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
    onPaginationChange: PropTypes.func
  }

  static defaultProps = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizeArray: [10,20,30,40],
  }

  constructor(props){
    super(props);
  }
  
  onPageSizeChange = (pageSize) => { // 每页条数变化
    let { currentPage, total } = this.props;
    this.props.onPaginationChange({
      pageSize,
      currentPage: total / pageSize>currentPage ? currentPage: Math.ceil(total/pageSize),
    })
  }

  onPageChange = (currentPage) => { // 页码变化
    const { pageSize } = this.props;
    this.props.onPaginationChange({
      pageSize,
      currentPage
    })
  }

  render(){
    const { total, pageSizeArray, pageSize, currentPage } = this.props;
    return (
      <div className={styles.commonPagination}>
        <span>合计：{total}</span>
        <div className={styles.sizeSelector}>
          <span>每页：</span>
          <Select onChange={this.onPageSizeChange} defaultValue={pageSize} >
            {pageSizeArray.map(e=>(<Option value={e} key={e}>{e}</Option>))}
          </Select>
        </div>
        <div className={styles.pageSelector} >
          <span>页数：</span>
          <Pagination simple current={currentPage} total={total} onChange={this.onPageChange} pageSize={pageSize} />
        </div>
      </div>
    )
  }
}

export default CommonPagination;
