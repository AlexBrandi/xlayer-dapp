import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';

// Particle Background Component
function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{id: number, left: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particle-bg">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
}

// 星空背景组件
function StarField() {
  return (
    <>
      <div className="starfield">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className={`star ${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* 流星效果 */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`shooting-${i}`}
          className="shooting-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      {/* 星云效果 */}
      <div className="nebula purple" style={{
        top: '10%',
        left: '20%',
        width: '300px',
        height: '300px'
      }} />
      <div className="nebula blue" style={{
        top: '60%',
        right: '10%',
        width: '400px',
        height: '400px'
      }} />
      <div className="nebula pink" style={{
        bottom: '20%',
        left: '10%',
        width: '250px',
        height: '250px'
      }} />
    </>
  )
}

// 增强仪表盘
function Dashboard() {
  const [stats] = useState({
    totalShips: 42,
    totalRewards: 15847.23,
    activeVoyages: 28,
    totalEarned: 234567.89
  });

  const mockShips = [
    {
      id: 1,
      name: "珍珠号",
      level: 15,
      rarity: "传奇",
      hp: 2500,
      status: "航行中",
      earnings: 1234.56,
      image: "/gem/ship/珍珠号.png"
    },
    {
      id: 2,
      name: "嘉百列号",
      level: 12,
      rarity: "史诗",
      hp: 1800,
      status: "停靠中",
      earnings: 892.34,
      image: "/gem/ship/嘉百列号.png"
    },
    {
      id: 3,
      name: "雷德尔号",
      level: 18,
      rarity: "传奇",
      hp: 2100,
      status: "航行中",
      earnings: 1567.89,
      image: "/gem/ship/雷德尔号.png"
    },
    {
      id: 4,
      name: "玛丽亚号",
      level: 8,
      rarity: "稀有",
      hp: 1200,
      status: "维修中",
      earnings: 445.67,
      image: "/gem/ship/玛丽亚号.png"
    },
    {
      id: 5,
      name: "切诺亚号",
      level: 22,
      rarity: "传奇",
      hp: 2800,
      status: "航行中",
      earnings: 2156.78,
      image: "/gem/ship/切诺亚号.png"
    },
    {
      id: 6,
      name: "卡佩奇号",
      level: 10,
      rarity: "稀有",
      hp: 1500,
      status: "停靠中",
      earnings: 687.42,
      image: "/gem/ship/卡佩奇号.png"
    },
    {
      id: 7,
      name: "摩尔号",
      level: 16,
      rarity: "史诗",
      hp: 2200,
      status: "航行中",
      earnings: 1398.56,
      image: "/gem/ship/摩尔号.png"
    },
    {
      id: 8,
      name: "敦刻尔克号",
      level: 14,
      rarity: "史诗",
      hp: 2000,
      status: "维修中",
      earnings: 1089.34,
      image: "/gem/ship/敦刻尔克号.png"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case '传奇': return 'text-rarity-legend';
      case '史诗': return 'text-rarity-epic';
      case '稀有': return 'text-rarity-rare';
      default: return 'text-rarity-common';
    }
  };

  return (
    <div className="container cyber-grid" style={{ paddingTop: '2rem', minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="holographic glass-card p-8 mb-8 scanner-line">
        <h1 className="text-3xl font-bold gradient-text mb-4">
          ⚡ 舰队指挥中心 ⚡
        </h1>
        <p className="text-gray-400 text-lg">
          正在管理 <span className="text-green-400 font-bold">{stats.totalShips}</span> 艘星际战舰
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 card-hover floating" style={{animationDelay: '0s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">飞船总数</span>
            <div className="energy-orb"></div>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalShips}</div>
          <div className="text-xs text-green-400">本周+3</div>
        </div>
        
        <div className="glass-card p-6 card-hover floating" style={{animationDelay: '1s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">可领取奖励</span>
            <div className="energy-orb" style={{background: 'radial-gradient(circle, var(--green-400), var(--green-600))'}}></div>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.totalRewards.toLocaleString()} FUEL</div>
          <div className="text-xs text-green-400">准备领取</div>
        </div>
        
        <div className="glass-card p-6 card-hover floating" style={{animationDelay: '2s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">执行任务</span>
            <div className="status-online energy-orb"></div>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.activeVoyages}</div>
          <div className="text-xs text-blue-400">正在收益</div>
        </div>
        
        <div className="glass-card p-6 card-hover floating" style={{animationDelay: '3s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">累计收益</span>
            <div className="energy-orb" style={{background: 'radial-gradient(circle, var(--rarity-legend), #f97316)'}}></div>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.totalEarned.toLocaleString()} FUEL</div>
          <div className="text-xs text-yellow-400">历史总收益</div>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="glass-card holographic p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🚢 活跃舰队</h2>
          <button className="btn-primary glow-border">
            一键领取奖励
            <div className="loading-dots ml-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {mockShips.map((ship, index) => (
            <div key={ship.id} className="glass-card p-4 card-hover" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-white truncate">{ship.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    ship.status === '航行中' ? 'bg-green-600 text-white' :
                    ship.status === '停靠中' ? 'bg-blue-600 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {ship.status}
                  </div>
                </div>
                <span className={`text-xs ${getRarityColor(ship.rarity)} font-medium`}>
                  {ship.rarity} • {ship.level}级
                </span>
              </div>
              
              <div className="relative mb-3 rounded-lg overflow-hidden">
                <img 
                  src={ship.image} 
                  alt={ship.name}
                  className="w-full h-24 object-cover"
                  style={{filter: 'brightness(0.8) contrast(1.1)'}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {ship.status === '航行中' && (
                  <div className="absolute top-1 left-1">
                    <div className="flex items-center gap-1 bg-green-600/80 px-1 py-0.5 rounded text-xs">
                      <div className="energy-orb" style={{width: '6px', height: '6px'}}></div>
                      <span>执行</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">船体</span>
                    <span className="text-white">{Math.floor((ship.hp / 2800) * 100)}%</span>
                  </div>
                  <div className="progress-bar" style={{height: '4px'}}>
                    <div 
                      className={`progress-fill ${ship.hp < 1500 ? 'low' : 'normal'}`}
                      style={{width: `${(ship.hp / 2800) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-400">收益</div>
                    <div className="text-green-400 font-bold data-stream text-sm">
                      +{ship.earnings.toFixed(1)}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1 mt-2">
                  <button className="btn-secondary text-xs px-2 py-1 flex-1">
                    {ship.status === '航行中' ? '停止' : ship.status === '维修中' ? '修复' : '出发'}
                  </button>
                  <button className="btn-primary text-xs px-2 py-1 bg-green-600">
                    领取
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 实时数据流 */}
      <div className="glass-card p-6 holographic">
        <h3 className="text-lg font-bold text-white mb-4">📡 实时数据流</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="data-stream">
            <div>网络</div>
            <div className="text-green-400">X-LAYER_196</div>
          </div>
          <div className="data-stream">
            <div>区块</div>
            <div className="text-blue-400">2847563</div>
          </div>
          <div className="data-stream">
            <div>GAS费</div>
            <div className="text-yellow-400">15 GWEI</div>
          </div>
          <div className="data-stream">
            <div>状态</div>
            <div className="text-green-400">在线</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 定义飞船类型
interface Ship {
  name: string;
  image: string;
  rarity: string;
  description: string;
  probability: number;
}

interface PreviewShip extends Ship {
  id: number;
}

// 增强造舰页面
function Mint() {
  const [isLoading, setIsLoading] = useState(false);
  const [mintedShip, setMintedShip] = useState<Ship | null>(null);
  const [previewShips, setPreviewShips] = useState<PreviewShip[]>([]);

  // 所有可能的飞船类型
  const allShips = [
    { name: "珍珠号", image: "/gem/ship/珍珠号.png", rarity: "传奇", description: "传说中的多功能战舰", probability: 3 },
    { name: "嘉百列号", image: "/gem/ship/嘉百列号.png", rarity: "史诗", description: "重装攻击型战舰", probability: 12 },
    { name: "雷德尔号", image: "/gem/ship/雷德尔号.png", rarity: "传奇", description: "高速侦察型飞船", probability: 3 },
    { name: "玛丽亚号", image: "/gem/ship/玛丽亚号.png", rarity: "稀有", description: "科研探索型飞船", probability: 25 },
    { name: "切诺亚号", image: "/gem/ship/切诺亚号.png", rarity: "传奇", description: "纯净能量战舰", probability: 3 },
    { name: "卡佩奇号", image: "/gem/ship/卡佩奇号.png", rarity: "稀有", description: "护卫护航舰", probability: 25 },
    { name: "摩尔号", image: "/gem/ship/摩尔号.png", rarity: "史诗", description: "战术指挥舰", probability: 12 },
    { name: "敦刻尔克号", image: "/gem/ship/敦刻尔克号.png", rarity: "史诗", description: "重型战列舰", probability: 12 },
    { name: "亚伯号", image: "/gem/ship/亚伯号.png", rarity: "普通", description: "标准巡洋舰", probability: 30 },
    { name: "冒险者号", image: "/gem/ship/冒险者号.png", rarity: "普通", description: "探索型轻舰", probability: 30 },
    { name: "卡文迪号", image: "/gem/ship/卡文迪号.png", rarity: "稀有", description: "科学考察舰", probability: 25 },
    { name: "哈布斯号", image: "/gem/ship/哈布斯号.png", rarity: "稀有", description: "运输补给舰", probability: 25 }
  ];

  // 生成随机飞船预览（根据概率）
  const generatePreviewShips = () => {
    const previews = [];
    for (let i = 0; i < 6; i++) {
      const randomNum = Math.random() * 100;
      let cumulativeProbability = 0;
      let selectedShip = allShips[allShips.length - 1]; // 默认最后一个
      
      for (const ship of allShips) {
        cumulativeProbability += ship.probability;
        if (randomNum <= cumulativeProbability) {
          selectedShip = ship;
          break;
        }
      }
      previews.push({ ...selectedShip, id: i });
    }
    setPreviewShips(previews);
  };

  // 随机选择一艘飞船（mint结果）
  const getRandomShip = () => {
    const randomNum = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const ship of allShips) {
      cumulativeProbability += ship.probability;
      if (randomNum <= cumulativeProbability) {
        return ship;
      }
    }
    return allShips[allShips.length - 1];
  };

  const handleMint = async () => {
    setIsLoading(true);
    setMintedShip(null);
    
    // 模拟造舰过程
    setTimeout(() => {
      const newShip = getRandomShip();
      setMintedShip(newShip);
      setIsLoading(false);
      // 重新生成预览
      generatePreviewShips();
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case '传奇': return 'text-rarity-legend';
      case '史诗': return 'text-rarity-epic';
      case '稀有': return 'text-rarity-rare';
      case '普通': return 'text-rarity-common';
      default: return 'text-rarity-common';
    }
  };

  // 组件加载时生成预览
  useEffect(() => {
    generatePreviewShips();
  }, []);

  return (
    <div className="container cyber-grid" style={{ paddingTop: '2rem' }}>
      <div className="holographic glass-card p-8 mt-6 mb-8 scanner-line floating card-hover">
        <div className="py-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="energy-orb"></div>
            <h1 className="text-4xl font-bold gradient-text">🎰 神秘造船厂 ⚡</h1>
            <div className="energy-orb"></div>
          </div>
          <p className="text-gray-300 text-lg text-center data-stream">
            投入FUEL，获得随机飞船！运气决定一切！
          </p>
          <div className="flex justify-center mt-4">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-x-8 gap-y-12 mt-6 mb-6">
        {/* 随机飞船预览 */}
        <div className="holographic glass-card p-6 card-hover floating mt-8">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="energy-orb" style={{width: '12px', height: '12px'}}></div>
              <h3 className="text-xl font-bold gradient-text">🎲 可能获得的飞船</h3>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto py-4 px-2">
            {previewShips.map((ship, index) => (
              <div
                key={ship.id}
                className="holographic glass-card p-4 transition-all"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={ship.image} 
                      alt={ship.name}
                      className="w-12 h-12 rounded-lg object-cover floating"
                    />
                    <div className="absolute -top-1 -right-1">
                      <div className="energy-orb" style={{width: '8px', height: '8px'}}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{ship.name}</div>
                    <div className={`text-xs ${getRarityColor(ship.rarity)} gradient-text`}>{ship.rarity}</div>
                  </div>
                  <div className="text-xs text-green-400 data-stream">{ship.probability}%</div>
                </div>
              </div>
            ))}
          </div>
          
            <div className="mt-6 p-4 glass-card rounded-lg">
              <h4 className="font-bold mb-2 text-sm text-white">💡 提示</h4>
              <p className="text-xs text-gray-400">
                每次造舰都会随机获得一艘飞船，稀有度越高获得概率越低！
              </p>
            </div>
          </div>
        </div>

        {/* 造舰结果 */}
        <div className="glass-card p-6 card-hover mt-8">
          <h3 className="text-xl font-bold mb-6">🛸 造舰结果</h3>
          
          <div className="py-6">
          {isLoading ? (
            <div className="relative rounded-xl overflow-hidden mb-4 glow-border bg-gradient-to-br from-blue-900/30 to-purple-900/30">
              <div className="w-full h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="energy-orb mx-auto mb-4 animate-pulse" style={{width: '60px', height: '60px'}}></div>
                  <div className="text-white font-bold">正在制造...</div>
                  <div className="loading-dots mt-2">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          ) : mintedShip ? (
            <div className="relative rounded-xl overflow-hidden mb-4 glow-border">
              <img 
                src={mintedShip.image}
                alt={mintedShip.name}
                className="w-full h-48 object-cover floating"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-lg text-white">{mintedShip.name}</h4>
                    <p className={`text-sm ${getRarityColor(mintedShip.rarity)}`}>
                      {mintedShip.rarity}级战舰
                    </p>
                  </div>
                  <div className="energy-orb"></div>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <div className="bg-green-600/90 px-3 py-1 rounded-full text-sm font-bold text-white">
                  ✨ 获得！
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden mb-4 border-2 border-dashed border-gray-600">
              <div className="w-full h-48 flex items-center justify-center bg-gray-800/30">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">❓</div>
                  <div>点击造舰按钮开始制造</div>
                </div>
              </div>
            </div>
          )}
          
          {mintedShip && (
            <div className="glass-card p-4 mb-4">
              <h4 className="font-bold mb-2 text-white">飞船描述</h4>
              <p className="text-gray-400 text-sm">{mintedShip.description}</p>
            </div>
          )}

          <div className="holographic glass-card p-6 rounded-xl">
            <h4 className="font-bold mb-4">📊 稀有度分布</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-rarity-common">● 普通</span>
                <span className="text-gray-400">60%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-rarity-rare">● 稀有</span>
                <span className="text-gray-400">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-rarity-epic">● 史诗</span>
                <span className="text-gray-400">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-rarity-legend">● 传奇</span>
                <span className="text-gray-400">3%</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* 造舰控制 */}
        <div className="holographic glass-card p-6 card-hover floating mt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="energy-orb" style={{width: '16px', height: '16px'}}></div>
            <h3 className="text-xl font-bold gradient-text">⚙️ 造舰控制</h3>
            <div className="energy-orb" style={{width: '16px', height: '16px'}}></div>
          </div>
          
          <div className="space-y-6 py-6">
            <div className="text-center p-6 holographic glass-card rounded-lg scanner-line glow-border">
              <div className="text-3xl mb-3 animate-pulse">🎰</div>
              <h4 className="font-bold text-white mb-2 gradient-text">神秘造舰</h4>
              <p className="text-sm text-gray-300 data-stream">
                每次造舰将随机获得一艘飞船<br/>
                <span className="text-yellow-400 neon-text">稀有度完全看运气！</span>
              </p>
            </div>

            <div className="holographic glass-card p-6 rounded-xl scanner-line cyber-grid">
              <div className="flex items-center gap-2 mb-4">
                <div className="energy-orb" style={{width: '10px', height: '10px'}}></div>
                <h4 className="font-bold gradient-text">💰 造价明细</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 glass-card rounded">
                  <span className="text-gray-300">造舰费用:</span>
                  <span className="font-bold text-white">100.00 FUEL</span>
                </div>
                <div className="flex justify-between items-center p-2 glass-card rounded">
                  <span className="text-gray-300">数量:</span>
                  <span className="font-bold text-white">1 艘</span>
                </div>
                <div className="flex justify-between items-center p-2 glass-card rounded">
                  <span className="text-gray-300">飞船类型:</span>
                  <span className="font-bold text-yellow-400 animate-pulse gradient-text">
                    ❓ 随机
                  </span>
                </div>
                <div className="border-t border-purple-500/30 pt-4">
                  <div className="flex justify-between items-center p-3 holographic glass-card rounded-lg">
                    <span className="font-bold text-white">总价:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-3xl text-green-400 data-stream animate-glow">
                        100.00 FUEL
                      </span>
                      <div className="energy-orb" style={{width: '12px', height: '12px'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleMint}
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4 glow-border holographic floating card-hover"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="energy-orb animate-pulse" style={{width: '20px', height: '20px'}}></div>
                  <span className="gradient-text">造舰中...</span>
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="energy-orb" style={{width: '16px', height: '16px'}}></div>
                  <span className="gradient-text text-xl">🎲 神秘造舰 ⚡</span>
                  <div className="energy-orb" style={{width: '16px', height: '16px'}}></div>
                </div>
              )}
            </button>

            {mintedShip && (
              <div className="text-center p-4 holographic glass-card rounded-lg glow-border animate-glow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="energy-orb animate-pulse" style={{width: '12px', height: '12px'}}></div>
                  <div className="text-green-400 font-bold gradient-text neon-text">🎉 造舰成功！</div>
                  <div className="energy-orb animate-pulse" style={{width: '12px', height: '12px'}}></div>
                </div>
                <div className="text-sm text-white data-stream mb-1">
                  获得了 <span className={`${getRarityColor(mintedShip.rarity)} gradient-text neon-text`}>{mintedShip.rarity}</span> 级飞船:
                </div>
                <div className={`font-bold text-lg ${getRarityColor(mintedShip.rarity)} gradient-text neon-text`}>
                  ✨ {mintedShip.name} ✨
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-400">
                当前 FUEL 余额: <span className="text-green-400 font-bold data-stream">2,547.89</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 定义维修飞船类型
interface RepairShip {
  id: number;
  name: string;
  level: number;
  durability: number;
  image: string;
  rarity: string;
}

// 增强升级与维修
function UpgradeRepair() {
  const [selectedShip, setSelectedShip] = useState<RepairShip | null>(null);
  
  const mockShips = [
    { id: 1, name: "珍珠号", level: 15, durability: 85, image: "/gem/ship/珍珠号.png", rarity: "传奇" },
    { id: 2, name: "嘉百列号", level: 12, durability: 72, image: "/gem/ship/嘉百列号.png", rarity: "史诗" },
    { id: 3, name: "雷德尔号", level: 18, durability: 94, image: "/gem/ship/雷德尔号.png", rarity: "传奇" },
    { id: 4, name: "玛丽亚号", level: 8, durability: 68, image: "/gem/ship/玛丽亚号.png", rarity: "稀有" },
    { id: 5, name: "摩尔号", level: 16, durability: 91, image: "/gem/ship/摩尔号.png", rarity: "史诗" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case '传奇': return 'text-rarity-legend';
      case '史诗': return 'text-rarity-epic';
      case '稀有': return 'text-rarity-rare';
      default: return 'text-rarity-common';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="holographic glass-card p-8 mb-8 scanner-line">
        <h1 className="text-3xl font-bold gradient-text mb-4">🔧 飞船维修厂 🔧</h1>
        <p className="text-gray-400 text-lg">
          升级系统和修复舰体损伤，提升性能表现
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 飞船选择 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">🚢 选择飞船</h3>
          <div className="space-y-3">
            {mockShips.map(ship => (
              <button
                key={ship.id}
                onClick={() => setSelectedShip(ship)}
                className={`w-full glass-card p-4 text-left card-hover ${
                  selectedShip?.id === ship.id ? 'glow-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={ship.image} 
                    alt={ship.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-white">{ship.name}</div>
                    <div className="text-sm text-gray-400">{ship.level}级</div>
                    <div className={`text-xs ${getRarityColor(ship.rarity)}`}>{ship.rarity}</div>
                  </div>
                  <div className="energy-orb"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ship Details */}
        <div className="lg:col-span-2">
          {selectedShip ? (
            <div className="space-y-6">
              <div className="glass-card holographic p-8">
                <h3 className="text-xl font-bold mb-6">🛸 {selectedShip.name}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={selectedShip.image}
                      alt={selectedShip.name}
                      className="w-full h-48 object-cover rounded-xl floating glow-border"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h4 className="font-bold mb-3">📊 飞船状态</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>等级</span>
                            <span className="text-blue-400 font-bold">{selectedShip.level}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>船体完整度</span>
                            <span className={selectedShip.durability < 30 ? 'text-orange-400' : 'text-green-400'}>
                              {selectedShip.durability}%
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${selectedShip.durability < 30 ? 'low' : 'normal'}`}
                              style={{width: `${selectedShip.durability}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 升级区域 */}
                <div className="glass-card holographic p-6">
                  <h4 className="font-bold mb-4">⚡ 系统升级</h4>
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h5 className="font-bold mb-3 text-white">升级材料</h5>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 glass-card p-2 rounded">
                          <img src="/gem/gem/金刚石.png" alt="金刚石" className="w-4 h-4" />
                          <div>
                            <div className="text-xs text-gray-400">金刚石</div>
                            <div className="text-sm font-bold text-yellow-400">x50</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 glass-card p-2 rounded">
                          <img src="/gem/gem/蓝宝石.png" alt="蓝宝石" className="w-4 h-4" />
                          <div>
                            <div className="text-xs text-gray-400">蓝宝石</div>
                            <div className="text-sm font-bold text-blue-400">x25</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 glass-card p-2 rounded">
                          <img src="/gem/gem/翡翠石.png" alt="翡翠石" className="w-4 h-4" />
                          <div>
                            <div className="text-xs text-gray-400">翡翠石</div>
                            <div className="text-sm font-bold text-green-400">x30</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 glass-card p-2 rounded bg-green-600/20">
                          <div className="text-lg">⚡</div>
                          <div>
                            <div className="text-xs text-gray-400">FUEL</div>
                            <div className="text-sm font-bold text-green-400">1000</div>
                          </div>
                        </div>
                      </div>
                      <button className="btn-primary w-full glow-border">
                        升级到 {selectedShip.level + 1} 级
                      </button>
                    </div>
                  </div>
                </div>

                {/* 维修区域 */}
                <div className="glass-card holographic p-6">
                  <h4 className="font-bold mb-4">🔧 修复舰体</h4>
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h5 className="font-bold mb-3 text-white">修复材料</h5>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 glass-card p-2 rounded">
                          <img src="/gem/gem/钢铁.png" alt="钢铁" className="w-4 h-4" />
                          <div>
                            <div className="text-xs text-gray-400">钢铁</div>
                            <div className="text-sm font-bold text-gray-300">x{Math.floor((100 - selectedShip.durability) * 0.8)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 glass-card p-2 rounded">
                          <img src="/gem/gem/青铜.png" alt="青铜" className="w-4 h-4" />
                          <div>
                            <div className="text-xs text-gray-400">青铜</div>
                            <div className="text-sm font-bold text-orange-400">x{Math.floor((100 - selectedShip.durability) * 0.3)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 glass-card p-2 rounded bg-orange-600/20 col-span-2">
                          <div className="text-lg">⚡</div>
                          <div>
                            <div className="text-xs text-gray-400">FUEL 消耗</div>
                            <div className="text-sm font-bold text-orange-400">{Math.floor((100 - selectedShip.durability) * 5)}</div>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn-primary w-full bg-orange-600 hover:bg-orange-700 glow-border"
                        disabled={selectedShip.durability >= 95}
                      >
                        {selectedShip.durability >= 95 ? '已完全修复' : '修复舰体'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center holographic">
              <div className="energy-orb mx-auto mb-4" style={{width: '60px', height: '60px'}}></div>
              <h3 className="text-xl font-bold text-white mb-2">选择一艘飞船</h3>
              <p className="text-gray-400">从舰队中选择一艘飞船进行升级或维修</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 增强市场
function Market() {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="holographic glass-card p-8 mb-8 scanner-line">
        <h1 className="text-3xl font-bold gradient-text mb-4">💎 星际交易所 💎</h1>
        <p className="text-gray-400 text-lg">
          在宇宙中交易 FUEL 代币
        </p>
      </div>

      <div className="glass-card p-2 rounded-2xl holographic" style={{ height: '80vh' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="font-bold text-xl text-white">WOKB / FUEL</h3>
            <p className="text-gray-400">X-Layer 交易对</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="data-stream text-center">
              <div>价格</div>
              <div className="text-green-400 text-xl font-bold">$0.0247</div>
            </div>
            <div className="data-stream text-center">
              <div>24H 涨幅</div>
              <div className="text-green-400 text-xl font-bold">+15.4%</div>
            </div>
            <button className="btn-primary glow-border">
              在 DexScreener 中打开 →
            </button>
          </div>
        </div>
        
        <div className="p-4 h-full">
          <div className="w-full h-full bg-gradient-to-br from-gray-900/50 to-blue-900/20 rounded-xl flex items-center justify-center glow-border">
            <div className="text-center">
              <div className="energy-orb mx-auto mb-4" style={{width: '80px', height: '80px'}}></div>
              <h3 className="text-2xl font-bold text-white mb-2">交易界面</h3>
              <p className="text-gray-400 mb-6">
                DexScreener 集成将在此加载
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="glass-card p-4 text-center">
                  <div className="text-sm text-gray-400">24H 成交量</div>
                  <div className="text-green-400 font-bold data-stream">$2.4M</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-sm text-gray-400">流动性</div>
                  <div className="text-blue-400 font-bold data-stream">$890K</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-sm text-gray-400">持有者</div>
                  <div className="text-yellow-400 font-bold data-stream">15.2K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 定义商品类型
interface ShopItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  description: string;
}

interface ShopCategory {
  name: string;
  icon: string;
  items: ShopItem[];
}

// 宝石商店
function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<'precious' | 'crystal' | 'metal'>('precious');
  const [purchaseLoading, setPurchaseLoading] = useState<Record<string, boolean>>({});

  // 宝石商品数据
  const gemCategories: Record<'precious' | 'crystal' | 'metal', ShopCategory> = {
    precious: {
      name: '珍贵宝石',
      icon: '💎',
      items: [
        { id: 'diamond', name: '金刚石', image: '/gem/gem/金刚石.png', price: 500, rarity: '传奇', description: '最坚硬的宝石，升级传奇飞船必备' },
        { id: 'sapphire', name: '蓝宝石', image: '/gem/gem/蓝宝石.png', price: 300, rarity: '史诗', description: '蕴含强大能量的蓝色宝石' },
        { id: 'emerald', name: '翡翠石', image: '/gem/gem/翡翠石.png', price: 350, rarity: '史诗', description: '充满生命力的绿色宝石' },
        { id: 'amethyst', name: '紫水晶', image: '/gem/gem/紫水晶.png', price: 200, rarity: '稀有', description: '神秘的紫色水晶，提升精神力' },
        { id: 'garnet', name: '石榴石', image: '/gem/gem/石榴石.png', price: 180, rarity: '稀有', description: '火红色的美丽宝石' },
        { id: 'aquamarine', name: '海蓝石', image: '/gem/gem/海蓝石.png', price: 220, rarity: '稀有', description: '如海水般清澈的蓝色宝石' }
      ]
    },
    crystal: {
      name: '能量水晶',
      icon: '🔮',
      items: [
        { id: 'red_crystal', name: '红水晶', image: '/gem/gem/红水晶.png', price: 150, rarity: '稀有', description: '蕴含火元素能量的红色水晶' },
        { id: 'green_crystal', name: '绿水晶', image: '/gem/gem/绿水晶.png', price: 140, rarity: '稀有', description: '充满自然力量的绿色水晶' },
        { id: 'blue_crystal', name: '蓝水晶', image: '/gem/gem/蓝水晶.png', price: 160, rarity: '稀有', description: '冰冷而纯净的蓝色水晶' },
        { id: 'dark_crystal', name: '黑暗水晶', image: '/gem/gem/黑暗水晶.png', price: 400, rarity: '史诗', description: '神秘的黑暗力量结晶' },
        { id: 'sunstone', name: '太阳石', image: '/gem/gem/太阳石.png', price: 250, rarity: '史诗', description: '充满太阳能量的金色宝石' },
        { id: 'obsidian', name: '黑曜石', image: '/gem/gem/黑曜石.png', price: 120, rarity: '普通', description: '火山玻璃，坚硬而锋利' }
      ]
    },
    metal: {
      name: '稀有金属',
      icon: '⚙️',
      items: [
        { id: 'gold', name: '黄金', image: '/gem/gem/黄金.png', price: 100, rarity: '普通', description: '永不生锈的贵重金属' },
        { id: 'silver', name: '白银', image: '/gem/gem/白银.png', price: 80, rarity: '普通', description: '纯净的银白色金属' },
        { id: 'steel', name: '钢铁', image: '/gem/gem/钢铁.png', price: 50, rarity: '普通', description: '坚固耐用的合金材料' },
        { id: 'bronze', name: '青铜', image: '/gem/gem/青铜.png', price: 40, rarity: '普通', description: '古老而可靠的合金' },
        { id: 'lithium', name: '锂矿石', image: '/gem/gem/锂矿石.png', price: 150, rarity: '稀有', description: '高科技设备必需的轻金属' },
        { id: 'cats_eye', name: '猫眼石', image: '/gem/gem/猫眼石.png', price: 180, rarity: '稀有', description: '具有独特光学效应的宝石' }
      ]
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    setPurchaseLoading(prev => ({ ...prev, [item.id]: true }));
    
    // 模拟购买过程
    setTimeout(() => {
      setPurchaseLoading(prev => ({ ...prev, [item.id]: false }));
      // 这里可以添加成功提示
    }, 1500);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case '传奇': return 'text-rarity-legend';
      case '史诗': return 'text-rarity-epic';
      case '稀有': return 'text-rarity-rare';
      case '普通': return 'text-rarity-common';
      default: return 'text-rarity-common';
    }
  };

  const currentItems = gemCategories[selectedCategory]?.items || [];

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="holographic glass-card p-8 mb-8 scanner-line">
        <h1 className="text-3xl font-bold gradient-text mb-4">🏪 宝石商店 💎</h1>
        <p className="text-gray-400 text-lg">
          使用 FUEL 购买各种珍贵宝石和材料，升级你的飞船
        </p>
      </div>

      {/* 分类选择 */}
      <div className="glass-card p-8 mb-8 holographic">
        <h3 className="text-xl font-bold text-white mb-6">商品分类</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(gemCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as 'precious' | 'crystal' | 'metal')}
              className={`flex flex-col items-center p-6 glass-card rounded-xl transition-all card-hover text-center ${
                selectedCategory === key ? 'glow-border' : ''
              }`}
            >
              <span className="text-4xl mb-3">{category.icon}</span>
              <div>
                <div className="font-bold text-white text-lg mb-1">{category.name}</div>
                <div className="text-sm text-gray-400">{category.items.length} 种商品</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 商品网格 */}
      <div className="glass-card p-8 holographic">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            {gemCategories[selectedCategory]?.icon}
            {gemCategories[selectedCategory]?.name}
          </h3>
          <div className="text-sm text-gray-400">
            当前 FUEL 余额: <span className="text-green-400 font-bold data-stream">2,547.89</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((item) => (
            <div key={item.id} className="glass-card p-6 card-hover">
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 mx-auto object-cover rounded-lg glow-border floating"
                  />
                  <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                    item.rarity === '传奇' ? 'bg-yellow-600/80' :
                    item.rarity === '史诗' ? 'bg-purple-600/80' :
                    item.rarity === '稀有' ? 'bg-blue-600/80' :
                    'bg-gray-600/80'
                  } text-white`}>
                    {item.rarity}
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-white mb-1">{item.name}</h4>
                <p className={`text-sm mb-3 ${getRarityColor(item.rarity)}`}>
                  {item.rarity} 级材料
                </p>
                
                <p className="text-xs text-gray-400 mb-4 h-8 flex items-center justify-center">
                  {item.description}
                </p>
                
                <div className="mb-4 p-3 glass-card rounded-lg bg-green-600/10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-lg">⚡</div>
                    <div>
                      <div className="text-xs text-gray-400">价格</div>
                      <div className="text-xl font-bold text-green-400 data-stream">
                        {item.price} FUEL
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={purchaseLoading[item.id]}
                  className="w-full btn-primary glow-border holographic"
                >
                  {purchaseLoading[item.id] ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>购买中...</span>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  ) : (
                    '💳 购买'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 增强导航
function Navigation() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: '指挥中心', icon: '⚡' },
    { path: '/mint', label: '飞船造舰', icon: '🛸' },
    { path: '/upgrade-repair', label: '维修升级', icon: '🔧' },
    { path: '/shop', label: '宝石商店', icon: '🏪' },
    { path: '/market', label: '交易市场', icon: '💎' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b holographic">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold gradient-text">
              🚀 X-LAYER 舰队 🚀
            </h1>
            
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active glow-border' : ''}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="holographic glass-card px-4 py-2 rounded-lg">
              <div className="text-xs text-gray-400">FUEL 余额</div>
              <div className="text-green-400 font-bold data-stream">2,547.89</div>
            </div>
            <button className="btn-primary glow-border status-online">
              连接钱包
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
      <StarField />
      <ParticleBackground />
      <Router>
        <Navigation />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/upgrade-repair" element={<UpgradeRepair />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/market" element={<Market />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;