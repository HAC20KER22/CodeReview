from django.urls import path
from .views import CodeUploadView, CodeReviewView

urlpatterns = [
    path('upload/', CodeUploadView.as_view(), name='code-upload'),
    path('review/', CodeReviewView.as_view(), name='code-review'),
]
