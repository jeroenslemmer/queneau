
var flyers = [];
var animationFrameDelay = 50;
var textColor = '609E06'; //'90CE2B';
var btextColor = 'f0f0ff';
var colorChannels = [parseInt(textColor.substr(0,2),16),parseInt(textColor.substr(2,2),16),parseInt(textColor.substr(4,2),16)];
var bcolorChannels = [parseInt(btextColor.substr(0,2),16),parseInt(btextColor.substr(2,2),16),parseInt(btextColor.substr(4,2),16)];

// constructor for cue that organizes animation of unlimited number of elements
var AnimationCue = function(intervalTime){
	var _this = this;
	var cue = [];

	// add a target element and its animation function 
	this.push = function(target, change){ 
		cue.push({target: target, change: change});
	}

	// remove a target element from cue
	this.shift = function(target){
		for (var a = 0; a < cue.length; a++){
			if (cue[a].target == target)
				cue.splice(a,1);
		}
	}

	// perform all changes every interval
	var execute = function(){
		// administration of animated targets that have more serial chained animations
		var targetsDone = [];

		var stayInCue;
		var a = 0;
		while (a < cue.length){
			if (targetsDone.indexOf(cue[a].target) == -1){

				// change should return true to stay in cue
				stayInCue = cue[a].change();

				// put in animated targets
				targetsDone.push(cue[a].target);
				// remove this animation-change?
				if (!stayInCue){
					cue.splice(a,1);
				} else {
					a++;
				}
			} else {
				a++;
			}
		}
	}
	// start up endless cycle of execution of changes of elements
	this.interval = setInterval(execute,intervalTime);

	this.start = function(){
		this.interval = setInterval(execute,intervalTime);
	}

	this.stop = function(){
		clearInterval(_this.interval);
		_this.cue = [];
	}
}

// create an animation cue
var animationCue = new AnimationCue(animationFrameDelay);

var animationPart = function(flyer,time){
	var position, transform, top, left, channel;

	if (flyer.flight.landed) return false;

	if (flyer.flight.radius >= 0) {
		top = Math.round(Math.sin(flyer.flight.start + flyer.flight.speed * time / 100) * flyer.flight.radius);
		left = Math.round(Math.cos(flyer.flight.start + flyer.flight.speed * time / 100) * flyer.flight.radius);
		flyer.style.left = left +'px';
		flyer.style.top = top + 'px';

		var channelRed = parseInt(textColor.substr(0,2),16);
		var channelGFinal = parseInt()
		var nextColor = '#';
		for (let i = 0; i < 3; i++){
			nextColor += (Math.floor(Math.min(colorChannels[i]+flyer.flight.radius*3,255))).toString(16);
		}

		flyer.style.color = nextColor;

		if (flyer.flight.radius == 0) 
			flyer.flight.landed = true;

	}
	if (flyer.flight.landed) return false;

	flyer.flight.radius -= flyer.flight.gravity;
	if (flyer.flight.radius < 1){
		flyer.flight.radius = 0;
	}
	return true;
}

var animationFrame = function(){
	animateBaseSonnets2();
	flown = false;
	for (let f in flyers){
		flown = animationPart(flyers[f],animationTime) || flown;
	}
	animationTime += 1;
	if (!flown) {
		return false;
	}
	return true;
}

var Flight = function(){
	this.gravity = 0.6 + Math.random() * 2;
	this.speed = -5 + Math.floor(Math.random()*10);
	this.radius = 100 + Math.floor(Math.random()*100);
	this.start = Math.random() * 2 * Math.PI;
	this.rotationtime = 40 + Math.floor(Math.random()*40);
	this.landed = false;
	return this;
}

var createFlyer = function(wordTxt){
	var flyer = document.createElement('SPAN');
	flyer.appendChild(document.createTextNode(wordTxt));
	flyer.className = 'flyer';
	flyer.flight = new Flight();
	return flyer;
}

var createWordElement = function(wordTxt){
	var word = document.createElement('SPAN');
	word.appendChild(document.createTextNode(wordTxt));
	word.className = 'word';
	var flyer = createFlyer(wordTxt);
	word.appendChild(flyer);
	return word;
}

var displayLine = function(lineTxt, lineNr, splitBy){
	var line = document.getElementById('line-'+lineNr);
	lineTxt = lineTxt.replace('  ',' ');
	var words = lineTxt.split(splitBy);
	for (let i in words){
		let wordElement = createWordElement(words[i]);
		flyers.push(wordElement.firstElementChild);
		line.appendChild(wordElement);
		line.appendChild(document.createTextNode(' '));
	}
}

var preparePieter = function(){
	animationTime = 0;
	flyers = [];
	displayLine('Pieter Breman',99, '$');
}

var animateBaseBackcolor = function(base,thresholdStart, thresholdStop ){
	if (Math.abs(base.myLeft) < thresholdStart && Math.abs(base.myLeft) > thresholdStop){
		for (let c in base.myChannels){
			if (base.myChannels[c] < bcolorChannels[c]){
				base.myChannels[c] = Math.min(base.myChannels[c]+1,255);
			}
		}
	}
	base.style.color = '#'+ base.myChannels[0].toString(16) + base.myChannels[1].toString(16) + base.myChannels[2].toString(16);
}

var animateBaseSonnets2 = function(){
	var child;
	var container = document.getElementById('sonnet-universe');
	for (let e = 0; e < container.children.length; e++){
		child = container.children[e];
		animateBaseBackcolor(child,300,0);
	}
}

var animateBaseSonnets = function(){
	var child;
	var animated = false;
	var container = document.getElementById('sonnet-universe');
	for (let e = 0; e < container.children.length; e++){
		child = container.children[e];
		child.style.left = Math.round(child.myLeft) + 'px';

		if (Math.abs(child.myLeft - child.myLeftEnd) > child.myDeltaLeft) {
			child.myLeft += -1 * Math.sign(child.myLeft - child.myLeftEnd) * child.myDeltaLeft;
			animated = true;
		}

		animateBaseBackcolor(child,700,300);
	}
	return animated;
}

var prepareBaseSonnetsAnimation = function(){
	
	var container = document.getElementById('sonnet-universe');
	var child, sign;
	for (let e = 0; e < container.children.length; e++){
		child = container.children[e];

		sign = ([-1,1])[Math.floor(Math.random()*2)];
		child.myLeft = sign * (500 + Math.floor(Math.random()*1000));
		child.myLeftEnd = -200 + Math.floor(Math.random()*400);
		child.myDeltaLeft = 5 + Math.floor(Math.random()*7);
		child.myChannels = [128,128,128];

		child.style.top = 10 + (Math.floor(Math.random()*150)) + 'px';
		child.style.display = 'block';
	}
	animateBaseSonnets();
}

var endBaseSonnets = function(){
	var container = document.getElementById('sonnet-universe');
	for (let e = 0; e < container.children.length; e++){
		container.children[e].style.display = 'none';
	}
}

var endSonnet = function(){
	var flyers = document.getElementsByClassName('flyer');
	for (var f = 0; f < flyers.length; f++){
		flyers[f].style.color = '';
		//delete flyers[f].style['color'];
	}
}

var startAnimation = function(){
	animationTime = 0;
	prepareBaseSonnetsAnimation();
	animationCue.push('generate',hideButtons);
	animationCue.push('generate',animateBaseSonnets);
	animationCue.push('generate',animationFrame);
	animationCue.push('generate',endBaseSonnets);
	animationCue.push('generate',preparePieter);
	animationCue.push('generate',animationFrame);
	animationCue.push('generate',showButtons);
	animationCue.push('generate',endSonnet);
	animationCue.push('generate',animationCue.stop);
	animationCue.start();
}

var resetAnimation = function(){
	var divs = document.getElementsByClassName('line');
	for (let i in divs) divs[i].innerHTML ='';
}

