

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
    showPersonnelDrawer: PropTypes.bool,
    roleAllList: PropTypes.array,
    departmentTree: PropTypes.array,
    departmentDrawerKey: PropTypes.string,
    departmentEditInfo: PropTypes.object,
    addDepartmentLoading: PropTypes.bool,
    addDepartmentSuccess: PropTypes.bool,
    stations: PropTypes.array,
    form: PropTypes.object,
    changeStore: PropTypes.func,
    addNewDepartment: PropTypes.func,
    editDepartment: PropTypes.func,
  }

  // componentWillReceiveProps(nextProps){
  //   const { departmentDrawerKey, departmentEditInfo, form, stations, addDepartmentLoading, addDepartmentSuccess } = nextProps;
  //   const preDepartmentEditInfo = this.props.departmentEditInfo;
  //   const preLoading = this.props.addDepartmentLoading;
  //   if (departmentDrawerKey === 'edit' && preDepartmentEditInfo !== departmentEditInfo) { // 编辑页 得待新编辑部门数据
  //     const { departmentName, parentDepartmentId } = departmentEditInfo;
  //     const departmentStation = departmentEditInfo.stations || [];
  //     form.setFieldsValue({ // 编辑信息内容存入
  //       departmentName,
  //       departmentId: parentDepartmentId,
  //       stationLists: stations.filter(e => departmentStation.some(m => `${m.stationCode}` === `${e.stationCode}`)),
  //     });
  //   }
  //   if (preLoading && !addDepartmentLoading && addDepartmentSuccess) { // 新增 / 编辑请求结束 => 成功 => 关闭抽屉
  //     this.hideDepartmentDrawer();
  //   }
  // }

  saveExamine = () => { // 审核
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        // const { stationLists, ...rest } = values;
        // const formValues = { ...rest, stationCodes: stationLists.map(e => e.stationCode) };
        // departmentDrawerKey === 'edit' && this.props.editDepartment({
        //   ...rest,
        //   departmentId: departmentEditInfo.departmentId,
        //   stationCodes: stationLists.map(e => e.stationCode),
        // });
        // departmentDrawerKey === 'add' && this.props.addNewDepartment(formValues);
      }
    });
  }

  hideExamineDrawer = () => { // 隐藏抽屉并重置
    this.props.form.resetFields();
    this.props.changeStore({ showPersonnelDrawer: false });
  }

  render(){
    const { examineLoading, showPersonnelDrawer, form, roleAllList, departmentTree } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Drawer
        title="用户审核"
        placement="right"
        onClose={this.hideExamineDrawer}
        visible={showPersonnelDrawer}
        getContainer={false}
        style={{ position: 'absolute' }}
        width={520}
      >
        <Form className={styles.personnelDrawer}>
          <FormItem label="审核" colon={false} className={styles.drawerItem}>
            {getFieldDecorator('enterpriseUserStatus', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: true,
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
              rules: [{ required: true, message: '请选择审核结果' }],
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
              rules: [{ required: true, message: '请选择负责电站' }],
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
