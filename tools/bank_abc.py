import requests
import json
from model.bank_product import bank_product, db


def update():
    product = []
    i = 1
    total = 0
    while True:
        req = requests.get(
            'http://ewealth.abchina.com/app/data/api/DataService/BoeProductV2',
            params={'i': i, 's': 15, 'o': 0, 'w': '%E5%8F%AF%E5%94%AE%7C%7C%7C%7C%7C%7C%7C1%7C%7C0%7C%7C0'})
        result = json.loads(req.text)
        if total == 0:
            total = result['Data']['Table1'][0]['total']
        length = len(result['Data']['Table'])
        i += 1
        product += result['Data']['Table']
        if total > length:
            print(total)
            total -= length
        else:
            break
    count = 0
    for pr_json in product:
        ID = pr_json['ProductNo']
        name = pr_json['ProdName']
        try:
            rate = float(pr_json['ProdProfit'].split('-')[0].rstrip('%'))
        except:
            continue
        currencies = '人民币'
        duration = pr_json['ProdLimit'].rstrip('天')
        if duration.find('最低') != -1:
            duration = duration.lstrip('最低持有')
            duration_flag = False
        else:
            duration_flag = True
        duration = int(duration)
        if pr_json['ProdYildType'].find('非保本') != -1:
            type_flag = False
        else:
            type_flag = True
        product_url = 'http://ewealth.abchina.com/fs/{0}.html'.format(ID)
        start_amount = int(float(pr_json['PurStarAmo']))
        bank_name = '中国农业银行'
        if bank_product.query.get(ID) == None:
            p = bank_product(ID, name, rate, duration, duration_flag, type_flag, product_url, start_amount, bank_name,
                             currencies)
            db.session.add(p)
            count += 1
    db.session.commit()
    return {'update_count': count}