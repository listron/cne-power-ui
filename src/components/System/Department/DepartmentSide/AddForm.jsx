




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;

class AddForm extends Component {
  static propTypes = {
    buttonLoading: PropTypes.bool,
    continueAddLoading: PropTypes.bool,
    enterpriseId: PropTypes.string,
    form: PropTypes.object,
    stations: PropTypes.array,
    allDepartment: PropTypes.object,
    addDepartmentInfor: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  addDepartment = () =>{
    const { addDepartmentInfor,enterpriseId } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        addDepartmentInfor({
          enterpriseId,
          ...values,
          continueAdd: false,
        })
      }
    })
  }
  addContinue = () => {
    const { addDepartmentInfor,form,enterpriseId } = this.props;
    form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        addDepartmentInfor({
          enterpriseId,
          ...values,
          continueAdd: true,
        });
        form.resetFields()
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { buttonLoading, continueAddLoading, allDepartment } = this.props;
    return (
      <Form className={styles.addPart}>
        <FormItem label="部门名称" >
          {getFieldDecorator('departmentName',{
            rules: [{ required : true, max: 29, message:'30字以内!' }],
            initialValue: '',
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(30字以内)</span>
        </FormItem>
        <FormItem label="所属部门" >
          {getFieldDecorator('departmentId',{
            initialValue: '0',
          })(
            <Select style={{ width: 200 }}>
              <Option value="0">无</Option>
              {(allDepartment.list && allDepartment.list.length>0)?allDepartment.list.map(e=>(
                  <Option value={e.departmentId} key={e.departmentId} >{e.departmentName}</Option>)
                ):null 
              }
            </Select>
          )}
          <span className={styles.instructionText}>(不选默认为父级部门，保存后不可修改)</span>
        </FormItem>
        <div className={styles.buttonGroup}>
          <Button onClick={this.addDepartment} loading={buttonLoading} className={styles.save}>保存</Button>
          <Button onClick={this.addContinue} loading={continueAddLoading}>保存并继续添加</Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(AddForm);
