const emojiData = require('./emojiData');

/**
 * 根据量表分数获取对应级别
 * @param {number} score - 1-5 的分数
 * @returns {string} - low/medium/high
 */
function getLevel(score) {
  if (score <= 2) return 'low';
  if (score <= 4) return 'medium';
  return 'high';
}

/**
 * 从指定类别中随机选择一个 emoji
 * @param {Array} category - emoji 数组
 * @returns {string} - 随机选择的一个 emoji
 */
function getRandomEmoji(category) {
  const index = Math.floor(Math.random() * category.length);
  return category[index];
}

/**
 * 根据三个维度的分数匹配 emoji
 * @param {Object} scores - 包含三个维度分数的对象
 * @returns {Array} - 匹配的 emoji 数组（3个）
 */
function matchEmojis(scores, count = 1) {
  const energyLevel = getLevel(scores.energy);
  const moodLevel = getLevel(scores.mood);
  const socialLevel = getLevel(scores.social);

  const energyEmojis = emojiData.dimensions.energy[energyLevel];
  const moodEmojis = emojiData.dimensions.mood[moodLevel];
  const socialEmojis = emojiData.dimensions.social[socialLevel];

  const allEmojis = [...energyEmojis, ...moodEmojis, ...socialEmojis];
  const shuffled = allEmojis.sort(() => Math.random() - 0.5);
  
  // 确保返回的表情数量与请求的数量一致
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 获取维度信息
 * @returns {Object} - 维度信息对象
 */
function getDimensions() {
  return [
    {
      name: '能量水平',
      key: 'energy',
      description: '今天的精力充沛程度'
    },
    {
      name: '心情指数',
      key: 'mood',
      description: '今天的情绪状态'
    },
    {
      name: '社交倾向',
      key: 'social',
      description: '今天想要社交的程度'
    }
  ];
}

module.exports = {
  matchEmojis,
  getDimensions
}; 