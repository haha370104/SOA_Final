var currentbankName;
var page;
var num = 0;
var baseurl = "http://0.0.0.0:8080";
var banktoid = {"icbc": 1, "abc": 2, "ccb": 3, "bocom": 4};
var mdata;
var wholepages;//记录页面的总数
var currentpage;//当前页
//获得服务器的数据
function GetList(ajaxid) {
    $.ajax({
        type: "GET",
        url: baseurl + "/bank/check_bank/" + ajaxid + "/",
        dataType: "json",
        async: true,
        success: function (num) {
            wholepages = Math.ceil(num.count * 1.0 / (windows_width / 200 * 2));
            $.ajax({
                type: "GET",
                url: baseurl + "/bank/get_records/" + ajaxid + "/1/" + num.count + "/",
                dataType: "json",
                async: true,
                success: function (data) {
                    setInfo(data, num.count);
                    if (wholepages > 1) {
                        setTimeout(function () {
                            var div = "#arrowRDiv";
                            showSingleArrow(div);
                        }, 300);
                    }
                },
                error: function () {
                    console.log("failed");
                }
            });

        },
        error: function () {
            console.log("failed");
        }
    });
}

//获得具体的产品信息
function GetDetail(id, ID) {
    $.ajax({
        type: "GET",
        url: baseurl + "/bank/get_detail/" + ID + "/",
        dataType: "json",
        async: true,
        success: function (data) {
            var info = data;
            showinformation(id, info.product_name, info.currenices, info.interest_rate,
                info.start_amount, info.duration, info.type, info.url);
            showBackArrow(id);
            var step = 60 / (time / 0.06);
            changeArrow(-step, 0);
        },
        error: function () {
            console.log("failed");
        }
    });
}

//准备信息的载体
function setInfo(data, number) {
    $("#info").css({
        "display": "block",
        "height": windows_height * 0.6,
        "width": windows_width,
        "top": (windows_height * 0.4 - 160),
        "left": windows_width
    });
    arrowTop = (windows_height - $("#arrowLDiv").outerHeight() * 2) / 2;
    //需要获得当前银行的总的产品数量
//    console.log("data is "+data[0]);
    for (var i = 0; i < number; i++) {
        setProduct(i, data[i].product_name, data[i].ID, data[i].rate);
    }
    var stepx = windows_width / (time / 0.03);
    setTimeout(function () {
        changePage(0, -stepx)
    }, 500);
    productPage = true;
    currentpage = 1;
    num = number;
}

//删除前一个银行的信息
function removeProduction() {
    for (var i = 0; i < num; i++) {
        $(("#" + i)).remove();
        //    console.log("remove #"+i);
    }
}

//加入农行产品的信息
function setProduct(number, Title, ID, Rate) {
    //整个项目的承载体
    var detial = $("<div></div>");
    detial.attr("id", number);
    detial.addClass("detailProduction");
    // console.log("top is " + ((parseInt(number / 7) * (184 + 70)) + (arrowTop - 184) - (windows_height * 0.4 - 160)));
    detial.css({
        "top": ((parseInt(number % 2) * (184 + 70)) + (arrowTop - 184) - (windows_height * 0.4 - 160)),
        "left": (parseInt(number / 2) * 200)
    });
    //理财产品的名称
    if (Title.length > 10) {
        Title = Title.substring(0, 9) + "...";
    }
    var detialTitle = $("<div>" + Title + "</div>");
    detialTitle.addClass("detailTitle");
    //理财产品的ID
    var detialSmallTitle = $("<div>" + ID + "</div>");
    detialSmallTitle.addClass("detailTitleS");
    detialSmallTitle.attr("id", "ID");
    //理财产品的利润
    var detialBalance = $("<div>" + Rate + "</div>");
    detialBalance.addClass("detailBanlance");
    var end = $("<div>预期年化收益率</div>");
    end.addClass("detailTitleS");
    detialTitle.appendTo(detial);
    detialSmallTitle.appendTo(detial);
    detialBalance.appendTo(detial);
    end.appendTo(detial);
    detial.appendTo("#info");
}

//点击按钮翻页查看理财产品
function changePage(change, stepx) {
    var position = $("#info").css("left").split("px")[0] * 1.0 + stepx;
    $("#info").css({
        "left": position + "px",
    });
    change = change + stepx;
    if (Math.abs(change) >= (windows_width / 2)) {
        if (stepx > 0) {//实现逐渐变慢
            stepx = stepx / (1.1) > 1 ? stepx / (1.1) : 1;
        } else {
            stepx = stepx / (1.1) < -1 ? stepx / (1.1) : -1;
        }
    }
    //console.log("change is " + change);
    //console.log("stepx is " + stepx);
    if (Math.abs(change) >= windows_width) {
        //console.log("change is " + change);
        //console.log("windows_width is "+windows_width);
    } else if (Math.abs(change + stepx) >= windows_width) {//最后一帧保证位置
        //   console.log("last frame");
        if (stepx > 0) {
            stepx = windows_width - change;
        } else {
            stepx = (windows_width - Math.abs(change)) * (-1);
        }
        setTimeout("changePage(" + change + "," + stepx + ")", 30);
    } else {
        setTimeout("changePage(" + change + "," + stepx + ")", 30);
    }
}

//初始化产品信息列表
function showinformation(id, Title, Currency, Rate, Startamount, Duration, Type, Url) {
    if ($("#show").length != 0) {
//        console.log("remove");
        $("#show").remove();
    }
    //    console.log("title is "+Title);
    var information_list = " <table id = \"show\" class=\"information_list\" cellspacing=\"0\" cellpadding=\"0\">" +
        "<tbody>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>产品名称</th>" +
        "<td style=\"background-color:#fafafa;\">" + Title + "</td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>币种</th>" +
        "<td>" + Currency + "</td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>收益率</th>" +
        "<td style=\"background-color:#fafafa;\">" + Rate + "</td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>起投金额</th>" +
        "<td>" + Startamount + "</td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>理财周期</th>" +
        "<td style=\"background-color:#fafafa;\">" + Duration + "</td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>是否保本</th>" +
        "<td>" + Type + "</td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "<tr>" +
        "<th>购买链接</th>" +
        "<td><a href=\"" + Url + "\" target=\"_blank\">点击购买</a></td>" +
        "</tr>" +
        "<tr><td colspan=\"2\" style=\"height:8px; background-color:#fff;\"></td></tr>" +
        "</tbody>" +
        "</table>";
    var list = $(information_list);
    var top = $(("#" + id)).position().top;
    //  console.log("top is " + top);
    var step;
    if (top < 200) {//在上半面
        $("#information").css({
            "position": "absolute",
            "left": (windows_width - $("#information").outerWidth()) / 2,
            "top": (windows_height - $("#information").outerHeight()) / 2 + windows_height,
        });
        step = -windows_height / (time / 0.03);
    } else {
        $("#information").css({
            "position": "absolute",
            "left": (windows_width - $("#information").outerWidth()) / 2,
            "top": (-windows_height - $("#information").outerHeight()) / 2,
        });
        step = windows_height / (time / 0.03);
    }
    list.appendTo("#information");
    changeProductInfomation("#info", "#information", step, 0);
}

function changeProductInfomation(List, Detial, stepy, change) {
    var newy = $(List).css("top").split("px")[0] * 1.0 + stepy;
    $(List).css({
        "position": "absolute",
        "top": newy,
    });
    //console.log("list top is " + newy);
    newy = $(Detial).css("top").split("px")[0] * 1.0 + stepy;
    $(Detial).css({
        "position": "absolute",
        "top": newy,
    });
    //console.log("detial top is " + newy);
    change = change + stepy;
    if (Math.abs(change) >= (windows_height / 2)) {
        if (stepy > 0) {//实现逐渐变慢
            stepy = stepy / (1.1) > 1 ? stepy / (1.1) : 1;
        } else {
            stepy = stepy / (1.1) < -1 ? stepy / (1.1) : -1;
        }
    }
    //console.log("change is " + change);
    if (Math.abs(change) >= windows_height) {
        //console.log("change is " + change);
        //console.log("windows_width is "+windows_width);
    } else if (Math.abs(change + stepy) >= windows_height) {//最后一帧保证位置
        //   console.log("last frame");
        if (stepy > 0) {
            stepy = windows_height - change;
        } else {
            stepy = (windows_height - Math.abs(change)) * (-1);
        }
        setTimeout("changeProductInfomation(\"" + List + "\",\"" + Detial + "\"," + stepy + "," + change + ")", 30);
    } else {
        setTimeout("changeProductInfomation(\"" + List + "\",\"" + Detial + "\"," + stepy + "," + change + ")", 30);
    }
}

//显示顶部返回
function showBackArrow(id) {
    $("#arrowBDiv").css({
        "display": "block",
        "top": -70,
        "left": (windows_width - $("#arrowBDiv").outerWidth()) / 2
    });
    var top = $(("#" + id)).position().top;
    var url;
    if (top > 200) {//列表将向下走
        url = "url(\"/static/image/" + currentbankName + "_arrowU.png\")";
    } else {
        url = "url(\"/static/image/" + currentbankName + "_arrowD.png\")";
    }
    $("#arrowB").css({
        "background-image": url
    });
    var step = 60 / (time / 0.06);
    changeBackArrow(step, 0);
}

function changeArrow(step, change) {
    var left = $("#arrowLDiv").position().left + step;
    $("#arrowLDiv").css({
        "position": "absolute",
        "left": left
    });
    left = $("#arrowRDiv").position().left - step;
    $("#arrowRDiv").css({
        "left": left
    });
    change = change + step;
    //console.log("change is " + change);
    if (Math.abs(change) >= 60) {
        //console.log("change is " + change);
        //console.log("windows_width is "+windows_width);
    } else if (Math.abs(change + step) >= 60) {//最后一帧保证位置
        //   console.log("last frame");
        if (step > 0) {
            step = 60 - change;
        } else {
            step = (60 - Math.abs(change)) * (-1);
        }
        setTimeout("changeArrow(" + step + "," + change + ")", 30);
    } else {
        setTimeout("changeArrow(" + step + "," + change + ")", 30);
    }
}

function changeSingleArrow(div, step, change) {
    var left = $(div).position().left + step;
    $(div).css({
        "position": "absolute",
        "left": left
    });
    change = change + step;
    //console.log("change is " + change);
    if (Math.abs(change) >= 60) {
        //console.log("change is " + change);
        //console.log("windows_width is "+windows_width);
    } else if (Math.abs(change + step) >= 60) {//最后一帧保证位置
        //   console.log("last frame");
        if (step > 0) {
            step = 60 - change;
        } else {
            step = (60 - Math.abs(change)) * (-1);
        }
        setTimeout("changeSingleArrow(\"" + div + "\"," + step + "," + change + ")", 30);
    } else {
        setTimeout("changeSingleArrow(\"" + div + "\"," + step + "," + change + ")", 30);
    }
}

function changeBackArrow(step, change) {
    var top = $("#arrowBDiv").position().top + step;
    $("#arrowBDiv").css({
        "position": "absolute",
        "top": top
    });
    change = change + step;
    //console.log("top is " + top);
    //console.log("change is " + change);
    if (Math.abs(change) >= 60) {
        //console.log("change is " + change);
        //console.log("windows_width is "+windows_width);
    } else if (Math.abs(change + step) >= 60) {//最后一帧保证位置
        //   console.log("last frame");
        if (step > 0) {
            step = 60 - change;
        } else {
            step = (60 - Math.abs(change)) * (-1);
        }
        setTimeout("changeBackArrow(" + step + "," + change + ")", 30);
    } else {
        setTimeout("changeBackArrow(" + step + "," + change + ")", 30);
    }
}

//单独显示左右切换箭头
function showSingleArrow(div) {
    var step;
    if (div == "#arrowRDiv") {
        $("#arrowRDiv").css({
            "display": "block",
            "top": (windows_height - $("#arrowRDiv").outerHeight() * 2) / 2,
            "left": windows_width
        });
        step = -60 / (time / 0.03);
    }

    if (div == "#arrowLDiv") {
        $("#arrowLDiv").css({
            "display": "block",
            "top": (windows_height - $("#arrowLDiv").outerHeight() * 2) / 2,
            "left": -70
        });
        step = 60 / (time / 0.03);
    }
    changeSingleArrow(div, step, 0);
}
