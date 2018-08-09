import React, { Component } from 'react';
import ImgUploader from '../../components/Common/Uploader/ImgUploader';
import StationSelect from '../../components/Common/StationSelect';

import { Button } from 'antd';
import styles from './style.scss';
import pathConfig from '../../constants/path';
import { Link } from 'react-router-dom';

class Power extends Component {
  constructor(props,context) {
    super(props);
    this.state = {
    };
  }

  uploadImg = (fileList) =>{
    this.setState({fileList})
  }

  render() {   
    return (
        <div className={styles.power} >
          <div className={styles.powerRight}>
            <div className={styles.content}>
                this is page of power! 
                DO NOT CALL ME ROUTER! WILL TAKES ERROR WHEN BUILD!!!
                <Button type="primary">按钮antd测试</Button>
            </div>
            <div>
                <ImgUploader 
                    data={this.state.fileList} 
                    uploadPath={`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`} 
                    onChange={this.uploadImg} 
                    editable={true}
                />
            </div>
            <div>
                <StationSelect data={this.state.stationArray} multiple={true} onChange={this.stationSelected} style={{width:'500px'}} />
            </div>
						<div>
							<Button>
								<Link to="/hidden/monitorDevice/203/112233445566">气象站</Link>
							</Button>
							<Button>
							  <Link to="/hidden/monitorDevice/206/112233445566">组串逆变器</Link>
							</Button>
							<Button>
							  <Link to="/hidden/monitorDevice/202/112233445566">汇流箱</Link>
							</Button>
							<Button>
							  <Link to="/hidden/monitorDevice/304/112233445566">箱变</Link>
							</Button>
						</div>
          </div>
        </div>
    );
  }
}


export default Power;