String.prototype.replaceAll = function (FindText, RepText) {
    regExp = new RegExp(FindText, "gm");
    return this.replace(regExp, RepText);
}

/**
 * resolve the string to fit cnblog's rules
 */
function resolveTitle(title) {
    var result;
    result = title.replaceAll(" ", "-");
    result = result.replaceAll("\\(", "");
    result = result.replaceAll("\\)", "");
    result = result.replaceAll("（", "");
    result = result.replaceAll("）", "");
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
        var item = "";
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

    $($('#cnblogs_post_body')[len - 1]).append("<div id='signature'><p>作者：<a href='http://www.cnblogs.com/jingmoxukong/'>静默虚空</a></br>欢迎任何形式的转载，但请务必注明出处。</br>限于本人水平，如果文章和代码有表述不当之处，还请不吝赐教。</p></div>");
}
GenerateContentList();

// timer
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
    customTimer("#div_digg", function () {
        var div_html = "<div class=''>\
                        <a href='javascript:void(0);' onclick='c_follow();'>关注</a>\
                         &nbsp;|&nbsp;\
                        <a href='#top'>顶部</a>\
                         &nbsp;|&nbsp;\
                        <a href='javascript:void(0);' onclick=\" $('#tbCommentBody').focus();\">评论</a>\
                   </div>";
        $("#div_digg").append(div_html);
        //tbCommentBody
    });
});