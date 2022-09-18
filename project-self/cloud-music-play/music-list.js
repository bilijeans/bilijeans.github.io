class MusicList {
    constructor(data, playBar) {
        this.$songsContainer = $('.songs-container')
        this.songsListData = data.result
        this.playBar = playBar
    }
    init() {
        this.initPage()
        this.addEventLister()
    }
    initPage() {
        let $songsList = $(`<ul class="songs-list"></ul>`).appendTo(this.$songsContainer)
        this.songsListData.map((el) => {
            let name = el.name
            let album = el.song.album.artists.map((el) => {
                return el.name
            }).join('/') + '-' + el.song.album.name
            $(`<li class="item">
                    <div class="song" data-id="${el.id}">
                        <span class="song-name">${name}</span>
                        
                        <div class="album-item">
                            <span class="${el.song.sqMusic ? 'song-quality' : ''}"></span>
                            <span class="album">${album}</span>
                        </div>
                    </div>
                    <div class="play">
                        <span class="icon"></span>
                    </div>
            </li>`).appendTo($songsList)
        });
    }
    addEventLister() {
        this.$songsContainer.on('click', '.item', (e) => {
            let id = e.currentTarget.firstElementChild.dataset.id
            this.songsListData.map((item) => {
                if (item.id == id) {
                    this.saveToLocalStrorage(item)
                }
            })
            this.playBar.play(id)
        })
    }
    saveToLocalStrorage(data) {
        let newLocalData = [{
            name: data.name,
            id: data.id,
            artist: (function () {
                let arr = []
                data.song.artists.map((item) => {
                    arr.push(item.name)
                })
                return arr
            })(),
            time: (function () {
                let str = ''
                let min = parseInt(data.song.duration / 1000 / 60)
                let second = parseInt(data.song.duration / 1000) - min * 60
                str += min + ':' + (second>=10?second:'0'+second)
                return str
            })(),
            albumPic: data.picUrl
        }]
        function a(id) {
            let localData = JSON.parse(localStorage.getItem('songsPlayList'))
            localData = JSON.parse(localStorage.getItem('songsPlayList')).filter((i) => {
                if (id == i.id) {
                    return false
                } else {
                    return true
                }
            })
            return [...newLocalData, ...localData]
        }
        function b() {
            return newLocalData
        }
        let localData = localStorage.getItem('songsPlayList') ? a(newLocalData[0].id) : b()
        localStorage.clear()
        localData = JSON.stringify(localData)
        localStorage.setItem('songsPlayList', localData)
    }

}