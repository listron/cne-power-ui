

import React, { Component } from 'react';
import { Select, Pagination } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;
/*
  公用分页组件：
  说明： 
    1. 要求组件必须传输属性：合计条数(total);
    2. 选填属性： pageSizeArray,默认为[10,20,30,40];
    3. 输出为this.props.onPaginationChange调用，输入分页数组信息。this.props.onPaginationChange({
      pageSize: num,
      currentPage: num
    })
*/
class CommonPagination extends Component {
  static propTypes = {
    total: PropTypes.number,
    pageSizeArray: PropTypes.array,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func
  }
  static defaultProps = {
    pageSizeArray: [10,20,30,40],
  }

  constructor(props){
    super(props);
    this.setState({
      currentPage: 1
    })
  }
  onPageSizeChange = (pageSize) => {
    const { currentPage } = this.state;
    this.props.onPaginationChange({
      pageSize,
      currentPage
    })
  }
  onPageChange = (currentPage, pageSize) => {
    console.log(currentPage,pageSize)
    this.setState({
      currentPage
    })
    this.props.onPaginationChange({
      pageSize,
      currentPage
    })
  }

  render(){
    const { pageSizeArray, total } = this.props;
    const { currentPage } = this.state;
    const defaultSize = pageSizeArray[0];
    return (
      <div>
        <span>合计：</span>
        <span>{total}</span>
        <span>每页：</span>
        <Select onChange={this.onPageSizeChange} style={{width:'40px'}} defaultValue={defaultSize} >
          {pageSizeArray.map(e=>(<Option value={e}>{e}</Option>))}
        </Select>
        <Pagination simple defaultCurrent={currentPage} total={total} onChange={this.onPageChange} />
      </div>
    )
  }
}

export default CommonPagination;
