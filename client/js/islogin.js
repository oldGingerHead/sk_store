// 判断是否登录
// 通过session进行判断
// 返回后台返回对象

define('islogin', ['jquery'], function ($) {
  return {
    islogin (fn) {
      $.ajax({
        async   : true,
        dataType: 'json',
        type    : 'post',
        url     : '../../server/islogin.php',
        success : function (res) {
          fn(res)
        }
      })
    }
  }
})
