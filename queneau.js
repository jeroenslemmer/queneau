

var currentSonnet = [];
var currentSonnetSet = {};

var sonnetFrameLineTemplate = '';
var displaySonnetFrameLine = function(lineNr, box, maxBase, newSonnetPart){
	var line = document.createElement('DIV');
	line.innerHTML = sonnetFrameLineTemplate;
	line.id = 'sonnet-line-' + lineNr.toString();
	box.appendChild(line);
	$('#'+line.id + ' .base').attr('max', maxBase.toString());
	$('#'+line.id).addClass('sonnet-line');
	if (newSonnetPart){
		$('#'+line.id).addClass('new-sonnet-part');
	}
}

var displaySonnetFrame = function(sonnetSet, boxId){
	var box = document.getElementById(boxId);
	if (!box) return;
	// create sonnet frame
	var newSonnetPart = false;
	var l = 0;
	for (let c = 0; c < sonnetSet.scheme.length; c++){
		if (sonnetSet.scheme.charAt(c) != ' '){
			displaySonnetFrameLine(l, box, sonnetSet.sonnets.length, newSonnetPart);
			l++;
			newSonnetPart = false;
		} else {
			newSonnetPart = true;
		}
	}
}

var displayCurrentSonnetLine = function(lineNr){
	$('#sonnet-line-'+ lineNr + ' .line').html(currentSonnet.lines[lineNr].text);
	$('#sonnet-line-'+ lineNr + ' .base').html((currentSonnet.lines[lineNr].base + 1).toString());	
}

var displayCurrentSonnet = function(){
	for (let l in currentSonnet.lines){
		displayCurrentSonnetLine(l);
	}
}

var randomizeSonnetPerLine = function(sonnetSet){
	sonnet = {title: '', lines: []};
	for (let l = 0; l < sonnetSet.sonnets[0].lines.length; l++){
		let p = Math.floor(Math.random() * sonnetSet.sonnets.length);
		sonnet.lines.push({text: sonnetSet.sonnets[p].lines[l], base: p});
	}
	return sonnet;
}

var randomizeCurrentSonnetPerLine = function(){
	currentSonnet = randomizeSonnetPerLine(currentSonnetSet);
	displayCurrentSonnet();
}

var changeCurrentSonnetLineBase = function(event){
	var parent = $(event.target).parent();
	var lineNr = parent[0].id.replace('sonnet-line-','');
	var delta = parseInt($(event.target).attr('delta'));
	currentSonnet.lines[lineNr].base += delta;
	if (currentSonnet.lines[lineNr].base == -1){
		currentSonnet.lines[lineNr].base = currentSonnetSet.sonnets.length-1;
	}
	if (currentSonnet.lines[lineNr].base == currentSonnetSet.sonnets.length){
		currentSonnet.lines[lineNr].base = 0;
	}
	currentSonnet.lines[lineNr].text = currentSonnetSet.sonnets[currentSonnet.lines[lineNr].base].lines[lineNr];
	displayCurrentSonnetLine(lineNr);
}

var randomizeCurrentSonnetLineBase = function(event){
	var parent = $(event.target).parent();
	var lineNr = parent[0].id.replace('sonnet-line-','');
	var oldBase = currentSonnet.lines[lineNr].base;
	do {
		currentSonnet.lines[lineNr].base = Math.floor(Math.random() * currentSonnetSet.sonnets.length );
	} while (oldBase == currentSonnet.lines[lineNr].base);
	currentSonnet.lines[lineNr].text = currentSonnetSet.sonnets[currentSonnet.lines[lineNr].base].lines[lineNr];
	displayCurrentSonnetLine(lineNr);
}


$(function(){
	sonnetFrameLineTemplate = document.getElementById('sonnetline-template').innerHTML;
	currentSonnetSet = sonnetSet1;
	displaySonnetFrame(currentSonnetSet,'sonnet');
	randomizeCurrentSonnetPerLine();
	$('#randomizePerLine').on('click',randomizeCurrentSonnetPerLine);
	$('.delta-base').on('click',changeCurrentSonnetLineBase);
	$('.base').on('click',randomizeCurrentSonnetLineBase);
});

