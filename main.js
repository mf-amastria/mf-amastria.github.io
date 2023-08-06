import { start_game } from './button_game.js'

start_game()

// Select all the header containers
const detailContainers = document.querySelectorAll('.details-container');

// Add click event listener to each container
detailContainers.forEach((container) => {
  // Get the header element and content element within the container
  const headerElement = container.querySelector('h4');
  const contentElement = container.querySelector('.content');

  // Add a click event listener to the header element
  headerElement.addEventListener('click', () => {
    // Toggle the "active" class on the content element to show/hide it
    contentElement.classList.toggle('active');
  });
});
