$(function(){
	
	var musicFile = "";
	var musicAudio = window.musicAudio || {};
	var songIndex = 0;
	var bVolume = true;

	/*歌曲播放时间的格式化，将秒数格式化为“分:秒”的形式*/
	function formatTime(time) {
		var minutes = parseInt(time/60);
		var seconds = parseInt(time%60);
		seconds<10 && (seconds = "0" + seconds);
		return minutes + ":" + seconds;
	};
	/*调控音量方法*/
	HTMLAudioElement.prototype.changeVolumeTo = function(volume){
		this.volume = volume;
		$(".music_volume_on").css("width", volume*100 +"%");
	}

	musicAudio ={
		init : function(){
			var oAudio = $("#mAudio")[0];

			musicAudio.playAudio(oAudio); //自动播放

			musicAudio.playBtn(oAudio,".music_play_btn");

			$(".music_next").on("click",function(){
				musicAudio.songNext(oAudio);
			});
			$(".music_pre").on("click",function(){
				musicAudio.songPre(oAudio);
			});

			/*声音大小*/
			$(".music_volume_icon").on("click",function(){
				if(bVolume){
					oAudio.changeVolumeTo(0);
					$(this).addClass('music_volume_icon2');
					bVolume = false;
				}else{
					oAudio.changeVolumeTo(1);
					$(this).removeClass('music_volume_icon2');
					bVolume = true;
				}
			});
			$(".music_volume_bg").on("mousedown",function(ev){
				var posX = ev.clientX;
				var targetLeft = $(this).offset().left;
				var volume = (posX - targetLeft)/50;
					volume > 1 && (volume = 1);
					volume < 0 && (volume = 0);
				oAudio.changeVolumeTo(volume);
			});
			/*播放前进后退*/
			$(".music_line").on("mousedown",function(ev){
				var posX = ev.clientX;
				var targetLeft = $(this).offset().left;
				var percentage = (posX - targetLeft);///140 * 100;
				oAudio.currentTime = oAudio.duration * percentage / 280;
			});


			musicAudio.netWorkState(oAudio);
			musicAudio.ended(oAudio);
			musicAudio.songList(oAudio);
		},
		/*播放按钮*/
		playAudio : function(oA){
			if(window.HTMLAudioElement){
				var music_list = $(".music_list li").eq(songIndex),
					music_play = $(".music_play"),
					music_pause = $(".music_pause");

				if(music_list.attr("title") !== musicFile){
					oA.src = music_list.attr("title");
					musicFile = music_list.attr("title");
				}
				if(oA.paused){
					oA.play();
					music_pause.show();
					music_play.hide();
				}else{
					oA.pause();
					music_pause.hide();
					music_play.show();
				}
				//更新歌曲名
				$(".music_title").html(music_list.html());
				musicAudio.songMsg(oA);
			}
		},
		playBtn : function(oA,obj){
			$(obj).on("click",function(){
				//musicAudio.songMsg(oA);
				musicAudio.playAudio(oA);
			});
		},
		/*歌曲信息，歌曲时间*/
		songMsg : function(oA){
			$(oA).on("loadedmetadata",function(){
				var totalTime = formatTime(oA.duration);
				$(".music_time_over").html(totalTime);
			});
			$(oA).on("timeupdate",function(){
				var duration = oA.duration;
				var curTime = oA.currentTime;
				var musicLineOn = curTime/duration *100;
				$(".music_line_on").css("width", musicLineOn +"%");
				var passedTime = formatTime(curTime);
				$(".music_time_start").text(passedTime);
			});
		},
		songNext : function(oA){
			//$(".music_next").on("click",function(){
				if(songIndex < $(".music_list li").length-1){
					songIndex++;
				}else{
					songIndex = 0;
				}
				musicAudio.playAudio(oA);
			//});
		},
		songPre : function(oA){
			//$(".music_pre").on("click",function(){
				if(songIndex <= 0){
					songIndex = $(".music_list li").length-1;
				}else{
					songIndex--;
				}
				musicAudio.playAudio(oA);
			//})
		},
		songList : function(oA){
			$(".music_list li").on("click",function(){
				songIndex = $(this).index();
				musicAudio.playAudio(oA);
			})
		},
		/*当期歌曲播放结束后播下一首*/
		ended : function(oA){
			$(oA).on("ended",function(){
				musicAudio.songNext(oA);
			});
		},
		/*当前网络状态*/
		netWorkState : function(oA){
			$(oA).on("progress",function(e){
				//显示歌曲加载进度
				if(oA.buffered.length == 1){
					if(oA.buffered.start(0) == 0){
						var buffered = oA.buffered.end(0);
						var percentage = buffered/oA.duration * 100;
						console.log(percentage);
						$(".music_line_bg").css("background-size", percentage + "% 100%");
					}
				}

				switch (oA.networkState){
					case 0 : 
						console.log("初始化");
						break;
					case 1 : 
						console.log("浏览器已选择好编码格式，但尚未链接到网络");
						break;
					case 2 : 
						console.log("媒体数据加载中...");
						break;
					case 3 : 
						console.log("没有支持的编码格式，不执行加载");
						break;
				} 
			})
		}
	}
musicAudio.init();
});