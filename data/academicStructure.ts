export const academicStructure = {
  "schools": {
    "physical_mathematical_sciences": {
      "name": "School of Physical & Mathematical Sciences",
      "departments": {
        "computer_science": {
          "name": "Department of Computer Science",
          "programs": {
            "single_major": {
              "name": "Computer Science (Single Major)",
              "description": "A comprehensive program covering all aspects of computer science including programming, algorithms, systems, and theory.",
              "years": [
                {
                  "level": 100,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "UGRC 150", "title": "Critical Thinking and Practical Reasoning", "credits": 3, "type": "Core"},
                        {"code": "MATH 121", "title": "Algebra and Trigonometry", "credits": 3, "type": "Core"},
                        {"code": "STAT 101", "title": "Introduction to Statistics", "credits": 3, "type": "Core"},
                        {"code": "CSCD 101", "title": "Introduction to Computer Science I", "credits": 3, "type": "Core", "description": "An introduction to computers and how they work, including number systems, logic gates, and basic machine organization."},
                        {"code": "PHYS 101", "title": "Practical Physics I", "credits": 1, "type": "Elective"},
                        {"code": "PHYS 143", "title": "Mechanics and Thermal Physics", "credits": 3, "type": "Elective"},
                        {"code": "PSYC 101", "title": "Elements of Psychology", "credits": 3, "type": "Elective"},
                        {"code": "MATH 123", "title": "Vectors and Geometry", "credits": 3, "type": "Elective"}
                      ],
                      "note": "Select 3-4 credits from the electives."
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "UGRC 110", "title": "Academic Writing I", "credits": 3, "type": "Core"},
                        {"code": "UGRC 131-136", "title": "Understanding Human Society", "credits": 3, "type": "Core"},
                        {"code": "MATH 122", "title": "Calculus I", "credits": 3, "type": "Core", "prerequisites": ["MATH 121"]},
                        {"code": "STAT 102", "title": "Elementary Probability", "credits": 3, "type": "Core"},
                        {"code": "CSCD 102", "title": "Introduction to Computer Science II", "credits": 3, "type": "Core", "prerequisites": ["CSCD 101"], "description": "Introduces fundamental programming concepts, algorithms, and flowcharts."}
                      ]
                    }
                  ]
                },
                {
                  "level": 200,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "UGRC 210", "title": "Academic Writing II", "credits": 3, "type": "Core"},
                        {"code": "CSCD 201", "title": "Information Systems", "credits": 3, "type": "Core", "description": "Differentiating IS from related disciplines; types of information systems (TPS, MIS, DSS, etc.)."},
                        {"code": "MATH 223", "title": "Calculus II", "credits": 3, "type": "Core", "prerequisites": ["MATH 122"]},
                        {"code": "CSCD 205", "title": "Programming I (with C++)", "credits": 3, "type": "Core", "description": "In-depth study of software design and implementation using C++."},
                        {"code": "CSCD 211", "title": "Computer Organization and Architecture", "credits": 3, "type": "Core", "description": "Topics include computer system specification, performance issues, and instruction set selection."},
                        {"code": "CSCD 207", "title": "Numerical Methods", "credits": 3, "type": "Core", "description": "Iterative methods for solving nonlinear equations and linear systems."}
                      ]
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "UGRC 220-238", "title": "Introduction to African Studies", "credits": 3, "type": "Core"},
                        {"code": "CSCD 202", "title": "Programming II (Java)", "credits": 3, "type": "Core", "prerequisites": ["CSCD 205"], "description": "Teaches object-oriented programming through Java."},
                        {"code": "CSCD 216", "title": "Data Structures & Algorithms", "credits": 3, "type": "Core", "description": "Analysis of algorithms and the effects of data structures on them."},
                        {"code": "CSCD 218", "title": "Data Communications & Networking I", "credits": 3, "type": "Core", "description": "Focuses on data communications and basic networking concepts."},
                        {"code": "CSCD 212", "title": "Computer Ethics", "credits": 1, "type": "Core", "description": "Legal, social, and ethical issues in software development and computer use."},
                        {"code": "CSCD 214", "title": "Digital Electronics", "credits": 2, "type": "Core", "description": "Exposes students to basic analogue and digital electronics as related to hardware."},
                        {"code": "MATH 224", "title": "Introductory Abstract Algebra", "credits": 3, "type": "Elective"},
                        {"code": "MATH 226", "title": "Introductory Computational Mathematics", "credits": 3, "type": "Elective"}
                      ],
                      "note": "Select 3 credits from the electives."
                    }
                  ]
                },
                {
                  "level": 300,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "CSCD 301", "title": "Object Oriented Analysis & Design", "credits": 3, "type": "Core"},
                        {"code": "MATH 355", "title": "Discrete Mathematics", "credits": 3, "type": "Core"},
                        {"code": "CSCD 311", "title": "Web Technologies & Development", "credits": 3, "type": "Core"},
                        {"code": "CSCD 313", "title": "Database Management Systems", "credits": 3, "type": "Core"},
                        {"code": "CSCD 315", "title": "Operating Systems", "credits": 3, "type": "Core"},
                        {"code": "CSCD 317", "title": "Embedded Systems", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 319", "title": "Computer Vision", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 321", "title": "Introduction to Computer Graphics", "credits": 3, "type": "Elective"}
                      ],
                      "note": "Select 3 credits from the electives."
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "CSCD 302", "title": "Programming III (VB.NET)", "credits": 3, "type": "Core"},
                        {"code": "CSCD 304", "title": "Design and Analysis of Algorithms", "credits": 3, "type": "Core"},
                        {"code": "CSCD 306", "title": "Software Engineering", "credits": 3, "type": "Core"},
                        {"code": "CSCD 312", "title": "Introduction to Artificial Intelligence", "credits": 3, "type": "Core"},
                        {"code": "CSCD 314", "title": "Research Methods in Computing", "credits": 3, "type": "Core"},
                        {"code": "CSCD 316", "title": "Introduction to Robotics", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 318", "title": "Introduction to Parallel Computing", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 322", "title": "Advanced Web Technologies", "credits": 3, "type": "Elective"}
                      ],
                      "note": "Select 3 credits from the electives."
                    }
                  ]
                },
                {
                  "level": 400,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "CSCD 415", "title": "Compilers", "credits": 3, "type": "Core"},
                        {"code": "CSCD 417", "title": "Theory and Survey of Programming Languages", "credits": 3, "type": "Core"},
                        {"code": "CSCD 419", "title": "Formal Methods and Models", "credits": 3, "type": "Core"},
                        {"code": "CSCD 421", "title": "Accounting Principles in Computing", "credits": 3, "type": "Core"},
                        {"code": "CSCD 400", "title": "Project", "credits": 3, "type": "Core"},
                        {"code": "CSCD 423", "title": "Software Modeling and Simulation", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 409", "title": "Data Mining & Warehousing", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 427", "title": "Data Communication & Networking II", "credits": 3, "type": "Elective"}
                      ],
                      "note": "Select 3 credits from the electives."
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "CSCD 416", "title": "System Programming", "credits": 3, "type": "Core"},
                        {"code": "CSCD 418", "title": "Computer Systems Security", "credits": 3, "type": "Core"},
                        {"code": "CSCD 422", "title": "Human Computer Interaction", "credits": 3, "type": "Core"},
                        {"code": "CSCD 424", "title": "Management Principles in Computing", "credits": 3, "type": "Core"},
                        {"code": "CSCD 400", "title": "Project", "credits": 3, "type": "Core"},
                        {"code": "CSCD 426", "title": "Multimedia Applications", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 428", "title": "Expert Systems", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 432", "title": "Concurrent & Distributed Systems", "credits": 3, "type": "Elective"},
                        {"code": "CSCD 434", "title": "Mobile Computing", "credits": 3, "type": "Elective"}
                      ],
                      "note": "Select 3 credits from the electives."
                    }
                  ]
                }
              ]
            },
            "major_minor": {
              "name": "Computer Science (Major/Minor)",
              "description": "A program combining Computer Science with another discipline as a minor.",
              "years": [
                // Similar structure as single_major but with reduced course load
                // Add the structure here following the same pattern
              ]
            }
          }
        },
        "information_technology": {
          "name": "Department of Information Technology",
          "programs": {
            "bsc_it": {
              "name": "Bachelor of Science in Information Technology",
              "description": "A comprehensive program covering information technology fundamentals, programming, networking, and specialized concentrations.",
              "concentrations": [
                "Network and Telecommunications",
                "Information Security",
                "Database Technology and Programming",
                "Web Development and Multimedia"
              ],
              "years": [
                {
                  "level": 100,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "CSIT 101", "title": "Introduction to Information Technology", "credits": 3, "type": "Core"},
                        {"code": "CSIT 103", "title": "Introduction to Computing", "credits": 3, "type": "Core"},
                        {"code": "CSIT 105", "title": "Programming Fundamentals", "credits": 3, "type": "Core"},
                        {"code": "CSIT 107", "title": "Statistics for IT Professionals", "credits": 3, "type": "Core"},
                        {"code": "UGRC 150", "title": "Critical Thinking & Practical Reasoning", "credits": 3, "type": "University Requirement"}
                      ]
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "CSIT 102", "title": "Introduction to IT Problem Solving", "credits": 3, "type": "Core"},
                        {"code": "CSIT 104", "title": "Mathematics for IT Professionals", "credits": 3, "type": "Core"},
                        {"code": "UGBS 104", "title": "Principles of Management", "credits": 3, "type": "Core"},
                        {"code": "UGRC 110", "title": "Academic Writing I", "credits": 3, "type": "University Requirement"},
                        {"code": "UGRC 131-136", "title": "Understanding Human Society", "credits": 3, "type": "University Requirement"}
                      ]
                    }
                  ]
                },
                {
                  "level": 200,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "UGRC 210", "title": "Academic Writing II", "credits": 3, "type": "University Requirement"},
                        {"code": "CSIT 201", "title": "Professional, Legal, Moral and Ethical Issues in IT", "credits": 3, "type": "Core"},
                        {"code": "CSIT 203", "title": "Computer Hardware Fundamentals", "credits": 3, "type": "Core"},
                        {"code": "CSIT 205", "title": "Object Oriented Techniques for IT Problem Solving", "credits": 3, "type": "Core"},
                        {"code": "CSIT 207", "title": "Database Fundamentals", "credits": 3, "type": "Core"},
                        {"code": "UGBS 201", "title": "Microeconomics and Business", "credits": 3, "type": "Core"}
                      ]
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "CSIT 202", "title": "Introduction to Computer and Networks", "credits": 3, "type": "Core"},
                        {"code": "CSIT 204", "title": "Introduction to Information Security", "credits": 3, "type": "Core"},
                        {"code": "UGRC 220-238", "title": "Introduction to African Studies", "credits": 3, "type": "University Requirement"},
                        {"code": "CSIT 206", "title": "Applied IT Programming", "credits": 3, "type": "Core"},
                        {"code": "CSIT 208", "title": "Multimedia and Web Design", "credits": 3, "type": "Core"},
                        {"code": "UGBS 204", "title": "Macroeconomics and Business", "credits": 3, "type": "Core"}
                      ]
                    }
                  ]
                },
                {
                  "level": 300,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {"code": "CSIT 301", "title": "Mobile Development", "credits": 3, "type": "Core"},
                        {"code": "CSIT 303", "title": "Human Computer Interaction", "credits": 3, "type": "Core"},
                        {"code": "CSIT 305", "title": "Operating Systems Fundamentals", "credits": 3, "type": "Core"},
                        {"code": "CSIT 321", "title": "Principles of Accounting", "credits": 3, "type": "Core"},
                        {
                          "code": "ELECTIVE",
                          "title": "Elective from Concentration",
                          "credits": 6,
                          "type": "Elective",
                          "options": [
                            {"code": "CSIT 307", "title": "Digital and Logic Systems Design", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 309", "title": "Data Network Security I", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 313", "title": "Programme Design and Data Structures", "credits": 3, "concentration": "Database Technology and Programming"},
                            {"code": "CSIT 315", "title": "Event-Driven Programming", "credits": 3, "concentration": "Database Technology and Programming"},
                            {"code": "CSIT 317", "title": "Web Development I", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 319", "title": "Web Site Administration", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 311", "title": "Information Security Principles", "credits": 3, "concentration": "Information Security"}
                          ]
                        }
                      ]
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "CSIT 302", "title": "Data Communications", "credits": 3, "type": "Core"},
                        {"code": "CSIT 304", "title": "IT in the Global Economy", "credits": 3, "type": "Core"},
                        {"code": "CSIT 306", "title": "IT Resources Planning", "credits": 3, "type": "Core"},
                        {"code": "CSIT 308", "title": "Turning Ideas into Successful Companies", "credits": 3, "type": "Core"},
                        {"code": "CSIT 310", "title": "Design Project I", "credits": 3, "type": "Core"},
                        {
                          "code": "ELECTIVE",
                          "title": "Elective from Concentration",
                          "credits": 3,
                          "type": "Elective",
                          "options": [
                            {"code": "CSIT 312", "title": "Network Servers and Infrastructures Administration", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 314", "title": "Database Management System Administration", "credits": 3, "concentration": "Database Technology and Programming"},
                            {"code": "CSIT 316", "title": "Web Development using Content Management Systems", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 416", "title": "Information Defense Technologies", "credits": 3, "concentration": "Information Security"}
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "level": 400,
                  "semesters": [
                    {
                      "semester": 1,
                      "courses": [
                        {
                          "code": "ELECTIVE",
                          "title": "Electives from Concentration (15 credits total - 12 from concentration, 3 from any other)",
                          "credits": 15,
                          "type": "Elective",
                          "options": [
                            // Web Development and Multimedia
                            {"code": "CSIT 401", "title": "Digital Media Editing", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 403", "title": "Graphics & Information Visualization", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 405", "title": "Web II: Advanced Web Development", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 407", "title": "Applied Knowledge Technologies for the Semantic Web", "credits": 3, "concentration": "Web Development and Multimedia"},
                            
                            // Network and Telecommunications
                            {"code": "CSIT 409", "title": "Cloud Computing", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 411", "title": "Advanced Networking Principles", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 413", "title": "Wireless Systems and Networks", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 415", "title": "Applications of Digital Technologies", "credits": 3, "concentration": "Network and Telecommunications"},
                            
                            // Database Technology and Programming
                            {"code": "CSIT 417", "title": "Information Storage and Management Technologies", "credits": 3, "concentration": "Database Technology and Programming"},
                            {"code": "CSIT 419", "title": "Advanced Database", "credits": 3, "concentration": "Database Technology and Programming"},
                            {"code": "CSIT 421", "title": "Information Retrieval and XML Data", "credits": 3, "concentration": "Database Technology and Programming"},
                            
                            // Information Security
                            {"code": "CSIT 425", "title": "Computer Crime, Forensics, and Auditing", "credits": 3, "concentration": "Information Security"},
                            {"code": "CSIT 431", "title": "Data Network Security II", "credits": 3, "concentration": "Information Security"}
                          ]
                        }
                      ]
                    },
                    {
                      "semester": 2,
                      "courses": [
                        {"code": "CSIT 402", "title": "Concepts of Multimedia Processing and Transmission", "credits": 3, "type": "Core"},
                        {"code": "CSIT 410", "title": "Design Project II", "credits": 3, "type": "Core"},
                        {
                          "code": "ELECTIVE",
                          "title": "Electives from Concentration (6 credits)",
                          "credits": 6,
                          "type": "Elective",
                          "options": [
                            // Network and Telecommunications
                            {"code": "CSIT 404", "title": "Voice Communications Technologies", "credits": 3, "concentration": "Network and Telecommunications"},
                            {"code": "CSIT 406", "title": "Fundamentals of Satellite Communications", "credits": 3, "concentration": "Network and Telecommunications"},
                            
                            // Web Development and Multimedia
                            {"code": "CSIT 408", "title": "Development - E-Business", "credits": 3, "concentration": "Web Development and Multimedia"},
                            {"code": "CSIT 412", "title": "Advanced Web Technologies - E-Commerce", "credits": 3, "concentration": "Web Development and Multimedia"},
                            
                            // Information Security
                            {"code": "CSIT 416", "title": "Information Defense Technologies", "credits": 3, "concentration": "Information Security"},
                            {"code": "CSIT 418", "title": "Database and Distributed System Security Principles", "credits": 3, "concentration": "Information Security"},
                            
                            // Database Technology and Programming
                            {"code": "CSIT 424", "title": "Parallel & Distributed Databases", "credits": 3, "concentration": "Database Technology and Programming"},
                            {"code": "CSIT 426", "title": "Data Mining & Data Warehousing", "credits": 3, "concentration": "Database Technology and Programming"}
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  }
};

export default academicStructure;
