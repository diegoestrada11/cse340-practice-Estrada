import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

/**
 * Route handler for the faculty list page
 */
const facultyListPage = async (req, res) => {
    const sortBy = req.query.sort || 'department';

    // Await database call
    const faculty = await getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty,
        currentSort: sortBy
    });
};

/**
 * Route handler for individual faculty detail pages
 */
const facultyDetailPage = async (req, res, next) => {
    // Use slug-based routing
    const facultySlug = req.params.slugId;

    // Await database call
    const facultyMember = await getFacultyBySlug(facultySlug);

    // Database returns {} when not found
    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: facultyMember.name,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };
