import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default function toZip(imgSrcList, fileName, childFileName) {//imgSrcList是base64位的图片数组，fileName是文件名
  const zip = new JSZip();//实例化一个压缩文件对象
  const imgFolder = zip.folder(fileName); //新建一个图片文件夹用来存放图片，参数为文件名
  for (let i = 0; i < imgSrcList.length; i++) {
    const src = imgSrcList[i].src;
    const imgname = imgSrcList[i].title;
    const tempImage = new Image();
    tempImage.src = src;
    tempImage.crossOrigin = '*';
    tempImage.onload = () => {
      // imgFolder.file((i+1)+'.jpg', getBase64Image(tempImage).substring(22), { base64: true })
      //第一个参数是保存在文件夹里的文件名，第二个是base64位的图片编码，
      imgFolder.file(imgname + childFileName + '.png', src.substring(22), { base64: true });
    };
  }


  setTimeout(() => {
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      // FileSaver.saveAs(content, 'images.zip');
      FileSaver.saveAs(content, fileName);
    });
  }, 2000);
}

function getBase64Image(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  const dataURL = canvas.toDataURL('image/' + ext);
  return dataURL;
}
