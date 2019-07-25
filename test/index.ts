import { HashRouter } from '../src/hashRouter';

console.log('Starting router');

const router = new HashRouter();
router.mapPath('/', () => console.log('Root path'));
router.mapPath('home', () => console.log('I am home'));
router.mapPath('about', () => console.log('This is me'));
router.fallback = () => console.log('404 - Not Found');
router.listen();
