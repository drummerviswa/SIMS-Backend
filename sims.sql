SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


DROP TABLE IF EXISTS `academicperiod`;
CREATE TABLE IF NOT EXISTS `academicperiod` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `level` enum('Danger','Success','Primary','Warning') NOT NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `academics`;
CREATE TABLE IF NOT EXISTS `academics` (
  `acadid` int NOT NULL,
  `fileLink` int NOT NULL,
  `year` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `aid` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) CHARACTER SET utf8mb4 NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `profile_pic` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `adminUsername` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `assesscomp`;
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
  `type` enum('theory','lab','theoryCumLab','internal') CHARACTER SET utf8mb4  NOT NULL,
  `regulation` int NOT NULL,
  `assignment` int NOT NULL,
  `written` int NOT NULL,
  PRIMARY KEY (`acid`),
  KEY `assessCompRegulation` (`regulation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `assignmentsplitup`;
CREATE TABLE IF NOT EXISTS `assignmentsplitup` (
  `asid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `criteria` int NOT NULL,
  `mainWeightage` float NOT NULL,
  `tenure` varchar(20) DEFAULT NULL,
  `writtenTest` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`asid`),
  KEY `criteria` (`criteria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `assignmentsubsplitup`;
CREATE TABLE IF NOT EXISTS `assignmentsubsplitup` (
  `assignsubid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `mainsplitup` int NOT NULL,
  `subCriteria` varchar(200) NOT NULL,
  `subWeightage` decimal(5,2) NOT NULL,
  PRIMARY KEY (`assignsubid`),
  KEY `assignmentsplitup` (`mainsplitup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `batch`;
CREATE TABLE IF NOT EXISTS `batch` (
  `batchid` int NOT NULL AUTO_INCREMENT,
  `batchName` varchar(100) NOT NULL,
  `regulation` int NOT NULL,
  PRIMARY KEY (`batchid`),
  KEY `batchReg` (`regulation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `branch`;
CREATE TABLE IF NOT EXISTS `branch` (
  `bid` int NOT NULL AUTO_INCREMENT,
  `branchName` varchar(220) NOT NULL,
  `degree` int NOT NULL,
  `regulation` int NOT NULL,
  `subjects` json DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `branchDegree` (`degree`),
  KEY `branchReg` (`regulation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `criteria`;
CREATE TABLE IF NOT EXISTS `criteria` (
  `cid` int NOT NULL AUTO_INCREMENT,
  `criteriaName` varchar(200) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `degree`;
CREATE TABLE IF NOT EXISTS `degree` (
  `degid` int NOT NULL AUTO_INCREMENT,
  `degName` varchar(200) NOT NULL,
  `degSym` varchar(10) DEFAULT NULL,
  `department` int NOT NULL,
  `duration` int NOT NULL,
  `graduation` enum('UG','PG') NOT NULL,
  PRIMARY KEY (`degid`),
  KEY `degreeDepartment` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `department`;
CREATE TABLE IF NOT EXISTS `department` (
  `deptid` int NOT NULL AUTO_INCREMENT,
  `deptName` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  PRIMARY KEY (`deptid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `email_verification`;
CREATE TABLE IF NOT EXISTS `email_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `verification_code` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE IF NOT EXISTS `faculty` (
  `facid` int NOT NULL AUTO_INCREMENT,
  `facName` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `primaryDept` int NOT NULL,
  `designation` varchar(100) NOT NULL,
  PRIMARY KEY (`facid`),
  KEY `facultyDept` (`primaryDept`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `grievance`;
CREATE TABLE IF NOT EXISTS `grievance` (
  `gid` int NOT NULL AUTO_INCREMENT,
  `gMessage` varchar(200) NOT NULL,
  `department` int DEFAULT NULL,
  `faculty` int DEFAULT NULL,
  `sender` enum('faculty','department') CHARACTER SET utf8mb4  NOT NULL,
  `reciever` enum('department','admin') CHARACTER SET utf8mb4  NOT NULL,
  PRIMARY KEY (`gid`),
  KEY `gDept` (`department`),
  KEY `gFac` (`faculty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `mainsplitup`;
CREATE TABLE IF NOT EXISTS `mainsplitup` (
  `msid` int NOT NULL AUTO_INCREMENT,
  `faculty` int NOT NULL,
  `subject` int NOT NULL,
  `criteria` int NOT NULL,
  `mainWeightage` int NOT NULL,
  `tenure` enum('assess1','assess2','assignment','lab') CHARACTER SET utf8mb4  NOT NULL,
  `writtenTest` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`msid`),
  KEY `mainSplitFac` (`faculty`),
  KEY `mainSplitSub` (`subject`),
  KEY `mainCrit` (`criteria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `marks`;
CREATE TABLE IF NOT EXISTS `marks` (
  `mid` int NOT NULL AUTO_INCREMENT,
  `studentRegno` int NOT NULL,
  `subject` int NOT NULL,
  `mainCriteria` int NOT NULL,
  `subCriteria` int NOT NULL,
  `mark` int NOT NULL,
  `tenure` varchar(200) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `regulations`;
CREATE TABLE IF NOT EXISTS `regulations` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `regName` varchar(250) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `regulation` (`regName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `regNo` int NOT NULL AUTO_INCREMENT,
  `sName` varchar(250) NOT NULL,
  `degree` int NOT NULL,
  `branch` int NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`regNo`),
  KEY `studentBatch` (`batch`),
  KEY `studentBranch` (`branch`),
  KEY `studentDegree` (`degree`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `subassign`;
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
  KEY `assignDegree` (`degree`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `subid` int NOT NULL AUTO_INCREMENT,
  `subName` varchar(250) NOT NULL,
  `subCode` varchar(250) NOT NULL,
  `component` int NOT NULL,
  PRIMARY KEY (`subid`),
  KEY `subComponent` (`component`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `subject_department`;
CREATE TABLE IF NOT EXISTS `subject_department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` int NOT NULL,
  `department` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject`),
  KEY `department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `subsplitup`;
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
  KEY `subSplitMain` (`mainsplitup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `assesscomp`
  ADD CONSTRAINT `assessCompRegulation` FOREIGN KEY (`regulation`) REFERENCES `regulations` (`rid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `assignmentsplitup`
  ADD CONSTRAINT `assignmentsplitup_ibfk_1` FOREIGN KEY (`criteria`) REFERENCES `criteria` (`cid`);

ALTER TABLE `assignmentsubsplitup`
  ADD CONSTRAINT `assignmentsubsplitup_ibfk_1` FOREIGN KEY (`mainsplitup`) REFERENCES `assignmentsplitup` (`asid`);

ALTER TABLE `batch`
  ADD CONSTRAINT `batchReg` FOREIGN KEY (`regulation`) REFERENCES `regulations` (`rid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `branch`
  ADD CONSTRAINT `branchDegree` FOREIGN KEY (`degree`) REFERENCES `degree` (`degid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `branchReg` FOREIGN KEY (`regulation`) REFERENCES `regulations` (`rid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `degree`
  ADD CONSTRAINT `degreeDepartment` FOREIGN KEY (`department`) REFERENCES `department` (`deptid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `faculty`
  ADD CONSTRAINT `facultyDept` FOREIGN KEY (`primaryDept`) REFERENCES `department` (`deptid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `grievance`
  ADD CONSTRAINT `gDept` FOREIGN KEY (`department`) REFERENCES `department` (`deptid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `gFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mainsplitup`
  ADD CONSTRAINT `mainCrit` FOREIGN KEY (`criteria`) REFERENCES `criteria` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mainSplitFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mainSplitSub` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `student`
  ADD CONSTRAINT `studentBatch` FOREIGN KEY (`batch`) REFERENCES `batch` (`batchid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentBranch` FOREIGN KEY (`branch`) REFERENCES `branch` (`bid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentDegree` FOREIGN KEY (`degree`) REFERENCES `degree` (`degid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `subassign`
  ADD CONSTRAINT `assignBatch` FOREIGN KEY (`batch`) REFERENCES `batch` (`batchid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignBranch` FOREIGN KEY (`branch`) REFERENCES `branch` (`bid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignDegree` FOREIGN KEY (`degree`) REFERENCES `degree` (`degid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignSub` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `subjects`
  ADD CONSTRAINT `subComponent` FOREIGN KEY (`component`) REFERENCES `assesscomp` (`acid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `subject_department`
  ADD CONSTRAINT `subject_department_ibfk_1` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE,
  ADD CONSTRAINT `subject_department_ibfk_2` FOREIGN KEY (`department`) REFERENCES `department` (`deptid`) ON DELETE CASCADE;

ALTER TABLE `subsplitup`
  ADD CONSTRAINT `subSplitFac` FOREIGN KEY (`faculty`) REFERENCES `faculty` (`facid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subSplitMain` FOREIGN KEY (`mainsplitup`) REFERENCES `mainsplitup` (`msid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subSplitSub` FOREIGN KEY (`subject`) REFERENCES `subjects` (`subid`) ON DELETE CASCADE ON UPDATE CASCADE;
