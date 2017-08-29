angular.module('myApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'www/tabs.html',
                controller: 'tabsController'
            })

            .state('tabs.recommend', {
                url: '/recommend',
                templateUrl: 'www/recommend.html',
                controller: 'recController'
            })

            .state('tabs.topList', {
                url: '/topList/:topListType',
                templateUrl: 'www/topList.html',
                controller:'topListController'
            })

            .state('tabs.songList', {
                url: '/songList',
                templateUrl: 'www/songList.html',
                controller: 'songListController'
            })

            .state('tabs.newAlbum', {
                url: '/newAlbum',
                templateUrl: 'www/newAlbum.html',
                controller: 'newAlbumController'
            })

            //歌手页面
            .state('tabs.artist', {
                url: '/artist',
                templateUrl: 'www/artist.html',
                controller: 'artistController'
            })

            //歌手详情页面
            .state('tabs.artistDetails', {
                url: '/artistDetails/:artistId',
                templateUrl: 'www/artistDetails.html',
                controller: 'artistDetailsController'
            })

            .state('tabs.serverHome', {
                url: '/serverHome',
                templateUrl: 'www/serverHome.html',
                controller: 'serverHomeController'
            })

            .state('tabs.myMusicNoLogin', {
                url: '/myMusicNoLogin',
                templateUrl: 'www/myMusicNoLogin.html'
            })

            .state('tabs.friendNoLogin', {
                url: '/friendNoLogin',
                templateUrl: 'www/friendNoLogin.html'
            })

            //歌曲详情页面
            .state('tabs.songDetails', {
                url: '/songDetails/:songId',
                templateUrl: 'www/songDetails.html',
                controller: 'songDetailsController'
            })

            //用户个人中心界面
            .state('tabs.user', {
                url: '/user',
                templateUrl: 'www/user.html',
                controller: 'userController'
            })

            //管理员中心之会员管理
            .state('tabs.manageMember', {
                url: '/manageMember',
                templateUrl: 'www/manageMember.html',
                controller: 'manageMemberController'
            })

            //管理员中心之歌曲管理
            .state('tabs.manageSong', {
                url: '/manageSong',
                templateUrl: 'www/manageSong.html',
                controller: 'manageSongController'
            })

            //管理员中心之歌手管理
            .state('tabs.manageArtist', {
                url: '/manageArtist',
                templateUrl: 'www/manageArtist.html',
                controller: 'manageArtistController'
            })

            //管理员中心之评论管理
            .state('tabs.manageComment', {
                url: '/manageComment',
                templateUrl: 'www/manageComment.html',
                controller: 'manageCommentController'
            })

            //管理员中心之问题管理
            .state('tabs.manageProblem', {
                url: '/manageProblem',
                templateUrl: 'www/manageProblem.html',
                controller: 'manageProblemController'
            })

            //管理员中心之修改会员资料
            .state('tabs.modifyMember', {
                url: '/modifyMember',
                templateUrl: 'www/modifyMember.html'
            })

            //管理员中心之修改歌曲
            .state('tabs.modifySong', {
                url: '/modifySong',
                templateUrl: 'www/modifySong.html',
                controller: 'modifySongController'
            })

            //管理员中心之修改歌手
            .state('tabs.modifyArtist', {
                url: '/modifyArtist',
                templateUrl: 'www/modifyArtist.html',
                controller: 'modifyArtistController'
            })

            //用户详情
            .state('tabs.userDetails', {
                url: '/userDetails?userId',
                templateUrl: 'www/userDetails.html',
                controller: 'userDetailsController'
            })

            //用户编辑个人资料界面
            .state('tabs.upDate', {
                url: '/upDate',
                templateUrl: 'www/upDate.html'
            })

            //用户上传歌曲界面
            .state('tabs.uploadSong', {
                url: '/uploadSong',
                templateUrl: 'www/uploadSong.html',
                controller: 'uploadSongController'
            })

            //用户上传歌手界面
            .state('tabs.uploadArtist', {
                url: '/uploadArtist',
                templateUrl: 'www/uploadArtist.html',
                controller: 'uploadArtistController'
            })

            //用户申请Vip的界面
            .state('tabs.applyVip', {
                url: '/applyVip',
                templateUrl: 'www/applyVip.html',
                //controller:'newsController'
            })

            //footer部分的跳转
            .state('about', {
                url: '/about',
                templateUrl: 'www/about.html',
                //controller:'newsController'
            })

            .state('serverRules', {
                url: '/serverRules',
                templateUrl: 'www/serverRules.html',
                //controller:'newsController'
            })

            .state('yhy', {
                url: '/yhy',
                templateUrl: 'www/yhy.html',
                //controller:'newsController'
            });

        $urlRouterProvider.otherwise('/tabs/recommend');

    }])

    //搜索结果
    .controller('tabsController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //搜索
        var flag = false;
        var timer;
        $(function() {
            $(".searchInput").on("keyup",function(){
                var that = this;
                if ($(that).val()){
                    $(".searchResult").css("display", "block");
                    $(".seaLoading").css("display", "block");
                    $(".serResTopTip").css("display", "none");
                    $(".serResCon").css("display", "none");
                }else {
                    $(".searchResult").css("display", "none");
                }
                clearTimeout(timer);
                flag = true;
                timer = setTimeout(function() {
                    flag = false;
                    if ($(that).val()) {
                        var searchContent = $(that).val();
                        //根据歌曲、歌手、用户来搜索
                        $.ajax({
                            type: 'POST',
                            url: urlHref + 'searchApi',
                            data: {
                                searchVal: searchContent
                            },
                            success: function (result) {
                                if (result.state == 200) {
                                    $(".seaLoading").css("display", "none");
                                    $(".serResTopTip").css("display", "block");
                                    $(".serResCon").css("display", "block");
                                    $scope.total = {
                                        total: result.total
                                    };
                                    $scope.songTotal = {
                                        songTotal: result.song.length
                                    };
                                    $scope.artistTotal = {
                                        artistTotal: result.artist.length
                                    };
                                    $scope.userTotal = {
                                        userTotal: result.user.length
                                    };
                                    $scope.searchSong = result.song;
                                    $scope.searchArtist = result.artist;
                                    $scope.searchUser = result.user;
                                    $scope.$apply();
                                } else if (result.state == 0) {
                                    $(".seaLoading").css("display", "none");
                                    $(".serResTopTip").css("display", "block");
                                    $(".serResCon").css("display", "block");
                                    $scope.total = {
                                        total: 0
                                    };
                                    $scope.$apply();
                                }
                            },
                            error: function (err) {

                            }
                        });
                    } else {
                        $(".searchResult").css("display", "none");
                        //$(".searchResult").html("");
                    }
                }, 700);
            });
        });

        //点击播放列表按钮时展开播放界面
        $(document).on("click",".listsBtn",function(){
            $(".openPlayerList").slideToggle();
        });

        //悬浮球动画：点击悬浮球时，生成播放器；
        if (document.querySelector(".float-menu")) {
            var plus = document.querySelector(".circle");
            var floatMenu = document.querySelector(".float-menu");
            plus.addEventListener("click", function () {
                var screenW = document.body.clientWidth;
                if(floatMenu.className.indexOf("open") > -1){
                    floatMenu.className = "float-menu";
                    $(".openPlayerList").fadeOut();
                }else {
                    floatMenu.className = "float-menu open";
                    if(localStorage.userId){
                        $.ajax({
                            type: 'POST',
                            url: urlHref + 'getPlayListApi',
                            data:{
                                userId:localStorage.userId
                            },
                            success: function (result) {
                                if(result.state == 200){
                                    $(".addSongMsg").remove();
                                    $(".deafultPlayList").css("display","none");
                                    $(".playListNumShow").css("display","inline-block");
                                    $scope.playList = result.data;
                                    $scope.playListNum = {
                                        playListNum: result.data.length
                                    };
                                    $scope.$apply();
                                    $(".playerListLeft li:first .pubPlayIcon").removeClass("playIconUnChecked").addClass("playIconChecked");
                                    $(".playerListSongName").html(result.data[0].songName);
                                    $(".totalSong").html(result.data.length);
                                    if(myAudio.paused){
                                        var defaultSong = result.data[0];
                                        $(".musicPlayerHead img").attr("src",defaultSong.songImg);
                                        $(".rangeTextSong").html(defaultSong.songName);
                                        $(".rangeTextSinger").html(defaultSong.artist);
                                        $(".playerLists .totalSong").html(result.data.length);
                                        $(".musicPlayerRange").attr("data-songId",defaultSong.songId);
                                        myAudio.setAttribute("src",defaultSong.mp3File);
                                    }else {
                                        var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                                        $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                                        $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                                    }
                                }else if(result.state == 0){
                                    $scope.playListNum = {
                                        playListNum: 0
                                    };
                                    $scope.$apply();
                                }
                            },
                            error: function (err) {
                            }
                        });
                    }else if(localStorage.localPlayLog){
                        $(".addSongMsg").remove();
                        $(".deafultPlayList").css("display","none");
                        $(".playListNumShow").css("display","inline-block");
                        var localPlayLog = JSON.parse(localStorage.localPlayLog);
                        $scope.playList = localPlayLog;
                        $scope.playListNum = {
                            playListNum: localPlayLog.length
                        };
                        $scope.$apply();
                        $(".playerListLeft li:first .pubPlayIcon").removeClass("playIconUnChecked").addClass("playIconChecked");
                        $(".playerListSongName").html(localPlayLog[0].songName);
                        $(".totalSong").html(localPlayLog.length);
                        if(myAudio.paused){
                            var defaultSong = localPlayLog[0];
                            $(".musicPlayerHead img").attr("src",defaultSong.songImg);
                            $(".rangeTextSong").html(defaultSong.songName);
                            $(".rangeTextSinger").html(defaultSong.artist);
                            $(".playerLists .totalSong").html(localPlayLog.length);
                            $(".musicPlayerRange").attr("data-songId",defaultSong.songId);
                            myAudio.setAttribute("src",defaultSong.mp3File);
                        }else {
                            var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                            $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                            $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                        }
                    }else {
                        $(".deafultPlayList").css("display","inline-block");
                        $(".playListNumShow").css("display","none");
                    }
                }
                $(".float-menu .menu-content").css("width",screenW);
            }, false);
        }

        //删除数组中下标为n的元素
        function removeArrayOfN(arr, n) {
            if (n > arr.length - 1 || n < 0) {
                //如果n大于或小于指定数组的长度则返回
                return;
            }
            var arr1 = [];
            for (var i = 0; i < arr.length; i++) {
                if (i == n) {
                    continue
                }//如果删除的为第i个元素，跳出当前循环
                arr1.push(arr[i]);//把下标不为n的元素添加到arr1
            }
            arr.length = 0;//将arr的长度设为零
            for (var i = 0; i < arr1.length; i++) {
                arr[i] = arr1[i]//重新给arr赋值
            }
            return arr;//返回传进的数组
        }

        //播放列表删除事件
        $(document.body).on("click",".playerListDel",function(event){
            event.stopPropagation();
            var that = this;
            var userId = localStorage.userId;
            var userPhone = localStorage.userPhone;
            var songId = $(that).parent().parent().parent().attr("data-songId");
            if(userId && userPhone && songId){
                $.ajax({
                    type: 'POST',
                    url: urlHref + 'delPlayListApi',
                    data: {
                        userId:userId,
                        songId:songId
                    },
                    success: function (result) {
                        if (result.state == 200) {
                            $(".addSongMsg").remove();
                            $scope.playList = result.data;
                            $(".openPlayerTotalSong").html(result.data.length);
                            $(".totalSong").html(result.data.length);
                            $scope.$apply();
                            if($(".musicPlayerRange").attr("data-songId") == songId){
                                $(".playerListLeft li:first .pubPlayIcon").removeClass("playIconUnChecked").addClass("playIconChecked");
                                $(".musicPlayerHead img").attr("src",result.data[0].songImg);
                                $(".rangeTextSong").html(result.data[0].songName);
                                $(".rangeTextSinger").html(result.data[0].artist);
                                $(".musicPlayerRange").attr("data-songId",result.data[0].songId);
                                $(".playerListSongName").html(result.data[0].songName);
                                myAudio.setAttribute("src",result.data[0].mp3File);
                                myAudio.play();
                            }else {
                                var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                                $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                                $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                            }
                        } else if(result.state == 0){
                            $(".addSongMsg").remove();
                            $(".openPlayerTotalSong").html(0);
                            $(".totalSong").html(0);
                            $(".musicPlayerHead img").attr("src","frameImg/default_album.jpg");
                            $(".rangeTextSong").html("歌名");
                            $(".rangeTextSinger").html("歌手");
                            $(".musicPlayerRange").attr("data-songId","");
                            $(".TotalTime").html("0:00");
                            $(".playerListSongName").html("歌名");
                            $(".playOrPause").removeClass("musicPlayerPause").addClass("musicPlayerPlay");
                            myAudio.setAttribute("src","");
                        } else {
                            $(".dialog").css("display","block");
                            $(".applyAlert").css("display","block");
                            $(".applyVipTip").html("删除失败，请稍后再试！");
                            $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
                            $(".applyVipTip").css("color","#e33232");
                        }
                    },
                    error: function (err) {
                    }
                });
            }else if (!userId || !userPhone){
                if(localStorage.localPlaySongId && localStorage.localPlayLog){
                    var localPlaySongId = JSON.parse(localStorage.localPlaySongId);
                    var localPlayLog = JSON.parse(localStorage.localPlayLog);
                    //移除当前的歌id
                    localPlaySongId.forEach(function (v, i, a) {
                        if (v == songId) {
                            localPlaySongId = removeArrayOfN(localPlaySongId, i);
                        }
                    });
                    if(localPlaySongId.length > 0){
                        localStorage.localPlaySongId = JSON.stringify(localPlaySongId);
                    }else {
                        localStorage.removeItem("localPlaySongId");
                        localPlaySongId = [];
                    }
                    //移除当前的歌信息
                    localPlayLog.forEach(function (v, i, a) {
                        if (v.songId == songId) {
                            localPlayLog = removeArrayOfN(localPlayLog, i);
                        }
                    });
                    if (localPlayLog.length > 0){
                        localStorage.localPlayLog = JSON.stringify(localPlayLog);
                    }else {
                        localStorage.removeItem("localPlayLog");
                        localPlayLog = [];
                    }
                    $(".addSongMsg").remove();
                    $scope.playList = localPlayLog;
                    $(".openPlayerTotalSong").html(localPlayLog.length);
                    $(".totalSong").html(localPlayLog.length);
                    $scope.$apply();
                    if($(".musicPlayerRange").attr("data-songId") == songId && localPlayLog.length > 0){
                        $(".playerListLeft li:first .pubPlayIcon").removeClass("playIconUnChecked").addClass("playIconChecked");
                        $(".musicPlayerHead img").attr("src",localPlayLog[0].songImg);
                        $(".rangeTextSong").html(localPlayLog[0].songName);
                        $(".rangeTextSinger").html(localPlayLog[0].artist);
                        $(".musicPlayerRange").attr("data-songId",localPlayLog[0].songId);
                        $(".playerListSongName").html(localPlayLog[0].songName);
                        myAudio.setAttribute("src",localPlayLog[0].mp3File);
                        myAudio.play();
                    }else if($(".musicPlayerRange").attr("data-songId") != songId && localPlayLog.length > 0){
                        var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                        $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                        $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                    }else if(localPlayLog.length == 0){
                        $(".openPlayerTotalSong").html(0);
                        $(".totalSong").html(0);
                        $(".musicPlayerHead img").attr("src","frameImg/default_album.jpg");
                        $(".rangeTextSong").html("歌名");
                        $(".rangeTextSinger").html("歌手");
                        $(".musicPlayerRange").attr("data-songId","");
                        $(".TotalTime").html("0:00");
                        $(".playerListSongName").html("歌名");
                        $(".playOrPause").removeClass("musicPlayerPause").addClass("musicPlayerPlay");
                        myAudio.setAttribute("src","");
                    }
                }
            }else if(!songId){
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("删除对象不存在！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        });
    }])

    .controller('recController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //热门推荐
        $http({
            url: urlHref + 'getSongByHotApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 12) {
                    $scope.hotRecValue = result.data.slice(0, 12);
                } else {
                    $scope.hotRecValue = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });

        //新碟上架
        $http({
            url: urlHref + 'getSongByTimeApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 10) {
                    $scope.newAlbumValue = result.data.slice(0, 10);
                } else {
                    $scope.newAlbumValue = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });

        //推荐歌手（首页）
        $http({
            url: urlHref + 'getRecArtistApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 5) {
                    $scope.recArtistShow = result.data.slice(0, 5);
                } else {
                    $scope.recArtistShow = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });

        //会员展示
        $http({
            url: urlHref + 'getMemberApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 5) {
                    $scope.hotDJValue = result.data.slice(0, 5);
                } else {
                    $scope.hotDJValue = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });

        //音乐新歌榜
        $http({
            url: urlHref + 'getTopListNewApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 10) {
                    $scope.toplistNew = result.data.slice(0, 10);
                } else {
                    $scope.toplistNew = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });

        //音乐飙升榜
        setTimeout(function(){
            $http({
                url: urlHref + 'getTopListSoarApi',
                method: 'GET'
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    if (result.data.length > 10) {
                        $scope.toplistSoar = result.data.slice(0, 10);
                    } else {
                        $scope.toplistSoar = result.data;
                    }
                }
            }).error(function (data, header, config, status) {
            });
        },200);

        //原创音乐榜
        setTimeout(function(){
            $http({
                url: urlHref + 'getTopListOriginalApi',
                method: 'GET'
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    if (result.data.length > 10) {
                        $scope.toplistOriginal = result.data.slice(0, 10);
                    } else {
                        $scope.toplistOriginal = result.data;
                    }
                }
            }).error(function (data, header, config, status) {
            });
        },500);
    }])

    .controller('songDetailsController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        //从url传过来的id
        var songId = $stateParams.songId;
        //根据歌曲id及上传用户查找歌曲详情、评论及上传者所有上传歌曲
        $http({
            url: urlHref + 'getSongInfoApi',
            method: 'POST',
            data: {_id: songId}
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.songDetails = result.details;
                $scope.songByUpload = result.otherSong;
                $scope.songComment = result.comment;
                $scope.otherSongNum = {
                    otherSongNum: result.otherSong.length
                };
                $scope.commentNum = {
                    commentNum: result.comment.length
                };
            }else if(result.state == -1){
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("读取数据出错，被评论对象异常！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        }).error(function (data, header, config, status) {
            //处理响应失败
        });

        //猜你喜欢
        $http({
            url: urlHref + 'getSongByHotApi',
            method: 'GET',
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 5) {
                    $scope.guessLike = result.data.slice(0, 5);
                } else {
                    $scope.guessLike = result.data;
                }
            }
        }).error(function (data, header, config, status) {
            //处理响应失败
        });
    }]).filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }])

    .controller('artistController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //推荐歌手
        $http({
            url: urlHref + 'getRecArtistApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.recArtist = result.data;
            }
        }).error(function (data, header, config, status) {
        });

        //热门歌手
        hotArtistLoad();
        $(".hotArtistItem").click(hotArtistLoad);
        function hotArtistLoad() {
            $http({
                url: urlHref + 'getHotArtistApi',
                method: 'GET'
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.publicArtist = result.data;
                }
            }).error(function (data, header, config, status) {
            });
        }

        //最新歌手
        $(".newArtistItem").click(latestArtistLoad);
        function latestArtistLoad() {
            $http({
                url: urlHref + 'getArtistByTimeApi',
                method: 'GET'
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.publicArtist = result.data;
                }
            }).error(function (data, header, config, status) {
            });
        }

        //点击某种类型的歌手时
        $(".artistNav li").click(function () {
            var bigType = $(this).parent().attr("data-category");
            var smallType = $(this).attr("data-type");
            $.ajax({
                type: 'POST',
                url: urlHref + 'getArtistByTypeApi',
                data: {
                    bigType: bigType,
                    smallType: smallType
                },
                success: function (result) {
                    if (result.state == 200) {
                        if (result.data.length > 0) {
                            //渲染数据
                            $scope.publicArtist = result.data;
                            $scope.$apply();
                        } else {
                            $scope.publicArtist = "";
                            $scope.$apply();
                            $(".dialog").css("display", "block");
                            $(".applyAlert").css("display", "block");
                            $(".applyVipTip").text("未找到数据！");
                            $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                            $(".applyVipTip").css("color", "#e33232");
                        }
                    }
                },
                error: function (err) {
                }
            });
        });

    }])

    //歌手详情页
    .controller('artistDetailsController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        //从url传过来的id
        var artistId = $stateParams.artistId;
        $http({
            url: urlHref + 'getArtistInfoApi',
            method: 'POST',
            data: {_id: artistId}
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.artistDetails = result.details;
                $scope.artistComment = result.comment;
                $scope.commentNum = {
                    commentNum: result.comment.length
                };
            }else if(result.state == -1){
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("读取数据出错，被评论对象异常！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        }).error(function (data, header, config, status) {
            //处理响应失败
        });

        //猜你喜欢
        $http({
            url: urlHref + 'getHotArtistApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 5) {
                    $scope.guessLikeArtist = result.data.slice(0, 5);
                } else {
                    $scope.guessLikeArtist = result.data;
                }
            }
        }).error(function (data, header, config, status) {
            //处理响应失败
        });

        //每次进入歌手详情页时，访问量+1
        setTimeout(function () {
            $http({
                url: urlHref + 'postArtistVisitApi',
                method: 'POST',
                data: {_id: artistId}
            }).success(function (result, header, config, status) {

            }).error(function (data, header, config, status) {
                //处理响应失败
            });
        }, 200);

    }]).filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }])

    //我的主页
    .controller('userController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //获取用户id
        var userId = location.href.split("?")[1].split("=")[1];
        //获取该用户收藏、上传的信息
        setTimeout(function () {
            $http({
                url: urlHref + 'getUserUploadApi',
                method: 'POST',
                data: {
                    userId: userId
                }
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.myCollect = result.myCollect;
                    $scope.uploadSong = result.uploadSong;
                    $scope.uploadArtist = result.uploadArtist;
                    //收藏的歌曲数目
                    $scope.myCollectNum = {
                        myCollectNum: result.myCollect.length
                    };
                    //上传的歌曲数目
                    $scope.uploadSongNum = {
                        uploadSongNum: result.uploadSong.length
                    };
                    //上传的歌手数目
                    $scope.uploadArtistNum = {
                        uploadArtistNum: result.uploadArtist.length
                    };
                }
            }).error(function (data, header, config, status) {
                //处理响应失败
            });
        }, 200)
    }])

    //用户详情页（其他用户）
    .controller('userDetailsController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        var userId = $stateParams.userId;
        $.ajax({
            url: urlHref + 'onlyQuery',
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            dataType: "json",
            data: {
                userId: userId
            },
            success: function (result) {
                if (result.state == 200) {
                    var otherUserInfo = result.data[0];
                    $(".userHead img").attr("src", otherUserInfo.fileName);
                    $(".userNameTitle").html(otherUserInfo.nickname);
                    $(".userSignContent").html(otherUserInfo.userSign);
                    if (otherUserInfo.sex == 1) {
                        $(".userSex").removeClass("userSexWomen").addClass("userSexMan");
                        $(".heOrHerFav").html("他的收藏");
                        $(".otherFavShow").html("他的收藏");
                    }else if(otherUserInfo.sex == 2){
                        $(".userSex").removeClass("userSexMan").addClass("userSexWomen");
                        $(".heOrHerFav").html("她的收藏");
                        $(".otherFavShow").html("她的收藏");
                    }
                    $(".latestLoginTime").html(otherUserInfo.regTime);
                    if (otherUserInfo.contactInfo) {
                        $(".socialContactInfo").html(otherUserInfo.contactInfo);
                        switch (otherUserInfo.contactWay) {
                            case '邮箱':
                                $(".socialContactType").html("（邮箱）");
                                break;
                            case '新浪微博':
                                $(".socialContactType").html("（新浪微博）");
                                break;
                            case 'QQ':
                                $(".socialContactType").html("（腾讯QQ）");
                                break;
                            case '微信':
                                $(".socialContactType").html("（微信）");
                                break;
                            case '手机号码':
                                $(".socialContactType").html("（手机号码）");
                                break;
                        }
                    } else {
                        $(".socialContactType").html("");
                    }
                }
            }
        });

        //获取该用户收藏、上传的信息
        setTimeout(function () {
            $http({
                url: urlHref + 'getUserUploadApi',
                method: 'POST',
                data: {
                    userId: userId
                }
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.otherUserCollect = result.myCollect;
                    $scope.otherUserUploadSong = result.uploadSong;
                    $scope.otherUserUploadArtist = result.uploadArtist;
                    //收藏的歌曲数目
                    $scope.otherUserCollectNum = {
                        otherUserCollectNum: result.myCollect.length
                    };
                    //上传的歌曲数目
                    $scope.otherUserUploadSongNum = {
                        otherUserUploadSongNum: result.uploadSong.length
                    };
                    //上传的歌手数目
                    $scope.otherUserUploadArtistNum = {
                        otherUserUploadArtistNum: result.uploadArtist.length
                    };
                }
            }).error(function (data, header, config, status) {
                //处理响应失败
            });
        }, 200)
    }])

    .controller('uploadSongController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        var provinceArr = ["请选择", "语种", "风格", "场景", "情感", "主题"];
        var cityArr = [
            ['请选择'],
            ['华语', '欧美', '日语', '韩语', '粤语', '小语种'],
            ['流行', '摇滚', '民谣', '电子', '舞曲', '说唱', '轻音乐', '爵士', '乡村', 'R&B/Soul', '古典', '民族', '英伦', '金属', '朋克', '蓝调', '雷鬼', '世界音乐', '拉丁', '另类/独立', 'New Age', '古风', '后摇', 'Bossa Nova'],
            ['清晨', '夜晚', '学习', '工作', '午休', '下午茶', '地铁', '驾车', '运动', '旅行', '散步', '酒吧'],
            ['怀旧', '清新', '浪漫', '性感', '伤感', '治愈', '放松', '孤独', '感动', '兴奋', '快乐', '安静', '思念'],
            ['影视原声', 'ACG', '校园', '游戏', '70后', '80后', '90后', '00后', '网络歌曲', 'KTV', '经典', '翻唱', '吉他', '钢琴', '器乐', '儿童', '榜单']
        ];

        //根据城市二级联动改编
        var cBox = this;
        //省份数据
        cBox.provinceArr = provinceArr;
        //城市数据
        cBox.cityArr = cityArr;
        //默认为省份
        cBox.getCityArr = cBox.cityArr[0];
        //这个是索引数组，根据切换得出切换的索引就可以得到省份及城市
        cBox.getCityIndexArr = ['0', '0'];

        //改变省份触发的事件 [根据索引更改城市数据]
        cBox.provinceChange = function (index) {
            //根据索引写入城市数据
            cBox.getCityArr = cBox.cityArr[index];
            //清除残留的数据
            cBox.getCityIndexArr[1] = '0';
            cBox.getCityIndexArr[0] = index;
            //输出查看数据
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //console.log(cBox.getCityIndexArr,provinceArr[cBox.getCityIndexArr[0]],cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        };
        //改变城市触发的事件
        cBox.cityChange = function (index) {
            cBox.getCityIndexArr[1] = index;
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //输出查看数据
            //console.log(cBox.getCityIndexArr, provinceArr[cBox.getCityIndexArr[0]], cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        }
    }])

    .controller('uploadArtistController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        var provinceArr = ["请选择", "华语", "欧美", "日本", "韩国", "其他"];
        var cityArr = [
            ['请选择'],
            ['华语男歌手', '华语女歌手', '华语组合/乐队'],
            ['欧美男歌手', '欧美女歌手', '欧美组合/乐队'],
            ['日本男歌手', '日本女歌手', '日本组合/乐队'],
            ['韩国男歌手', '韩国女歌手', '韩国组合/乐队'],
            ['其他男歌手', '其他女歌手', '其他组合/乐队']
        ];

        //根据城市二级联动改编
        var cBox = this;
        //省份数据
        cBox.provinceArr = provinceArr;
        //城市数据
        cBox.cityArr = cityArr;
        //默认为省份
        cBox.getCityArr = cBox.cityArr[0];
        //这个是索引数组，根据切换得出切换的索引就可以得到省份及城市
        cBox.getCityIndexArr = ['0', '0'];

        //改变省份触发的事件 [根据索引更改城市数据]
        cBox.provinceChange = function (index) {
            //根据索引写入城市数据
            cBox.getCityArr = cBox.cityArr[index];
            //清除残留的数据
            cBox.getCityIndexArr[1] = '0';
            cBox.getCityIndexArr[0] = index;
            //输出查看数据
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //console.log(cBox.getCityIndexArr,provinceArr[cBox.getCityIndexArr[0]],cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        };
        //改变城市触发的事件
        cBox.cityChange = function (index) {
            cBox.getCityIndexArr[1] = index;
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //输出查看数据
            //console.log(cBox.getCityIndexArr, provinceArr[cBox.getCityIndexArr[0]], cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        }
    }])

    //歌单列表
    .controller('songListController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //默认请求所有风格(按热门排序)
        allSongLoad();
        $(".allStyle").click(allSongLoad);
        $(".songListsHot").click(function () {
            $(".songListsTitle").text("全部风格");
            $(".cateListBox").css("display", "none");
            allSongLoad();
        });
        function allSongLoad() {
            $http({
                url: urlHref + 'getSongByHotApi',
                method: 'GET'
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.songList = result.data;
                }
            }).error(function (data, header, config, status) {
            });
        }

        //点击某种风格时
        $(".cateListBoxBd dd a").click(function () {
            var smallType = $(this).text().trim();
            $.ajax({
                type: 'POST',
                url: urlHref + 'getSongByTypeApi',
                data: {
                    smallType: smallType
                },
                success: function (result) {
                    if (result.state == 200) {
                        if (result.data.length > 0) {
                            //渲染数据
                            $scope.songList = result.data;
                            $scope.$apply();
                        } else {
                            $scope.songList = "";
                            $scope.$apply();
                            $(".dialog").css("display", "block");
                            $(".applyAlert").css("display", "block");
                            $(".applyVipTip").text("未找到数据！");
                            $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                            $(".applyVipTip").css("color", "#e33232");
                        }
                    }
                },
                error: function (err) {
                }
            });
        });

        //按最新排序
        $(".songListsNew").click(function () {
            $(".songListsTitle").text("全部风格");
            $(".cateListBox").css("display", "none");
            $http({
                url: urlHref + 'getSongByTimeApi',
                method: 'GET'
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.songList = result.data;
                }
            }).error(function (data, header, config, status) {
            });
        });
    }])

    //问题中心
    .controller('serverHomeController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //常见问题展示
        $http({
            url: urlHref + 'getFeedBackApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                if (result.data.length > 11) {
                    $scope.problemList = result.data.slice(0, 11);
                } else {
                    $scope.problemList = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });
    }])

    //新歌上架
    .controller('newAlbumController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //热门推荐
        $http({
            url: urlHref + 'getSongByHotApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.allNewSong = result.data;
                if (result.data.length > 10) {
                    $scope.hotNewSong = result.data.slice(0, 10);
                } else {
                    $scope.hotNewSong = result.data;
                }
            }
        }).error(function (data, header, config, status) {
        });

        //全部新歌
        $http({
            url: urlHref + 'getSongByTimeApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.allNewSong = result.data;
            }
        }).error(function (data, header, config, status) {
        });

        //点击类别时
        $(".areaList a").click(function () {
            var smallType = $(this).attr("data-smallType");
            if (smallType == "all") {
                $http({
                    url: urlHref + 'getSongByTimeApi',
                    method: 'GET'
                }).success(function (result, header, config, status) {
                    if (result.state == 200) {
                        $scope.allNewSong = result.data;
                    }
                }).error(function (data, header, config, status) {
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: urlHref + 'getSongByTypeApi',
                    data: {
                        smallType: smallType
                    },
                    success: function (result) {
                        if (result.state == 200) {
                            if (result.data.length > 0) {
                                //渲染数据
                                $scope.allNewSong = result.data;
                                $scope.$apply();
                            } else {
                                $scope.allNewSong = "";
                                $scope.$apply();
                                $(".dialog").css("display", "block");
                                $(".applyAlert").css("display", "block");
                                $(".applyVipTip").text("未找到数据！");
                                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                                $(".applyVipTip").css("color", "#e33232");
                            }
                        }
                    },
                    error: function (err) {
                    }
                });
            }
        });
    }])

    //管理中心之会员管理
    .controller('manageMemberController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //会员信息展示
        $http({
            url: urlHref + 'getMemberApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.memberList = result.data;
                //会员数目
                $scope.memberNum = {
                    memberNum: result.data.length
                };
            } else if (result.state == 0) {
                //会员数目
                $scope.memberNum = {
                    memberNum: 0
                };
            }
        }).error(function (data, header, config, status) {
        });
        //删除会员
        $(document).on("click", ".delMemberBtn", function () {
            var userId = $(this).parent().attr("data-userId");
            $.ajax({
                type: 'POST',
                url: urlHref + 'delMemberApi',
                data: {
                    userId: userId
                },
                success: function (result) {
                    if (result.state == 200) {
                        $(".dialog").css("display", "block");
                        $(".applyAlert").css("display", "block");
                        $(".applyVipTip").text("删除成功！");
                        $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                        $(".applyVipTip").css("color", "#69b946");
                        $scope.memberList = result.data;
                        //会员数目
                        $scope.memberNum = {
                            memberNum: result.data.length
                        };
                        $scope.$apply();
                    } else if (result.state == 0) {
                        //会员数目
                        $scope.memberNum = {
                            memberNum: 0
                        };
                        $scope.$apply();
                    } else {
                        $(".dialog").css("display", "block");
                        $(".applyAlert").css("display", "block");
                        $(".applyVipTip").text("删除失败，请稍后再试！");
                        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                        $(".applyVipTip").css("color", "#e33232");
                    }
                },
                error: function (err) {
                }
            });
        });

        //禁用用户或者解封用户
        $(document).on("click", ".lockPubBtn", function () {
            var userId = $(this).parent().attr("data-userId");
            var userState = $(this).parent().attr("data-userState");
            if (userState == 0) {
                userState = -1;
            } else if (userState == -1) {
                userState = 0;
            }
            $.ajax({
                type: 'POST',
                url: urlHref + 'lockUserApi',
                data: {
                    userId: userId,
                    userState: userState
                },
                success: function (result) {
                    if (result.state == 200) {
                        $scope.memberList = result.data;
                        //会员数目
                        $scope.memberNum = {
                            memberNum: result.data.length
                        };
                        $scope.$apply();
                    } else if (result.state == 0) {
                        //会员数目
                        $scope.memberNum = {
                            memberNum: 0
                        };
                        $scope.$apply();
                    }
                },
                error: function (err) {
                }
            });
        });
    }])

    //管理中心之歌曲管理
    .controller('manageSongController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //歌曲信息展示
        $http({
            url: urlHref + 'getSongByTimeApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.songList = result.data;
                //歌曲数目
                $scope.songNum = {
                    songNum: result.data.length
                };
            } else if (result.state == 0) {
                //歌曲数目
                $scope.songNum = {
                    songNum: 0
                };
            }
        }).error(function (data, header, config, status) {
        });

        //删除歌曲操作
        $(document).on("click",".delSongBtn",function(){
            var songId = $(this).parent().attr("data-songId");
            $http({
                url: urlHref + 'delSongApi',
                method: 'POST',
                data:{
                    songId:songId
                }
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $(".dialog").css("display", "block");
                    $(".applyAlert").css("display", "block");
                    $(".applyVipTip").text("删除成功！");
                    $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                    $(".applyVipTip").css("color", "#69b946");
                    $scope.songList = result.data;
                    //歌曲数目
                    $scope.songNum = {
                        songNum: result.data.length
                    };
                } else if (result.state == 0) {
                    //歌曲数目
                    $scope.songNum = {
                        songNum: 0
                    };
                }else {
                    $(".dialog").css("display", "block");
                    $(".applyAlert").css("display", "block");
                    $(".applyVipTip").text("删除失败，请稍后再试！");
                    $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                    $(".applyVipTip").css("color", "#e33232");
                }
            }).error(function (data, header, config, status) {
            });
        });
    }])

    //管理中心之歌手管理
    .controller('manageArtistController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //歌手信息展示
        $http({
            url: urlHref + 'getArtistByTimeApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.artistList = result.data;
                //歌手数目
                $scope.artistNum = {
                    artistNum: result.data.length
                };
            } else if (result.state == 0) {
                //歌手数目
                $scope.artistNum = {
                    artistNum: result.data.length
                };
            }
        }).error(function (data, header, config, status) {
        });

        //删除歌手操作
        $(document).on("click",".delArtistBtn",function(){
            var artistId = $(this).parent().attr("data-artistId");
            $http({
                url: urlHref + 'delArtistApi',
                method: 'POST',
                data:{
                    artistId:artistId
                }
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $(".dialog").css("display", "block");
                    $(".applyAlert").css("display", "block");
                    $(".applyVipTip").text("删除成功！");
                    $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                    $(".applyVipTip").css("color", "#69b946");
                    $scope.artistList = result.data;
                    //歌曲数目
                    $scope.artistNum = {
                        artistNum: result.data.length
                    };
                } else if (result.state == 0) {
                    //歌曲数目
                    $scope.artistNum = {
                        artistNum: 0
                    };
                }else {
                    $(".dialog").css("display", "block");
                    $(".applyAlert").css("display", "block");
                    $(".applyVipTip").text("删除失败，请稍后再试！");
                    $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                    $(".applyVipTip").css("color", "#e33232");
                }
            }).error(function (data, header, config, status) {
            });
        });
    }])

    //管理中心之评论管理
    .controller('manageCommentController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //评论信息展示
        $http({
            url: urlHref + 'getAllCommentsApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.commentList = result.data;
                //评论数目
                $scope.commentNum = {
                    commentNum: result.data.length
                };
            } else if (result.state == 0) {
                //评论数目
                $scope.commentNum = {
                    commentNum: 0
                };
            }
        }).error(function (data, header, config, status) {
        });

        //删除评论操作
        $(document).on("click",".delCommentBtn",function(){
            var commentId = $(this).parent().attr("data-comId");
            $http({
                url: urlHref + 'delCommentApi',
                method: 'POST',
                data:{
                    commentId:commentId
                }
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $(".dialog").css("display", "block");
                    $(".applyAlert").css("display", "block");
                    $(".applyVipTip").text("删除成功！");
                    $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                    $(".applyVipTip").css("color", "#69b946");
                    $scope.commentList = result.data;
                    //评论数目
                    $scope.commentNum = {
                        commentNum: result.data.length
                    };
                } else if (result.state == 0) {
                    //评论数目
                    $scope.commentNum = {
                        commentNum: 0
                    };
                }else {
                    $(".dialog").css("display", "block");
                    $(".applyAlert").css("display", "block");
                    $(".applyVipTip").text("删除失败，请稍后再试！");
                    $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                    $(".applyVipTip").css("color", "#e33232");
                }
            }).error(function (data, header, config, status) {
            });
        });
    }])

    //管理中心之问题管理
    .controller('manageProblemController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //问题展示
        $http({
            url: urlHref + 'getFeedBackApi',
            method: 'GET'
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.problemList = result.data;
                //问题数目
                $scope.problemNum = {
                    problemNum: result.data.length
                };
            } else if (result.state == 0) {
                //问题数目
                $scope.problemNum = {
                    problemNum: 0
                };
            }
        }).error(function (data, header, config, status) {
        });
    }])

    //管理中心之修改歌曲
    .controller('modifySongController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        var provinceArr = ["请选择", "语种", "风格", "场景", "情感", "主题"];
        var cityArr = [
            ['请选择'],
            ['华语', '欧美', '日语', '韩语', '粤语', '小语种'],
            ['流行', '摇滚', '民谣', '电子', '舞曲', '说唱', '轻音乐', '爵士', '乡村', 'R&B/Soul', '古典', '民族', '英伦', '金属', '朋克', '蓝调', '雷鬼', '世界音乐', '拉丁', '另类/独立', 'New Age', '古风', '后摇', 'Bossa Nova'],
            ['清晨', '夜晚', '学习', '工作', '午休', '下午茶', '地铁', '驾车', '运动', '旅行', '散步', '酒吧'],
            ['怀旧', '清新', '浪漫', '性感', '伤感', '治愈', '放松', '孤独', '感动', '兴奋', '快乐', '安静', '思念'],
            ['影视原声', 'ACG', '校园', '游戏', '70后', '80后', '90后', '00后', '网络歌曲', 'KTV', '经典', '翻唱', '吉他', '钢琴', '器乐', '儿童', '榜单']
        ];

        //根据城市二级联动改编
        var cBox = this;
        //省份数据
        cBox.provinceArr = provinceArr;
        //城市数据
        cBox.cityArr = cityArr;
        //默认为省份
        cBox.getCityArr = cBox.cityArr[0];
        //这个是索引数组，根据切换得出切换的索引就可以得到省份及城市
        cBox.getCityIndexArr = ['0', '0'];

        //改变省份触发的事件 [根据索引更改城市数据]
        cBox.provinceChange = function (index) {
            //根据索引写入城市数据
            cBox.getCityArr = cBox.cityArr[index];
            //清除残留的数据
            cBox.getCityIndexArr[1] = '0';
            cBox.getCityIndexArr[0] = index;
            //输出查看数据
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //console.log(cBox.getCityIndexArr,provinceArr[cBox.getCityIndexArr[0]],cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        };
        //改变城市触发的事件
        cBox.cityChange = function (index) {
            cBox.getCityIndexArr[1] = index;
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //输出查看数据
            //console.log(cBox.getCityIndexArr, provinceArr[cBox.getCityIndexArr[0]], cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        }
    }])

    //管理中心之修改歌手
    .controller('modifyArtistController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        var provinceArr = ["请选择", "华语", "欧美", "日本", "韩国", "其他"];
        var cityArr = [
            ['请选择'],
            ['华语男歌手', '华语女歌手', '华语组合/乐队'],
            ['欧美男歌手', '欧美女歌手', '欧美组合/乐队'],
            ['日本男歌手', '日本女歌手', '日本组合/乐队'],
            ['韩国男歌手', '韩国女歌手', '韩国组合/乐队'],
            ['其他男歌手', '其他女歌手', '其他组合/乐队']
        ];

        //根据城市二级联动改编
        var cBox = this;
        //省份数据
        cBox.provinceArr = provinceArr;
        //城市数据
        cBox.cityArr = cityArr;
        //默认为省份
        cBox.getCityArr = cBox.cityArr[0];
        //这个是索引数组，根据切换得出切换的索引就可以得到省份及城市
        cBox.getCityIndexArr = ['0', '0'];

        //改变省份触发的事件 [根据索引更改城市数据]
        cBox.provinceChange = function (index) {
            //根据索引写入城市数据
            cBox.getCityArr = cBox.cityArr[index];
            //清除残留的数据
            cBox.getCityIndexArr[1] = '0';
            cBox.getCityIndexArr[0] = index;
            //输出查看数据
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //console.log(cBox.getCityIndexArr,provinceArr[cBox.getCityIndexArr[0]],cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        };
        //改变城市触发的事件
        cBox.cityChange = function (index) {
            cBox.getCityIndexArr[1] = index;
            $(".bigType").val(provinceArr[cBox.getCityIndexArr[0]]);
            $(".smallType").val(cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
            //输出查看数据
            //console.log(cBox.getCityIndexArr, provinceArr[cBox.getCityIndexArr[0]], cityArr[cBox.getCityIndexArr[0]][cBox.getCityIndexArr[1]]);
        }
    }])

    //排行榜
    .controller('topListController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {
        //默认请求音乐新歌榜
        var topListType = $stateParams.topListType;
        if (topListType == ""){
            topListType = "音乐新歌榜";
            $scope.topListName = {
                topListName: "音乐新歌榜"
            };
            $scope.topListImg = {
                topListImg: "frameImg/songl1.jpg"
            };
        }else if (topListType == "toplistSoar"){
            topListType = "音乐飙升榜";
            $scope.topListName = {
                topListName: "音乐飙升榜"
            };
            $scope.topListImg = {
                topListImg: "frameImg/songl2.jpg"
            };
        }else if(topListType == "toplistOriginal"){
            topListType = "原创音乐榜";
            $scope.topListName = {
                topListName: "原创音乐榜"
            };
            $scope.topListImg = {
                topListImg: "frameImg/songl3.jpg"
            };
        }
        $http({
            url: urlHref + 'getTopListByTypeApi',
            method: 'POST',
            data:{
                toplistType:topListType
            }
        }).success(function (result, header, config, status) {
            if (result.state == 200) {
                $scope.topList = result.data;
                //榜单歌曲数目
                $scope.topListNum = {
                    topListNum: result.data.length
                };
            } else if (result.state == 0) {
                //榜单歌曲数目
                $scope.topListNum = {
                    topListNum: 0
                };
            }
        }).error(function (data, header, config, status) {
        });

        //点击榜单时，请求对应榜单数据
        $(document).on("click",".pubTopListItem",function(){
            var toplistName = $(this).find(".topName").html().trim();
            $http({
                url: urlHref + 'getTopListByTypeApi',
                method: 'POST',
                data:{
                    toplistType:toplistName
                }
            }).success(function (result, header, config, status) {
                if (result.state == 200) {
                    $scope.topList = result.data;
                    //榜单歌曲数目
                    $scope.topListNum = {
                        topListNum: result.data.length
                    };
                } else if (result.state == 0) {
                    $scope.topList = "";
                    //榜单歌曲数目
                    $scope.topListNum = {
                        topListNum: 0
                    };
                    $(".dialog").css("display","block");
                    $(".applyAlert").css("display","block");
                    $(".applyVipTip").html("当前榜单数据为空！");
                    $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
                    $(".applyVipTip").css("color","#e33232");
                }
            }).error(function (data, header, config, status) {
            });
        });
    }]);








