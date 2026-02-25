import { HTML, nFlex } from './assets/js/libs/afrontend/index.js'
import { createNewPeer } from './assets/js/utils/peer.js'

const et = new EventTarget()

const peer = createNewPeer('anagram', true)

peer.on('connection', (conn) => {
  console.log('peer connection', conn)

  conn.on('data', (data) => {
    console.log('conn data', data)

    const value = String(data).toString()

    if (['right', 'left'].indexOf(value) !== -1) {
      const ev = new Event('move')
      ev.value = value
      et.dispatchEvent(ev)
    }

    if (['up', 'down'].indexOf(value) !== -1) {
      const ev = new Event('letter')
      ev.value = value
      et.dispatchEvent(ev)
    }
  })
})

const state = { cursor: -1, }

HTML.fromElement(document.body)
  .setStyle('background-color', '#000000')
  .setStyle('font-family', 'sans-serif')
  .setStyle('font-size', '8vw')
  .setStyle('color', '#ffffff')

const app = HTML.fromId('app')

const lettersFlex = new nFlex()
lettersFlex.setContainerStyle('text-align', 'center')
lettersFlex.setStyle('margin', '1rem auto')

class nLetter extends HTML {
  state = {
    letter: null,
    touch: null,
    index: -1,
  }

  letter = new HTML()

  constructor(letter, index) {
    super()
    this.state.letter = letter
    this.state.index = index
  }

  getName() { return 'letter' }

  onCreate() {
    super.onCreate()
    this.setStyles()
    this.setEvents()
    this.append(this.getLetterHTML())
  }

  setStyles() {
    this.setStyle('padding', '0.5rem')
  }

  setEvents() {
    this.addEventListener('touchstart', (data) => this.onTouchStart(data))
    this.addEventListener('touchend', (data) => this.onTouchEnd(data))
    this.addEventListener('wheel', (data) => this.onWheel(data))
    et.addEventListener('letter', ({ value }) => {
      console.log('letter', value)

      if (state.cursor == this.state.index) switch (value) {
        case 'up': this.goNext(); break;
        case 'down': this.goPrevious(); break;
      }
    })
  }

  onTouchStart(data) {
    this.state.touch = data.changedTouches[0].pageY
  }

  onTouchEnd(data) {
    if (this.state.touch - data.changedTouches[0].pageY > 0) this.goNext()
    else this.goPrevious()
  }

  onWheel(data) {
    if (data.deltaY < 0) this.goNext()
    else this.goPrevious()
  }

  goNext() {
    this.setLetter(this.state.letter + 1)
  }

  goPrevious() {
    this.setLetter(this.state.letter - 1)
  }

  setLetter(letter) {
    if (letter < 97) letter = 97 // a
    if (letter > 122) letter = 122 // z
    this.state.letter = letter
    this.update()
  }

  getLetterHTML() {
    this.update()
    return this.letter
  }

  update() {
    this.letter.setText(this.getLetter())
  }

  getLetter() {
    return String.fromCharCode(this.state.letter)
  }

  clearColor() {
    this.setColor(null)
  }

  setColor(color = null) {
    this.setStyle('color', color)
  }

}

const letters = Array.from([97, 110, 97, 103, 114, 97, 109]).map((l, i) => (new nLetter(l, i)))

letters.map((l) => lettersFlex.append(l))

app.append(lettersFlex)

et.addEventListener('move', ({ value }) => {
  console.log('move', value)

  switch (value) {
    case 'left': state.cursor--; break;
    case 'right': state.cursor++; break;
  }

  letters.map((l) => l.clearColor())

  letters[state.cursor].setColor('red')
})
