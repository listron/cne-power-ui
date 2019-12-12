

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Select, Input, Button } from 'antd';
import StationSelect from '@components/Common/StationSelect';
import styles from './drawer.scss';

const FormItem = Form.Item;
const { Option } = Select;

class DepartmentDrawer extends Component {
  static propTypes = {
    departmentTree: PropTypes.array,
    departmentDrawerKey: PropTypes.string,
    departmentEditInfo: PropTypes.object,
    addDepartmentLoading: PropTypes.bool,
    addDepartmentSuccess: PropTypes.bool,
    stations: PropTypes.array,
    form: PropTypes.object,
    selectedDepartment: PropTypes.object,
    changeStore: PropTypes.func,
    addNewDepartment: PropTypes.func,
    editDepartment: PropTypes.func,
    getStationOfDepartment: PropTypes.func,
  }

  componentWillReceiveProps(nextProps){
    const { departmentDrawerKey, departmentEditInfo, form, stations, addDepartmentLoading, addDepartmentSuccess } = nextProps;
    const preDepartmentEditInfo = this.props.departmentEditInfo;
    const preLoading = this.props.addDepartmentLoading;
    if (departmentDrawerKey === 'edit' && preDepartmentEditInfo !== departmentEditInfo) { // 编辑页 得待新编辑部门数据
      const { departmentName, parentDepartmentId } = departmentEditInfo;
      const departmentStation = departmentEditInfo.stations || [];
      const stationLists = stations.filter(e => departmentStation.some(m => `${m.stationCode}` === `${e.stationCode}`));
      form.setFieldsValue({ // 编辑信息内容存入
        departmentName,
        departmentId: parentDepartmentId || '0', // 不存在父部门时 即为'0'
        stationLists,
      });
    }
    if (preLoading && !addDepartmentLoading && addDepartmentSuccess) { // 新增 / 编辑请求结束 => 成功 => 关闭抽屉
      const { selectedDepartment } = this.props;
      const { departmentId } = departmentEditInfo;
      if (selectedDepartment.departmentId === departmentId) { // 若是编辑, 且正是当前选中查看详情部门, 重新请求右侧部门负责电站 + 更新
        this.props.changeStore({
          selectedDepartment: {
            ...selectedDepartment,
            departmentName: form.getFieldValue('departmentName'),
          },
        });
        this.props.getStationOfDepartment({ departmentId });
      }
      this.hideDepartmentDrawer();
    }
  }

  drawerTitle = {
    edit: '编辑部门',
    add: '添加部门',
  }

  saveDepartment = () => { // 保存 => 区分编辑 或 新增
    const { form, departmentDrawerKey, departmentEditInfo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { stationLists, ...rest } = values;
        const formValues = { ...rest, stationCodes: stationLists.map(e => e.stationCode) };
        departmentDrawerKey === 'edit' && this.props.editDepartment({
          ...rest,
          departmentId: departmentEditInfo.departmentId,
          stationCodes: stationLists.map(e => e.stationCode),
        });
        departmentDrawerKey === 'add' && this.props.addNewDepartment(formValues);
      }
    });
  }

  hideDepartmentDrawer = () => { // 隐藏抽屉并重置
    this.props.form.resetFields();
    this.props.changeStore({
      departmentDrawerKey: 'hide',
      departmentEditInfo: {},
    });
  }

  render(){
    const { departmentDrawerKey, form, departmentTree, stations, addDepartmentLoading } = this.props;
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
        <Form className={styles.departmentDrawer}>
          <FormItem label="父部门" colon={false} className={styles.drawerItem}>
            {getFieldDecorator('departmentId', {
              rules: [{ required: true, message: '请选择父部门' }],
              initialValue: null,
            })(
              <Select style={{width: '200px'}} disabled={departmentDrawerKey === 'edit'}>
                <Option value="0">无父部门</Option>
                {departmentTree.filter(e => e.departmentId !== '1').map(e => (
                  <Option value={e.departmentId} key={e.departmentId}>{e.departmentName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="部门名称" colon={false} className={styles.drawerItem}>
            {getFieldDecorator('departmentName', {
              rules: [{ required: true, message: '请输入部门名称' }],
              initialValue: '',
            })(
              <Input style={{width: '200px'}} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="负责电站" colon={false} className={styles.drawerItem}>
            {getFieldDecorator('stationLists', {
              rules: [{ required: true, message: '请选择负责电站' }],
              initialValue: [],
            })(
              <StationSelect
                data={stations}
                multiple={true}
                style={{ width: '200px' }}
                stationShowNumber={true}
              />
            )}
          </FormItem>
          <div className={styles.btns}>
            <Button className={styles.cancelAdd} onClick={this.hideDepartmentDrawer}>取消</Button>
            <Button loading={addDepartmentLoading} className={styles.saveAdd} onClick={this.saveDepartment}>保存</Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default Form.create({})(DepartmentDrawer);
