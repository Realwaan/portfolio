export interface CourseNode {
  code: string;
  name: string;
  lec: number;
  lab: number;
  lecUnits: number;
  labUnits: number;
  units: number;
  prerequisites: string[];
  coRequisites: string[];
  year: number; // 1-4
  semester: number; // 1: 1st sem, 2: 2nd sem, 3: Summer
  description: string;
  stream: 'computing' | 'programming' | 'math-theory' | 'systems-networks' | 'ge' | 'elective' | 'others';
}

export interface ElectiveItem {
  code: string;
  name: string;
  track?: string;
}

export interface ElectiveGroup {
  id: string;
  title: string;
  options: ElectiveItem[];
}

export const bscsCurriculum: CourseNode[] = [
  // ====================================================
  // FIRST YEAR, FIRST SEMESTER
  // ====================================================
  {
    code: "CSIT 111",
    name: "Introduction to Computing",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Overview of computing history, hardware architectures, operating system concepts, software paradigms, network protocols, and ethical foundations in information technology.",
    stream: "computing"
  },
  {
    code: "CSIT 121",
    name: "Fundamentals of Programming",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Foundational concepts of programming logic using structured languages, covering variables, basic operators, control structures (branches, loops), arrays, and functions.",
    stream: "programming"
  },
  {
    code: "ENGL 031",
    name: "Purposive Communication",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Developing communicative competence, critical thinking, and research skills through writing, reading, and public speaking in professional contexts.",
    stream: "ge"
  },
  {
    code: "MATH 031",
    name: "Mathematics in the Modern World",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Exploring mathematical patterns, statistical systems, data representations, geometry, codes, reasoning, and practical applications in modern life.",
    stream: "math-theory"
  },
  {
    code: "NSTP 111",
    name: "National Service Training Program 1",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Instilling citizenship, service-oriented leadership, community development, and civic consciousness under the National Service Training Program.",
    stream: "others"
  },
  {
    code: "PE 103",
    name: "Movement Enhancement / PATHFit 1",
    lec: 2.0, lab: 0.0, lecUnits: 2.0, labUnits: 0.0, units: 2.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Basic physical education covering posture development, core strength, body coordinates, flexibility, and physical health assessments.",
    stream: "others"
  },
  {
    code: "PHILO 031",
    name: "Ethics",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Critical study of moral philosophies, ethical decisions, value systems, and the codes of professional conduct in computing disciplines.",
    stream: "ge"
  },
  {
    code: "PSYCH 031",
    name: "Understanding the Self",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 1,
    description: "Reflective course in psychology covering personal development, identity, self-discovery, mental hygiene, and emotional intelligence.",
    stream: "ge"
  },

  // ====================================================
  // FIRST YEAR, SECOND SEMESTER
  // ====================================================
  {
    code: "CS 132",
    name: "Introduction to Computer Systems",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 111"], coRequisites: [],
    year: 1, semester: 2,
    description: "Study of low-level computer systems: register structures, CPU operations, machine instruction sets, assembly syntax, and the memory hierarchy.",
    stream: "systems-networks"
  },
  {
    code: "CSIT 112",
    name: "Discrete Structures 1",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 2,
    description: "Mathematical structures for computing: propositions, predicate logic, boolean algebras, sets, functions, matrix forms, relations, and proof methodologies.",
    stream: "math-theory"
  },
  {
    code: "CSIT 122",
    name: "Intermediate Programming",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 121"], coRequisites: [],
    year: 1, semester: 2,
    description: "Continuation of programming covering intermediate concepts: structure tags, dynamic arrays, pointer addresses, file I/O operations, and code debugging.",
    stream: "programming"
  },
  {
    code: "CSIT 201",
    name: "Platform-based Development 2 (Web)",
    lec: 0.0, lab: 3.0, lecUnits: 0.0, labUnits: 1.0, units: 1.0,
    prerequisites: ["CSIT 121"], coRequisites: [],
    year: 1, semester: 2,
    description: "Fundamentals of frontend web engineering: HTML structures, CSS layout grids (Flexbox/Grid), responsive views, document objects (DOM), and state scripts.",
    stream: "programming"
  },
  {
    code: "HUM 031",
    name: "Art Appreciation",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 2,
    description: "Introduction to humanities, visual arts, design aesthetics, music appreciation, and cultural analysis of artistic expressions.",
    stream: "ge"
  },
  {
    code: "MATH 136",
    name: "Differential and Integral Calculus",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 2,
    description: "Introduction to calculus covering functional limits, derivatives, rates of change, optimization, anti-derivatives, and integral modeling.",
    stream: "math-theory"
  },
  {
    code: "NSTP 112",
    name: "National Service Training Program 2",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["NSTP 111"], coRequisites: [],
    year: 1, semester: 2,
    description: "Community immersion, service projects, disaster readiness, and practical civic engagement under the National Service Training Program.",
    stream: "others"
  },
  {
    code: "PE 104",
    name: "PATHFit 2-Exercise-based Fitness Activities",
    lec: 2.0, lab: 0.0, lecUnits: 2.0, labUnits: 0.0, units: 2.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 2,
    description: "Aerobic exercises, cardiovascular workouts, muscle toning, and health-based fitness training routines.",
    stream: "others"
  },
  {
    code: "SOCSCI 031",
    name: "Readings in Philippine History",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 1, semester: 2,
    description: "Analysis of primary sources in Philippine history, social struggles, political institutions, and national heritage.",
    stream: "ge"
  },

  // ====================================================
  // SECOND YEAR, FIRST SEMESTER
  // ====================================================
  {
    code: "CS 231",
    name: "Discrete Structures 2",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 112"], coRequisites: [],
    year: 2, semester: 1,
    description: "Continuation of discrete structures: combinatorics, permutations, recurrence relations, graph trees, path navigation algorithms, and finite state machines.",
    stream: "math-theory"
  },
  {
    code: "CS 243",
    name: "Computer Organization and Architecture",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 132", "CSIT 122"], coRequisites: [],
    year: 2, semester: 1,
    description: "In-depth study of computer architectures: micro-operations, control units, cache design, pipelined execution, and input/output interfaces.",
    stream: "systems-networks"
  },
  {
    code: "CSIT 104",
    name: "Platform-based Development 1 (Multimedia)",
    lec: 0.0, lab: 3.0, lecUnits: 0.0, labUnits: 1.0, units: 1.0,
    prerequisites: [], coRequisites: [],
    year: 2, semester: 1,
    description: "Digital media systems: color theories, raster and vector graphics, audio compression, video structures, and multimedia project composition.",
    stream: "programming"
  },
  {
    code: "CSIT 213",
    name: "Social Issues and Professional Practice",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 111"], coRequisites: [],
    year: 2, semester: 1,
    description: "Social and professional issues in computing: copyright laws, digital privacy, computer crimes, intellectual property, and professional codes.",
    stream: "ge"
  },
  {
    code: "CSIT 221",
    name: "Data Structures and Algorithms",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 122"], coRequisites: [],
    year: 2, semester: 1,
    description: "Design and analysis of linear and non-linear data structures: lists, stacks, queues, binary trees, heaps, hashes, graphs, sorting, and searching.",
    stream: "programming"
  },
  {
    code: "CSIT 227",
    name: "Object-oriented Programming 1",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 122"], coRequisites: [],
    year: 2, semester: 1,
    description: "Introduction to Object-Oriented Programming (OOP) paradigms using modern typing systems: class forms, objects, encapsulation, and inheritance patterns.",
    stream: "programming"
  },
  {
    code: "GE-CCSF1",
    name: "General Education Elective 1",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 2, semester: 1,
    description: "General Education Elective focusing on Environmental Science or Sustainable Development Goals.",
    stream: "ge"
  },
  {
    code: "PE 205",
    name: "PATHFIT 3-Menu of Sports/Outdoor/Dance",
    lec: 2.0, lab: 0.0, lecUnits: 2.0, labUnits: 0.0, units: 2.0,
    prerequisites: ["PE 103"], coRequisites: [],
    year: 2, semester: 1,
    description: "Development of athletic coordinates, rules, and strategies in group sports, athletics, or outdoor recreation activities.",
    stream: "others"
  },

  // ====================================================
  // SECOND YEAR, SECOND SEMESTER
  // ====================================================
  {
    code: "CS 234",
    name: "Special Topics in Mathematics",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["MATH 136", "CS 231"], coRequisites: [],
    year: 2, semester: 2,
    description: "Mathematical methods for computer science: probability distributions, regression formulas, numeric analysis, matrices, and linear algebras.",
    stream: "math-theory"
  },
  {
    code: "CS 244",
    name: "Design and Analysis of Algorithms",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 221", "CS 231"], coRequisites: [],
    year: 2, semester: 2,
    description: "Advanced study of algorithm designs: asymptotic notations, divide-and-conquer, greedy heuristics, dynamic programming, and complexity theories.",
    stream: "math-theory"
  },
  {
    code: "CSIT 226",
    name: "Information Management 1",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 221"], coRequisites: [],
    year: 2, semester: 2,
    description: "Introduction to relational database management systems: schema normalization, relational algebra, SQL querying, constraints, and data transactions.",
    stream: "programming"
  },
  {
    code: "CSIT 228",
    name: "Object-oriented Programming 2",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 227"], coRequisites: [],
    year: 2, semester: 2,
    description: "Advanced object-oriented programming: interfaces, abstract patterns, polymorphic bindings, error handlers, and generic class typings.",
    stream: "programming"
  },
  {
    code: "CSIT 238",
    name: "Human Computer Interaction",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 104"], coRequisites: [],
    year: 2, semester: 2,
    description: "Principles of Human-Computer Interaction: UI wireframing, UX heuristics, user testing, responsive layouts, accessibility, and user-centric flows.",
    stream: "programming"
  },
  {
    code: "CSIT 284",
    name: "Platform-based Development 3 (Mobile)",
    lec: 0.0, lab: 3.0, lecUnits: 0.0, labUnits: 1.0, units: 1.0,
    prerequisites: ["CSIT 227"], coRequisites: [],
    year: 2, semester: 2,
    description: "Cross-platform mobile application development: layout containers, view rendering, navigation states, device services, and mobile APIs.",
    stream: "programming"
  },
  {
    code: "PE 206",
    name: "PATHFIT 4-Sports/Dance/Recreation",
    lec: 2.0, lab: 0.0, lecUnits: 2.0, labUnits: 0.0, units: 2.0,
    prerequisites: ["PE 103"], coRequisites: [],
    year: 2, semester: 2,
    description: "Continuation of active sports, recreational training, or self-defense programs under PathFit curriculum standards.",
    stream: "others"
  },
  {
    code: "STS 031",
    name: "Science, Technology and Society",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 2, semester: 2,
    description: "Analyzing interactions between scientific progress, technological innovations, and societal structures over historical cycles.",
    stream: "ge"
  },

  // ====================================================
  // THIRD YEAR, FIRST SEMESTER
  // ====================================================
  {
    code: "CS 313",
    name: "Automata Theory and Formal Languages",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CS 244"], coRequisites: [],
    year: 3, semester: 1,
    description: "Automata theory: regular grammars, finite state machines, context-free languages, pushdown automata, Turing machines, and decidability metrics.",
    stream: "math-theory"
  },
  {
    code: "CS 345",
    name: "Intelligent Systems 1",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 221", "CS 234"], coRequisites: [],
    year: 3, semester: 1,
    description: "AI fundamentals: search strategies, heuristic planning, logic bases, machine learning classifiers, neural nets, and statistical systems.",
    stream: "math-theory"
  },
  {
    code: "CSELECTIVEF1",
    name: "CS Elective 1",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 228", "CSIT 226"], coRequisites: [],
    year: 3, semester: 1,
    description: "Specialized computer science elective track course. Focuses on Systems Integration, Applied AI, or Data Analytics.",
    stream: "elective"
  },
  {
    code: "CSIT 212",
    name: "Quantitative Methods",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 112"], coRequisites: [],
    year: 3, semester: 1,
    description: "Quantitative methods in computing: statistical models, data regressions, probability distributions, testing hypotheses, and quantitative research.",
    stream: "math-theory"
  },
  {
    code: "CSIT 321",
    name: "Applications Development and Emerging Technologies",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 238", "CSIT 228", "CSIT 226"], coRequisites: [],
    year: 3, semester: 1,
    description: "Advanced systems design and emerging technologies: cloud services, REST APIs, asynchronous task workers, webhooks, and containerized backends.",
    stream: "programming"
  },
  {
    code: "CSIT 327",
    name: "Information Management 2",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 226"], coRequisites: [],
    year: 3, semester: 1,
    description: "Advanced database administration: indexing methods, query plans, stored routines, database security, replication schemes, and NoSQL engines.",
    stream: "programming"
  },
  {
    code: "ES 038",
    name: "Technopreneurship",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 3, semester: 1,
    description: "Technopreneurship: business modeling, software startup planning, venture funding, target markets, intellectual property, and pitching.",
    stream: "others"
  },

  // ====================================================
  // THIRD YEAR, SECOND SEMESTER
  // ====================================================
  {
    code: "CS 322",
    name: "Programming Languages",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 313"], coRequisites: [],
    year: 3, semester: 2,
    description: "Concepts of programming language designs: formal syntax (EBNF), type checking, bindings, scope execution, and comparative paradigm paradigms.",
    stream: "programming"
  },
  {
    code: "CS 342",
    name: "Software Engineering 1",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 321"], coRequisites: [],
    year: 3, semester: 2,
    description: "Software engineering lifecycle: gathering requirements, UML diagrams, architectural models, software testing, Agile methodologies, and project management.",
    stream: "programming"
  },
  {
    code: "CS 346",
    name: "Intelligent Systems 2",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 345"], coRequisites: [],
    year: 3, semester: 2,
    description: "Advanced AI: deep learning networks, computer vision, natural language processing, transformer architectures, and generative models.",
    stream: "math-theory"
  },
  {
    code: "CS 392",
    name: "Research Methods",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 321", "CS 345"], coRequisites: [],
    year: 3, semester: 2,
    description: "Research methodologies in computer science: literature reviews, hypothesis definitions, experimental trials, and academic thesis writing.",
    stream: "math-theory"
  },
  {
    code: "CSELECTIVEF2",
    name: "CS Elective 2",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 228", "CSIT 226"], coRequisites: [],
    year: 3, semester: 2,
    description: "Second CS track elective focusing on specialized developer toolchains and industry frameworks.",
    stream: "elective"
  },
  {
    code: "RIZAL 031",
    name: "The Life and Works of Rizal",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 3, semester: 2,
    description: "Critical study of the life, literary works, essays, and political influence of the Philippine national hero, Jose Rizal.",
    stream: "ge"
  },
  {
    code: "SOCSCI 032",
    name: "The Contemporary World",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 3, semester: 2,
    description: "Study of globalization systems: cross-border economics, international relations, cultural flows, and global governance institutions.",
    stream: "ge"
  },

  // ====================================================
  // THIRD YEAR, SUMMER
  // ====================================================
  {
    code: "CSIT 310",
    name: "OJT/Practicum 1",
    lec: 0.0, lab: 6.0, lecUnits: 0.0, labUnits: 6.0, units: 6.0,
    prerequisites: ["CSIT 321"], coRequisites: [],
    year: 3, semester: 3,
    description: "Industry OJT/Practicum: supervised real-world work experience inside software agencies, IT firms, or tech departments.",
    stream: "others"
  },

  // ====================================================
  // FOURTH YEAR, FIRST SEMESTER
  // ====================================================
  {
    code: "CS 323",
    name: "Data Communication and Networking",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 243"], coRequisites: [],
    year: 4, semester: 1,
    description: "Data communications: signal encoding, network layer structures (TCP/IP), routing paths, packet switching, and local area network architectures.",
    stream: "systems-networks"
  },
  {
    code: "CS 441",
    name: "Software Engineering 2",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 342"], coRequisites: [],
    year: 4, semester: 1,
    description: "Continuation of software engineering: project construction, API integrations, quality assurance testing, devops deployments, and final releases.",
    stream: "programming"
  },
  {
    code: "CS 497",
    name: "Special Problem 1",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CS 392"], coRequisites: [],
    year: 4, semester: 1,
    description: "First phase of the BSCS capstone thesis project: proposal defense, initial prototypes, literature scoping, and methodology review.",
    stream: "programming"
  },
  {
    code: "CSELECTIVEF3",
    name: "CS Elective 3",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CSIT 226", "CSIT 228"], coRequisites: [],
    year: 4, semester: 1,
    description: "Third computer science track elective focusing on advanced industry trends and computing frameworks.",
    stream: "elective"
  },
  {
    code: "FREE-EL 1",
    name: "Free Elective 1",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 226", "CSIT 228"], coRequisites: [],
    year: 4, semester: 1,
    description: "Free elective, allowing students to study supplementary fields (e.g. Information Systems, Analytics, Correlation Courses).",
    stream: "elective"
  },
  {
    code: "GE-CCSF2",
    name: "General Education Elective 2",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 4, semester: 1,
    description: "General Education Elective 2. Focused on technical writing foundations, report structures, research papers, and technical document designs.",
    stream: "ge"
  },

  // ====================================================
  // FOURTH YEAR, SECOND SEMESTER
  // ====================================================
  {
    code: "CS 348",
    name: "Operating Systems",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 323"], coRequisites: [],
    year: 4, semester: 2,
    description: "Operating system architectures: process tasks, thread schedulers, memory paging, file systems, disk I/O, and deadlock preventions.",
    stream: "systems-networks"
  },
  {
    code: "CS 446",
    name: "Computer Security",
    lec: 2.0, lab: 3.0, lecUnits: 2.0, labUnits: 1.0, units: 3.0,
    prerequisites: ["CS 323"], coRequisites: [],
    year: 4, semester: 2,
    description: "Computer and network security: encryption standards, network exploits, access policies, firewalls, and security audit verifications.",
    stream: "systems-networks"
  },
  {
    code: "CS 498",
    name: "Special Problem 2",
    lec: 6.0, lab: 0.0, lecUnits: 6.0, labUnits: 0.0, units: 6.0,
    prerequisites: ["CS 497"], coRequisites: [],
    year: 4, semester: 2,
    description: "Final phase of the BSCS capstone thesis: system construction, final implementation testing, paper writing, and formal project defense.",
    stream: "programming"
  },
  {
    code: "FREE-EL 2",
    name: "Free Elective 2",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: ["CSIT 226", "CSIT 228"], coRequisites: [],
    year: 4, semester: 2,
    description: "Second free elective focusing on advanced software quality assurance, testing, or special IT topics.",
    stream: "elective"
  },
  {
    code: "GE-CCSF3",
    name: "General Education Elective 3",
    lec: 3.0, lab: 0.0, lecUnits: 3.0, labUnits: 0.0, units: 3.0,
    prerequisites: [], coRequisites: [],
    year: 4, semester: 2,
    description: "General Education Elective 3 focusing on foreign languages, particularly conversational Nihongo grammar and writing.",
    stream: "ge"
  }
];

export const electivesCatalog: ElectiveGroup[] = [
  {
    id: "cs-elective-1",
    title: "CS Elective 1",
    options: [
      { code: "IT 342", name: "Systems Integration and Architecture 1", track: "Systems Integration" },
      { code: "CSIT 341", name: "Industry Elective 2", track: "Industry Path" },
      { code: "CSIT 349", name: "Applied AI", track: "Artificial Intelligence" },
      { code: "CS 365", name: "Data Analytics and Visualization", track: "Data Science" }
    ]
  },
  {
    id: "cs-elective-2",
    title: "CS Elective 2",
    options: [
      { code: "CSIT 340", name: "Industry Elective 1", track: "Industry Path" },
      { code: "CSIT 343", name: "Industry Elective 4", track: "Industry Path" }
    ]
  },
  {
    id: "cs-elective-3",
    title: "CS Elective 3",
    options: [
      { code: "CSIT 440", name: "Industry Trends", track: "Emerging Technologies" }
    ]
  },
  {
    id: "free-elective-1",
    title: "Free Elective 1",
    options: [
      { code: "IT 334", name: "IS Strategy" },
      { code: "CSIT 337", name: "Correlation Course" }
    ]
  },
  {
    id: "free-elective-2",
    title: "Free Elective 2",
    options: [
      { code: "CSIT 333", name: "Special Topics in CS/IT" },
      { code: "CSIT 335", name: "Testing and Quality Assurance" }
    ]
  },
  {
    id: "ge-elective-1",
    title: "GE Elective 1",
    options: [
      { code: "ES 036B", name: "Environmental Science" },
      { code: "SDG 031", name: "Sustainable Development Goals" }
    ]
  },
  {
    id: "ge-elective-2",
    title: "GE Elective 2",
    options: [
      { code: "ENGL 014", name: "Technical Writing" }
    ]
  },
  {
    id: "ge-elective-3",
    title: "GE Elective 3",
    options: [
      { code: "FL 033", name: "Foreign Language 3 (Nihongo 1)" }
    ]
  }
];

export const bscsSummation = {
  totalUnits: 173.0,
  lectureUnits: 143.0,
  labUnits: 30.0,
  institution: "Cebu Institute of Technology - University",
  acronym: "CIT-U",
  college: "College of Computer Studies",
  program: "Bachelor of Science in Computer Science",
  curriculumYear: "2023-2024"
};
