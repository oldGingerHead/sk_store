//购物车模块
/**
 *
 * 判断是否登录--> 显示不同模块
 * 登录了-->从数据库速度数据显示到页面
 * 没登录-->从cookie读取数据显示到页面
 *
 * 点击提交发现没登录-->要求登录
 *
 * 没登录时提示登录,如果在此页面进行登录,需要将cookie中数据合并到数据库中-->然后从数据库读取数据
 * 后台需要一个根据用户id返回购物车数据的接口
 */

define("cart", ["jquery", "query_product", "cookie"], function ($, qp, cok) {
    let self = null;
    let status = JSON.parse(sessionStorage.getItem("userinfo")); //获取sessionStorage信息 -->用户信息

    function Cart() {
        self = this;
    }
    //页面数据加载模块
    //判断是否登录
    Cart.prototype.cart = function () {
        //读取cookie
        let c_cok = JSON.parse($.cookie("cart") || "[]");
        // let status = JSON.parse(sessionStorage.getItem("userinfo")); //获取sessionStorage信息 -->用户信息
        //判断是否登录
        if (status != null) {
            //登录了--cookie中有数据和没有数据  数据库中有数据和没数据
            if (c_cok.length == 0) {
                //登录了 cookie没数据-->加载数据库数据
                $.ajax({
                    type: "post",
                    url: "http://127.0.0.1/1000phone/sk/project/server/query_cart.php",
                    data: {
                        u_id: status.data.u_id,
                    },
                    dataType: "json",
                    success: function (res) {
                        if (res != []) { //如果登录了 数据库中有数据
                            $("#sk_cart_content > div.inner").addClass("hide")
                            $("#sk_cart_content > div.inner").removeClass("show")
                            $("#sk_cart_content > div.cart").addClass("show");
                            $("#sk_cart_content > div.cart").removeClass("hide");
                            res.forEach((ele, index) => {
                                // console.log(ele)
                                loading(ele.p_id, ele.p_num)
                            });
                        } else { //如果登录了,数据库中没数据
                            $("#sk_cart_content > div.inner").addClass("show")
                            $("#sk_cart_content > div.inner").removeClass("hide")

                            $("#sk_cart_content > div.cart").addClass("hide");
                        }
                    }
                })
            } else {
                //登录了  cookie中有数据-->同步到数据中 然后进行显示
                //读取sessionStorage->获取u_ip  (JSON.parse(status)).data.u_id
                let userinfo = sessionStorage.getItem("userinfo")
                // 遍历cookie 获取信息
                c_cok.forEach((ele, index) => {
                    $.ajax({
                        url: "http://127.0.0.1/1000phone/sk/project/server/addCart.php",
                        type: "post",
                        data: {
                            p_id: ele.p_id,
                            u_id: (status).data.u_id,
                            p_num: ele.num,
                        }
                    }).then(function (res) {
                        if (res.status == 200) {
                            // 同步到数据库成功-->删除cookie
                            $.cookie("cart", null, {
                                expires: -1
                            })
                            // 并且刷新页面
                            window.location.reload()
                        }
                    })
                });
            }
        } else {
            //没登录--cookie中有数据和没有数据
            if (c_cok.length == 0) {
                //cookie没有数据-->显示空空如也
                $("#sk_cart_content > div.inner").addClass("show")
                $("#sk_cart_content > div.inner").removeClass("hide")

                $("#sk_cart_content > div.cart").addClass("hide");
            } else {
                //cookie有数据-->遍历取出
                c_cok.forEach((ele, index) => {
                    loading(ele.p_id, ele.num);
                });
            }
        }
    };

    //核心功能-->根据状态与cookie、数据库对页面数据进行渲染
    // (function () {
    //     //读取cookie
    //     let c_cok = JSON.parse($.cookie("cart") || "[]");
    //     // let status = JSON.parse(sessionStorage.getItem("userinfo")); //获取sessionStorage信息 -->用户信息
    //     //判断是否登录
    //     if (status != null) {
    //         //登录了--cookie中有数据和没有数据  数据库中有数据和没数据
    //         if (c_cok.length == 0) {
    //             //登录了 cookie没数据-->加载数据库数据
    //             $.ajax({
    //                 type: "post",
    //                 url: "http://127.0.0.1/1000phone/sk/project/server/query_cart.php",
    //                 data: {
    //                     u_id: status.data.u_id,
    //                 },
    //                 dataType: "json",
    //                 success: function (res) {
    //                     if (res != []) { //如果登录了 数据库中有数据
    //                         $("#sk_cart_content > div.inner").addClass("hide")
    //                         $("#sk_cart_content > div.inner").removeClass("show")
    //                         $("#sk_cart_content > div.cart").addClass("show");
    //                         $("#sk_cart_content > div.cart").removeClass("hide");
    //                         res.forEach((ele, index) => {
    //                             // console.log(ele)
    //                             loading(ele.p_id, ele.p_num)
    //                         });
    //                     } else { //如果登录了,数据库中没数据
    //                         $("#sk_cart_content > div.inner").addClass("show")
    //                         $("#sk_cart_content > div.inner").removeClass("hide")

    //                         $("#sk_cart_content > div.cart").addClass("hide");
    //                     }
    //                 }
    //             })
    //         } else {
    //             //登录了  cookie中有数据-->同步到数据中 然后进行显示
    //             //读取sessionStorage->获取u_ip  (JSON.parse(status)).data.u_id
    //             let userinfo = sessionStorage.getItem("userinfo")
    //             // 遍历cookie 获取信息
    //             c_cok.forEach((ele, index) => {
    //                 $.ajax({
    //                     url: "http://127.0.0.1/1000phone/sk/project/server/addCart.php",
    //                     type: "post",
    //                     data: {
    //                         p_id: ele.p_id,
    //                         u_id: (status).data.u_id,
    //                         p_num: ele.num,
    //                     }
    //                 }).then(function (res) {
    //                     if (res.status == 200) {
    //                         // 同步到数据库成功-->删除cookie
    //                         $.cookie("cart", null, {
    //                             expires: -1
    //                         })
    //                         // 并且刷新页面
    //                         window.location.reload()
    //                     }
    //                 })
    //             });
    //         }
    //     } else {
    //         //没登录--cookie中有数据和没有数据
    //         if (c_cok.length == 0) {
    //             //cookie没有数据-->显示空空如也
    //             $("#sk_cart_content > div.inner").addClass("show")
    //             $("#sk_cart_content > div.inner").removeClass("hide")

    //             $("#sk_cart_content > div.cart").addClass("hide");
    //         } else {
    //             //cookie有数据-->遍历取出
    //             c_cok.forEach((ele, index) => {
    //                 loading(ele.p_id, ele.num);
    //             });
    //         }
    //     }
    // })();

    // 点击结算判断是否登录
    (function () {
        $("#sk_cart_content > div.cart > div.cartprice > p > a").on("click", function () {
            if (status == null) {
                alert("请先登录")
                window.location = ("../html/login.html");
            } else {
                alert("大吉大利,今晚吃鸡~")
            }
        })
    })();

    //根据产品id返回对象商品信息并加载到页面
    function loading(p_id, num) {
        qp.query_p(p_id, function (res) {
            // p_id: 1, p_name: "Swarovski/施华洛世奇SWAN LAKE 链坠 项链 SWK-5169080 SE", p_price: "599", p_imgs: "../img/goods/cs_01.jpg"
            let product_content = `
            <tr>
                <td>
                    <input type="checkbox">
                </td>
                <td width="97">
                    <img width=90 src="${res[0].p_imgs}" alt="">
                </td>
                <td class="p_name">${res[0].p_name}</td>
                <td class="p_price">${res[0].p_price}</td>
                <td class="p_num"><input type=button class="sub" value=-><input type=text class=num value=${num}><input type=button class="add" value=+></td>
                <td class="price">${num*res[0].p_price}</td>
                <td><a href="#" class="del">删除</a></td>
            </tr>
            `
            $('#sk_cart_content > div.cart > div.product_list > table > tbody').append(product_content);
        })
    }

    //页面交互模块
    //全选与全不选-->计算金额
    (function () {
        // $("#sk_cart_content > div.cart > div.product_list > table > thead > tr > th:nth-child(1) > input").prop("che")
        //console.log($("#sk_cart_content > div.cart > div.product_list > table > thead > tr > th:nth-child(1) > input").prop("checked"));
        $("#sk_cart_content > div.cart > div.product_list > table > thead > tr > th:nth-child(1) > input").on("click", function () {
            //全选和全不选
            $("[type=checkbox]").prop("checked", $(this).prop("checked"))
            //计算金额
            if ($(this).prop("checked") == true) {
                $("#cartprice").html(money())
            } else {

                $("#cartprice").html(0)
            }


        })
    })();

    //删除选中商品功能
    (function () {
        $('#sk_cart_content > div.cart > div.cartprice > p:nth-child(1) > a').on('click', function () {
            let p_checked = $("#sk_cart_content > div.cart > div.product_list > table > tbody > tr [type=checkbox]"); //所有商品的input
            jQuery.each(p_checked, function (index, val) { //jq遍历对象
                if ($(val).prop("checked")) {
                    $(this).parents("tr").remove(); //-->页面删除
                    $("thead [type=checkbox]").prop("checked", false);
                    $("#cartprice").html(money())
                };
            });
        })
    })();

    //事件委托-->计算金额
    //给所有选择框冒泡点击事件 计算金额
    (function () {
        $("table").on("click", $("tbody [type=checkbox]"), function (e) {
            autocheck();
            if ($(e.target).attr("type")) {
                $("#cartprice").html(money())
            }
        })
    })();

    //点击加减改变数量与金额
    (function () {
        $("#sk_cart_content > div.cart > div.product_list > table > tbody > tr > td.p_num > input[type=button]:nth-child(1)").click(function () {
            console.log(111)
        })
        $("tbody").on("click", $("tbody [type=button]"), function (e) {
            let num = $("tbody input.num").val();
            if ($(e.target).attr("class") == "sub") {
                $(e.target).parents("tr").find("[type=checkbox]").prop("checked", true)
                if (num >= 1) {
                    num -= 1
                } else {
                    num = 0
                }
                if (num == 0) {
                    $(e.target).parents("tr").find("[type=checkbox]").prop("checked", false)
                }
                $("tbody input.num").val(num);
                $("tbody td.price").html(num * $("tbody td.p_price").html());
                $("#cartprice").html(money());
            } else if ($(e.target).attr("class") == "add") {
                $(e.target).parents("tr").find("[type=checkbox]").prop("checked", true)
                num++
                $("tbody input.num").val(num);
                $("tbody td.price").html(num * $("tbody td.p_price").html());
                $("#cartprice").html(money());
            }
        })
    })();

    //计算金额-->功能函数
    function money() {
        //总金额-->拿到所有选中的商品-->遍历计算价格
        // let tr = $("#sk_cart_content > div.cart > div.product_list > table > tbody > tr > td.price");
        let p_checked = $("#sk_cart_content > div.cart > div.product_list > table > tbody > tr [type=checkbox]"); //所有商品的input
        let money = 0;
        jQuery.each(p_checked, function (index, val) { //jq遍历对象
            if ($(val).prop("checked")) {
                money += $(val).parents("tr").find(".price").text() - 0;
            };
        });
        return money
    };

    // 单行删除功能
    (function remove() {
        $("table").on("click", $("tbody .del"), function (e) {
            if ((e.target) == $(".del")[0]) {
                //事件委托中的this需要通过事件对象来获得
                $(e.target).parent("td").parents("tr").remove();
                return false
            }
        })
    })();

    //自动全选功能
    function autocheck() {
        let input = $("tbody [type=checkbox]");
        let flag = true;
        $.each(input, function (index, ele) {
            if ($(ele).prop("checked") != true) {
                flag = false;
            }
        })
        if (flag) {
            $("thead [type=checkbox]").prop("checked", true);
        } else {
            $("thead [type=checkbox]").prop("checked", false);
        }
    };

    let cart = new Cart();
    return cart
})