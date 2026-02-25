import { HTML, nFlex } from '././assets/js/libs/afrontend/index.js'
import { TextComponent } from '././assets/js/components/text.component.js'

class LetterComponent extends HTML {
  letter = ''

  constructor({ letter = 'a' } = {}) {
    super()
    this.letter = letter
  }

  onCreate() {
    super.onCreate()
    this.setEvents()
    this.setStyle('padding', '1rem')
    this.setStyle('font-size', '4rem')
    this.setContainerStyle('vertical-align', 'middle')
    this.setText(this.letter)
  }

  setEvents() {
    this.addEventListener('mouseenter', () => this.onMouseEnter())
    this.addEventListener('mouseleave', () => this.onMouseLeave())
    this.addEventListener('mousedown', () => this.onMouseDown())
    this.addEventListener('mouseup', () => this.onMouseUp())
  }

  onMouseEnter() {
    console.log('mouse enter', this.letter)
  }

  onMouseLeave() {
    console.log('mouse leave', this.letter)
  }

  onMouseDown() {
    console.log('mouse down', this.letter)
  }

  onMouseUp() {
    console.log('mouse up', this.letter)
  }
}

export class Page extends HTML {
  letters = new nFlex()

  state = {
    letters: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
    cursor: 0,
  }

  onCreate() {
    super.onCreate()
    this.append(this.getLetters())
    this.update()
  }

  getLetters() {
    this.letters.setStyle('margin', '0 auto')
    this.letters.setStyle('max-width', '40rem')
    return this.letters
  }

  update() {
    this.letters.clear()
    this.state.letters.map((letter) => {
      this.letters.append(new LetterComponent({ letter }))
    })
    console.log('update')
  }
}
