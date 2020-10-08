import { init } from './js/formMain'

import './styles/style.scss'

export {
  init
}

console.log('In export index check', init);

// Call init on DOMContentLoaded event.
window.addEventListener('DOMContentLoaded', init);
