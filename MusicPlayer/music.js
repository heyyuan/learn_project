var app = new Vue({
    el:'#player',
    data: {
        //查询关键字
        query: '',
        //搜索歌曲结果
        musicList: [],
        //歌曲链接
        musicSrc: "",
        //专辑封面链接
        picSrc: "",
        //歌曲评论列表
        commentList: [],
        //动画播放状态
        isPlaying: false,
        //遮罩层状态
        isShow: false,
        //mv链接
        mvSrc: "",
    },
    methods: {
        //搜索歌曲
        searchMusic: function() {
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords=" + this.query).then(
                function(response) {
                //console.log(response.data.result.songs);
                that.musicList = response.data.result.songs;
            },
            function(err){}
            );
        },
        //播放歌曲
        playMusic: function(musicId) {
            var that = this;
            //获取音乐资源
            axios.get("https://autumnfish.cn/song/url?id="+ musicId).then(
                function(response) {
                //console.log(response.data.data[0].url);
                that.musicSrc = response.data.data[0].url;
            },
            function(err){}
            );
            this.query = '';
            
            //获取专辑封面
            axios.get("https://autumnfish.cn/song/detail?ids=" + musicId).then(
                function(response) {
                //console.log(response.data.songs[0].al.picUrl);
                that.picSrc = response.data.songs[0].al.picUrl;
            },
            function(err){}
            );

            //获取评论资源
            axios.get("https://autumnfish.cn/comment/hot?type=0&id=" + musicId).then(
                function(response) {
                //评论内容console.log(response.data.hotComments[0].content);
                //用户头像console.log(response.data.hotComments[0].user.avatarUrl);
                //用户名console.log(response.data.hotComments[0].user.nickname);
                that.commentList = response.data.hotComments;
            },
            function(err){}
            );
        },

        //播放音乐动画
        play: function() {
            //console.log('play');
            this.isPlaying = true;
        },

        //暂停音乐动画
        pause: function() {
            //console.log('pause');
            this.isPlaying = false;
        },

        //播放MV
        playMv: function(mvid) {
            var that = this;
            //获取MV资源
            axios.get("https://autumnfish.cn/mv/url?id=" + mvid).then(
                function(response) {
                //mv地址console.log(response.data.data.url);
                that.isShow = true;
                that.mvSrc = response.data.data.url;
            },
            function(err){}
            );
            this.musicSrc = '';
            this.isPlaying = false;
        },

        //隐藏播放mv
        hiding: function() {
            this.isShow = false;
            this.mvSrc = '';
        }
    }
});