#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd

df = pd.read_csv('database.csv').fillna('-')
del df['item no.']
df.to_json(path_or_buf = 'a.json', orient='records')

