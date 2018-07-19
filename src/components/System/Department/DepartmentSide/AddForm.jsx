




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
const FormItem = Form.Item;

class AddForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    addDepartmentInfor: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  addDepartment = () =>{
    const { addDepartmentInfor } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        console.log(values)
      }
    })
  }
  addContinue = () => {
    const { addDepartmentInfor } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        console.log(values);
        // form.resetFields()
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    return (
      <Form className={styles.addPart}>
        <FormItem label="部门名称" >
          {getFieldDecorator('departmentName',{
            rules: [{ required : true }],
            initialValue: '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="所属部门" >
          {getFieldDecorator('departmentId',{
            initialValue: '',
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(不选默认为父级部门，保存后不可修改)</span>
        </FormItem>
        <Button onClick={this.addDepartment} loading={loading} >保存</Button>
        <Button onClick={this.addContinue} loading={loading} >保存并继续添加</Button>
      </Form>
    )
  }
}

export default Form.create()(AddForm);
