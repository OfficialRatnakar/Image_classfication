from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Simple health check view
def health_check(request):
    return HttpResponse("OK", status=200)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('classifier.urls')),
    path('health/', health_check, name='health_check'),  # Add health check URL
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
