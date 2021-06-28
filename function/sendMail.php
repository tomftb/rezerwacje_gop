<?php
require_once($DOC_ROOT.'/function/checkFile.php');
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/class/logToFile.php");
if(checkFile($DOC_ROOT.'/.cfg/config.php')) include_once($DOC_ROOT.'/.cfg/config.php');

$rPlik=filter_input(INPUT_POST,"rozmiarPlik",FILTER_VALIDATE_INT);
$nProjekt=filter_input(INPUT_POST,"nazwaProjektu");
$rJednostka=filter_input(INPUT_POST,"rozmiarJednostka");
$pPracownicy=filter_input(INPUT_POST,"przypisaniPracownicy");
$quota=$rPlik*30;
$mailBody="Zarejestrowano zgłoszenie na utworzenie nowego projektu o specyfikacji:\n\nNazwa projektu\t\t-\t".$nProjekt."\n";
$mailBody.="Rozmiar pliku bazowego\t- \t".$rPlik." ".$rJednostka."\n";
$mailBody.="Sugerowana quota\t- \t".$quota." ".$rJednostka."\n";
$mailBody.="Przypisani użytkownicy\t- \t".$_SESSION['nazwiskoImie'].", ".$pPracownicy."\n\n";
$mailBody.="Zgłaszający\t\t- \t".$_SESSION['nazwiskoImie']." (".$_SESSION["mail"].") ";		

/*
 * PHP 5
 * if(checkFile("function/PHPMailer_v5.1/class.phpmailer.php")) include ("function/PHPMailer_v5.1/class.phpmailer.php");
 * $mail = new PHPMailer;
 * ACT PHP 7
 * 
 */
if(checkFile("function/PHPMailer-master/src/SMTP.php")) include ("function/PHPMailer-master/src/SMTP.php");
if(checkFile("function/PHPMailer-master/src/Exception.php")) include ("function/PHPMailer-master/src/Exception.php");
if(checkFile("function/PHPMailer-master/src/PHPMailer.php")) include ("function/PHPMailer-master/src/PHPMailer.php");


$mail = new PHPMailer\PHPMailer\PHPMailer();

//GET EMAIL PARAMETERS
$dbLink->query('SELECT SKROT,WARTOSC FROM parametry WHERE UPPER(SKROT) LIKE (?) ','MAIL_%');

class EMAIL extends logToFile
{
    private $flattenParm=array();
    private $parm=array();
    private $data=array();
    function __construct()
    {
        $this->log(0,"[".__METHOD__."]");
        parent::__construct();
    }
    public function setData($data)
    {
       
        //$this->data=$data;
        //$this->parseFlattenParm($this->data);
        $this->parseParm($data);
    }
    // REKURENCYJNIE - UZYSKAMY FLATTEN
    private function parseFlattenParm($data)
    {
        foreach($data as $key => $value)
        {
            if(is_array($value))
            {
                $this->parseParm($value);
            }
            else
            {
                array_push($this->flattenParm,$value);
                //UNSET($data[$key]);
            }
        }
    }
    private function parseParm($data)
    {
        $tmpArray=array();
        foreach($data as $key => $value)
        {
            $this->parm[$value['SKROT']]=$value['WARTOSC'];
            //$tmpArray[$key]=$value;
        }
        //$this->parm=$tmpArray;
    }
    public function flattenParm()
    {
        return ($this->parm);
    }
}
$parseParm=NEW EMAIL();
$parseParm->setData($dbLink->queryReturnValue());
$EMAIL=$parseParm->flattenParm();
/*
 
echo "<pre>";
print_r($EMAIL);
echo "</pre>";
 */
set_time_limit(10);
try
{
    
    $mail->IsSMTP();
    $mail->Timeout  =   5;
    $mail->Host = $EMAIL['MAIL_SRV'];
    $mail->CharSet = $EMAIL['MAIL_CHARSET'];
    
    $mail->SMTPKeepAlive = true;
    $from=explode('@',$EMAIL['MAIL_USER']);
    //$mail->setFrom('rezerwacje-gop@geofizyka.pl', 'rezerwacje-gop');
    $mail->setFrom($EMAIL['MAIL_USER'], $from[0]);
    $recipient=explode(';',$EMAIL['MAIL_RECIPIENT']);
    if($EMAIL['MAIL_SECURE']!='')
    {
        $mail->SMTPSecure = 'tls'; 
    }
    
    if($EMAIL['MAIL_PASS']!='')
    {
        $mail->Username = $from[0];
        $mail->Password = $EMAIL['MAIL_PASS'];
        $mail->SMTPAuth = true; 
    }
    $mail->Port = $EMAIL['MAIL_PORT_OUT']; 

    //print_r($recipient);
    if($EMAIL['MAIL_RECV'])
    {
        array_push($recipient,$_SESSION['mail']);
    }
    //foreach($recipient as $emailAdres => $emailUser)
    foreach($recipient as $emailAdres)
    {
        //$mail->addAddress($emailAdres, $emailUser);
        $mail->addAddress($emailAdres);
    }
    $mail->Subject  = 'Zgłoszenie na utworzenie udziału dla Projektu';
    $mail->Body     = $mailBody."\n\n--\nTa wiadomość została wygenerowana automatycznie z portalu rezerwacjegop.geofizyka.pl, nie odpowiadaj na nią.";
    $mail->send();
    $mail->SmtpClose(); 
    foreach($recipient as $emailAdres )
    {
        echo '<p class="p_info_16_b" >Zgłoszenie zostało wysłane do - <span style="color:#000000;">'.$emailAdres.'</span></p>';
    }
}
catch (Exception $e)
{
    echo 'Zgłoszenie nie zostały wysłane.</br>';
    echo 'Mailer error: ' . $mail->ErrorInfo;
}
					