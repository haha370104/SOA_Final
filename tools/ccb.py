import requests
import json
from model.bank_product import bank_product, db


def update():
    brands = ['01', '02', '03', '04']
    product = []

    for b in brands:
        page = 1
        while True:
            req = requests.post('http://finance.ccb.com/cc_webtran/queryFinanceProdList.gsp?jsoncallback=jsonpCallback',
                                {'pageNo': page, 'pageSize': 15, 'queryForm.provinceId': 310, 'queryForm.brand': b,
                                 'queryForm.saleStatus': '-1'})
            result = json.loads(req.text.lstrip('\r\n').lstrip('jsonpCallback(').rstrip(')'))
            if len(result['ProdList']) == 0:
                print('完成:', b)
                break
            else:
                page += 1
                product += result['ProdList']
    count = 0
    for pr_json in product:
        ID = pr_json['code']
        name = pr_json['name']
        rate = float(pr_json['yieldRate'])
        currency_dic = {'01': '人民币', '12': '英镑', '13': '港币', '14': '美元', '15': '瑞士法郎', '29': '澳元', '33': '欧元',
                        '27': '日元', '28': '加元'}
        currencies = currency_dic[pr_json['currencyType']]
        risk = int(pr_json['riskLevel'])
        if risk > 1:
            type_flag = True
        else:
            type_flag = False
        duration = int(pr_json['investPeriod'])
        duration_flag = True
        product_url = 'http://finance.ccb.com/cn/finance/jiaoyi/purchase.html?FUNC_NO=0&CURR_COD=01&PRCT_CDE={0}&PRCT_PRD=182&INDI_MIN_AMT=50000&INDI_STEP_ATM=10000&PRCT_TYP=8&PROVINCE_ID=000'.format(
            pr_json['code'])
        start_amount = pr_json['purFloorAmt']
        if bank_product.query.get(ID) == None:
            p = bank_product(ID, name, rate, duration, duration_flag, type_flag, product_url, start_amount, '中国建设银行',
                             currencies)
            db.session.add(p)
            count += 1
    db.session.commit()
    return {'update_count': count}
