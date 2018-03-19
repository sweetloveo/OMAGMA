#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import codecs
import yaml
from firebase import Firebase
import re
f = Firebase('https://omagma-abe44.firebaseio.com/gearmotors')

with codecs.open('a.json', "r",encoding='utf-8', errors='ignore') as data_file:
    data = json.load(data_file)

dump_data = json.dumps(data)
y_data = yaml.safe_load(dump_data)
a = y_data[0]

for y in y_data:
    firebase_data = {}
    for a in y:
        b = a
        if "Rated Current".lower() in a.lower():
            b = 'rated current'
        key = re.sub(r'[\W.\/()]+', '', b).lower()
        firebase_data[key] = { 'name': b, 'value': y[a]}
    print firebase_data
    print '\n\n=====\n\n'
    r = f.push(firebase_data)
