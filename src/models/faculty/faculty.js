import db from '../db.js';

/**
 * Core function to get a single faculty member by ID or slug.
 */
const getFaculty = async (identifier, identifierType = 'id') => {
    const whereClause = identifierType === 'slug' ? 'f.slug = $1' : 'f.id = $1';

    const query = `
        SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
               f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        WHERE ${whereClause}
    `;

    const result = await db.query(query, [identifier]);

    if (result.rows.length === 0) return {};

    const faculty = result.rows[0];
    return {
        id: faculty.id,
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        name: `${faculty.first_name} ${faculty.last_name}`,
        office: faculty.office,
        phone: faculty.phone,
        email: faculty.email,
        department: faculty.department_name,
        departmentCode: faculty.department_code,
        title: faculty.title,
        gender: faculty.gender,
        slug: faculty.slug
    };
};

/**
 * Get all faculty members with optional sorting.
 */
const getSortedFaculty = async (sortBy = 'department') => {
    const orderByClause =
        sortBy === 'name' ? 'f.last_name, f.first_name' :
        sortBy === 'title' ? 'f.title, f.last_name' :
        'd.name, f.last_name, f.first_name';

    const query = `
        SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
               f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query);

    return result.rows.map(faculty => ({
        id: faculty.id,
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        name: `${faculty.first_name} ${faculty.last_name}`,
        office: faculty.office,
        phone: faculty.phone,
        email: faculty.email,
        department: faculty.department_name,
        departmentCode: faculty.department_code,
        title: faculty.title,
        gender: faculty.gender,
        slug: faculty.slug
    }));
};

/**
 * Wrappers for common use cases
 * 
 */
const getAllFaculty = () => getSortedFaculty();

/**
 * Other wrappers
 */
const getFacultyById = (facultyId) => getFaculty(facultyId, 'id');
const getFacultyBySlug = (facultySlug) => getFaculty(facultySlug, 'slug');

const getFacultyByDepartment = async (departmentId, sortBy = 'name') => {
    const orderByClause =
        sortBy === 'name' ? 'f.last_name, f.first_name' :
        sortBy === 'title' ? 'f.title, f.last_name' :
        'd.name, f.last_name, f.first_name';

    const query = `
        SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
               f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        WHERE f.department_id = $1
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [departmentId]);

    return result.rows.map(faculty => ({
        id: faculty.id,
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        name: `${faculty.first_name} ${faculty.last_name}`,
        office: faculty.office,
        phone: faculty.phone,
        email: faculty.email,
        department: faculty.department_name,
        departmentCode: faculty.department_code,
        title: faculty.title,
        gender: faculty.gender,
        slug: faculty.slug
    }));
};

/**
 * Exports (THIS is what fixes the crash)
 */
export {
    getAllFaculty,
    getFacultyById,
    getFacultyBySlug,
    getSortedFaculty,
    getFacultyByDepartment
};
