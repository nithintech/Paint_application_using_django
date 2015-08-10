'''from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite2.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)'''
from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
   url('^$', 'paint.views.home'),
   # url(r'^time/$', current_datetime),
  #  url(r'^gallery/$', gallery),
   url(r'^save/$', 'paint.views.save'),
   url(r'^savelist/$', 'paint.views.savelist'),
    url(r'^loaddata/$', 'paint.views.loaddata'),
)

'''
urlpatterns = patterns('',
    url('^$', home),
    url(r'^time/$', current_datetime),
    url(r'^gallery/$', gallery),
    url(r'^save/$', save),
    url(r'^loaddata/$', loaddata),
    url(r'^gallery/([^/]+)$', load),
)
'''
