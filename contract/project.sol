// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClassAttendanceTracker {
    // Struct to store attendance details
    struct Attendance {
        uint256 timestamp;
        string studentName;
        bool isPresent;
    }

    // Mapping to store attendance records for each student
    mapping(address => Attendance[]) public attendanceRecords;

    // Event to log attendance
    event AttendanceMarked(address indexed student, uint256 timestamp, bool isPresent);

    // Function to mark attendance
    function markAttendance(string memory studentName, bool isPresent) public {
        attendanceRecords[msg.sender].push(Attendance({
            timestamp: block.timestamp,
            studentName: studentName,
            isPresent: isPresent
        }));

        emit AttendanceMarked(msg.sender, block.timestamp, isPresent);
    }

    // Function to get attendance records for a student
    function getAttendanceRecords(address student) public view returns (Attendance[] memory) {
        return attendanceRecords[student];
    }
}
