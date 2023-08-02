import { Root, ProgressBar, BasicContentDisplay } from "./progress_bar.js";

const FETCH_INTERVAL = 10 * 1000; // seconds * 1000ms

// TODO: Fetch logic to API server
const fetch_level = async () => {
    try {
        const response = await fetch('http://192.168.1.7:5005/status');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Failed to fetch status')
        await new Promise(r => setTimeout(r, FETCH_INTERVAL));
        fetch_level()
    }
}

const setup = async () => {
    const root = new Root();
    const status_message = new BasicContentDisplay(0, 'The Button', 'Fetching button status...')
    const additional_information = new BasicContentDisplay(1)
    root.appendChild(status_message)

    let button_status = null
    while ( !button_status ) {
        button_status = await fetch_level();
    }
    const chunk_count = button_status.interval_count;
    const current = button_status.current_interval;
    const time_alive = button_status.time_alive;
    
    const progress_bar = new ProgressBar(0, chunk_count, current);
    let current_color = progress_bar.update_level(current);
    root.updateBackgroundColor(current_color);
    
    root.appendChild(progress_bar);
    root.appendChild(additional_information);

    return { root, progress_bar, status_message, additional_information};
}

const update_button = async (root, progress_bar, status_message, additional_information) => {
    const button_status = await fetch_level();
    console.log(button_status);
    if (button_status.complete) {
        status_message.update_message('The Button has Survived.', 'Thank you for participating.')
    }
    if (button_status.alive) {
        status_message.update_message('The Button', `The button has been alive for: ${button_status.time_alive}`)
    } else {
        status_message.update_message('The Button', 'The button is no more :(')
    }
    if (button_status.current_interval >= 0) {
        const current_color = progress_bar.update_level(button_status.current_interval);
        root.updateBackgroundColor(current_color);
        // progress_bar._element.style.borderColor = current_color;
    }
    if( button_status.additional_details ) {
        const { header, content} = button_status.additional_details 
        additional_information.update_message(header, content)
    }
}

const main = async () => {
    const { root, progress_bar, status_message, additional_information} = await setup(); // Add 'await' here to resolve the promise
    console.log(root, progress_bar);
    setInterval(() => {
        update_button(root, progress_bar, status_message, additional_information);
    }, FETCH_INTERVAL);
}

main();
