var abc;
var boc;
var ccb;
var icbc;
var windows_height;
var windows_width;
var bank_zoom;
var distance = 30;
var radius; //图标距离圆心的半径
var bank_height;//银行建筑的高度
var bank_width;//银行建筑的宽度
var arrowTop;//两端箭头的top
$(document).ready(function () {
    //  console.log("execute begin");
    abc = $("#abc");
    bocom = $("#bocom");
    ccb = $("#ccb");
    icbc = $("#icbc");
    init();
});
function init() {
    windows_height = $(window).height();
    windows_width = $(window).width();
    bank_zoom = $("#bank").width();
    $("body").css({
        "height": windows_height,
        "width": windows_width
    });
    center("#logo");
    center("#inner");
    center("#outter");
    center("#bank");
    //把information放在上面
    $("#information").css({
        "position": "absolute",
        "left": (windows_width - $("#information").outerWidth()) / 2,
        "top": (-windows_height - $("#information").outerHeight()) / 2,
    });
    setbank();
}
//居中响应的div
function center(id) {
    $(id).css({
        "position": "absolute",
        "left": (windows_width - $(id).outerWidth()) / 2,
        "top": (windows_height - $(id).outerHeight()) / 2
    });
}

//设置银行图标位置
function setbank() {
    radius = abc.width() / 2 + distance + $("#inner").outerWidth() * 1.5 / 2;
    //console.log("radius is "+radius);
    abc.css({
        "position": "absolute",
        "left": bank_zoom/2 - radius -40 ,
        "top": bank_zoom / 2 -40
    });
    bocom.css({
        "position": "absolute",
        "left": bank_zoom/2 +radius - 40,
        "top": bank_zoom/2 - 40
    });
    ccb.css({
        "position": "absolute",
        "left": bank_zoom/2 - 40,
        "top": bank_zoom/2 - radius -40
    });
    icbc.css({
        "position": "absolute",
        "left": bank_zoom/2 - 40,
        "top": bank_zoom/2 + radius -40
    });
    setTimeout(function () { abc.fadeIn(700) }, 4000);
    setTimeout(function () { ccb.fadeIn(700) }, 4300);
    setTimeout(function () { bocom.fadeIn(700) }, 4600);
    setTimeout(function () { icbc.fadeIn(700) }, 4900);
    setTimeout("removeBuilding()", 5000);
}

function radians2degree(radians) {
    return (180 / Math.PI * radians);
}

function degree2radians(degree) {
    return (Math.PI / 180 * degree);
}
/*
abc是left top 定位
bocom是left bottom 定位
ccb是top right 定位
icbc是 bottom right 定位
*/
function removeBuilding() {
    bank_height = $("#abc_building").css("height").split("px")[0] * 1.0 ;
    bank_width = $("#abc_building").css("width").split("px")[0] * 1.0 ;
    var bankx;
    var banky;
    bankx = $("#abc_building").css("left").split("px")[0] * 1.0 ;
    banky = $("#abc_building").css("top").split("px")[0] * 1.0 ;
    $("#abc_bank").css({
        "top": banky,
        "left":bankx,
        "opacity": "1",
        "cursor":"pointer"
    });
    $("#abc_building").css({
        "display":"none"
    });
    bankx = $("#bocom_building").css("left").split("px")[0] * 1.0;
    banky = windows_height - $("#bocom_building").css("bottom").split("px")[0] * 1.0 - bank_height;
    $("#bocom_bank").css({
        "top": banky,
        "left": bankx,
        "opacity": "1",
         "cursor":"pointer"
    });
    $("#bocom_building").css({
        "display": "none"
    });
    bankx = windows_width - $("#ccb_building").css("right").split("px")[0] * 1.0 - bank_width;
    banky = $("#ccb_building").css("top").split("px")[0] * 1.0;
    $("#ccb_bank").css({
        "top": banky,
        "left": bankx,
        "opacity": "1",
        "cursor": "pointer"
    });
    $("#ccb_building").css({
        "display": "none"
    });
    bankx = windows_width - $("#icbc_building").css("right").split("px")[0] * 1.0 - bank_width;
    banky = windows_height - $("#icbc_building").css("bottom").split("px")[0] * 1.0 - bank_height;
    $("#icbc_bank").css({
        "top": banky,
        "left": bankx,
        "opacity": "1",
        "cursor": "pointer"
    });
    $("#icbc_building").css({
        "display": "none"

    });
}

