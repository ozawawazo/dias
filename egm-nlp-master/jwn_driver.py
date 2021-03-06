import sys
fin2 = 'egmresult.txt'
fout = sys.stdout
 
import sim
wordLists = [
  [sys.argv[1].decode('utf-8')],
  [line.strip("\r\n").strip("\n").decode('utf-8') for line in open(fin2)]
]
synLists = sim.convWords2Synsets(wordLists[0], wordLists[1])
simMatrix = sim.calcSim(synLists[0], synLists[1])
sim.writeSim(wordLists[0],wordLists[1],simMatrix,fout)
