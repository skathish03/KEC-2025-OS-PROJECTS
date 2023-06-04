from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def say_hello(req):
    return render(req,'home.html')  

def add1(req):
    a=req.POST['pnum']
    b=req.POST['rnum']
    c=''
    d=''
    for i in range(1,int(a)+1):
        c+=str(i)
    for i in range(1,int(b)+1):
        d+=str(i)
    return render(req,'temp.html',{'c':c,'d':d})

def add(req):
    a=req.POST['p1']
    b=req.POST['r1']
    x=[]
    for i in b:
        h='ins'+i
        x.append(int(req.POST.get(h)))
    print(x)
    return render (req,'base.html',{'c':a,'d':b,'h':"",'z':"",'lis':x})

def check(req):
    max=[]
    alloc=[]
    l=req.POST['lis']
    a=req.POST['p1']
    b=req.POST['r1']
    try:
        for i in a:
            x=[]
            for j in b:
                h='m'+i+j
                x.append(req.POST.get(h))
            max.append(list(map(int,x)))
        for i in a:
            x=[]
            for j in b:
                h='a'+i+j
                x.append(req.POST.get(h))
            alloc.append(list(map(int,x)))
        y={}
        avail={}
        scheduled={}
        v=list(map(int,l[1:-1].split(", ")))
        u={}
        for i in b:
            y[i]=0
            avail[i]=0
            u[i]=v[int(i)-1]
        for i in a:
            scheduled[i]=False
        for i in b:
            for j in alloc:
                y[i]+=j[int(i)-1]
        print(y.items())
        print(u)
        for i in b:
            if y[i]>u[i]:
                return render (req,'base.html',{'c':a,'d':b,'h':"fail",'z':"Allocation exceeds Total instances",'need':"",'lis':l})
        need=[]
        for i in range(len(a)):
            x=[]
            for j in range(len(b)):
                n=max[i][j]-alloc[i][j]
                if n<0:
                    return render (req,'base.html',{'c':a,'d':b,'h':"fail",'z':"Allocation exceeds Max Value",'need':"",'lis':l})
                x.append(n)
            need.append(x)
        for i in b:
            avail[i]=u[i]-y[i]
        # print(scheduled.values())
        final=[]
        while False in scheduled.values():
            p=0
            for i in a:
                if scheduled[i]!=True:
                    p+=1
                    flag=True
                    for j in b:
                        if avail[j]<need[int(i)-1][int(j)-1]:
                            flag=False
                            break
                    if flag==True:
                        for j in b:
                            avail[j]+=alloc[int(i)-1][int(j)-1]
                        print(avail)
                        scheduled[i]=True
                        p=0
                        final.append('p'+i)
            if p==len(a):
                return render (req,'base.html',{'c':a,'d':b,'h':"dead",'z':"",'need':need,'lis':l})   
        print(final)
        return render (req,'base.html',{'c':a,'d':b,'h':"success",'z':final,'need':need,'lis':l})
    except Exception:
        return HttpResponse("<h1>Error</h1>")