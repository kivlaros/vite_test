export abstract class Frame {
  rootDOM: HTMLElement;
  constructor(selector: string) {
    this.rootDOM = document.getElementById(selector)!;
  }
  render(htmlText: string) {
    this.rootDOM.insertAdjacentHTML('beforeend', htmlText);
  }
  destroy() {
    this.rootDOM.innerHTML = '';
  }
}
