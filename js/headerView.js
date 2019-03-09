function setMenuActive()
{
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
    //console.log(id);
    if(id==null)
    {
        id=1;   
    }
    // SET ADMINISTRATOR
    if(id>=5)
    {
        
        document.getElementById("li-5").setAttribute("class", "menu-active");
    }
    document.getElementById("li-"+id).setAttribute("class", "menu-active"); 
    //console.log(document.getElementById("li-"+id));
}
function removeClass()
{
    for (i = 1; i < 4; i++)
    { 
        try
        {
           document.getElementById("li-"+i).removeAttribute("class"); 
        }
        catch(err)
        {
            console.log(err.message);
        }
    };
    
}
setMenuActive();
