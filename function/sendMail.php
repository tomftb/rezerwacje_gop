<?php
//echo "SEND MAIL";
//require 'modul/PHPMailer_v5.1/class.phpmailer.php';
									//require 'modul/PHPMailer-master/src/Exception.php';
									//include('./SMTP.php');
									$quota=$_POST["rozmiarPlik"]*30;
									$mailBody="Zarejestrowano zgłoszenie na utworzenie nowego projektu o specyfikacji:\n\nNazwa projektu\t\t-\t".$_POST["nazwaProjektu"]."\n";
									$mailBody.="Rozmiar pliku bazowego\t- \t".$_POST["rozmiarPlik"]." ".$_POST["rozmiarJednostka"]."\n";
									$mailBody.="Sugerowana quota\t- \t".$quota." ".$_POST["rozmiarJednostka"]."\n";
									$mailBody.="Przypisani użytkownicy\t- \t".$_SESSION['nazwiskoImie'].", ".$_POST["przypisaniPracownicy"]."\n\n";
									
									$mailBody.="Zgłaszający\t\t- \t".$_SESSION['nazwiskoImie']." (".$_SESSION["mail"].") ";
									
									if($_SESSION["PHPV"]<7.0)
									{
										
										//echo "PHP 5 <br/>";
										if(checkFile("function/PHPMailer_v5.1/class.phpmailer.php")) include ("function/PHPMailer_v5.1/class.phpmailer.php");
										$mail = new PHPMailer;
									}
									else
									{
										//echo "PHP 7 <br/>";
										if(checkFile("function/PHPMailer-master/src/SMTP.php")) include ("function/PHPMailer-master/src/SMTP.php");
										if(checkFile("function/PHPMailer-master/src/Exception.php")) include ("function/PHPMailer-master/src/Exception.php");
										if(checkFile("function/PHPMailer-master/src/PHPMailer.php")) include ("function/PHPMailer-master/src/PHPMailer.php");
										$mail = new PHPMailer\PHPMailer\PHPMailer();
										
										
									};
									if($_SESSION['username']=='tborczynski') echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_OK\">Załadowano konfigurację PHPMailer dla  PHP</span> ".$_SESSION["PHPV"]."</p>";
									//'tomasz.borczynski@geofizyka.pl'=>'Tomasz Borczyński'
									if(checkFile(".cfg/email.php")) include (".cfg/email.php");
									$conf['email'][$_SESSION["mail"]]= $_SESSION['nazwiskoImie'];
									/*
									echo "<pre>";
									print_r($conf['email']);
									echo "</pre>";
									die('STOP');
									*/
									/* old V
									$tabAddress=array(
													
													$_SESSION['mail'] => $_SESSION['nazwiskoImie']
													
													
													);
*/													
													/* ADD
													
													,'michal.machtel@geofizyka.pl'=>'Michał Machtel'
													,'zbigniew.szychulski@geofizyka.pl' => 'Zbigniew Szychulski'
													,'seweryn.tlalka@geofizyka.pl' => 'Serweryn Tlałka'
													
													
													--
													,'jerzy.kisielewicz@geofizyka.pl' =>'Jerzy Kisielewicz'
													*/
										
											$mail->IsSMTP();
											$mail->Host = "smtp.geofizyka.pl";
											$mail->CharSet = 'UTF-8';
											$mail->setFrom('rezerwacje-gop@geofizyka.pl', 'rezerwacje-gop');
											foreach($conf['email'] as $emailAdres => $emailUser)
											{
												$mail->addAddress($emailAdres, $emailUser);
											}; // END FOREACH
											$mail->Subject  = 'Zgłoszenie na utworzenie udziału dla Projektu';
											$mail->Body     = $mailBody."\n\n--\nTa wiadomość została wygenerowana automatycznie, nie odpowiadaj na nią.";
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
												};
											  
											  
											};
										
?>