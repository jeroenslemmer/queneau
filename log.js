var Logger = function(aViewId){
	var cue = [];
	var viewId = aViewId;
	
	
	this.do = function(object){
		cue.push(object);
	}

	var execute = function(){
		var view = document.getElementById(viewId);
		if (view){
			while(cue.length > 0){
				view.style.display = 'block';
				view.innerHTML = cue[0].toString() + '&nbsp;&nbsp;&nbsp;<br>' + view.innerHTML;
				cue.splice(0,1);
			}
		}
	}
	setInterval(execute,100);
}

logger = new Logger('log');