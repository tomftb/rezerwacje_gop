<?php
class ManageCluster {
    //put your code here
    private $Utilities;
    private $Log;
    private $db;
    
    public function __construct(){
        $this->Log=Logger::init();
        $this->db= LoadDb::load();
        $this->Utilities=New Utilities();
    }
    public function getActClustrsUsage(){
        
        /* MERGE */
        $this->Utilities->jsonResponse(__METHOD__,self::mergeLabClusters(),'','');
    }
    private function getAllClusters(){
        return $this->db->squery('SELECT nod as \'n\',pracownia as \'p\' FROM klaster');
    }
    private function getAllLabs(){
        return $this->db->squery('SELECT id as \'i\',nazwa as \'n\' FROM pracownia WHERE WSK_U=0 ORDER BY id');
    }
    private function mergeLabClusters(){
        $clusters=self::getAllClusters();
        $labs=self::getAllLabs();
        
        foreach($labs as $l => $lab){
            
            $labs[$l]['c']='';
            foreach($clusters as $c => $clustr){
                if($lab['i']===$clustr['p']){
                    $labs[$l]['c'].=$clustr['n'].", ";
                    //array_push($labs[$l]['c'],$clustr['n']);
                    UNSET($clusters[$c]);
                }
            }
            /* TO DO remove last two char */
        }
        return $labs;
    }
    public function updateClustr(){
        $this->Utilities->jsonResponse(__METHOD__,'','','');
    }
}