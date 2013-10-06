var highlights= new Array();

$(document).ready(function() {
    $('#submit').click(function() {
	var txt = $('#input').val();
	alchemize('entity',txt,parseEntities);
	alchemize('sentiment',txt,print);
	alchemize('keyword',txt,parseKeywords);
	alchemize('concept',txt,parseConcepts);
	alchemize('relation',txt,parseRels);
	alchemize('category',txt,parseCat);
    });
    $('.carousel').carousel('pause');
    $(document).click(function(){removeHighlighting();});
    $('#saveNote').click(function()
	{
	$('#saveText').val($('#input').val());
	$('#noteForm').submit();
	});
});

function removeHighlighting()
{
   $('#keywordList').children().removeClass('active');
   /*
   var curH = highlights.shift();
   var text =
       $($('#keywordList').children('li').get(curH))
       .text();
   var str = $('#input').val();
   str = str.replace(/(<mark>)/,"");
   str = str.replace(/(<\/mark>)/,"")
   */
   //$('#input').val(str);
}

function insertHighlighting(curNode)
{
    curNode.addClass('active');
    var text = curNode.text();
    var re = new RegExp('('+text+')');
    var str = $('#input').val();
    str = str.replace(re,"<mark>$&</mark>");
    $('#highlighted').html(str);
    $('#myModal').modal();
   //$('#input').val(str);
}

function alchemize(type,text,fxn)
{
    $.post('/alchemy/'+type,{'txt':text},function(response) {
	fxn(JSON.parse(response));});
}
function print(str)
{
    console.log(str);
}

function addListItem(list, newStr)
{
    list.append("<li>"+newStr+"</li>");
}


function parseRels(relObj)
{
    var relations = relObj.relations;
    for(var i = 0; i < relations.length; ++i)
    {
	var cur = relations[i];
	var curNode = sys.getNode(cur.subject.text);
	if(curNode)
	    curNode.data.subject = true;
	else
	    sys.addNode(cur.subject.text,{subject:true});
	curNode = sys.getNode(cur.object.text);
	if(curNode)
	    curNode.data.object = true;
	else
	    sys.addNode(cur.object.text,{object:true});

	sys.addEdge(cur.subject.text,cur.object.text,
		{name:cur.action.text, length:6});
	var row = document.createElement('div');
	$(row).addClass('row').addClass('item');
	if(i==0)
	    $(row).addClass('active');
	var card = document.createElement('div');
	$(card).addClass('card').addClass('span6').
	    addClass('offset3').addClass('hero-unit');
	var question = document.createElement('div');
	$(question).addClass('question').text('Question: '+cur.subject.text + ' '+
		cur.action.text+ ' what?').appendTo($(card));
	var btn = document.createElement('button');
	$(btn).addClass('btn').text('Answer:').click(function(){
		$(this).siblings('.answer').toggle();})
	    .appendTo($(card)).css('display','inline-block');
	var answer = document.createElement('div');
	$(answer).addClass('answer').text(cur.object.text)
	   .css('display','inline-block').hide().appendTo($(card));
	$(card).appendTo($(row));
	$(row).appendTo($('#flashList'));
	/*
	addListItem($('#flashcardHolder'),
		cur.subject.text + ' '+ cur.action.text+ ' what?');
		*/
    }
}

function parseCat(catObj)
{
    $('#Category').text('Category: '+catObj.category);
}

function makeWikiLink(text){
    return "<a target='_blank' href='http://wikipedia.org/wiki/"+encodeURIComponent(text)+ "'>"+text+"</a>";
}

function parseConcepts(conceptObj)
{
    var concepts = conceptObj.concepts;
    for(var i = 0; i < concepts.length; ++i)
	addListItem($('#conceptList'),makeWikiLink(concepts[i].text));
}
function parseKeywords(keyWordObj)
{
    var keywords = keyWordObj.keywords;
    console.log(keywords);
    for(var i = 0; i < keywords.length; ++i)
    {
	var keyw = keywords[i].text;
	addListItem($('#keywordList'),'<a>'+keyw+'</a>');
	$('#keyWordList').children().last().click(function(e){
	    alert('hello');
	});
    }
    $('#keywordList').children().click(function(e){

	    var needs = !$(this).hasClass('active');
	    removeHighlighting();
	    if(needs)
	    {
	        insertHighlighting($(this));
	    }
	    e.preventDefault();
	    e.stopPropagation();
    });
}
function parseEntities(entityObj)
{
    var entities = entityObj.entities;
    for(var i = 0; i < entities.length; ++i)
	addListItem($('#entityList'),makeWikiLink(entities[i].text));
}

