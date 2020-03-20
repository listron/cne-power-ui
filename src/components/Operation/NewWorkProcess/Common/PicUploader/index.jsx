import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Progress, message } from 'antd';
import PicModal from './PicModal/PicModal';
import path from '@path';
import styles from './style.scss';

const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

/**
 * className: string, 外部单独样式
 * wrapModalClassName: string, 外部控制图片弹框的样式
 * maxPicNum: number, 最大上传图片数
 * uploadUrl: string 图片上传地址
 * rotateUrl: PropTypes.string, 图片旋转地址
 * value: PropTypes.array,存储的图片上传url列表
 * mode: PropTypes.string, 组件模式: edit编辑, review查看
 * onChange: PropTypes.func,数据改变后的主输出函数
 * 
 */

export default class PicUploader extends Component {
  static propTypes = {
    className: PropTypes.string,
    wrapModalClassName: PropTypes.string,
    maxPicNum: PropTypes.number,
    uploadUrl: PropTypes.string,
    rotateUrl: PropTypes.string,
    mode: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    maxPicNum: 4,
    value: [],
    uploadUrl: `${APIBasePath}${ticket.getUploadFile}`,
    onChange: () => {},
    mode: 'edit', // edit review
  }

  constructor(props) {
    super(props);
    this.state = {
      uploadPercent: 0, // 上传进度
      uploadLoading: false, // 上传loading
      fileList: [],
      modalPicSrc: null,
    };
  }

  beforeUpload = (file) => { // 上传图片前校验 => 后期可考虑做成默认覆盖 允许自定义函数
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('只允许上传图片');
      return false;
    }
    if (!isLt2M) {
      message.error('图片大小不超过2M');
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  onUploading = (info) => {
    const { event, file, fileList } = info || {};
    const { status, response } = file || {};
    const { code, data } = response || {};
    if (status === 'uploading') {
      let uploadPercent = 0;
      if(event) { // 改变上传进度
        const { percent } = event || {};
        uploadPercent = Math.floor(percent);
      }
      this.setState({
        uploadLoading: true,
        uploadPercent,
        fileList,
      });
    // } else if (status === 'done') { // 上传保存图片url->恢复默认
    } else if (status === 'done' && code === '10000') { // 上传保存url->恢复默认
      const { value = [] } = this.props;
      this.setState({
        uploadPercent: 0, // 上传进度
        uploadLoading: false, // 上传loading
        fileList: [],
      });
      this.props.onChange([...value, data]); // 上传成功, 得到的url信息输出;
    } else { // 上传失败, 清空信息
      message.error(`图片上传失败, ${response.message}`);
      this.setState({
        uploadPercent: 0,
        uploadLoading: false,
        fileList: [],
      });
    }
  }

  reviewPic = (modalPicSrc) => { // 展开弹框展示放大图片
    this.setState({ modalPicSrc });
  }

  modalPicIndexChange = (modalPicSrc) => { // 修改当前弹框index图片索引 - 置空为关闭弹框
    this.setState({ modalPicSrc });
  }

  render() {
    const { uploadPercent, uploadLoading, fileList, modalPicSrc } = this.state;
    const { value, uploadUrl, maxPicNum, mode, wrapModalClassName } = this.props;
    const authData = localStorage.getItem('authData') || '';
    return (
      <div className={`${styles.picUploader} ${styles.className}`}>
        {value.length > 0 && value.map((src, index) => (
          <div
            key={index}
            onClick={() => this.reviewPic(src)}
            className={`${styles.netPhotoBox} ${styles.fl}`}
          >
            <img src={src} alt="" />
            <div className={styles.shadeBox} />
          </div>
        ))}
        {value.length < maxPicNum && mode === 'edit' && <Upload
          listType="picture-card"
          className="avatar-uploader"
          headers={{'Authorization': 'bearer ' + authData}}
          multiple={true}
          fileList={fileList}
          showUploadList={false}
          action={uploadUrl}
          beforeUpload={this.beforeUpload}
          onChange={this.onUploading}
        >
          <div className={styles.uploadButton}>
            {uploadLoading ? <div className={styles.antLoadingText}>上传中</div> : <img src="/img/uploadImg.png" alt="" />}
            {uploadLoading ? <Progress strokeColor="#199475" percent={uploadPercent} /> : <div className="ant-upload-text">上传图片</div>}
          </div>
        </Upload>}
        <PicModal
          value={value}
          wrapModalClassName={wrapModalClassName}
          modalPicSrc={modalPicSrc}
          mode={mode}
          onPicChange={this.props.onChange}
          onModalPicIndexChange={this.modalPicIndexChange}
        />
      </div>
    );
  }
}
