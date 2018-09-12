import React, { Component } from 'react';
import styles from './alarmManage.scss';
import { Table, Upload, Button } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class AlarmManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    alarmList: PropTypes.array,
    getAlarmList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getAlarmList, queryParams } = this.props;
    getAlarmList({
      ...queryParams,
      sortField: sorter.field,
      sortOrder: sorter.order==='ascend'?'asc':'desc',
    })
  }

  handleUpload = ({file,fileList}) => {
    console.log(file)
    console.log(fileList)
  }

  render() {
    const alarmListColumn = [
      {
        title: '测点编号',
        dataIndex: 'pointCode',
        key: 'pointCode',
      },{
        title: '告警描述',
        dataIndex: 'warningDescription',
        key: 'warningDescription',
      },{
        title: '告警参数',
        dataIndex: 'warningCheckRule',
        key: 'warningCheckRule',
      },{
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
      },{
        title: '是否启用',
        dataIndex: 'warningEnable',
        key: 'warningEnable',
        sorter: true,
        render: (text, record) => record.enableDisplay?'是':'否',
      }
    ];
    const { loading, alarmList } = this.props;

// -- totest 代码=> 准备删除上面的cookie upload button引入
    const authData = Cookie.get('authData') || null;
    const imageProps = {
			action: 'http://10.10.15.51/api/v3/uploadfile',
      onChange: this.handleUpload,
			listType: "picture-card",
      headers:{'Authorization': 'bearer ' + JSON.parse(authData)},
      data: (file) => {
        console.log(file)
        return {
          name:' zhang ',
          test: 'testing',
          file,
        }
      }
    };
    

    return (
      <div className={styles.deviceManageList}>
        <Upload
          { ...imageProps }
        >
          <Button>上传试试</Button>
        </Upload>
        <Table
          loading={loading}
          onChange={this.tableChange}
          columns={alarmListColumn}
          dataSource={alarmList.map((e,i)=>({key: i,...e}))}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    );
  }
}

export default AlarmManageList;
