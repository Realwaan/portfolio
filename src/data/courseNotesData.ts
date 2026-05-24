export interface StudyNoteSection {
  type: 'text' | 'callout' | 'code' | 'formula';
  content: string;
  icon?: string;          // Used for callout icons
  codeLanguage?: string;  // Used for code blocks (e.g. "cpp", "javascript", "typescript")
}

export interface CourseNotes {
  emoji: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  professor?: string;
  syllabus: string[];
  summary: string;
  sections: StudyNoteSection[];
  resources: { name: string; url: string }[];
}

export const COURSE_NOTES_DATABASE: Record<string, CourseNotes> = {
  'CSIT 111': {
    emoji: '🖥️',
    status: 'Completed',
    difficulty: 'Easy',
    professor: 'Dr. Joseph Wildcat',
    summary: 'Essential fundamentals of computing systems, computer hardware architectures, low-level binary arithmetic, and structural logic gates.',
    syllabus: [
      'Overview of Computing History & Turing Machines',
      'Von Neumann Architecture & The Instruction Cycle',
      'Binary, Octal, Decimal, and Hexadecimal Bases',
      'Boolean Algebra, Truth Tables & Core Logic Gates',
      'Operating Systems, Hardware Kernels, & Network Nodes'
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: '**Core Insight**: Computer Science is not just the study of computers, but the study of recipes (algorithms) and how they process information.'
      },
      {
        type: 'text',
        content: 'The Von Neumann architecture defines the hardware model of almost all general-purpose computers today. It describes a CPU consisting of a Control Unit (CU) and Arithmetic Logic Unit (ALU), a memory unit for holding program statements and data, secondary bulk storage devices, and input/output channels.'
      },
      {
        type: 'code',
        codeLanguage: 'assembly',
        content: `; Assembly visualization of a basic ALU operation
MOV AX, 12      ; Move decimal 12 into AX register
MOV BX, 30      ; Move decimal 30 into BX register
ADD AX, BX      ; Add BX to AX. AX now stores 42 (0x2A in hex)`
      },
      {
        type: 'text',
        content: 'Data representation is another crucial pillar. In the digital level, everything maps to binary voltage states (high or low). To store larger numbers and characters, we group bits into bytes (8 bits), words, and convert them across bases (binary, octal, hexadecimal).'
      }
    ],
    resources: [
      { name: 'Charles Petzold - Code: The Hidden Language', url: 'https://www.charlespetzold.com/code/' },
      { name: 'Von Neumann Architecture Reference', url: 'https://en.wikipedia.org/wiki/Von_Neumann_architecture' }
    ]
  },
  'CSIT 121': {
    emoji: '💻',
    status: 'Completed',
    difficulty: 'Medium',
    professor: 'Engr. Sarah Cruz',
    summary: 'Foundational concepts of programming logic using structured C++, focusing on variables, logical conditionals, branching controls, iterative loops, and basic array containers.',
    syllabus: [
      'C++ Standard Environment, Compilers, and I/O Streams',
      'Variables, Primitive Types, and Assignment Operators',
      'Logical Expressions & Branching Checks (If-Else, Switch)',
      'Iterative repetitions (For, While, Do-While Loops)',
      'Static Array Declarations and Index Retrievals'
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: '**Syntax Tip**: Always initialize primitive C++ variables (e.g. `int sum = 0;`). Uninitialized stack variables contain random trash values, causing non-deterministic bugs!'
      },
      {
        type: 'text',
        content: 'Repetition structures allow our programs to repeat actions without duplicating source files. Loops verify a conditional statement; if it evaluates to `true`, the loop body executes. In a `for` loop, initialization, condition, and increment are written within a single line for optimal readability.'
      },
      {
        type: 'code',
        codeLanguage: 'cpp',
        content: `#include <iostream>
using namespace std;

int main() {
    int scores[5] = {90, 85, 92, 78, 88};
    int sum = 0;
    
    // Loop through the static array container
    for (int i = 0; i < 5; i++) {
        sum += scores[i];
        cout << "Student " << (i + 1) << " Score: " << scores[i] << endl;
    }
    
    double average = sum / 5.0;
    cout << "Class Average: " << average << "%" << endl;
    return 0;
}`
      }
    ],
    resources: [
      { name: 'Bjarne Stroustrup - Tour of C++', url: 'https://www.stroustrup.com/Tour.html' },
      { name: 'C++ Reference & STL Manual', url: 'https://en.cppreference.com/w/' }
    ]
  },
  'CSIT 122': {
    emoji: '⚙️',
    status: 'Completed',
    difficulty: 'Medium',
    professor: 'Engr. Sarah Cruz',
    summary: 'Intermediate programming topics focusing on memory references, dynamic variable allocation, pointer address arithmetic, data structure structs, and read/write file streams.',
    syllabus: [
      'Hexadecimal Memory Addresses and Pointer References (& and * operators)',
      'Dynamic Heap Memory Allocation (new and delete modifiers)',
      'Structured Datatypes (struct) & Custom Model Definitions',
      'Input/Output File Streams (ifstream, ofstream)',
      'Multi-File Compile Targets and Header Interfaces (.h files)'
    ],
    sections: [
      {
        type: 'callout',
        icon: '⚠️',
        content: '**Memory Warning**: Every instance of `new` allocation must be matched by a corresponding `delete` when that memory goes out of scope. Forgetting to delete creates memory leaks, eventually crashing the host OS!'
      },
      {
        type: 'text',
        content: 'Pointers are variables that store the memory address of another variable. They are declared with a `*` indicator. Dereferencing a pointer means retrieving or modifying the actual data stored at the pointed address.'
      },
      {
        type: 'code',
        codeLanguage: 'cpp',
        content: `// Pointer initialization & dynamic arrays
int value = 100;
int* ptr = &value; // Address reference

cout << "Pointer Address: " << ptr << endl;
cout << "Pointed Value: " << *ptr << endl; // Dereferencing outputs 100

// Dynamic Heap Allocation
int* dynInt = new int(250);
cout << "Heap Value: " << *dynInt << endl;
delete dynInt; // Free single item

int* dynArray = new int[50]; // Allocate array on heap
dynArray[0] = 500;
delete[] dynArray; // Free heap array container`
      }
    ],
    resources: [
      { name: 'C++ Pointers and Memory Management', url: 'https://cplusplus.com/doc/tutorial/pointers/' },
      { name: 'Dynamic Memory Allocation Guide', url: 'https://en.cppreference.com/w/cpp/memory/new/operator_new' }
    ]
  },
  'CSIT 201': {
    emoji: '🌐',
    status: 'Completed',
    difficulty: 'Easy',
    professor: 'Mr. Andrei Wilde',
    summary: 'Client-side web architecture, semantic document markup, stylesheet customization grids, event-driven script logic, and modular React component architectures.',
    syllabus: [
      'HTML5 Document Scopes & Accessible ARIA Labels',
      'CSS3 Flexbox, Grid Layouts, and Dynamic Themes',
      'JavaScript DOM Selectors, Event Listeners, and Scope closures',
      'ES6+ Features (Arrow Functions, Destructuring, Promises, Fetch)',
      'React Components, Props, Hooks (useState, useEffect) & Vite'
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: '**Modern Web Tip**: Minimize manual DOM manipulation in modern apps. Rely on state-driven rendering libraries (like React) to automatically sync data states with UI views.'
      },
      {
        type: 'text',
        content: 'Vite serves as a rapid local builder using ES module imports directly. React builds component structures. Props are variables passed from parents, while State represents reactive variables held within the component scopes.'
      },
      {
        type: 'code',
        codeLanguage: 'typescript',
        content: `// React Functional Component with Hooks
import React, { useState, useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button 
      className="theme-btn" 
      onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
    >
      Switched to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};`
      }
    ],
    resources: [
      { name: 'MDN Web Docs (HTML, CSS, JS)', url: 'https://developer.mozilla.org/' },
      { name: 'Official React Documentation', url: 'https://react.dev/' }
    ]
  },
  'CSIT 221': {
    emoji: '📊',
    status: 'In Progress',
    difficulty: 'Hard',
    professor: 'Dr. Joseph Wildcat',
    summary: 'Linear and non-linear data representation models, performance metrics (Big-O), search/sort algorithms, recursive loops, and binary tree balancing.',
    syllabus: [
      'Asymptotic Complexity and Big-O Notation Limits',
      'Arrays, Linked Lists (Singly, Doubly), & Node References',
      'Stack Lifo & Queue Fifo Buffers and Array Implementations',
      'Recursion, Divide-and-Conquer, Quick/Merge Sorting',
      'Binary Search Trees (BST), AVL Balancing, Graphs & Traversals'
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: '**Efficiency Metric**: Sorting methods vary wildly. Bubble Sort runs in quadratic $O(N^2)$ time, whereas Merge Sort splits the dataset recursively, running in efficient linearithmic $O(N \\log N)$ time.'
      },
      {
        type: 'formula',
        content: 'T(n) = O(N \\log N) \\quad \\text{Average and Worst-Case Complexity for Merge Sort}'
      },
      {
        type: 'text',
        content: 'A Linked List is a linear data structure where elements are not stored in contiguous memory addresses. Instead, each element (node) stores a data field and a pointer/reference referencing the next node in the sequence.'
      },
      {
        type: 'code',
        codeLanguage: 'typescript',
        content: `// Singly Linked List Node in TypeScript
class LinkedListNode<T> {
  public value: T;
  public next: LinkedListNode<T> | null = null;

  constructor(val: T) {
    this.value = val;
  }
}

class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;

  public insertAtHead(val: T): void {
    const newNode = new LinkedListNode(val);
    newNode.next = this.head;
    this.head = newNode;
  }
}`
      }
    ],
    resources: [
      { name: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/' },
      { name: 'VisuAlgo - Data Structure Visualizations', url: 'https://visualgo.net/en' }
    ]
  },
  'CSIT 227': {
    emoji: '📦',
    status: 'In Progress',
    difficulty: 'Medium',
    professor: 'Mr. Andrei Wilde',
    summary: 'Object-Oriented Programming (OOP) paradigms focusing on inheritance, data abstraction, encapsulation shields, polymorph binds, and file handles.',
    syllabus: [
      'OOP Foundations: Classes, Objects, Attributes, and Behaviors',
      'Encapsulation (Access Modifiers: private, protected, public)',
      'Inheritance Hierarchies & Code Reusability Structures',
      'Polymorphism (Dynamic Binding, Overloading & Overriding)',
      'Interfaces, Abstract Classes, and Custom Exception Handlers'
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: '**Encapsulation Rule**: Always hide internal fields of a class. Declare variables as `private` or `protected` and expose safe interaction gates using public getter/setter helper functions.'
      },
      {
        type: 'text',
        content: 'Polymorphism allows us to define one interface and have multiple implementations. In Java or C++, dynamic polymorphism is achieved through inheritance and virtual functions (method overriding).'
      },
      {
        type: 'code',
        codeLanguage: 'cpp',
        content: `// Polymorphism in C++
#include <iostream>
using namespace std;

class Shape {
public:
    virtual void draw() = 0; // Pure virtual (Interface)
};

class Circle : public Shape {
public:
    void draw() override {
        cout << "Drawing a Circle!" << endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() override {
        cout << "Drawing a Rectangle!" << endl;
    }
};

int main() {
    Shape* shape1 = new Circle();
    Shape* shape2 = new Rectangle();
    
    shape1->draw(); // Outputs: Drawing a Circle!
    shape2->draw(); // Outputs: Drawing a Rectangle!
    
    delete shape1;
    delete shape2;
    return 0;
}`
      }
    ],
    resources: [
      { name: 'Refactoring Guru - OOP & Design Patterns', url: 'https://refactoring.guru/design-patterns' },
      { name: 'Learn OOP Core Pillars', url: 'https://www.freecodecamp.org/news/four-pillars-of-object-oriented-programming/' }
    ]
  },
  'MATH 136': {
    emoji: '📐',
    status: 'Completed',
    difficulty: 'Hard',
    professor: 'Dr. Joseph Wildcat',
    summary: 'Fundamental methods of limits, functional derivatives, rate formulas, anti-derivatives, optimization curves, and integration boundaries.',
    syllabus: [
      'Limits, Infinity Bounds, and Continuous Function Checks',
      'Derivatives and Tangent Rates (Product, Quotient, Chain rules)',
      'Optimization Analysis & Relative Maximum/Minimum coordinates',
      'Anti-derivatives & Definite/Indefinite Integration',
      'Fundamental Theorem of Calculus and Area Calculations'
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: '**Calculus Core**: The derivative answers "how fast is this changing right now?" (slope of tangent). The integral answers "how much has accumulated over this span?" (area under curve).'
      },
      {
        type: 'formula',
        content: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} \\quad \\text{Instantaneous Rate of Change Definition}'
      },
      {
        type: 'formula',
        content: '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a) \\quad \\text{The Fundamental Theorem of Calculus}'
      },
      {
        type: 'text',
        content: 'Optimization is a key application. By taking the derivative of a function representing cost, area, or efficiency, and setting it to zero ($f\'(x) = 0$), we isolate the critical coordinate values that produce the absolute peak performance bounds.'
      }
    ],
    resources: [
      { name: 'Paul\'s Online Math Notes - Calculus I', url: 'https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx' },
      { name: '3Blue1Brown - Essence of Calculus', url: 'https://www.3blue1brown.com/lessons/essence-of-calculus' }
    ]
  }
};

// Fallback helpers for automated note generation
const getFallbackEmoji = (stream: string): string => {
  switch (stream) {
    case 'computing': return '🖥️';
    case 'programming': return '💻';
    case 'math-theory': return '📐';
    case 'systems-networks': return '🔌';
    case 'ge': return '📚';
    case 'elective': return '🚀';
    default: return '🎯';
  }
};

const getFallbackStatus = (year: number, semester: number): 'Completed' | 'In Progress' | 'Upcoming' => {
  // Current student status: 1st Year student.
  // Assuming CY 2023-2024 is the curriculum. Current local time is 2026.
  // Year 1 is Completed. Year 2 is In Progress or Upcoming.
  if (year === 1) {
    return 'Completed';
  } else if (year === 2 && semester === 1) {
    return 'In Progress';
  } else {
    return 'Upcoming';
  }
};

const getFallbackDifficulty = (stream: string): 'Easy' | 'Medium' | 'Hard' => {
  switch (stream) {
    case 'programming':
    case 'systems-networks':
      return 'Medium';
    case 'math-theory':
    case 'elective':
      return 'Hard';
    default:
      return 'Easy';
  }
};

export function getCourseNotes(code: string, course: any): CourseNotes {
  const custom = COURSE_NOTES_DATABASE[code];
  if (custom) return custom;

  // Generate dynamic fallback entries based on metadata
  const emoji = getFallbackEmoji(course.stream || '');
  const status = getFallbackStatus(course.year || 1, course.semester || 1);
  const difficulty = getFallbackDifficulty(course.stream || '');

  return {
    emoji,
    status,
    difficulty,
    summary: course.description || `Comprehensive syllabus course studying key operations of ${course.name}.`,
    syllabus: [
      `Introduction to foundational terminology & definitions of ${course.name}`,
      `Core structural theories, frameworks and conceptual analysis`,
      `Practical exercises, laboratory applications, and coursework projects`,
      `Midterm review assessments & competency milestones`,
      `Final course review, exam preparation, and curriculum outcomes`
    ],
    sections: [
      {
        type: 'callout',
        icon: '💡',
        content: `**Course Focus**: This module provides deep academic training in **${course.name}** (${course.code}). Pay special attention to core lectures and review sheets.`
      },
      {
        type: 'text',
        content: `Mastering ${course.name} is necessary for constructing general-purpose engineering competency and establishing theoretical analytical capabilities. Key principles are applied throughout standard homework exercises.`
      }
    ],
    resources: [
      { name: 'Cebu Institute of Technology - University Portal', url: 'https://cit.edu/' },
      { name: 'College of Computer Studies Catalog', url: 'https://cit.edu/college-of-computer-studies/' }
    ]
  };
}
