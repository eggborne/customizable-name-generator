<?php
	include("config.php");

	$postData = json_decode(file_get_contents("php://input"), TRUE);
	$userID = $postData['userID'];
	$rulesetID = $postData['rulesetID'];
	$ruleType = $postData['ruleType'];
	$newList = json_encode($postData['newList']);

	$sql = mysqli_query($link, "UPDATE `invalid-strings` SET $ruleType='$newList' WHERE id='$rulesetID';");

	if($sql){
		echo $rulesetID;
  }else{     
    echo ' --- QUERY FAILED :(';          
	}
	mysqli_close($link);
?>