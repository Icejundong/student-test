// index.js 首页发起请求的文件
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