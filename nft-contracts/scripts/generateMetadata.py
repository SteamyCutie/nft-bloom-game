import json

baseURIv2 = "https://gateway.pinata.cloud/ipfs/QmQGCFBzzQ3xmUFy6UdRZPFgwje7v62sJpTnCkEz6u5hYW/"
baseURIv3 = "https://gateway.pinata.cloud/ipfs/QmRySza6jQc4jrv1NdErGCar8XHDdANK7bpeE3h3qZCrG7/"

def generateMetadata(jsonFolderPath):
    # whitelist
    for idx in range(1, 1001):
      data = {}
      data['name'] = "WhiteList mint #" + str(idx)
      data['image'] = baseURIv2 
      data['description'] = "CharacterNFT by WhiteList Mint."
      with open(jsonFolderPath+ str(idx) +'.json', 'w+', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

    # public
    for idx in range(1001, 6001):
      data = {}
      data['name'] = "Public mint #" + str(idx - 1000)
      data['image'] = baseURIv3 
      data['description'] = "CharacterNFT by Public Mint."
      with open(jsonFolderPath+ str(idx) +'.json', 'w+', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

filepath = "metadata/"
generateMetadata(filepath)
