

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Select, Input } from 'antd';
import StationSelect from '@components/Common/StationSelect';
import styles from './drawer.scss';

const FormItem = Form.Item;
const { Option } = Select;

class PersonnelMain extends Component {
  static propTypes = {
    departmentDrawerKey: PropTypes.string,
    form: PropTypes.object,
    changeStore: PropTypes.func,
  }

  drawerTitle = {
    edit: '编辑部门',
    add: '添加部门',
  }

  hideDepartmentDrawer = () => {
    this.props.changeStore({ departmentDrawerKey: 'hide' });
  }

  // this.props.form.validateFields(this.formInfoQuery(this.props.addWorkPlan));

  // formInfoQuery = (queryMethod = () => {}, planId) => (err, values) => {
  //   if (!err) {
  //     const { stationList, firstStartTime, deadLine, ...rest} = values;
  //     queryMethod({
  //       ...rest,
  //       planId,
  //       stationCodes: stationList.map(e => e.stationCode),
  //       firstStartTime: firstStartTime.format('YYYY/MM/DD'),
  //       deadLine: deadLine && deadLine.format('YYYY/MM/DD'),
  //     });
  //   }
  // }

  render(){
    const { departmentDrawerKey, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Drawer
        title={this.drawerTitle[departmentDrawerKey] || '--'}
        placement="right"
        onClose={this.hideDepartmentDrawer}
        visible={departmentDrawerKey !== 'hide'}
        getContainer={false}
        style={{ position: 'absolute' }}
        width={520}
      >
        <Form>
          <FormItem label="父部门" colon={false}>
            {getFieldDecorator('fartherDepart', {
              rules: [{ required: true, message: '请选择父部门' }],
              initialValue: [],
            })(
              <Select style={{width: '200px'}}>
                <Option value={100}>巡视计划</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="部门名称" colon={false}>
            {getFieldDecorator('departmentName', {
              rules: [{ required: true, message: '请输入部门名称' }],
              initialValue: '',
            })(
              <Input style={{width: '200px'}} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="负责电站" colon={false}>
            {getFieldDecorator('stations', {
              rules: [{ required: true, message: '请选择负责电站' }],
              initialValue: [],
            })(
              <StationSelect
                data={[]}
                multiple={true}
                style={{ width: '200px' }}
              />
            )}
          </FormItem>
        </Form>
        <p>新增部门或者编辑部门</p>
      </Drawer>
    );
  }
}

export default Form.create({})(PersonnelMain);
