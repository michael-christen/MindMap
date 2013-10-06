from django.db import models

# Create your models here.
class Lecture(models.Model):
    title = models.CharField(max_length=250)
    creationTime = models.DateTimeField(auto_now_add=True)

class Note(models.Model):
    lecture = models.ForeignKey(Lecture)
    text = models.TextField()
