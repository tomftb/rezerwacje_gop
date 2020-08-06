<?php
session_start();
class email extends initialDb
{
    protected $emailParm=array();
    protected $email='';

    function __construct()
    {
        
        parent::__construct();
        $this->loadMail();
        $this->setMailParm();
    }
    public function setMailParm()
    {
        //GET EMAIL PARAMETERS
        $this->query('SELECT SKROT,WARTOSC FROM parametry WHERE UPPER(SKROT) LIKE (?) ','MAIL_%');
        $this->emailParm=$this->parseParm($this->queryReturnValue());
    }
    private function parseParm($data)
    {
        $tmpArray=array();
        foreach($data as $value)
        {
            $tmpArray[$value['SKROT']]=$value['WARTOSC'];
        }
        return($tmpArray);
    }
    protected function loadMail()
    {
        include_once (filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/PHPMailer-master/src/SMTP.php");
        include_once (filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/PHPMailer-master/src/Exception.php");
        include_once (filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/PHPMailer-master/src/PHPMailer.php");

        $this->email = new PHPMailer\PHPMailer\PHPMailer();
    }	
    public function sendMail($subject,$body,$recipient,$errHeader)
    {
        $this->log(0,"[".__METHOD__."]");
        $footer="\n\n--\nTa wiadomość została wygenerowana automatycznie z portalu ".filter_input(INPUT_SERVER,"SERVER_NAME").", nie odpowiadaj na nią.";
        $err='';
        
        //echo "SEND MAIL\n";
        //echo print_r($this->emailParm);
        $this->email->IsSMTP();
        $this->email->Timeout  =   10;
        $this->email->Host = $this->emailParm['MAIL_SRV'];
        $this->email->CharSet = $this->emailParm['MAIL_CHARSET']; 
        $this->email->SMTPKeepAlive = true;
        $from=explode('@',$this->emailParm['MAIL_USER']);
        $this->email->setFrom($this->emailParm['MAIL_USER'], $from[0]);
        $adminRecipient=explode(';',$this->emailParm['MAIL_RECIPIENT']);
        foreach($adminRecipient as $adminUser)
        {
            array_push($recipient,array($adminUser,'Admin'));
        }
        //$recipient=explode(';',$this->emailParm['MAIL_RECIPIENT']);
        if($this->emailParm['MAIL_SECURE']!='')
        {
            $this->email->SMTPSecure = 'tls'; 
        }
        if($this->emailParm['MAIL_PASS']!='')
        {
            $this->email->Username = $from[0];
            $this->email->Password = $this->emailParm['MAIL_PASS'];
            $this->email->SMTPAuth = true; 
        }
        $this->email->Port = $this->emailParm['MAIL_PORT_OUT']; 
        if($this->emailParm['MAIL_RECV'])
        {
            //print_r($_SESSION);
            array_push($recipient,array($_SESSION['mail'],$_SESSION['nazwiskoImie']));
        }
        foreach($recipient as $emailAdres)
        {
            //print_r($this->email->parseAddresses($emailAdres))."\n";
            //echo "Count: ".count($this->email->parseAddresses($emailAdres))."\n";
            if(count($this->email->parseAddresses($emailAdres[0])))
            {
                $this->email->addAddress($emailAdres[0]);
            }
            else
            {
                $err.="<br/>[".$emailAdres[1]."] Nieprawidłowy adres email - ".$emailAdres[0];
            }
            
        }
        //var_dump(get_class_methods($this->email));
        //print_r();
        //var_dump($this->email->getToAddresses());
        //print_r($this->email->getToAddresses());
        $this->email->Subject  = $subject;
        $this->email->Body     = $body.$footer;
        //die('STOP');
        
        //$this->email->send();
        if(!$this->email->send())
        {
            $this->log(0,"[".__METHOD__."] ".$this->email->ErrorInfo);
            $errMail=explode(".",$this->email->ErrorInfo);
            $err.="<br/>".$errMail[0];
        }
        if($err)
        {
            $err=$errHeader.$err;
        }
        $this->email->SmtpClose(); 
        return $err;
    }
}
