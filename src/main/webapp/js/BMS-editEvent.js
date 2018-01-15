$(function(){
	$(document).click(function(){
		$(".emulate").hide();
	})
	
	$(".selinput").click(function(e){
    	e.stopPropagation();
    	var me=this;
    	$(me).next().show();
    	$(me).next().children().click(function(){
    		$(me).val($(this).text());
    		$("#islog").attr("altvalue",$(this).attr("altvalue"));
    		if($(this).attr("altvalue")=='1'){
    			$("#firstli").removeAttr("style");
    			$("#sndli").removeAttr("style");
    			$("#thridli").removeAttr("style");
    		}else if($(this).attr("altvalue")=='0'){
    			$("#firstli").attr("style","display:none");
    			$("#sndli").attr("style","display:none");
    			$("#thridli").attr("style","display:none");
    		}
    		$(me).next().hide();
    	})
    })
    
	getEventInfo();
	
})
function filldata(){
	showmap();
	 map = new BMap.Map("allmap");
	// 创建控件
	var myZoomCtrl = new ZoomControl();
	// 添加到地图当中
	map.addControl(myZoomCtrl);	
	var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "suggestId"
		,"location" : map
	});



	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		/*document.getElementById("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;*/
		
		setPlace();
	});
	var gps=$("#gps").html()
	var longitude=parseFloat(gps.slice(1,gps.indexOf(",")));
	var latitude=parseFloat(gps.slice(gps.indexOf(",")+1,gps.indexOf(")")));
	var gpsdescription=gps.slice(gps.indexOf(")")+1);
	var point = new BMap.Point(longitude,latitude);
	var marker = new BMap.Marker(point); // 创建点	
	var circle = new BMap.Circle(point,20000,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}); //创建圆	
	map.addOverlay(marker);            //增加点
	map.addOverlay(circle); 
	map.centerAndZoom(point,15);
	map.enableScrollWheelZoom(true);
	$("#longitude").val(longitude);
	$("#latitude").val(latitude);
	$("#gpsdescription").val(gpsdescription)
}
var mid=sessionStorage.getItem("mid");
function getEventInfo(){
	$.ajax({
		type: "GET",
        url: "../findMatchInfoByMid",
        dataType: "JSON",
        async:false,
        data: {
        		"mid":mid
        	},
        success: function(data){
        	if(data.status == 0){
        		var info=data.info;
        		$("#mname").val(info.mname);
        		$("#year").val(info.year);
        		$("#manager").val(info.manager);
        		$("#organizer").val(info.organizer);
        		$("#organizertel").val(info.organizertel);
        		$("#address").val(info.address);
        		$("#startdate").val(info.startdate);
        		$("#enddate").val(info.enddate);
        		$("#maxcnt").val(info.maxcnt);
        		$("#signstartdate").val(info.signstartdate);
        		$("#signenddate").val(info.signenddate);
        		$("#mincnt").val(info.mincnt);
        		$("#unitprice").val(info.unitprice/100);
        		$("#islog").val($("#islog").next().find("[altvalue="+info.islog+"]").text());
        		if(info.islog=="1"){
        			$("#firstli").removeAttr("style");
        			$("#sndli").removeAttr("style");
        			$("#thridli").removeAttr("style"); 			
        		}else if(info.islog=="0"){
        			$("#firstli").attr("style","display:none");
        			$("#sndli").attr("style","display:none");
        			$("#thridli").attr("style","display:none");
        		}
        		$("#firstsublogend").val(info.firstsublogend);
        		$("#sndsublogend").val(info.sndsublogend);
        		$("#thirdsublogend").val(info.thirdsublogend);
        		$("#introduce").val(info.introduce);
        		$("#description").html(info.description);
        		editor.insertHtml(info.description);
        		$("#gps").html(info.gps);
        		if(info.attachurl!=""){
        			var urlarr=info.attachurl.split(",");
        			var htmls="";
        			$.each(urlarr,function(i,fileurl){
        				htmls+='<div class="enclosureitem"><a class="filename" href="'+fileurl+'">'+fileurl.slice(fileurl.indexOf("_")+1)
								+'</a><form class="editform" enctype="multipart/form-data" method="post">'
								+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editFile(this)" name="files"></a>'
								+'<input hidden name="savetype" value="01">'
								+'<input hidden name="filename" value="'+fileurl+'">'
								+'</form><a class="delfile" '
								+'onclick="alertConfirm(\'2\',\'确定删除该附件吗？\',\'delFile()\',this)">&times;</a></div>';
        			})
        			$("#myform1").before(htmls);
        		}
        		if(info.awardsmodel!=""&&info.awardsmodel!=undefined){
        			var htmls="";
        			htmls+='<div class="enclosureitem"><a class="filename" href="'+info.awardsmodel+'">'
        				+info.awardsmodel.slice(info.awardsmodel.indexOf("_")+1)
						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editModel(this)" name="files"></a>'
						+'<input hidden name="savetype" value="02">'
						+'<input hidden class="modelname" value="'+info.awardsmodel+'">'
						+'</form></div>';
        			$(".awardsmodel").html(htmls);
        		}
        		if(info.cupmodel!=""&&info.cupmodel!=undefined){
        			var htmls="";
        			htmls+='<div class="enclosureitem"><a class="filename" href="'+info.cupmodel+'">'
        				+info.cupmodel.slice(info.cupmodel.indexOf("_")+1)
						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editModel(this)" name="files"></a>'
						+'<input hidden name="savetype" value="02">'
						+'<input hidden class="modelname" value="'+info.cupmodel+'">'
						+'</form></div>';
        			$(".cupmodel").html(htmls);
        		}
        		if(info.entrymodel!=""&&info.entrymodel!=undefined){
        			var htmls="";
        			htmls+='<div class="enclosureitem"><a class="filename" href="'+info.entrymodel+'">'
        				+info.entrymodel.slice(info.entrymodel.indexOf("_")+1)
						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editModel(this)" name="files"></a>'
						+'<input hidden name="savetype" value="02">'
						+'<input hidden class="modelname" value="'+info.entrymodel+'">'
						+'</form></div>';
        			$(".entrymodel").html(htmls);
        		}
        		if(info.badgemodel!=""&&info.badgemodel!=undefined){
        			var htmls="";
        			htmls+='<div class="enclosureitem"><a class="filename" href="'+info.badgemodel+'">'
        				+info.badgemodel.slice(info.badgemodel.indexOf("_")+1)
						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editModel(this)" name="files"></a>'
						+'<input hidden name="savetype" value="02">'
						+'<input hidden class="modelname" value="'+info.badgemodel+'">'
						+'</form></div>';
        			$(".badgemodel").html(htmls);
        		}
        	}else if(data.status == 1){
        		alertMsg("2",data.errmsg,"fail")
        	}
        },
	})
}

function uploadFile(){
	var namestr=$("#file1").val();
	var filename=namestr.split("\\")[namestr.split("\\").length-1];
	var htmls="";
	if(namestr!=""){
		$("#myform1").ajaxSubmit({
			url : "../uploadFiles",
			dataType : 'json',
			async : false,
			success : function(data) {
				if(data.status==0){
					console.log(data)
					htmls+='<div class="enclosureitem"><a class="filename">'+filename
    						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
    						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editFile(this)" name="files"></a>'
    						+'<input hidden name="savetype" value="01">'
    						+'<input hidden name="filename" value="'+data.urls+'">'
    						+'</form><a class="delfile" '
    						+'onclick="alertConfirm(\'2\',\'确定删除该附件吗？\',\'delFile()\',this)">&times;</a></div>';
					$("#myform1").before(htmls);
					alertMsg("2","上传成功！","success")
				}else if(data.status==1){
					alertMsg("2",data.errmsg,"fail")
				}
			},
			error:function(){
				alertMsg("2","上传失败！","fail")
			}
	    })
	}	
}

function editFile(obj){
var namestr=$(obj).val();
var filename=namestr.split("\\")[namestr.split("\\").length-1];
var htmls="";
if(namestr!=""){
	$(obj).parent().parent().ajaxSubmit({
		url : "../uploadFiles",
		dataType : 'json',
		async : false,
		success : function(data) {
			if(data.status==0){
				console.log(data)
				htmls+='<a class="filename">'+filename
						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editFile(this)" name="files"></a>'
						+'<input hidden name="savetype" value="01">'
						+'<input hidden name="filename" value="'+data.urls+'">'
						+'</form><a class="delfile" '
						+'onclick="alertConfirm(\'2\',\'确定删除该附件吗？\',\'delFile()\',this)">&times;</a>';
				$(obj).parent().parent().parent().html(htmls);
				alertMsg("2","修改成功！","success")
			}else if(data.status==1){
				alertMsg("2",data.errmsg,"fail")
			}
		},
		error:function(){
			alertMsg("2","上传失败！","fail")
		}
    })
}	
}

function delFile(obj){
	closeWin();
	$(tempobj).parent().remove();
}

function updateEvent(){
	var mname=$("#mname").val();
	var year=$("#year").val();
	var manager=$("#manager").val();
	var organizer=$("#organizer").val();
	var organizertel=$("#organizertel").val();
	var address=$("#address").val();
	var startdate=$("#startdate").val();
	var enddate=$("#enddate").val();
	var maxcnt=$("#maxcnt").val();
	var signstartdate=$("#signstartdate").val();
	var signenddate=$("#signenddate").val();
	var mincnt=$("#mincnt").val();
	var unitprice=$("#unitprice").val();
	var islog=$("#islog").val();
	var islog_altvalue=$("#islog").attr("altvalue");
	var firstsublogend=$("#firstsublogend").val();
	var sndsublogend=$("#sndsublogend").val();
	var thirdsublogend=$("#thirdsublogend").val();
	var introduce=$("#introduce").val();
	var description=$("#description").val();
	var awardsmodel=$(".awardsmodel .modelname").val();
	var cupmodel=$(".cupmodel .modelname").val();
	var entrymodel=$(".entrymodel .modelname").val();
	var badgemodel=$(".badgemodel .modelname").val();
	var attachurl=[];
	if(mname.trim()==""){
		alertMsg("2","请填写赛事名称！","fail")
		return;
	}
	if(year.trim()==""){
		alertMsg("2","请选择举办年份！","fail")
		return;
	}
	if(manager.trim()==""){
		alertMsg("2","请填写负责人！","fail")
		return;
	}else if(manager.indexOf(",")!=-1){
		alertMsg("2","负责人姓名不允许出现非法字符！","fail");
		return;
	}
	if(organizer.trim()==""){
		alertMsg("2","请填写主办方！","fail")
		return;
	}
	if(organizertel.trim()==""){
		alertMsg("2","请填写主办方电话！","fail")
		return;
	}
	if(address.trim()==""){
		alertMsg("2","请填写举办地点！","fail")
		return;
	}
	if(startdate.trim()==""){
		alertMsg("2","请选择开始时间！","fail")
		return;
	}
	if(enddate.trim()==""){
		alertMsg("2","请选择结束时间！","fail")
		return;
	}
	
	if(signstartdate.trim()==""){
		alertMsg("2","请选择报名开始时间！","fail")
		return;
	}
	if(signenddate.trim()==""){
		alertMsg("2","请选择报名截止时间！","fail")
		return;
	}
	if(unitprice.trim()==""){
		alertMsg("2","请填写单价！","fail")
		return;
	}else if(!checkMoneyFormat(unitprice)){
		alertMsg("2","单价格式不正确！","fail")
		return;
	}
	if(islog.trim()==""){
		alertMsg("2","请选择提交日志！","fail")
		return;
	}else{
		if(islog_altvalue=='1'){
			if(firstsublogend.trim()==""){
				alertMsg("2","请选择阶段一结束日！","fail")
				return;
			}
			if(sndsublogend.trim()==""){
				alertMsg("2","请选择阶段二结束日！","fail")
				return;
			}
			if(thirdsublogend.trim()==""){
				alertMsg("2","请选择阶段三结束日！","fail")
				return;
			}
		}else{
			firstsublogend = "";
			sndsublogend = "";
			thirdsublogend = "";
		}
	}
	if(introduce.trim()==""){
		alertMsg("2","请填写赛事简介！","fail")
		return;
	}
	if(description.trim()==""){
		alertMsg("2","请填写赛事详情！","fail")
		return;
	}
	var gps=$("#gps").html()
	if(gps.trim()==""){
		alertMsg("2","请选择坐标！","fail")
		return;
	}
	$("[name=filename]").each(function(){
		attachurl.push($(this).val())
	})
	/*if(awardsmodel==""||awardsmodel==undefined){
		alertMsg("2","请上传获奖证书模板！","fail")
		return;
	}
	if(cupmodel==""||cupmodel==undefined){
		alertMsg("2","请上传奖励证书模板！","fail")
		return;
	}
	if(entrymodel==""||entrymodel==undefined){
		alertMsg("2","请上传参赛证书模板！","fail")
		return;
	}
	if(badgemodel==""||badgemodel==undefined){
		alertMsg("2","请上传胸卡模板！","fail")
		return;
	}*/
	$.ajax({
		type: "GET",
        url: "../updateMatch",
        dataType: "JSON",
        async:false,
        data: {
        	"mid":mid,
        	"mname":mname,
        	"year":year,
        	"manager":manager,
        	"organizer":organizer,
        	"organizertel":organizertel,
        	"address":address,
        	"startdate":startdate,
        	"enddate":enddate,
        	"maxcnt":maxcnt,
        	"signstartdate":signstartdate,
        	"signenddate":signenddate,
        	"unitprice":parseInt(unitprice*100),
        	"mincnt":mincnt,
        	"introduce":introduce,
        	"description":description,
        	"attachurl":attachurl.join(","),
        	"gps":gps,
        	"awardsmodel":awardsmodel,
        	"cupmodel":cupmodel,
        	"entrymodel":entrymodel,
        	"badgemodel":"",
        	"islog":islog_altvalue,
        	"firstsublogend":firstsublogend,
        	"sndsublogend":sndsublogend,
        	"thirdsublogend":thirdsublogend
        	},
        success: function(data){
        	if(data.status == 0){
        		alertMsg("2","修改成功！","success")
        		localStorage.removeItem("longitude");
        		localStorage.removeItem("latitude");
        		localStorage.removeItem("gpsdescription");
        		setTimeout('history.back()',2000)
        	}else if(data.status == 1){
        		alertMsg("2",data.errmsg,"fail")
        	}
        },
	})
}

function uploadModel(obj){
	var namestr=$(obj).val();
	var filetype=$(obj).val().slice($(obj).val().lastIndexOf(".")+1).toUpperCase();
	var filename=namestr.split("\\")[namestr.split("\\").length-1];
	var htmls="";
	if(namestr!=""){
		if(filetype=="PDF"){
			$(obj).parent().parent().ajaxSubmit({
				url : "../uploadFiles",
				dataType : 'json',
				async : false,
				success : function(data) {
					if(data.status==0){
						htmls+='<div class="enclosureitem"><a class="filename">'+filename
	    						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
	    						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editModel(this)" name="files"></a>'
	    						+'<input hidden name="savetype" value="02">'
	    						+'<input hidden class="modelname" value="'+data.urls+'">'
	    						+'</form></div>';
						$(obj).parent().parent().parent().html(htmls);
						alertMsg("2","上传成功！","success")
					}else if(data.status==1){
						alertMsg("2",data.errmsg,"fail")
					}
				},
				error:function(){
					alertMsg("2","上传失败！","fail")
				}
		    })
		}else{
			alertMsg("2","模板文件应为pdf文件！","fail")
		}	
	}	
}

function editModel(obj){
	var namestr=$(obj).val();
	var filetype=$(obj).val().slice($(obj).val().lastIndexOf(".")+1).toUpperCase();
	var filename=namestr.split("\\")[namestr.split("\\").length-1];
	var htmls="";
	if(namestr!=""){
		if(filetype=="PDF"){
			$(obj).parent().parent().ajaxSubmit({
				url : "../uploadFiles",
				dataType : 'json',
				async : false,
				success : function(data) {
					if(data.status==0){
						htmls+='<a class="filename">'+filename
	    						+'</a><form class="editform" enctype="multipart/form-data" method="post">'
	    						+'<a class="editfile">更改<input type="file" class="hidfile" onchange="editModel(this)" name="files"></a>'
	    						+'<input hidden name="savetype" value="02">'
	    						+'<input hidden class="modelname" value="'+data.urls+'">'
	    						+'</form>';
						$(obj).parent().parent().parent().html(htmls);
						alertMsg("2","修改成功！","success")
					}else if(data.status==1){
						alertMsg("2",data.errmsg,"fail")
					}
				},
				error:function(){
					alertMsg("2","上传失败！","fail")
				}
		    })
		}else{
			alertMsg("2","模板文件应为pdf文件！","fail")
		}
	}	
}

function checkMoneyFormat(val){
    var reg = /^(([1-9]\d*)|(([1-9][0-9]*\.[0-9]{1,2})|([0]\.[0-9]{1,2})|0))$/;
    var isMoneyFormatRight = reg.test(val);
    return isMoneyFormatRight;
}

