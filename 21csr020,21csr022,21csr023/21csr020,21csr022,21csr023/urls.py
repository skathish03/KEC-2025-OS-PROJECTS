from django.urls import path
from . import views

urlpatterns=[
    path('',views.say_hello),
    path('add',views.add),
    path('add1',views.add1),
    path('check',views.check)

]