<?php
function checkUrlId()
{
    return (filter_input(INPUT_GET, 'id'));
}
function setMenuActiveClass()
{
    $menuActive='class="menu-active"';
    $id=checkUrlId();
    $setActiveId=array();
    for($i=1;$i<4;$i++)
    {
        if($i===$id)
        {
            
        };
    };
}