// Import Faculty model functions.
import { getFacultyById, getSortedFaculty } from '../models/faculty/faculty.js';

/**
 * Faculty list page
 * Router GET /faculty
 */

// Controller for the faculty list page
const facultyListPage = (req, res, next) => {
    try {
        // Use ?sort or ?sortBy in the URL; default to 'department'
        const sortOption = req.query.sortBy || req.query.sort || 'department';

        // Get sorted faculty list
        const facultyList = getSortedFaculty(sortOption);

        // Render the faculty list view
        res.render('faculty/list', {
            title: 'Our Faculty',
            faculty: facultyList,
            currentSort: sortOption
        });
    } catch (error) {
        next(error);
    }
};

// Controller for the faculty detail page
const facultyDetailPage = (req, res, next) => {
    const id = req.params.facultyId;
    const facultyMember = getFacultyById(id);

    // Handle invalid or missing faculty IDs
    if (!facultyMember) {
        const err = new Error(`Faculty member with ID "${id}" not found.`);
        err.status = 404;
        return next(err);
    }

    // Render the faculty detail view
    res.render('faculty/detail', {
        title: `${facultyMember.name} - ${facultyMember.title}`,
        faculty: facultyMember
    });
};

// Export both controller functions
export { facultyListPage, facultyDetailPage };
 