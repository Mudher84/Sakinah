import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'

function mobileTestPlugin(){
  return {
    name:'muslim-mirror-mobile-test',
    configureServer(server){
      server.middlewares.use('/__muslimmirror_mobile_test',(req,res)=>{
        const port=server.config.server.port||5173
        const urls=[]
        const nets=os.networkInterfaces()
        for(const list of Object.values(nets)){
          for(const net of list||[]){
            if(net.family!=='IPv4'||net.internal)continue
            urls.push(`http://${net.address}:${port}/`)
          }
        }
        const score=u=>/^http:\/\/192\.168\./.test(u)?0:/^http:\/\/10\./.test(u)?1:/^http:\/\/172\.(1[6-9]|2\d|3[01])\./.test(u)?2:3
        urls.sort((a,b)=>score(a)-score(b))
        res.statusCode=200
        res.setHeader('Content-Type','application/json; charset=utf-8')
        res.setHeader('Cache-Control','no-store')
        res.end(JSON.stringify({urls:[...new Set(urls)]}))
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(),mobileTestPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/qf': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
})
