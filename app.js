

// ---------------------
// Process data and render pages...
//----------------------

// call data and format the entries
// need to add a "select" button to each...
function getWikiData(searchTerm) {
	console.log(searchTerm);
	var url = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm +"&format=json&callback=?";
	$.ajax({
		url:url,
		type: "GET",
		async: false,
		dataType: 'json',
		success: function(data, status, jqXHR){
			console.log(data);
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
        console.log(cardTitle);
        console.log(cardDesc);

	});

});	