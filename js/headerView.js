function setMenuActive()
{
    $("#li-2").addClass("menu-active");
    removeClass();
    addClass(parseUrlId());
}
function parseUrlId()
{
    var currentLocation = window.location;
    var res = currentLocation.search.split("=");
    return res[1];
}
function addClass(id)
{
    if(id==null)
    {
        id=1;   
    }
    document.getElementById("li-"+id).setAttribute("class", "menu-active"); 
}
function removeClass()
{
    for (i = 1; i < 4; i++)
    { 
       document.getElementById("li-"+i).removeAttribute("class");
    };
    
}
setMenuActive();
