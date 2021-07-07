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
        $v['labs']=self::getAllLabs();
        $v['clusters']=self::getAllClusters();
        $v['all']=self::mergeLabClusters($v['labs'],$v['clusters']);
        $this->Utilities->jsonResponse(__METHOD__,$v,'','');
    }
    private function getAllClusters(){
        return $this->db->squery('SELECT id as \'i\',nod as \'n\',pracownia as \'p\' FROM klaster');
    }
    private function getAllLabs(){
        return $this->db->squery('SELECT id as \'i\',nazwa as \'n\' FROM pracownia WHERE WSK_U=0 ORDER BY id');
    }
    private function mergeLabClusters($labs,$clusters){
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
        $input=filter_input_array(INPUT_GET);
        $this->Log->LogMulti(0,$input);
        //array_walk([$this,'verifyUpdateKeys'],$input);

        self::verifyUpdateKeys($input);
        self::setIntKeys($input);   
        /*
         * TO DO CHECK NOD AND LAB EXIST IN DB
         */
        $parm=[
            ':n0'=>[$input['n0'],'INT'],
            ':n1'=>[$input['n1'],'INT'],
            ':p'=>[$input['p'],'INT']
        ];
        if($input['n0']>$input['n1']){
            $parm[':n0'][0]=$input['n1'];
            $parm[':n1'][0]=$input['n0'];
        }
        //var_dump($input);
        $this->Log->LogMulti(0,$parm,'PARM');
        $this->db->setQuery("UPDATE `klaster` SET `pracownia`=:p WHERE `id`>=:n0 AND `id`<=:n1 ",$parm);
        $this->db->runQuery();
        //Throw New Exception ("test",0);
        $this->Utilities->jsonResponse(__METHOD__,['all'=>self::mergeLabClusters(self::getAllLabs(),self::getAllClusters())],'','');
    }
    private function verifyUpdateKeys($input){
        $this->Utilities->validateKey($input,'n0',true,1);
        $this->Utilities->validateKey($input,'n1',true,1);
        $this->Utilities->validateKey($input,'p',true,1);
        $this->Log->LogMulti(0,$input,'AFTER');
    }
    private function setIntKeys(&$input){
        $input['n0']=$this->Utilities->getNumber($input['n0']);
        $input['n1']=$this->Utilities->getNumber($input['n1']);
        $input['p']=$this->Utilities->getNumber($input['p']);
    }
}