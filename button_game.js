
import { Root, ProgressBar, BasicContentDisplay } from "./progress_bar.js";

const FETCH_INTERVAL = 10 * 1000; // seconds * 1000ms
const MAX_RETRIES = 3;
const BUTTON_API = 'http://66.27.115.160:5005'

const fetchStatus = async () => {
    const response = await fetch(`${BUTTON_API}/status`);
    const data = await response.json();
    return data;
}

const fetchStatusWithRetry = async (retryCount = 0) => {
    try {
        return await fetchStatus();
    } catch (error) {
        console.log('Failed to fetch status:', error);

        if (retryCount < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, FETCH_INTERVAL));
            return fetchStatusWithRetry(retryCount + 1);
        } else {
            throw new Error('Max retries reached. Unable to fetch status.');
        }
    }
}

const setupProgressBar = (root, buttonStatus) => {
    const { interval_count: chunkCount, current_interval: current, time_alive } = buttonStatus;

    const statusMessage = new BasicContentDisplay(0, 'The Button', 'Fetching button status...');
    root.appendChild(statusMessage);

    const additionalInformation = new BasicContentDisplay(1);
    root.appendChild(additionalInformation);

    const progressBar = new ProgressBar(0, chunkCount, current);
    const currentColor = progressBar.update_level(current);
    // root.updateBackgroundColor(currentColor);
    root.appendChild(progressBar);

    return { progressBar, statusMessage, additionalInformation };
}

const updateButtonStatus = async (root, progressBar, statusMessage, additionalInformation) => {
    try {
        const buttonStatus = await fetchStatusWithRetry();
        console.log(buttonStatus);

        if (buttonStatus.complete) {
            statusMessage.update_message('The Button has Survived.', 'Thank you for participating.');
        } else if (buttonStatus.alive) {
            statusMessage.update_message('The Button', `The button has been alive for: ${buttonStatus.time_alive}`);
        } else {
            statusMessage.update_message('The Button', 'The button is no more :(');
        }

        if (buttonStatus.current_interval >= 0) {
            const currentColor = progressBar.update_level(buttonStatus.current_interval);
            // root.updateBackgroundColor(currentColor);
        }

        if (buttonStatus.additional_details) {
            const { header, content } = buttonStatus.additional_details;
            additionalInformation.update_message(header, content);
        }
    } catch (error) {
        console.log('Error updating button status:', error);
    }
}

const start_game = async () => {
    try {
        const root = new Root();
        const buttonStatus = await fetchStatusWithRetry();

        const { progressBar, statusMessage, additionalInformation } = setupProgressBar(root, buttonStatus);
        await updateButtonStatus(root, progressBar, statusMessage, additionalInformation);
        const intervalId = setInterval(async () => {
            await updateButtonStatus(root, progressBar, statusMessage, additionalInformation);
            if (buttonStatus.complete || !buttonStatus.alive) {
                clearInterval(intervalId); // Stop the interval if the desired conditions are met
                if(buttonStatus.alive) progressBar.update_level(progressBar._total_segments)
            }
        }, FETCH_INTERVAL);
    } catch (error) {
        console.log('Error setting up the application:', error);
    }
}

export { start_game }
