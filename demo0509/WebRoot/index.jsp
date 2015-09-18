<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" type="text/css" href="css/common.css">
  </head>
  
  <body>
    <div style='width:440px;height:200px;margin :200px auto;background:darkblue;'>
		不是中文  not china  not my maind
		
		
	</div>
  </body>
</html>


<script type='text/javascript'>
	
//地图设置
		var mapData = {} ;
		$.each(JSON.parse(base.json||null)||[],function(index,value){
			if('locationX' in value){
				mapData = value ;
			}
		});
		var map = new qq.maps.Map(document.getElementById('mapView'),{
	        // 地图的中心地理坐标。
	        center: new qq.maps.LatLng( mapData.locationY,mapData.locationX ) ,
			zoom : 15
	    });		
		
		$('#mapView,.mapTp').on('tap',function(){
			ut.jumpMap( mapData.locationY,mapData.locationX ,root.articleUser.detailData.title);
		});
		
//banner 设置

	cp.banner({ timer : 900 , height : 380 , isFull : true , bullets : true });
	
	
	$(document).on('tap','.houseTp',function(){
			location = $(this).attr('link') ;
		});
		
	
	
	
	
	
</script>


















