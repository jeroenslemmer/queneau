<?php
	$myfile = fopen("count.txt", "r");
	$count = fread($myfile,100);
	fclose($myfile);
	$count++;
	$myfile = fopen("count.txt", "w+");
	fwrite($myfile, $count);
	fclose($myfile);
	echo $count;

