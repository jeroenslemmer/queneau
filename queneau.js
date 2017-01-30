

var currentSonnet = [];
var currentRhymeScheme = '';
var currentSonnetSet = {};

var sonnetFrameLineTemplate = '';
var createSonnetFrameLine = function(lineNr, newSonnetPart){
	var line = document.createElement('DIV');
	line.id = 'line-' + lineNr.toString();
	line.className = 'line'+ ((newSonnetPart)?' new-sonnet-part':'');
	line.innerHTML = '&nbsp;';
	return line;
}

var displaySonnetFrame = function(sonnetSet, boxId){
	var box = document.getElementById(boxId);
	if (!box) return;
	// create sonnet frame
	var newSonnetPart = false;
	var l = 0;
	for (let c = 0; c < sonnetSet.rhymeScheme.length; c++){
		if (sonnetSet.rhymeScheme.charAt(c) != ' '){
			box.appendChild(createSonnetFrameLine(l, newSonnetPart));
			l++;
			newSonnetPart = false;
		} else {
			newSonnetPart = true;
		}
	}
	var name = document.createElement('DIV');
	name.id = 'line-99';
	name.className = 'line';
	box.appendChild(name);
}

var displayCurrentSonnetLine = function(lineNr){
	var line = document.getElementById('line-'+lineNr.toString());
	displayLine(currentSonnet.lines[lineNr], lineNr, '$');
}

var displayCurrentSonnet = function(){
	resetAnimation();
	for (let l in currentSonnet.lines){
		displayCurrentSonnetLine(l);
	}
	startAnimation();
}

var randomizeRhymeScheme = function(){
	var part1 = rhymeSchemes.octaaf[Math.floor(Math.random() * rhymeSchemes.octaaf.length)];
	var part2 = rhymeSchemes.sextet[Math.floor(Math.random() * rhymeSchemes.sextet.length)];
	currentRhymeScheme = part1 + ' ' + part2;
}

var getRhymeCharacterMap = function(rhymeCharacter, rhymeScheme){
	var map = [];
	for (let l = 0; l < rhymeScheme.length; l++){
		if (rhymeScheme.charAt(l) == rhymeCharacter) map.push(l);
	}
	return map;
}

var getRandomLineFromBaseSonnet = function(lineNr,baseNr,sonnetSet){
	var rhymeCharacter = currentRhymeScheme.replace(/\s/g,'').charAt(lineNr);
	var searchScheme = sonnetSet.rhymeScheme.replace(/\s/g,'');
	var rhymeCharacterMap = getRhymeCharacterMap(rhymeCharacter,searchScheme);
	var randomRhymeCharacterNr = Math.floor(Math.random() * rhymeCharacterMap.length);
	return sonnetSet.sonnets[baseNr].lines[rhymeCharacterMap[randomRhymeCharacterNr]];
}

var lineExists = function(line, lines){
	for (let l in lines){
		if (line === lines[l]) return true;
	}
	return false;
}

var randomizeSonnet = function(sonnetSet){
	randomizeRhymeScheme();
	sonnet = {title: '', lines: []};
	for (let l = 0; l < sonnetSet.sonnets[0].lines.length; l++){
		let baseNr = Math.floor(Math.random() * sonnetSet.sonnets.length);
		do {
			var line = getRandomLineFromBaseSonnet(l, baseNr, sonnetSet);
		} while (lineExists(line, sonnet.lines));
		sonnet.lines.push(line);
	}
	return sonnet;
}

var randomizeCurrentSonnet = function(){
	currentSonnet = randomizeSonnet(currentSonnetSet);
	displayCurrentSonnet();
	//cueAnimatePieter();
}

var animateOpenSonnetStep = function(sonnet){
	if (sonnet.myHeight >= 320) return;
	sonnet.style.height = sonnet.myHeight + 'px';
	sonnet.myHeight += 8;
	setTimeout(animateOpenSonnetStep,10,sonnet);
}


var animateOpenSonnet = function(sonnet){
	sonnet.myHeight = 30;
	setTimeout(animateOpenSonnetStep,20,sonnet);
}


var showSonnet = function(event){
	var title = event.target;
	var index = title.id.replace('title-','');
	var sonnet = document.getElementById('sonnet-'+index);
	sonnet.style.display = 'block';
	animateOpenSonnet(sonnet);
}

var hideSonnet = function(event){
	var title = event.target;
	var index = title.id.replace('title-','');
	var sonnet = document.getElementById('sonnet-'+index);
	sonnet.myHeight = 30;
	sonnet.style.display = 'none';
}

var displayListTitle = function(sonnet,index,titleContainer){
	var title = document.createElement('SPAN');
	title.id = 'title-'+index;
	title.innerHTML = sonnet.title;
	title.addEventListener('mouseenter',showSonnet);
	title.addEventListener('mouseleave',hideSonnet);
	titleContainer.appendChild(title);
}

var displayBaseSonnetTitles = function(container){
	var titleContainer = document.createElement('DIV');
	titleContainer.id = 'base-sonnet-titles';
	container.appendChild(titleContainer);
	for (var s in currentSonnetSet.sonnets){
		if (s > 0 && s < 9){
			titleContainer.appendChild(document.createTextNode(', '));
		} else if (s == 9){
			titleContainer.appendChild(document.createTextNode(' en '));
		}
		displayListTitle(currentSonnetSet.sonnets[s],s,titleContainer);
	}
	titleContainer.appendChild(document.createTextNode('.'));
}

var displayBaseSonnetText = function(sonnet, rhymeScheme, index, textContainer){
	var sonnetContainer = document.createElement('DIV');
	sonnetContainer.id = 'sonnet-'+index;
	var title = document.createElement('H4');
	title.innerHTML = sonnet.title;
	sonnetContainer.appendChild(title);
	var line;
	var part = document.createElement('P');
	var l = 0;
	for (var r = 0; r < rhymeScheme.length; r++){
		if (rhymeScheme.charAt(r) == ' '){
			sonnetContainer.appendChild(part);
			part = document.createElement('P');
		} else {
			if (part.innerHTML > ''){
				part.innerHTML += '<br>';
			}
			part.innerHTML += sonnet.lines[l];
			l++;
		}
	}
	sonnetContainer.appendChild(part);
	textContainer.appendChild(sonnetContainer);
}

var displayBaseSonnetTexts = function(container){
	var textContainer = document.createElement('DIV');
	textContainer.id = 'base-sonnet-texts';
	container.appendChild(textContainer);
	for (var s in currentSonnetSet.sonnets){
		displayBaseSonnetText(currentSonnetSet.sonnets[s],currentSonnetSet.rhymeScheme,s,textContainer);
	}
	var universeSonnets = textContainer.innerHTML.replace(/sonnet-/g,'universe-sonnet-');
	document.getElementById('sonnet-universe').innerHTML = universeSonnets;
}

var displayBaseSonnets = function(){
	var container = document.getElementById('base-sonnets')
	displayBaseSonnetTitles(container);
	displayBaseSonnetTexts(container);
}

document.addEventListener("DOMContentLoaded", function(){
	currentSonnetSet = sonnetSet1;
	displaySonnetFrame(currentSonnetSet,'sonnet');
	document.getElementById('generate').addEventListener('click',randomizeCurrentSonnet);
	displayBaseSonnets();
});

