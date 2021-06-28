<?php

final class downloadFile{
    //put your code here
    public function __construct(){}
    public function getFile($file){
        
        self::setUpHeader(self::parseFile($file));
    }
    private function parseFile($file=''){
        if($file===''){
           die('NO FILE INPUT'); 
        }
        $tmp=explode('.',$file);
        if(count($tmp)<2){
           die('NO FILE EXTENSION'); 
        }
        $ext=strtolower(end($tmp));
        if($ext!='docx' && $ext!='pdf'){
            die('WRONG FILE EXTENSION'); 
        }
        return [$file,$ext];
    }
    private function setUpHeader($file){
        if(!$file[1] || !$file[0]){
            die('WRONG FILE'); 
        }
        $avaExt=[
            'docx'=>['DOC','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'pdf'=>['PDF','application/pdf']
        ];
        header('Content-Type: '.$avaExt[$file[1]][1]);
        header("Content-Disposition:attachment;filename=".$file[0]."");
        readfile("../".$avaExt[$file[1]][0]."/" . $file[0]);
    }
}
