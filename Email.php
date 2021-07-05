<?php

use PHPMailer\PHPMailer;

class Email extends PHPMailer\PHPMailer
{
    protected $emailParm=array();
    protected $email='';
    private $eFooter='';
    private $SN='';
    private $err='';
    private $Log;
    private $dbLink;

    function __construct(){
        parent::__construct();
        $this->Log=Logger::init(__METHOD__);
	$this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        self::setMailParm();
        $this->SN=filter_input(INPUT_SERVER,"SERVER_NAME");
    }
    private function setMailParm(){
        //GET EMAIL PARAMETERS
        $this->emailParm=$this->parseParm($this->dbLink->squery('SELECT `SKROT`,`WARTOSC` FROM `parametry` WHERE UPPER(`SKROT`) LIKE (\'MAIL_%\')'));
    }
    private function parseParm($data)
    {
        if(!is_array($data)){
            $this->Log->log(0,'NO EMAIL PARAMETERS IN DATABASE');  
            Throw New \Exception('NO EMAIL PARAMETERS IN DATABASE',1);
        }
        $tmpArray=array();
        foreach($data as $value)
        {
            $tmpArray[$value['SKROT']]=$value['WARTOSC'];
        }
        return($tmpArray);
    }	
    private function getFooter($html)
    {   
        if($html){
            return ("<p style=\"font-size:12px;color:#999999;\">--<br/>Ta wiadomość została wygenerowana automatycznie z portalu ".$this->SN.", nie odpowiadaj na nią.");
        }
        return("\n\n--\nTa wiadomość została wygenerowana automatycznie z portalu ".$this->SN.", nie odpowiadaj na nią.");
    }
    public function sendMail($subject,$body,$recipient,$errHeader,$html=false)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->err='';
        parent::IsSMTP();
        parent::isHTML($html);
        $this->Timeout = 10;
        $this->Host = $this->emailParm['MAIL_SRV'];
        $this->CharSet= $this->emailParm['MAIL_CHARSET']; 
        $this->SMTPKeepAlive = true;
        $from=explode('@',$this->emailParm['MAIL_USER']);
        parent::setFrom($this->emailParm['MAIL_USER'], $from[0]);
        if($this->emailParm['MAIL_SECURE']!=''){
            $this->SMTPSecure = 'tls';
        }
        if($this->emailParm['MAIL_PASS']!=''){
            $this->Username=$from[0];
            $this->Password = $this->emailParm['MAIL_PASS'];
            $this->SMTPAuth = true; 
        }
        $this->Port=$this->emailParm['MAIL_PORT_OUT']; 
        if($this->emailParm['MAIL_RECV']){
            array_push($recipient,array($_SESSION['mail'],$_SESSION['nazwiskoImie']));
        }
        if(!self::setRecipientAddresses($recipient)){
            Throw New \Exception ($this->err,0);
        }
        $this->Subject  = $subject;
        $this->Body     = $body.$this->getFooter($html);
        if(!parent::send()){
            $this->Log->log(0,"[".__METHOD__."] ".$this->ErrorInfo);
            parent::SmtpClose(); 
            Throw New \Exception ('Projekt został założony, niestety pojawił się problem z wysyłką powiadomienia email.',0);
        }
        parent::SmtpClose(); 
        return '';
    }
    private function setRecipientAddresses($recipient)
    {
        $no_err=true;
        foreach($recipient as $emailAdres)
        {
            $this->Log->logMulti(0,$emailAdres,__LINE__."::".__METHOD__); 
            if(count(parent::parseAddresses($emailAdres[0]))>0){
                parent::addAddress($emailAdres[0],$emailAdres[1]);
            }
            else
            {
                $this->err.="<br/>[".$emailAdres[1]."] Nieprawidłowy adres email - ".$emailAdres[0];
                $no_err=false;
            }
        }
        return $no_err;
    }
    public function getErr()
    {
        return $this->err;
    }
}
