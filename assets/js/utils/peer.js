import { Peer } from './../libs/peerjs/index.js'
import { qrcode } from './functions.js'

class MyPeer extends Peer {
  state = { project: null }

  image = document.createElement('img')

  setProject(project) {
    this.state.project = project
    return this
  }

  hideQRCode() {
    document.body.removeChild(this.image)
    return this
  }

  showQRCode(url = this.getQRCodeUrl()) {
    const link = document.createElement('a')
    link.style.position = 'fixed'
    link.style.bottom = '1rem'
    link.style.left = '1rem'
    link.target = '_blank'
    link.href = url
    link.append(this.getQRCodeImage(url))
    document.body.append(link)
    return this
  }

  getQRCodeImage(url = '') {
    this.image.src = qrcode(url)
    return this.image
  }

  getQRCodeUrl() {
    const url = new URL(window.location)
    url.pathname = `/projects/${this.state.project}/controls.html?id=${this.id}`
    url.search = ''
    return (url.toString()).replace('%3F', '?')
  }
}

export const createJustNewPeer = (project) => (new MyPeer()).setProject(project)

export const createNewPeer = (project, { qrcode = false, id = undefined }) => {
  const peer = new MyPeer(id)
  peer.setProject(project)

  peer.on('connection', (conn) => {
    console.log('peer connection', { peer, conn })

    conn.on('open', (open) => {
      console.log('conn open', { peer, conn, open })
    })

    conn.on('close', (close) => {
      console.log('conn close', { peer, conn, close })
    })

    conn.on('error', (error) => {
      console.log('conn error', { peer, conn, error })
    })

    conn.on('data', (data) => {
      console.log('conn data', { peer, conn, data })
    })
  })

  peer.on('open', (open) => {
    console.log('peer open', { peer, open })
  })

  peer.on('error', (error) => {
    console.log('peer error', { peer, error })
  })

  peer.on('close', (close) => {
    console.log('peer close', { peer, close })
  })

  return peer
}