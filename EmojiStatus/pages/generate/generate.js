Page({
  data: {
    text: '',
    emojis: [],
    canvasWidth: 600,
    canvasHeight: 800
  },

  onLoad(options) {
    try {
      const text = decodeURIComponent(options.text || '');
      const emojis = (options.emojis || '').split(',');
      
      this.setData({
        text,
        emojis
      });
      
      this.drawCanvas();
    } catch (error) {
      console.error('Error decoding text:', error);
    }
  },

  async drawCanvas() {
    const query = wx.createSelectorQuery();
    const canvas = await new Promise(resolve => {
      query.select('#statusCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          // 设置 canvas 实际渲染尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = this.data.canvasWidth * dpr;
          canvas.height = this.data.canvasHeight * dpr;
          ctx.scale(dpr, dpr);
          
          resolve(canvas);
        });
    });
    
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = '#DA615C';
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    // 绘制 emoji
    const emojiSize = 80;
    const emojiSpacing = 30;
    const totalWidth = this.data.emojis.length * emojiSize + (this.data.emojis.length - 1) * emojiSpacing;
    const startX = (this.data.canvasWidth - totalWidth) / 2;
    
    this.data.emojis.forEach((emoji, index) => {
      const x = startX + index * (emojiSize + emojiSpacing);
      const y = this.data.canvasHeight * 0.3;
      
      ctx.font = `${emojiSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(emoji, x + emojiSize / 2, y + emojiSize / 2);
    });
    
    // 绘制文字
    if (this.data.text) {
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(this.data.text, this.data.canvasWidth / 2, this.data.canvasHeight * 0.5);
    }
    
    // 绘制日期
    const date = new Date();
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(dateStr, this.data.canvasWidth - 40, this.data.canvasHeight - 40);
    
    // 绘制品牌名
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('EmojiStatus', 40, this.data.canvasHeight - 40);
  },
  
  async saveImage() {
    try {
      // 获取用户授权
      const setting = await wx.getSetting();
      if (!setting.authSetting['scope.writePhotosAlbum']) {
        await wx.authorize({
          scope: 'scope.writePhotosAlbum'
        });
      }

      const query = wx.createSelectorQuery();
      const canvas = await new Promise(resolve => {
        query.select('#statusCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            resolve(res[0].node);
          });
      });
      
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvas,
          success: (res) => resolve(res.tempFilePath),
          fail: reject
        });
      });
      
      await wx.saveImageToPhotosAlbum({
        filePath: tempFilePath
      });
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('保存失败:', error);
      if (error.errMsg.includes('auth deny')) {
        wx.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        });
      }
    }
  }
}); 