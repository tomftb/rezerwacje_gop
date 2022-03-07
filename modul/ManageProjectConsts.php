<?php
/**
 * Description of ManageProjectConsts
 *
 * @author tborczynski
 * MANAGE PROJECT CONSTS
 */
class ManageProjectConsts extends ManageProjectConstsDatabase{
    private $Utilities;
    private $Items;
    
    public function __construct(){
        parent::__construct();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities=NEW Utilities();
        $this->Items=NEW ManageProjectItems();
    }
    public function __destruct(){
        parent::__destruct();
    }
    public function getProjectConstList(){
        $v['all']=parent::getConsts();
        $this->Utilities->jsonResponse($v,'prepareConst');
    }
    public function confirmProjectConst(){
        $this->inpArray= filter_input_array(INPUT_POST);
        //echo "POST\r\n";
        /* inpArray => ManageProjectConstDatabase() */
        if(!$this->inpArray){
            Throw New Exception('Wprowadź co najmniej jedną stałą.',0); 
        }
        //print_r($this->inpArray);
        array_walk($this->inpArray, array($this,'parseConsts'));
        array_walk($this->newData, array($this,'parseConstsUnique'));
        if($this->error){
           Throw New Exception($this->error,0); 
        }
        //Throw New Exception('['.__METHOD__.'::'.__LINE__.'] TEST STOP',0); 
        array_map([$this,'dbManageConst'],$this->newData);
        Throw New Exception('['.__METHOD__.'::'.__LINE__.'] TEST STOP',0); 
        $this->Utilities->jsonResponse([],'cModal');
    }
    private function parseConsts(&$value='',$key=''){
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * REMOVE WHITE CHAR FROM BEGINING AND END OF STRING
         */
        //$value=trim($value);
        //if($value===''){
        //    $this->error.='['.$key.'] Pole nie może być puste<br/>';
        //}
         /*
         * EXPLODE KEY VIA CHAR `-`
         */
        $tmpKey=explode('-',$key);
        switch($tmpKey[0]){
            case 'nazwa':
                if(!preg_match("/^[a-zA-Z]([a-zA-Z]|\d){2,29}$/",$value)){
                    $this->error.='['.$key.'] Pole zawiera niedozwolone znaki,nie spełnia wymagań co do ilości znaków lub konstrukcji.<br/>';
                }
                $this->newData[$tmpKey[1]][$tmpKey[0]]=$value;
                break;
            case 'wartosc':
                if(!preg_match("/^.{1,1024}$/",$value)){
                    $this->error.='['.$key.'] Pole zawiera niedozwolone znaki,nie spełnia wymagań co do ilości znaków lub konstrukcji.<br/>';
                }
                $this->newData[$tmpKey[1]][$tmpKey[0]]=$value;
                break;
            case 'id':
                    $this->Log->log(0,"[".__METHOD__."] ID => ".$value);
                    $this->newData[$tmpKey[1]][$tmpKey[0]]=$value;
                break;
            default:
                Throw New Exception('['.__METHOD__.'] UNAVAILABLE KEY -> '.$key,1);
            break;
        }
    }
    private function parseConstsUnique(&$value='',$key=''){
        $this->Log->log(0,"[".__METHOD__."]\r\nKEY => ".$key);
        $this->Log->logMulti(0,$value);
        if(!array_key_exists('id', $value)){
            Throw New Exception('['.__METHOD__.'] KEY `id` NOT EXIST IN POST CONST DATA',1); 
        }
        $value['nazwa']=mb_strtoupper($value['nazwa']);
        $value['id']=intval($value['id'],10);
        /* PARSE CONST UNIQUE */
        parent::checkConstUniqe($key,$value['nazwa'],'nazwa',$value['id']);
        parent::checkConstUniqe($key,$value['wartosc'],'wartosc',$value['id']);
       
    }
        # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getprojectsconstslike(){ 
        /*FILTER_SANITIZE_STRING => Remove all HTML tags from a string:*/
        //$f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        //$f=filter_input(INPUT_GET,'filter');
        //$f='a';
        $this->Log->log(0,"[".__METHOD__."] FILTER => ".$f);
        $this->Log->logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT s.`id` as 'i', s.`nazwa` as 'n',s.`wartosc` as 'v',s.`buffer_user_id` as 'bu',b.`login` as 'bl' FROM `PROJECT_STAGE_CONST` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $where='';
        $query_data=[];
        if(is_numeric($f)){
            $this->Log->log(0,"[".__METHOD__."] FILTER is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND s.`id` LIKE (s.`id` LIKE :id OR s.`nazwa` LIKE :nazwa) ORDER BY s.`id` ASC";
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] FILTER not numeric ");
            $query_data[':wartosc']=array('%'.$f.'%','STR');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`nazwa` LIKE :nazwa OR s.`wartosc` LIKE :wartosc) ORDER BY s.`id` ASC";
        }
        $this->inpArray['u']=$this->Items->setGetWsk('u');
        $this->inpArray['b']=$this->Items->setGetWsk('b');
        $this->inpArray['v']=$this->Items->setGetWsk('v');
        $this->inpArray['wskb']=$this->Items->unsetBlock($this->inpArray['b'],'PROJECT_STAGE_CONST','buffer_user_id',$_SESSION['userid']);
        $query_data[':wsk_u']=array($this->inpArray['u'],'STR');
        $query_data[':wsk_v']=array($this->inpArray['v'],'STR');
        $query_data[':nazwa']=array('%'.$f.'%','STR');
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
 
        $return['data']=parent::getConstsLike($select.$where,$query_data);  
        $return['headTitle']='Stałe';
        // Throw New Exception('['.__METHOD__.']'.__LINE__.' TEST',1);
        $this->Utilities->jsonResponse($return,'runModal');
    }
     public function getProjectConstHideSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=array();
        $this->Utilities->setGet('id',$this->newData);
        parent::getConstData();
        $this->Items->checkBlock($this->newData['const']['bu'],$this->newData['const']['bl'],$_SESSION['userid']);
        $this->Items->setBlock($this->newData['id'],"PROJECT_STAGE_CONST","buffer_user_id",$_SESSION['userid']);
        $this->newData['slo']=$this->Items->getSlo('pcHide');
        $this->Utilities->jsonResponse($this->newData,'pcHide');  
    }
    public function getProjectConstDelSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=array();
        $this->Utilities->setGet('id',$this->newData);
        parent::getConstData();
        $this->Items->checkBlock($this->newData['const']['bu'],$this->newData['const']['bl'],$_SESSION['userid']);
        $this->Items->setBlock($this->newData['id'],"PROJECT_STAGE_CONST","buffer_user_id",$_SESSION['userid']);
        $this->newData['slo']=$this->Items->getSlo('pcDelete');
        $this->Utilities->jsonResponse($this->newData,'pcDelete');  
    }
    public function getProjectConstDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=array();
        $this->Utilities->setGet('id',$this->newData);
        parent::getConstData();
        $this->newData['all']=parent::getConstWithoutRecord($this->newData['id']);
        //$v['data']=parent::getConsts();
        $this->Utilities->jsonResponse($this->newData,'pcDetails');
    }
    public function pcDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->newData=array();
        //$this->Utilities->setGet('id',$this->newData);
        //parent::getConstData();
        //$v['data']=parent::getConsts();
        $this->Utilities->jsonResponse([],'cModal');
    }
    public function pcHide(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=$this->Items->setPostId();
        $this->newData['reason']=$this->Items->setReason();
        $this->newData['wskb']= $this->Items->getBufferUserId($this->newData['id'],'PROJECT_STAGE_CONST','buffer_user_id');
        $this->Items->checkBlock($this->newData['wskb']['bu'],$this->newData['wskb']['bl'],$_SESSION['userid']);
        parent::hideConst();
        $this->Items->setBlock($this->newData['id'],"PROJECT_STAGE_CONST","buffer_user_id",'');
        $this->Utilities->jsonResponse('','cModal');
    }
    public function pcDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=$this->Items->setPostId();
        $this->newData['reason']=$this->Items->setReason();
        $this->newData['wskb']= $this->Items->getBufferUserId($this->newData['id'],'PROJECT_STAGE_CONST','buffer_user_id');
        $this->Items->checkBlock($this->newData['wskb']['bu'],$this->newData['wskb']['bl'],$_SESSION['userid']);
        parent::deleteConst();
        $this->Items->setBlock($this->newData['id'],"PROJECT_STAGE_CONST","buffer_user_id",'');
        $this->Utilities->jsonResponse('','cModal');
    }


}
