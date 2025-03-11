const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'chat-dark-bg': '#1E293B',
        'message-light-bg': '#f3f4f6',
        'message-dark-bg': '#1E293B',
        'message-dark-hover': '#2D3748',
        'input-dark-bg': '#1E293B',
        'text-dark': '#E2E8F0',
        'coral': '#E47D62',
        'turquoise': '#4CB0AD',
        'chat-fg': '#171717',
        'muted-foreground': '#6B7280',
        'input-border': '#e0e0e0',
      },
    },
  },
}; 