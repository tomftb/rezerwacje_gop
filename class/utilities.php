<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of utilities
 *
 * @author tborczynski
 */
class utilities extends errorConfirm
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
    
    private $response=array(
        'status'=>0,
        'info'=>'',
        'data'=>''
    );
    
    public function __construct()
    {
        parent::__construct();
        $this->log(2,"[".__METHOD__."]");
    }
    public function checkInputGetValInt($key)
    {
        $id=filter_input(INPUT_GET,$key,FILTER_VALIDATE_INT);
        $this->log(0,"[".__METHOD__."] ID => ".$id);
        if(trim($id)!=='')
        {
            $this->response['data']=intval($id);
        }
        else
        {
             $this->setError(1,' KEY '.$key.' in $_GET IS EMPTY');
        }
        return (self::response());
    }
    public function checkInputGetValSanitizeString($key)
    {
        $s=filter_input(INPUT_GET,$key,FILTER_SANITIZE_STRING);
        $this->log(0,"[".__METHOD__."] KEY => ".$key);
        if(trim($s)!=='')
        {
            $this->response['data']=$s;
        }
        else
        {
             $this->setError(1,' KEY '.$key.' in $_GET IS EMPTY');
        }
        return (self::response());
    }
    public function checkKeyExist($k,$a)
    {
        $this->log(0,"[".__METHOD__."] KEY => ".$k);
        $this->logMultidimensional(0,$a,"L::".__LINE__."::".__METHOD__);
        if (!array_key_exists($k,$a))
        {
            $this->setError(1,' KEY '.$k.' NOT FOUND IN ARRAY');
        }
        return (self::response());
    }
    public function getPost($trim=true)
    {
        $this->log(0,"[".__METHOD__."]");
        $this->response['data']=array();
        $this->logMultidimensional(0,$_POST,"L::".__LINE__."::".__METHOD__);
        foreach($_POST as $k => $v)
        {
            $this->log(2,"[".__METHOD__."] KEY => ".$k." ,VALUE => ".$v);
            self::myTrim($v,$trim);         
            $this->response['data'][$k]=$v;
        }
        $this->log(2,"[".__METHOD__."] response[data]:");
        $this->logMultidimensional(2,$this->response['data'],"L::".__LINE__."::".__METHOD__);
        return (self::response());
    }

    public function getDok($empty=false)
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
                $this->log(1,"[".__METHOD__."] FOUND EMPTY DOCUMENT ".$k." => ".$v);
            }
            else if(preg_match('/^(dok-).*/i',$k) && $empty===false && $v!=='')
            {
                $dok[$k]=$v;
                $this->log(1,"[".__METHOD__."] FOUND NOT EMPTY DOCUMENT ".$k." => ".$v);
            }
            else
            {
                $this->log(1,"[".__METHOD__."] NOT A DOCUMENT ".$k." => ".$v);
            }
        }
        return $dok;
    }
    public function checkDateTypePost($k,$v)
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
                $this->log(1,"[".__METHOD__."] FOUND NOT EMPTY DATE => ".$v);
                $tmpArray=explode('.',$v);
                $this->inpArray[$k]=trim($tmpArray[2])."-".trim($tmpArray[1])."-".trim($tmpArray[0]);
            }
            else
            {
                $this->log(1,"[".__METHOD__."] DATE => ".$v." => SET DEFAULT 0000-00-00");
                $this->inpArray[$k]='0000-00-00';
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
                $this->log(1,"[".__METHOD__."] FOUND NOT EMPTY DOCUMENT => ".$v);
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
    private function response()
    {
        $err=$this->getError();
        if($err!=='')
        {
            $this->response['status']=1;
            $this->response['info']=$err;
        }
        //$this->logMultidimensional(0,$this->response,"L::".__LINE__."::".__METHOD__." RESPONSE");
        return ($this->response);
    }
    public function getData()
    {
        $this->log(0,"[".__METHOD__."]");
        return ($this->response['data']);
    }
    public function getInfo()
    {
        $this->log(0,"[".__METHOD__."]");
        return ($this->response['info']);
    }
    public function getStatus()
    {
        $this->log(0,"[".__METHOD__."]");
        return ($this->response['status']);
    }
}
