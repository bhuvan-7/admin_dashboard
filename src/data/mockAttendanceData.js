const mockAttendanceData = [
  {
    class: "1st Standard",
    subjects: ["English", "Mathematics", "EVS", "Hindi", "Art"],
    students: [
      {
        id: "S101",
        name: "Aarav Sharma",
        attendance: {
          English: { total: 48, present: 45 },
          Mathematics: { total: 50, present: 47 },
          EVS: { total: 46, present: 44 },
          Hindi: { total: 47, present: 45 },
          Art: { total: 40, present: 39 },
        },
      },
      {
        id: "S102",
        name: "Diya Patel",
        attendance: {
          English: { total: 48, present: 46 },
          Mathematics: { total: 50, present: 49 },
          EVS: { total: 46, present: 45 },
          Hindi: { total: 47, present: 44 },
          Art: { total: 40, present: 38 },
        },
      },
      {
        id: "S103",
        name: "Kabir Mehta",
        attendance: {
          English: { total: 48, present: 44 },
          Mathematics: { total: 50, present: 45 },
          EVS: { total: 46, present: 42 },
          Hindi: { total: 47, present: 43 },
          Art: { total: 40, present: 36 },
        },
      },
      {
        id: "S104",
        name: "Myra Iyer",
        attendance: {
          English: { total: 48, present: 47 },
          Mathematics: { total: 50, present: 48 },
          EVS: { total: 46, present: 45 },
          Hindi: { total: 47, present: 46 },
          Art: { total: 40, present: 37 },
        },
      },
      {
        id: "S105",
        name: "Vivaan Gupta",
        attendance: {
          English: { total: 48, present: 42 },
          Mathematics: { total: 50, present: 44 },
          EVS: { total: 46, present: 41 },
          Hindi: { total: 47, present: 40 },
          Art: { total: 40, present: 35 },
        },
      },
    ],
  },
  {
    class: "2nd Standard",
    subjects: ["English", "Mathematics", "Science", "Hindi", "Computers"],
    students: [
      {
        id: "S201",
        name: "Aanya Desai",
        attendance: {
          English: { total: 52, present: 50 },
          Mathematics: { total: 54, present: 52 },
          Science: { total: 53, present: 50 },
          Hindi: { total: 52, present: 48 },
          Computers: { total: 38, present: 36 },
        },
      },
      {
        id: "S202",
        name: "Ishaan Reddy",
        attendance: {
          English: { total: 52, present: 49 },
          Mathematics: { total: 54, present: 50 },
          Science: { total: 53, present: 48 },
          Hindi: { total: 52, present: 46 },
          Computers: { total: 38, present: 34 },
        },
      },
      {
        id: "S203",
        name: "Meera Kulkarni",
        attendance: {
          English: { total: 52, present: 52 },
          Mathematics: { total: 54, present: 53 },
          Science: { total: 53, present: 51 },
          Hindi: { total: 52, present: 50 },
          Computers: { total: 38, present: 37 },
        },
      },
      {
        id: "S204",
        name: "Reyansh Malhotra",
        attendance: {
          English: { total: 52, present: 47 },
          Mathematics: { total: 54, present: 49 },
          Science: { total: 53, present: 47 },
          Hindi: { total: 52, present: 45 },
          Computers: { total: 38, present: 32 },
        },
      },
      {
        id: "S205",
        name: "Sara Verma",
        attendance: {
          English: { total: 52, present: 51 },
          Mathematics: { total: 54, present: 53 },
          Science: { total: 53, present: 52 },
          Hindi: { total: 52, present: 50 },
          Computers: { total: 38, present: 37 },
        },
      },
    ],
  },
  {
    class: "3rd Standard",
    subjects: ["English", "Mathematics", "Science", "Social Studies", "Computers"],
    students: [
      {
        id: "S301",
        name: "Advik Banerjee",
        attendance: {
          English: { total: 55, present: 50 },
          Mathematics: { total: 56, present: 52 },
          Science: { total: 55, present: 50 },
          "Social Studies": { total: 54, present: 49 },
          Computers: { total: 42, present: 38 },
        },
      },
      {
        id: "S302",
        name: "Kiara Nair",
        attendance: {
          English: { total: 55, present: 54 },
          Mathematics: { total: 56, present: 55 },
          Science: { total: 55, present: 53 },
          "Social Studies": { total: 54, present: 52 },
          Computers: { total: 42, present: 40 },
        },
      },
      {
        id: "S303",
        name: "Pranav Menon",
        attendance: {
          English: { total: 55, present: 51 },
          Mathematics: { total: 56, present: 50 },
          Science: { total: 55, present: 49 },
          "Social Studies": { total: 54, present: 48 },
          Computers: { total: 42, present: 35 },
        },
      },
      {
        id: "S304",
        name: "Riya Kapoor",
        attendance: {
          English: { total: 55, present: 53 },
          Mathematics: { total: 56, present: 54 },
          Science: { total: 55, present: 52 },
          "Social Studies": { total: 54, present: 51 },
          Computers: { total: 42, present: 39 },
        },
      },
      {
        id: "S305",
        name: "Yuvan Bose",
        attendance: {
          English: { total: 55, present: 47 },
          Mathematics: { total: 56, present: 48 },
          Science: { total: 55, present: 46 },
          "Social Studies": { total: 54, present: 45 },
          Computers: { total: 42, present: 33 },
        },
      },
    ],
  },
  {
    class: "4th Standard",
    subjects: ["English", "Mathematics", "Science", "Social Studies", "Computer Science"],
    students: [
      {
        id: "S401",
        name: "Anika Pillai",
        attendance: {
          English: { total: 58, present: 56 },
          Mathematics: { total: 60, present: 57 },
          Science: { total: 59, present: 55 },
          "Social Studies": { total: 58, present: 54 },
          "Computer Science": { total: 44, present: 41 },
        },
      },
      {
        id: "S402",
        name: "Dev Khanna",
        attendance: {
          English: { total: 58, present: 52 },
          Mathematics: { total: 60, present: 53 },
          Science: { total: 59, present: 50 },
          "Social Studies": { total: 58, present: 49 },
          "Computer Science": { total: 44, present: 38 },
        },
      },
      {
        id: "S403",
        name: "Mahi Bhatia",
        attendance: {
          English: { total: 58, present: 55 },
          Mathematics: { total: 60, present: 58 },
          Science: { total: 59, present: 56 },
          "Social Studies": { total: 58, present: 55 },
          "Computer Science": { total: 44, present: 42 },
        },
      },
      {
        id: "S404",
        name: "Rudra Joshi",
        attendance: {
          English: { total: 58, present: 50 },
          Mathematics: { total: 60, present: 51 },
          Science: { total: 59, present: 49 },
          "Social Studies": { total: 58, present: 48 },
          "Computer Science": { total: 44, present: 36 },
        },
      },
      {
        id: "S405",
        name: "Tara Saxena",
        attendance: {
          English: { total: 58, present: 57 },
          Mathematics: { total: 60, present: 59 },
          Science: { total: 59, present: 58 },
          "Social Studies": { total: 58, present: 57 },
          "Computer Science": { total: 44, present: 43 },
        },
      },
    ],
  },
  {
    class: "5th Standard",
    subjects: ["English", "Mathematics", "Science", "Social Studies", "Computer Science"],
    students: [
      {
        id: "S501",
        name: "Aarush Kaur",
        attendance: {
          English: { total: 60, present: 57 },
          Mathematics: { total: 62, present: 58 },
          Science: { total: 60, present: 56 },
          "Social Studies": { total: 59, present: 55 },
          "Computer Science": { total: 46, present: 43 },
        },
      },
      {
        id: "S502",
        name: "Charvi Sethi",
        attendance: {
          English: { total: 60, present: 59 },
          Mathematics: { total: 62, present: 61 },
          Science: { total: 60, present: 58 },
          "Social Studies": { total: 59, present: 57 },
          "Computer Science": { total: 46, present: 44 },
        },
      },
      {
        id: "S503",
        name: "Eshan Gokhale",
        attendance: {
          English: { total: 60, present: 53 },
          Mathematics: { total: 62, present: 55 },
          Science: { total: 60, present: 52 },
          "Social Studies": { total: 59, present: 51 },
          "Computer Science": { total: 46, present: 39 },
        },
      },
      {
        id: "S504",
        name: "Naira Qureshi",
        attendance: {
          English: { total: 60, present: 58 },
          Mathematics: { total: 62, present: 59 },
          Science: { total: 60, present: 57 },
          "Social Studies": { total: 59, present: 56 },
          "Computer Science": { total: 46, present: 42 },
        },
      },
      {
        id: "S505",
        name: "Veer Chawla",
        attendance: {
          English: { total: 60, present: 54 },
          Mathematics: { total: 62, present: 53 },
          Science: { total: 60, present: 51 },
          "Social Studies": { total: 59, present: 50 },
          "Computer Science": { total: 46, present: 37 },
        },
      },
    ],
  },
];

export default mockAttendanceData;


