
import { Root, ProgressBar } from "./progress_bar.js";

const FETCH_INTERVAL = 10 * 1000 // seconds * 1000ms

// TODO: Fetch logic to API server
const fetch_level = () => {
    console.log('Fetching data...')
    return {
        current: 10,
        chunks: 10,
    }
}

const setup = () => {
    const button_status = fetch_level()
    const chunk_count  = button_status.chunks
    const current = button_status.current
    
    const root = new Root()
    const progress_bar = new ProgressBar(0, chunk_count, current)
    let current_color = progress_bar.update_level(current)
    root.updateBackgroundColor(current_color)
    progress_bar._element.style.borderColor = current_color;
    
    root.appendChild(progress_bar)
    return { root, progress_bar }
}

const update_button = (root, progress_bar) => {
    const button_status = fetch_level()
    if (button_status.current >= 0) {
        const current_color = progress_bar.update_level(button_status.current)
        root.updateBackgroundColor(current_color)
        // progress_bar._element.style.borderColor = current_color;
    }
}

const {root, progress_bar} = setup()
console.log(root, progress_bar)
setInterval(() => {
    update_button(root, progress_bar)
}, FETCH_INTERVAL)