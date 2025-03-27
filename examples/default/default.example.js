/**
TODO: 
1) Fix hack
2) Config and default key for localStorage
3) Min/max settings
4) Styling for panels adjusted for dividerr abs pos
5) localStorage storing ratio
6) resize window conditions
7) media query options
 */

const defaultOptions = {
    containerSelector: ".wrapper",
    layoutDisplayType: "flex",
    size: 2, // 'data'
    shouldApplySizeToMargin: true,
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
    config(options) {
      this.size = options.size || 2;
      this.shouldApplySizeToMargin = !!options.shouldApplySizeToMargin;
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
      this.mousePositionDx = 0;
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
        this.mousePositionDx =
          this.selectedDx > 0 &&
          (this.bound === "right" || this.bound === "bottom")
            ? -1
            : 1;
      }
  
      const size =
        e[this.mousePosition] * this.mousePositionDx +
        this.selectedPanelStartRect[this.bound] * this.selectedDx;
  
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
              break;
            case "bottom":
              resizeEl.classList.add("h-divider", "next");
              break;
            case "left":
              resizeEl.classList.add("v-divider", "prev");
              break;
            case "right":
              resizeEl.classList.add("v-divider", "next");
              break;
          }
          if (this.shouldApplySizeToMargin) {
            const marginDir = `margin${key[0].toUpperCase()}${key.slice(1)}`;
            panelEl.style[marginDir] = `${this.size}px`;
            resizeEl.style[key] = `-${this.size * 2}px`;
          }
          panelEl.appendChild(resizeEl);
        });
      });
    }
  }
  (new AdjustablePanelsLayout().init())
  