// 
const express = require('express');
const Student = require('../mongoose');

const route = express.Router();

// 打开编辑页面
route.get('/:id', (req, res) => {
    Student.findById(req.params.id, (err, data) => {
        if (err) {
            //跳转到错误页
        }
        else {
            var student = data.toObject()
            student.id = student._id.toString()
            delete student._id

            res.render('edit', { student })
        }
    })
});

module.exports = route;