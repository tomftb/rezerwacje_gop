<?php
echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_OK\">Załadowano funkcję </span>- ".basename(__FILE__,'.php')."</p>";
$ADLDAP_CON="";
if(checkFile('.cfg/users.php')) include('.cfg/users.php');
	if(in_array($_POST["username"],$conf['validusers']))
	{
		$dn="";
		$_POST["username"] = strtolower($_POST["username"]);
		if (!empty($_POST["password"]))
		{
			$conf['adldapurl'] = 'ldap://geofizyka.geofizyka.pl';
			$conf['aduserfilter'] = '(&(sAMAccountName=%u)(objectcategory=person)(objectclass=user))';
			$conf['adusertree'] = 'ou=Geofizyka, dc=geofizyka, dc=pl';
			if(!$ADLDAP_CON)
			{
				$ADLDAP_CON = ldap_connect('ldap://geofizyka.geofizyka.pl');
			}
			if($ADLDAP_CON)
			{
				if(@ldap_bind($ADLDAP_CON,'ldap@geofizyka.pl','Ld4p321'))
				{
					$filter = str_replace('%u',$_POST["username"],$conf['aduserfilter']);
					$sr = ldap_search($ADLDAP_CON, $conf['adusertree'], $filter);;
					$result = ldap_get_entries($ADLDAP_CON, $sr);
					if($result['count'] == 1)
					{
						if(@ldap_bind($ADLDAP_CON,$result[0]['dn'],$_SESSION["password"]))
						{
							@ldap_unbind($ADLDAP_CON);
							$_SESSION["username"]=$_POST["username"];
							$_SESSION["permission"]="yes";
							foreach($_POST as $klucz=>$wartosc)
							{
								unset($_POST[$klucz]);	
							};
						}
					} 
					@ldap_unbind($ADLDAP_CON);
				}
			}
		}
		else
		{
			$err='<p class="p_err">Nieprawidłowa nazwa użytkownika lub hasło.</p>';   
		}
	}
	else
	{
		$err='<p class="p_err">Brak uprawnienia do zalogowania sie.</p>';
	};
?>
