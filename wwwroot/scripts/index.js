// index.js 首页发起请求的文件

// 排序的属性
var sortProperty = 'createTime';
// 排序的方式
var sortDir = -1;

// 监听th事件失败，原因：
// 表格数据是通过Ajax请求得到的
// 下面的代码执行的时候Ajax请求还没有发起
// 也就是th表头根本不存在，所以下面的方法不可取
// $('th[sortBy]').click(function(){
//     alert($(this).attr('sortBy'));
// });

// 使用委托事件可以监听还不存在的标签事件
$('.data').delegate('th[sortBy]', 'click', function(){
    var p = $(this).attr('sortBy');
    // alert(p);
    if(p == sortProperty){
        sortDir *=-1;  // 等于sortDir = sortDir * -1;
    }else{
        sortProperty = p;
        sortDir = 1;
    }
    // 调用showPage
    showPage(1, 1);
});

function removeStudent(id, name) {
    // 更新模态框内容区
    $('#removeModal .modal-body').text('点击确定将删除' + name)
    
    // 弹出id是removeModal的模态框
    $('#removeModal').modal()

    $('#removeModal .btn-danger')
    .off('click')                   //移除所有点击事件监听函数
    .on('click', function(){        //添加一个点击事件监听函数
        $.post(
            '/api/student/remove/' + id,
            null,
            function(res){
                if(res.code == 'success'){
                    location.reload()
                }
                else{
                    alert(res.message)
                }
            }
        )
    })    
}

// 向服务器发起请求得到数据students
// page:第几页
// pageCount：共几页
function showPage(page, pageCount){
    console.log(page);
    console.log(pageCount);
    if(page < 1) page = 1;
    if(page > pageCount) page = pageCount;
    // serialize()将表单数据序列化为字符串，不方便进一步加工
    // serializeArray()将表达数据序列化成数组，方便加入数据
    var data = $('form').serializeArray();
    data.push({name: 'sortProperty', value: sortProperty});
    data.push({name: 'sortDir', value: sortDir});
    $.post(
        '/' + page,
        data,
        function(res){
            if(res.code == 'success'){
                console.log(res.data)
                var html = template('table-template', res.data);
                $('.data').html(html);
                // 给"创建时间"添加图标
                // 创建一个对象添加到另一个对象上
                $('<span class="glyphicon glyphicon-arrow-' +
                (sortDir == -1 ? 'up' : 'down') + '"></span>')
                .appendTo('th[sortBy=' + sortProperty + ']');
            }else alert(res.message);
        }
    )
}

// 调用showPage
showPage(1, 1);