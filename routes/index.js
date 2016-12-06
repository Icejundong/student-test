// 首页的路由文件

const express = require('express');
const Student = require('../mongoose');

const route = express.Router();

// 处理首页的接口
route.get('/', (req, res) => {
    // select对数据属性进行筛选，属性名之间用空格分隔
    Student.find().sort({createTime: -1}).select('name isMale age phone email').exec((err, data) => {

        if (err) {
            //跳转到错误页
        }
        else {
            // data是一个model数组
            // model.toObject()可以将数据从模型实例中剥离出来
            // console.dir(data)
            console.dir(data.map(m => m.toObject()))


            res.render('index', {
                students: data.map(m => {
                    m = m.toObject()
                    m.id = m._id.toString()
                    delete m._id
                    return m
                })
            });
        }
    });
});

// 
module.exports = route;