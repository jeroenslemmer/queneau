<?php
	$myfile = fopen("count.txt", "r");
	$count = fread($myfile,100);
	fclose($myfile);

	echo $count;