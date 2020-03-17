import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import styles from './meterPicZoom.scss';

export default class MeterPicZoom extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    theme: PropTypes.string,
    tipClassname: PropTypes.string,
    onCancel: PropTypes.func,
    width: PropTypes.number,
    style: PropTypes.object,
    imgIndex: PropTypes.number,
    data: PropTypes.object,
    arrStr: PropTypes.string,
    curIndex: PropTypes.number,
    changeStore: PropTypes.func,
    changeStateFunc: PropTypes.func,
    getRotateImg: PropTypes.func,
    newReadMeterData: PropTypes.object,
    editFlag: PropTypes.bool,
  };

  static defaultProps = {
    visible: false,
    theme: 'light',
  };

  constructor(props) {
    super(props);
    this.state = {
      rotate: 0,
    };
  }

  rotateImgParentDivAdapt = () => {
    const { rotate } = this.state;
    const { data, curIndex, imgIndex, arrStr, getRotateImg, changeStore, newReadMeterData } = this.props;
    const imgUrl = data[arrStr][curIndex].meterImgs[imgIndex].url;
    const imgId = data[arrStr][curIndex].meterImgs[imgIndex].imgId;
    getRotateImg({
      url: imgUrl,
      rotate: rotate + 90,
      func: (res) => {
        // 重新改变当前旋转之后的图片
        data[arrStr][curIndex].meterImgs[imgIndex].url = res;
        // 成功之后添加旋转之后的照片, 和原来的imgId
        newReadMeterData[arrStr][curIndex].meterImgs[imgIndex].updateSign = imgId ? 3 : 1;// 判断imgId有就是修改-状态3，没有就是新增-状态1
        newReadMeterData[arrStr][curIndex].meterImgs[imgIndex].url = res;
        newReadMeterData[arrStr][curIndex].meterImgs[imgIndex].imgId = imgId;
        changeStore({
          readMeterData: data,
          newReadMeterData,
        });
      },
    });
  };

  delImgFunc = () => {
    const { changeStore, data, arrStr, curIndex, imgIndex, changeStateFunc, newReadMeterData, onCancel } = this.props;
    // 删除当前表格线下-图片数组下的指定下标图片
    const urlStr = data[arrStr][curIndex].meterImgs.splice(imgIndex, 1);
    // 获取newReadMeterData里面的图片数组
    // 重新赋值newReadMeterData对应的图片
    newReadMeterData[arrStr][curIndex].meterImgs = newReadMeterData[arrStr][curIndex].meterImgs.map(cur => {
      if(cur.url === urlStr[0].url){
        cur.updateSign = 2;
      }
      return cur;
    });
    const len = data[arrStr][curIndex].meterImgs.length;
    // 判断删除图片之后怎么展示当前图片
    // 1.当前下标>删除之后数组长度 当前下标 = 数组长度
    if(imgIndex > len) {
      changeStateFunc(len);
    }
    // 2.当前下标<删除之后数组长度 && > 0 当前下标 = 当前下标
    if(imgIndex > 0 && imgIndex <= len) {
      // 等于
      imgIndex === len && changeStateFunc(len - 1);
      // 小于
      imgIndex < len && changeStateFunc(imgIndex);
    }
    // 3.当前下标 = 删除之后数组长度0  当前下标 = 0
    if(imgIndex === 0 || len === 0) {
      changeStateFunc(0);
      // 判断当前删除最后一张图片
      len === 0 && onCancel();
    }

    this.setState({
      rotate: 0,
    }, () => {
      changeStore({
        readMeterData: data,
        newReadMeterData,
      });
    });
  };

  // 前一张
  prevFunc = () => {
    const { imgIndex, changeStateFunc } = this.props;
    this.setState({
      rotate: 0,
    }, () => {
      changeStateFunc(imgIndex - 1);
    });
  };

  // 后一张

  nextFunc = () => {
    const { imgIndex, changeStateFunc } = this.props;
    this.setState({
      rotate: 0,
    }, () => {
      changeStateFunc(imgIndex + 1);
    });
  };

  // 关闭
  closeFunc = () => {
    const { onCancel } = this.props;
    this.setState({
      rotate: 0,
    }, () => {
      onCancel();
    });
  };

  render() {
    const {
      visible, theme, tipClassname, width, style, imgIndex, data, arrStr, curIndex, editFlag,
    } = this.props;
    const defaultModalProps = {
      style,
      footer: null,
      closable: false,
      maskClosable: false,
      mask: false,
      maskStyle: {backgroundColor: 'rgba(153,153,153,0.2)'},
    };
    width && (defaultModalProps.width = width);
    // 图片数量
    const len = data[arrStr][curIndex].meterImgs.length;
    return (
      <Modal
        {...defaultModalProps}
        visible={visible}
        wrapClassName={`${styles.meterPicZoomBox} ${styles[theme]} ${tipClassname || ''}`}
      >
        <div className={styles.picZoomContent}>
          <div className={styles.picZoomTitle}>
            <div className={styles.picZoomTop}>
              <div className={styles.picZoomNum}>
                {len ? imgIndex+1 : 0}/{len}
              </div>
              <div className={styles.picZoomHandle}>
                {editFlag && <i title="旋转" className="iconfont icon-xuanzhuan" onClick={this.rotateImgParentDivAdapt} />}
                {editFlag && <i title="删除" className="iconfont icon-del" onClick={this.delImgFunc} />}
              </div>
              <div />
            </div>
            <div className={styles.picZoomClose}>
              <i title="关闭" onClick={this.closeFunc} className="iconfont icon-closeall" />
            </div>
          </div>
          <div className={styles.picZoomImgBox}>
            <div className={styles.picZoomImgContent}>
              <div className={styles.picLeftBox}>
                <i title="前一张" onClick={imgIndex - 1 >= 0 ? this.prevFunc : () => {}} className={`iconfont icon-arrowleft ${imgIndex - 1 >= 0 ? '' : styles.picLeft}`} />
              </div>
              <img src={data[arrStr][curIndex].meterImgs[imgIndex] ? data[arrStr][curIndex].meterImgs[imgIndex].url : ''} alt="" />
              <div className={styles.picRightBox}>
                <i title="后一张" onClick={imgIndex + 1 < len ? this.nextFunc : () => {}} className={`iconfont icon-arrowr ${imgIndex + 1 < len ? '' : styles.picRight}`} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
