from web3 import Web3
import json

# -------------------------
# 配置
# -------------------------
OKB_RPC = "https://xlayerrpc.okx.com"
CONTRACT_ADDRESS = "0x958253CbAc08F33Fcb672eA8400f384a10fd737C"  # 替换成你的合约地址
TOKEN_ID = 1  # 查询的 NFT tokenId

# -------------------------
# 初始化 Web3
# -------------------------
w3 = Web3(Web3.HTTPProvider(OKB_RPC))
if not w3.is_connected():
    raise Exception("连接 OKB RPC 失败！")

print("当前区块高度:", w3.eth.block_number)

# -------------------------
# 加载 ABI
# -------------------------
with open("game.json", "r") as f:
    abi = json.load(f)

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# -------------------------
# 调用 pendingReward
# -------------------------
reward = contract.functions.pendingReward(TOKEN_ID).call()
print(f"Token ID {TOKEN_ID} pending reward: {reward}")

# -------------------------
# 调用 stake 信息
# -------------------------
stake_info = contract.functions.stakes(TOKEN_ID).call()
print(f"StakeInfo for Token ID {TOKEN_ID}:")
print("Owner:", stake_info[0])
print("StakedAtBlock:", stake_info[1])
print("Level:", stake_info[2])
print("Staked:", stake_info[3])

# 计算区块差
blocks = w3.eth.block_number - stake_info[1]
print("Blocks since staked:", blocks)
