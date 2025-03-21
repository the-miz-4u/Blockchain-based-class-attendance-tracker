const Web3 = require('web3');

// Define the smart contract ABI and address (update the address after deployment)
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isPresent",
				"type": "bool"
			}
		],
		"name": "AttendanceMarked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "attendanceRecords",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isPresent",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "student",
				"type": "address"
			}
		],
		"name": "getAttendanceRecords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "studentName",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isPresent",
						"type": "bool"
					}
				],
				"internalType": "struct ClassAttendanceTracker.Attendance[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isPresent",
				"type": "bool"
			}
		],
		"name": "markAttendance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const contractAddress = "0xde2fd883f10b2d5238cdd168629ac4a3ccf6bf99"; // Replace with your contract's address

// Initialize web3
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function markAttendance() {
    const studentName = document.getElementById('studentName').value;
    const isPresent = document.getElementById('attendanceStatus').value === "true";

    if (!studentName) {
        alert("Please enter your name.");
        return;
    }

    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    try {
        await contract.methods.markAttendance(studentName, isPresent).send({ from: account });
        alert("Attendance marked successfully!");
        fetchAttendance();
    } catch (error) {
        console.error("Error marking attendance:", error);
    }
}

async function fetchAttendance() {
    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    const records = await contract.methods.getAttendanceRecords(account).call();
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    records.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.studentName} - ${new Date(record.timestamp * 1000).toLocaleString()}`;
        li.classList.add(record.isPresent ? 'present' : 'absent');
        attendanceList.appendChild(li);
    });
}

// Fetch the attendance records on page load
window.onload = fetchAttendance;
