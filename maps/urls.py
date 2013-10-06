from django.conf.urls import patterns, include, url
from maps import views

urlpatterns = patterns('',
	url(r'^$', views.home),
	url(r'^alchemy/entity$', views.alchemyEntity),
	url(r'^alchemy/sentiment$', views.alchemySentiment),
	url(r'^alchemy/keyword$', views.alchemyKeyword),
	url(r'^alchemy/concept$', views.alchemyConcept),
	url(r'^alchemy/relation$', views.alchemyRelations),
	url(r'^alchemy/category$', views.alchemyCategory),
#url(r'^alchemy/author$', views.alchemyAuthor),
#	url(r'^alchemy/text$', views.alchemyText),
)
