import json

import requests
from bs4 import BeautifulSoup
import re

import os

def getBrand(brand_url, num_of_brand_page):
    urls = []
    i = 1
    while i <= num_of_brand_page:
        url = "https://www.tfm-sneaker.vn/" + brand_url + "?q=collections:1781039&page=" + str(i) + "&view=grid"
        html_text = requests.get(url).text
        soup = BeautifulSoup(html_text, "html.parser")
        for j in soup.find_all('div', attrs={'class': 'product-thumbnail'}):
            urls.append(str("https://www.tfm-sneaker.vn" + j.a['href']))
        i += 1
    return urls


def main():
    
    #DEFINE BRAND URL AND NUM OF PAGE
    brand_url = 'puma'
    num_of_brand_page = 1
    #--------------------------------


    file_name = str('rawData/TFM_' + brand_url + '.json')
    urls = getBrand(brand_url, num_of_brand_page)
    item = 0

    with open(file_name, 'a') as outfile:
        outfile.write("[")

    for url in urls:
        html_text = requests.get(url).text
        url = re.sub('https://www.tfm-sneaker.vn/', '', url)
        soup = BeautifulSoup(html_text, "html.parser")
        image_detail = []
        size = []
        
        units = ['US', 'VN', 'CM']
        
        if soup.find('h1', attrs={'class': 'title-head product-title'}):
            name = soup.find('h1', attrs={'class': 'title-head product-title'}).text
        else:
            continue

        if soup.find('span', attrs={'class': 'type_item'}):
            catelogy = soup.find('span', attrs={'class': 'type_item'}).a.text
        else:
            continue

        if soup.find('span', attrs={'class': 'vendor_item'}):
            brand = soup.find('span', attrs={'class': 'vendor_item'}).a.text
        else:
            continue

        if soup.find('span', attrs={'class': 'sku_item'}):
            SKU = soup.find('span', attrs={'class': 'sku_item'}).text
        else:
            SKU = "Đang cập nhật"

        if soup.find('span', attrs={'class': 'quantity_item'}):
            status = soup.find('span', attrs={'class': 'quantity_item'}).text
            status = re.sub('\n', '', status)
            status = re.sub('\t', '', status)
        else:
            continue

        if soup.find('div', attrs={'class': 'tooltip'}):
            color = soup.find('div', attrs={'class': 'tooltip'}).text

        if soup.find('span', attrs={'class': 'special-price'}):
            string_price = soup.find('span', attrs={'class': 'special-price'}).span.text
            number_price = soup.find('meta', attrs={'itemprop': 'price'})['content']
            price_currency = soup.find('meta', attrs={'itemprop': 'priceCurrency'})['content']
        else:
            continue

        if soup.find('span', attrs={'class': 'old-price'}):
            old_price = soup.find('span', attrs={'class': 'old-price'}).span.text
            old_price = re.sub('\n', '', old_price)
            old_price = re.sub('\t', '', old_price)
            old_price_obj = {}
            if(old_price):
                old_price_cus = re.sub('₫', '', old_price)
                old_price_cus = re.sub('\\.', '', old_price_cus)
                old_price_obj = {
                    "string_price": old_price,
                    "number_price": int(old_price_cus),
                    "price_currency": "VND",
                }


        if soup.find('div', attrs={'class': 'swatch-size swatch clearfix'}):
            for m in soup.find('div', attrs={'class': 'swatch-size swatch clearfix'}).find('div', attrs={'class': 'data-value-group'}).find_all('div'):
                raw_size = m['data-value']
                size_obj = {}
                size_cus = re.sub(' ', '', raw_size)
                size_cus = re.sub('Size', '', size_cus)
                arr_size = size_cus.split("-")
                try:
                    for t in range(0, 3, 1):
                        arr_size[t] = re.sub(units[t], '', arr_size[t])
                    
                    size_obj = {
                        'text': raw_size,
                        'US_size': float(arr_size[0]),
                        'VN_size': float(arr_size[1]),
                        'CM_size': float(arr_size[2])
                    }
                    size.append(size_obj)
                except ValueError:
                    size_obj = {}

        if soup.find('div', attrs={'id': 'collapse-1'}).div.p:
            #print(soup.find('div', attrs={'id': 'collapse-1'}).div.p)
            for o in soup.find('div', attrs={'id': 'collapse-1'}).find('div').find('p').find_all('img'):
                image_detail.append(o['src'])

        if soup.find('img', attrs={'id': 'img_01'}):
            image_show_url = soup.find('img', attrs={'id': 'img_01'})['src']

        data = {
            'url': url,
            'name': name,
            'catelogy': catelogy,
            'brand': brand,
            'SKU': SKU,
            'status': status,
            'price': {
                'string_price': string_price,
                'price_value': int(number_price),
                'price_currency': price_currency,
                'old_price': old_price_obj
            },
            'size': size,
            'img_detail_url': image_detail,
            'image_show_url': image_show_url,
            'color': color
        }
        with open(file_name, 'a') as outfile:
            json.dump(data, outfile)
            outfile.write(",")
        print('item: ' + str(item + 1) + ' completed!')
        item+=1


    with open(file_name, 'rb+') as outfile:
        outfile.seek(-1, os.SEEK_END)
        outfile.truncate()
    with open(file_name, 'a') as outfile:
        outfile.write("]")

if __name__ == '__main__':
    main()