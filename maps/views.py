# Create your views here.
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from sdk_python.alchemyapi import AlchemyAPI
from maps.models import Lecture, Note

import json

def home(request):
    lectures = Lecture.objects.all()
    return render(request, 'maps/home.html',{'lectures':lectures})

def homeLoad(request, noteId):
    note = Note.objects.get(pk=noteId)
    lectures = Lecture.objects.all()
    return render(request, 'maps/home.html',{'lectures':lectures,'noteText':note.text})

def loadAll(request, lectureId):
    lecture = Lecture.objects.get(pk=lectureId)
    lectures = Lecture.objects.all()
    notes = Note.objects.filter(lecture=lecture)
    noteText = ''
    for note in notes:
       noteText += note.text
    return render(request, 'maps/home.html',{'lectures':lectures,'noteText':noteText})
#render(request, 'nsod', {'current':current})
def lectures(request):
    lectures = Lecture.objects.all()
    return render(request, 'maps/lectures.html', {'lectures': lectures})

def lecture(request, lectureId):
    lecture = Lecture.objects.get(pk=lectureId)
    notes = Note.objects.filter(lecture=lecture)
    return render(request, 'maps/lecture.html', {'lecture':lecture,
	    'notes':notes})
 
@csrf_exempt
def createLecture(request):
    if request.method == 'POST':
        title = request.POST['title']
        lec = Lecture(title=title)
        lec.save()
    return redirect('/lectures')

@csrf_exempt
def saveNote(request):
    if request.method == 'POST':
       text = request.POST['text']
       lecture = Lecture.objects.get(pk=request.POST['lecture'])
       note = Note(text=text, lecture=lecture)
       note.save()
    return redirect('/lecture/'+str(lecture.id))

@csrf_exempt
def alchemyEntity(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    	alchemyapi = AlchemyAPI()
    	response = alchemyapi.entities('text', text, {'sentiment':1})
    	return HttpResponse(json.dumps(response))

@csrf_exempt
def alchemySentiment(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    	alchemyapi = AlchemyAPI()
    	response = alchemyapi.sentiment('text', text)
    	return HttpResponse(json.dumps(response))

@csrf_exempt
def alchemyKeyword(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    	alchemyapi = AlchemyAPI()
    	response = alchemyapi.keywords('text', text, {'sentiment':1})
    	return HttpResponse(json.dumps(response))

@csrf_exempt
def alchemyConcept(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    	alchemyapi = AlchemyAPI()
    	response = alchemyapi.concepts('text', text)
    	return HttpResponse(json.dumps(response))

@csrf_exempt
def alchemyRelations(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    	alchemyapi = AlchemyAPI()
    	response = alchemyapi.relations('text', text)
    	return HttpResponse(json.dumps(response))

@csrf_exempt
def alchemyCategory(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    	alchemyapi = AlchemyAPI()
    	response = alchemyapi.category('text', text)
    	return HttpResponse(json.dumps(response))

    """
@csrf_exempt
def alchemyAuthor(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')

@csrf_exempt
def alchemyText(request):
    if request.is_ajax() and request.method == 'POST':
        text = request.POST['txt'].encode('ascii','ignore')
    """
