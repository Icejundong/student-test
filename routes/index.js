// 首页的路由文件

const express = require('express');
const Student = require('../mongoose');

// 添加格式化日期时间的函数
function formatTime(t){
    var M = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();

    M = M < 10 ? '0' + M : M;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;

    // 返回输出格式
    return t.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m;
}

// 得到页面范围
// page:当前第几页
// pageCount:共几页
function getPages(page, pageCount){
    var pages = [page];  
    console.log(pages);  // [1]

    // 得到page左边的页码
    var left = page - 1;
    // 得到page右边的页码
    var right = page + 1;

    // pages是存放页面范围的数组
    while(pages.length < 11 && (left >= 1 || right <= pageCount)){
        if(left > 0) pages.unshift(left--);
        if(right <= pageCount) pages.push(right++);
    }
    console.log(pages);
    return pages;
}

const route = express.Router();

// 处理首页的接口
/*------------------------
/:page表示/后必须有字符
/(:page)?表示/后可以有字符，也可以没有字符
有字符串时可以通过page得到，没有字符时page是
undefined
-------------------------*/
route.post('/(:page)?', (req, res) => {
    console.log(req.body);
    var filter = {};

    var name = req.body.name;
    if(name){
        name = name.trim();
        if(name.length > 0){
            filter.name = name;
        }
    }
    var isMale = req.body.isMale;
    if(isMale){
        isMale = isMale.trim();
        if(isMale.length > 0){
            filter.isMale = isMale;
        }
    }
    var phone = req.body.phone;
    if(phone){
        phone = phone.trim();
        if(phone.length > 0){
            filter.phone = phone;
        }
    }

    // 输出req.body
    console.log(req.body)
    var order = {};
    // 使用[]给对象添加属性，属性名是[]内表达式的值
    // 这里req.body.sortProperty是createTime
    // req.body.sortDir是-1
    // 下面这句话相当于order[createTime] = -1;
    order[req.body.sortProperty] = req.body.sortDir;

    var page = req.params.page
    console.log(page);
    page = page || 1

    // page是undefined时，(page || 1)是1
    // page是数字时，(page || 1)是page

    page = parseInt(page)
    page = page < 1 ? 1 : page

    //每页显示5条数据
    var pageSize = 5

    Student.find(filter).count((err, total) => {
        console.log(total)

        if (err) {
            // 跳转到错误页
        }
        else {
            // 如果total / pageSize除不尽（小数），需向上取整
            var pageCount = Math.ceil(total / pageSize)

            // select对数据属性进行筛选，属性名之间用空格分隔
            Student.find(filter)
                .sort(order)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select('name isMale age phone email createTime')
                .exec((err, data) => {
                    if (err) {
                        //跳转到错误页
                    }
                    else {
                        // data是一个model数组
                        // model.toObject()可以将数据从模型实例中剥离出来
                        // console.dir(data)
                        // console.dir(data.map(m => m.toObject()))

                        // res.render('index', {
                        //     page, pageCount, students: data.map(m => {
                        //         m = m.toObject()
                        //         m.id = m._id.toString()
                        //         delete m._id
                        //         return m
                        //     })
                        // })
                        // var students = data.map(m => {
                        //     m = m.toObject();
                        //     m.id = m._id.toString();
                        //     delete m._id;
                        //     return m;
                        // });
                        // console.log(students);
                        // page:7
                        // pageCount:13
                        // pages:[2, 3, ... 12]
                        res.status(200).json({code: 'success', data: {
                            page,
                            pageCount,
                            pages: getPages(page, pageCount),
                            students: data.map(m => {
                                m = m.toObject();
                                m.id = m._id.toString();
                                delete m._id;
                                m.createTime = formatTime(m.createTime);
                                
                                return m;
                            })
                        }})
                    }
                })
        }
    })
})

// 
module.exports = route;