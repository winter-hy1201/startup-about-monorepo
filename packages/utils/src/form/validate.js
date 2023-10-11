/* eslint-disable no-irregular-whitespace */
/**
 * 验证
 */

/* 合法uri */
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[-Za-z]+$/;
  return reg.test(str);
}

/*
"^\\d+$"　非负整数（正整数 + 0）
"^[0-9]*[1-9][0-9]*$"　　正整数
"^((-\\d+)|(0+))$"　　非正整数（负整数 + 0）
^-[0-9]*[1-9][0-9]*$"　　负整数
"^-?\\d+$"　整数
"^\\d+(\\.\\d+)?$"　非负浮点数（正浮点数 + 0）
"^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$"　正浮点数
"^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$"　　//非正浮点数（负浮点数 + 0）
"^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$"　负浮点数
"^(-?\\d+)(\\.\\d+)?$"　　浮点数
"/^\d+(\.\d)?$/"   验证最多小数点后一位
*/

/* 验证正整数 */
export function validatePositiveNum(val) {
  const reg = /^[0-9]*[1-9][0-9]*$/;
  return reg.test(val);
}

/* 验证最多小数点后一位 */
export function validateNumDotOne(val) {
  const reg = /^\d+(\.\d)?$/;
  return reg.test(val);
}

/**
 * 验证金额
 * @param val 需要验证的值
 * @param num 验证位数
 * @returns {boolean}
 */
export function validateMoney(val, num = 2) {
  // const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  // const reg = `(^d+$|^d+.?d{1,${num}$)`
  const reg = new RegExp(`(^([1-9]\\d{0,10}|0)(\\.\\d{1,${num}})?$)`);
  // const reg = new RegExp(`(^[1-9]([0-9]+)?(\\.[0-9]{1,${num})?$)|(^(0){1}$)|(^[0-9]\\.[0-9]([0-9])?$)`, 'i')
  return reg.test(val);
}

/* 验证身份证 */
export function validatUserId(val) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(val);
}

/* 验证邮箱 */
export function validatEmail(val) {
  const reg =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  return reg.test(val);
}

/* 验证手机 */
export function validatMobilePhone(val) {
  // const reg = /^((1)3(\d){9}$)|(^(1)4[5-9](\d){8}$)|(^(1)5[^4]{9}$)|(^(1)66(\d){8}$)|(^(1)7[0-8](\d){8}$)|(^(1)8(\d){9}$)|(^(1)9[8-9](\d){8}$)/
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(val);
}

/* 验证固定电话 */
export function validatTel(val) {
  const reg = /0\d{2,3}-\d{7,8}/;
  return reg.test(val);
}

// 验证重复元素，有重复返回true；否则返回false
export function isRepeat(arr) {
  let hash = {};
  for (let i in arr) {
    if (hash[arr[i]]) {
      return true;
    }
    hash[arr[i]] = true;
  }
  return false;
}

const customRegExp = {
  // 验证
  sortNum(_, value, callback) {
    // 2-30位，可包含字母，数字（0-9十个数字）
    const v = value.toString().trim();
    const flag = /^[0-9]{1,5}$/.test(v);
    if (v === '0' || (v && !flag)) {
      if (callback) callback(new Error('请输入1-99999之间整数'));
    } else {
      callback();
    }
  },
  allCode(_, value, callback) {
    // 2-30位，可包含字母，数字（0-9十个数字）
    const v = value.toString().trim();
    const flag = /^[A-Z0-9]{2,8}$/.test(v);
    if (v && !flag) {
      if (callback) callback(new Error('请输入2-8位,可包含大写字母,数字'));
    } else {
      callback();
    }
  },
  assetNo(_, value, callback) {
    // 2-30位，可包含字母（除去O、I后的24个大写字母），数字（0-9十个数字），符号（-）
    const v = value.toString().trim();
    const flag = /^[A-HJ-NP-Z0-9-]{2,30}$/.test(v);
    if (!flag) {
      if (callback)
        callback(new Error('编码只能输入2-30位,可包含字母,数字,符号(-)'));
    } else {
      callback();
    }
  },
  pureName(_, value, callback) {
    // 可以验证少数民族名
    const v = value.toString().trim();
    const flag = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(v);
    if (!flag) {
      if (callback) callback(new Error('填写内容为2位以上中文!'));
    } else {
      callback();
    }
  },
  pureCN(_, value, callback) {
    // 纯中文
    const v = value.toString().trim();
    const flag = /^[\u4E00-\u9FA5]+$/.test(v);
    if (!flag) {
      if (callback) callback(new Error('填写内容为纯中文!'));
    } else {
      callback();
    }
  },
  pureEN(_, value, callback) {
    // 纯英文
    const v = value.toString().trim();
    const flag = /^[A-Za-z]+$/.test(v);
    if (!flag) {
      if (callback) callback(new Error('填写内容为纯英文!'));
    } else {
      callback();
    }
  },
  pureNumber(rule, value, callback) {
    const v = value.toString().trim();
    const flag = /^\d+$/.test(v);
    if (!flag && rule.required) {
      if (callback) callback(new Error('请输入正整数'));
    } else {
      callback();
    }
  },
  passwordReg(_, value, callback) {
    // 密码
    const v = value.toString().trim();
    const flag =
      /^[a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{6,20}$/.test(v);
    if (!flag) {
      if (callback) callback(new Error('密码格式错误'));
    } else {
      callback();
    }
  },
  usernameReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /^[\u4E00-\u9FA5a-zA-Z0-9]{2,10}$/.test(v);
    if (!flag) {
      if (callback)
        callback(
          new Error('\n' + '用户名格式错误(2-10位,可包含中文,数字,字母)'),
        );
    } else {
      callback();
    }
  },
  employeenameReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z](.*?){0,13}[\u4E00-\u9FA5a-zA-Z0-9]$/.test(v);
    const secondFlag =
      /^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9.\-_]{0,13}[\u4E00-\u9FA5a-zA-Z0-9]$/.test(
        v,
      );
    if (!flag) {
      if (callback)
        callback(new Error('\n' + '2-15位(以中英文开头，中英文或数字结尾)'));
    } else if (!secondFlag) {
      if (callback) callback(new Error('\n' + '中间只可以包含（.-_）'));
    } else {
      callback();
    }
  },
  companyReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /^[\u4E00-\u9FA5a-zA-Z0-9_()（）\-_]{2,30}$/.test(v);
    if (!flag) {
      if (callback)
        callback(
          new Error(
            '\n' + '组织名称格式错误(2-30位,可包含中文,数字,字母,-,_,括号)',
          ),
        );
    } else {
      callback();
    }
  },
  orgCompanyReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{2,30}$/.test(
        v,
      );
    if (!flag) {
      if (callback)
        callback(
          new Error(
            '\n' + '组织名称格式错误(2-30位,可包含中文,数字,字母,符号)',
          ),
        );
    } else {
      callback();
    }
  },
  assetNameReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{2,30}$/.test(
        v,
      );
    if (!flag) {
      if (callback) callback(new Error('\n' + '资产名称只能输入2-20位'));
    } else {
      callback();
    }
  },
  templateReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{2,30}$/.test(
        v,
      );
    if (!flag) {
      if (callback)
        callback(
          new Error('\n' + '模版名称错误(2-30位,可包含中文,数字,字母,符号)'),
        );
    } else {
      callback();
    }
  },
  inventoryReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /^[\u4E00-\u9FA5a-zA-Z0-9]{2,40}$/.test(v);
    if (!flag) {
      if (callback)
        callback(
          new Error('\n' + '盘点单名称格式错误(2-40位,可包含中文,数字,字母)'),
        );
    } else {
      callback();
    }
  },
  nameReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{2,10}$/.test(
        v,
      );
    if (!flag) {
      if (callback) callback(new Error('2-10位,可包含中文,数字,字母,符号'));
    } else {
      callback();
    }
  },
  empPositionReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{2,20}$/.test(
        v,
      );
    if (!flag && v !== '') {
      if (callback) callback(new Error('2-20位,可包含中文,数字,字母,符号'));
    } else {
      callback();
    }
  },
  nameNoEmptyReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^[\u4E00-\u9FA5a-zA-Z0-9_`~!@#$%^&*()（）\-_+={[\]}?:;'"|<,.>/]{2,10}$/.test(
        v,
      );
    if (!flag && v !== '') {
      if (callback) callback(new Error('2-10位,可包含中文,数字,字母,符号'));
    } else {
      callback();
    }
  },
  LawfulReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /^[\da-zA-Z_]+$/.test(v);
    if (!flag) {
      if (callback)
        callback(new Error('填写内容只能由字母、数字、下划线组成!'));
    } else {
      callback();
    }
  },
  jobNumberReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /^[\da-zA-Z-]+$/.test(v);
    if (!flag) {
      if (callback)
        callback(new Error('填写内容只能由字母、数字、符号(-)组成!'));
    } else {
      callback();
    }
  },
  phoneReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /^1[3-9]\d{9}$/.test(v);
    if (!flag) {
      if (callback) callback(new Error('手机号格式不正确!'));
    } else {
      callback();
    }
  },
  phoneNoEmptyReg(_, value, callback) {
    const v = value.toString().trim();
    let flag = /^1[3-9]\d{9}$/.test(v);
    if (!flag && v !== '') {
      if (callback) callback(new Error('手机号格式不正确!'));
    } else {
      callback();
    }
  },
  verifyReg(_, value, callback) {
    // 验证码 4位
    const v = value.toString().trim();
    const flag = /^\d{4}$/gi.test(v);
    if (!flag) {
      if (callback) callback(new Error('验证码只能由数字组成'));
    } else {
      callback();
    }
  },
  notEmpty(_, value, callback) {
    const v = value.toString().trim();
    let flag = true;
    if (v.length < 1) {
      flag = false;
      if (callback) {
        if (callback) callback(new Error('填写内容不能为空!'));
      } else {
        callback();
      }
    } else {
      callback();
    }
    return flag;
  },
  withinST(_, value, callback) {
    // 6-20位置
    const v = value.toString().trim();
    let flag = true;
    if (v.length < 6 || v.length > 20) {
      flag = false;
      if (callback) {
        if (callback) callback(new Error('填写内容6-20位!'));
      } else {
        callback();
      }
    }
    return flag;
  },
  emailReg(_, value, callback) {
    const v = value.toString().trim();
    const flag =
      /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
        v,
      );
    if (!flag) {
      if (callback) callback(new Error('邮箱格式不正确!'));
    } else {
      callback();
    }
  },
  identityReg(_, value, callback) {
    const v = value.toString().trim();
    const flag = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v);
    if (!flag) {
      if (callback) callback(new Error('身份证号不合法!'));
    } else {
      callback();
    }
  },
  bankReg(_, value, callback) {
    const v = value.toString().trim();
    const strBank =
      '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99';
    let flag = true;
    if (!/^[0-9]{16,19}$/.test(v)) {
      flag = false;
      if (callback) callback(new Error('银行卡为16-19位的纯数字!'));
    } else if (strBank.indexOf(v.substring(0, 2)) === -1) {
      flag = false;
      if (callback) callback(new Error('银行卡号开头6位不符合规范!'));
    }
    return flag;
  },
  floatNum(_, value, callback) {
    //  输入内容为小数位不超过2位的数值
    const v = value.toString().trim();
    const flag = /^\d{0,10}\.{0,1}(\d{1,2})?$/.test(v);
    if (!flag) {
      if (callback) callback(new Error('请输入小数位不超过2位的数值!'));
    } else {
      callback();
    }
  },
};

export default customRegExp;
