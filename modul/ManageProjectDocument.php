<?php

class ManageProjectDocument {
    //put your code here
    private $inpArrayDok=array();
    private $idProject='';
    private $dbDok=array();
    private $actDocList=array();
    private $br=''; /* break line */
    private $dash=''; /* dash */
    private $addLabel='';
    const sRed="<span style=\"font-weight:bold;color:#ff0000\"> "; /* &rarr; arrow right */
    const sBlack="<span style=\"font-weight:bold;color:#000000\">";
    const sBlue="<span style=\"font-weight:bold;color:#0000ff\">";
    const sEnd="</span>";
    private $Log;
    private $dbLink;
    /*
     * status:
     * 0 -> no change
     * 1 -> change
     * 2 -> error
     */
    private $response=array(
        'status'=>0,
        'info'=>''
    );
    
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->Log->log(0,"[".__METHOD__."]");
        $this->dbLink=LoadDb::load();
    }
    public function updateDoc($id,$doc)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArrayDok=$doc;
        $this->idProject=$id;
        $this->addLabel=self::sBlue."DODANO".self::sEnd.": ";
        self::getDbDok($id);
        array_map(array($this, 'removeEmptyDok'),array_keys($this->inpArrayDok),$this->inpArrayDok);
        array_map(array($this, 'existInDb'),array_keys($this->inpArrayDok),$this->inpArrayDok); 
        //self::insertNewDok($this->idProject,$this->inpArrayDok,self::sBlue."DODANO".self::sEnd.": ");
        array_map(array($this, 'insertNewDok'),$this->inpArrayDok);
        array_map(array($this, 'removeNotSendedDoc'),$this->dbDok);
        return (self::setResponse());
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    private function getDbDok($idProject='')
    {
        /*
         * GET DOCUMENTS DATA FROM DATABASE
         */
        $this->Log->log(0,"[".__METHOD__."] ID PROJECT => ".$idProject);
        if($idProject==='') { $this->setError(1," WRONG ID PROJECT => (".$idProject.")"); }
        $this->dbDok=$this->query('SELECT `ID`,`NAZWA` as \'Nazwa\' FROM `v_proj_dok` WHERE `ID_PROJEKT`=? ORDER BY `id` ASC',$idProject);
        $this->Log->logMultidimensional(0,$this->dbDok,__METHOD__." dbDok"); 
        return ($this->dbDok);
    }
    public function getDoc($idProject)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        if($idProject==='') { $this->setError(1," WRONG ID PROJECT => (".$idProject.")"); }
        self::getDbDok($idProject);
         $this->response['status']=1;
        foreach($this->dbDok as $value)
        {
            self::setupActDokListField($value['NAZWA']);
        }
        //array_map(array($this, 'setupActDokListField'),$this->dbDok); 
        return (self::setResponse());
    }
    private function existInDb($k,$v)
    {
        $this->Log->log(0,"[".__METHOD__."] $k , $v");
        if($this->getError()) { return '';}
        foreach($this->dbDok as $id => $dok)
        {
            $this->Log->log(0,"[".__METHOD__."] $id , ".$dok['Nazwa']);
            if($v===$dok['Nazwa'])
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND => UNSET => ".$dok['Nazwa']);
                self::setupActDokListField($dok['Nazwa']);
                unset($this->inpArrayDok[$k]);
                unset($this->dbDok[$id]);
            }
        }
    }
    public function addDok($idProject=0,$dokArray=[])
    {
        if(intval($idProject)===0){
            Throw New Exception ('WRONG ID PROJECT => '.$idProject,1);
        }
        $this->idProject=$idProject;
        array_map(array($this, 'insertNewDok'),$dokArray); 
        return (self::setResponse());
    }
    public function insertNewDok($dok)
    {
        $this->Log->log(0,"[".__METHOD__."] INSERT INTO DB => ".$dok);
        $this->response['status']=1;
        $sql=[
            ':id_projekt'=>[$this->idProject,'INT'],
            ':nazwa'=>[$dok,'STR'],
            ':mod_data'=>[CDT,'INT'],
            ':mod_user'=>[$_SESSION["username"],'INT'],
            ':mod_user_id'=>[$_SESSION["userid"],'INT'],
            ':mod_host'=>[RA,'INT']
        ];
        $this->dbLink->query('INSERT INTO `projekt_dok` (id_projekt,nazwa,mod_data,mod_user,mod_user_id,mod_host) VALUES (:id_projekt,:nazwa,:mod_data,:mod_user,:mod_user_id,:mod_host)',$sql);     
        self::setupActDokListField($this->addLabel.$dok);
    }
    
    private function removeNotSendedDoc($dok)
    {
        $this->Log->log(0,"[".__METHOD__."] SET WSK_U = 1 FOR ".$dok['ID']." => ".$dok['Nazwa']);
        if($this->getError()) { return '';}
        /*
         * FOR TEST
         */
        //$dok['ID']=999;
        if($this->checkExistInDb('projekt_dok','id=? AND id_projekt=?',$dok['ID'].','.$this->idProject)>0)
        {
            $this->response['status']=1;
            $this->query( 'UPDATE `projekt_dok` SET wsk_u=?,mod_data=?,mod_user=?,mod_user_id=?,mod_host=? WHERE id_projekt=? AND id=?','1,'.$this->cDT.",".$_SESSION["username"].",".$_SESSION["userid"].",".$this->RA.",".$this->idProject.','.$dok['ID']); 
            self::setupActDokListField(self::sRed."USUNIĘTO".self::sEnd.": ".$dok['Nazwa']);
        }
        else
        {
            $this->setError(1,"DOCUMENT NOT FOUND IN DATABASE => ID => ".$dok['ID'].", NAZWA => ".$dok['NAZWA']);
        }
    }
    private function setupActDokListField($dok)
    {
        array_push($this->actDocList,$this->br.$this->dash.$dok); 
        if($this->br==='')
        {
            $this->br='<br/>';
            $this->dash='- ';
        }
    }
    private function removeEmptyDok($k,$v)
    {
        $this->Log->log(0,"[".__METHOD__."] $k => ".$v);
        if(trim($v)==='')
        {
           UNSET($this->inpArrayDok[$k]);
        }
    }

    private function setResponse()
    {
        $this->response['info']=implode('',$this->actDocList);
        $this->Log->log(0,"[".__METHOD__."] RETURN STATUS => ".$this->response['status']);
        $this->Log->log(0,"[".__METHOD__."] RETURN INFO => ".$this->response['info']);
        return ($this->response);
    }
}
