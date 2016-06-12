import requests
import json
from model.bank_product import bank_product, db


def ICBC_parse(product):
    f = open('ICBC.json')
    dic = json.load(f)
    columns = {}
    for key in dic.keys():
        if dic[key]['complex']:
            args = []
            for arg in dic[key]['value']['key']:
                args.append(product[arg])
            fun = eval(dic[key]['value']['function'])
            columns[key] = fun(args)
        else:
            columns[key] = product[dic[key]['value']]
    return columns


def update():
    product = []
    params = [[1, 1], [1, 2], [2, 3], [2, 4], [3, 5], [3, 8], [7, 10], [4, 6], [6, 9]]
    for param in params:
        req = requests.get('http://www.icbc.com.cn/ICBCDynamicSite2/money/services/MoenyListService.ashx',
                           params={'ctl1': param[0], 'ctls': param[1]})
        product += json.loads(req.text)
    count = 0
    for pr_json in product:
        result = ICBC_parse(pr_json)
        if bank_product.query.get(result['product_ID']) == None:
            p = bank_product(result['product_ID'], result['product_name'], result['interest_rate'],
                             result['duration'], result['duration_flag'], result['type_flag'], result['product_url'],
                             result['start_amount'], result['bank_name'], result['currencies'])
            db.session.add(p)
            count += 1
    db.session.commit()

    return {'update_count': count}
