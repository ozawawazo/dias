#coding:utf-8

import sys
import os
import MeCab

def extractKeyword(text):
    tagger = MeCab.Tagger("-Ochasen")
    encoded_text = text.decode('utf-8').encode("eucjp")
    encoded_node = tagger.parseToNode(encoded_text)
    keywords = []
    while encoded_node:
        encoded_node_surface = encoded_node.surface.decode("eucjp")
        encoded_node_feature = encoded_node.feature.decode("eucjp")
        if encoded_node.surface.decode("eucjp") != ",": #カンマを取り除く
            if encoded_node_feature.split(",")[0] == u"名詞":
                keywords.append(encoded_node_surface)
            if encoded_node_feature.split(",")[0] == u"動詞":
                keywords.append(encoded_node_feature.split(",")[6])
            if encoded_node_feature.split(",")[0] == u"形容詞":
                keywords.append(encoded_node_feature.split(",")[6])
            if encoded_node_feature.split(",")[0] == u"形容動詞":
                keywords.append(encoded_node_feature.split(",")[6])
        encoded_node = encoded_node.next
    return keywords

#line = u"私は眠たいです。だから友達を殴りました。\nお腹が痛いです。だからお母さんとハイタッチしました。"
f2 = open("egmresult.txt", "w")
for line in open("egm_lf.txt"):
    keywords = extractKeyword(line)
    for w in keywords:
        f2.write(w.encode('utf-8'))
        f2.write("\n")
