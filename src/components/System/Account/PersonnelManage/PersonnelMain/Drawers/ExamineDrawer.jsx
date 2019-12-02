

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Select, Button, Radio } from 'antd';
import DepartmentSelector from '../Modals/DepartmentSelector';
import styles from './drawer.scss';

const FormItem = Form.Item;
const { Option } = Select;

class ExamineDrawer extends Component {
  static propTypes = {
    examineLoading: PropTypes.bool,
    examineSuccess: PropTypes.bool,
    personnelDrawerIds: PropTypes.array,
    roleAllList: PropTypes.array,
    departmentTree: PropTypes.array,
    form: PropTypes.object,
    changeStore: PropTypes.func,
    getUserList: PropTypes.func,
    setUserStatus: PropTypes.func,
  }

  componentWillReceiveProps(nextProps){
    const { examineSuccess, examineLoading } = nextProps;
    const preLoading = this.props.examineLoading;
    if (preLoading && !examineLoading && examineSuccess) { // 审核完毕, 关闭弹框, 并刷新用户列表
      this.hideExamineDrawer();
      this.props.getUserList();
    }
  }

  saveExamine = () => { // 审核
    const { form, personnelDrawerIds } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.setUserStatus({
          userId: personnelDrawerIds.join(','),
          ...values,
        });
      }
    });
  }

  hideExamineDrawer = () => { // 隐藏抽屉并重置
    this.props.form.resetFields();
    this.props.changeStore({ personnelDrawerIds: [] });
  }

  render(){
    const { examineLoading, personnelDrawerIds, form, roleAllList, departmentTree } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Drawer
        title="用户审核"
        placement="right"
        onClose={this.hideExamineDrawer}
        visible={personnelDrawerIds.length > 0}
        getContainer={false}
        style={{ position: 'absolute' }}
        width={520}
      >
        <Form className={styles.personnelDrawer}>
          <FormItem label="审核" colon={false} className={styles.drawerItem}>
            {getFieldDecorator('enterpriseUserStatus', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: '3',
            })(
               <Radio.Group>
                <Radio value="3">通过</Radio>
                <Radio value="6">不通过</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="角色" colon={false} className={styles.drawerItem} >
            {getFieldDecorator('roleIds', {
              initialValue: [],
              rules: [{ required: true, message: '请选择用户角色' }],
            })(
              <Select
                mode="multiple"
                placeholder="请选择用户角色"
                style={{width: '200px'}}
                className={styles.selectRoles}
              >
                {roleAllList.map((e)=>(
                  <Option key={e.roleId} value={e.roleId}>{e.roleDesc}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="所属部门" colon={false} className={styles.drawerItem}>
            {getFieldDecorator('departmentIds', {
              rules: [{ required: true, message: '请选择所属部门' }],
              initialValue: [],
            })(
              <DepartmentSelector departmentTree={departmentTree} />
            )}
          </FormItem>
          <div className={styles.btns}>
            <Button className={styles.cancelAdd} onClick={this.hideExamineDrawer}>取消</Button>
            <Button loading={examineLoading} className={styles.saveAdd} onClick={this.saveExamine}>保存</Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default Form.create({})(ExamineDrawer);
