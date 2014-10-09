#coding:utf-8

#これはegm_lf.txtの文列を形態素解析し、出力で文、類似度、単語を出力する

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
        if encoded_node.surface.decode("eucjp") != ",":
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

fout = sys.stdout
#f2 = open("egmresult.txt", "w")
fout.write('sentence,similality,word0,word1,word2,word3,word4,word5,word6,word7,word8,word9\n')
for line in open("egm_lf.txt"):

    fout.write(line.rstrip('\n') + ",0")
    keywords = extractKeyword(line)
    for w in keywords:
        fout.write(',' + w.encode('utf-8'))
#        f2.write(w.encode('utf-8') + " ")
    fout.write('\n')
#    f2.write("\n")

#f2 = open("egmresult.txt", "w")
#for line in open("egm_lf.txt"):
#    keywords = extractKeyword(line)
#    for w in keywords:
#        f2.write(w.encode('utf-8') + " ")
#    f2.write("\n")
