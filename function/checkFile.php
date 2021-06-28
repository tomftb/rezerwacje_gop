<?php
//echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_OK\">Załadowano funkcję </span>- ".basename(__FILE__,'.php')."</p>";
function checkFile($plik)
{
	if(file_exists($plik))
	{
		if(is_file($plik))
		{
			if(is_readable($plik))
			{
				return 1;
			}
			else
			{
				echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_ERR\">Brak prawa do odczytu </span>- ".$plik."</p>";			
			}
		}
		else
		{
			echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_ERR\">Typ pliku nie regularny </span>- ".$plik."</p>";
		}
	}
	else
	{
            echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_ERR\">Plik nie istnieje </span>- ".$plik."</p>";	
	}
return 0;
}
