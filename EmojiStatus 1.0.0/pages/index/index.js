// index.js
const emojiMatcher = require('../../utils/emojiMatcher');

Page({
  data: {
    text: '',
    emojis: [],
    emojiCount: 1,
    scores: {
      energy: 50,
      mood: 50,
      social: 50
    },
    dimensions: emojiMatcher.getDimensions()
  },

  onLoad() {
    this.updateEmojis();
  },

  onTextInput(e) {
    this.setData({
      text: e.detail.value
    });
  },

  onEmojiCountChange(e) {
    const count = parseInt(e.detail.value) + 1;
    this.setData({
      emojiCount: count,
      emojis: [] // 清空当前表情，强制重新生成
    }, () => {
      this.updateEmojis();
    });
  },

  onScoreChange(e) {
    const dimension = e.currentTarget.dataset.dimension;
    const value = e.detail.value;
    this.setData({
      [`scores.${dimension}`]: value
    }, () => {
      this.updateEmojis();
    });
  },

  updateEmojis() {
    const emojis = emojiMatcher.matchEmojis(this.data.scores, this.data.emojiCount);
    if (emojis.length > this.data.emojiCount) {
      emojis.length = this.data.emojiCount;
    }
    this.setData({ emojis });
  },

  onRandomize() {
    this.updateEmojis();
  },

  onGenerate() {
    if (!this.data.text) {
      wx.showToast({
        title: '请输入心情文字',
        icon: 'none'
      });
      return;
    }

    try {
      const encodedText = encodeURIComponent(this.data.text);
      wx.navigateTo({
        url: `/pages/generate/generate?text=${encodedText}&emojis=${this.data.emojis.join(',')}`
      });
    } catch (error) {
      console.error('Error encoding text:', error);
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      });
    }
  }
});
