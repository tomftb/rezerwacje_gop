function setMenuActive()
{
    //console.log('setMenuActive');
    $("#li-2").addClass("menu-active");
    //console.log($("#li-2"));
    //console.log(parseUrlId()); 
    removeClass();
    addClass(parseUrlId());
    //alert(parseUrlId());
}
function parseUrlId()
{
    var currentLocation = window.location;
    var res = currentLocation.search.split("=");
    return res[1];
}
function addClass(id)
{
    //console.log("addClass - "+id);
    //$('#li-'+id).addClass("menu-active");
    document.getElementById("li-"+id).setAttribute("class", "menu-active"); 
}
function removeClass()
{
    //console.log("removeClass - ");
    //$( '#li-1' ).removeClass( "menu-active" );
    //$( '#li-2' ).removeClass( "menu-active" );
    //$( '#li-3' ).removeClass( "menu-active" );
    for (i = 1; i < 4; i++)
    { 
       document.getElementById("li-"+i).removeAttribute("class");
    };
    
}
//console.log("headerView");
setMenuActive();
