var log=false;

/* IT SHOULD BE AFTER PAGIN PAGE add listener ?? */

function setMenuActive()
{
    if(log) {console.log('setMenuActive()');};
    var id=parseUrlId();
    removeClassFromEle(id);
    addClass(id);
}
function parseUrlId()
{
    if(log) {console.log('parseUrlId()');};
    var currentLocation = window.location;
    var res = currentLocation.search.split("=");
     /* set default */
    var id=1;
    if(log) {console.log(res.length);};
    if(res.length>1)
    {
        id=parseInt(res[1],10);
    }
    if(isNaN(id))
    {
        if(log) {console.log('isNaN');};
        id=1;
    }
    if(log) {console.log('ID TO RETURN => '+id);};
    return id;
}
function addClass(id)
{
    if(log) {console.log('addClass()\nid => '+id);};
    // SET ADMINISTRATOR
    if(id>=5)
    {
        document.getElementById("li-5").setAttribute("class", "menu-active");
    }
    document.getElementById("li-"+id).setAttribute("class", "menu-active"); 
}
function removeClassFromEle(id)
{
    if(log) {console.log('removeClassFromEle()\nid => '+id);};

    for (var i = 1; i < 5; i++)
    { 
        if(log) {console.log(i);};
        if(id!==i)
        {
            var ele=document.getElementById("li-"+i);
            if(log) {console.log(ele);};
            removeClass(ele);   
        };    
    }; 
}
function removeClass(ele)
{
    if(log)
    {
        console.log('removeClass()');
        console.log(ele);
    };
    if(typeof(ele) !== 'undefined' && ele !== null)
    {
        
        removeAttribute(ele,'class');
    }
    else
    {
        if(log)
        {
            console.log('element is null or undefined');
            console.log(ele);
        };
    }
}
function removeAttribute(ele,atr)
{
    if(log){
        console.log('removeAttribute()');
        console.log(ele);
    }
    if(ele.hasAttribute(atr))
    {
        ele.removeAttribute(atr); 
    }
    else
    {
        /* nothing to do */
        if(log) {console.log("NO "+atr+" attribute");};
    }
}
//window.onload = function() {
 //   setMenuActive();
//};
document.addEventListener('DOMContentLoaded', function() {
    setMenuActive();
}, false);