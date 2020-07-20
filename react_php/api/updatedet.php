<?php

require 'config.php';

$sql = "select doc_id,name,username,email,password,address,bloodgrp,filehash from doctor";

$result = mysqli_query($db,$sql);

echo '[';
for ($i=0 ; $i<mysqli_num_rows($result) ; $i++) {
      echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
    }
echo ']';

?>