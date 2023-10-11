import iconEXCEL from './assets/icons/excel@2x.png';
import iconIMAGE from './assets/icons/image@2x.png';
import iconPDF from './assets/icons/pdf@2x.png';
import iconPPT from './assets/icons/ppt@2x.png';
import iconTXT from './assets/icons/txt@2x.png';
import iconUNKNOWN from './assets/icons/unknow@2x.png';
import iconWORD from './assets/icons/word@2x.png';

/**
 * @method 自定义上传图片列表的按钮
 */
const getMimeTypeIcon = (type) => {
  const mimeTypeSuffixMap = {
    bmp: iconIMAGE,
    doc: iconWORD,
    docx: iconWORD,
    jpeg: iconIMAGE,
    jpg: iconIMAGE,
    pdf: iconPDF,
    gif: iconIMAGE,
    png: iconIMAGE,
    ppt: iconPPT,
    pptx: iconPPT,
    txt: iconTXT,
    xls: iconEXCEL,
    xlsx: iconEXCEL,
    webp: iconIMAGE,
  };
  if (type) {
    if (type in mimeTypeSuffixMap) return mimeTypeSuffixMap[type];
    else return iconUNKNOWN;
  } else {
    return iconUNKNOWN;
  }
};

/**
 * @method 获取文件后缀名
 * @param fileName
 * @returns {*}
 */
const getIcon = (fileName) => {
  if (fileName) {
    return getMimeTypeIcon(fileName.split('.').pop());
  } else {
    return getMimeTypeIcon();
  }
};

export { getMimeTypeIcon };
export default getIcon;
