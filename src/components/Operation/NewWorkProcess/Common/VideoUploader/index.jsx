import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Progress, message } from 'antd';
import ReactPlayer from 'react-player';
import VideoModal from './VideoModal/VideoModal';
import path from '@path';
import styles from './style.scss';

const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

/**
 * className: string, 外部单独样式
 * wrapModalClassName: string, 外部控制视频弹框的样式
 * maxNum: number, 最大上传视频数
 * uploadUrl: string 视频上传地址
 * value: PropTypes.array,存储的上传url列表
 * onChange: PropTypes.func,数据改变后的主输出函数
 * 
 */

export default class VideoUploader extends Component {
  static propTypes = {
    className: PropTypes.string,
    wrapModalClassName: PropTypes.string,
    maxNum: PropTypes.number,
    uploadUrl: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    maxNum: 1,
    value: [],
    uploadUrl: `${APIBasePath}${ticket.getUploadFile}`,
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      uploadPercent: 0, // 上传进度
      uploadLoading: false, // 上传loading
      fileList: [],
      visible: false,
    };
  }

  beforeUpload = (file) => { // 上传前校验 => 后期可考虑做成默认覆盖 允许自定义函数
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
    } else if (status === 'done') { // 调试代码~不考虑上传失败
    // } else if (status === 'done' && code === '10000') { // 上传保存url->恢复默认
      const { value = [] } = this.props;
      this.setState({
        uploadPercent: 0, // 上传进度
        uploadLoading: false, // 上传loading
        fileList: [],
      });
      this.props.onChange([...value, data]); // 上传成功, 得到的url信息输出;
    } else { // 上传失败, 清空信息
      message.error(`上传失败, ${response.message}`);
      this.setState({
        uploadPercent: 0,
        uploadLoading: false,
        fileList: [],
      });
    }
  }

  onVideoDelete = (url) => { // 删除已上传视频
    const { value } = this.props;
    const newValue = value.filter(e => e !== url);
    this.props.onChange(newValue);
  }

  viewVideo = () => this.setState({ visible: true })

  hideVideoModal = () => this.setState({ visible: false })

  render() {
    const { uploadPercent, uploadLoading, fileList, visible } = this.state;
    const { value, uploadUrl, maxNum, wrapModalClassName } = this.props;
    const authData = localStorage.getItem('authData') || '';
    return (
      <div className={`${styles.videoUploader} ${styles.className}`}>
        {value.length > 0 && value.map((url, index) => (
          <div
            key={url}
            className={`${styles.videoViewer} ${styles.fl}`}
          >
            <div className={styles.delVideo}>
              <i
                title="删除"
                className={`iconfont icon-close1 ${styles.delIcon}`}
                onClick={() => this.onVideoDelete(url)}
              />
            </div>
            <ReactPlayer
              key={url}
              // url={url}
              url="/video/01-1000.mp4"
              playing={false}
              onClick={this.viewVideo}
              className={styles.eachVideo}
              width="60px"
              height="auto"
              style={{ maxHeight: '46px' }}
            />
          </div>
        ))}
        {value.length < maxNum && <Upload
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
            {uploadLoading ? <div className={styles.antLoadingText}>上传中</div> : <img src="/img/video34-26.png" alt="" />}
            {uploadLoading ? <Progress strokeColor="#199475" percent={uploadPercent} /> : <div className="ant-upload-text">上传视频</div>}
          </div>
        </Upload>}
        <VideoModal
          wrapModalClassName={wrapModalClassName}
          visible={visible}
          hideVideoModal={this.hideVideoModal}
        />
      </div>
    );
  }
}