import requests, re, sqlite3
from datetime import datetime

URL = 'http://news.sina.com.cn/o/2018-07-09/doc-ihezpzwt7518762.shtml'

def get_sina():
    base_url={
        '娱乐':"http://ent.sina.com.cn/",
        "时政":"http://gov.sina.com.cn/",
        #'科技','游戏','体育','财经'
    }
    data={}
    for key in base_url:
        data[key]=[]
        source=requests.get(base_url[key])
        source.encoding='utf-8'
        source=source.text
        urls=re.findall(
            '<a href="(.*?)".*?>(.*?)</a>',
            source,
            flags=re.DOTALL
        )
        print(key)
        print(len(urls))
        #print(urls)
        urls=list(filter(url_filter,urls))
        print(len(urls))
        #print(urls)
        for i in urls:
            url=i[0]
            #print(url)
            try:
                source=requests.get(url)
                source.encoding='utf-8'
                source=source.text
                title,author,content=get_data_sina(key,source)
            except:
                continue
            try:
                data[key].append([])
                print(len(content[0]))
                content=content[0].strip()
                if len(content)<300:
                    data[key].pop()
                    continue
                if content[:4]=="<img":
                    data[key].pop()
                    continue
                print(title)
                print(author)
                print(len(content))
                data[key][-1].append(re.sub("<.*?>","",title[0]))
                data[key][-1].append(author[0])
                data[key][-1].append(content)
            except:
                data[key].pop()
                continue

    for key in base_url:
        print("{}:{}".format(key,len(data[key])))
    return data

def url_filter(i):
    if len(i[1])<10 or len(i[0])<10:
        return False
    if not "shtml" in i[0]:
        return False
    
    che=['<','>','&']
    for c in che:
        if c in i[1]:
            return False
    
    return True
    


def get_data_sina(type,source):
    title,author,content=[],[],[]
    if type=="时政":
        title=re.findall(
                '<h1 class="main-title">(.*?)</h1>',
                source
            )

        author=re.findall(
		        '<a href=".*?" target="_blank" class="source" data-sudaclick="content_media_p" rel="nofollow">(.*?)</a>',
                source
            )
                #print(author)
        content=re.findall(
                '<div class="article" id="article">(.*?)<p class="show_author">.*?</p>',
                source,
                flags=re.DOTALL
            )
    if type=="娱乐":
        title=re.findall(
                '<h1 class="main-title">(.*?)</h1>',
                source
            )

        author=re.findall(
		        '<span class="source-nolink ent-source"><a href=".*?" target="_blank" class="source ent-source" data-sudaclick="content_media_p" rel="nofollow">(.*?)</a></span>',
                source
            )
                #print(author)
        content=re.findall(
                '''<div class="article" id="artibody">.*?<script type="text/javascript">.*?</script>(.*?)<p class="article-editor">.*?</p>''',
                source,
                flags=re.DOTALL
            )

    return title,author,content


def write_to_db(data):
    from app import create_app,db
    from app.models import User,News
    app=create_app()
    with app.app_context():
        for key in data:
            for da in data[key]:
                user=User.query.filter_by(username=da[1]).first()
                if not user:
                    user=User(
                        username=da[1],
                        password="12345678",
                        mail=da[1]+"@SwenNews.com",
                        confirmed=True
                    )
                    db.session.add(user)
                    db.session.commit()
                try:
                    if News.query.filter_by(title=da[0]).first():
                        continue
                    news=News(
                        title=da[0],
                        content=da[2],
                        news_type=key,
                        checked=1,
                        user_id=user.id
                    )
                    db.session.add(news)
                    db.session.commit()
                except:
                    continue
                    
        

########  debug & test-run  ########

if __name__ == '__main__':

    data=get_sina()
    #write_to_db(data)

    
