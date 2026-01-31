// Imports
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Declare Important Variables
 */
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Course data (hardcoded for now)
 */
const courses = {
    CS121: {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    MATH110: {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    ENG101: {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

/**
 * Setup Express Server
 */
const app = express();

/**
 * Global Middleware
 */

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Global template variables
app.use((req, res, next) => {
    // Environment
    res.locals.NODE_ENV = NODE_ENV.toLowerCase();

    // Current year
    res.locals.currentYear = new Date().getFullYear();

    // Greeting
    const hour = new Date().getHours();
    res.locals.greeting =
        hour < 12 ? "<p>Good morning! ☀️</p>" :
        hour < 18 ? "<p>Good afternoon! 🌤️</p>" :
                     "<p>Good evening! 🌙</p>";

    // 🎨 Theme based on route (changes when navigating)
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    const pathIndex = req.path.length % themes.length;
    res.locals.bodyClass = themes[pathIndex];

    // Query params
    res.locals.queryParams = req.query || {};

    next();
});

/**
 * Route-specific middleware
 */
const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'This header only exists on the demo page');
    next();
};

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.render('home', { title: 'Welcome Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me' });
});

// Course catalog
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses
    });
});

// Course detail with sorting
app.get('/catalog/:courseId', (req, res, next) => {
    const course = courses[req.params.courseId];

    if (!course) {
        const err = new Error('Course not found');
        err.status = 404;
        return next(err);
    }

    const sortBy = req.query.sort || 'time';
    const sections = [...course.sections];

    if (sortBy === 'professor') {
        sections.sort((a, b) => a.professor.localeCompare(b.professor));
    } else if (sortBy === 'room') {
        sections.sort((a, b) => a.room.localeCompare(b.room));
    }

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections },
        currentSort: sortBy
    });
});

// Demo page (route-specific middleware)
app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});

/**
 * Error Handling
 */

// Test 500 error
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Catch-all 404
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV
    });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
