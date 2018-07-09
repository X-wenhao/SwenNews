import requests, re, sqlite3
from datetime import datetime

URL = 'http://news.sina.com.cn/o/2018-07-09/doc-ihezpzwt7518762.shtml'

def get():

    # 网页源代码: all HTML-safe
    source = requests.get(URL)
    source.encoding='utf-8'
    source=source.text
    # 食材: [(href, title), (..., ...), ... ]
    title_raw=re.findall(
        '<h1 class="main-title">(.*?)</h1>',
        source
    )
    print(title_raw)
    author=re.findall(
		'<a href="http://finance.people.com.cn/n1/2018/0709/c1004-30133604.html" target="_blank" class="source" data-sudaclick="content_media_p" rel="nofollow">(.*?)</a>',
        source
    )
    print(author)
    content=re.findall(
       '<div class="article" id="article">(.*?)<div class="wap_special" data-sudaclick="content_relativetopics_p">',
        source,
        flags=re.DOTALL
    )
    print(content)
    test=re.findall(
       '原标题：个税改革，亮点不只是起征点（(.*?)）',
        source
    )
    print(test)
    '''
    raw = re.findall(
        '<p class="title"><a class="title may-blank outbound" '
        'data-event-action="title" href="(.*?)" '
        '.*?>(.*?)</a>',
        source
    )
    
    # 因为我们只搜集头条，所以时间就用运行该函数的时间也没什么大问题
    oTime = datetime.now()
    sTime = oTime.strftime('%d %B, %Y').lstrip('0')


    # 做饭
    treated = []
    for each in raw:
        # 打算把所有的新闻都搜集到数据库的一个table里面，方便搜索
        treated.append((each[1], each[0], sTime, 'reddit'))

    # 写入数据库
    _write_to_db(treated)
    '''
    return 1

########  debug & test-run  ########

if __name__ == '__main__':

    get()

    
