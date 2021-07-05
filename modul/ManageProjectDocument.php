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
        if(trim($id)===''){
            Throw New Exception ("ID PROJECT IS EMPTY",1);
        }
        $this->inpArrayDok=$doc;
        $this->idProject=$id;
        $this->addLabel=self::sBlue."DODANO".self::sEnd.": ";
        try{
             $this->dbLink->beginTransaction(); //PHP 5.1 and new
            self::getDbDok($id);
            array_map(array($this, 'removeEmptyDok'),array_keys($this->inpArrayDok),$this->inpArrayDok);
            array_map(array($this, 'existInDb'),array_keys($this->inpArrayDok),$this->inpArrayDok); 
            //self::insertNewDok($this->idProject,$this->inpArrayDok,self::sBlue."DODANO".self::sEnd.": ");
            array_map(array($this, 'insertNewDok'),$this->inpArrayDok);
            array_map(array($this, 'removeNotSendedDoc'),$this->dbDok);
            $this->dbLink->commit();  //PHP 5 and new
         }
        catch (PDOException $e){
            $this->dbLink->rollback(); 
            throw New Exception(__METHOD__.$e,1);
	}
        return (self::setResponse());
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    private function getDbDok($idProject=1)
    {
        /*
         * GET DOCUMENTS DATA FROM DATABASE
         */
        $this->Log->log(0,"[".__METHOD__."] ID PROJECT => ".$idProject);
        $this->dbDok=$this->dbLink->squery('SELECT `ID`,`NAZWA` as \'Nazwa\' FROM `v_proj_dok` WHERE `ID_PROJEKT`=:i ORDER BY `id` ASC',['i'=>[$idProject,'INT']]);
        $this->Log->logMulti(0,$this->dbDok,__METHOD__." dbDok"); 
        return ($this->dbDok);
    }
    public function getDoc($idProject=1)
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
        /*
         * FOR TEST
         */
        //$dok['ID']=999;
        if($this->documentExist($this->idProject,$dok['ID']))
        {

            $sql=[
                ':wsk_u'=>['1','STR'],
                ':mod_data'=>[CDT,'STR'],
                ':mod_user'=>[$_SESSION["username"],'STR'],
                ':mod_user_id'=>[$_SESSION["userid"],'INT'],
                ':mod_host'=>[RA,'STR'],
                ':id_projekt'=>[$this->idProject,'INT'],
                ':id'=>[$dok['ID'],'INT']
            ];
            $this->dbLink->query('UPDATE `projekt_dok` SET '
                    . 'wsk_u=:wsk_u,'
                    . 'mod_data=:mod_data,'
                    . 'mod_user=:mod_user,'
                    . 'mod_user_id=:mod_user_id,'
                    . 'mod_host=:mod_host '
                    . 'WHERE '
                    . 'id_projekt=:id_projekt '
                    . 'AND id=:id',$sql); 
            self::setupActDokListField(self::sRed."USUNIĘTO".self::sEnd.": ".$dok['Nazwa']);
        }
        else{
            Throw New Exception("DOCUMENT NOT FOUND IN DATABASE => ID => ".$dok['ID'].", NAZWA => ".$dok['NAZWA'],1);
        }
    }
    private function documentExist($id=0,$idDoc=0){
        $this->Log->log(0,"[".__METHOD__."]");  
        $sql=[
            ':id'=>[$id,'INT'],
            ':idDoc'=>[$idDoc,'INT'],
            ];
       
        if (count($this->dbLink->squery('SELECT * FROM `projekt_dok` WHERE `id_projekt`=:id AND id=:idDoc',$sql))>0){
            return true;
        }
        return false;
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