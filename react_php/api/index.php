<?php 
use PHPMailer\PHPMailer\PHPMailer;
require_once "PHPMailer/PHPmailer.php";
require_once "PHPMailer/SMTP.php";
require_once "PHPMailer/Exception.php";

$type = $_GET['tp'];
if($type=='signup') signup(); 
elseif($type=='signdoc') signdoc();
elseif($type=='login') login();
elseif($type=='loginadmin') loginadmin(); 
elseif($type=='changestat') changestat(); 
elseif($type=='upload') upload();
elseif($type=='feedUpdate') feedUpdate(); 
elseif($type=='feedDelete') feedDelete(); 
elseif($type=='FileAccess') FileAccess();
elseif($type=='grantAccess') grantAccess();
elseif($type=='ApproveAccess') ApproveAccess();
elseif($type=='ApproveAccessPre') ApproveAccessPre();
elseif($type=='statusBack') statusBack();
elseif($type=='statusBackp') statusBackp();
elseif($type=='uploadpre') uploadpre();
elseif($type=='PreAccess') PreAccess();
elseif($type=='fPassword') forgotPassword();
elseif($type=='newPassword') newPassword();
elseif($type=='verifyOtp') verifyOtp();


function verifyOtp()
{
    require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $otp = $json['otp'];
       $query = "select * from otp where token='$otp'";
       $result= $db->query($query);
       $rowCount=$result->num_rows;

       if($rowCount>0)
       {
        $userData = $result->fetch_object();
        $user_id=$userData->id;
        $sql = "delete from otp where 1";
             $retval = mysqli_query($db,$sql);
             if(!$retval)
             {
                 echo '{"error":"OTP not deleted"}';
             }
             

            else
             {

     $query = "select * from logins where id='$user_id'"; 
       $result= $db->query($query);
       $rowCount=$result->num_rows;
             
                     if($rowCount>0)
                         {
                            $userData = $result->fetch_object();
                            $userData = json_encode($userData);
                            echo '{"userData":'.$userData.'}';
                        }
                        else{
                            echo '{"error":"User ID not found"}';
                        }
             }
         }
       
       else{
        echo '{"error":"OTP is incorrect"}';
       }
}

function newPassword()
{
    require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $id = $json['id'];
       $password = $json['password'];
       if($id>0)
    {
        $sql = "update logins set password='$password' where id='$id'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Password not changed"}';
	}
	else
	{
		echo '{"success":"Your password has been reset successfully!"}';
	}
    }
}

function forgotPassword()
{
    require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $email = $json['email'];
       $username= $json['uname'];
       $userData ='';
       $query = "select * from logins where email='$email' and username='$username'";
       $result= $db->query($query);
       $rowCount=$result->num_rows;
             
        if($rowCount>0)
        {
            $userData = $result->fetch_object();
             $user_id=$userData->id;
             $user_uname=$userData->username;
             $mail = new PHPMailer();
             try {
             $mail->SMTPOptions = array(
                 'ssl' => array(
                 'verify_peer' => false,
                 'verify_peer_name' => false,
                 'allow_self_signed' => true
                 )
                 );
         
             $mail->isSMTP();
             $mail->Host = 'smtp.gmail.com';
             $mail->SMTPAuth = true;
             $mail->Username = 'medicochain33@gmail.com';
             $mail->Password = 'medicochain8792';
             $mail->Port = 465;
             $mail->SMTPSecure = 'ssl';
         
             //$url = "http://".$_SERVER["HTTP_HOST"].dirname($_SERVER["PHP_SELF"])."/resetPassword.php?id=$user_id";
            $url= "http://localhost:3000/resetpage?id=$user_id";
             $mail->isHTML(true);
             $mail->setFrom('medicochain33@gmail.com', 'MedicoChain');
             $mail->addAddress($email);
             $mail->Subject = "Reset Your Password";
             $mail->Body = "Greetings from MedicoChain!!<br/>
                            We observed that you requested for password reset to MedicoChain.<br/>
                            User ID: $user_id<br/>
                            USername: $user_uname<br/><br/>
                            Use the below link in order to change the password to the system.<br/>
                             <a href='$url'>Click here to reset your password</a><br/><br/>Regards<br/>Team MedicoChain";
         
             $mail->send();
             echo '{"success":"Verification mail has been sent!"}';
             }
             catch(Exception $e) {
                echo '{"error":"ERROR!". $mail->ErrorInfo}' ;
             }
        
            
        }
        else 
        {
            echo '{"error":"Email not registered!"}';
        }

}

function login() 
{ 
       require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $username = $json['username']; $password = $json['password']; 
       $userData =''; 
	   $query = "select * from logins where username='$username' and password='$password'"; 
       $result= $db->query($query);
       $rowCount=$result->num_rows;
             
        if($rowCount>0)
        {
            $userData = $result->fetch_object();
            $user_id=$userData->id;
            $user_uname=$userData->username;
            $user_email=$userData->email;

            $otp=rand(1001,9999);
            $mail = new PHPMailer();
             try {
             $mail->SMTPOptions = array(
                 'ssl' => array(
                 'verify_peer' => false,
                 'verify_peer_name' => false,
                 'allow_self_signed' => true
                 )
                 );
         
             $mail->isSMTP();
             $mail->Host = 'smtp.gmail.com';
             $mail->SMTPAuth = true;
             $mail->Username = 'medicochain33@gmail.com';
             $mail->Password = 'medicochain8792';
             $mail->Port = 465;
             $mail->SMTPSecure = 'ssl';
         
             //$url = "http://".$_SERVER["HTTP_HOST"].dirname($_SERVER["PHP_SELF"])."/resetPassword.php?id=$user_id";
            //$url= "http://localhost:3000/resetpage?id=$user_id";
             $mail->isHTML(true);
             $mail->setFrom('medicochain33@gmail.com', 'MedicoChain');
             $mail->addAddress($user_email);
             $mail->Subject = "Verify OTP to Login";
             $mail->Body = "Greetings from MedicoChain!<br/><br/>You tried to login to the system using <br/>
                            Username: $user_uname<br/>
                            User ID: $user_id<br/>
                            Kindly verify your activity using the OTP sent through this mail.
                            Your One Time Password is <h3>$otp</h3><br/><br/>
                            Regards<br/>
                            Team MedicoChain";
         
             $mail->send();



            $sql = "insert into otp(token,id) values('$otp','$user_id')";
             $retval = mysqli_query($db,$sql);
             if(!$retval)
             {
                 echo '{"error":"OTP not sent"}';
             }
             

            else
             echo '{"success":"Verification mail has been sent!"}';
             }
             catch(Exception $e ) {
                //echo '{"error":"ERROR!". $mail->ErrorInfo}' ;
             }
        



            //$userData = json_encode($userData);
            // echo '{"success":'.$userData.'}';
            

            
        }
        else 
        {
            echo '{"error":"Sorry! Incorrect credentials"}';
        }

    
}

function loginadmin() 
{ 
       require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $username = $json['username']; $password = $json['passworde']; 
       $userData =''; 
	   $query = "select * from admin where username='$username' and password='$password'"; 
       $result= $db->query($query);
       $rowCount=$result->num_rows;
             
        if($rowCount>0)
        {
            $userData = $result->fetch_object();
            $user_id=$userData->username;
            $userData = json_encode($userData);
            echo '{"userData":'.$userData.'}';

            
        }
        else 
        {
            echo '{"error":"Wrong username and password"}';
        }

    
}



function signup() {
    
        require 'config.php';

              
        $json = json_decode(file_get_contents('php://input'), true);
        $username = $json['username'];
        $password = $json['password'];
        $id = $json['id'];
        $email = $json['email'];
		

        /*$username_check = preg_match("/^[A-Za-z0-9_]{4,10}$/i", $username);
        $email_check = preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$/i', $email);
        $password_check = preg_match('/^[A-Za-z0-9!@#$%^&*()_]{4,20}$/i', $password);*/
       
        /*if($username_check==0) 
            echo '{"error":"Invalid username"}';
        elseif($email_check==0) 
            echo '{"error":"Invalid email"}';
        elseif($password_check ==0) 
            echo '{"error":"Invalid password"}';*/

        if (strlen(trim($username))>0 && strlen(trim($password))>0 && $id>0)
        {
           
	$sql = "insert into logins(id,username,password,email) values('$id','$username','$password','$email')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Patient not added"}';
	}
	else
	{
		echo '{"success":"Patient added"}';
	}
	}
}

            /*$userData = '';
            
            $result = $db->query("select * from users where username='$username' or email='$email'");
            $rowCount=$result->num_rows;
            //echo '{"text": "'.$rowCount.'"}';
           
            if($rowCount==0)
            {
                                
                $db->query("INSERT INTO users(username,password,email,name)
                            VALUES('$username','$password','$email','$name')");
                $userData ='';
                $query = "select * from users where username='$username' and password='$password'";
                $result= $db->query($query);
                $userData = $result->fetch_object();
                $user_id=$userData->user_id;
                $userData = json_encode($userData);
                echo '{"userData":'.$userData.'}';
            } 
            else {
               echo '{"error":"username or email exists"}';
            }
        }
        else{
            echo '{"text":"Enter valid data2"}';
        }
   
}*/

function signdoc() {
    
        require 'config.php';

              
        $json = json_decode(file_get_contents('php://input'), true);
        $username = $json['username'];
        $password = $json['password'];
        $spec=$json['spec'];
        $name = $json['name'];
		$email = $json['email'];
		$address = $json['address'];
		$filehash = $json['added_file_hash'];
		

        $username_check = preg_match("/^[A-Za-z0-9_]{4,10}$/i", $username);
        //$email_check = preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$/i', $email);
        $password_check = preg_match('/^[A-Za-z0-9!@#$%^&*()_]{4,20}$/i', $password);
       
        if($username_check==0) 
            echo '{"error":"Invalid username"}';
       // elseif($email_check==0) 
           // echo '{"error":"Invalid email"}';
        elseif($password_check ==0) 
            echo '{"error":"Invalid password"}';

        elseif (strlen(trim($username))>0 && strlen(trim($password))>0 && $username_check>0 && $password_check>0)
        {
           

            $userData = '';
            
            $result = $db->query("select * from doctor where username='$username'");
            $rowCount=$result->num_rows;
            //echo '{"text": "'.$rowCount.'"}';
           
            if($rowCount==0)
            {
                                
                $db->query("INSERT INTO doctor(name,username,spec,password,address,email,filehash)
                            VALUES('$name','$username','$spec','$password','$address','$email','$filehash')");

                $userData ='';
                $query = "select * from doctor where username='$username' and password='$password'";
                $result= $db->query($query);
                $userData = $result->fetch_object();
                $userData = json_encode($userData);
                echo '{"userData":'.$userData.'}';
            } 
            else {
               echo '{"error":"username or email exists"}';
            }

        }
        else{
            echo '{"text":"Enter valid data"}';
        }
   
}

function changestat()
{
	require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['doct_id'];
	$username = $json['username'];
    $password = $json['pasword'];
    $email=$json['email'];
	$feedData = '';
	if($doc_id>0 && (strlen($username))>0 && (strlen($password))>0)
	{
	$sql = "insert into logins(id,username,password,email) values('$doc_id','$username','$password','$email')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Doctor has been approved already "}';
	}
	else
	{
        $mail = new PHPMailer();
             try {
             $mail->SMTPOptions = array(
                 'ssl' => array(
                 'verify_peer' => false,
                 'verify_peer_name' => false,
                 'allow_self_signed' => true
                 )
                 );
         
             $mail->isSMTP();
             $mail->Host = 'smtp.gmail.com';
             $mail->SMTPAuth = true;
             $mail->Username = 'medicochain33@gmail.com';
             $mail->Password = 'medicochain8792';
             $mail->Port = 465;
             $mail->SMTPSecure = 'ssl';
         
             //$url = "http://".$_SERVER["HTTP_HOST"].dirname($_SERVER["PHP_SELF"])."/resetPassword.php?id=$user_id";
            $url= "http://localhost:3000/login";
             $mail->isHTML(true);
             $mail->setFrom('medicochain33@gmail.com', 'MedicoChain');
             $mail->addAddress($email);
             $mail->Subject = "Approved by Admin";
             $mail->Body = "Greetings from MedicoChain!!<br/>
                            Your registration has been approved by the Admin. You can login to the system using the following credentials<br/>
                            Username: $username<br/>
                            User password: $password<br/>
                            Use the below link in order to login to the system.<br/>
                             <a href='$url'>Click here to login</a><br/><br/>Regards<br/>Team MedicoChain";
         
             $mail->send();
             echo '{"success":"Doctor approved"}';
             }
             catch(Exception $e) {
                echo '{"error":"ERROR!". $mail->ErrorInfo}' ;
             }
        
        
	}
	}
}

function upload()
{
	require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['doc_id'];
	$pat_id = $json['patid'];
	$filename = trim($json['filename']);
    $filehash = trim($json['filehash']);
    $dname=trim($json['dname']);
	if($doc_id>0 && $pat_id>0 && (strlen($filename))>0 && (strlen($filehash))>0)
	{
	$sql = "insert into files(doc_id,pat_id,name,filehash,status,dname) values('$doc_id','$pat_id','$filename','$filehash',0,'$dname')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Report not uploaded"}';
	}
	else
	{
		echo '{"success":"Report uploaded"}';
	}
	}
}
function uploadpre()
{
	require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['doc_id'];
	$pat_id = $json['patid'];
    $filename = trim($json['filename']);
    $datep=trim($json['datep']);
    $filehash = trim($json['filehash']);
    $dname=trim($json['dname']);
	if($pat_id>0)
	{
	$sql = "insert into prescription(doc_id,pat_id,name,filehash,datep,status,dname) values('$doc_id','$pat_id','$filename','$filehash','$datep',0,'$dname')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Prescription not uploaded"}';
	}
	else
	{
		echo '{"success":"Prescription uploaded"}';
	}
	}
}
function FileAccess()
{

    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update files set status=1 where doc_id='$doc_id' and pat_id= '$pat_id'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Request not submitted"}';
	}
	else
	{
		echo '{"success":"Your file request has been sent to the patient"}';
	}
    }

}

function PreAccess()
{

    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update prescription set status=1 where doc_id='$doc_id' and pat_id= '$pat_id'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Request not submitted"}';
	}
	else
	{
		echo '{"success":"Your file request has been sent to the patient"}';
	}
    }

}

function grantAccess()
{ $userData = '';
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
    $pat_id = $json['pid'];
    if($pat_id>0)
    {
        $query = "select * from files"; 

            $result= $db->query($query);
                $userData = $result->fetch_object();
                $userData = json_encode($userData);
                echo '{"userData":'.$userData.'}';
       

    }

}


function ApproveAccess()
{
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update files set status=2 where pat_id= '$pat_id' and ind='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Doctor"}';
	}
    }
}

function ApproveAccessPre()
{
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update prescription set status=2 where pat_id= '$pat_id' and indexp='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Hospital"}';
	}
    }
}

function statusBack()
{       
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($ind>0 && $pat_id>0)
    {
        $sql = "update files set status=0 where pat_id= '$pat_id' and ind='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Doctor"}';
	}
    }

}

function statusBackp()
{       
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($ind>=0 && $pat_id>0)
    {
        $sql = "update prescription set status=0 where pat_id= '$pat_id' and indexp='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Doctor"}';
	}
    }

}


/*function details() {
    require 'config.php';
    try {
        $sql = "select * from doctor";
		$result = mysqli_query($db,$sql);
		echo '[';
		for ($i=0 ; $i<mysqli_num_rows($result) ; $i++) {
			echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
		}
		echo ']';
        
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    
}
    
   
}
function feedUpdate(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'), true);
    $user_id=$json['user_id'];
    $feed=$json['feed'];
    
    $feedData = '';
    if($user_id !=0)
    {
        $query = "INSERT INTO feed ( feed, user_id) VALUES ('$feed','$user_id')";
        $db->query($query);              
    }
    $query = "SELECT * FROM feed WHERE user_id=$user_id ORDER BY feed_id DESC LIMIT 10";
    $result = $db->query($query); 
    $feedData = mysqli_fetch_all($result,MYSQLI_ASSOC);
    $feedData=json_encode($feedData);
    
    echo '{"feedData":'.$feedData.'}';
}
function feedDelete(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'), true);
    $user_id=$json['user_id'];
    $feed_id=$json['feed_id'];
         
    $query = "Delete FROM feed WHERE user_id=$user_id AND feed_id=$feed_id";
    $result = $db->query($query);
    if($result)       
    {        
        echo '{"success":"Feed deleted"}';
    } else{
     
        echo '{"error":"Delete error"}';
    }
       
       
    
}*/

?>