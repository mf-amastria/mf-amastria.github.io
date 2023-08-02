class HSL {
    constructor(hue, saturation, lightness){
        this.hue = hue
        this.saturation = saturation
        this.lightness = lightness
    }

    toString() {
        return `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`
    }
}

class CustomElement {
    get node() {
        return this._element
    }

    // Prevents the need to call '.node' when appending to elements
    appendChild(element) { 
        this._element.appendChild(element.node)
    }

    updateBackgroundColor(color) {
        this._element.style.backgroundColor = color
    }
}

class Root extends CustomElement {
    constructor(id='root') {
        super()
        this._element = document.querySelector(`#${id}`);
    }
}

const LIGHTNESS_ACTIVE = 50
const SATURATION_ACTIVE = 75
const LIGHTNESS_INACTIVE = 10
const SATURATION_INACTIVE = 10 

class ProgressBarChunk extends CustomElement{
    constructor(id, color) {
        super()
        this._id = id;
        this._color = color;
        this._enabled = true
        this._element = document.createElement("div")
        this._element.id = `chunk_${id}`
        this._element.classList.add("prog-bar-chunk")
        this._element.style.backgroundColor = color
    }

    enable() {
        const color = this._color;
        color.lightness = LIGHTNESS_ACTIVE
        color.saturation = SATURATION_ACTIVE
        this._color = color
        this.updateBackgroundColor(color)
        this._enabled = true
    }

    disable() {
        const color = this._color;
        color.lightness = LIGHTNESS_INACTIVE
        color.saturation = SATURATION_INACTIVE
        this._color = color
        this.updateBackgroundColor(color)
        this._enabled = false
    }
}

class ProgressBar extends CustomElement {
    constructor(id, segments=10) {
        super()
        this._total_segments = segments
        this._current_segment = segments
        this._element = document.createElement("div")
        this._element.id = `progress_bar_${id}`
        this._element.classList.add("prog-bar")
        this._chunks = []
        for(let i = 0; i < segments; i++ ){
            const chunk = new ProgressBarChunk(
                i, 
                this.generateColorRangeSegment(i, segments)
            )
            this._chunks.push(chunk)
            this.appendChild(
                chunk
            )
        }
        this._chunks = this._chunks.reverse()
    }

    generateColorRangeSegment(step, total) {
        const hueStart = 0; // Red
        const hueEnd = 270; // Purple

        const hue = hueStart + (hueEnd - hueStart) * (step / (total - 1));
        const lightness = LIGHTNESS_ACTIVE; // Use a fixed lightness value (adjust as needed)
        const saturation = SATURATION_ACTIVE; // Use a fixed saturation value (adjust as needed)
        const color = new HSL(hue, saturation, lightness)
        
        return color
    }

    update_level(level){
        if (this._current_segment < level) {
            this.reset()
        }
        this._current_segment = level
        const inactive_blocks = this._chunks.length - level;
        for (let i = 0; i < inactive_blocks; i++) {
            this._chunks[i].disable()
        }
        if (level > 0)
            return this._chunks[inactive_blocks]._color
        else 
            return this._chunks[0]._color
    }

    reset() {
        for (const chunk of this._chunks) {
            chunk.enable()
        }
    }
}

class BasicContentDisplay extends CustomElement {
    constructor(id, header, message) {
        super()
        this._element = document.createElement('div');
        this._element.id = `button_status_${id}`;
        this._element.classList.add("button_status")

        this._header_element = document.createElement('h3');
        this._header_element.textContent = header;
        this._paragraph_element = document.createElement('p');
        this._paragraph_element.textContent = message;

        this._element.appendChild(this._header_element );
        this._element.appendChild(this._paragraph_element);
    }

    update_message(header, message) {
        this._header_element.textContent = header;
        this._paragraph_element.textContent = message;
    }
}

export { Root, ProgressBar, BasicContentDisplay, HSL}