
function elapsedSeconds(startTime, time) {
    return Math.floor(((time - startTime) / 1000));
}

function elapsedMinutes(startTime, time) {
    return Math.floor(((time - startTime) / 1000 / 60));
}

function Timer(parent, message) {
    var that=this;
    var startTime;
    var duration;
    var remainingnode = $("<div class='sss-minutes'/>");
    var messagenode = $("<div class='sss-message'/>");
    this.node = $("<div class='sss-timer'/>");
    this.node.append(messagenode);
    this.node.append(remainingnode);
    parent.append(this.node);
    messagenode.html(message);
    this.reset = function(minutes, time) {
	duration = minutes;
	startTime = time;
	that.update(time);
    }
    this.update = function(time) {
	var remaining;
	if (startTime) {
	    remaining = duration - elapsedMinutes(startTime, time);
	} else {
	    remaining = duration;
	}
	remainingnode.html(remaining + " minutes");
    }
}

function Details(parent) {
    var that=this;
    var startTime;
    var elapsednode = $("<div class='sss-precise-time'/>");
    this.node = $("<div class='sss-details'/>");
    this.node.append(elapsednode);
    parent.append(this.node);
    this.reset = function(time) {
	seconds = 0;
	startTime = time;
	that.update(time);
    }
    this.update = function(time) {
	if (startTime) {
	    var elapsed = elapsedSeconds(startTime, time);
	    elapsednode.html(elapsed + " seconds");
	}
    }
}

function Spine(elem, minutes) {
    var that = this;
    var root = elem;
    var remaining = minutes;
    var message = "I'll be available in...";
    var timer = new Timer(root, message);
    var details = new Details(root);
    var timeoutId;
    var startDate;

    var increment = function() {
	timeoutId = window.setTimeout(increment, 1000);
	that.update(remaining);
    }

    this.isComplete = function(date) {
	return elapsedMinutes(startDate, date) >= remaining;
    }

    this.update = function(remaining) {
	var currTime = new Date();
	timer.update(currTime);
	details.update(currTime);
	if (that.isComplete(currTime)) {
	    that.stop();
	    alert("DONE!");
	}
    }

    this.reset = function() {
	startDate = new Date();
	timer.reset(remaining, startDate);
	details.reset(startDate);
    }

    this.start = function() {
	that.reset();
	console.log("Starting! " + startDate);
	increment();
    }

    this.stop = function() {
	window.clearTimeout(timeoutId);
	console.log("Stopped! " + new Date());
    }

    timer.node.click(function() {
	that.start();
    });

    details.node.click(function() {
	that.stop();
    });


    this.reset();
};
