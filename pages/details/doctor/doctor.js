// pages/details/doctor/doctor.js
const __API__ = require("../../../services/backbone.api.js");
const __DATETIME_FORMAT__ = require("../../../services/datetime.service.js");

Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        departmentName: '',
        doctor: {},
        schedules: []
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        var
            that = this,
            doctor = JSON.parse(options.doctor);
        // 初始化
        this.setData({
            departmentName: options.departmentName,
            doctor: doctor
        })
        // 设置导航栏标题
        wx.setNavigationBarTitle({
            title: doctor.name
        })
        // 请求该医生排班
        wx.request({
            url: __API__.queryRelatives('schedule', doctor.id),
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success: function (response) {
                console.info(response);
                if (response.statusCode === 200) {
                    that.data.schedules = response.data.map(item => {
                        item.visiting = __DATETIME_FORMAT__.formatDate(new Date(item.visiting));
                        return item;
                    });

                    that.setData({
                        schedules: that.data.schedules
                    });
                }
            }
        });
    },

    toMakeAppointment: function (e) {
        var that = this;

        wx.getStorage({
            key: 'user',
            success: function (res) {
                wx.navigateTo({
                    url: '/pages/appointment/init/init?doctorName=' + that.data.doctor.name
                    + '&departmentName=' + that.data.departmentName
                    + '&schedule=' + JSON.stringify(e.currentTarget.dataset.schedule)
                })
            },
            fail: function (err) {
                console.error(err);
            }
        });


    }
})