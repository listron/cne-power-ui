




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import styles from './role.scss';
import RoleTree from './RoleTree';
const FormItem = Form.Item;


class RoleEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    showPage: PropTypes.string,
    selectedRole: PropTypes.array,
    menuData: PropTypes.array,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    changeRoleStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  onSaveRole = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        if(this.props.showPage === 'create') {
          this.props.onCreate(values);
        } else {
          this.props.onEdit({
            ...values,
            roleId: this.props.selectedRole[0].roleId
          })
        }
      }
    });
    this.props.changeRoleStore({showPage: 'list'});
  }

  onSaveRoleAndAdd = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.props.onCreate(values);    
      }
    });
    this.props.form.resetFields();
  }

  getIds(data) {
    let ids = [];
    this.generateIds(data, ids);
    return ids.join(',');
  }

  generateIds(data, ids) {
    for(var i = 0; i < data.length; i++) {
      if(data[i].childRightData instanceof Array) {
        this.generateIds(data[i].childRightData, ids);
      } else {
        ids.push(data[i].rightId);
      }
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const isCreate = this.props.showPage === 'create';
    const selectedRole = isCreate? null: this.props.selectedRole[0];
    return (     
      <Form onSubmit={this.onSubmit} className={styles.roleEditForm}>
        <FormItem label="角色名称">
          {getFieldDecorator('roleName', {
            rules: [{ 
              required: isCreate 
            }],
            initialValue: isCreate || !selectedRole ? '' : selectedRole.roleName
          })(
            <Input placeholder="请输入..." />
          )}
          <span className={styles.instructionText}>(10字以内)</span>
        </FormItem>
        <FormItem
          className={styles.dealProposal} 
          label="功能设置">
          {getFieldDecorator('rightId', {
            rules: [{ 
              required: true,
            }],
            initialValue: isCreate || !selectedRole ? '' : this.getIds(selectedRole.rightData)
          })(
            <RoleTree treeData={this.props.menuData} />
          )}
        </FormItem>
        <div className={styles.buttonGroup}>
          <Button className={styles.save} onClick={this.onSaveRole}>保存</Button>
          <Button onClick={this.onSaveRoleAndAdd}>保存并继续添加</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(RoleEditForm);
