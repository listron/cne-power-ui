




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
const FormItem = Form.Item;
const Option = Select.Option;

class AddForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    buttonLoading: PropTypes.bool,
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
    const { loading, buttonLoading, allDepartment } = this.props;
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
            initialValue: '0',
          })(
            <Select style={{ width: 200 }}>
              <Option value="0">无</Option>
              {(allDepartment.list && allDepartment.list.length>0)?allDepartment.list.map(e=>(
                  <Option value={e.departmentId}>{e.departmentName}</Option>)
                ):null 
              }
            </Select>
          )}
          <span className={styles.instructionText}>(不选默认为父级部门，保存后不可修改)</span>
        </FormItem>
        <div className={styles.buttonGroup}>
          <Button onClick={this.addDepartment} loading={loading} className={styles.save}>保存</Button>
          <Button onClick={this.addContinue} loading={buttonLoading}>保存并继续添加</Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(AddForm);
