<?php
	include("config.php");

	$postData = json_decode(file_get_contents("php://input"), TRUE);
  $userID = $postData['userID'];
  $token =  $postData['token'];
	$rulesetID = $postData['rulesetID'];
  $newPatterns = json_encode($postData['newPatterns']);

  $cookieMatch = mysqli_query($link,"SELECT id FROM `users` WHERE id='$userID' AND token='$token'");
  
  if ($cookieMatch) {
    echo 'TOKEN MATCH :)';
    $patternID = mysqli_query($link,"SELECT id FROM `patterns` WHERE creatorID='$userID' AND rulesetID='$rulesetID';");
    if ($patternID) {
      // echo 'PATTERN OK - ';
      // echo $patternID;
      $sql = mysqli_query($link, "UPDATE `patterns` SET patternObject='$newPatterns' WHERE creatorID='$userID' AND rulesetID='$rulesetID';");
      if($sql){
        echo ' >>> SAVED THAT!';
      }else{
        echo 'NO SAVO :(';          
      }
    } else {
      echo 'PATTERN NOT GOT :(';
    }    
  } else {
    echo 'TOKEN NO MATCH :(';
  }


	
	mysqli_close($link);
?>