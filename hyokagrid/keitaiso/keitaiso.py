import sys
import MeCab
tagger = MeCab.Tagger("-Ochasen")
text = u"お腹が空きました"
encoded_text = text.encode("utf-8")
encoded_result = tagger.parse(encoded_text)
result = encoded_result.decode("utf-8")
print result