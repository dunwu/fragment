/*************************************************************************************
 * 评论区 begin
 *************************************************************************************/
//添加 评论区的 形象照
function addImage() {
  var spen_html = "<span class='bot' ></span>\
                         <span class='top'></span>";
  $(".blog_comment_body").append(spen_html);

  $(".blog_comment_body").before("<div class='body_right' style='float: left;'><a target='_blank'><img  /></a></div>");
  var feedbackCon = $(".feedbackCon").addClass("clearfix");
  for (var i = 0; i < feedbackCon.length; i++) {
    var span = $(feedbackCon[i]).find("span:last")[0].innerHTML || "http://pic.cnitblog.com/face/sample_face.gif";
    $(feedbackCon[i]).find(".body_right img").attr("src", span);
    var href = $(feedbackCon[i]).parent().find(".comment_date").next().attr("href");
    $(feedbackCon[i]).find(".body_right a").attr("href", href);

  }
}
//移动一个单位 评论
function nextRecTop() {
  var rec = $("#RecentCommentsBlock");
  if (rec.length) {
    var top = rec.scrollTop();
    top++;
    rec.scrollTop(top);
    if (top != rec.scrollTop())
      rec.scrollTop(0);
  }
}
//移动评论
function MobileComment() {
  var RecCommentTime = 80;
  var RecintervalId = setInterval(function () {
    nextRecTop();
  }, RecCommentTime);

  $("#RecentCommentsBlock").hover(function () {//移进
    clearInterval(RecintervalId);
  }, function () {//移出
    RecintervalId = setInterval(function () {
      nextRecTop();
    }, RecCommentTime);
  });
}

//添加评论区 背景
function addtbCommentBody_bg() {
  var tbcomment = $("#tbCommentBody");
  if (!tbcomment.hasClass("tbCommentBody_bg")) {
    tbcomment.addClass("tbCommentBody_bg");
    tbcomment.focus(function () {
      removetbCommentBody_bg();
    });
  }
}

function focusoutCommentBody_bg() {
  $("#tbCommentBody").focusout(function () { addtbCommentBody_bg(); });
}
//移除评论区 背景
function removetbCommentBody_bg() {
  !$(".tbCommentBody_bg").removeClass("tbCommentBody_bg");
  $("#tbCommentBody").unbind("focus");
}
/*************************************************************************************
 * 评论区 end
 *************************************************************************************/

String.prototype.replaceAll = function (FindText, RepText) {
  regExp = new RegExp(FindText, 'gm');
  return this.replace(regExp, RepText);
}

/**
 * resolve the string to fit cnblog's rules
 */
function resolveTitle(title) {
  var result;
  result = title.replaceAll(' ', '-');
  result = result.replaceAll('\\(', '');
  result = result.replaceAll('\\)', '');
  result = result.replaceAll('（', '');
  result = result.replaceAll('）', '');
  result = result.toLowerCase();
  return result;
}
function GenerateContentList() {
  var nodes = $('#cnblogs_post_body :header');

  var content = '<a name="_labelTop"></a>';
  content += '<div id="navCategory">';
  content += '<p style="font-size: 18pt; color:#F89448"><b>目录</b></p>';
  content += '<ul>';

  for (var i = 0; i < nodes.length; i++) {
    var item = '';
    var originTitle = $(nodes[i]).text();
    var resolvedTitle = resolveTitle(originTitle);

    if (nodes[i].tagName === 'H1') {
      item = '<li><a style="font-size:18px" href="#' + resolvedTitle + '">' + $(nodes[i]).text() + '</a></li>';
    } else if (nodes[i].tagName === 'H2') {
      item = '<li><a style="font-size:16px" href="#' + resolvedTitle + '">&emsp;&emsp;' + $(nodes[i]).text() + '</a></li>';
    } else if (nodes[i].tagName === 'H3') {
      item = '<li><a style="font-size:14px" href="#' + resolvedTitle + '">&emsp;&emsp;&emsp;&emsp;' + $(nodes[i]).text() + '</a></li>';
    } else if (nodes[i].tagName === 'H4') {
      item = '<li><a style="font-size:12px" href="#' + resolvedTitle + '">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' + $(nodes[i]).text() + '</a></li>';
    }

    content += item;
  }
  content += '</ul>';
  var len = $('#cnblogs_post_body').length;
  if ($('#cnblogs_post_body').length != 0) {
    $($('#cnblogs_post_body')[0]).prepend(content);
  }

  $($('#cnblogs_post_body')[len - 1]).append('<div id=\'signature\'><p>作者：<a href=\'http://www.cnblogs.com/jingmoxukong/\'>静默虚空</a></br>欢迎任何形式的转载，但请务必注明出处。</br>限于本人水平，如果文章和代码有表述不当之处，还请不吝赐教。</p></div>');
}
GenerateContentList();

// 自定义定时器[当元素加载完成是执行回调函数]
function customTimer(inpId, fn) {
  if ($(inpId).length) {
    fn();
  }
  else {
    var intervalId = setInterval(function () {
      if ($(inpId).length) {  //如果存在了
        clearInterval(intervalId);  // 则关闭定时器
        customTimer(inpId, fn);              //执行自身
      }
    }, 100);
  }
}

// execute the func after the page have loaded
$(function () {
  customTimer('#div_digg', function () {
    var div_html = '<div class=\'\'>\
                        <a href=\'javascript:void(0);\' onclick=\'c_follow();\'>关注</a>\
                         &nbsp;|&nbsp;\
                        <a href=\'#top\'>顶部</a>\
                         &nbsp;|&nbsp;\
                        <a href=\'javascript:void(0);\' onclick=" $(\'#tbCommentBody\').focus();">评论</a>\
                   </div>';
    $('#div_digg').append(div_html);
    //tbCommentBody
  });

  //添加 评论区的 形象照
  MobileComment();//移动评论
  customTimer(".blog_comment_body", addImage);
  customTimer("#tbCommentBody", function () {
    addtbCommentBody_bg();
    focusoutCommentBody_bg();
  });
});
