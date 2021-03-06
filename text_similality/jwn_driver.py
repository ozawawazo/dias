#coding:utf-8

import sys
fin2 = "egmresult.txt"
fout = "similality.txt"
text = u"お腹" 
encoded_text = text.encode("utf-8")

import sim
wordLists = [
  [text],
  [line.strip("\r\n").strip("\n").decode('utf-8') for line in open(fin2)]
]
synLists = sim.convWords2Synsets(wordLists[0], wordLists[1])
simMatrix = sim.calcSim(synLists[0], synLists[1])
sim.writeSim(wordLists[0],wordLists[1],simMatrix,fout)
