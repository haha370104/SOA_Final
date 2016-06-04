import requests
from pyquery import PyQuery as pq
from model.bank_product import bank_product, db
import re


def update_comm():
    req = requests.get('http://www.bankcomm.com/BankCommSite/zonghang/cn/lcpd/queryFundInfoList.do')
    content = pq(req.text)
    products = content('dl')
    for product in products:
        product = pq(product)
        ID = product.attr('id').rstrip()
        name = product('dt span.fname').text()
        rate = product('dd h3').text()
        string = product('dt').text()
        if string.find('可赎回') != -1:
            duration = 0
            duration_flag = False
        else:
            duration = int(re.findall('[0-9]{1,4}\s天', string)[0].rstrip('天').rstrip())
            duration_flag = True
        temp = re.findall('起售金额：[0-9\.]+[万]{0,1}\s+\([\u4e00-\u9fa5\s]+\)', string)[0]
        if temp.find('万') != -1:
            start_amount = int(float(re.findall('[0-9\.]+', temp)[0]) * 10000)
        else:
            start_amount = int(re.findall('[0-9]+', temp)[0])
        currencies = re.findall('\([\u4e00-\u9fa5\s]+', string)[0].rstrip().lstrip('(')
        ensure = re.findall('[1-3]R', string)[0]
        if ensure == '1R':
            type_flag = True
        else:
            type_flag = False
        url = 'http://www.bankcomm.com/BankCommSite/zonghang/cn/lcpd/queryFundInfo.do?code={0}'.format(ID)
        if bank_product.query.get(ID) == None:
            p = bank_product(ID, name, rate, duration, duration_flag, type_flag, url, start_amount, '交通银行', currencies)
            db.session.add(p)
    db.session.commit()


