<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of file
 *
 * @author tborczynski
 */
class file {
    private $fileName='';
    private $log='';
    //put your code here
    public function __construct(){
    }
    public function setFileName($fName){
        $this->fileName=$fName;
        $this->log.="[".__METHOD__."] ".$this->fileName;
    }
    public function getLog(){
        return ($this->log);
    }
    public function __destruct(){
        
    }
}
