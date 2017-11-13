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

// 为了渲染 cavans 效果的标题，生成一个 title 列表
function generateBlogTitle() {
  var root=document.createElement("div");
  root.id='ui';
  for (var i=0; i < 50; i++) {
    var node=document.createElement("div");
    node.className='text';
    node.innerHTML='静默虚空';
    root.appendChild(node);
  }
  document.getElementById("blogTitle").appendChild(root);

  var subTitle=document.createElement("h2");
  subTitle.innerHTML='Talk is cheap, show me the code.';
  document.getElementById("blogTitle").appendChild(subTitle);
}

// execute the func after the page have loaded
$(function () {
  customTimer('#blogTitle', generateBlogTitle);
});