export const GameData = {
  playerStats: {
    health: 100,
    coins: 0,
    score: 0,
    totalCoinsNeeded: 50,
    currentLevel: 1
  },
  
  levelConfigs: {
    1: { coinsToCollect: 10, enemySpeed: 80, runDistance: 100 },
    2: { coinsToCollect: 10, enemySpeed: 100, runDistance: 100 },
    3: { coinsToCollect: 10, enemySpeed: 120, runDistance: 100 },
    4: { coinsToCollect: 10, enemySpeed: 140, runDistance: 100 },
    5: { coinsToCollect: 10, enemySpeed: 160, runDistance: 100 }
  }
};