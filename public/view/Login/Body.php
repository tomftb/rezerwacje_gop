<?php if(!defined('APP_NAME')) { die();}?>
<body>
<div class="login-page">
	<div class="container">
		<div class="row">
			<div class="col-xl-8 m-auto col-sm-8 col-12">
				<div class="log-box">
					<div class="row">
						<div class="col-xl-5 col-sm-5 col-12 pad-right-0 ">
							<div class="logo-back  d-flex flex-wrap align-items-center">
                                                            <img src="<?=APP_URL?>/gt_utilities/gt_logo_280_175.png" class="" alt="Logo_Geofizyka_Torun">                       
							</div>
						</div>
						<div class="col-xl-7 col-sm-7 col-12 pad-left-0">
                                                    <form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="index.php" name="loginForm"> 
							<div class="log-content">
								<h1><?=APP_NAME?></h1>
								<div class="log-body">
                                                                    <div class="form-group myr-top">
                                                                        <label>Login</label>
                                                                        <input type="text" class="form-control custome-input" name="username" placeholder="Login" value="<?=filter_input(INPUT_POST,'username')?>">
                                                                    </div>
                                                                    <div class="form-group myr-top">
                                                                        <label>Password</label>
                                                                            <input type="password" name="password" class="form-control custome-input" placeholder="Password">
                                                                    </div>

                                                                    <div class="log-btn text-right"> 
                                                                        <button type="submit" class="btn btn-theme1 pull-right" name="login">Zaloguj</button>
                                                                    </div> 
                                                                </div>
                                                                    <div class="log-bottom-cotent" >
                                                                        <p class="small text-left text-secondary">* Logowanie przy użyciu konta Lokalnego/MS Active Directory.</p>
                                                                    </div>
								</div>
							</div>
                                                        </form>
                                                    
						</div>
                                    <div class="row">
                                        <div class=" col-12">
                                        <?php
                                        if($this->err)
                                        {
                                            echo '<div class="'.$this->bgColor.'" style="border-radius:0px 0px 10px 10px; ">';
                                            echo '<div class="text-center text-white p-2 mb-0" >';
                                            echo ''.$this->err.'';
                                            echo '</div>';
                                            echo '</div>';
                                        }
                                        ?>
                                        </div>
                                    </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

