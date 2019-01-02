<?php

if(
    (isset($_POST["nazwaProjektu"]) && $_POST["nazwaProjektu"]!=trim('')) &&
    (isset($_POST["rozmiarPlik"]) && $_POST["rozmiarPlik"]!=trim('')) &&
    (isset($_POST["przypisaniPracownicy"]) && $_POST["przypisaniPracownicy"]!=trim(''))
)
{
    foreach($_POST as $valueToTrim)
    {
        $_POST[$valueToTrim]=trim($valueToTrim);
    };
    // SELECT - to cache page refresh
    $tabPL=array('/ą/','/ć/','/ę/','/ł/','/ń/','/ó/','/ś/','/ź/','/ż/','/Ą/','/Ć/','/Ę/','/Ł/','/Ń/','/Ó/','/Ś/','/Ź/','/Ż/');
    $tabANG=array('a','c','e','l','n','o','s','z','z','A','C','E','L','N','O','S','Z','Z');
    $_POST["nazwaProjektu"]=preg_replace($tabPL,$tabANG,$_POST["nazwaProjektu"]);
    if($_SESSION["PHPV"]<7.0)
    {
        $_POST["nazwaProjektu"]=trim($_POST["nazwaProjektu"]);
        $_POST["nazwaProjektu"] = stripslashes($_POST["nazwaProjektu"]);
        $zapytanie = "	SELECT * FROM `projekt`WHERE UPPER(`NAZWA`)=UPPER(TRIM('".$_POST["nazwaProjektu"]."')) ";
        $result =  mysqli_query($connection,$zapytanie) or die ('<p class="SQL_ERR">Zapytanie zakończone niepowodzeniem: <span class="SQL_INFO">' .  mysqli_error($connection).'</span></p>');	
	$znaleziono =  mysqli_num_rows($result); 
	}
        else
	{
            $stmt = $connection->prepare("SELECT * FROM `projekt` WHERE UPPER(`NAZWA`)=UPPER(TRIM(?))");
            $stmt->bind_param(
			's',
			$_POST["nazwaProjektu"]
			);
            $stmt->execute();
            $znaleziono = count($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
            $stmt->close();
	};
	if($znaleziono>0)									
	{
            echo "<span style=\"color:red\">W bazie danych istnieje już projekt o podanej nazwie!</span>";
	}
	else
	{
            // INSERT TO DATABASE
            if($_SESSION["PHPV"]<7.0)
            {
            // PHP 5
            $zapytanie = 
			"
                            INSERT INTO `projekt` (
                                        	`NAZWA`,
						`ROZMIAR`,
						`ROZ_JED`,
						`ZGL_LOGIN`,
						`ZGL_N_I`,
						`ZGL_EMAIL`,
						`ZGL_OSOBY`,
						`ZGL_DAT`,
						`ZGL_HOST`
						) 
												VALUES (
														TRIM('".$_POST["nazwaProjektu"]."'),
														".$_POST["rozmiarPlik"].",
														'".$_POST['rozmiarJednostka']."',
														'".$_SESSION['username']."',
														'".$_SESSION["nazwiskoImie"]."',
														'".$_SESSION["mail"]."',
														'".$_POST["przypisaniPracownicy"]."',
														NOW(),
														'".$_SERVER['HTTP_HOST']."'
														); 
												";
										
												$result =  mysqli_query($connection,$zapytanie) or die ('Zapytanie zakończone niepowodzeniem: ' .  mysqli_error($connection));	
												echo "result - ".$result."<br/>";
												if(!$result)
													{
														echo "<span style=\"color:red\">ERROR INSERT NEW PROJECT TO DB</span>";
													}
										}
										else
										{
											$stmt = $connection->prepare("INSERT INTO `projekt` (
																								`NAZWA`,
																								`ROZMIAR`,
																								`ROZ_JED`,
																								`ZGL_LOGIN`,
																								`ZGL_N_I`,
																								`ZGL_EMAIL`,
																								`ZGL_OSOBY`,
																								`ZGL_HOST`
																								) VALUES (?,?,?,?,?,?,?,?)");
											$stmt->bind_param(
																'sdssssss',
																$_POST['nazwaProjektu'],
																$_POST["rozmiarPlik"],
																$_POST['rozmiarJednostka'],
																$_SESSION['username'],
																$_SESSION["nazwiskoImie"],
																$_SESSION["mail"],
																$_POST["przypisaniPracownicy"],
																$_SERVER['HTTP_HOST']
															);
											$stmt->execute();
											
											if($stmt->affected_rows === 0)
											{
												echo "<span style=\"color:red\">ERROR INSERT NEW PROJECT TO DB</span>";
											}
											else
											{
												$stmt->close();
												$result=TRUE;
											};
											}
											if($result)
											{
												//SEND E-MAIL
												if(checkFile("function/sendMail.php")) include("function/sendMail.php");
											};
										foreach($_POST as $value)
										{
											UNSET($_POST[$value]);
										};
									};//
								}
								else
								{
									//echo "NO PROJECT TO ADD<br/>";
								};

