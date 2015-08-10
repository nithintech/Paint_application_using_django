from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder
import json
'''
from django.template.loader import get_template

def pnt(request):
    return render(request,'paintapp.html',{})
'''
from django.template.loader import get_template
from django.shortcuts import render_to_response
from django.template import RequestContext
from paint.models import Pic
from django.template import Context
from django.http import HttpResponse

'''
from django.http import HttpResponse
from django.template.loader import get_template

from paint.models import Image
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import datetime
'''
def home(request):
    return render_to_response('paintapp.html')
def galle(request):
    return render_to_response('paintapp.html')

@csrf_exempt
def save(request):
	iname=request.POST.get('name')
	idata=request.POST.get('data')
	p=Pic(name=iname,data=idata)
	p.save()
	return render_to_response('paintapp.html')

@csrf_exempt
def savelist(request):
	if request.is_ajax():
		ajax_res = []
		pic_ids = Pic.objects.all()
		for pic in pic_ids:
			ajax_res.append(pic.name)
		return HttpResponse(json.dumps(ajax_res,cls=DjangoJSONEncoder),content_type="text/json")

@csrf_exempt
def loaddata(request):
	posts = []
	if request.is_ajax():
		name = request.POST['name']
		pic = Pic.objects.filter(name=name)
		if pic:
			posts=[dict(id=i.id,title=i.name,imagedata=i.data) for i in pic]
			return HttpResponse(json.dumps(posts,cls=DjangoJSONEncoder),content_type="text/json")
	return render(request,'paintapp.html',{'posts':posts})

