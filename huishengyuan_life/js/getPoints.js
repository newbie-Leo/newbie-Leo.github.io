var map = new AMap.Map('container',{
    resizeEnable: true,
    zoom: 17,
    center: [116.508453,39.908828]
});

Markers = [];
AMap.event.addListener(map, "click",
    function(e){
        console.log(e.lnglat.toString());
        $("#ponts_div_inner").removeClass("nodisplay");
        var lnglat = e.lnglat.toString();
        var lnglat_html = "<span class=\"code_span\">[" + lnglat + "],</span><br>";
        $(lnglat_html).appendTo($("#ponts_div_inner"));
        $("#clear_button").removeClass("am-disabled");
    });


var mousetool;
map.plugin(["AMap.MouseTool"],function(){
    mousetool = new AMap.MouseTool(map);
    mousetool.polyline();
});

AMap.event.addListener(mousetool, "draw",
    function(e){
        console.log(e.type);
        console.log(e.obj);
    });

$("#clear_button").click(function(){
    map.clearMap();
    $("#ponts_div_inner").addClass("nodisplay");
    $("#ponts_div_inner").html("");
    $(this).addClass("am-disabled");
});

