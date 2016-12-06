// index.js 首页发起请求的文件


function removeStudent(id) {
    if(confirm('确定要删除吗？')){
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
    }
}