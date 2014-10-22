// TODO: we'll probably want to change the namespacing here...
var BaselineUtils = {
    getParameterByName: function (name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

function elapsedSeconds(startTime, time) {
    return Math.floor(((time - startTime) / 1000));
}

function elapsedMinutes(startTime, time) {
    return Math.floor(((time - startTime) / 1000 / 60));
}

function elapsedTime(startTime, time) {
    var diff = time - startTime;
    var mins = Math.floor(diff % 36e5 / 60000);
    var secs = Math.floor(diff % 60000 / 1000);
    //return ('00'+mins).slice(-2) + ":" + ('00'+secs).slice(-2);
    return mins + ":" + ('00'+secs).slice(-2);
}

function remainingTime(duration, startTime, time) {
/*
    var totalMS = duration 
//    var secs = (duration * 60 * 1000) - 
    var diff=new Date(time - startTime);
    return diff;
*/
    return elapsedTime(startTime, time);
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
	//remainingnode.attr("title", remainingTime(duration, startTime, time));
    }
}

function Details(parent) {
    var that=this;
    var startTime;
    var elapsednode = $("<span class='sss-precise-time'/>");
    var githubnode = $("<span class='sss-github-link'><a href='https://github.com/nathanwinant/baseline-schedule' target='mir'><img src='assets/transparent-1x1.gif' width='32' height='32' title='Fork me on GitHub' /></a></span>");
    this.node = $("<div class='sss-details'/>");
    this.node.append(elapsednode);
    this.node.append(githubnode);
    parent.append(this.node);
    this.reset = function(time) {
	seconds = 0;
	startTime = time;
	that.update(time);
    }
    this.update = function(time) {
	if (startTime) {
	    var elapsed = elapsedTime(startTime, time);
	    elapsednode.html(elapsed);
	}
    }
}

function BaselineSchedule(elem, minutes) {
    var that = this;
    var root = elem;
    var remaining = minutes;
    var message = "Available in...";
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
