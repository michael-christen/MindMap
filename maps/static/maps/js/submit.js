$(document).ready(function() {
    $('#submit').click(function() {
	var txt = $('#input').val();
	alchemize('entity',txt,print);
	alchemize('sentiment',txt,print);
	alchemize('keyword',txt,print);
	alchemize('concept',txt,print);
	alchemize('relation',txt,parseRels);
	alchemize('category',txt,parseCat);
    });
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
	console.log("Subject: "+cur.subject.text);
	console.log("Verb: "+cur.action.text);
	console.log("Object: "+cur.object.text);
	console.log('\n');
    }
}

function parseCat(catObj)
{
    $('#Category').text('Category: '+catObj.category);
}
