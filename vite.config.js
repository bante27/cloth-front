import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,       // ቪቴ በኮንቴይነር ውስጥ እንዲያዳምጥ ያደርጋል
    port: 3000,       // የቪቴ የውስጥ ፖርት
    strictPort: true,
    hmr: {
      clientPort: 5174, // ብሮውዘሩ ከውጭ ሆኖ የሚገናኝበት የዶከር ፖርት
    },
  },
})