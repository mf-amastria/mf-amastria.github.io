import { Root, ProgressBar } from "./progress_bar.js";

const FETCH_INTERVAL = 10 * 1000; // seconds * 1000ms

// TODO: Fetch logic to API server
const fetch_level = async () => {
    const response = await fetch('http://192.168.1.7:5005/status');
    const data = await response.json();
    return data;
}

const setup = async () => {
    const button_status = await fetch_level();
    const chunk_count = button_status.interval_count;
    const current = button_status.current_interval;
    
    const root = new Root();
    const progress_bar = new ProgressBar(0, chunk_count, current);
    let current_color = progress_bar.update_level(current);
    root.updateBackgroundColor(current_color);
    
    root.appendChild(progress_bar);
    return { root, progress_bar };
}

const update_button = async (root, progress_bar) => {
    const button_status = await fetch_level();
    console.log(button_status);
    if (button_status.current_interval >= 0) {
        const current_color = progress_bar.update_level(button_status.current_interval);
        root.updateBackgroundColor(current_color);
        // progress_bar._element.style.borderColor = current_color;
    }
}

const main = async () => {
    const { root, progress_bar } = await setup(); // Add 'await' here to resolve the promise
    console.log(root, progress_bar);
    setInterval(() => {
        update_button(root, progress_bar);
    }, FETCH_INTERVAL);
}

main();
