$(document).ready(function() {
    $('#submit').click(function() {
	var txt = $('#input').val();
	alchemize('entity',txt,print);
	alchemize('sentiment',txt,print);
	alchemize('keyword',txt,print);
	alchemize('concept',txt,print);
	alchemize('relation',txt,parseRels);
	alchemize('category',txt,print);
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
	sys.addEdge(cur.subject.text,cur.object.text,
		{name:cur.action.text});
	console.log("Subject: "+cur.subject.text);
	console.log("Verb: "+cur.action.text);
	console.log("Object: "+cur.object.text);
	console.log('\n');
    }
}
