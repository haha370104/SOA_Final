import requests
import json
from model.bank_product import bank_product, db
import re


def update():
    product = []
    params = [[1, 1], [1, 2], [2, 3], [2, 4], [3, 5], [3, 8], [7, 10], [4, 6], [6, 9]]
    for param in params:
        req = requests.get('http://www.icbc.com.cn/ICBCDynamicSite2/money/services/MoenyListService.ashx',
                           params={'ctl1': param[0], 'ctls': param[1]})
        product += json.loads(req.text)
    count = 0
    for pr_json in product:
        rate = float(re.findall('[0-9\.]+', pr_json['intendYield'])[0].rstrip('%'))
        duration = pr_json['productTerm']
        if duration == '无固定期限':
            duration = 0
        else:
            duration = int(re.findall('[0-9]', duration)[0])
        duration_flag = False
        url = 'http://www.icbc.com.cn/icbc/%E7%BD%91%E4%B8%8A%E7%90%86%E8%B4%A2/%E7%90%86%E8%B4%A2%E4%BA%A7%E5%93%81/%E4%BA%A7%E5%93%81%E9%A2%84%E8%A7%88.htm?productId=' + \
              pr_json['prodID']
        if pr_json['categoryL2'] == '6':
            if pr_json['productName'].find('美元') != -1:
                currencies = '美元'
            elif pr_json['productName'].find('欧元') != -1:
                currencies = '欧元'
            else:
                currencies = '其他'
        else:
            currencies = '人民币'
        if bank_product.query.get(pr_json['prodID']) == None:
            p = bank_product(pr_json['prodID'], pr_json['productName'], rate, duration, duration_flag, None, url,
                             int(float(pr_json['buyPaamt'])), '中国工商银行', currencies)
            db.session.add(p)
            count += 1
    db.session.commit()
    return {'update_count': count}
