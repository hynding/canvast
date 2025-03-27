const defaultOptions = {
  containerSelector: ".wrapper",
  layoutDisplayType: "flex",
  size: 2, // 'data'
  ns: {
    top: ".t-adjustable",
    bottom: ".b-adjustable",
    left: ".l-adjustable",
    right: ".r-adjustable",
  },
};
class AdjustablePanelsLayout {
  constructor(options = defaultOptions) {
    this.containerSelector = options.containerSelector;
    this.containerEl = document.querySelector(this.containerSelector);
    this.unselect();
    this.config(options);
  }
  log(name, value, disable = false) {
    if (!disable) {
      console.log(name, value);
    }
  }
  config(options) {
    this.size = options.size || 2;
    this.ns = options.ns;
  }
  unselect() {
    this.selectedPanelEl = null;
    this.selectedPanelStartRect = null;
    this.selectedAdjusterEl = null;
    this.selectedDim = "";
    this.selectedDx = 0;
    this.bound = "";
    this.mousePosition = "";
  }
  resize(e) {
    if (!this.selectedPanelEl || !this.selectedAdjusterEl) {
      return;
    }
    console.log("error?");
    e.preventDefault();
    if (!this.selectedPanelStartRect) {
      const { classList } = this.selectedAdjusterEl;
      this.selectedPanelStartRect =
        this.selectedPanelEl.getBoundingClientRect();
      this.selectedDim = classList.contains("h-divider") ? "height" : "width";
      this.selectedDx = classList.contains("prev") ? 1 : -1;
      if (this.selectedDim === "height") {
        this.mousePosition = "clientY";
        this.bound = this.selectedDx < 0 ? "top" : "bottom";
      } else {
        this.mousePosition = "clientX";
        this.bound = this.selectedDx < 0 ? "left" : "right";
      }
    }
    // TODO: HACK - fix it!
    let hack = 1;
    if ((this.bound === "right" && this.selectedDx > 0) || (this.bound === "bottom" && this.selectedDx > 0) ) {
        hack = -1;
    }

    console.log(
      this.selectedPanelStartRect[this.bound],
      e[this.mousePosition],
      this.selectedDx
    );
    const size =
      (e[this.mousePosition] * hack) +
      this.selectedPanelStartRect[this.bound] * this.selectedDx;
    console.log("size", size);
    console.log("bound", this.bound);
    console.log("dx", this.selectedDx);
    this.selectedPanelEl.style[this.selectedDim] = `${size}px`;
  }
  init() {
    this.containerEl.addEventListener("mouseup", (event) => {
      event.preventDefault();
      this.unselect();
    });
    this.containerEl.addEventListener("mouseleave", (event) => {
      event.preventDefault();
      this.unselect();
    });
    this.containerEl.addEventListener("mousemove", (event) => {
      this.resize(event);
    });

    Object.entries(this.ns).forEach(([key, value]) => {
      const panelEls = document.querySelectorAll(value);
      panelEls.forEach((panelEl) => {
        const resizeEl = document.createElement("div");
        resizeEl.addEventListener("mousedown", (event) => {
          event.preventDefault();
          this.selectedPanelEl = panelEl;
          this.selectedAdjusterEl = resizeEl;
        });
        switch (key) {
          case "top":
            resizeEl.classList.add("h-divider", "prev");
            //panelEl.parentNode.insertBefore(resizeEl, panelEl);
            break;
          case "bottom":
            resizeEl.classList.add("h-divider", "next");
            // panelEl.parentNode.insertBefore(resizeEl, panelEl.nextSibling);
            break;
          case "left":
            resizeEl.classList.add("v-divider", "prev");
            // panelEl.parentNode.insertBefore(resizeEl, panelEl);
            break;
          case "right":
            resizeEl.classList.add("v-divider", "next");
            // panelEl.parentNode.insertBefore(resizeEl, panelEl.nextSibling);
            break;
        }
        panelEl.appendChild(resizeEl);
      });
    });
  }
}
if (!window.apl) {
  window.apl = new AdjustablePanelsLayout();
  window.apl.init();
}
