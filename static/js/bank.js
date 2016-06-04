var rotation ;
var move;//点击菜单下降的距离
var time = 0.6;//设置动画移动时间
var detial = false;//第一次点击要下落按钮区域
var radius_change = 5;//每一帧半径的变化
var icon_radius = 40; //每一帧图标大小的变化
var icon_stop = false;//过渡按钮组旋转动画停止
var banks = ["#ccb_bank", "#bocom_bank", "#icbc_bank", "#abc_bank"];
var currentbank;//当前显示的银行的编号
var changebank = false;
var changeproduct = false;
var productPage = false;
$(function () {
    //点击银行图标进入不同的产品界面
    $(".icons").each(function () {
        $(this).click(function () {
            var id = $(this).attr("id");
            //          console.log("id is "+id);
            var ajaxid = eval("banktoid." + id);
      //      console.log("ajaxid is "+ajaxid);
            changebank = false;
            changeproduct = true;
            currentbankName = id;//abc
            if (detial) {//是否还是主页状态
                var step = 60 / (time / 0.06);
                changeArrow(-step, 0);
                if (productPage) {//银行产品界面之间的转换
                    if ($("#show").length != 0) {
                        //        console.log("remove");
                        $("#show").remove();
                    }
                    removeProduction();
                } else {//银行信息界面到产品界面的转换
                    bankToproduct();
                }
                GetList(ajaxid);
            } else {
                moveOtherBank("ALL");
                changestatus();
                GetList(ajaxid);

            }
        });
    });
    //点击“华”刷新主页
    $("#logo").click(function () {
        if (detial) {
            location.reload();
            detial = false;
            productPage = false;
        }
    })
    //点击银行建筑图片事件
    $(".banks").each(function () {
        $(this).click(function () {
            var id = $(this).attr("id");
            changeproduct = false;
            changebank = true;
            if (!detial) {
                getBankDetialInfo(("#"+id));
            }
        });
    });

    //跳转到对应的银行主页
    $(".goto").each(function () {
        $(this).click(function () {
            var id = $(this).attr("id");
            if (id == "goto_abc") {
                window.open("http://www.abchina.com/cn/");
            } else if (id == "goto_bocom") {
                window.open("http://www.bankcomm.com/BankCommSite/shtml/zonghang/cn/2971/list.shtml");
            } else if (id == "goto_ccb") {
                window.open("http://www.ccb.com/cn/home/indexv3.html");
            } else if (id == "goto_icbc") {
                window.open("http://www.icbc.com.cn/icbc/");
            }
        });
    });

    $(document).on("click", ".detailProduction", function (e) {
        var id = $(this).attr("id");
      //  console.log("id is " + id);
        var ID = $(("#"+id)).children("#ID").text();
        GetDetail(id,ID);
    });

    $("#arrowR").click(function () {
        if (changebank) {//转换银行信息
             changeNext();
        }

        if (changeproduct) {//转换理财产品
            var stepx = windows_width / (time / 0.03);
            changePage(0,-stepx);
            currentpage ++;
            if(currentpage == 2){
            	showSingleArrow("#arrowLDiv");
            }
            if(currentpage == wholepages){
            	step = 60 / (time / 0.03);
                changeSingleArrow("#arrowRDiv",step, 0);
            }
        }
       
    });

    $("#arrowL").click(function () {
        if (changebank) {
            changeLast();
        }
        if (changeproduct) {
            var stepx = windows_width / (time / 0.03);
            changePage(0, stepx);
            currentpage --;
            if(currentpage == 1){
            	step = -60 / (time / 0.03);
                changeSingleArrow("#arrowLDiv",step, 0);
            }
            if(currentpage == (wholepages - 1)){
            	//console.log("show right");
            	showSingleArrow("#arrowRDiv");
            }
        }
    });
    //由具体信息界面返回到产品列表界面
    $("#arrowB").click(function () {
        var top = $("#info").position().top;
        var step;
        if (top < 0) {//当前列表在上面
            step = windows_height / (time / 0.03);
        } else {
            step = -windows_height / (time / 0.03);
        }
        changeProductInfomation("#info", "#information", step, 0);
        console.log("currentpage is "+currentpage);
        if(wholepages<=1){
        	
        }else if(currentpage == wholepages){
        	showSingleArrow("#arrowLDiv")
        }else if(currentpage == 1){
        	showSingleArrow("#arrowRDiv")
        }else{
        	showArrow();	
        }
        var step = 60 / (time / 0.06);
        changeBackArrow(-step, 0);
    });
});


function changestatus() {
    //按钮区域平移下降
    detial = true;
    changey = (windows_height - 100 - ($("#inner").css("top").split("px")[0]) * 1.0) / (time / 0.03);
    $("#logo").css({
        "cursor": "pointer"
    });
    changeypostion();
    changeicons();
   // moveOtherBank("ALL");
   // showArrow();
}
//改变按钮组的位置
function changeypostion() {
    //目标减到环形圆球的半径是80 之前是440所以每一帧变化是16 半径每帧变化是8
    var newwidth = ($("#bank").css("width").split("px")[0]) * 1.0 - radius_change*2;
    var newy = $("#bank").position().top + changey + radius_change;
    var newx = ($("#bank").css("left").split("px")[0]) * 1.0 + radius_change;
    if (!icon_stop) {
        radius = radius - radius_change;
        icon_radius = icon_radius - 1;
        //console.log("radius is " + radius);
        //console.log("width is " + newwidth);
        $("#bank").css({
            "top": newy + "px",
            "left": newx + "px",
            "width": newwidth + "px",
            "height": newwidth + "px"
        });
        iconSize(abc);
        iconSize(bocom);
        iconSize(ccb);
        iconSize(icbc);
    }
    newy = ($("#inner").css("top").split("px")[0]) * 1.0 + changey;
    newx = ($("#inner").css("left").split("px")[0]) * 1.0 + 3;
    newwidth = ($("#inner").css("width").split("px")[0]) * 1.0 -6;
    $("#inner").css({
        "top": newy + "px",
        "left":newx + "px",
        "width": newwidth + "px",
        "height":newwidth + "px"
    });
    newy = ($("#logo").css("top").split("px")[0]) * 1.0 + changey - 1.5;
    newx = ($("#logo").css("left").split("px")[0]) * 1.0 + 1.5;
    newwidth = ($("#logo").css("width").split("px")[0]) * 1.0 - 3;
    $("#logo").css({
        "top": newy + "px",
        "left": newx + "px",
        "width": newwidth + "px",
        "height": newwidth + "px"
    });
    //console.log("newy is "+newy);
    if (newy < (windows_height - 80)) {
        setTimeout(changeypostion, 30);
    }
}
//改变银行图标的大小
function iconSize(id) {
    var newwidth = ($(id).css("width").split("px")[0]) * 1.0 - 2;
    $(id).css({
        "width": newwidth + "px",
        "height": newwidth + "px"
    });
}
//改变按钮组内部银行图标的圆周运动
function changeicons() {
    // radius is 220
  
    //银行图片的旋转
    var angles = targetangle();
    //abc的位置变化
    var abc_step = (angles[0] - 180) / (time / 0.03);
    changeIcon(0, angles[0],180,abc_step,"abc");
    //icbc的位置变化
    var icbc_step = (angles[1] - 90) / (time / 0.03);
    changeIcon(0, angles[1], 90, icbc_step, "icbc");
    //bocom的位置变化
    var bocom_step = (angles[2] - 0) / (time / 0.03);
    changeIcon(0, angles[2], 0, bocom_step, "bocom");
    //ccb的位置变化
    var ccb_step = (angles[3] + 90) / (time / 0.03);
    //console.log("target ccb is " + angles[3]);
    //console.log("change ccb is " + abc_step);
    changeIcon(0, angles[3], -90, ccb_step, "ccb");
}
//改变银行图标的位置
function changeIcon(change,target,origin,step,name) {
    change = change + step;
    if (change > (target - origin)) {//处理最后一帧的位置
        var currentx = radius + Math.cos(degree2radians(target-origin)) * Math.cos(degree2radians(origin)) * radius - Math.sin(degree2radians(target-origin)) * Math.sin(degree2radians(origin)) * radius - icon_radius;
        var currenty = radius + Math.sin(degree2radians(origin)) * Math.cos(degree2radians(target - origin)) * radius + Math.cos(degree2radians(origin)) * Math.sin(degree2radians(target - origin)) * radius - icon_radius;
        var execute = name + ".css({\"position\": \"absolute\", \"left\": " + currentx + ", \"top\": " + currenty + " });";
   //     console.log(name + "stop radius is " + radius + " icon_radius is " + icon_radius);
        icon_stop = true;
        eval(execute);
    } else {
        var currentx = radius + Math.cos(degree2radians(change)) * Math.cos(degree2radians(origin)) * radius - Math.sin(degree2radians(change)) * Math.sin(degree2radians(origin)) * radius - icon_radius;
        var currenty = radius + Math.sin(degree2radians(origin)) * Math.cos(degree2radians(change)) * radius + Math.cos(degree2radians(origin)) * Math.sin(degree2radians(change)) * radius - icon_radius;
        var execute = name + ".css({\"position\": \"absolute\", \"left\": " + currentx + ", \"top\": " + currenty + " });";
        // console.log(execute);
        eval(execute);
  //     console.log("changeIcon(" + change + "," + target + "," + origin + "," + step + ", \"" + name + "\")");
       setTimeout("changeIcon("+change+","+target+","+origin+","+step+",\""+name+"\")", 30);
    }
}
//极端银行图标的目标角度
function targetangle() {
    var abc_angle = parseInt(radians2degree(Math.atan(-40 / radius))) + 360;
 //   console.log("angle is " + parseInt(radians2degree(Math.atan(-40 / radius))));
    var icbc_angle = 315;
    var bocom_angle = 225;
    var ccb_angle = 180 - parseInt(radians2degree(Math.atan(-40 / radius)));
    return [abc_angle, icbc_angle,bocom_angle,ccb_angle];
}

//获取银行的介绍信息
function getBankDetialInfo(id) {
    var bankx = $(id).css("left").split("px")[0] * 1.0;
    var banky = $(id).css("top").split("px")[0] * 1.0;
    var targety = (windows_height - bank_height * 1.5) / 2 - 50;
    //console.log("windows_height : " + windows_height);
    //console.log("bank_height : " + bank_height);
    var targetx;
    var isRight;//判断银行图片的位置
    if (bankx < windows_width / 2) {//图片在屏幕的左侧
        isRight = false;
        targetx = (windows_width / 2 - bank_width * 1.5) / 2;
    } else {
        isRight = true;
        targetx = windows_width - (windows_width / 2 - bank_width * 1.5) / 2 - bank_width*1.5;
    }
    stepx = (targetx - bankx) / (time / 0.03);
    stepy = (targety - banky) / (time / 0.03);
    stepw = (bank_width * 0.5) / (time / 0.03);
    steph = (bank_height * 0.5) / (time / 0.03);
 //   console.log("stepx : " + stepx);
 //   console.log("stepy : " + stepy);
    //console.log("targetw : " + bank_height*1.5);
    //console.log("targeth : " + bank_width*1.5); //#abc_bank
    var image = "url(\"image/" + id.split("#")[1].split("_")[0] + "_building_after.png\")";
  //  console.log("image is " + image);
    $(id).css({
        "background-image": image,
        "cursor":"auto"
    });
    changeBankSatus(id, stepx, stepy, stepw, steph, bank_width * 1.5);
    changestatus();
    moveOtherBank(id);
    var info = id.split("_")[0] + "_info";
    //console.log("info is " + info);
    bankInfo(info, targetx, targety, bank_width * 1.5, bank_height * 1.5, isRight);
    var go = "#goto_" + id.split("#")[1].split("_")[0];
 //   console.log("goto is " + go);
    gotoBank(go);
    showArrow();
}

//扩展点击银行的信息

function changeBankSatus(id, stepx, stepy, stepw, steph, targetw) {
    var new_bank_height = $(id).css("height").split("px")[0] * 1.0 + steph;
    var new_bank_width = $(id).css("width").split("px")[0] * 1.0 + stepw;
    var new_bankx;
    var new_banky;
    new_bankx = $(id).css("left").split("px")[0] * 1.0 + stepx;
    new_banky = $(id).css("top").split("px")[0] * 1.0 + stepy;

    $(id).css({
        "position": "absolute",
        "top": new_banky + "px",
        "left":new_bankx + "px",
        "width": new_bank_width + "px",
        "height": new_bank_height + "px"
    });
    if (targetw > new_bank_width) {
        setTimeout("changeBankSatus(\""+id+"\","+stepx+","+stepy+","+stepw+","+steph+","+targetw+")",30);
    }
}
//页面中移除其他的银行图片
function moveOtherBank(currentid) {
    for (var i = 0; i < 4; i++) {
        if (currentid != banks[i]) {
            id = banks[i];
  //          console.log("id is "+id);
            var banky = $(id).position().top;
            var targety;
            if (banky < windows_height / 2) {//改图片在屏幕的上侧
 //               console.log("top");
                targety = -200;
            } else {
 //               console.log("bottom");
                targety = windows_height;
            }
            stepy = (targety - banky) / (time / 0.06);
 //           console.log("targety is "+targety+" banky is "+banky+" stepy is " + stepy);
            moveOthers(id, stepy, targety);
        }else{
            currentbank = i;
        }
    }
}

function moveOthers(id, stepy,targety) {
    var new_banky = $(id).position().top + stepy;
    $(id).css({
        "position": "absolute",
        "top": new_banky + "px",
    });
    if ((new_banky > windows_height) || (new_banky <-200)) {
       
    } else {
        setTimeout("moveOthers(\"" + id + "\"," + stepy + "," + targety + ")", 30);
    }
}

//显示银行的具体信息
function bankInfo(id,targetx,targety,width,height,isRight) {
    var top = targety;
    var left;
    if (isRight) {
        //console.log("on the left")
        //console.log("target is " + targetx);
        left = targetx - 100 - 470 ;
    } else {
        //console.log("on the right")
        left = targetx + width + 100;
    }
    //console.log("left is "+left);
    $(id).css({
        "position": "absolute",
        "top": top + "px",
        "left": left + "px"
    });
    setTimeout(function(){$(id).fadeIn(400)},200);
}

//显示跳转到主页控件
function gotoBank(id) {
    $(id).css({
        "position": "absolute",
        "left": (windows_width - $(id).outerWidth()) / 2,
        "top": -80
    });
    var stepy = 80 / (time / 0.06);
    animationGotoBank(id,stepy);
}

function animationGotoBank(id,stepy) {
    var new_banky = $(id).css("top").split("px")[0] * 1.0 + stepy;
    $(id).css({
        "position": "absolute",
        "top": new_banky + "px",
    });
    if (new_banky < -2) {
        setTimeout("animationGotoBank(\"" + id + "\"," + stepy + ")", 30);
    }
}

//显示左右切换箭头
function showArrow(){
    $("#arrowRDiv").css({
        "display":"block",
        "top": (windows_height - $("#arrowRDiv").outerHeight() * 2) / 2,
        "left": windows_width 
    });

    $("#arrowLDiv").css({
        "display": "block",
        "top": (windows_height - $("#arrowLDiv").outerHeight() * 2) / 2,
        "left": -70
    });
    var step = 60 / (time / 0.03);
    changeArrow(step, 0);
}

//点击切换箭头切换银行
function changeNext() {
    console.log("changenext");
    var nextid = (currentbank + 1) > 3 ? 0 : (currentbank + 1);
    var next = banks[nextid];
    var params = initPosition(next, true);//返回当前图片id 信息id 下一个信息id
    var step = windows_width / (time / 0.06);
 //   console.log(params[0] + "," + params[1]+","+params[2]);
    changebankinfoanimation(params[0], params[1], step,step, 0);
    changebankinfoanimation(next, params[2], step,step ,0);
    changeGotoBank(params[0], next);
    currentbank = nextid;

}

function changeLast() {
    var lastid = (currentbank - 1) < 0 ? 3 : (currentbank - 1);
    var last = banks[lastid];
    var params = initPosition(last, false);//返回当前图片id 信息id 下一个信息id
    var step = windows_width / (time / 0.06) * (-1);
    changebankinfoanimation(params[0], params[1], step, step, 0);
    changebankinfoanimation(last, params[2], step, step, 0);
    changeGotoBank(params[0], last);
    currentbank = lastid;
}

//初始化下一个播放的图片和文字
function initPosition(id, isnext) {
    var current = banks[currentbank];
    var topP = $(current).css("top").split("px")[0] * 1.0;
    var leftP = $(current).css("left").split("px")[0] * 1.0;
    //console.log("Pic left is " + topP );
    //console.log("Info left is " + leftP);
    var currentinfo = current.split("_")[0] + "_info";
    var topI = $(currentinfo).css("top").split("px")[0] * 1.0;
    var leftI = $(currentinfo).css("left").split("px")[0] * 1.0;
    var info = id.split("_")[0] + "_info";
    var image = "url(\"image/" + id.split("#")[1].split("_")[0] + "_building_after.png\")";
    if (isnext) {//如果是下一个的话，则初始位置定在左边
        $(id).css({
            "top":topP,
            "left": (leftP - windows_width),
            "height":(bank_height*1.5),
            "width":(bank_width*1.5),
            "background-image": image,
            "cursor": "auto"
        });

        $(info).css({
            "top": topI,
            "left": (leftI - windows_width),
            "display":"block"
        });
        //console.log("init top is " + topP);
        //console.log("init left is " + (leftP - windows_width));
        //console.log("target left is " + leftP);
    } else {//如果是上一个的话，则初始位置在右边
        $(id).css({
            "top": topP,
            "left": (leftP + windows_width),
            "height": (bank_height * 1.5),
            "width": (bank_width * 1.5),
            "background-image": image,
            "cursor": "auto"
        });

        $(info).css({
            "top": topI,
            "left": (leftI + windows_width),
            "display": "block"
        });
        //console.log("init left is " + topP);
        //console.log("init left is " + (leftP + windows_width));
        //console.log("target left is " + leftP);
    }
    return [current, currentinfo, info];
}

function changebankinfoanimation(Pic,Info,stepxP,stepxI,change) {
    //console.log("move");
    //console.log("curx is " + $(Pic).css("left").split("px")[0] * 1.0);
    //console.log("change is " + change);
    //console.log("stepx is " + stepx);
    var new_bankx = $(Pic).css("left").split("px")[0] * 1.0 + stepxP;
    $(Pic).css({
        "position": "absolute",
        "left": new_bankx + "px",
    });
    new_bankx = $(Info).css("left").split("px")[0] * 1.0 + stepxI;
    $(Info).css({
        "position": "absolute",
        "left": new_bankx + "px",
    });
    change = change + stepxP;
    if (Math.abs(change) >= (windows_width/2)) {
        if (stepxP > 0) {//实现逐渐变慢
            stepxP = stepxP / (1.1) > 1 ? stepxP / (1.1) : 1;
        } else {
            stepxP = stepxP / (1.1) < -1 ? stepxP / (1.1) : -1;
        }

        if (stepxI > 0) {//实现逐渐变慢
            stepxI = stepxI / (1.1) > 1 ? stepxI / (1.1) : 1;
        } else {
            stepxI = stepxI / (1.1) < -1 ? stepxI / (1.1) : -1;
        }
    }
    //console.log("change is " + change);
    //console.log("stepx is " + stepx);
    if (Math.abs(change) >= windows_width) {
        //console.log("change is " + change);
        //console.log("windows_width is "+windows_width);
    } else if (Math.abs(change + stepxP) >= windows_width) {//最后一帧保证位置
        //   console.log("last frame");
        if (stepxP > 0) {
              stepxP = windows_width - change;
        } else {
              stepxP = (windows_width - Math.abs(change))*(-1);
        }
        if (stepxI > 0) {
            stepxI = windows_width - change;
        } else {
            stepxI = (windows_width - Math.abs(change)) * (-1);
        }
        setTimeout("changebankinfoanimation(\"" + Pic + "\",\"" + Info + "\"," + stepxP+","+stepxI + "," + change + ")", 30);
    } else {
        setTimeout("changebankinfoanimation(\"" + Pic + "\",\""+Info+"\","+ stepxP+","+stepxI + "," + change + ")", 30);
    }
}

//切换去往银行主页按钮
function changeGotoBank(current,next) {
    var currentgoto = "#goto_" + current.split("#")[1].split("_")[0];
    var nextgoto = "#goto_" + next.split("#")[1].split("_")[0];
 //   console.log("currentgoto is " + currentgoto + " and nextgoto is " + nextgoto)
    var stepy = -80 / (time / 0.06);
    animationGotoBankBack(currentgoto, stepy);
    setTimeout(function () { gotoBank(nextgoto); }, 300);
}
//收回那个跳转按钮
function animationGotoBankBack(id, stepy) {
    var new_banky = $(id).css("top").split("px")[0] * 1.0 + stepy;
    $(id).css({
        "position": "absolute",
        "top": new_banky + "px",
    });
    if (new_banky > -80) {
        setTimeout("animationGotoBankBack(\"" + id + "\"," + stepy + ")", 30);
    }
}

//银行界面跳转到产品界面
function bankToproduct() {
    var current = banks[currentbank];
    var currentinfo = current.split("_")[0] + "_info";
    var bankx = $(current).css("left").split("px")[0] * 1.0;
    var stepx;
    if (bankx > (windows_width / 2)) {//图片在右边
        stepx = windows_width / (time / 0.03);
    } else {
        stepx = -windows_width / (time / 0.03);
    }
    changebankinfoanimation(current, currentinfo, stepx, -stepx, 0);
    var stepy = -80 / (time / 0.06);
    var currentgoto = "#goto_" + current.split("#")[1].split("_")[0];
    animationGotoBankBack(currentgoto, stepy);
}
