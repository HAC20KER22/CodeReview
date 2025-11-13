from django.db import models

class CodeReview(models.Model):
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500, default="Uploaded directly in the server")
    file_hash = models.CharField(max_length=64, unique=True)
    review_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    anything = models.Int

    def __str__(self):
        return self.file_name



