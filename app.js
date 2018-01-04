// ---------------------
// state object 
//----------------------

var fbData = { 
	gameCards:[], // defined and controlled from genGameCard()
	score:[],
	gameRound: 1, // track 1 thru 3 rounds of game 
	currentCard: 0,
	numOfCards: 3 // how many cards for game ... will be set by user?
};	

function GameCard(cardTitle, cardDesc){
	this.cardTitle = cardTitle;
	this.cardDesc = cardDesc;
}

function ScoreStat(round, cardID, bucket) {
	this.round = round;
	this.cardID = cardID;
	this.bucket = bucket;
}

// ---------------------
// process game data ...
//----------------------
function getScore(fbData) {
	console.log('blah');
	console.log(fbData.score);
	scoreStats = {}; // return for scoring
	var team1 = 0;
	var team2 = 0;
	var passed = 0;

	for (var i=0; i<fbData.score.length;i++){
    	console.log(i);
    	console.log(fbData.score[i]['bucket']);
    	if (fbData.score[i]['bucket'] === "team1") {
			team1 = team1 +1;
		} else if (fbData.score[i]['bucket'] === "team2") {
			team2 = team2 +1;
		} else {
			passed = passed +1;
		} // if block
	} // end for
    console.log("team1 tally is: " + team1);

    // compile score stats:
    // highScore
    if (team1 > team2){
    	console.log("team1 wins");
        scoreStats["highScore"] = "team1";
    } else if (team1 < team2) {
    	console.log("team2 wins");
    	scoreStats["highScore"] = "team2";
    } else {
    	console.log("team2 wins");
    	scoreStats["highScore"] = "draw";
    }

	// scores
	scoreStats["team1"] = team1;
	scoreStats["team2"] = team2;
	scoreStats["passed"] = passed;

	//return the scoreStats...
	console.log(scoreStats);
	return(scoreStats);

} // end getScore

function updateScore(fbData, bucket) {
	var round = fbData.gameRound;
	cardID = fbData.currentCard;
    console.log("this is the cardID");
    console.log(cardID);
    console.log(bucket);
	var point = new ScoreStat(round, cardID, bucket);
    fbData.score.push(point);
    console.log(fbData.score);
    $('#team1').addClass('hideThis');
	$('#team2').addClass('hideThis');
	$('#pass').addClass('hideThis');
}

function genGameCard(fbData, cardTitle, cardDesc){
	var card = new GameCard(cardTitle, cardDesc); 
    fbData.gameCards.push(card);
    console.log("new entry!!!!!");

	if (fbData.numOfCards === fbData.gameCards.length){
    	triggerGameMode(fbData);
	}
} // end selectGameCard func...

function incrementCurrentCard(fbData) {
	console.log("current card is...");
	console.log(fbData.currentCard);

	var gameOver = false;
	if (fbData.numOfCards !== fbData.currentCard +1){ // else triggers on last card 
		console.log("incrementCurrentCard... length not equal to num of cards!");
		fbData.currentCard +=1;
		return gameOver;
	} else {
		console.log("not incrementing card... length IS equal to num of cards!");
		gameOver = true;
		return gameOver;
	}
}

// ---------------------
// render page
//----------------------
function triggerGameMode(fbData){
	// console.log("triggered");
	$('.gamePlay').removeClass('hideThis');
	$('.searchDiv').addClass('hideThis');
    displayGameCard(fbData);
}

// ---------------------
// api call and render page for user selections
//----------------------
function displayGameCard(fbData) {
    // format card info based on this ^
    $('#cdTitle').text(fbData.gameCards[fbData.currentCard].cardTitle);
    $('#cdDesc').text(fbData.gameCards[fbData.currentCard].cardDesc);
	$('#team1').addClass('hideThis');
	$('#team2').addClass('hideThis');
	$('#pass').addClass('hideThis');
	$('#next').addClass('hideThis');

    
    //set up timer 
    var time = 3; // adjust time here 
	function initTimer(){
		var id = setTimeout(initTimer, 1000); // 
		$('#timeTgt').html(time);
		if(time == 0){
			clearTimeout(id);
			// when timer hits zero do something...
			// console.log("do something here :)");
		    $('#cdTitle').text("Time is up.");
		    $('#cdDesc').text("Please select the score and then hit the 'Next' button");
	        $('#team1').removeClass('hideThis');
	        $('#team2').removeClass('hideThis');
	        $('#pass').removeClass('hideThis');
	        $('#next').removeClass('hideThis');

		    var gameOver = incrementCurrentCard(fbData); 

		    if (gameOver === true){
		    	$('#cdTitle').text("Game Complete");
		        $('#cdDesc').text("Please select the final score, then select the Final Score Button.");
		    	$('#finalScore').removeClass('hideThis');
		        $('#team1').removeClass('hideThis');
		        $('#team2').removeClass('hideThis');
		        $('#pass').removeClass('hideThis');
		        $('#next').addClass('hideThis');

		    }   	
		}
		time --; // set timer countdown interval
	}
	initTimer();


} // end displayGameCard()

function getFinalScore(fbData){
	var scoreObj = getScore(fbData);
	$('.gamePlay').addClass('hideThis');
	$('.tally').removeClass('hideThis');
	console.log("hit on format for end........");
	console.log(scoreObj['highScore']);
	//lowScore , notAnswered...
	$('#tm1').text("Team One had " + scoreObj['team1'] + " points.");
    $('#tm2').text("Team Two had " + scoreObj['team2'] + " points.");
    $('#passed').text(scoreObj['passed'] + " questions were passed on.");

}

function prepForNextCardGen(){
	$("#output").empty();
}  

// call data and format the entries
// need to add a "select" button to each...
function getWikiData(searchTerm) {
	var url = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm +"&format=json&callback=?";
	$.ajax({
		url:url,
		type: "GET",
		async: false,
		dataType: 'json',
		success: function(data, status, jqXHR){
			//console.log(data);
			$('#output').html('');
			for(var i =0; i < data[1].length; i++){
				var htmlTemplate = "<div><div class='well'><a class='dataHook' href=" +
			                        data[3][i]+" target='_blank'><h2>"+data[1][i]+ "</h2>" + "<p>" +data[2][i]+
			                        "</p></a>" + 
			                       '<button id="usrChoice" class="btn userSelection">select</button></div></div>';
				$("#output").prepend(htmlTemplate);  
          }
		} // ajax - success func end...
	}) // ajax end
} //getWikiData end...

// ---------------------
// listener functions...
//----------------------

$(document).ready(function(){
	
	$("#searchTerm").keypress(function(e){		
		if (e.keyCode === 13){
		var searchTerm = $("#searchTerm").val();
		getWikiData(searchTerm);
		}
	});

	$("#search").on("click", function(){
		var searchTerm = $("#searchTerm").val();
		getWikiData(searchTerm);
	});

   	// need $(document).on() to grab button rendered post initial load...
   	$(document).on("click", ".userSelection", function(){
		var thisParent = $( this ).parent();
		var aTag = $(thisParent).find('.dataHook');
		var cardTitle = $(aTag).find('h2').text();
		var cardDesc = $(aTag).find('p').text();
        genGameCard(fbData, cardTitle, cardDesc);
        // console.log(fbData.gameCards.length);
        prepForNextCardGen();
	});

   	// need $(document).on() to grab button rendered post initial load...
   	$(document).on("click", "#next", function(){
		console.log("NEXT button was clicked...");
		displayGameCard(fbData);
	});

   	// team1
   	$(document).on("click", "#team1", function(){
		console.log("team1 button was clicked...");
        updateScore(fbData, "team1");

	});

   	// team2
   	$(document).on("click", "#team2", function(){
		console.log("team2 button was clicked...");
		updateScore(fbData, "team2");
	});

	// pass
   	$(document).on("click", "#pass", function(){
		console.log("pass button was clicked...");
		updateScore(fbData, "pass");
	});

	// location.reload();
	$(document).on("click", "#restart", function(){
		location.reload();
	});


   	$(document).on("click", "#finalScore", function(){
		getFinalScore(fbData);
	});

	
});	