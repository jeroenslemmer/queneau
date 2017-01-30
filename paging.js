


var openPage = function(pageNr){
	pages = document.getElementsByClassName('page');
	for (var p = 0; p < pages.length; p++){
		pages[p].style.display = 'none';
	}
	document.getElementById('page-'+pageNr).style.display = 'block';
}

var openIntro = function(){
	openPage(2);
	document.getElementById('generate').style.display = "none";
	document.getElementById('back').style.display = "inline";
}

var openSonnet = function(){
	openPage(1);
	document.getElementById('generate').style.display = "inline";
	document.getElementById('back').style.display = "none";	
}

var openCalculations = function(){
	openPage(3);
	document.getElementById('generate').style.display = "none";
	document.getElementById('back').style.display = "inline";
}

var hideButtons = function(){
	var buttons = document.getElementsByTagName('button');
	for (var b = 0; b < buttons.length; b++){
		buttons[b].style.visibility = 'hidden';
	}
}

var showButtons = function(){
	var buttons = document.getElementsByTagName('button');
	for (var b = 0; b < buttons.length; b++){
		buttons[b].style.visibility = 'visible';
	}
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('intro').addEventListener('click',openIntro);
	document.getElementById('back').addEventListener('click',openSonnet);
	document.getElementById('possibilities').addEventListener('click',openCalculations);
});