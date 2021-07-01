<?php
class Utilities
{
    //put your code here
    /*
     * status:
     * 0 -> ok
     * 1 -> error
     *
     */
    private $validDate=false;
    private $validDok=false;
    private $Log;
    private $Error;
    
    private $response=array(
        'status'=>0,
        'info'=>'',
        'data'=>''
    );
    
    public function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->Error=New ErrorHandler();
    }
    public function checkInputGetValInt($key)
    {
        $i=filter_input(INPUT_GET,$key,FILTER_VALIDATE_INT);
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$i);
        if(trim($i)!=='')
        {
            $this->response['data']=intval($i);
        }
        else
        {
            //$this->setError(1,' KEY '.$key.' in $_GET IS EMPTY');
        }
        return (self::response());
    }
    public function isValueEmpty($value=''){
        if(trim($value)===''){
           Throw New exception ("VALUE IS EMPTY",1);
        }
    }
    public function checkInputGetValSanitizeString($key)
    {
        $s=filter_input(INPUT_GET,$key); //$key
        //$s=filter_input(INPUT_GET,$key,FILTER_SANITIZE_STRING); //$key
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$key);
        $this->Log->log(0,"[".__METHOD__."] S => ".$s);
        if(trim($s)!=='')
        {
            $this->response['data']=$s;
        }
        else
        {
            //$this->setError(1,' KEY '.$key.' in $_GET IS EMPTY');
        }
        return (self::response());
    }
    public function checkKeyExist($k,$a,&$e)
    {
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$k);
        $this->Log->logMultidimensional(0,$a,"L::".__LINE__."::".__METHOD__);
        if (!array_key_exists($k,$a))
        {
            $e="[ERROR] Wystąpił błąd aplikacji! Skontaktuj się z Administratorem!";
            $this->Log->log(0,' KEY '.$k.' NOT EXIST IN ARRAY');
        }
    }
    public function checkKeyExistEmpty($k,$a)
    {
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$k);
        $this->Log->logMultidimensional(0,$a,"L::".__LINE__."::".__METHOD__);
        if (!array_key_exists($k,$a))
        {
            //$this->setError(1,' KEY '.$k.' NOT FOUND IN ARRAY');
            return (self::response());
        }
        if(trim($a[$k])==='')
        {
            //$this->setError(1,' KEY '.$k.' in ARRAY IS EMPTY');
        }
        return (self::response());
    }
    public function keyExist($a,$k){
        if (!array_key_exists($k,$a)){
            Throw New Exception('No '.$k.' KEY in ARRAY!',1);
        }
    }
    public function isEmptyKeyValue($a,$k,$t=true,$errLvl=1){
        if($t){
            if(empty(trim($a[$k]))){
                Throw New Exception('KEY '.$k.' is Empty (WITH TRIM)!',$errLvl);
            }
        }
        else{
            if(empty($a[$k])){
                Throw New Exception('KEY '.$k.' is Empty!',$errLvl);
            }
        }  
    }
    public function getNumber($n,$base=10){
        return intval($n,$base);
    }
    public function getResponse($t='',$v='',$f,$type=''){
        return ([
                'data'=>[
                            'task'=>$t,
                            'value'=>$v,
                            'function'=>$f
                        ],
                'type'=>$type,
                'status'=>0,
                'info'=>'',
                'modul'=>'',
        ]);
    }
    public function jsonResponse($t='',$v='',$f,$type=''){
        echo json_encode(self::getResponse($t='',$v='',$f,$type=''));
    }
    public function getPost($trim=true,$date=false)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->validDate=$date;
        $this->response['data']=array();
        $this->Log->logMultidimensional(0,$_POST,"L::".__LINE__."::".__METHOD__);
        foreach($_POST as $k => $v)
        {
            $this->Log->log(2,"[".__METHOD__."] KEY => ".$k." ,VALUE => ".$v);
            self::myTrim($v,$trim);
            self::checkDateTypePost($k,$v);
            $this->response['data'][$k]=$v;
        }
        $this->Log->log(2,"[".__METHOD__."] response[data]:");
        $this->Log->logMultidimensional(2,$this->response['data'],"L::".__LINE__."::".__METHOD__);
        return (self::response());
    }
    public function getDoc($empty=false)
    {
        /*
         * if empty is true assign empty dok as well
         */
        $dok=array();
        foreach($this->response['data'] as $k => $v)
        {
            if(preg_match('/^(dok-).*/i',$k) && $empty===true)
            //if(substr($k, 0,7)==='orgDok-')
            {
                $dok[$k]=$v;
                $this->Log->log(1,"[".__METHOD__."] FOUND EMPTY DOCUMENT ".$k." => ".$v);
            }
            else if(preg_match('/^(dok-).*/i',$k) && $empty===false && $v!=='')
            {
                $dok[$k]=$v;
                $this->Log->log(1,"[".__METHOD__."] FOUND NOT EMPTY DOCUMENT ".$k." => ".$v);
            }
            else
            {
                $this->Log->log(1,"[".__METHOD__."] NOT A DOCUMENT ".$k." => ".$v);
            }
        }
        return $dok;
    }
    public function checkDateTypePost($k,&$v)
    {
        if(!$this->validDate) {return '';}
        
        $tmpArray=array();
        
        if(preg_match('/^(d-).*/i',$k))
        //if(substr($k, 0,2)==='d-')
        {
            if($v!=='')
            {
                /*
                 * CHECK SEPARATOR
                 */
                $this->Log->log(1,"[".__METHOD__."] FOUND NOT EMPTY DATE => ".$v);
                $tmpArray=explode('.',$v);
                $v=trim($tmpArray[2])."-".trim($tmpArray[1])."-".trim($tmpArray[0]);
            }
            else
            {
                $this->Log->log(1,"[".__METHOD__."] DATE => ".$v." => SET DEFAULT 0000-00-00");
                $v='0000-00-00';
            }
        }
    }

    public function checkDokTypePost($k,$v)
    {
        if(!$this->validDok) {return '';}
        if(preg_match('/^(dok-).*/i',$k))
        //if(substr($k, 0,7)==='orgDok-')
        {
            if($v!=='')
            {
                $this->Log->log(1,"[".__METHOD__."] FOUND NOT EMPTY DOCUMENT => ".$v);
                $this->inpArrayDok[$k]=$v;
            }
            UNSET($this->inpArray[$k]);
        }
    }
    public function myTrim(&$value,$trim=true)
    {
        if($trim)
        {
            $value=trim($value);
        } 
    }
    public function getCbox()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $box=array();
        $this->Log->logMultidimensional(2,$this->response['data'],__LINE__."::".__METHOD__." response[data]");
        foreach($this->response['data'] as $k => $v)
        {
            if(preg_match('/^(cbox-).*/i',$k))
            //if(strpos($k,'cbox-')!==false) 
            {   
                /*
                 * CUT cbox-
                 */
                $k=mb_substr($k, 5);
                array_push($box,self::parseCbox($k));
            }           
        }
        $this->Log->logMultidimensional(2,$box,__LINE__."::".__METHOD__." cbox");
        return $box;
    }
    public function getCboxFromInput($inpArray){
        $this->response['data']=$inpArray;
        return self::getCbox();
    }
    public function mergeArray(&$mainArray,$additionalArray){
        foreach($additionalArray as $k => $v){
            $mainArray[$k]=$v;
        }
    }
    private function parseCbox(&$v)
    {
        $this->Log->log(2,"[".__METHOD__."]");
        //echo "FOUND\n";
        $tmp1=explode('-',$v);
        $tmp3=array();
        foreach($tmp1 as $v)
        {
            $this->Log->log(2,"[".__METHOD__."] v => ".$v);
            $tmp2=explode(':',$v);
            if(!array_key_exists(1, $tmp2))
            {
                /*
                 * IF NOT EXIST ADD EMPTY
                 */
                $tmp2[1]='';
            }
            $tmp3[$tmp2[0]]=trim($tmp2[1]);
        }
        return $tmp3;
    }
    public function setDafaultValue($f,$a,$d)
    {
        /*
         * f => field to check
         * a => array 
         * d => default value
         */
        if (array_key_exists($f,$a))
        {
            return ($a[$f]);
        }
        else
        {
            return ($d);
        } 
    }
    public function getArrayKeyValue($idx,$a)
    {
        /*
         * RETURN ARRAY OF DEFINED K IN ARRAY
         * ONE LEVEL
         */
        $this->Log->logMultidimensional(2,$a,__LINE__."::".__METHOD__);
        $tmp=array();
        foreach($a as $k => $v)
        {
            if(!array_key_exists($idx, $v))
            {
                $this->setError(1,' IDX '.$idx.' NOT FOUND IN ARRAY!');
            }
            else
            {
                array_push($tmp,$v[$idx]);
            }
        }
        $this->Log->logMultidimensional(2,$tmp,__LINE__."::".__METHOD__);
        return $tmp;
    }
    public function setGetIntKey(&$var,$key){
        $var=filter_input(INPUT_GET,$key,FILTER_VALIDATE_INT);
        if($var===null || $var===false){
            return false;
        }
        return true;
    }
    public function checkValueLength($value,$label,$min,$max){
        if(strlen($value)<$min){
            return ("W ".$label." nie wprowadzono minimalnej ilości znaków");
        }
        if(strlen($value)>$max){
            return ("W ".$label." przekroczono dopuszczalną ilość znaków");
        }
        return '';
    }
    public function setMysqlDate($date,$delimiter)
    {
        /* DEFAULT 0000-00-00 */
        $tmp=explode($delimiter,$date);
        $this->Log->logMulti(0,$tmp,__METHOD__);
        $t='';
        $h='';
        if(count($tmp)!==3)
        {
            $this->setError(0,'WRONG DATE! COUNT != 3');
        }
        if(mb_strlen($tmp[0])===mb_strlen($tmp[2]))
        {
            $this->setError(0,'WRONG DATE! LENGTH OF DATE[0] equal DATE[2]');
        }
        if(mb_strlen($tmp[1])!==2)
        {
            $this->setError(0,'WRONG DATE! LENGTH OF DATE[1] != 2');
        }
        if(mb_strlen($tmp[0])==2)
        {
            $t=$tmp[0];
        } 
        else if(mb_strlen($tmp[0])===4)
        {
            $h=$tmp[0];
        }
        else
        {
            $this->setError(0,'WRONG DATE! LENGTH OF DATE[0] != 2 && != 4');
        }
        if(mb_strlen($tmp[2])===2)
        {
            $t=$tmp[2];
        } 
        else if(mb_strlen($tmp[2])===4)
        {
            $h=$tmp[2];
        }
        else
        {
            $this->setError(0,'WRONG DATE! LENGTH OF DATE[2] != 2 && != 4 OR DATE[0] THE SAME LENGTH');
        }
        $this->Log->log(1,"[".__METHOD__."] DATE => ".$h.'-'.$tmp[1].'-'.$t);
        $this->response['data']=$h.'-'.$tmp[1].'-'.$t;
        return self::response();
    }
    private function response()
    {
        if($this->Error->getError()!==''){
            $this->response['status']=1;
            $this->response['info']=$this->Error->getError();
            $this->response['data']='';
        }
        return ($this->response);
    }
    public function getYearFromData($date,$delimiter='-')
    {
        $tmp=explode($delimiter,$date);
        return $tmp[0];
    }
    public function getData()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        return ($this->response['data']);
    }
    public function getInfo()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        return ($this->response['info']);
    }
    public function getStatus()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        return ($this->response['status']);
    }
}