<?php

final class downloadFile{
    //put your code here
    private static $FileExtension=[
        'docx'=>['DOC','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'pdf'=>['PDF','application/pdf'],
        'jpg'=>['upload','image/jpeg'],
        'jpeg'=>['upload','image/jpeg'],
        'bmp'=>['upload','image/bmp'],
        'gif'=>['upload','image/gif'],
        'png'=>['upload','image/png']
    ];
    /*
     * 'extension name' => ['file directory','html meta ']
     */
    private function __construct(){}
    public static function getFile($file){
        
        self::setUpHeader(self::parseFile($file));
    }
    private function parseFile($file=''){
        if(trim($file)===''){
           die('NO FILE INPUT'); 
        }
        $tmp=explode('.',$file);
        if(count($tmp)<2){
           die('NO FILE EXTENSION'); 
        }
        $ext=strtolower(end($tmp));
        if(!array_key_exists($ext, self::$FileExtension)){
            die('NOT AVAILABLE FILE EXTENSION'); 
        }
        self::checkFileExist(self::$FileExtension[$ext][0]."/".$file);
        self::checkFileReadable(self::$FileExtension[$ext][0]."/".$file);
        return [$file,$ext,self::$FileExtension[$ext]];
    }
    private function setUpHeader($file=[]){
        
        if(!$file[1] || !$file[0] || !$file[2]){
            var_dump($file);
            die('WRONG FILE'); 
        }
        header('Content-Type: '.$file[2][1]);
        header("Content-Disposition:attachment;filename=".$file[0]."");
        readfile(APP_ROOT."/".$file[2][0]."/" . $file[0]);
    }
    private function checkFileExist($file){
        if(!file_exists(APP_ROOT."/".$file)){
             die('FILE NOT EXIST'); 
        }
    }
    private function checkFileReadable($file){
        if(!is_readable(APP_ROOT."/".$file)){
             die('FILE NOT READABLE'); 
        }
    }
}
