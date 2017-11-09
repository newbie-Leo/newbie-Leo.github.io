var map = new AMap.Map('container',{
    resizeEnable: true,
    zoom: 17,
    center: [116.508453,39.908828]
});

var colors = [
      "#109618", "#FF9933", "#0e90d2", "#0099c6", "#dd4477", "#66aa00",
      "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
      "#651067", "#329262", "#5574a6", "#3b3eac"
];

function initPathLine(data, init_callback, png, autoRotate){
    AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
        }
        pathSimplifierIns = initPage(PathSimplifier, data);
        init_callback(pathSimplifierIns, PathSimplifier, data, png, autoRotate);
    });
}


function init_navgs(pathSimplifierIns, PathSimplifier, data, png, autoRotate){
    navgs = [];
    if(!autoRotate){
        autoRotate = false;
    }
    button_classes = ['am-btn-success',
            'am-btn-warning', 'am-btn-primary',
            'am-btn-primary'];
    for (var i = 0; i < data.length; i++) {
        var navg = pathSimplifierIns.createPathNavigator(i, //关联第1条轨迹
        {
            loop: true, //循环播放
            speed: 300,
            pathNavigatorStyle: {
                width: 15,
                height: 24,
                //使用图片
                content: PathSimplifier.Render.Canvas.getImageContent(png, onload, onerror),
                strokeStyle: null,
                fillStyle: null,
                autoRotate: autoRotate,
                //经过路径的样式
                pathLinePassedStyle: {
                    lineWidth: 6,
                    strokeStyle: '#B0B0B0',
                    dirArrowStyle: {
                        strokeStyle: 'black'
                    }
                }
            }
        });
        navgs.push(navg);
        navg.start();

        button_div = "<div class=\"button-group\">" +
            "<button id=\"path-button-" + i + "\" type=\"button\"" +
            " class=\"am-btn " + button_classes[i] + " am-round path-button\">" +
            data[i]["name"] +
            "</button></div>";
        $(button_div).appendTo($("#buttons_div"));
        var path_button = $("#path-button-"+i);
        path_button.attr("zindex", i);
    }

    $(".path-button").click(function(){
        $(".am-icon-check").remove();
        $("<i class=\"am-icon-check\"></i> ").prependTo(
            this);
        pathSimplifierIns.toggleTopOfPath($(this).attr("zindex"), true);
        pathSimplifierIns.setSelectedPathIndex($(this).attr("zindex"));

        for(var j=0; j < navgs.length; j++){
            if(j==$(this).attr("zindex")){
                navgs[j].start();
            }else{
                navgs[j].stop();
            }
        }
    });
}




function initPage(PathSimplifier, data) {
//创建组件实例
    var pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        map: map, //所属的地图实例
        getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
        },
        getHoverTitle: function(pathData, pathIndex, pointIndex) {
            //返回鼠标悬停时显示的信息
            if (pointIndex >= 0) {
                //鼠标悬停在某个轨迹节点上
                return pathData.name;
            }
            //鼠标悬停在节点之间的连线上
            return pathData.name;
        },

        renderOptions: {
            pathLineStyle: {
                dirArrowStyle: true
            },
            getPathStyle: function(pathItem, zoom) {
                var color = colors[pathItem.pathIndex % colors.length],
                    lineWidth = Math.round(2 * Math.pow(1.1, zoom - 3));
                return {
                    pathLineStyle: {
                        strokeStyle: color,
                        lineWidth: lineWidth,
                        dirArrowStyle: true
                    },
                    pathLineSelectedStyle: {
                        lineWidth: lineWidth + 2
                    },
                    pathNavigatorStyle: {
                        fillStyle: color
                    }
                };
            }
        }
    });

    pathSimplifierIns.setData(data);
    pathSimplifierIns.on('pathClick pointClick', function(e, info){
//info.pathData 即是相关的轨迹数据，如果info.pointIndex >= 0，则表示由轨迹上的节点触发
    });
    return pathSimplifierIns;
}