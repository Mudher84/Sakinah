import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import dgram from 'node:dgram'

const VIRTUAL_ADAPTER_RE = /(virtual|vmware|hyper-v|vethernet|docker|wsl|tailscale|zerotier|hamachi|vpn|tap|tun|loopback|bluetooth)/i
const WIFI_ADAPTER_RE = /(wi-?fi|wireless|wlan)/i
const ETHERNET_ADAPTER_RE = /(ethernet|lan)/i

function isPrivateIPv4(address){
  return /^10\./.test(address)||/^192\.168\./.test(address)||/^172\.(1[6-9]|2\d|3[01])\./.test(address)
}

function getRouteAddress(){
  return new Promise(resolve=>{
    const socket=dgram.createSocket('udp4')
    const done=value=>{try{socket.close()}catch{} resolve(value||'')}
    socket.once('error',()=>done(''))
    socket.connect(53,'1.1.1.1',()=>{
      try{done(socket.address().address)}catch{done('')}
    })
    setTimeout(()=>done(''),350)
  })
}

function mobileTestPlugin(){
  return {
    name:'muslim-mirror-mobile-test',
    configureServer(server){
      server.middlewares.use('/__muslimmirror_mobile_test',async(req,res)=>{
        const port=server.config.server.port||5173
        const routeAddress=await getRouteAddress()
        const candidates=[]
        const nets=os.networkInterfaces()

        for(const [name,list] of Object.entries(nets)){
          if(VIRTUAL_ADAPTER_RE.test(name))continue
          for(const net of list||[]){
            if(net.family!=='IPv4'||net.internal||!isPrivateIPv4(net.address))continue
            let score=30
            if(net.address===routeAddress)score-=20
            if(WIFI_ADAPTER_RE.test(name))score-=8
            else if(ETHERNET_ADAPTER_RE.test(name))score-=5
            if(/^192\.168\./.test(net.address))score-=4
            else if(/^10\./.test(net.address))score-=2
            candidates.push({
              url:`http://${net.address}:${port}/`,
              address:net.address,
              name,
              primary:net.address===routeAddress,
              score,
            })
          }
        }

        candidates.sort((a,b)=>a.score-b.score||a.name.localeCompare(b.name))
        const unique=[]
        const seen=new Set()
        for(const candidate of candidates){
          if(seen.has(candidate.url))continue
          seen.add(candidate.url)
          unique.push(candidate)
        }

        res.statusCode=200
        res.setHeader('Content-Type','application/json; charset=utf-8')
        res.setHeader('Cache-Control','no-store')
        res.end(JSON.stringify({
          candidates:unique,
          urls:unique.map(item=>item.url),
          routeAddress,
          port,
        }))
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
