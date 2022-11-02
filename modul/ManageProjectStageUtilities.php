<?php
class ManageProjectStageUtilities{
    private $Log;
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->Log->log(0,"[".__METHOD__."]");
    }
    public function removeImageid($Stage){
        //$this->Log->log(0,$Stage);
        foreach($Stage->section as $s){
             foreach($s->subsection as $su){
                 foreach($su->subsectionrow as $r){
                     foreach($r->image as $k => $i){
                         //$this->Log->log(0,$r->image->{$k}->data);
                         $r->image->{$k}->data->id=0;
                     }
                 }
             }
        }
        return $Stage;
    }
}
