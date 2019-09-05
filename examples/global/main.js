// import a CSS module
import classes from './main.css';
// import Smooth from './../../src/smooth';
import Scroll from './../../src/Scroll';

export default () => {

	const scroll = new Scroll({
		dom: document.querySelector('.background')
	});

	// scroll.start()

};