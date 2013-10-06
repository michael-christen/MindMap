# Create your views here.
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from sdk_python.alchemyapi import AlchemyAPI

import json

def home(request):
    return render(request, 'maps/home.html')
#render(request, 'nsod', {'current':current})
 
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
