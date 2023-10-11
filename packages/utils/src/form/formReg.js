import Vue from 'vue';
import { isEmpty } from 'lodash';

const vProto = Vue.prototype;

/**
 * @method 生成验证提示范围文字
 * @param { int } min: 验证范围的最小值
 * @param { int } max: 验证范围的最大值
 * @param { string } regText: 范围验证的文本模板
 * @param { string } requiredText: 必填文字的文本模板
 * @param { boolean } isRequired: 是否返回必填文字
 * @returns { string } * 验证提示的文字
 */
const textRangeHelper = (min, max, regText, requiredText, isRequired) => {
  if (!isRequired) {
    return regText.replace(/<%\d+%>-<%\d+%>/, () => {
      return `${min}-${max}`
    })
  } else {
    return requiredText
  }
}

/**
 * @method 生成验证提示文字
 * @param {*} max
 * @param {*} regText
 */
const textHelper = (max, regText) => {
  return regText.replace(/<%\d+%>/, () => {
    return `${max}`
  })
}

/**
 * @method 验证某一范围的字
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxChar = (min = 0, max = 10) => {
  return (rule, value, callback) => {
    // 后台返回的初始值为null
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max || value.length < min) {
        return callback(new Error(`请填写${min}-${max}个字`))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  }
}

/**
 * @method 验证某一范围的数字/字母
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxNumberAndLetter = (min = 2, max = 20) => {
  const regShowText = `资产名称只能输入${min}-${max}个数字/字母`
  return (rule, value, callback) => {
    const isRegPass = /^[a-zA-Z0-9]+$/.test(value)
    // 后台返回的初始值为null
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max || value.length < min || !isRegPass) {
        return callback(new Error(regShowText))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  }
}

/**
 * @method 验证某一范围的数字个数或者某一范围的数字大小
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @param { bool } isRange: 是否是数字个数
 *                   - true: 是数字个数范围
 *                   - false: 是数字大小范围
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxNumber = (min = 0, max = 10, regText, reg, isRange = true, typeText) => {
  // let regShowText = ''
  if (isRange) {
    // regShowText = `请填写${min}-${max}个数字`;
    return (rule, value, callback) => {
      // const isRegPass = /^\d+$/.test(value);
      const isRegPass = new RegExp(reg).test(value)
      // 后台返回的初始值为null
      if (value === null) {
        value = ''
      }
      if (value.trim() === '' && rule.required) {
        return callback(new Error(typeText))
      }
      if (typeof value === 'string' && value.trim() !== '') {
        if (value.length > max || value.length < min || !isRegPass) {
          return callback(new Error(textRangeHelper(min, max, regText)))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
  } else {
    // regShowText = `请填写${min}-${max}的数字`;
    return (rule, value, callback) => {
      // const isRegPass = /^\d+$/.test(value);
      // const isRegPass = /(^\d+$|^\d+\.?\d+$)/.test(value);
      const isRegPass = new RegExp(reg).test(value)
      // 后台返回的初始值为null
      if (value === null) {
        value = ''
      }
      if (typeof value === 'string' && value.trim() !== '') {
        value = Number(value)
        if (value > max || value < min || !isRegPass) {
          return callback(new Error(textRangeHelper(min, max, regText)))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
  }
}

/**
 * @method 验证某一范围的数字/字母/符号
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxWithOutCN = (min = 0, max = 10) => {
  const regShowText = `请填写${min}-${max}个数字/字母/符号`
  return (rule, value, callback) => {
    // 取反，排除汉字的情况
    const isRegPass = /[\u4e00-\u9fa5]+/.test(value)
    // 后台返回的初始值为null
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max || value.length < min || isRegPass) {
        return callback(new Error(regShowText))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  }
}
const RegChangeAssetNameChar = (min = 2, max = 20, regText) => {
  return (rule, value, callback) => {
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max || value.length < min) {
        return callback(new Error(textRangeHelper(min, max, regText)))
      } else {
        return callback()
      }
    }
  }
}

/**
 * @method 验证某一范围的数字/字母/符号，包含后台验证
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @param { Object } fetchObj: 验证的对象
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxAndCheckWithOutCN = (min = 0, max = 10, fetchObj) => {
  const regShowText = `请填写${min}-${max}个数字/字母/符号`
  const regCommonShowText = '当前条码已存在，不可重复添加'

  return async (rule, value, callback) => {
    // 取反，排除汉字的情况
    const isRegPass = /[\u4e00-\u9fa5]+/.test(value)
    // 后台返回的初始值为null
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max || value.length < min || isRegPass) {
        return callback(new Error(regShowText))
      } else {
        if (fetchObj) {
          const { data } = await vProto.$ajaxPost('wms/goodsSku/select.do', {
            reqParam: JSON.stringify({
              [fetchObj.key]: value
            })
          })
          if (data.code === 200 && !data.data) {
            return callback()
          } else {
            return callback(new Error(regCommonShowText))
          }
        } else {
          return callback()
        }
      }
    } else {
      return callback()
    }
  }
}

/**
 * @method 验证某一范围的数字/字母/SYMBOLS[0]
 * @param {*} min
 * @param {*} max
 * @param {*} regText
 * @param {*} typeText
 * @returns { Function }
 */
const RegMin2MaxNumberLetterSYMBOLSRequired = (min = 0, max = 10, regText, typeText) => {
  return (_, value, callback) => {
    const isRegPass = /^[-a-zA-Z0-9]+$/.test(value);
    if (!value) {
      value = ''
    }
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max || value.length < min || !isRegPass) {
        return callback(new Error(textRangeHelper(min, max, regText)))
      } else {
        return callback()
      }
    } else {
      return callback(new Error(textRangeHelper(min, max, regText, typeText, true)))
    }
  }
}

/**
 * @method 验证某一范围的字
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxCharRequired = (min = 0, max = 10, regText, typeText) => {
  return (rule, value, callback) => {
    // 后台返回的初始值为null
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && rule.required) {
      if (value.trim() === '') {
        return callback(new Error(typeText))
      } else if (value.length > max || value.length < min) {
        return callback(new Error(textRangeHelper(min, max, regText)))
      } else {
        return callback()
      }
    } else {
      if (typeof value === 'string' && value.trim() !== '' && (value.length > max || value.length < min)) {
        return callback(new Error(textRangeHelper(min, max, regText)))
      } else {
        return callback()
      }
    }
  }
}
/**
 * @method 验证级联选择器
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegCascaderRequired = (regText) => {
  return (rule, value, callback) => {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      if (!value) {
        return callback(new Error(regText))
      } else {
        return callback()
      }
    } else {
      return callback(new Error(regText))
    }
  }
}

/**
 * @method 验证下拉选择器
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegSelectRequired = (regText) => {
  return (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && rule.required && value === '') {
      return callback(new Error(regText))
    } else {
      return callback()
    }
  }
}

/**
 * @method 验证时间选择器
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegDateRequired = (regText) => {
  return (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && rule.required && value.trim() === '') {
      return callback(new Error(regText))
    } else {
      return callback()
    }
  }
}

/**
 * @method 验证某一范围的数字个数或者某一范围的数字大小
 * @param { int } max: 验证的范围最大值
 * @param { bool } isRange: 是否是数字个数
 *                   - true: 是数字个数范围
 *                   - false: 是数字大小范围
 * @returns { Function } callback: 验证后执行的回调函数
 */
const RegLength = (max, regText) => {
  return (_, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (typeof value === 'string' && value.trim() !== '') {
      if (value.length > max) {
        return callback(new Error(textHelper(max, regText)))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  }
}

/**
 * @method 验证发起意见
 * @param regText
 * @returns {(function(*, *, *): void)|*}
 * @constructor
 */
const RegComments = (regText = '') => {
  return (_, value, callback) => {
    if (!value) {
      callback(new Error(regText || '请输入发起意见'));
    } else {
      callback();
    }
  };
};

/**
 * @method 验证图片
 * @param regText
 * @returns {(function(*, *, *): void)|*}
 */
const RegImages = (regText = '') => {
  return (_, value, callback) => {
    if (Array.isArray(value)) {
      if (isEmpty(value)) {
        callback(new Error(regText || '请上传图片'));
      } else {
        callback();
      }
    } else {
      throw new Error('Reg images must be array');
    }
  };
};



export {
  RegMin2MaxChar,
  RegMin2MaxNumber,
  RegMin2MaxNumberAndLetter,
  RegMin2MaxWithOutCN,
  RegMin2MaxAndCheckWithOutCN,
  RegMin2MaxNumberLetterSYMBOLSRequired,
  RegMin2MaxCharRequired,
  RegChangeAssetNameChar,
  RegCascaderRequired,
  RegSelectRequired,
  RegDateRequired,
  RegLength,
  RegComments,
  RegImages,
}
