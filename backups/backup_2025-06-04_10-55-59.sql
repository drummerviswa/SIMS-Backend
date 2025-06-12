/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: academicperiod
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `academicperiod` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `level` enum('Danger', 'Success', 'Primary', 'Warning') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: academics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `academics` (
  `acadid` int NOT NULL,
  `fileLink` int NOT NULL,
  `year` int NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: admin
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admin` (
  `aid` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `profile_pic` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `adminUsername` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: assesscomp
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `assesscomp` (
  `acid` int NOT NULL AUTO_INCREMENT,
  `l` int NOT NULL,
  `t` int NOT NULL,
  `p` int NOT NULL,
  `c` int NOT NULL,
  `assess1` varchar(200) NOT NULL,
  `assess2` varchar(200) NOT NULL,
  `endsem` varchar(200) NOT NULL,
  `cperiod` int NOT NULL,
  `type` enum('theory', 'lab', 'theoryCumLab', 'internal') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `regulation` int NOT NULL,
  `assignment` int NOT NULL,
  `written` int NOT NULL,
  PRIMARY KEY (`acid`),
  KEY `assessCompRegulation` (`regulation`),
  CONSTRAINT `assessCompRegulation` FOREIGN KEY (`regulation`) REFERENCES `regulations` (`rid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: assignmentsplitup
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `assignmentsplitup` (
  `asid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `criteria` int NOT NULL,
  `mainWeightage` float NOT NULL,
  `tenure` varchar(20) DEFAULT NULL,
  `writtenTest` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`asid`),
  KEY `criteria` (`criteria`),
  CONSTRAINT `assignmentsplitup_ibfk_1` FOREIGN KEY (`criteria`) REFERENCES `criteria` (`cid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: assignmentsubsplitup
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `assignmentsubsplitup` (
  `assignsubid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `mainsplitup` int NOT NULL,
  `subCriteria` varchar(255) NOT NULL,
  `subWeightage` decimal(5, 2) NOT NULL,
  PRIMARY KEY (`assignsubid`),
  KEY `assignmentsplitup` (`mainsplitup`),
  CONSTRAINT `assignmentsubsplitup_ibfk_1` FOREIGN KEY (`mainsplitup`) REFERENCES `assignmentsplitup` (`asid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: batch
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `batch` (
  `batchid` int NOT NULL AUTO_INCREMENT,
  `batchName` varchar(100) NOT NULL,
  `regulation` int NOT NULL,
  PRIMARY KEY (`batchid`),
  KEY `batchReg` (`regulation`),
  CONSTRAINT `batchReg` FOREIGN KEY (`regulation`) REFERENCES `regulations` (`rid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: branch
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `branch` (
  `bid` int NOT NULL AUTO_INCREMENT,
  `branchName` varchar(220) NOT NULL,
  `degree` int NOT NULL,
  `regulation` int NOT NULL,
  `subjects` json DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `branchDegree` (`degree`),
  KEY `branchReg` (`regulation`),
  CONSTRAINT `branchDegree` FOREIGN KEY (`degree`) REFERENCES `degree` (`degid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `branchReg` FOREIGN KEY (`regulation`) REFERENCES `regulations` (`rid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: criteria
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `criteria` (
  `cid` int NOT NULL AUTO_INCREMENT,
  `criteriaName` varchar(200) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: degree
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `degree` (
  `degid` int NOT NULL AUTO_INCREMENT,
  `degName` varchar(255) NOT NULL,
  `degSym` varchar(10) DEFAULT NULL,
  `department` int NOT NULL,
  `duration` int NOT NULL,
  `graduation` enum('UG', 'PG') NOT NULL,
  PRIMARY KEY (`degid`),
  KEY `degreeDepartment` (`department`),
  CONSTRAINT `degreeDepartment` FOREIGN KEY (`department`) REFERENCES `department` (`deptid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: department
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `department` (
  `deptid` int NOT NULL AUTO_INCREMENT,
  `deptName` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  PRIMARY KEY (`deptid`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: email_verification
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `email_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `verification_code` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: faculty
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `faculty` (
  `facid` int NOT NULL AUTO_INCREMENT,
  `facName` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `primaryDept` int NOT NULL,
  `designation` varchar(100) NOT NULL,
  PRIMARY KEY (`facid`),
  KEY `facultyDept` (`primaryDept`),
  CONSTRAINT `facultyDept` FOREIGN KEY (`primaryDept`) REFERENCES `department` (`deptid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: grievance
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `grievance` (
  `gid` int NOT NULL AUTO_INCREMENT,
  `gMessage` varchar(255) NOT NULL,
  `department` int DEFAULT NULL,
  `faculty` int DEFAULT NULL,
  `sender` enum('faculty', 'department') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `reciever` enum('department', 'admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`gid`),
  KEY `gDept` (`department`),
  KEY `gFac` (`faculty`),
  CONSTRAINT `gDept` FOREIGN KEY (`department`) REFERENCES `department` (`deptid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: mainsplitup
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `mainsplitup` (
  `msid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `criteria` int NOT NULL,
  `mainWeightage` int NOT NULL,
  `tenure` enum('assess1', 'assess2', 'assignment', 'lab') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `writtenTest` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`msid`),
  KEY `mainSplitFac` (`faculty`),
  KEY `mainSplitSub` (`subject`),
  KEY `mainCrit` (`criteria`),
  CONSTRAINT `mainCrit` FOREIGN KEY (`criteria`) REFERENCES `criteria` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mainSplitFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mainSplitSub` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: marks
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `marks` (
  `mid` int NOT NULL AUTO_INCREMENT,
  `studentRegno` int NOT NULL,
  `subject` int NOT NULL,
  `mainCriteria` int NOT NULL,
  `subCriteria` int NOT NULL,
  `mark` int NOT NULL,
  `tenure` varchar(200) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: regulations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `regulations` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `regName` varchar(250) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `regulation` (`regName`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student` (
  `regNo` int NOT NULL AUTO_INCREMENT,
  `sName` varchar(250) NOT NULL,
  `degree` int NOT NULL,
  `branch` int NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`regNo`),
  KEY `studentBatch` (`batch`),
  KEY `studentBranch` (`branch`),
  KEY `studentDegree` (`degree`),
  CONSTRAINT `studentBatch` FOREIGN KEY (`batch`) REFERENCES `batch` (`batchid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentBranch` FOREIGN KEY (`branch`) REFERENCES `branch` (`bid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentDegree` FOREIGN KEY (`degree`) REFERENCES `degree` (`degid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2023242004 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: subassign
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `subassign` (
  `assignid` int NOT NULL AUTO_INCREMENT,
  `subject` int NOT NULL,
  `faculty` int NOT NULL,
  `batch` int NOT NULL,
  `degree` int NOT NULL,
  `branch` int NOT NULL,
  `semester` int NOT NULL,
  PRIMARY KEY (`assignid`),
  KEY `assignFac` (`faculty`),
  KEY `assignSub` (`subject`),
  KEY `assignBatch` (`batch`),
  KEY `assignBranch` (`branch`),
  KEY `assignDegree` (`degree`),
  CONSTRAINT `assignBatch` FOREIGN KEY (`batch`) REFERENCES `batch` (`batchid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignBranch` FOREIGN KEY (`branch`) REFERENCES `branch` (`bid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignDegree` FOREIGN KEY (`degree`) REFERENCES `degree` (`degid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignSub` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: subject_department
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `subject_department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` int NOT NULL,
  `department` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject`),
  KEY `department` (`department`),
  CONSTRAINT `subject_department_ibfk_1` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE,
  CONSTRAINT `subject_department_ibfk_2` FOREIGN KEY (`department`) REFERENCES `department` (`deptid`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: subjects
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `subjects` (
  `subid` int NOT NULL AUTO_INCREMENT,
  `subName` varchar(250) NOT NULL,
  `subCode` varchar(250) NOT NULL,
  `component` int NOT NULL,
  PRIMARY KEY (`subid`),
  KEY `subComponent` (`component`),
  CONSTRAINT `subComponent` FOREIGN KEY (`component`) REFERENCES `assesscomp` (`acid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: subsplitup
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `subsplitup` (
  `subsplitid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `mainsplitup` int NOT NULL,
  `subCriteria` varchar(200) NOT NULL,
  `subWeightage` int NOT NULL,
  PRIMARY KEY (`subsplitid`),
  KEY `subSplitFac` (`faculty`),
  KEY `subSplitSub` (`subject`),
  KEY `subSplitMain` (`mainsplitup`),
  CONSTRAINT `subSplitFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subSplitMain` FOREIGN KEY (`mainsplitup`) REFERENCES `mainsplitup` (`msid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subSplitSub` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: academicperiod
# ------------------------------------------------------------

INSERT INTO
  `academicperiod` (
    `id`,
    `title`,
    `start`,
    `end`,
    `level`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'An General VIsit to all the departments',
    '2025-06-05',
    '2025-06-06',
    'Warning',
    '2025-06-03 03:16:47',
    '2025-06-03 03:16:47'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: academics
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: admin
# ------------------------------------------------------------

INSERT INTO
  `admin` (
    `aid`,
    `email`,
    `password`,
    `name`,
    `type`,
    `profile_pic`
  )
VALUES
  (
    1,
    'drummerviswa@gmail.com',
    '$2b$10$19OJjnwXq8gwie9JIHqh7eYk5EvtZzlAEPfYVqqRPQiS1TlLM8Aui',
    'Viswanathan P',
    0,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: assesscomp
# ------------------------------------------------------------

INSERT INTO
  `assesscomp` (
    `acid`,
    `l`,
    `t`,
    `p`,
    `c`,
    `assess1`,
    `assess2`,
    `endsem`,
    `cperiod`,
    `type`,
    `regulation`,
    `assignment`,
    `written`
  )
VALUES
  (1, 3, 0, 0, 3, '16', '16', '60', 45, 'theory', 2, 8, 50);
INSERT INTO
  `assesscomp` (
    `acid`,
    `l`,
    `t`,
    `p`,
    `c`,
    `assess1`,
    `assess2`,
    `endsem`,
    `cperiod`,
    `type`,
    `regulation`,
    `assignment`,
    `written`
  )
VALUES
  (2, 3, 0, 0, 3, '20', '20', '60', 45, 'theory', 1, 8, 12);
INSERT INTO
  `assesscomp` (
    `acid`,
    `l`,
    `t`,
    `p`,
    `c`,
    `assess1`,
    `assess2`,
    `endsem`,
    `cperiod`,
    `type`,
    `regulation`,
    `assignment`,
    `written`
  )
VALUES
  (
    3,
    3,
    0,
    2,
    5,
    '17.5',
    '17.5',
    '50',
    75,
    'theoryCumLab',
    1,
    7,
    11
  );
INSERT INTO
  `assesscomp` (
    `acid`,
    `l`,
    `t`,
    `p`,
    `c`,
    `assess1`,
    `assess2`,
    `endsem`,
    `cperiod`,
    `type`,
    `regulation`,
    `assignment`,
    `written`
  )
VALUES
  (4, 0, 0, 4, 2, '0', '60', '40', 60, 'lab', 1, 60, 0);
INSERT INTO
  `assesscomp` (
    `acid`,
    `l`,
    `t`,
    `p`,
    `c`,
    `assess1`,
    `assess2`,
    `endsem`,
    `cperiod`,
    `type`,
    `regulation`,
    `assignment`,
    `written`
  )
VALUES
  (5, 4, 0, 0, 4, '20', '20', '60', 60, 'theory', 1, 12, 8);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: assignmentsplitup
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: assignmentsubsplitup
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: batch
# ------------------------------------------------------------

INSERT INTO
  `batch` (`batchid`, `batchName`, `regulation`)
VALUES
  (1, '2022-2027', 1);
INSERT INTO
  `batch` (`batchid`, `batchName`, `regulation`)
VALUES
  (2, '2022-2026', 1);
INSERT INTO
  `batch` (`batchid`, `batchName`, `regulation`)
VALUES
  (3, '2023-2028', 2);
INSERT INTO
  `batch` (`batchid`, `batchName`, `regulation`)
VALUES
  (4, '2023-2027', 2);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: branch
# ------------------------------------------------------------

INSERT INTO
  `branch` (
    `bid`,
    `branchName`,
    `degree`,
    `regulation`,
    `subjects`
  )
VALUES
  (1, 'Computer Science', 1, 1, NULL);
INSERT INTO
  `branch` (
    `bid`,
    `branchName`,
    `degree`,
    `regulation`,
    `subjects`
  )
VALUES
  (2, 'Information Technology', 1, 1, NULL);
INSERT INTO
  `branch` (
    `bid`,
    `branchName`,
    `degree`,
    `regulation`,
    `subjects`
  )
VALUES
  (3, 'Computer Science', 1, 2, NULL);
INSERT INTO
  `branch` (
    `bid`,
    `branchName`,
    `degree`,
    `regulation`,
    `subjects`
  )
VALUES
  (4, 'Information Technology', 1, 2, NULL);
INSERT INTO
  `branch` (
    `bid`,
    `branchName`,
    `degree`,
    `regulation`,
    `subjects`
  )
VALUES
  (5, 'Computer Science and Engineering', 2, 1, NULL);
INSERT INTO
  `branch` (
    `bid`,
    `branchName`,
    `degree`,
    `regulation`,
    `subjects`
  )
VALUES
  (6, 'Information Technology', 3, 2, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: criteria
# ------------------------------------------------------------

INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (1, 'PPT');
INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (2, 'Quiz');
INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (3, 'Written Assignment');
INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (4, 'Seminar');
INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (5, 'Projects');
INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (6, 'Survey');
INSERT INTO
  `criteria` (`cid`, `criteriaName`)
VALUES
  (7, 'Assessment');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: degree
# ------------------------------------------------------------

INSERT INTO
  `degree` (
    `degid`,
    `degName`,
    `degSym`,
    `department`,
    `duration`,
    `graduation`
  )
VALUES
  (1, 'Master of Science Int', 'MSc Int', 1, 5, 'PG');
INSERT INTO
  `degree` (
    `degid`,
    `degName`,
    `degSym`,
    `department`,
    `duration`,
    `graduation`
  )
VALUES
  (2, 'Bachelor of Engineering', 'B.E', 2, 4, 'UG');
INSERT INTO
  `degree` (
    `degid`,
    `degName`,
    `degSym`,
    `department`,
    `duration`,
    `graduation`
  )
VALUES
  (3, 'Bachelor of Technology', 'B.Tech', 3, 4, 'UG');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: department
# ------------------------------------------------------------

INSERT INTO
  `department` (`deptid`, `deptName`, `username`, `password`)
VALUES
  (1, 'Mathematics', 'dom', 'Dom@123');
INSERT INTO
  `department` (`deptid`, `deptName`, `username`, `password`)
VALUES
  (2, 'Computer Science', 'cse', 'C@123');
INSERT INTO
  `department` (`deptid`, `deptName`, `username`, `password`)
VALUES
  (3, 'Information Technology', 'it', 'It@123');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: email_verification
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: faculty
# ------------------------------------------------------------

INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (
    1,
    'Donald Trump',
    'mcdonald',
    'McD@123',
    1,
    'Teaching Fellow'
  );
INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (
    2,
    'Joe Bidden',
    'bidden',
    'Joe@123',
    2,
    'Assistant Professor'
  );
INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (
    3,
    'James Camron',
    'jamesc',
    'Camera@0',
    3,
    'Professor'
  );
INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (4, 'Rahman', 'arr', 'ThalaivARR', 1, 'Professor');
INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (
    5,
    'Ilaiyaraja',
    'copyrightismyweapon',
    'Dishkol@123',
    1,
    'Assistant Professor'
  );
INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (
    6,
    'Yuvan Shankar Raja',
    'u1',
    'drugs@music',
    2,
    'Teaching Fellow'
  );
INSERT INTO
  `faculty` (
    `facid`,
    `facName`,
    `username`,
    `password`,
    `primaryDept`,
    `designation`
  )
VALUES
  (
    7,
    'Harris Jayaraj',
    'harrismaams',
    'Makaamishi@Left',
    3,
    'Associate Professor'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: grievance
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: mainsplitup
# ------------------------------------------------------------

INSERT INTO
  `mainsplitup` (
    `msid`,
    `faculty`,
    `subject`,
    `criteria`,
    `mainWeightage`,
    `tenure`,
    `writtenTest`
  )
VALUES
  (1, 1, 1, 7, 12, 'assess1', 1);
INSERT INTO
  `mainsplitup` (
    `msid`,
    `faculty`,
    `subject`,
    `criteria`,
    `mainWeightage`,
    `tenure`,
    `writtenTest`
  )
VALUES
  (2, 1, 1, 7, 12, 'assess2', 1);
INSERT INTO
  `mainsplitup` (
    `msid`,
    `faculty`,
    `subject`,
    `criteria`,
    `mainWeightage`,
    `tenure`,
    `writtenTest`
  )
VALUES
  (3, 1, 1, 1, 4, 'assess1', 0);
INSERT INTO
  `mainsplitup` (
    `msid`,
    `faculty`,
    `subject`,
    `criteria`,
    `mainWeightage`,
    `tenure`,
    `writtenTest`
  )
VALUES
  (4, 1, 1, 1, 4, 'assess2', 0);
INSERT INTO
  `mainsplitup` (
    `msid`,
    `faculty`,
    `subject`,
    `criteria`,
    `mainWeightage`,
    `tenure`,
    `writtenTest`
  )
VALUES
  (5, 1, 1, 3, 4, 'assess1', 0);
INSERT INTO
  `mainsplitup` (
    `msid`,
    `faculty`,
    `subject`,
    `criteria`,
    `mainWeightage`,
    `tenure`,
    `writtenTest`
  )
VALUES
  (6, 1, 1, 5, 4, 'assess2', 0);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: marks
# ------------------------------------------------------------

INSERT INTO
  `marks` (
    `mid`,
    `studentRegno`,
    `subject`,
    `mainCriteria`,
    `subCriteria`,
    `mark`,
    `tenure`
  )
VALUES
  (1, 2022242001, 1, 7, 1, 8, 'assess1');
INSERT INTO
  `marks` (
    `mid`,
    `studentRegno`,
    `subject`,
    `mainCriteria`,
    `subCriteria`,
    `mark`,
    `tenure`
  )
VALUES
  (2, 2022242002, 1, 7, 1, 9, 'assess1');
INSERT INTO
  `marks` (
    `mid`,
    `studentRegno`,
    `subject`,
    `mainCriteria`,
    `subCriteria`,
    `mark`,
    `tenure`
  )
VALUES
  (3, 2022242003, 1, 7, 1, 9, 'assess1');
INSERT INTO
  `marks` (
    `mid`,
    `studentRegno`,
    `subject`,
    `mainCriteria`,
    `subCriteria`,
    `mark`,
    `tenure`
  )
VALUES
  (4, 2022242004, 1, 7, 1, 9, 'assess1');
INSERT INTO
  `marks` (
    `mid`,
    `studentRegno`,
    `subject`,
    `mainCriteria`,
    `subCriteria`,
    `mark`,
    `tenure`
  )
VALUES
  (5, 2022242005, 1, 7, 1, 11, 'assess1');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: regulations
# ------------------------------------------------------------

INSERT INTO
  `regulations` (`rid`, `regName`, `start`, `end`)
VALUES
  (1, 'R2019', '2019-01-01', '2023-01-01');
INSERT INTO
  `regulations` (`rid`, `regName`, `start`, `end`)
VALUES
  (2, 'R2023', '2023-01-01', '2027-01-01');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student
# ------------------------------------------------------------

INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022207002, 'Irfan', 2, 5, 2);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022239001, 'Rajinikanth', 1, 1, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022239002, 'KamalHasan', 1, 1, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022239003, 'Vijay', 1, 1, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022239004, 'AjithKumar', 1, 1, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022239005, 'Silambarasan', 1, 1, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022242001, 'Manirathnam', 1, 2, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022242002, 'Shankar', 1, 2, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022242003, 'Ranjith', 1, 2, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022242004, 'Vetrimaran', 1, 2, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2022242005, 'Gautham', 1, 2, 1);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2023207001, 'MadanGowri', 2, 5, 2);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2023242001, 'Abdul Kaliq', 1, 4, 3);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2023242002, 'Kabilan', 1, 3, 3);
INSERT INTO
  `student` (`regNo`, `sName`, `degree`, `branch`, `batch`)
VALUES
  (2023242003, 'Siddharth Abhimanyu', 1, 3, 3);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: subassign
# ------------------------------------------------------------

INSERT INTO
  `subassign` (
    `assignid`,
    `subject`,
    `faculty`,
    `batch`,
    `degree`,
    `branch`,
    `semester`
  )
VALUES
  (1, 1, 1, 1, 1, 2, 5);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: subject_department
# ------------------------------------------------------------

INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (1, 1, 1);
INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (2, 4, 1);
INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (3, 2, 1);
INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (4, 3, 1);
INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (5, 5, 1);
INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (6, 1, 2);
INSERT INTO
  `subject_department` (`id`, `subject`, `department`)
VALUES
  (7, 5, 3);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: subjects
# ------------------------------------------------------------

INSERT INTO
  `subjects` (`subid`, `subName`, `subCode`, `component`)
VALUES
  (1, 'Software Engineering', 'XC5551', 2);
INSERT INTO
  `subjects` (`subid`, `subName`, `subCode`, `component`)
VALUES
  (2, 'Python Laboratory', 'XC5362', 4);
INSERT INTO
  `subjects` (`subid`, `subName`, `subCode`, `component`)
VALUES
  (3, 'Operations Research', 'MA5651', 5);
INSERT INTO
  `subjects` (`subid`, `subName`, `subCode`, `component`)
VALUES
  (4, 'Signals and Systems', 'XC5354', 2);
INSERT INTO
  `subjects` (`subid`, `subName`, `subCode`, `component`)
VALUES
  (5, 'Database Management System', 'XC5452', 5);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: subsplitup
# ------------------------------------------------------------

INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (1, 1, 1, 1, 'Assessment', 12);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (2, 1, 1, 2, 'Assessment', 12);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (3, 1, 1, 3, 'Slides', 2);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (4, 1, 1, 3, 'Presentation', 2);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (5, 1, 1, 4, 'Slides', 2);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (6, 1, 1, 4, 'Presentation', 2);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (7, 1, 1, 5, 'All', 4);
INSERT INTO
  `subsplitup` (
    `subsplitid`,
    `faculty`,
    `subject`,
    `mainsplitup`,
    `subCriteria`,
    `subWeightage`
  )
VALUES
  (8, 1, 1, 6, 'All', 4);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
