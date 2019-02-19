<?php
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

if(checkFile(".cfg/email.php")) include (".cfg/email.php");
$conf['email'][$_SESSION["mail"]]= $_SESSION['nazwiskoImie'];
$mail->IsSMTP();
$mail->Host = "smtp.geofizyka.pl";
$mail->CharSet = 'UTF-8';
$mail->setFrom('rezerwacje-gop@geofizyka.pl', 'rezerwacje-gop');
foreach($conf['email'] as $emailAdres => $emailUser)
{
    $mail->addAddress($emailAdres, $emailUser);
};
$mail->Subject  = 'Zgłoszenie na utworzenie udziału dla Projektu';
$mail->Body     = $mailBody."\n\n--\nTa wiadomość została wygenerowana automatycznie z portalu rezerwacjegop.geofizyka.pl, nie odpowiadaj na nią.";
if(!$mail->send())
{
    echo 'Zgłoszenie nie zostały wysłane.</br>';
    echo 'Mailer error: ' . $mail->ErrorInfo;
}
else
{
    foreach($conf['email'] as $emailAdres => $emailUser)
    {
	echo '<p class="p_info_16_b" >Zgłoszenie zostało wysłane do - <span style="color:#000000;">'.$emailUser." (".$emailAdres.')</span></p>';
    }
}						