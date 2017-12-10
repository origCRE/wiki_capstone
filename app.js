// ---------------------
// state object 
//----------------------

var fbData = { 
	gameCards:[], // defined and controlled from genGameCard()
	team1Score: 0,
    team2Score: 0,
	currentQ: 0,
	numOfCards: 3 // how many cards for game ... will be set by user?
};	

function GameCard(cardTitle, cardDesc){
	this.cardTitle = cardTitle;
	this.cardDesc = cardDesc;
}

// ---------------------
// process game data ...
//----------------------

function genGameCard(fbData, cardTitle, cardDesc){
	var card = new GameCard(cardTitle, cardDesc); 
    fbData.gameCards.push(card);
    console.log("new entry!!!!!");
    for (var i =0; i < fbData.gameCards.length; i++){
    	console.log(fbData.gameCards[i]);
    }
	if (fbData.numOfCards === fbData.gameCards.length){
    	//build transistion function to move to game play...
    	console.log("3 cards...");
    	triggerGameMode();
	}
} // end selectGameCard func...

// ---------------------
// render page
//----------------------
function triggerGameMode(){
	console.log("triggered");
	$('.gamePlay').removeClass('hideThis');
	$('.searchDiv').addClass('hideThis');
}



// ---------------------
// api call and render page for user selections
//----------------------

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
			$('#output').html('');
			for(var i =0; i < data[1].length; i++){
				var htmlTemplate = "<div><div class='well'><a class='dataHook' href=" +
			                        data[3][i]+"><h2>"+data[1][i]+ "</h2>" + "<p>" +data[2][i]+
			                       "</p></a>" + 
			                       '<button id="usrChoice" class="btn userSelection">select</button></div></div>';
				$("#output").prepend(htmlTemplate);  
          }
		} // ajax - success func end...
	}) // ajax end
} //getWikiData end...

function prepForNextCardGen(){
	$("#output").empty();
}

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

   	$(document).on("click", ".userSelection", function(){
		var thisParent = $( this ).parent();
		var aTag = $(thisParent).find('.dataHook');
		var cardTitle = $(aTag).find('h2').text();
		var cardDesc = $(aTag).find('p').text();
        genGameCard(fbData, cardTitle, cardDesc);
        // console.log(fbData.gameCards.length);
        prepForNextCardGen();
	});

});	