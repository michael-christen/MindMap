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
});

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
    return "<a href='http://wikipedia.org/wiki/"+encodeURIComponent(text)+ "'>"+text+"</a>";
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
	addListItem($('#keywordList'),keyw);
    }
}
function parseEntities(entityObj)
{
    var entities = entityObj.entities;
    for(var i = 0; i < entities.length; ++i)
	addListItem($('#entityList'),makeWikiLink(entities[i].text));
}

