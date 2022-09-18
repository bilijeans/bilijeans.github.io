// $(function () {



// })
function NavControl(arr, $wrap, $wrap2) {
    this.style = arr[0]
    this.area = arr[1]
    this.isFinish = arr[2]
    this.isFree = arr[3]
    this.order = arr[4]
    this.pageNum = arr[5]
    this.$wrap = $wrap
    this.$wrap2 = $wrap2
    this.$style = null
    this.$area = null
    this.$isFinish = null
    this.$isFree = null
    this.$order = null
    this.data = null
    this.init()
}
NavControl.prototype.init = function () {
    this.createTitle()
    this.createNavList()
    this.addEvntLisner()
    this.render()
}
NavControl.prototype.createTitle = function () {
    this.$style = $('<div>').appendTo(this.$wrap).addClass('style')
    $('<span>').appendTo(this.$style).addClass('title').text('题材')
    this.$area = $('<div>').appendTo(this.$wrap).addClass('area')
    $('<span>').appendTo(this.$area).addClass('title').text('地区')
    this.$isFinish = $('<div>').appendTo(this.$wrap).addClass('isFinish')
    $('<span>').appendTo(this.$isFinish).addClass('title').text('进度')
    this.$isFree = $('<div>').appendTo(this.$wrap).addClass('isFree')
    $('<span>').appendTo(this.$isFree).addClass('title').text('收费')
    this.$order = $('<div>').appendTo(this.$wrap).addClass('order')
    $('<span>').appendTo(this.$order).addClass('title').text('排序')
}
NavControl.prototype.createNavList = function () {
    var self = this
    this.style.forEach(function (item, index) {
        $('<div>').appendTo(self.$style).attr({
            title: 'style',
            number: item.styleId
        }).text(item.name)
    });
    this.area.forEach(function (item, index) {
        $('<div>').appendTo(self.$area).attr({
            title: 'area',
            number: item.areaId
        }).text(item.name)
    });
    this.isFinish.forEach(function (item, index) {
        $('<div>').appendTo(self.$isFinish).attr({
            title: 'isFinish',
            number: item.isFinish
        }).text(item.name)
    });
    this.isFree.forEach(function (item, index) {
        $('<div>').appendTo(self.$isFree).attr({
            title: 'isFree',
            number: item.isFree
        }).text(item.name)
    });
    this.order.forEach(function (item, index) {
        $('<div>').appendTo(self.$order).attr({
            title: 'order',
            number: item.order
        }).text(item.name)
    });
    this.reset()
}
NavControl.prototype.reset = function () {
    $('div', this.$style).eq(0).addClass('active')
    $('div', this.$area).eq(0).addClass('active')
    $('div', this.$isFinish).eq(0).addClass('active')
    $('div', this.$isFree).eq(0).addClass('active')
    $('div', this.$order).eq(0).addClass('active')
}
NavControl.prototype.addEvntLisner = function () {
    var self = this
    var len = this.$wrap.children().length
    for (var i = 0; i < len; i++) {
        $('div', this.$wrap.children().eq(i)).click(function () {
            $(this).addClass('active').siblings().removeClass('active')
            self.render()
        })
    }
}
NavControl.prototype.render = function () {
    var self = this
    $.ajax({
        url: 'https://apis.netstart.cn/bcomic/ClassPage',
        Type: 'GET',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        data: {
            styleId: $('.active', self.$style).attr('number') || -1,
            areaId: $('.active', self.$area).attr('number') || -1,
            isFinish: $('.active', self.$isFinish).attr('number') || -1,
            order: $('.active', self.$order).attr('number') || 0,
            pageNum: 1,
            pageSize: 39,
            isFree: $('.active', self.$isFree).attr('number') || -1
        },
        success: function (data) {
            self.refresh(data)
        },
        error: function () {
            self.reset()
            self.render()
        }

    })
}
NavControl.prototype.refresh = function (data) {
    this.$wrap2.empty()
    this.data = data.data
    for (var i = 0; i < this.data.length; i++) {
        var $div = $('<div>').appendTo(this.$wrap2).addClass('wrap')
        $('<img>').appendTo($div).attr('src', this.data[i].vertical_cover)
        $('<span>').appendTo($div).text(this.data[i].title).addClass('name')
        $('<br>').appendTo($div)
        var str = '连载'
        if (this.data[i].last_ord === this.data[i].total) {
            str = '完结'
            $('<span>').appendTo($div).text('[' + str + '] 共' + this.data[i].total + '话').addClass('status')
        } else {
            $('<span>').appendTo($div).text('[' + str + '] 更新至' + this.data[i].last_ord + '话').addClass('status')
        }

    }
}
