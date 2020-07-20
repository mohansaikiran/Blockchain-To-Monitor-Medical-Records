<?php

require 'config.php';

$sql = "select * from files where status=1";

$result1 = mysqli_query($db,$sql);

$sql = "select * from prescription where status=1";

$result2 = mysqli_query($db,$sql);
$result3=mysqli_num_rows($result2);
$result4=mysqli_num_rows($result1);
if($result3==0)
{
  echo '[';
  for ($i=0 ; $i<mysqli_num_rows($result1) ; $i++) {
        echo ($i>0?',':'').json_encode(mysqli_fetch_object($result1));
      }
      echo ']';   
}
else if($result4==0)
{
  echo '[';
  for ($i=0 ; $i<mysqli_num_rows($result2) ; $i++) {
        echo ($i>0?',':'').json_encode(mysqli_fetch_object($result2));
      }
      echo ']';  
}
else {
  echo '[';
  for ($i=0 ; $i<mysqli_num_rows($result1) ; $i++) {
        echo ($i>0?',':'').json_encode(mysqli_fetch_object($result1));
      }
        echo ',';
      for ($i=0 ; $i<mysqli_num_rows($result2) ; $i++) {
        echo ($i>0?',':'').json_encode(mysqli_fetch_object($result2));
      }
      
  
  echo ']';
}

?>