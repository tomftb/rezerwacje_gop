<?php
/**
 * Description of file
 *
 * @author tborczynski
 */
class FileImage extends File {
    public function __construct(){
        parent::__construct();
        parent::log(__METHOD__);
    }
    public function getImage(){
        parent::uploadFiles();
        
        $file=[];
        $uploadDir=parent::getUploadDir();
        foreach(parent::getUploadFiles() as $k => $v){
            $file[$k]=self::getImageProperty($uploadDir,$v[0]);
        }
        return $file;
    }
    private function getImageProperty($uploadDir,$image=''){
        $property = getimagesize($uploadDir.$image);
        //print_r($property);
        return[
            'n'=>$image,
            'w'=>$property[0],
            'h'=>$property[1],
            'm'=>$property['mime']
        ];
    }
    public function __destruct(){
    }
}
