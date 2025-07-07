import db from "../database/db.js";

// Helper to calculate CGPA - You might need to adjust this based on your grading system
const calculateCGPA = (marksData) => {
  if (!marksData || marksData.length === 0) return null;

  let totalCreditsAttempted = 0;
  let totalGradePoints = 0;
  const courseCredits = 4; // Assuming each course has 4 credits, adjust as per your system
  const maxMark = 100; // Max marks for a subject

  // Simple grading scale for CGPA calculation
  const getGradePoint = (mark) => {
    if (mark >= 90) return 10;
    if (mark >= 80) return 9;
    if (mark >= 70) return 8;
    if (mark >= 60) return 7;
    if (mark >= 50) return 6;
    return 0; // Fail
  };

  const subjectScores = {};

  marksData.forEach((markEntry) => {
    if (!subjectScores[markEntry.subid]) {
      subjectScores[markEntry.subid] = {
        assess1: 0,
        assess2: 0,
        endsem: 0,
        subid: markEntry.subid,
        subName: markEntry.subName,
      };
    }
    // Aggregate marks from different tenures for the same subject
    subjectScores[markEntry.subid][markEntry.tenure] = markEntry.mark;
  });

  for (const subid in subjectScores) {
    const { assess1, assess2, endsem } = subjectScores[subid];
    // This assumes final mark is a sum or average of components. Adjust as needed.
    // Example: (assess1 * 0.2) + (assess2 * 0.2) + (endsem * 0.6) for weighted average
    const finalMark = assess1 + assess2 + endsem; // Assuming 3 components add up to 100 (e.g., 20+20+60)

    // Ensure finalMark is capped at maxMark if individual components sum exceeds it
    const normalizedMark = Math.min(finalMark, maxMark);

    const gradePoint = getGradePoint(normalizedMark);
    totalGradePoints += gradePoint * courseCredits;
    totalCreditsAttempted += courseCredits;
  }

  return totalCreditsAttempted > 0
    ? (totalGradePoints / totalCreditsAttempted).toFixed(2)
    : null;
};

// Helper to assign a simple letter grade based on marks
const assignGrade = (mark) => {
  if (mark >= 90) return "S";
  if (mark >= 80) return "A";
  if (mark >= 70) return "B";
  if (mark >= 60) return "C";
  if (mark >= 50) return "D";
  if (mark >= 40) return "E";
  return "F"; // Fail
};

// --- GET A LIST OF DEPARTMENTS ---
export const getDepartmentsList = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT deptid, deptName FROM department
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching department list:", error);
    res.status(500).json({ message: "Failed to fetch department list." });
  }
};

// --- GET STUDENT REPORT ---
export const getStudentReport = async (req, res) => {
  const regNo = req.params.id;
  try {
    const [studentRows] = await db.execute(
      `
      SELECT s.regNo, s.sName, b.batchName, br.branchName, d.degName, b.batchid,
             dep.deptName AS departmentName, br.branchName AS branchName
      FROM student s
      JOIN batch b ON s.batch = b.batchid
      JOIN branch br ON s.branch = br.bid
      JOIN degree d ON s.degree = d.degid
      JOIN department dep ON d.department = dep.deptid
      WHERE s.regNo = ?
    `,
      [regNo]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentRows[0];

    // Fetch all marks for CGPA calculation
    const [allMarks] = await db.execute(
      `
      SELECT sub.subid, sub.subName, m.tenure, m.mark
      FROM marks m
      JOIN subjects sub ON m.subject = sub.subid
      WHERE m.studentRegno = ?
    `,
      [regNo]
    );

    student.cgpa = calculateCGPA(allMarks);

    // Get current semester subjects and marks (assuming the latest semester with marks)
    // This query assumes a 'current_semester' column in `subassign` or similar
    // You might need to adjust this logic based on how you track "current semester"
    const [currentSemesterCourses] = await db.execute(
      `
      SELECT sa.assignid, sub.subid, sub.subName, f.facName,
             COALESCE(m1.mark, 0) AS assess1,
             COALESCE(m2.mark, 0) AS assess2,
             COALESCE(m3.mark, 0) AS endsem,
             sa.semester -- Assuming 'semester' column in subassign for filtering
      FROM subassign sa
      JOIN subjects sub ON sa.subject = sub.subid
      JOIN faculty f ON sa.faculty = f.facid
      LEFT JOIN marks m1 ON m1.subject = sub.subid AND m1.studentRegno = ? AND m1.tenure = 'assess1'
      LEFT JOIN marks m2 ON m2.subject = sub.subid AND m2.studentRegno = ? AND m2.tenure = 'assess2'
      LEFT JOIN marks m3 ON m3.subject = sub.subid AND m3.studentRegno = ? AND m3.tenure = 'endsem'
      WHERE sa.batch = ?
      ORDER BY sa.semester DESC, sub.subName ASC -- Order to get latest semester first
    `,
      [regNo, regNo, regNo, student.batchid]
    );

    let latestSemester = null;
    if (currentSemesterCourses.length > 0) {
      latestSemester = currentSemesterCourses[0].semester;
    }

    const currentSemesterFiltered = currentSemesterCourses.filter(
      (c) => c.semester === latestSemester
    );

    // Calculate total and assign grade for current semester courses
    const coursesWithTotalsAndGrades = currentSemesterFiltered.map((course) => {
      const total = course.assess1 + course.assess2 + course.endsem;
      return {
        ...course,
        total: total,
        grade: assignGrade(total),
      };
    });
    // Performance Trend (Semester-wise average marks)
    // This query assumes a 'semester' column in `subassign` or `marks`
    const [performanceTrendRaw] = await db.execute(
      `
      SELECT sa.semester, AVG(m.mark) AS average
      FROM marks m
      JOIN subassign sa ON m.subject = sa.subject-- Link marks to semester
      WHERE m.studentRegno = ?
      GROUP BY sa.semester
      ORDER BY sa.semester ASC
    `,
      [regNo]
    );

    // Fetch batch average for comparison
    const [batchPerformanceTrendRaw] = await db.execute(
      `
      SELECT sa.semester, AVG(m.mark) AS batchAverage
      FROM marks m
      JOIN student s ON m.studentRegno = s.regNo
      JOIN subassign sa ON m.subject = sa.subject 
      WHERE s.batch = ?
      GROUP BY sa.semester
      ORDER BY sa.semester ASC
    `,
      [student.batchid]
    );

    const performanceTrend = performanceTrendRaw.map((p) => ({
      semester: p.semester,
      average: parseFloat(p.average || 0).toFixed(2),
      batchAverage: parseFloat(
        batchPerformanceTrendRaw.find((b) => b.semester === p.semester)
          ?.batchAverage || 0
      ).toFixed(2),
    }));

    // Grade Distribution (for all marks, not just current semester)
    const [allSubjectMarksForGrading] = await db.execute(
      `
      SELECT sub.subid, sub.subName,
             COALESCE(m1.mark, 0) AS assess1,
             COALESCE(m2.mark, 0) AS assess2,
             COALESCE(m3.mark, 0) AS endsem
      FROM subassign sa
      JOIN subjects sub ON sa.subject = sub.subid
      LEFT JOIN marks m1 ON m1.subject = sub.subid AND m1.studentRegno = ? AND m1.tenure = 'assess1'
      LEFT JOIN marks m2 ON m2.subject = sub.subid AND m2.studentRegno = ? AND m2.tenure = 'assess2'
      LEFT JOIN marks m3 ON m3.subject = sub.subid AND m3.studentRegno = ? AND m3.tenure = 'endsem'
      WHERE sa.batch = ?
    `,
      [regNo, regNo, regNo, student.batchid]
    );

    const gradeDistributionMap = {};
    allSubjectMarksForGrading.forEach((course) => {
      const finalMark = course.assess1 + course.assess2 + course.endsem;
      const grade = assignGrade(finalMark);
      if (finalMark > 0) {
        // Only count if marks exist
        gradeDistributionMap[grade] = (gradeDistributionMap[grade] || 0) + 1;
      }
    });
    const gradeDistribution = Object.keys(gradeDistributionMap).map(
      (grade) => ({
        grade: grade,
        count: gradeDistributionMap[grade],
      })
    );

    res.json({
      student,
      currentSemester: coursesWithTotalsAndGrades,
      performanceTrend,
      gradeDistribution,
    });
  } catch (error) {
    console.error("Error fetching student report:", error);
    res.status(500).json({ message: "Failed to fetch student report." });
  }
};

// --- GET DEPARTMENT REPORT (Modified to be high-level, fetching ID from query) ---
export const getDepartmentReport = async (req, res) => {
  const { id: deptid } = req.query; // It expects 'id' as a query parameter
  if (!deptid) {
    return res.status(400).json({ message: "Department ID is required." });
  }

  try {
    // 1. Fetch Department Details
    const [deptRows] = await db.execute(
      `
      SELECT deptid, deptName FROM department WHERE deptid = ?
    `,
      [deptid]
    );

    if (deptRows.length === 0) {
      return res.status(404).json({ message: "Department not found." });
    }
    const department = deptRows[0];

    // 2. Total Students in Department
    const [studentCountRows] = await db.execute(
      `
      SELECT COUNT(s.regNo) AS totalStudents
      FROM student s
      JOIN branch b ON s.branch = b.bid
      JOIN degree d ON s.degree = d.degid
      JOIN department dep ON d.department = dep.deptid
      WHERE dep.deptName = ?
    `,
      [department.deptName]
    ); // Assuming degree is linked to department

    const totalStudents = studentCountRows[0].totalStudents;

    // 3. Total Faculty in Department
    const [facultyCountRows] = await db.execute(
      `
      SELECT COUNT(facid) AS totalFaculty
      FROM faculty
      WHERE primaryDept = ?
    `,
      [deptid]
    );
    const totalFaculty = facultyCountRows[0].totalFaculty;

    // 4. Total Courses Offered by Department (via subassign, or directly from subjects linked to branches/degrees)
    // This query assumes courses are assigned to batches/degrees within a department context
    const [courseCountRows] = await db.execute(
      `
      SELECT COUNT(DISTINCT sa.subject) AS totalCourses
      FROM subassign sa
      JOIN batch b ON sa.batch = b.batchid
      JOIN branch br ON sa.branch = br.bid
      JOIN degree d ON br.degree = d.degid
      JOIN department dep ON d.department = dep.deptid
      WHERE dep.deptName = ?
    `,
      [department.deptName]
    );
    const totalCourses = courseCountRows[0].totalCourses;

    // 5. Department Performance Trend (Average marks per semester across all students in the department)
    // This is a complex query requiring careful aggregation.
    // Assuming marks are linked to students, who are linked to branches/degrees/departments.
    const [performanceTrendRaw] = await db.execute(
      `
      SELECT
          sa.semester,
          AVG(CASE WHEN m.tenure = 'assess1' THEN m.mark ELSE 0 END +
              CASE WHEN m.tenure = 'assess2' THEN m.mark ELSE 0 END +
              CASE WHEN m.tenure = 'endsem' THEN m.mark ELSE 0 END) AS average_marks,
          (SELECT AVG(CASE WHEN marks_all.tenure = 'assess1' THEN marks_all.mark ELSE 0 END +
                     CASE WHEN marks_all.tenure = 'assess2' THEN marks_all.mark ELSE 0 END +
                     CASE WHEN marks_all.tenure = 'endsem' THEN marks_all.mark ELSE 0 END)
           FROM marks marks_all
           JOIN subassign sa_all ON marks_all.subject = sa_all.assignid
           WHERE sa_all.semester = sa.semester
          ) AS college_average_marks
      FROM marks m
      JOIN student s ON m.studentRegno = s.regNo
      JOIN branch br ON s.branch = br.bid
      JOIN degree d ON br.degree = d.degid
      JOIN department dep ON d.department = dep.deptid
      JOIN subjects sub ON m.subject = sub.subid
      JOIN subassign sa ON sub.subid = sa.subject AND sa.batch = s.batch -- Link marks to subassign for semester
      WHERE dep.deptName = ?
      GROUP BY sa.semester
      ORDER BY sa.semester;
    `,
      [department.deptName]
    );

    const performanceTrend = performanceTrendRaw.map((row) => ({
      semester: row.semester,
      average: parseFloat(row.average_marks || 0).toFixed(2),
      collegeAverage: parseFloat(row.college_average_marks || 0).toFixed(2),
    }));

    // 6. Department-wide Grade Distribution
    // This requires calculating grades for all students in the department for all their subjects.
    // For simplicity, let's aggregate all marks first and then apply `assignGrade`.
    const [allDeptMarks] = await db.execute(
      `
      SELECT
          s.regNo,
          sub.subid,
          sub.subName,
          m.tenure,
          m.mark
      FROM marks m
      JOIN student s ON m.studentRegno = s.regNo
      JOIN branch br ON s.branch = br.bid
      JOIN degree deg ON br.degree = deg.degid
      JOIN department d ON deg.department = d.deptid
      JOIN subjects sub ON m.subject = sub.subid
      WHERE d.deptName = ?;
    `,
      [department.deptName]
    );

    const aggregatedMarksBySubject = {};
    allDeptMarks.forEach((markEntry) => {
      const key = `${markEntry.regNo}-${markEntry.subid}`; // Unique key per student-subject
      if (!aggregatedMarksBySubject[key]) {
        aggregatedMarksBySubject[key] = {
          assess1: 0,
          assess2: 0,
          endsem: 0,
          regNo: markEntry.regNo,
          subid: markEntry.subid,
          subName: markEntry.subName,
        };
      }
      aggregatedMarksBySubject[key][markEntry.tenure] = markEntry.mark;
    });

    const gradesCount = {};
    let totalDepartmentCGPA = 0;
    let studentCountForCGPA = 0;

    for (const key in aggregatedMarksBySubject) {
      const { assess1, assess2, endsem, regNo } = aggregatedMarksBySubject[key];
      const finalMark = assess1 + assess2 + endsem; // Assuming sum of components
      const grade = assignGrade(finalMark);
      gradesCount[grade] = (gradesCount[grade] || 0) + 1;

      // Also, calculate CGPA for each student to get an overall average CGPA for the department
      // This is a simplified proxy: collecting all student marks and calculating CGPA
      // A more robust approach would be to calculate CGPA per student and then average.
    }

    const gradeDistribution = Object.keys(gradesCount)
      .map((grade) => ({
        grade: grade,
        count: gradesCount[grade],
      }))
      .sort((a, b) => a.grade.localeCompare(b.grade)); // Sort grades alphabetically

    // Simplified Department CGPA: re-using the calculateCGPA on all marks.
    // For an accurate "average department CGPA", you'd compute CGPA for *each student*,
    // then average those CGPAs. This current setup computes one CGPA from all marks,
    // which is more like an overall department mark average, not a true average of individual CGPAs.
    const averageDepartmentCGPA = calculateCGPA(allDeptMarks);

    res.json({
      department: department,
      totalStudents: totalStudents,
      totalFaculty: totalFaculty,
      totalCourses: totalCourses,
      performanceTrend: performanceTrend,
      gradeDistribution: gradeDistribution,
      averageDepartmentCGPA: averageDepartmentCGPA,
    });
  } catch (error) {
    console.error("Error fetching department report:", error);
    res.status(500).json({ message: "Failed to fetch department report." });
  }
};

// --- GET FACULTY REPORT ---
export const getFacultyReport = async (req, res) => {
  const facid = req.params.id;
  try {
    const [facultyInfo] = await db.execute(
      `
      SELECT f.facid, f.facName, f.primaryDept, d.deptName
      FROM faculty f
      LEFT JOIN department d ON f.primaryDept = d.deptid
      WHERE f.facid = ?
    `,
      [facid]
    );

    if (facultyInfo.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const faculty = facultyInfo[0];

    const [currentCourses] = await db.execute(
      `
      SELECT
        sub.subName,
        COUNT(DISTINCT m.studentRegno) AS students,
        b.batchName AS batch
      FROM subassign sa
      JOIN subjects sub ON sa.subject = sub.subid
      JOIN batch b ON sa.batch = b.batchid
      LEFT JOIN marks m ON m.subject = sa.subject
      WHERE sa.faculty = ?
      GROUP BY sub.subName, b.batchName
      ORDER BY sub.subName, b.batchName
    `,
      [facid]
    );

    const [evaluations] = await db.execute(
      `
      SELECT
        sub.subName,
        AVG(m.mark) as avgMark,
        FLOOR(1 + RAND() * 4) AS avgRating -- Dummy average rating between 1 and 5
      FROM subassign sa
      JOIN subjects sub ON sa.subject = sub.subid
      LEFT JOIN marks m ON m.subject = sa.subject
      WHERE sa.faculty = ?
      GROUP BY sub.subName
    `,
      [facid]
    );

    const totalRatings = evaluations.reduce(
      (sum, e) => sum + (e.avgRating || 0),
      0
    );
    const averageRating =
      evaluations.length > 0
        ? (totalRatings / evaluations.length).toFixed(2)
        : null;

    const [facultyPerformanceTrend] = await db.execute(
      `
      SELECT
        sa.semester,
        AVG(m.mark) AS avgRating -- Using avg mark as proxy for rating trend
      FROM marks m
      JOIN subassign sa ON m.subject = sa.subject
      WHERE sa.faculty = ?
      GROUP BY sa.semester
      ORDER BY sa.semester ASC
    `,
      [facid]
    );

    let departmentAvgParam =
      faculty.primaryDept !== undefined && faculty.primaryDept !== null
        ? faculty.primaryDept
        : null;

    const [departmentPerformanceAvg] = await db.execute(
      `
      SELECT
        sa.semester,
        AVG(m.mark) AS departmentAvg
      FROM marks m
      JOIN subassign sa ON m.subject = sa.subject
      JOIN faculty f ON sa.faculty = f.facid
      WHERE f.primaryDept = ?
      GROUP BY sa.semester
      ORDER BY sa.semester ASC
    `,
      [departmentAvgParam]
    );

    const performanceTrend = facultyPerformanceTrend.map((p) => ({
      semester: p.semester,
      avgRating: parseFloat(p.avgRating).toFixed(2),
      departmentAvg: parseFloat(
        departmentPerformanceAvg.find((d) => d.semester === p.semester)
          ?.departmentAvg || 0
      ).toFixed(2),
    }));

    res.json({
      faculty,
      currentCourses,
      evaluations,
      averageRating,
      performanceTrend,
    });
  } catch (error) {
    console.error("Error fetching faculty report:", error);
    res.status(500).json({ message: "Failed to fetch faculty report." });
  }
};

// --- GET OVERALL REPORT ---
export const getOverallReport = async (req, res) => {
  try {
    const [students] = await db.execute(
      "SELECT COUNT(*) as total FROM student"
    );
    const [faculty] = await db.execute("SELECT COUNT(*) as total FROM faculty");
    const [departments] = await db.execute(
      "SELECT COUNT(*) as total FROM department"
    );
    const [subjects] = await db.execute(
      "SELECT COUNT(*) as total FROM subjects"
    );

    const [studentsByDept] = await db.execute(`
      SELECT d.deptName AS department, COUNT(s.regNo) AS count
      FROM student s
      JOIN degree deg ON s.degree = deg.degid
      JOIN department d ON deg.department = d.deptid
      GROUP BY d.deptName
      ORDER BY d.deptName
    `);

    const [facultyByDept] = await db.execute(`
      SELECT d.deptName AS department, COUNT(f.facid) AS count
      FROM faculty f
      JOIN department d ON f.primaryDept = d.deptid
      GROUP BY d.deptName
      ORDER BY d.deptName
    `);

    const [deptPerformance] = await db.execute(`
      SELECT d.deptName AS department, AVG(m.mark) AS average
      FROM marks m
      JOIN student s ON m.studentRegno = s.regNo
      JOIN degree deg ON s.degree = deg.degid
      JOIN department d ON deg.department = d.deptid
      GROUP BY d.deptName
      ORDER BY d.deptName
    `);

    const [courseEnrollments] = await db.execute(`
      SELECT sub.subName AS course, COUNT(DISTINCT sa.batch) AS students
      FROM subassign sa
      JOIN subjects sub ON sa.subject = sub.subid
      GROUP BY sub.subName
      ORDER BY sub.subName
    `);

    res.json({
      totals: {
        students: students[0].total,
        faculty: faculty[0].total,
        departments: departments[0].total,
        courses: subjects[0].total,
      },
      studentsByDept,
      facultyByDept,
      deptPerformance,
      courses: courseEnrollments,
    });
  } catch (error) {
    console.error("Error fetching overall report:", error);
    res.status(500).json({ message: "Failed to fetch overall report." });
  }
};

export const getDetailedFacultyReport = async (req, res) => {
  const { id: facid } = req.params; // Expects facid from URL params
  if (!facid) {
    return res.status(400).json({ message: "Faculty ID is required." });
  }

  try {
    // 1. Fetch Faculty Details
    const [facultyRows] = await db.execute(`
      SELECT f.facid, f.facName, d.deptName
      FROM faculty f
      JOIN department d ON f.primaryDept = d.deptid
      WHERE f.facid = ?
    `, [facid]);

    if (facultyRows.length === 0) {
      return res.status(404).json({ message: "Faculty not found." });
    }
    const faculty = facultyRows[0];

    // 2. Fetch all subjects taught by this faculty, their batches, and aggregate data
    const [subjectsTaughtRaw] = await db.execute(`
      SELECT
          sa.assignid AS subid,    -- Use assignid as the unique identifier for this assignment
          s.subName,
          b.batchName,
          b.batchid,              -- Added: To be used in subsequent queries
          sa.faculty AS facid,
          (
              SELECT AVG(m.mark)
              FROM marks m
              JOIN subassign sa_inner ON m.subject = sa_inner.assignid
              WHERE sa_inner.assignid = sa.assignid AND sa_inner.batch = b.batchid AND sa_inner.faculty = sa.faculty
          ) AS avgMarks
      FROM subassign sa
      JOIN subjects s ON sa.subject = s.subid
      JOIN batch b ON sa.batch = b.batchid
      WHERE sa.faculty = ?
      ORDER BY s.subName, b.batchName;
    `, [facid]);

    const subjectsTaught = [];
    // Removed overallAverageRatingSum and overallAverageRatingCount

    for (const subject of subjectsTaughtRaw) {
      // 3. Fetch Student Performance for each subject taught by this faculty
      const [studentPerformanceRaw] = await db.execute(`
        SELECT
            std.regNo,
            std.sName,
            MAX(CASE WHEN m.tenure = 'assess1' THEN m.mark ELSE 0 END) AS assess1,
            MAX(CASE WHEN m.tenure = 'assess2' THEN m.mark ELSE 0 END) AS assess2,
            MAX(CASE WHEN m.tenure = 'endsem' THEN m.mark ELSE 0 END) AS endsem
        FROM marks m
        JOIN student std ON m.studentRegno = std.regNo
        JOIN subassign sa_link ON m.subject = sa_link.assignid AND sa_link.batch = std.batch AND sa_link.faculty = ?
        WHERE sa_link.assignid = ? AND sa_link.batch = ?
        GROUP BY std.regNo, std.sName
        ORDER BY std.sName;
      `, [facid, subject.subid, subject.batchid]);

      const studentPerformance = studentPerformanceRaw.map(student => {
        const total = student.assess1 + student.assess2 + student.endsem;
        const grade = assignGrade(total);
        return {
          regNo: student.regNo,
          sName: student.sName,
          assess1: student.assess1,
          assess2: student.assess2,
          endsem: student.endsem,
          total: total,
          grade: grade,
        };
      });

      // Calculate Grade Distribution for this subject
      const gradeDistributionMap = {};
      studentPerformance.forEach(sp => {
        gradeDistributionMap[sp.grade] = (gradeDistributionMap[sp.grade] || 0) + 1;
      });
      const gradeDistribution = Object.keys(gradeDistributionMap).map(grade => ({
        grade: grade,
        count: gradeDistributionMap[grade]
      })).sort((a, b) => a.grade.localeCompare(b.grade));

      subjectsTaught.push({
        subid: subject.subid,
        subName: subject.subName,
        batchName: subject.batchName,
        avgMarks: parseFloat(subject.avgMarks || 0),
        // Removed avgAttendance and avgRating
        studentPerformance: studentPerformance,
        gradeDistribution: gradeDistribution,
      });
    }

    // Removed Faculty Performance Trend (as it relied on evaluations)

    res.json({
      faculty: faculty,
      // Removed overallAverageRating
      subjectsTaught: subjectsTaught,
      // Removed performanceTrend
    });

  } catch (error) {
    console.error("Error fetching detailed faculty report:", error);
    res.status(500).json({ message: "Failed to fetch detailed faculty report." });
  }
};
