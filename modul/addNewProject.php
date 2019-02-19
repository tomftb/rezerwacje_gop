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
    $_POST["nazwaProjektu"]=trim($_POST["nazwaProjektu"]);
    $_POST["nazwaProjektu"] = stripslashes($_POST["nazwaProjektu"]);
       
    $dbLink->query('SELECT * FROM projekt WHERE UPPER(NAZWA)=UPPER(TRIM(?)) ',$_POST["nazwaProjektu"]);
        if(count($dbLink->queryReturnValue())>0)
        {
            echo "<span style=\"color:red\">W bazie danych istnieje już rekord o podanej nazwie - </span>".$_POST["nazwaProjektu"];
        }
	else
	{
            // INSERT TO DATABASE
            $_POST["nazwaProjektu"]=trim($_POST["nazwaProjektu"]);
            $curretDateTime=date('Y-m-d H:i:s');
            $dbLink->query('INSERT INTO projekt 
            (NAZWA,
            ROZMIAR,
            ROZ_JED,
            ZGL_LOGIN,
            ZGL_N_I,
            ZGL_EMAIL,
            ZGL_OSOBY,
            ZGL_DAT,
            ZGL_HOST
            )
		VALUES
		(?,?,?,?,?,?,?,?,?)'
                 ,$_POST["nazwaProjektu"].','.$_POST["rozmiarPlik"].','.$_POST['rozmiarJednostka'].','.$_SESSION['username'].','.$_SESSION["nazwiskoImie"].','.$_SESSION["mail"].','.$_POST["przypisaniPracownicy"].','.$curretDateTime.','.$_SERVER['HTTP_HOST']);  
	
	//SEND E-MAIL
	if(checkFile("function/sendMail.php")) include("function/sendMail.php");
	
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

