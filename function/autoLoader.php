<?php

function Autoload($className){
    $DR=filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/..";
    $dir=array('modul','class','function','app_pages','lib');
    // 'lib/PHPWord-develop/src/PhpWord/Collection','lib/PHPWord-develop/src/PhpWord/Metadata'
    /*
	EXPLODE className - namespace for example Person\Barnes\David to class David
    */
    $partClassName=explode('\\',$className);
    $class=end($partClassName);
    $found='';
    //echo 'CLASS TO LOAD => '.$className."<br/>";
    foreach($dir as $dirName)
    {	
        searchInDir($DR.'/'.$dirName,$class,$found);
        if($found!==''){
            //echo "FILE => ".$found."<br/>";
            break;
        }
    }
    if($found!==''){
	//echo "LOAD => REQUIRE => ".$found."<br/>";
        require($found);
    }
    else{
        throw new Exception('Class cannot be found ( ' . $className . ' )');
    }
}
function searchInDir($d,$f,&$found){
    //echo "LOOK FOR => ".$f."<br/>";
    if(is_dir($d)){
        //echo 'IS A DIR '.$d.' <br/>';
        foreach (scandir($d) as $dirFile){
            if($dirFile!=='.' && $dirFile!=='..'){
                //echo 'DIR HAVE FILES => '.$dirFile.'<br/>';
                searchInDir($d.'/'.$dirFile,$f,$found);
            }
        }
    }
    else {
        compareFile($d,$f,$found);
    }
}
function compareFile($d,$f,&$found){
    //echo 'NOT A DIR => '.$d.' <br/>';
    $tmpDirParts=explode('/',$d);
    //$end=end($tmpDirParts);
        //print_r($tmpDirParts);
    //echo $end."<br/>";
        //$tmpDirParts[]
    array_pop($tmpDirParts);
    array_push($tmpDirParts,$f.".php");
    $newF=implode('/',$tmpDirParts);
    //echo "NEW FILE => ".$newF."<br/>";
    if($d===$newF && is_readable($newF) && !class_exists($f, false)){
        //echo "FOUND FILE, RETURN => ".$d."<br/>";
        $found=$d;
    }
}
spl_autoload_register('Autoload');