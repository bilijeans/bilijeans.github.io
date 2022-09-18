class PlayBar {
    constructor() {
        this.$audio = null
        // this.$audio = $('.playbar')
        this.$playbar = $('.play-bar')
        this.songID = null
        this.albumPic = './images/default_album.jpg'
        this.status = false
        this.index = 0
        this.songTime = null
        this.timeLong = null
        this.lrcArr = null
        this.lrcRow = 0
    }
    init() {
        this.createPlayBar()
        this.initPlaybarSongList()
        this.addEventLister()
    }
    createPlayBar() {
        $(`<div class="container">
                <div class="pic">
                    <img src="${this.albumPic}" alt="">
                </div>
                
                <div class="play-controls">
                    <div class="btns">
                        <div class="btn prev"></div>
                        <div class="btn ply"></div>
                        <div class="btn next"></div>
                        <div class="btn volume">
                            <div class="v-bg">
                                <div class="v-slider">
                                    <div class="v-btn"></div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="progress">
                        <div class="cur">
                            <div class="cur-btn"></div>
                        </div>
                        <div class="time">
                            <span class="p-time"></span>
                            <span class="a-time"></span>
                        </div>
                    </div>
                </div>
                <div class="list">
                    <div class="song-list">
                        
                        <ul class="list-items">
                            <div class="title">播放列表(0)</div>
                        </ul>
                        <div class="song-lrc">
                        <div class="title">歌词</div>
                        </div>
                    </div>
                </div>
            </div>`).appendTo(this.$playbar)
        this.$audio = $(`<audio src=""></audio>`).appendTo(this.$playbar)
    }
    addEventLister() {
        this.$playbar.on('click', '.ply', (e) => {
            if (this.status) {
                this.status = false
                this.$audio[0].pause()
                $(e.currentTarget).removeClass('pause')
            } else {
                this.status = true
                if (this.songID) {
                    this.$audio[0].play()
                    $(e.currentTarget).addClass('pause')
                } else {
                    this.$audio[0].src = this.getSongSrc()
                    this.$audio[0].play()
                    $(e.currentTarget).addClass('pause')
                }
            }
            this.refreshPlaybarSongList()
            this.getSongData(this.songID)
        })
        this.$playbar.on('click', '.next', (e) => {
            this.next()
            $(e.currentTarget.previousElementSibling).addClass('pause')
            this.getSongData(this.songID)
        })
        this.$playbar.on('click', '.prev', (e) => {
            this.prev()
            $(e.currentTarget.nextElementSibling).addClass('pause')
            this.getSongData(this.songID)
        })
        $('.volume .v-bg', this.$playbar).on('click', (e) => {
            if (!$(e.target).hasClass('v-btn')) {
                e.currentTarget.firstElementChild.style.width = e.offsetX / 50 * 100 + '%'
                this.$audio[0].volume = Number(e.offsetX / 50)
            }

        })
        $('.play-controls .progress', this.$playbar).on('click', (e) => {

            if (!$(e.target).hasClass('cur-btn')) {
                e.currentTarget.firstElementChild.style.width = e.offsetX / 500 * 100 + '%'
                this.$audio[0].currentTime = Number(e.offsetX / 500 * this.timeLong)
            }

        })
        this.$audio[0].ontimeupdate = () => {
            $('.play-controls .progress .cur', this.$playbar)[0].style.width = parseInt(this.$audio[0].currentTime / (this.timeLong / 100)) + '%'
            let min = parseInt(this.$audio[0].currentTime / 60)
            let sec = parseInt(this.$audio[0].currentTime) % 60
            let newTime = min + ':' + (sec>=10?sec:'0'+sec)
            $('.progress .p-time', this.$playbar).text(newTime)
            this.refreshSongLrc(this.$audio[0].currentTime)

        }
        this.$audio[0].onended = () => {
            this.next()
        }
        $('.list', this.$playbar).on('click', (e) => {
            if (e.target.className == 'list') {
                $('.song-list', this.$playbar).toggleClass('show')
            }
        })
        $('.list-items', this.$playbar).on('click', '.item', (e) => {
            JSON.parse(localStorage.getItem('songsPlayList')).forEach((evt, i) => {
                if (evt.id == e.currentTarget.dataset.id) {
                    this.index = i
                }

            })
            this.play(e.currentTarget.dataset.id)
        })
    }
    play(id) {
        this.songID = id
        this.$audio[0].src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        this.getSongData(this.songID)
        this.$audio[0].play()
        this.status = true
        this.refreshPlaybar()
        this.initPlaybarSongList()
        this.refreshPlaybarSongList()
    }
    refreshPlaybar() {
        $('.ply', this.$playbar).addClass('pause')
        JSON.parse(localStorage.getItem('songsPlayList')).forEach(e => {
            if (e.id == this.songID) {
                this.albumPic = e.albumPic
                this.songTime = e.time
                this.timeLong = this.songTime.split(':')[0] * 60 + this.songTime.split(':')[1] * 1
            }
        });
        $('.pic img', this.$playbar).attr('src', this.albumPic)
        $('.volume .v-slider', this.$playbar)[0].style.width = this.$audio[0].volume * 100 + '%'
        $('.play-controls .progress .cur', this.$playbar)[0].style.width = '0%'
        $('.progress .p-time', this.$playbar).text(`0:00`)
        $('.progress .a-time', this.$playbar).text('/ ' + this.songTime)

    }
    initPlaybarSongList() {
        let items = $('.list .list-items', this.$playbar).empty()
        let songsData = JSON.parse(localStorage.getItem('songsPlayList'))
        $(`<div class="title"></div>`).text(`播放列表(${songsData.length})`).appendTo(items)
        songsData.forEach(e => {
            let $item = $(` <li class="item" data-id="${e.id}">
                                <div class="name">${e.name}</div>
                                <div class="artist">${e.artist.join('/')}</div>
                                <div class="time">${e.time}</div>
                            </li>`).appendTo(items)
        })
    }
    refreshPlaybarSongList() {
        let items = $('.item', this.$playbar)
        for (let i = 0; i < items.length; i++) {
            items.eq(i).removeClass('ply-now')
            if (items[i].dataset.id == this.songID) {
                items.eq(i).addClass('ply-now')
            }
        }
    }
    refreshSongLrc(time) {
        let lrcs = $('.song-lrc .lrc', this.$playbar)
        for (let i = 0; i < this.lrcArr.length; i++) {
            lrcs.eq(i).removeClass('high-light')
            if (time > this.lrcArr[i].time && (time < this.lrcArr[i + 1].time || !this.lrcArr[i + 1])) {

                lrcs.eq(i).addClass('high-light')
                this.lrcRow = i
                break
            }
        }
        if (this.lrcRow >= 4) {
            $('.song-lrc', this.$playbar).scrollTop((this.lrcRow - 4) * 30)
        }
    }
    next() {
        this.status = true
        this.index = (this.index + 1) % JSON.parse(localStorage.getItem('songsPlayList')).length
        this.$audio[0].src = this.getSongSrc()
        this.$audio[0].play()
        this.refreshPlaybarSongList()
    }
    prev() {
        this.status = true
        this.index = (this.index - 1) < 0 ? JSON.parse(localStorage.getItem('songsPlayList')).length - 1 : this.index - 1
        this.$audio[0].src = this.getSongSrc()
        this.$audio[0].play()
        this.refreshPlaybarSongList()
    }
    getSongData(id) {
        $.ajax({
            url: `https:apis.netstart.cn/music/lyric?id=${id}`,
            success: (data) => {
                this.lrcRefresh(data)
            }
        })
    }
    lrcRefresh(lrcData) {
        let lrcReg = /^\[(\d+):(\d+\.\d+)\]([\S ]*)$/mg
        this.lrcArr = []
        while (lrcReg.test(lrcData.lrc.lyric)) {
            this.lrcArr.push({
                time: RegExp.$1 * 60 + parseFloat(RegExp.$2),
                lrc: RegExp.$3
            })
        }
        $('.song-lrc', this.$playbar).empty()
        $(`<div class="title">${JSON.parse(localStorage.getItem('songsPlayList'))[this.index].name}</div>`).appendTo($('.song-list .song-lrc', this.$playbar))
        this.lrcArr.forEach(e => {
            $(`<div class="lrc" data-time="${e.time}">${e.lrc}<div>`).appendTo($('.song-list .song-lrc', this.$playbar))
        })
    }
    getSongSrc() {
        this.songID = JSON.parse(localStorage.getItem('songsPlayList'))[this.index].id
        let src = `https://music.163.com/song/media/outer/url?id=${this.songID}.mp3`
        this.refreshPlaybar()
        return src
    }

}