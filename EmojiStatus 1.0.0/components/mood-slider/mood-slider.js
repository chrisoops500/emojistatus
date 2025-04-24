Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: ''
    },
    value: {
      type: Number,
      value: 3
    }
  },

  methods: {
    handleChange(e) {
      const value = e.detail.value;
      this.setData({ value });
      this.triggerEvent('change', { value });
    }
  }
}); 