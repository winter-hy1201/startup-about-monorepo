export const validateIdCard = (id, rules) => {
  // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
  let format =
    /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(id)) {
    return { status: 0, msg: '身份证号码不合规' };
  }
  //区位码校验
  //出生年月日校验  前正则限制起始年份为1900;
  let year = id.substr(6, 4), //身份证年
    month = id.substr(10, 2), //身份证月
    date = id.substr(12, 2), //身份证日
    time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
    now_time = Date.parse(new Date()), //当前时间戳
    dates = new Date(year, month, 0).getDate(); //身份证当月天数
  if (time > now_time || date > dates) {
    return { status: 0, msg: '出生日期不合规' };
  }
  //校验码判断
  let c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
  let b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
  let id_array = id.split('');
  let sum = 0;
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    return { status: 0, msg: '身份证校验码不合规' };
  }
  if (rules == 'sexAge') {
    let d = new Date();
    let age = d.getFullYear() - year;
    let sexStr = '';
    if (parseInt(id.slice(-2, -1)) % 2 == 1) {
      sexStr = '0'; // 男
    } else {
      sexStr = '1'; // 女
    }
    if ((sexStr == '0' && age <= 55) || (sexStr == '1' && age <= 60)) {
      return { status: 1, msg: '校验通过' };
    } else {
      return { status: 0, msg: '性别年龄超出范围！' };
    }
  } else {
    return { status: 1, msg: '校验通过' };
  }
};
