"use babel"

export default class SubstratePluginView {
  private element: HTMLElement

  constructor(_serializedState: any) {
    // Create root element
    this.element = document.createElement("div")
    this.element.classList.add("substrate-plugin")

    // Create message element
    const message = document.createElement("div")
    message.textContent = "The SubstratePlugin package is Alive! It\'s ALIVE!"
    message.classList.add("message")
    this.element.appendChild(message)
  }

  // Returns an object that can be retrieved when package is activated
  public serialize() {}

  // Tear down any state and detach
  public destroy() {
    this.element.remove()
  }

  public getElement() {
    return this.element
  }
}
