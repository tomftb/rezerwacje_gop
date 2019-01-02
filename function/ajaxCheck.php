<?php
//echo "AJAX CHECK";
//----
// JS
echo '
		<script type="text/javascript">
		// <![CDATA[
';			
				
echo "
// binds form submission and fields to the validation engine
jQuery(\"#addFormProject\").validationEngine({ 
promptPosition: \"centerRight\" , 
scroll: false, 
showArrow: true, 
addSuccessCssClassToField: \"ok_val\",
addFailureCssClassToField: \"error_val\",

    onValidationComplete: function(form, status){
        if (status == true) {                   
					//console.log(\"form check ok\");
					
					//usun wszystkie spacje z numeru
					
					var username = ($(\"#username\").val());
					var host=($(\"#host\").val());
					var zzz = ($(\"#nazwaProjektu\").val());
					
					zzz = zzz.replace(/\s/g, '');
					//console.log(zzz);
					$(\"#nazwaProjektu\").val(zzz);
					var yyy = ($(\"#przypisaniPracownicy\").val());
					//yyy= yyy.replace(/\s/g, ''); // WHITE SPACES
					yyy=yyy.trim();
					//console.log(yyy);
					$(\"#przypisaniPracownicy\").val(yyy);
					
					//ajax call czy ten id jest wolny
					$.ajax({ type: \"GET\",   
									 url: \"modul/m_valid_input_data.php?type=3&username=\"+username+\"&dataToCheck=\" + encodeURIComponent(zzz).replace(/%2F/g,'%252F').replace(/%5C/g,'%255C').replace(/%20/g,'+') ,   
									 async: false,
									 success : function(text)
									 {
											 response = text;
											//alert(response);
											 if(response!='')
											 {
												//alert('Response - '+response);
												
											 }//if response
									 }//success
					});
					
					//ajax call czy ten id jest wolny
					$.ajax({ type: \"GET\",   
									 url: \"modul/m_valid_input_data.php?type=2&username=\"+username+\"&dataToCheck=\" + encodeURIComponent(yyy).replace(/%2F/g,'%252F').replace(/%5C/g,'%255C').replace(/%20/g,'+') ,   
									 async: false,
									 success : function(text)
									 {
											 response2 = text;
											//alert(response2);
											 if(response2!='')
											 {
												//alert('Response2 - '+response2);
												
											 }//if response2
									 }//success
					});
					
					if(response!='' || response2!='')
					{
						//pokaz warning ze id zajety
						//alert('Projekt istnieje');
						//$(\"#nowy_projekt_warn\").html(response);
						$(\"#nowy_projekt_name\").html(response);
						$(\"#divErr\").show();
						//$(\"#przypisaniPracownicy_warn\").html(response2);
						$(\"#przypisaniPracownicy_name\").html(response2);
						$(\"#divErr2\").show();
					}
					else
					{
						//ukryj warning ze id zajety
						$(\"#divErr\").hide();
						$(\"#divErr2\").hide();
						form.validationEngine('detach');
						form.submit();
					}
					
        }//true
    }//fx  

			});//bind
";	
	
			
		
echo '
			// ]]>
		</script>
';			
//----
?>