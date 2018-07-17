


//备注： 次文件在最初产品设计时用于展示企业列表时使用。现只展示企业详情不展示企业列表。后续可能继续开发企业列表展示功能，请不要贸然删除。
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
// import EnterpriseDetail from './EnterpriseDetail';
// import EnterpriseEdit from './EnterpriseEdit';


class DepartmentSide extends Component {
  static propTypes = {
    showDetail: PropTypes.bool,
    showPage: PropTypes.string,
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }


  render(){
    const { showDetail, changeDepartmentStore, showPage } = this.props;
    return (
      <div className={styles.departmentSide}>
        side区域
        {showPage === 'detail' && <div>
            详情页标志
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'list'})}> 去表格页面</Button>
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'add'})}> 去添加点</Button>
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'edit'})}> 去编辑点</Button>
          </div>
        }
        {showPage === 'add' && <div>
            这个是新增页面，快添加东西了！
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'list'})}> 去表格页面</Button>
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'detail'})}> 看看详情吧！</Button>
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'edit'})}> 去编辑点</Button>
          </div>
        }
        {showPage === 'edit' && <div>
            编辑页面的样式在这
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'list'})}> 去表格页面</Button>
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'detail'})}> 看看详情吧！</Button>
            <Button onClick={()=> this.props.changeDepartmentStore({showPage:'add'})}> 是时候添加一波东西了！</Button>
          </div>
        }
        {/* {
          showDetail ?
          <EnterpriseDetail changeEnterpriseStore={changeEnterpriseStore} />:
          <EnterpriseEdit changeEnterpriseStore={changeEnterpriseStore} />
        } */}
      </div>
    )
  }
}

export default DepartmentSide;
