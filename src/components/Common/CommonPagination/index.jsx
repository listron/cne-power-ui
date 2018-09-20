

import React, { Component } from 'react';
import { Select, Pagination } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';

const { Option } = Select;
/*
  公用分页组件：
  说明： 
    1. 要求组件必须传输属性：合计条数(total);
    2. 选填属性： pageSizeArray,默认为[10,20,30,40];
    3. 输出为this.props.onPaginationChange调用，输入分页数组信息。this.props.onPaginationChange({
      pageSize: num,
      currentPage: num.
    })
*/


class CommonPagination extends Component {
  static propTypes = {
    total: PropTypes.number,
    pageSizeArray: PropTypes.array,
    onPaginationChange: PropTypes.func
  }
  static defaultProps = {
    pageSizeArray: [10,20,30,40],
  }

  constructor(props){
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: props.pageSizeArray[0]
    }
  }
  componentWillReceiveProps(nextProps){
    const { total } = this.props;
    const newTotal = nextProps.total;
    if(total !== newTotal){ // 页面数据(>0)总条数发生变化时，页码重置为1。
      this.setState({
        currentPage : newTotal === 0 ? 0 : 1,
      })
    }
  }
  onPageSizeChange = (pageSize) => {
    let { currentPage } = this.state;
    const { total } = this.props;
    currentPage = total/pageSize>currentPage?currentPage:Math.ceil(total/pageSize); 
    // size变化导致当前页超出total时，currentPage变为最后一页
    this.setState({
      pageSize,
      currentPage
    })
    this.props.onPaginationChange({
      pageSize,
      currentPage
    })
  }
  onPageChange = (currentPage) => {
    const { pageSize } = this.state;
    this.setState({
      currentPage
    })
    this.props.onPaginationChange({
      pageSize,
      currentPage
    })
  }

  render(){
    const { total, pageSizeArray } = this.props;
    const { currentPage, pageSize } = this.state;
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
