import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.quiz.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.sheet.deleteMany();
  await prisma.theoryTopic.deleteMany();
  await prisma.subject.deleteMany();

  // ─── SUBJECTS ───────────────────────────────────────────────────────

  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        slug: "operating-systems",
        title: "Operating Systems",
        description: "Learn about process management, memory management, file systems, and more.",
        icon: "Cpu",
        color: "blue",
        order: 1,
      },
    }),
    prisma.subject.create({
      data: {
        slug: "dbms",
        title: "Database Management Systems",
        description: "Master SQL, normalization, indexing, transactions, and concurrency control.",
        icon: "Database",
        color: "green",
        order: 2,
      },
    }),
    prisma.subject.create({
      data: {
        slug: "computer-networks",
        title: "Computer Networks",
        description: "Understand TCP/IP, HTTP, DNS, routing, and network security.",
        icon: "Network",
        color: "purple",
        order: 3,
      },
    }),
    prisma.subject.create({
      data: {
        slug: "compiler-design",
        title: "Compiler Design",
        description: "Explore lexical analysis, parsing, syntax trees, and code generation.",
        icon: "Settings2",
        color: "orange",
        order: 4,
      },
    }),
    prisma.subject.create({
      data: {
        slug: "data-structures",
        title: "Data Structures & Algorithms",
        description: "Arrays, linked lists, trees, graphs, and algorithmic paradigms.",
        icon: "GitBranch",
        color: "yellow",
        order: 5,
      },
    }),
    prisma.subject.create({
      data: {
        slug: "system-design",
        title: "System Design",
        description: "Learn about distributed systems, scalability, and design patterns.",
        icon: "Layers",
        color: "red",
        order: 6,
      },
    }),
  ]);

  console.log(`Created ${subjects.length} subjects`);

  // ─── OS THEORY TOPICS ──────────────────────────────────────────────

  const osContent1 = `## What is an Operating System?

An **Operating System (OS)** is system software that manages computer hardware and software resources and provides common services for computer programs. It acts as an intermediary between users and the computer hardware.

### Key Functions of an OS:
- **Process Management**: Creating, scheduling, and terminating processes
- **Memory Management**: Allocating and deallocating memory space
- **File Management**: Creating, deleting, and organizing files
- **Device Management**: Managing I/O devices through device drivers
- **Security & Protection**: Controlling access to resources
- **User Interface**: Providing CLI or GUI for user interaction

### Types of Operating Systems

| Type | Description | Example |
|------|-------------|---------|
| **Batch OS** | Jobs are collected and executed in batches without user interaction | IBM OS/360 |
| **Time-Sharing OS** | CPU time is shared among multiple users | UNIX, Linux |
| **Real-Time OS** | Guarantees response within strict time constraints | VxWorks, QNX |
| **Distributed OS** | Manages a group of independent computers as a single system | Amoeba |
| **Mobile OS** | Designed for mobile devices | Android, iOS |

### Kernel Types

- **Monolithic Kernel**: All OS services run in kernel space (Linux, UNIX)
- **Microkernel**: Only essential services in kernel space, others in user space (MINIX, QNX)
- **Hybrid Kernel**: Combines aspects of both (Windows NT, macOS)

### System Calls

System calls provide an interface between user programs and the OS. Common categories:
- Process control (fork, exec, exit)
- File management (open, read, write, close)
- Device management (ioctl, read, write)
- Information maintenance (getpid, alarm)
- Communication (pipe, shmget, mmap)

> 💡 **Did you know?** Linux kernel has over 300 system calls, with x86_64 architecture supporting approximately 380 syscalls.`;

  const osContent2 = `## Process Management

A **process** is a program in execution. It is an active entity that includes the program code, current activity, and the set of resources assigned to it.

### Process vs Program

| Aspect | Program | Process |
|--------|---------|---------|
| Nature | Passive entity | Active entity |
| Storage | Stored on disk | Loaded in memory |
| Lifetime | Permanent (as file) | Temporary (during execution) |
| Resources | None | CPU, memory, I/O |

### Process States

A process transitions through several states during its lifetime:

\`\`\`
NEW ──► READY ──► RUNNING ──► TERMINATED
              ▲         │
              │         ▼
              ◄── WAITING
\`\`\`

1. **New**: The process is being created
2. **Ready**: The process is loaded in memory and waiting for CPU
3. **Running**: Instructions are being executed on the CPU
4. **Waiting/Blocked**: The process is waiting for an event (I/O completion)
5. **Terminated**: The process has finished execution

### Process Control Block (PCB)

Every process has a PCB which contains:

| Field | Description |
|-------|-------------|
| Process ID (PID) | Unique identifier |
| Program Counter | Address of next instruction |
| CPU Registers | Saved context during context switch |
| CPU Scheduling Info | Priority, queue pointers |
| Memory Management Info | Page tables, segment tables |
| Accounting Info | CPU time, elapsed time |
| I/O Status | List of allocated devices |

### Context Switching

Context switching is the mechanism where the OS saves the state of the current process and loads the saved state of another process. It involves:

1. Saving CPU registers of current process
2. Loading CPU registers of new process
3. Updating PCB of both processes
4. Flushing TLB (Translation Lookaside Buffer)

### Threads vs Processes

- **Process**: Heavyweight, has its own address space, IPC required for communication
- **Thread**: Lightweight, shares address space with parent process, easier communication

> 💡 Context switching overhead typically ranges from **1-100 microseconds**, depending on hardware and OS complexity.`;

  const osContent3 = `## CPU Scheduling Algorithms

**CPU scheduling** is the process of selecting which process in the ready queue gets the CPU next. The scheduler makes these decisions.

### Scheduling Criteria

| Metric | Description |
|--------|-------------|
| **CPU Utilization** | Keep the CPU as busy as possible (40-90% ideal) |
| **Throughput** | Number of processes completed per time unit |
| **Turnaround Time** | Time from submission to completion |
| **Waiting Time** | Total time spent in ready queue |
| **Response Time** | Time from submission to first response |

### 1. First-Come, First-Served (FCFS)

Non-preemptive. Processes are scheduled in order of arrival.

**Example:** Processes P1(24ms), P2(3ms), P3(3ms)

\`\`\`
Gantt Chart:
|  P1  |  P2  |  P3  |
0      24     27     30

Average Waiting Time: (0 + 24 + 27) / 3 = 17ms
\`\`\`

**Problem**: Convoy effect — short processes wait behind long ones.

### 2. Shortest Job First (SJF)

Non-preemptive. The process with the smallest burst time is scheduled next.

**Example:** Processes P1(6ms), P2(8ms), P3(7ms), P4(3ms)

\`\`\`
Order: P4(3) → P1(6) → P3(7) → P2(8)
Gantt Chart:
|  P4  |  P1  |  P3  |  P2  |
0      3      9      16     24

Average Waiting Time: (0 + 3 + 9 + 16) / 4 = 7ms
\`\`\`

**Preemptive SJF (SRTF)**: The shortest remaining time first — can preempt a running process.

### 3. Round Robin (RR)

Each process gets a fixed time quantum (usually 10-100ms). Processes are scheduled in a circular queue.

**Example:** Time quantum = 4ms, Processes P1(24ms), P2(3ms), P3(3ms)

\`\`\`
| P1 | P2 | P3 | P1 | P1 | P1 | P1 | P1 |
0    4    7   10   14   18   22   26   30
\`\`\`

**Key**: If quantum is too small → too many context switches. If too large → degenerates to FCFS.

### 4. Priority Scheduling

Each process has a priority number. Higher priority processes run first.

- **Preemptive**: Can preempt lower priority process
- **Non-preemptive**: Runs to completion once scheduled

**Problem**: Starvation — low priority processes may never execute.
**Solution**: Aging — gradually increase priority of waiting processes.

### Comparison Table

| Algorithm | Preemptive? | Starvation? | Convoy Effect? | Best For |
|-----------|-------------|-------------|----------------|----------|
| FCFS | No | No | Yes | Simple batch systems |
| SJF | No (SRTF: Yes) | Possible | No | Short jobs prioritized |
| Round Robin | Yes | No | No | Time-sharing systems |
| Priority | Both | Yes | No | Real-time systems |

> 💡 **Linux uses the Completely Fair Scheduler (CFS)** which models the "ideal, precise multi-tasking CPU" using red-black trees for O(log n) scheduling decisions.`;

  const osContent4 = `## Memory Management

Memory management is the process of controlling and coordinating computer memory, assigning portions to running programs to optimize overall system performance.

### Logical vs Physical Address Space

- **Logical Address**: Generated by the CPU during program execution (virtual address)
- **Physical Address**: Actual location in memory hardware

The **Memory Management Unit (MMU)** translates logical addresses to physical addresses at runtime.

### Paging

Paging is a memory management scheme that eliminates external fragmentation.

| Concept | Description |
|---------|-------------|
| **Page** | Fixed-size block of logical memory (4KB typically) |
| **Frame** | Fixed-size block of physical memory (same size as page) |
| **Page Table** | Maps page numbers to frame numbers |
| **Page Table Entry (PTE)** | Contains frame number + status bits |

**Address Translation:**
\`\`\`
Logical Address: [Page Number (p)] [Offset (d)]
                         │
                         ▼
                   Page Table ──► Frame Number (f)
                         │
                         ▼
Physical Address: [Frame Number (f)] [Offset (d)]
\`\`\`

### Segmentation

Segmentation divides memory into variable-sized segments based on logical divisions of a program:

- Code segment
- Data segment
- Stack segment
- Heap segment

Each segment has a base address and limit. Segmentation can lead to **external fragmentation**.

### Virtual Memory

Virtual memory allows execution of processes that may not be completely in memory. It uses:

- **Demand Paging**: Pages are loaded only when needed
- **Page Fault**: Interrupt when accessed page is not in memory
- **Swap Space**: Backing store on disk for moved pages

### Page Replacement Algorithms

When a page fault occurs and no free frame is available, the OS must replace a page:

| Algorithm | Description | Pros | Cons |
|-----------|-------------|------|------|
| **FIFO** | Replace oldest page | Simple | Belady's anomaly |
| **LRU** | Replace least recently used | Good performance | Hardware support needed |
| **Optimal** | Replace page used furthest in future | Best theorically | Impossible to implement |
| **Clock (Second Chance)** | Circular list with reference bit | Efficient approximation | More overhead than FIFO |

**Belady's Anomaly**: With FIFO, increasing the number of frames can increase the number of page faults!

### Thrashing

Thrashing occurs when a system spends more time swapping pages than executing processes. It happens when:

- Degree of multiprogramming is too high
- Working set of processes exceeds available frames
- High page fault rate leads to low CPU utilization

**Solution**: Working Set Model — ensure each process has enough frames for its working set.

> 💡 Modern operating systems use **demand paging with LRU approximation** (like the Clock algorithm) because true LRU requires expensive hardware support. Linux uses a variant of the Clock algorithm.`;

  const osContent5 = `## Deadlocks

A **deadlock** is a situation where two or more competing processes are each waiting for the other to release a resource, causing all of them to be blocked indefinitely.

### Necessary Conditions

For a deadlock to occur, all four conditions must hold simultaneously:

| Condition | Description |
|-----------|-------------|
| **1. Mutual Exclusion** | At least one resource must be held in a non-sharable mode |
| **2. Hold and Wait** | A process holds at least one resource while waiting for others |
| **3. No Preemption** | Resources cannot be forcibly taken from a process |
| **4. Circular Wait** | There exists a circular chain of processes waiting for each other |

### Resource Allocation Graph (RAG)

A directed graph used to detect deadlocks:
- **Processes** represented as circles (P1, P2)
- **Resources** represented as squares (R1, R2)
- **Request edge**: P → R (process wants resource)
- **Assignment edge**: R → P (resource allocated to process)

**If the graph contains a cycle → deadlock may exist** (with single-instance resources).

### Deadlock Prevention

Prevent at least one of the four conditions:

1. **Break Mutual Exclusion**: Use sharable resources where possible
2. **Break Hold and Wait**: Process must request all resources before execution (resource pre-allocation)
3. **Break No Preemption**: Allow preemption of resources
4. **Break Circular Wait**: Impose a total ordering of resource types

### Deadlock Avoidance — Banker's Algorithm

The Banker's Algorithm checks if granting a request leads to a **safe state** (where all processes can complete).

**Example with 2 resources:**

\`\`\`
Process    Allocation    Max     Need    Available
           R1  R2      R1  R2   R1  R2   R1  R2
P0          0   1       7   5    7   4    3   3
P1          1   0       3   2    2   2
P2          2   0       9   0    7   0
P3          1   1       2   2    1   1
P4          0   2       4   3    4   1
\`\`\`

**Safety Algorithm:**
1. Check if Need ≤ Available for any process
2. If yes, pretend to allocate and track resources
3. Repeat until all processes finish or no safe sequence found

**Deadlock Detection:**
- Allow deadlock to occur, then detect and recover
- Recovery: abort processes or preempt resources

> 💷 **Real-world example**: The "deadly embrace" in database transactions — Transaction A holds lock on Row 1 and waits for Row 2, while Transaction B holds Row 2 and waits for Row 1. Databases resolve this using timeout and rollback mechanisms.`;

  const osTopics = await Promise.all([
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[0].id,
        slug: "introduction-to-os",
        title: "Introduction to Operating Systems",
        content: osContent1,
        order: 1,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[0].id,
        slug: "process-management",
        title: "Process Management & Scheduling",
        content: osContent2,
        order: 2,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[0].id,
        slug: "cpu-scheduling",
        title: "CPU Scheduling Algorithms",
        content: osContent3,
        order: 3,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[0].id,
        slug: "memory-management",
        title: "Memory Management & Virtual Memory",
        content: osContent4,
        order: 4,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[0].id,
        slug: "deadlocks",
        title: "Deadlocks & Synchronization",
        content: osContent5,
        order: 5,
      },
    }),
  ]);

  console.log(`Created ${osTopics.length} OS theory topics`);

  // ─── QUIZZES for OS Topics ──────────────────────────────────────────

  const quizzes = [
    // Topic 1: Introduction to OS
    { topicIdx: 0, question: "Which of the following is NOT a type of operating system?", options: ["Batch OS", "Time-Sharing OS", "Database OS", "Real-Time OS"], answer: 2 },
    { topicIdx: 0, question: "What type of kernel has all OS services running in kernel space?", options: ["Microkernel", "Monolithic Kernel", "Hybrid Kernel", "Exokernel"], answer: 1 },
    { topicIdx: 0, question: "Which system call is used to create a new process in UNIX?", options: ["open()", "fork()", "exec()", "wait()"], answer: 1 },
    // Topic 2: Process Management
    { topicIdx: 1, question: "Which process state comes immediately after 'New'?", options: ["Running", "Waiting", "Ready", "Terminated"], answer: 2 },
    { topicIdx: 1, question: "What does PCB stand for?", options: ["Process Control Block", "Program Control Block", "Process Communication Block", "Program Counter Buffer"], answer: 0 },
    { topicIdx: 1, question: "Which is lighter in terms of resource usage?", options: ["Process", "Thread", "Both are equal", "Neither"], answer: 1 },
    // Topic 3: CPU Scheduling
    { topicIdx: 2, question: "Which scheduling algorithm suffers from the convoy effect?", options: ["SJF", "Round Robin", "FCFS", "Priority"], answer: 2 },
    { topicIdx: 2, question: "In Round Robin, if the time quantum is too large, it degenerates to:", options: ["SJF", "FCFS", "Priority", "SRTF"], answer: 1 },
    { topicIdx: 2, question: "Which metric represents the time from process submission to completion?", options: ["Waiting Time", "Response Time", "Turnaround Time", "Throughput"], answer: 2 },
    // Topic 4: Memory Management
    { topicIdx: 3, question: "What unit does paging use for logical memory?", options: ["Segment", "Frame", "Page", "Block"], answer: 2 },
    { topicIdx: 3, question: "Which page replacement algorithm can suffer from Belady's Anomaly?", options: ["LRU", "Optimal", "FIFO", "Clock"], answer: 2 },
    { topicIdx: 3, question: "What is thrashing?", options: ["High CPU utilization", "Excessive page swapping", "Memory leak", "Disk fragmentation"], answer: 1 },
    // Topic 5: Deadlocks
    { topicIdx: 4, question: "How many conditions must hold simultaneously for a deadlock?", options: ["2", "3", "4", "5"], answer: 2 },
    { topicIdx: 4, question: "Which algorithm is used for deadlock avoidance?", options: ["Banker's Algorithm", "Dijkstra's Algorithm", "Peterson's Algorithm", "Lamport's Algorithm"], answer: 0 },
    { topicIdx: 4, question: "Which condition can be broken by imposing resource ordering?", options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait"], answer: 3 },
  ];

  for (const q of quizzes) {
    const explanations = [
      "Database OS is not a standard type. OS types include Batch, Time-Sharing, Real-Time, Distributed, and Mobile.",
      "Monolithic kernels have all services in kernel space, making them faster but less modular.",
      "fork() creates a new process by duplicating the calling process.",
      "After New, the process moves to Ready state where it waits for CPU scheduling.",
      "PCB stands for Process Control Block and contains all process metadata.",
      "Threads are lighter because they share the parent process's address space.",
      "FCFS causes the convoy effect where short processes wait behind a long one.",
      "With a large quantum, Round Robin behaves like FCFS as each process runs to near-completion.",
      "Turnaround time is the total time from submission to completion of a process.",
      "Paging divides logical memory into fixed-size pages and physical memory into frames.",
      "FIFO can exhibit Belady's Anomaly where more frames lead to more page faults.",
      "Thrashing occurs when the system spends more time swapping pages than executing.",
      "All four conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) must hold.",
      "Banker's Algorithm by Dijkstra determines if the system is in a safe state.",
      "Imposing a total ordering on resource types prevents circular wait conditions.",
    ];
    const topic = osTopics[q.topicIdx];
    await prisma.quiz.create({
      data: {
        topicId: topic.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: explanations[quizzes.indexOf(q)],
      },
    });
  }

  console.log(`Created ${quizzes.length} quiz questions`);

  // ─── DBMS THEORY TOPICS ────────────────────────────────────────────

  const dbmsContent1 = `## Database Design & ER Models

**Database design** is the process of structuring data to represent real-world entities and their relationships efficiently.

### Entity-Relationship (ER) Model
The ER model is a conceptual data model that describes data as entities, attributes, and relationships.

| Component | Symbol (Chen) | Description |
|-----------|--------------|-------------|
| **Entity** | Rectangle | Real-world object (Student, Course) |
| **Attribute** | Oval | Property of an entity (name, ID) |
| **Relationship** | Diamond | Association between entities (Enrolls) |
| **Key Attribute** | Underlined oval | Uniquely identifies an entity |

### Types of Attributes
- **Simple**: Atomic, cannot be divided (age)
- **Composite**: Can be divided (address → street, city, zip)
- **Derived**: Computed from other attributes (age from DOB)
- **Multi-valued**: Can have multiple values (phone numbers)

### Keys in Database Design
| Key Type | Description |
|----------|-------------|
| **Super Key** | Set of attributes that uniquely identifies a tuple |
| **Candidate Key** | Minimal super key (no proper subset is a super key) |
| **Primary Key** | Selected candidate key for the table |
| **Foreign Key** | References primary key of another table |

### Relationship Types
- **One-to-One (1:1)**: One entity maps to one other (Person ↔ Passport)
- **One-to-Many (1:N)**: One entity maps to many (Department → Employees)
- **Many-to-Many (M:N)**: Many entities map to many (Students ↔ Courses)

> 💡 **ER-to-Relational Mapping**: Each entity becomes a table, attributes become columns, relationships become foreign keys or junction tables.`;

  const dbmsContent2 = `## SQL & Query Optimization

**SQL (Structured Query Language)** is the standard language for relational database management.

### Core SQL Operations

| Command | Type | Example |
|---------|------|---------|
| **SELECT** | DML | \`SELECT name, age FROM users WHERE age > 18;\` |
| **INSERT** | DML | \`INSERT INTO users (name, age) VALUES ('Alice', 25);\` |
| **UPDATE** | DML | \`UPDATE users SET age = 26 WHERE name = 'Alice';\` |
| **DELETE** | DML | \`DELETE FROM users WHERE age < 18;\` |
| **CREATE** | DDL | \`CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50));\` |
| **ALTER** | DDL | \`ALTER TABLE users ADD COLUMN email VARCHAR(100);\` |

### JOIN Types

\`\`\`sql
-- INNER JOIN: Only matching rows
SELECT * FROM orders o INNER JOIN customers c ON o.cust_id = c.id;

-- LEFT JOIN: All rows from left, NULLs for non-matching right
SELECT * FROM orders o LEFT JOIN customers c ON o.cust_id = c.id;

-- RIGHT JOIN: All rows from right, NULLs for non-matching left
SELECT * FROM orders o RIGHT JOIN customers c ON o.cust_id = c.id;

-- FULL JOIN: All rows from both sides
SELECT * FROM orders o FULL OUTER JOIN customers c ON o.cust_id = c.id;
\`\`\`

### Query Optimization Techniques

| Technique | Description |
|-----------|-------------|
| **Indexing** | B-tree indexes for equality/range, hash for equality only |
| **EXPLAIN Plan** | Analyze query execution plan before running |
| **Avoid SELECT *** | Only fetch needed columns |
| **Use EXISTS over IN** | EXISTS short-circuits, IN builds full result set |
| **Partitioning** | Split large tables into manageable chunks |

### Index Types
- **B-Tree Index**: Default, good for range queries and equality
- **Hash Index**: Fast equality lookups, no range support
- **Bitmap Index**: Efficient for low-cardinality columns
- **Clustered Index**: Physically reorders table data (one per table)
- **Non-Clustered Index**: Separate structure pointing to data rows

> 💡 **EXPLAIN ANALYZE** (PostgreSQL) shows actual execution time vs estimated cost. Look for sequential scans on large tables as a red flag.`;

  const dbmsContent3 = `## Normalization

**Normalization** is the process of organizing database tables to reduce redundancy and avoid anomalies.

### Purpose of Normalization
- Eliminate redundant storage
- Avoid insert, update, and delete anomalies
- Ensure data consistency

### Functional Dependencies
An attribute Y is **functionally dependent** on X (X → Y) if each value of X determines exactly one value of Y.

**Armstrong's Axioms:**
1. **Reflexivity**: If Y ⊆ X, then X → Y
2. **Augmentation**: If X → Y, then XZ → YZ
3. **Transitivity**: If X → Y and Y → Z, then X → Z

### Normal Forms

| Normal Form | Condition | Violation Example |
|-------------|-----------|-------------------|
| **1NF** | Atomic values, no repeating groups | Multiple phone numbers in one column |
| **2NF** | 1NF + no partial dependencies | StudentID, CourseID → InstructorName |
| **3NF** | 2NF + no transitive dependencies | EmployeeID → DepartmentID → Building |
| **BCNF** | 3NF + every determinant is a candidate key | Overlapping candidate keys |

### Example: Decomposing to 3NF

**Unnormalized Table:**
\`\`\`
OrderID | CustomerName | ProductName | ProductPrice
1       | Alice        | Laptop      | 1200
1       | Alice        | Mouse       | 25
2       | Bob          | Keyboard    | 80
\`\`\`

**After 3NF Decomposition:**
\`\`\`
Orders:    OrderID | CustomerName
OrderItems: OrderID | ProductName
Products:  ProductName | ProductPrice
\`\`\`

### Denormalization
Intentionally introducing redundancy for performance (fewer JOINs, faster reads) at the cost of write overhead.

> 💡 In practice, databases are usually normalized to 3NF or BCNF, then selectively denormalized based on query patterns.`;

  const dbmsContent4 = `## Transactions & Concurrency Control

A **transaction** is a logical unit of work that contains one or more database operations.

### ACID Properties

| Property | Description |
|----------|-------------|
| **Atomicity** | All operations succeed or all fail (all-or-nothing) |
| **Consistency** | Database transitions from one valid state to another |
| **Isolation** | Concurrent transactions don't interfere with each other |
| **Durability** | Committed changes survive system failures |

### Transaction States
\`\`\`
ACTIVE → PARTIALLY COMMITTED → COMMITTED
   │            │
   ▼            ▼
FAILED → ABORTED
\`\`\`

### Concurrency Problems

| Problem | Description | Example |
|---------|-------------|---------|
| **Dirty Read** | Read uncommitted data from another transaction | T1 writes, T2 reads before T1 commits |
| **Non-Repeatable Read** | Same row read twice gives different values | T1 reads row, T2 updates and commits, T1 reads again |
| **Phantom Read** | Same query returns different rows in same transaction | T1 runs range query, T2 inserts new row, T1 re-runs query |

### Lock-Based Protocols

| Lock Type | Symbol | Description |
|-----------|--------|-------------|
| **Shared (S)** | read-lock | Multiple transactions can read simultaneously |
| **Exclusive (X)** | write-lock | Only one transaction can read/write |

**Two-Phase Locking (2PL):**
1. **Growing Phase**: Acquire all locks, cannot release any
2. **Shrinking Phase**: Release locks, cannot acquire any

**Strict 2PL**: All exclusive locks held until commit — prevents cascading aborts.

### Timestamp-Based Protocols
Each transaction gets a timestamp. Schedule is equivalent to serial order of timestamps.
- **Thomas Write Rule**: Ignore outdated writes to improve concurrency.

### Deadlock in Databases
**Detection**: Wait-for graph — cycle indicates deadlock.
**Resolution**: Choose victim (youngest transaction), rollback and restart.

> 💡 PostgreSQL uses **MVCC (Multi-Version Concurrency Control)** — each transaction sees a snapshot of data, eliminating the need for read locks entirely.`;

  const dbmsTopics = await Promise.all([
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[1].id,
        slug: "database-design-er-models",
        title: "Database Design & ER Models",
        content: dbmsContent1,
        order: 1,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[1].id,
        slug: "sql-query-optimization",
        title: "SQL & Query Optimization",
        content: dbmsContent2,
        order: 2,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[1].id,
        slug: "normalization",
        title: "Normalization",
        content: dbmsContent3,
        order: 3,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[1].id,
        slug: "transactions-concurrency",
        title: "Transactions & Concurrency Control",
        content: dbmsContent4,
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${dbmsTopics.length} DBMS theory topics`);

  const dbmsQuizzes = [
    { topicIdx: 0, question: "Which symbol represents an entity in Chen ER notation?", options: ["Circle", "Rectangle", "Diamond", "Triangle"], answer: 1 },
    { topicIdx: 0, question: "Which key type is selected as the unique identifier for a table?", options: ["Super Key", "Candidate Key", "Primary Key", "Foreign Key"], answer: 2 },
    { topicIdx: 0, question: "What type of relationship requires a junction table?", options: ["One-to-One", "One-to-Many", "Many-to-Many", "All of the above"], answer: 2 },
    { topicIdx: 1, question: "Which SQL JOIN returns all rows from the left table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], answer: 1 },
    { topicIdx: 1, question: "Which index type supports range queries efficiently?", options: ["Hash Index", "Bitmap Index", "B-Tree Index", "Clustered Index"], answer: 2 },
    { topicIdx: 1, question: "What does EXPLAIN in SQL show?", options: ["Query results", "Query execution plan", "Table schema", "Index usage history"], answer: 1 },
    { topicIdx: 2, question: "A table with no repeating groups is in which normal form?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 0 },
    { topicIdx: 2, question: "Which normal form requires removing transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 2 },
    { topicIdx: 2, question: "In functional dependencies, X → Y means:", options: ["X determines Y", "Y determines X", "X and Y are unrelated", "X equals Y"], answer: 0 },
    { topicIdx: 3, question: "Which ACID property ensures concurrent transactions are isolated?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: 2 },
    { topicIdx: 3, question: "What concurrency problem occurs when reading uncommitted data?", options: ["Non-Repeatable Read", "Dirty Read", "Phantom Read", "Lost Update"], answer: 1 },
    { topicIdx: 3, question: "Which phase in 2PL acquires locks without releasing any?", options: ["Shrinking Phase", "Growing Phase", "Lock Phase", "Commit Phase"], answer: 1 },
  ];

  for (const q of dbmsQuizzes) {
    const explanations = [
      "Rectangles represent entities, diamonds represent relationships, ovals represent attributes in Chen notation.",
      "The Primary Key is the chosen candidate key that uniquely identifies each row in a table.",
      "Many-to-Many relationships require a junction/bridge table with foreign keys referencing both related tables.",
      "LEFT JOIN returns all rows from the left table with NULLs where no match exists in the right table.",
      "B-Tree indexes maintain sorted order, supporting both equality and range queries like comparisons and BETWEEN.",
      "EXPLAIN shows the query execution plan including scan type, join method, and estimated costs.",
      "First Normal Form requires atomic (single-valued) attributes and no repeating groups.",
      "Third Normal Form (3NF) removes transitive dependencies where a non-key attribute depends on another non-key attribute.",
      "X → Y means X functionally determines Y — each value of X maps to exactly one value of Y.",
      "Isolation ensures that concurrent transactions appear to execute serially without interference.",
      "Dirty Read occurs when a transaction reads data written by another uncommitted transaction.",
      "In 2PL's Growing Phase, the transaction acquires all needed locks before releasing any.",
    ];
    const topic = dbmsTopics[q.topicIdx];
    await prisma.quiz.create({
      data: {
        topicId: topic.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: explanations[dbmsQuizzes.indexOf(q)],
      },
    });
  }

  console.log(`Created ${dbmsQuizzes.length} DBMS quiz questions`);

  // ─── COMPUTER NETWORKS THEORY TOPICS ──────────────────────────────

  const cnContent1 = `## OSI & TCP/IP Models

Networking models provide a structured approach to understanding how data travels across networks.

### OSI Model (7 Layers)

| Layer | Name | Function | Protocol Examples |
|-------|------|----------|-------------------|
| 7 | **Application** | User interface, network services | HTTP, FTP, SMTP, DNS |
| 6 | **Presentation** | Data translation, encryption, compression | SSL/TLS, JPEG, ASCII |
| 5 | **Session** | Session management, checkpointing | NetBIOS, RPC |
| 4 | **Transport** | End-to-end delivery, error recovery | TCP, UDP |
| 3 | **Network** | Logical addressing, routing | IP, ICMP, ARP |
| 2 | **Data Link** | Framing, MAC addressing | Ethernet, PPP, WiFi |
| 1 | **Physical** | Bit transmission over wire/fiber | RS-232, Ethernet PHY |

### TCP/IP Model (4 Layers)

| Layer | OSI Equivalent | Description |
|-------|----------------|-------------|
| **Application** | L5-L7 | HTTP, DNS, SMTP, FTP |
| **Transport** | L4 | TCP (reliable) and UDP (unreliable, fast) |
| **Internet** | L3 | IP routing, packet forwarding |
| **Network Access** | L1-L2 | Physical and data link protocols |

### Key Differences
- OSI is conceptual (reference model), TCP/IP is practical (implementation)
- OSI has 7 layers, TCP/IP has 4 layers
- TCP/IP combines Application, Presentation, and Session into one layer

### Encapsulation
\`\`\`
[Data] → [TCP Header | Data] → [IP Header | TCP | Data] → [Ethernet Header | IP | TCP | Data | Trailer]
\`\`\`

> 💡 **Mnemonic for OSI layers**: "Please Do Not Throw Sausage Pizza Away" (Physical → Application).`;

  const cnContent2 = `## HTTP/DNS/CDN

### HTTP (Hypertext Transfer Protocol)
HTTP is the foundation of data communication on the Web.

**Request Methods:**
| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| **GET** | Retrieve resource | Yes | Yes |
| **POST** | Create resource | No | No |
| **PUT** | Update/replace | Yes | No |
| **DELETE** | Remove resource | Yes | No |
| **PATCH** | Partial update | No | No |

**Status Codes:**
- **1xx**: Informational (101 Switching Protocols)
- **2xx**: Success (200 OK, 201 Created)
- **3xx**: Redirection (301 Moved, 304 Not Modified)
- **4xx**: Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx**: Server Error (500 Internal, 502 Bad Gateway, 503 Service Unavailable)

### DNS (Domain Name System)
DNS translates human-readable domain names to IP addresses.

**Resolution Steps:**
1. Browser checks local cache
2. Query recurses through: Resolver → Root → TLD → Authoritative nameserver
3. IP address returned and cached (TTL-based)

### CDN (Content Delivery Network)
A distributed network of servers that delivers content based on geographic location.

| Benefit | Description |
|---------|-------------|
| **Low Latency** | Serve from edge node closest to user |
| **Load Reduction** | Offload traffic from origin servers |
| **DDoS Protection** | Absorb and distribute attack traffic |
| **High Availability** | Replicate content across multiple regions |

> 💡 **HTTP/2** introduced multiplexing (multiple streams over one TCP connection), header compression, and server push. HTTP/3 uses QUIC (UDP-based) for even lower latency.`;

  const cnContent3 = `## Routing & Switching

**Routing** determines the path data takes across networks. **Switching** forwards data within a network.

### Routing Protocols

| Protocol | Type | Metric | Algorithm |
|----------|------|--------|-----------|
| **RIP** | Distance Vector | Hop count (max 15) | Bellman-Ford |
| **OSPF** | Link State | Cost (bandwidth-based) | Dijkstra's SPF |
| **EIGRP** | Hybrid | Composite (bandwidth, delay) | DUAL |
| **BGP** | Path Vector | Path attributes | Policy-based |

### Key Routing Concepts
- **Static Routing**: Manually configured, predictable
- **Dynamic Routing**: Automatically adapts to network changes
- **Default Gateway**: Router that forwards traffic to other networks

### Switching Methods
| Method | Description | Latency | Error Checking |
|--------|-------------|---------|----------------|
| **Store-and-Forward** | Receive entire frame, check CRC, then forward | High | Yes |
| **Cut-Through** | Forward as soon as destination MAC is read | Low | No |
| **Fragment-Free** | Forward after first 64 bytes (collision check) | Medium | Partial |

### VLANs (Virtual LANs)
Divide a physical network into logical segments. Benefits:
- **Broadcast control**: Reduce broadcast domain size
- **Security**: Isolate traffic between departments
- **Flexibility**: Logical grouping regardless of physical location

### MAC Address Table
Switches maintain a table mapping MAC addresses to ports. Learning occurs dynamically as frames arrive.

> 💡 **SDN (Software-Defined Networking)** separates the control plane from the data plane, enabling centralized network management and programmability.`;

  const cnContent4 = `## Network Security

Network security protects the integrity, confidentiality, and availability of data during transmission.

### Common Threats

| Threat | Description | Attack Vector |
|--------|-------------|---------------|
| **DDoS** | Overwhelm server with traffic | Botnet, amplification |
| **Man-in-the-Middle** | Intercept communication | ARP spoofing, rogue WiFi |
| **DNS Spoofing** | Cache poisoning with fake DNS | Corrupted resolver cache |
| **Packet Sniffing** | Capture unencrypted traffic | Wireshark on open network |
| **SQL Injection** | Malicious SQL in input fields | Web form, URL params |

### Security Mechanisms

**Firewalls:**
- **Packet Filter**: Inspects headers only (IP, port)
- **Stateful**: Tracks connection state
- **Application/Proxy**: Inspects payload content

**Encryption:**
| Type | Use Case | Examples |
|------|----------|---------|
| **Symmetric** | Bulk encryption (same key) | AES, DES, ChaCha20 |
| **Asymmetric** | Key exchange, digital signatures | RSA, ECC, Diffie-Hellman |

### TLS/SSL Handshake (Simplified)
1. Client sends supported cipher suites + random nonce
2. Server selects cipher, sends certificate (public key)
3. Client verifies certificate, generates pre-master secret
4. Both derive session keys → secure symmetric encryption begins

### Network Security Best Practices
- Use HTTPS everywhere (TLS 1.3+)
- Implement network segmentation
- Enable logging and monitoring (SIEM)
- Regular vulnerability scanning and patching
- Principle of least privilege for access

> 💡 **Zero Trust Security** assumes no implicit trust — verify every request regardless of source. "Never trust, always verify."`;

  const cnTopics = await Promise.all([
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[2].id,
        slug: "osi-tcp-ip-models",
        title: "OSI & TCP/IP Models",
        content: cnContent1,
        order: 1,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[2].id,
        slug: "http-dns-cdn",
        title: "HTTP/DNS/CDN",
        content: cnContent2,
        order: 2,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[2].id,
        slug: "routing-switching",
        title: "Routing & Switching",
        content: cnContent3,
        order: 3,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[2].id,
        slug: "network-security",
        title: "Network Security",
        content: cnContent4,
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${cnTopics.length} Computer Networks theory topics`);

  const cnQuizzes = [
    { topicIdx: 0, question: "Which OSI layer is responsible for routing?", options: ["Data Link", "Network", "Transport", "Application"], answer: 1 },
    { topicIdx: 0, question: "How many layers does the TCP/IP model have?", options: ["5", "4", "7", "3"], answer: 1 },
    { topicIdx: 0, question: "Which protocol operates at the Transport layer?", options: ["IP", "TCP", "Ethernet", "HTTP"], answer: 1 },
    { topicIdx: 1, question: "Which HTTP method is idempotent?", options: ["POST", "PATCH", "DELETE", "Both A and B"], answer: 2 },
    { topicIdx: 1, question: "What is the primary purpose of a CDN?", options: ["Store database backups", "Reduce latency via edge caching", "Encrypt web traffic", "Register domain names"], answer: 1 },
    { topicIdx: 1, question: "Which DNS server holds the final IP mapping for a domain?", options: ["Root Server", "TLD Server", "Authoritative Nameserver", "Recursive Resolver"], answer: 2 },
    { topicIdx: 2, question: "Which routing protocol uses hop count as its metric?", options: ["OSPF", "RIP", "BGP", "EIGRP"], answer: 1 },
    { topicIdx: 2, question: "Which switching method has the lowest latency?", options: ["Store-and-Forward", "Cut-Through", "Fragment-Free", "All equal"], answer: 1 },
    { topicIdx: 2, question: "What does a switch use to make forwarding decisions?", options: ["IP Address", "MAC Address", "Port Number", "URL"], answer: 1 },
    { topicIdx: 3, question: "What type of attack overwhelms a server with traffic?", options: ["MITM", "DDoS", "Phishing", "SQL Injection"], answer: 1 },
    { topicIdx: 3, question: "Which encryption type uses the same key for encryption and decryption?", options: ["Asymmetric", "Symmetric", "Hash", "Digital Signature"], answer: 1 },
    { topicIdx: 3, question: "What protocol secures web traffic with TLS?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], answer: 1 },
  ];

  for (const q of cnQuizzes) {
    const explanations = [
      "The Network layer (Layer 3) handles logical addressing and routing via protocols like IP and OSPF.",
      "The TCP/IP model has 4 layers: Application, Transport, Internet, and Network Access.",
      "TCP (Transmission Control Protocol) operates at the Transport layer providing reliable data delivery.",
      "DELETE is idempotent — calling it multiple times has the same effect as calling it once.",
      "CDNs reduce latency by caching static content at edge servers geographically closer to users.",
      "The Authoritative Nameserver holds the actual DNS records (A, AAAA, CNAME) for a domain.",
      "RIP (Routing Information Protocol) uses hop count with a maximum of 15 hops.",
      "Cut-Through forwards the frame as soon as the destination MAC is read, before full frame arrives.",
      "Switches forward based on MAC addresses stored in their CAM table, learned from incoming frames.",
      "DDoS (Distributed Denial of Service) overwhelms a target with traffic from multiple sources.",
      "Symmetric encryption uses one shared key for both encryption and decryption (e.g., AES).",
      "HTTPS (HTTP over TLS) encrypts web traffic using TLS/SSL for secure communication.",
    ];
    const topic = cnTopics[q.topicIdx];
    await prisma.quiz.create({
      data: {
        topicId: topic.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: explanations[cnQuizzes.indexOf(q)],
      },
    });
  }

  console.log(`Created ${cnQuizzes.length} Computer Networks quiz questions`);

  // ─── COMPILER DESIGN THEORY TOPICS ────────────────────────────────

  const cdContent1 = `## Lexical Analysis

**Lexical Analysis** is the first phase of a compiler. It reads source code and produces tokens.

### Role of the Lexical Analyzer
- Remove whitespace, comments, and preprocessor directives
- Break source code into meaningful tokens
- Report lexical errors (invalid identifiers, unterminated strings)
- Interact with the symbol table

### Tokens, Lexemes, and Patterns

| Term | Definition | Example |
|------|------------|---------|
| **Token** | A syntactic category | Keyword, Identifier, Number |
| **Lexeme** | Sequence of characters matching a token pattern | \`while\`, \`count\`, \`42\` |
| **Pattern** | Rule describing valid lexemes | Regex like \`[a-zA-Z_][a-zA-Z0-9_]*\` |

### Token Types
- **Keywords**: \`if\`, \`else\`, \`while\`, \`return\`, \`int\`
- **Identifiers**: Variable names, function names
- **Literals**: Numbers, strings, booleans
- **Operators**: \`+\`, \`-\`, \`*\`, \`/\`, \`==\`
- **Delimiters**: \`(\`, \`)\`, \`{\`, \`}\`, \`;\`

### Implementation Techniques
1. **Finite Automata**: Deterministic (DFA) or Non-deterministic (NFA)
2. **Regular Expressions**: Define patterns for token recognition
3. **Lex/Lexer Generators**: Tools like Lex, Flex that convert regex to DFA

### Example: DFA for Integer Literals
\`\`\`
State 0 (Start): digit → State 1
State 1:          digit → State 1
                  non-digit → Accept
\`\`\`

### Error Handling
- **Panic Mode**: Skip characters until a synchronizing token is found
- **Error Production**: Augment grammar with common error patterns
- **Global Correction**: Find minimal edit to fix the input

> 💡 **Flex** (Fast Lexical Analyzer) generates efficient C code for lexical analysis by translating regex patterns into a DFA.`;

  const cdContent2 = `## Syntax Analysis & Parsing

**Syntax Analysis** (parsing) verifies that the token stream follows the grammar rules of the language.

### Context-Free Grammar (CFG)
A CFG is defined by: G = (V, T, P, S)
- **V**: Set of non-terminals
- **T**: Set of terminals (tokens)
- **P**: Production rules (A → α)
- **S**: Start symbol

### Parse Trees & Derivations

**Example Grammar:**
\`\`\`
E → E + T | T
T → T * F | F
F → (E) | id
\`\`\`

**Parse Tree for \`id + id * id\`:**
\`\`\`
      E
    / | \
   E  +  T
   |    /|\
   T   T * F
   |   |   |
   F   F  id
   |   |
   id  id
\`\`\`

### Top-Down vs Bottom-Up Parsing

| Aspect | Top-Down | Bottom-Up |
|--------|----------|-----------|
| **Approach** | Start from S, expand to input | Start from input, reduce to S |
| **Strategy** | Predict which production to use | Shift tokens, then reduce |
| **Example** | Recursive Descent, LL(1) | LR(1), LALR(1) |
| **Implementation** | Easier, hand-written | More complex, parser generators |

### LL(1) Parsing Table
Predictive parsing uses a table to decide production based on current non-terminal and lookahead token.

**FIRST and FOLLOW Sets:**
- **FIRST(X)**: Set of terminals that begin strings derived from X
- **FOLLOW(A)**: Set of terminals that can appear immediately after A

### Bottom-Up LR Parsing
| Parser Type | Power | Complexity |
|-------------|-------|------------|
| **LR(0)** | Weakest | Smallest table |
| **SLR(1)** | Simple LR | Medium |
| **LALR(1)** | Look-Ahead LR | Popular (YACC, Bison) |
| **LR(1)** | Most powerful | Large tables |

> 💡 Most programming languages use **LALR(1)** or hand-written **recursive descent** parsers. GCC moved from YACC (LALR) to a hand-written recursive descent parser for better error messages.`;

  const cdContent3 = `## Semantic Analysis & Intermediate Representation

**Semantic Analysis** checks the meaning and consistency of the parsed code. **IR** bridges the gap between source and target code.

### Type Checking
- **Static**: Checked at compile time (C, Java, TypeScript)
- **Dynamic**: Checked at runtime (Python, JavaScript)
- **Strong**: No implicit type coercion (Java, Rust)
- **Weak**: Allows implicit conversions (C, JavaScript)

### Semantic Actions
1. **Type Checking**: Verify operand types match operator expectations
2. **Scope Resolution**: Associate variable uses with their declarations
3. **Type Coercion**: Insert implicit type conversions when needed
4. **Symbol Table Management**: Add, lookup, and update entries

### Abstract Syntax Tree (AST)
Unlike a parse tree, AST omits syntactic details (parentheses, semicolons):

\`\`\`
Parse Tree:           AST:
   E                    +
 / | \                 / \
E  +  T               x   *
|    /|\                  / \
T   T * F                y   z
|   |   |
F   F  id(y)
|   |
id  id(z)
(x)
\`\`\`

### Intermediate Representations

| IR Type | Description | Example |
|---------|-------------|---------|
| **Three-Address Code (TAC)** | At most one operator per instruction | \`t1 = x + y\` |
| **Static Single Assignment (SSA)** | Each variable assigned exactly once | \`t1 = x + y; t2 = t1 * z\` |
| **Control Flow Graph (CFG)** | Basic blocks connected by edges | Node for each block |

### Example: TAC for \`a = b * c + d\`
\`\`\`
t1 = b * c
t2 = t1 + d
a = t2
\`\`\`

### Symbol Table
A data structure that stores information about identifiers:
- Name, type, scope level, memory location
- Line number of declaration
- Usually implemented as a hash table or tree

> 💡 **SSA form** is used by LLVM and GCC's GIMPLE IR. It simplifies optimizations like constant propagation and dead code elimination.`;

  const cdContent4 = `## Code Optimization & Generation

**Code optimization** improves program performance without changing semantics. **Code generation** produces target machine code.

### Optimization Levels
| Level | Name | Examples |
|-------|------|----------|
| **O0** | No optimization | Fast compilation, slow code |
| **O1** | Basic optimizations | Peephole, constant folding |
| **O2** | Standard optimizations | Loop unrolling, inlining |
| **O3** | Aggressive optimizations | Vectorization, heavy inlining |
| **Os** | Size optimization | Reduce code size |

### Machine-Independent Optimizations

**Constant Folding:**
\`\`\`
// Before:        // After:
x = 2 * 3;        x = 6;
\`\`\`

**Constant Propagation:**
\`\`\`
// Before:              // After:
x = 5;                  x = 5;
y = x + 3;              y = 8;
\`\`\`

**Dead Code Elimination:**
\`\`\`
// Before:        // After:
if (false) {      // removed
  y = 10;
}
\`\`\`

**Loop Invariant Code Motion:**
\`\`\`
// Before:                // After:
for (i = 0; i < n; i++) { int t = a * b;
  x = a * b + i;          for (i = 0; i < n; i++) {
}                           x = t + i;
                          }
\`\`\`

### Machine-Dependent Optimizations
- **Register Allocation**: Assign variables to CPU registers (graph coloring)
- **Instruction Scheduling**: Reorder instructions to avoid pipeline stalls
- **Peephole Optimization**: Replace instruction patterns with faster equivalents

### Code Generation Phases
1. **Instruction Selection**: Map IR to target instructions
2. **Register Allocation**: Assign temporaries to registers (Chaitin's algorithm)
3. **Instruction Scheduling**: Optimize for pipeline and cache

### Basic Block & Flow Graph
A **basic block** is a straight-line sequence with no branches in/out (except entry/exit). The flow graph connects blocks based on control flow.

> 💡 **LLVM** uses a three-phase design: frontend (Clang) → IR (LLVM IR) → backend. This allows supporting multiple languages with multiple targets from one optimization framework.`;

  const cdTopics = await Promise.all([
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[3].id,
        slug: "lexical-analysis",
        title: "Lexical Analysis",
        content: cdContent1,
        order: 1,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[3].id,
        slug: "syntax-analysis-parsing",
        title: "Syntax Analysis & Parsing",
        content: cdContent2,
        order: 2,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[3].id,
        slug: "semantic-analysis-ir",
        title: "Semantic Analysis & Intermediate Representation",
        content: cdContent3,
        order: 3,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[3].id,
        slug: "code-optimization-generation",
        title: "Code Optimization & Generation",
        content: cdContent4,
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${cdTopics.length} Compiler Design theory topics`);

  const cdQuizzes = [
    { topicIdx: 0, question: "Which phase of a compiler produces tokens?", options: ["Syntax Analysis", "Lexical Analysis", "Semantic Analysis", "Code Generation"], answer: 1 },
    { topicIdx: 0, question: "What is the sequence of characters that matches a token pattern called?", options: ["Token", "Lexeme", "Pattern", "Lexicon"], answer: 1 },
    { topicIdx: 0, question: "Which automaton is typically used for lexical analysis?", options: ["Pushdown Automaton", "Turing Machine", "Finite Automaton", "Linear Bounded Automaton"], answer: 2 },
    { topicIdx: 1, question: "Which parsing method starts from the start symbol and expands to match input?", options: ["Bottom-Up", "Top-Down", "Shift-Reduce", "LR Parsing"], answer: 1 },
    { topicIdx: 1, question: "What does FIRST(X) represent in parsing?", options: ["Terminals following X", "Terminals starting strings derived from X", "All terminals in grammar", "Non-terminals reachable from X"], answer: 1 },
    { topicIdx: 1, question: "Which parser type is most powerful?", options: ["LR(0)", "SLR(1)", "LALR(1)", "LR(1)"], answer: 3 },
    { topicIdx: 2, question: "What does semantic analysis primarily check?", options: ["Syntax correctness", "Type compatibility", "Code efficiency", "Register allocation"], answer: 1 },
    { topicIdx: 2, question: "Which IR form assigns each variable exactly once?", options: ["Three-Address Code", "AST", "SSA", "CFG"], answer: 2 },
    { topicIdx: 2, question: "What is the key difference between a parse tree and an AST?", options: ["AST omits syntactic details", "AST is always larger", "Parse tree has fewer nodes", "They are the same"], answer: 0 },
    { topicIdx: 3, question: "Which optimization replaces 2 * 3 with 6 at compile time?", options: ["Constant Propagation", "Constant Folding", "Dead Code Elimination", "Loop Invariant Motion"], answer: 1 },
    { topicIdx: 3, question: "What does O2 optimization level typically include?", options: ["No optimization", "Basic optimizations", "Standard optimizations", "Aggressive optimizations"], answer: 2 },
    { topicIdx: 3, question: "Which algorithm is commonly used for register allocation?", options: ["Dijkstra's", "Graph Coloring", "Dynamic Programming", "Binary Search"], answer: 1 },
  ];

  for (const q of cdQuizzes) {
    const explanations = [
      "Lexical Analysis (scanning) is the first compiler phase that converts source code into tokens.",
      "A lexeme is the actual sequence of characters matching a token pattern (e.g., 'while' is a lexeme for WHILE token).",
      "Finite Automata (DFA/NFA) are used in lexical analysis to recognize token patterns from regular expressions.",
      "Top-down parsing starts from the start symbol and applies productions to match the input string.",
      "FIRST(X) is the set of terminals that can appear at the beginning of strings derived from X.",
      "LR(1) is the most powerful LR parser variant, with the largest table size but broadest language recognition.",
      "Semantic Analysis checks type compatibility, scope rules, and other context-sensitive aspects of code.",
      "SSA (Static Single Assignment) ensures each variable is assigned exactly once, simplifying optimizations.",
      "AST omits punctuation, parentheses, and other syntactic details, keeping only the semantic structure.",
      "Constant Folding evaluates constant expressions at compile time (e.g., 2 * 3 → 6).",
      "O2 enables standard optimizations including loop unrolling, function inlining, and common subexpression elimination.",
      "Graph Coloring is used to assign variables to a limited set of registers while minimizing spills.",
    ];
    const topic = cdTopics[q.topicIdx];
    await prisma.quiz.create({
      data: {
        topicId: topic.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: explanations[cdQuizzes.indexOf(q)],
      },
    });
  }

  console.log(`Created ${cdQuizzes.length} Compiler Design quiz questions`);

  // ─── DSA THEORY TOPICS ──────────────────────────────────────────────

  const dsaTheoryContent1 = `## Arrays & Linked Lists

### Arrays
An **array** stores elements of the same type in contiguous memory locations. Provides O(1) random access.

**Operations Complexity:**
| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| Access | O(1) | Direct index lookup |
| Search | O(n) | Linear scan |
| Insert (end) | O(1)* | Amortized constant |
| Insert (middle) | O(n) | Shift elements |
| Delete | O(n) | Shift elements |

**Dynamic Arrays (ArrayList, Vector):**
- Double capacity when full (amortized O(1) append)
- Python list, Java ArrayList, C++ std::vector

### Linked Lists
A **linked list** stores elements as nodes, each pointing to the next node.

| Type | Description | Memory |
|------|-------------|--------|
| **Singly Linked** | Each node has data + next pointer | O(n) + one pointer per node |
| **Doubly Linked** | Each node has prev + next pointers | O(n) + two pointers per node |
| **Circular** | Last node points back to first | Same as singly/doubly |

**Operations Complexity:**
| Operation | Array | Singly Linked List |
|-----------|-------|--------------------|
| Access | O(1) | O(n) |
| Insert at head | O(n) | O(1) |
| Insert at tail | O(1)* | O(n) (O(1) with tail) |
| Delete | O(n) | O(n) |

### Two-Pointer Technique
A common pattern for linked list problems:
\`\`\`
# Check cycle: slow/fast pointers
slow = slow.next
fast = fast.next.next

# Find middle: slow/fast pointers
slow = slow.next  # when fast reaches end, slow is at middle
fast = fast.next.next
\`\`\`

> 💡 Arrays win on random access and cache locality. Linked lists win on frequent insertions/deletions at known positions.`;

  const dsaTheoryContent2 = `## Trees & Graphs

### Binary Trees
Each node has at most two children (left and right).

**Traversal Methods:**
| Traversal | Order | Use Case |
|-----------|-------|----------|
| **Inorder** | Left → Root → Right | Sorted output (BST) |
| **Preorder** | Root → Left → Right | Tree copy, serialization |
| **Postorder** | Left → Right → Root | Tree deletion |
| **Level Order** | BFS layer by layer | Shortest path |

### Binary Search Tree (BST)
For each node: left subtree ≤ node ≤ right subtree.
- Search: O(h) where h = height
- Insert: O(h)
- Delete: O(h)
- Balanced BST (AVL, Red-Black): O(log n)

### Graph Representations
| Representation | Space | Edge Query | Add Edge |
|---------------|-------|------------|----------|
| **Adjacency Matrix** | O(V²) | O(1) | O(1) |
| **Adjacency List** | O(V + E) | O(degree) | O(1) |

### Graph Traversal

**DFS (Depth-First Search):**
\`\`\`
void dfs(Node u, Set visited) {
  visited.add(u);
  for (Node v : u.neighbors) {
    if (!visited.contains(v)) dfs(v, visited);
  }
}
\`\`\`
- Uses stack (recursive or explicit)
- Applications: Topological sort, cycle detection, connected components

**BFS (Breadth-First Search):**
\`\`\`
void bfs(Node start) {
  Queue q = new Queue();
  q.enqueue(start);
  while (!q.isEmpty()) {
    Node u = q.dequeue();
    for (Node v : u.neighbors) {
      if (!visited.contains(v)) q.enqueue(v);
    }
  }
}
\`\`\`
- Uses queue
- Applications: Shortest path (unweighted), level order

### Important Graph Algorithms
| Algorithm | Problem | Complexity |
|-----------|---------|------------|
| Dijkstra | Shortest path (weighted) | O((V+E) log V) |
| Bellman-Ford | Shortest path (negative weights) | O(VE) |
| Floyd-Warshall | All-pairs shortest path | O(V³) |
| Kruskal/Prim | Minimum spanning tree | O(E log V) |
| Topological Sort | Linear ordering (DAG) | O(V + E) |

> 💡 A tree is a connected acyclic graph with V-1 edges. A binary tree can be represented using arrays (heap) or nodes (pointers).`;

  const dsaTheoryContent3 = `## Sorting & Searching

### Sorting Algorithms Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | No |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| **Counting Sort** | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |

### Quick Sort (Partition)
\`\`\`
      [3, 7, 8, 5, 2, 1, 9, 6]
           pivot = 5
         /            \
    [3, 2, 1]      [7, 8, 9, 6]
     pivot=2         pivot=8
     /    \          /     \
  [1]    [3]      [6,7]   [9]
                    /  \
                  [6]  [7]
\`\`\`

### Merge Sort (Divide & Conquer)
\`\`\`
      [38, 27, 43, 3, 9, 82, 10]
      /        |         |       \
 [38,27,43]  [3,9,82,10]    (split)
   /    \     /        \
[38] [27,43] [3,9] [82,10]     (split further)
     /  \     / \    /  \
   [27] [43] [3] [9] [82][10]  (merge sorted)
\`\`\`

### Binary Search
Searches a sorted array in O(log n) time:
\`\`\`
int binarySearch(int[] arr, int target) {
  int lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
\`\`\`

**Variants:**
- Lower bound: first index ≥ target
- Upper bound: first index > target
- Search in rotated array

> 💡 Python's \`sorted()\` uses **Timsort** (hybrid of merge and insertion sort) — O(n log n) worst case, O(n) best case for nearly sorted data.`;

  const dsaTheoryContent4 = `## Dynamic Programming

**Dynamic Programming (DP)** solves problems by breaking them into overlapping subproblems and storing results.

### When to Use DP
1. **Optimal Substructure**: Optimal solution contains optimal sub-solutions
2. **Overlapping Subproblems**: Same subproblems are solved repeatedly

### Top-Down vs Bottom-Up

| Aspect | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|--------|----------------------|----------------------|
| **Approach** | Recursion + cache | Iterative table filling |
| **Space** | O(n) recursion + O(n) table | O(n) table only |
| **Ease** | More intuitive | More efficient |
| **When** | All subproblems not needed | All subproblems must be solved |

### Classic DP Patterns

**1. Fibonacci:**
\`\`\`
// Top-Down
int fib(int n, int[] memo) {
  if (n <= 1) return n;
  if (memo[n] != 0) return memo[n];
  return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}
\`\`\`

**2. 0/1 Knapsack:**
\`\`\`
dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)
\`\`\`

**3. Longest Common Subsequence (LCS):**
\`\`\`
if (a[i] == b[j]) dp[i][j] = 1 + dp[i-1][j-1]
else dp[i][j] = max(dp[i-1][j], dp[i][j-1])
\`\`\`

### Common DP Problems

| Problem | State Definition | Complexity |
|---------|-----------------|------------|
| **Coin Change** | dp[i] = min coins for amount i | O(n × amount) |
| **Edit Distance** | dp[i][j] = edits for strings[0..i][0..j] | O(m × n) |
| **LIS** | dp[i] = length of LIS ending at i | O(n²) |
| **Matrix Chain** | dp[i][j] = min cost for matrices i..j | O(n³) |

### DP Optimization Techniques
- **Kadane's Algorithm**: O(1) space for maximum subarray
- **Space Optimization**: Reduce 2D DP to 1D when only previous row is needed
- **Divide & Conquer DP**: For certain recurrence relations (Knuth optimization)

> 💷 **"Those who cannot remember the past are condemned to repeat it."** — Memoization ensures we don't recompute solved subproblems.`;

  const dsaTheoryTopics = await Promise.all([
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[4].id,
        slug: "arrays-linked-lists",
        title: "Arrays & Linked Lists",
        content: dsaTheoryContent1,
        order: 1,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[4].id,
        slug: "trees-graphs",
        title: "Trees & Graphs",
        content: dsaTheoryContent2,
        order: 2,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[4].id,
        slug: "sorting-searching",
        title: "Sorting & Searching",
        content: dsaTheoryContent3,
        order: 3,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[4].id,
        slug: "dynamic-programming",
        title: "Dynamic Programming",
        content: dsaTheoryContent4,
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${dsaTheoryTopics.length} DSA theory topics`);

  const dsaTheoryQuizzes = [
    { topicIdx: 0, question: "What is the time complexity of array access by index?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0 },
    { topicIdx: 0, question: "Which linked list variant allows traversal in both directions?", options: ["Singly Linked", "Doubly Linked", "Circular", "Both B and C"], answer: 1 },
    { topicIdx: 0, question: "What is the time complexity of inserting at the head of a singly linked list?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0 },
    { topicIdx: 1, question: "Which traversal produces sorted output for a BST?", options: ["Preorder", "Inorder", "Postorder", "Level Order"], answer: 1 },
    { topicIdx: 1, question: "Which graph algorithm finds the shortest path in an unweighted graph?", options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"], answer: 1 },
    { topicIdx: 1, question: "What is the space complexity of an adjacency matrix?", options: ["O(V)", "O(E)", "O(V²)", "O(V+E)"], answer: 2 },
    { topicIdx: 2, question: "Which sorting algorithm has O(n log n) worst-case time complexity?", options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"], answer: 2 },
    { topicIdx: 2, question: "What is the time complexity of binary search?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1 },
    { topicIdx: 2, question: "Which sorting algorithm is NOT in-place?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], answer: 2 },
    { topicIdx: 3, question: "DP is applicable when a problem has:", options: ["Optimal substructure only", "Overlapping subproblems only", "Both optimal substructure and overlapping subproblems", "Greedy property"], answer: 2 },
    { topicIdx: 3, question: "In the 0/1 Knapsack DP, dp[i][w] represents:", options: ["Max value with i items and w capacity", "Min weight for i items", "Max items with w capacity", "Number of ways"], answer: 0 },
    { topicIdx: 3, question: "Which approach uses recursion with a cache?", options: ["Tabulation", "Memoization", "Greedy", "Divide and Conquer"], answer: 1 },
  ];

  for (const q of dsaTheoryQuizzes) {
    const explanations = [
      "Array access by index is O(1) because elements are stored contiguously and accessed via offset calculation.",
      "Doubly Linked Lists have both prev and next pointers, enabling traversal in both directions.",
      "Inserting at the head of a singly linked list is O(1) — just update the head pointer and next reference.",
      "Inorder traversal (Left-Root-Right) of a BST visits nodes in ascending sorted order.",
      "BFS finds the shortest path in unweighted graphs because it explores level by level.",
      "Adjacency matrix requires O(V²) space to store all possible edges regardless of actual edges.",
      "Merge Sort guarantees O(n log n) in all cases (best, average, worst) but requires O(n) extra space.",
      "Binary search halves the search space each iteration, giving O(log n) time complexity.",
      "Merge Sort requires O(n) extra space for merging, unlike in-place sorts like Quick Sort or Heap Sort.",
      "DP requires both optimal substructure and overlapping subproblems to be beneficial over divide-and-conquer.",
      "dp[i][w] represents the maximum value achievable using first i items with knapsack capacity w.",
      "Memoization is a top-down DP approach that caches recursive results to avoid redundant calculations.",
    ];
    const topic = dsaTheoryTopics[q.topicIdx];
    await prisma.quiz.create({
      data: {
        topicId: topic.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: explanations[dsaTheoryQuizzes.indexOf(q)],
      },
    });
  }

  console.log(`Created ${dsaTheoryQuizzes.length} DSA theory quiz questions`);

  // ─── SYSTEM DESIGN THEORY TOPICS ────────────────────────────────────

  const sdContent1 = `## Distributed Systems

A **distributed system** is a collection of independent computers that appears as a single coherent system to users.

### Key Characteristics
- **Concurrency**: Multiple nodes operate simultaneously
- **No Global Clock**: Each node has its own local clock
- **Independent Failures**: Nodes can fail independently
- **Heterogeneity**: Different hardware, OS, protocols

### CAP Theorem
A distributed system can satisfy at most two of three properties:

| Property | Description |
|----------|-------------|
| **C**onsistency | All nodes see the same data at the same time |
| **A**vailability | Every request receives a response (success/failure) |
| **P**artition Tolerance | System continues despite network failures |

**Trade-offs:**
- **CP System**: Consistency + Partition Tolerance (banking, payments)
- **AP System**: Availability + Partition Tolerance (social media, DNS)
- **CA System**: Consistency + Availability (impossible in distributed systems)

### Consistency Models

| Model | Description |
|-------|-------------|
| **Strong** | All reads see latest write |
| **Eventual** | Reads eventually converge (DNS) |
| **Causal** | Causally related operations seen in order |
| **Read-Your-Writes** | Always see your own writes |

### Consensus Algorithms
- **Paxos**: Classic consensus, complex to implement
- **Raft**: Understandable consensus with leader election
- **Zab**: Used by Apache ZooKeeper

### Distributed System Patterns
- **Leader Election**: One node coordinates (Raft)
- **Distributed Locking**: Mutual exclusion across nodes (ZooKeeper, etcd)
- **Heartbeat**: Nodes periodically signal they are alive

> 💡 **Fallacies of Distributed Computing** (L. Peter Deutsch): Network is reliable, latency is zero, bandwidth is infinite, network is secure, topology doesn't change, one administrator, transport cost is zero, network is homogeneous.`;

  const sdContent2 = `## Scalability & Load Balancing

**Scalability** is the ability of a system to handle growing load by adding resources.

### Vertical vs Horizontal Scaling

| Aspect | Vertical (Scale Up) | Horizontal (Scale Out) |
|--------|-------------------|----------------------|
| **Approach** | Add more power to existing machine | Add more machines |
| **Limit** | Hardware ceiling | Theoretically unlimited |
| **Cost** | Expensive per increment | Lower cost per unit |
| **Complexity** | Simple | Complex (distributed) |
| **Downtime** | Often requires restart | No downtime |

### Load Balancing Algorithms

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| **Round Robin** | Distributes requests sequentially | Equal capacity servers |
| **Least Connections** | Sends to server with fewest active connections | Variable session lengths |
| **IP Hash** | Same client → same server (sticky sessions) | Session persistence |
| **Weighted** | Servers with higher capacity get more load | Heterogeneous servers |
| **Geographic** | Route based on client location | Global deployments |

### Microservices vs Monolith

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| **Deployment** | Single unit | Independent services |
| **Scaling** | Scale entire app | Scale individual services |
| **Development** | Simple initially | Complex orchestration |
| **Communication** | In-process calls | Network calls (RPC/messaging) |
| **Data** | Single database | Database per service |

### Rate Limiting
- **Token Bucket**: Allow bursts up to capacity
- **Leaky Bucket**: Smooth out requests at constant rate
- **Sliding Window**: Count requests in recent time window

### Auto-Scaling
Automatically add/remove resources based on metrics (CPU, memory, request queue depth).

> 💡 **Facebook** serves billions of users using horizontal scaling with a combination of sharding, caching, and load balancing across global data centers.`;

  const sdContent3 = `## Databases & Storage

### SQL vs NoSQL

| Aspect | SQL (Relational) | NoSQL |
|--------|-----------------|-------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Relations** | JOINs, foreign keys | Embedded documents, references |
| **ACID** | Full support | Often BASE (Basically Available, Soft state, Eventually consistent) |
| **Scaling** | Vertical (mostly) | Horizontal (native) |
| **Examples** | PostgreSQL, MySQL | MongoDB, Cassandra, Redis |

### Database Scaling Strategies

**1. Read Replicas**
- Primary handles writes, replicas handle reads
- Eventually consistent (replication lag)
- Good for read-heavy workloads

**2. Sharding (Horizontal Partitioning)**
- Split data across multiple databases based on shard key
- Improves write throughput
- Challenges: rebalancing, cross-shard queries

**3. Partitioning (Table-level)**
- Range partitioning: split by value ranges
- List partitioning: split by discrete values
- Hash partitioning: distribute by hash of partition key

### Indexing Strategies
- **Composite Indexes**: Cover multiple query columns
- **Covering Index**: Contains all columns needed by a query
- **Partial Index**: Indexes only a subset of rows (WHERE clause)

### Storage Engines
| Engine | Structure | Use Case |
|--------|-----------|----------|
| **B-Tree** | Balanced tree | General purpose (InnoDB) |
| **LSM-Tree** | Log-structured merge | Write-heavy workloads (LevelDB, RocksDB) |
| **Columnar** | Column-oriented storage | Analytics (ClickHouse) |

### CQRS (Command Query Responsibility Segregation)
Separate read models from write models — optimize each independently.

> 💡 **Amazon DynamoDB** uses a combination of consistent hashing (for sharding), replication (for durability), and SSTables (for storage).`;

  const sdContent4 = `## Caching & CDNs

**Caching** stores frequently accessed data in fast,就近 memory to reduce latency and database load.

### Caching Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Cache-Aside** | App checks cache first, then DB on miss | General purpose |
| **Read-Through** | Cache automatically loads from DB on miss | Consistent caching |
| **Write-Through** | Write to cache and DB simultaneously | Data consistency |
| **Write-Behind** | Write to cache, async write to DB | Write performance |
| **Write-Around** | Write directly to DB, cache on read | Rarely read data |

### Cache Eviction Policies

| Policy | Description |
|--------|-------------|
| **LRU** (Least Recently Used) | Evict item not used for longest time |
| **LFU** (Least Frequently Used) | Evict least accessed item |
| **FIFO** | Evict oldest item regardless of usage |
| **TTL** (Time To Live) | Evict after expiration |
| **Random** | Evict random item |

### Distributed Caching
- **Redis**: In-memory data store with persistence, pub/sub, and data structures
- **Memcached**: Simple, fast, distributed memory object caching
- **CDN**: Edge caching for static assets (Cloudflare, Akamai, CloudFront)

### Cache Invalidation — The Hard Problem
1. **TTL-based**: Set expiration time, accept stale data
2. **Event-driven**: Invalidate cache entries when data changes
3. **Version-based**: Include version number in cache keys

### Cache Performance Metrics
| Metric | Description |
|--------|-------------|
| **Hit Ratio** | % of requests served from cache |
| **Miss Ratio** | % of requests going to origin |
| **Latency** | Time to serve cached vs uncached |
| **Thundering Herd** | Many concurrent cache misses on the same key |

### CDN Architecture
\`\`\`
User → Edge Node (PoP) → Regional Cache → Origin Server
                              ↓
                        Cache Hit → Return Content
                        Cache Miss → Fetch from Origin
\`\`\`

> 💡 **Cloudflare** operates one of the largest CDNs with edge nodes in 330+ cities, serving ~20% of all web traffic.`;

  const sdTopics = await Promise.all([
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[5].id,
        slug: "distributed-systems",
        title: "Distributed Systems",
        content: sdContent1,
        order: 1,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[5].id,
        slug: "scalability-load-balancing",
        title: "Scalability & Load Balancing",
        content: sdContent2,
        order: 2,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[5].id,
        slug: "databases-storage",
        title: "Databases & Storage",
        content: sdContent3,
        order: 3,
      },
    }),
    prisma.theoryTopic.create({
      data: {
        subjectId: subjects[5].id,
        slug: "caching-cdns",
        title: "Caching & CDNs",
        content: sdContent4,
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${sdTopics.length} System Design theory topics`);

  const sdQuizzes = [
    { topicIdx: 0, question: "Which distributed system property ensures every read receives the most recent write?", options: ["Availability", "Consistency", "Partition Tolerance", "Durability"], answer: 1 },
    { topicIdx: 0, question: "Which consensus algorithm is designed to be more understandable than Paxos?", options: ["Zab", "Raft", "Paxos", "PBFT"], answer: 1 },
    { topicIdx: 0, question: "What does CAP Theorem state?", options: ["Can have all three properties", "Only two of three properties can be satisfied", "Only one property can be satisfied", "None of the properties are achievable"], answer: 1 },
    { topicIdx: 1, question: "Which scaling approach adds more machines to a system?", options: ["Vertical Scaling", "Horizontal Scaling", "Diagonal Scaling", "Inverse Scaling"], answer: 1 },
    { topicIdx: 1, question: "Which load balancing algorithm sends requests sequentially to each server?", options: ["Least Connections", "Round Robin", "IP Hash", "Weighted"], answer: 1 },
    { topicIdx: 1, question: "What is a disadvantage of microservices?", options: ["Single point of failure", "Complex orchestration", "Monolithic deployment", "Shared database"], answer: 1 },
    { topicIdx: 2, question: "Which NoSQL property set describes BASE?", options: ["Atomic, Consistent, Isolated, Durable", "Basically Available, Soft state, Eventually consistent", "Balanced, Atomic, Synchronized, Efficient", "Batch, Async, Sequential, Eventual"], answer: 1 },
    { topicIdx: 2, question: "What database scaling strategy splits data across multiple databases?", options: ["Replication", "Sharding", "Indexing", "Caching"], answer: 1 },
    { topicIdx: 2, question: "Which storage engine is best for write-heavy workloads?", options: ["B-Tree", "LSM-Tree", "Columnar", "Heap"], answer: 1 },
    { topicIdx: 3, question: "Which caching strategy writes to cache and DB simultaneously?", options: ["Cache-Aside", "Write-Through", "Write-Behind", "Write-Around"], answer: 1 },
    { topicIdx: 3, question: "Which cache eviction policy removes the item not used for the longest time?", options: ["FIFO", "LFU", "LRU", "TTL"], answer: 2 },
    { topicIdx: 3, question: "What does cache hit ratio measure?", options: ["% of requests that miss the cache", "% of requests served from cache", "Cache memory usage", "Average response time"], answer: 1 },
  ];

  for (const q of sdQuizzes) {
    const explanations = [
      "Consistency in CAP means all nodes see the same data at the same time — every read returns the latest write.",
      "Raft is designed for understandability with clear leader election, log replication, and safety mechanisms.",
      "CAP Theorem states a distributed system can only satisfy two of three: Consistency, Availability, and Partition Tolerance.",
      "Horizontal scaling adds more machines/nodes to distribute load across a larger cluster.",
      "Round Robin distributes requests sequentially across servers in a fixed circular order.",
      "Microservices require complex orchestration for service discovery, inter-service communication, and deployment.",
      "BASE stands for Basically Available, Soft state, Eventually consistent — the NoSQL equivalent of ACID.",
      "Sharding splits data horizontally across multiple database instances based on a shard key.",
      "LSM-Tree is optimized for write-heavy workloads by sequential writes to log files with periodic compaction.",
      "Write-Through writes to both cache and database simultaneously, ensuring strong consistency between them.",
      "LRU (Least Recently Used) evicts the item that has not been accessed for the longest time.",
      "Cache hit ratio is the percentage of requests successfully served from the cache without hitting origin.",
    ];
    const topic = sdTopics[q.topicIdx];
    await prisma.quiz.create({
      data: {
        topicId: topic.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: explanations[sdQuizzes.indexOf(q)],
      },
    });
  }

  console.log(`Created ${sdQuizzes.length} System Design quiz questions`);

  // ─── SHEETS ─────────────────────────────────────────────────────────

  const sheets = await Promise.all([
    prisma.sheet.create({
      data: {
        slug: "blind-75",
        title: "Blind 75",
        description: "The 75 most frequently asked DSA questions in FAANG interviews.",
      },
    }),
    prisma.sheet.create({
      data: {
        slug: "sde-sheet",
        title: "SDE Sheet",
        description: "Comprehensive DSA sheet covering all topics for SDE interviews.",
      },
    }),
  ]);

  console.log(`Created ${sheets.length} sheets`);

  // ─── DSA PROBLEMS ──────────────────────────────────────────────────

  const problems = [
    {
      slug: "two-sum",
      title: "Two Sum",
      difficulty: "EASY" as Difficulty,
      category: "Arrays",
      tags: ["array", "hashmap"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Try using a hash map to store complements", "What if the array is sorted?"],
      constraints: "2 ≤ nums.length ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9\n-10^9 ≤ target ≤ 10^9\nOnly one valid answer exists.",
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
        { input: "nums = [3,2,4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
        { input: "nums = [3,3], target = 6", output: "[0, 1]", explanation: "nums[0] + nums[1] = 3 + 3 = 6" },
      ],
      solution: `## Two Sum — Editorial

### Approach 1: Brute Force
Check every pair. O(n²) time, O(1) space.

### Approach 2: Hash Map (Optimal)
Iterate through the array once. For each number, check if \`target - num\` exists in the hash map.

- **Time**: O(n) — single pass
- **Space**: O(n) — hash map storage

\`\`\`cpp
// C++
unordered_map<int, int> map;
for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (map.count(complement)) return {map[complement], i};
    map[nums[i]] = i;
}
return {};
\`\`\``,
      starterCode: {
        cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
        java: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "2 7 11 15\n9", output: "0 1" },
        { input: "3 2 4\n6", output: "1 2" },
        { input: "3 3\n6", output: "0 1" },
        { input: "1 5 3 7\n8", output: "1 2", isHidden: true },
        { input: "-1 -2 -3 -4\n-8", output: "2 3", isHidden: true },
      ],
    },
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      difficulty: "EASY" as Difficulty,
      category: "Stack",
      tags: ["stack", "string"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Use a stack to keep track of opening brackets", "What happens when you see a closing bracket?"],
      constraints: "1 ≤ s.length ≤ 10^4\ns consists of parentheses only: '()[]{}'",
      description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
      examples: [
        { input: 's = "()"', output: "true" },
        { input: 's = "()[]{}"', output: "true" },
        { input: 's = "(]"', output: "false" },
      ],
      solution: `## Valid Parentheses — Editorial

Use a stack to track opening brackets. When you see a closing bracket, check if it matches the top of the stack.

- **Time**: O(n)
- **Space**: O(n)`,
      starterCode: {
        cpp: '#include <stack>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n    }\n};',
        java: 'import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n    }\n}',
        python: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "()", output: "true" },
        { input: "()[]{}", output: "true" },
        { input: "(]", output: "false" },
        { input: "([)]", output: "false", isHidden: true },
        { input: "{[]}", output: "true", isHidden: true },
      ],
    },
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      difficulty: "EASY" as Difficulty,
      category: "Linked List",
      tags: ["linked-list", "recursion"],
      companies: ["Amazon", "Microsoft", "Google"],
      hints: ["Compare the heads of both lists", "Use recursion or iteration"],
      constraints: "0 ≤ list length ≤ 50\n-100 ≤ Node.val ≤ 100\nBoth lists are sorted in non-decreasing order.",
      description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
      examples: [
        { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
        { input: "list1 = [], list2 = []", output: "[]" },
      ],
      solution: `## Merge Two Sorted Lists — Editorial

Use a dummy node and compare both list heads repeatedly.

- **Time**: O(n+m)
- **Space**: O(1) iterative, O(n+m) recursive`,
      starterCode: {
        cpp: '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nvar mergeTwoLists = function(list1, list2) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 4\n1 3 4", output: "1 1 2 3 4 4" },
        { input: "\n", output: "" },
        { input: "1\n", output: "1" },
        { input: "1 2\n1 2", output: "1 1 2 2", isHidden: true },
        { input: "1 3 5 7\n2 4 6 8", output: "1 2 3 4 5 6 7 8", isHidden: true },
      ],
    },
    {
      slug: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "EASY" as Difficulty,
      category: "Arrays",
      tags: ["array", "greedy"],
      companies: ["Amazon", "Google", "Microsoft", "Meta"],
      hints: ["Track the minimum price seen so far", "Calculate profit at each step"],
      constraints: "1 ≤ prices.length ≤ 10^5\n0 ≤ prices[i] ≤ 10^4",
      description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve. If no profit can be made, return \`0\`.`,
      examples: [
        { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 5." },
        { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transaction possible." },
      ],
      solution: `## Best Time to Buy and Sell Stock — Editorial

Track the minimum price seen so far and compute max profit at each step.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "7 1 5 3 6 4", output: "5" },
        { input: "7 6 4 3 1", output: "0" },
        { input: "1 2", output: "1" },
        { input: "3 3 3 3", output: "0", isHidden: true },
        { input: "1 4 2 8 3 10", output: "9", isHidden: true },
      ],
    },
    {
      slug: "maximum-subarray",
      title: "Maximum Subarray",
      difficulty: "MEDIUM" as Difficulty,
      category: "Dynamic Programming",
      tags: ["array", "dp", "divide-and-conquer"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Kadane's Algorithm", "What if you keep a running sum and reset when it becomes negative?"],
      constraints: "1 ≤ nums.length ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4",
      description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
        { input: "nums = [1]", output: "1" },
        { input: "nums = [5,4,-1,7,8]", output: "23" },
      ],
      solution: `## Maximum Subarray — Editorial

Use Kadane's Algorithm: keep a running sum and reset when it goes negative.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6" },
        { input: "1", output: "1" },
        { input: "5 4 -1 7 8", output: "23" },
        { input: "-1", output: "-1", isHidden: true },
        { input: "-2 -3 -1 -4", output: "-1", isHidden: true },
      ],
    },
    {
      slug: "group-anagrams",
      title: "Group Anagrams",
      difficulty: "MEDIUM" as Difficulty,
      category: "HashMap",
      tags: ["hashmap", "string", "sorting"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Sort each string to form a key", "Use a hash map with sorted string as key"],
      constraints: "1 ≤ strs.length ≤ 10^4\n0 ≤ strs[i].length ≤ 100\nstrs[i] consists of lowercase English letters.",
      description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in **any order**.

An **anagram** is a word formed by rearranging the letters of a different word, using all the original letters exactly once.`,
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
        { input: 'strs = [""]', output: '[[""]]' },
        { input: 'strs = ["a"]', output: '[["a"]]' },
      ],
      solution: `## Group Anagrams — Editorial

Sort each string to create a key, then group in a hash map.

- **Time**: O(n*k*log k) where k is max string length
- **Space**: O(n*k)`,
      starterCode: {
        cpp: '#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your solution here\n    }\n};',
        java: 'import java.util.*;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nvar groupAnagrams = function(strs) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "eat tea tan ate nat bat", output: "bat:ate,eat,tea:tan,nat" },
        { input: "", output: ":" },
        { input: "a", output: "a" },
        { input: "abc bca cab xyz zyx", output: "abc,bca,cab:xyz,zyx", isHidden: true },
      ],
    },
    {
      slug: "longest-substring-without-repeating",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "MEDIUM" as Difficulty,
      category: "Sliding Window",
      tags: ["sliding-window", "string", "hashmap"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Use sliding window with two pointers", "Keep track of character positions in a hash map"],
      constraints: "0 ≤ s.length ≤ 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
      description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
      examples: [
        { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
        { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with length 1.' },
        { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with length 3.' },
      ],
      solution: `## Longest Substring Without Repeating — Editorial

Use sliding window with left/right pointers and a hash map of character positions.

- **Time**: O(n)
- **Space**: O(min(n, 26))`,
      starterCode: {
        cpp: '#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n    }\n}',
        python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "abcabcbb", output: "3" },
        { input: "bbbbb", output: "1" },
        { input: "pwwkew", output: "3" },
        { input: "", output: "0", isHidden: true },
        { input: "abcde", output: "5", isHidden: true },
      ],
    },
    {
      slug: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      difficulty: "MEDIUM" as Difficulty,
      category: "Trees",
      tags: ["tree", "bfs", "queue"],
      companies: ["Amazon", "Microsoft", "Google"],
      hints: ["Use a queue for BFS", "Track the number of nodes at each level"],
      constraints: "0 ≤ nodes ≤ 2000\n-1000 ≤ Node.val ≤ 1000",
      description: `Given the \`root\` of a binary tree, return the **level order traversal** of its nodes' values. (i.e., from left to right, level by level).`,
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
        { input: "root = [1]", output: "[[1]]" },
        { input: "root = []", output: "[]" },
      ],
      solution: `## Binary Tree Level Order Traversal — Editorial

Use BFS with a queue. Process nodes level by level.

- **Time**: O(n)
- **Space**: O(n)`,
      starterCode: {
        cpp: '/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n * };\n */\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode() {}\n *     TreeNode(int val) { this.val = val; }\n *     TreeNode(int val, TreeNode left, TreeNode right) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nvar levelOrder = function(root) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "3 9 20 null null 15 7", output: "3:9,20:15,7" },
        { input: "1", output: "1" },
        { input: "", output: "" },
        { input: "1 2 3 4 5", output: "1:2,3:4,5", isHidden: true },
      ],
    },
    {
      slug: "coin-change",
      title: "Coin Change",
      difficulty: "MEDIUM" as Difficulty,
      category: "Dynamic Programming",
      tags: ["dp", "greedy"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Think about the optimal substructure", "DP where dp[i] = min coins to make amount i"],
      constraints: "1 ≤ coins.length ≤ 12\n1 ≤ coins[i] ≤ 2^31 - 1\n0 ≤ amount ≤ 10^4",
      description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the *fewest number of coins* that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
      examples: [
        { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
        { input: "coins = [2], amount = 3", output: "-1" },
        { input: "coins = [1], amount = 0", output: "0" },
      ],
      solution: `## Coin Change — Editorial

Use dynamic programming: dp[i] = minimum coins needed for amount i.

- **Time**: O(n*amount)
- **Space**: O(amount)`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 5\n11", output: "3" },
        { input: "2\n3", output: "-1" },
        { input: "1\n0", output: "0" },
        { input: "1 3 4 5\n7", output: "2", isHidden: true },
        { input: "2 4\n5", output: "-1", isHidden: true },
      ],
    },
    {
      slug: "word-ladder",
      title: "Word Ladder",
      difficulty: "HARD" as Difficulty,
      category: "Graphs",
      tags: ["graph", "bfs", "string"],
      companies: ["Amazon", "Google", "Microsoft", "Meta"],
      hints: ["Think of words as nodes with edges if they differ by one character", "BFS from beginWord to endWord"],
      constraints: "1 ≤ beginWord.length ≤ 10\nendWord.length == beginWord.length\n1 ≤ wordList.length ≤ 5000",
      description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words such that:

1. The first word is \`beginWord\`.
2. The last word is \`endWord\`.
3. Only one letter is different between adjacent words.
4. Every intermediate word exists in \`wordList\`.

Return the **length** of the shortest transformation sequence, or \`0\` if no such sequence exists.`,
      examples: [
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: "hit → hot → dot → dog → cog" },
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: "0" },
      ],
      solution: `## Word Ladder — Editorial

Use BFS on the graph where nodes are words and edges connect words differing by one character.

- **Time**: O(n * m²) where n = wordList size, m = word length
- **Space**: O(n)`,
      starterCode: {
        cpp: '#include <vector>\n#include <string>\n#include <unordered_set>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your solution here\n    }\n};',
        java: 'import java.util.*;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\nfrom collections import deque\n\nclass Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nvar ladderLength = function(beginWord, endWord, wordList) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "hit cog\nhot dot dog lot log cog", output: "5" },
        { input: "hit cog\nhot dot dog lot log", output: "0" },
        { input: "a c\nb c", output: "2", isHidden: true },
        { input: "cat dog\ncot dot", output: "3", isHidden: true },
      ],
    },

    // ─── 15 New DSA Problems ─────────────────────────────────────────

    {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "EASY" as Difficulty,
      category: "Linked List",
      tags: ["linked-list", "recursion"],
      companies: ["Amazon", "Microsoft", "Google", "Meta"],
      hints: ["Use three pointers: prev, curr, next", "Think about the recursive approach (reverse rest, then fix head)"],
      constraints: "0 ≤ nodes ≤ 5000\n-5000 ≤ Node.val ≤ 5000",
      description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
        { input: "head = [1,2]", output: "[2,1]" },
        { input: "head = []", output: "[]" },
      ],
      solution: `## Reverse Linked List — Editorial

### Approach 1: Iterative
Use three pointers: prev (null initially), curr (head), and next. Reverse each node's pointer.

- **Time**: O(n)
- **Space**: O(1)

### Approach 2: Recursive
Reverse rest of list, then make head.next.next = head and head.next = null.

- **Time**: O(n)
- **Space**: O(n) stack space`,
      starterCode: {
        cpp: '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 3 4 5", output: "5 4 3 2 1" },
        { input: "1 2", output: "2 1" },
        { input: "", output: "" },
        { input: "1", output: "1", isHidden: true },
        { input: "1 2 3", output: "3 2 1", isHidden: true },
      ],
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      difficulty: "EASY" as Difficulty,
      category: "Binary Search",
      tags: ["binary-search", "array"],
      companies: ["Google", "Amazon", "Microsoft"],
      hints: ["Sorted array allows halving the search space each iteration", "Watch out for integer overflow in mid calculation"],
      constraints: "1 ≤ nums.length ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4\nAll elements are distinct.\nnums is sorted in ascending order.",
      description: `Given an array of integers \`nums\` sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
      examples: [
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums at index 4." },
        { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums." },
      ],
      solution: `## Binary Search — Editorial

Use two pointers (lo, hi). While lo ≤ hi, compute mid = lo + (hi - lo) / 2. Compare mid value with target and adjust bounds.

- **Time**: O(log n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "-1 0 3 5 9 12\n9", output: "4" },
        { input: "-1 0 3 5 9 12\n2", output: "-1" },
        { input: "5\n5", output: "0" },
        { input: "1 3 5 7\n3", output: "1", isHidden: true },
        { input: "2 4 6 8 10\n1", output: "-1", isHidden: true },
      ],
    },
    {
      slug: "invert-binary-tree",
      title: "Invert Binary Tree",
      difficulty: "EASY" as Difficulty,
      category: "Trees",
      tags: ["tree", "recursion", "dfs"],
      companies: ["Google", "Amazon", "Microsoft"],
      hints: ["Swap left and right children recursively", "Can also solve iteratively with a queue"],
      constraints: "0 ≤ nodes ≤ 100\n-100 ≤ Node.val ≤ 100",
      description: `Given the \`root\` of a binary tree, invert the tree, and return its root.

Inverting a tree means swapping every left and right child of every node.`,
      examples: [
        { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
        { input: "root = [2,1,3]", output: "[2,3,1]" },
        { input: "root = []", output: "[]" },
      ],
      solution: `## Invert Binary Tree — Editorial

Recursively swap left and right children for each node. Base case: null node.

- **Time**: O(n)
- **Space**: O(h) where h is tree height`,
      starterCode: {
        cpp: '/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n * };\n */\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode() {}\n *     TreeNode(int val) { this.val = val; }\n *     TreeNode(int val, TreeNode left, TreeNode right) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nvar invertTree = function(root) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1" },
        { input: "2 1 3", output: "2 3 1" },
        { input: "", output: "" },
        { input: "1", output: "1", isHidden: true },
        { input: "1 2 3 4 5", output: "1 3 2 5 4", isHidden: true },
      ],
    },
    {
      slug: "palindrome-linked-list",
      title: "Palindrome Linked List",
      difficulty: "EASY" as Difficulty,
      category: "Linked List",
      tags: ["linked-list", "two-pointers", "stack"],
      companies: ["Amazon", "Microsoft", "Google"],
      hints: ["Find the middle of the linked list using slow/fast pointers", "Reverse the second half and compare with the first half"],
      constraints: "1 ≤ nodes ≤ 10^5\n0 ≤ Node.val ≤ 9",
      description: `Given the \`head\` of a singly linked list, return \`true\` if it is a palindrome or \`false\` otherwise.`,
      examples: [
        { input: "head = [1,2,2,1]", output: "true" },
        { input: "head = [1,2]", output: "false" },
        { input: "head = [1,2,3,2,1]", output: "true" },
      ],
      solution: `## Palindrome Linked List — Editorial

Find the middle using slow/fast pointers. Reverse the second half. Compare both halves.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    bool isPalindrome(ListNode* head) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public boolean isPalindrome(ListNode head) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def isPalindrome(self, head: Optional[ListNode]) -> bool:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {boolean}\n */\nvar isPalindrome = function(head) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 2 1", output: "true" },
        { input: "1 2", output: "false" },
        { input: "1 2 3 2 1", output: "true" },
        { input: "1", output: "true", isHidden: true },
        { input: "1 1 2 1", output: "false", isHidden: true },
      ],
    },
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      difficulty: "EASY" as Difficulty,
      category: "Linked List",
      tags: ["linked-list", "two-pointers", "hashmap"],
      companies: ["Amazon", "Microsoft", "Google", "Meta"],
      hints: ["Use Floyd's Cycle Detection (slow and fast pointer)", "A hash set of visited nodes also works"],
      constraints: "0 ≤ nodes ≤ 10^4\n-10^5 ≤ Node.val ≤ 10^5\npos is -1 or a valid index.",
      description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle. Otherwise, return \`false\`.`,
      examples: [
        { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects to node at index 1." },
        { input: "head = [1,2], pos = 0", output: "true", explanation: "Tail connects to node at index 0." },
        { input: "head = [1], pos = -1", output: "false", explanation: "No cycle." },
      ],
      solution: `## Linked List Cycle — Editorial

Use Floyd's Cycle Detection: slow moves one step, fast moves two steps. If they meet, there is a cycle.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for singly-linked list.\n * class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) {\n *         val = x;\n *         next = null;\n *     }\n * }\n */\npublic class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.next = None\n\nclass Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for singly-linked list.\n * function ListNode(val) {\n *     this.val = val;\n *     this.next = null;\n * }\n */\n/**\n * @param {ListNode} head\n * @return {boolean}\n */\nvar hasCycle = function(head) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "3 2 0 -4\n1", output: "true" },
        { input: "1 2\n0", output: "true" },
        { input: "1\n-1", output: "false" },
        { input: "1 2 3\n-1", output: "false", isHidden: true },
        { input: "1 2 3 4 5\n2", output: "true", isHidden: true },
      ],
    },
    {
      slug: "product-of-array-except-self",
      title: "Product of Array Except Self",
      difficulty: "MEDIUM" as Difficulty,
      category: "Arrays",
      tags: ["array", "prefix-sum"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Think about using prefix and suffix products", "Can you do it without division?"],
      constraints: "2 ≤ nums.length ≤ 10^5\n-30 ≤ nums[i] ≤ 30\nThe product of any prefix or suffix fits in a 32-bit integer.",
      description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in \`O(n)\` time and **without using division**.`,
      examples: [
        { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
        { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
      ],
      solution: `## Product of Array Except Self — Editorial

Compute prefix products from left to right, then suffix products from right to left. Multiply them.

- **Time**: O(n)
- **Space**: O(1) (excluding output array)`,
      starterCode: {
        cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar productExceptSelf = function(nums) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 3 4", output: "24 12 8 6" },
        { input: "-1 1 0 -3 3", output: "0 0 9 0 0" },
        { input: "2 3", output: "3 2" },
        { input: "1 2 3 4 5", output: "120 60 40 30 24", isHidden: true },
        { input: "0 0", output: "0 0", isHidden: true },
      ],
    },
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "MEDIUM" as Difficulty,
      category: "Binary Search",
      tags: ["binary-search", "array"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["One half of the array is always sorted", "Check which side the target belongs to", "Compare nums[mid] with nums[lo] to determine rotation side"],
      constraints: "1 ≤ nums.length ≤ 5000\n-10^4 ≤ nums[i] ≤ 10^4\nAll values are unique.\nnums is rotated at some unknown pivot.",
      description: `There is an integer array \`nums\` sorted in ascending order (with distinct values) that is **rotated** at an unknown pivot.

Given the array \`nums\` after rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
      examples: [
        { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
        { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
        { input: "nums = [1], target = 0", output: "-1" },
      ],
      solution: `## Search in Rotated Sorted Array — Editorial

Modified binary search: determine which half is sorted, then check if target lies in that half.

- **Time**: O(log n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "4 5 6 7 0 1 2\n0", output: "4" },
        { input: "4 5 6 7 0 1 2\n3", output: "-1" },
        { input: "1\n0", output: "-1" },
        { input: "5 1 3\n5", output: "0", isHidden: true },
        { input: "3 1\n1", output: "1", isHidden: true },
      ],
    },
    {
      slug: "three-sum",
      title: "3Sum",
      difficulty: "MEDIUM" as Difficulty,
      category: "Arrays",
      tags: ["array", "two-pointers", "sorting"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Sort the array first", "Fix one number and use two-pointer for the other two", "Skip duplicates to avoid duplicate triplets"],
      constraints: "3 ≤ nums.length ≤ 3000\n-10^5 ≤ nums[i] ≤ 10^5",
      description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
      examples: [
        { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
        { input: "nums = [0,1,1]", output: "[]" },
        { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
      ],
      solution: `## 3Sum — Editorial

Sort the array. For each i, use left/right pointers to find pairs that sum to -nums[i]. Skip duplicates.

- **Time**: O(n²)
- **Space**: O(log n) to O(n) for sorting`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
        java: 'import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nvar threeSum = function(nums) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "-1 0 1 2 -1 -4", output: "-1 -1 2:-1 0 1" },
        { input: "0 1 1", output: "" },
        { input: "0 0 0", output: "0 0 0" },
        { input: "-2 0 0 2 2", output: "-2 0 2", isHidden: true },
        { input: "1 2 -2 -1", output: "", isHidden: true },
      ],
    },
    {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "MEDIUM" as Difficulty,
      category: "Arrays",
      tags: ["array", "two-pointers", "greedy"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Use two pointers, one at start and one at end", "The area is limited by the shorter line", "Move the pointer pointing to the shorter line inward"],
      constraints: "2 ≤ height.length ≤ 10^5\n0 ≤ height[i] ≤ 10^4",
      description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`ith\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
      examples: [
        { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 and 8 give area min(8,7)*7 = 49." },
        { input: "height = [1,1]", output: "1" },
      ],
      solution: `## Container With Most Water — Editorial

Use two pointers (left, right). Compute area = min(height[l], height[r]) * (r - l). Move the pointer with smaller height inward.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int maxArea(int[] height) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def maxArea(self, height: List[int]) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} height\n * @return {number}\n */\nvar maxArea = function(height) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 8 6 2 5 4 8 3 7", output: "49" },
        { input: "1 1", output: "1" },
        { input: "4 3 2 1 4", output: "16" },
        { input: "1 2 4 3", output: "4", isHidden: true },
        { input: "2 3 4 5 18 17 6", output: "17", isHidden: true },
      ],
    },
    {
      slug: "number-of-islands",
      title: "Number of Islands",
      difficulty: "MEDIUM" as Difficulty,
      category: "Graphs",
      tags: ["graph", "dfs", "bfs", "matrix"],
      companies: ["Amazon", "Google", "Microsoft", "Meta"],
      hints: ["Treat the grid as an adjacency list implicitly", "When you find a '1', traverse all connected '1's using DFS/BFS", "Mark visited cells to avoid revisiting"],
      constraints: "1 ≤ m, n ≤ 300\ngrid[i][j] is '0' or '1'.",
      description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.`,
      examples: [
        { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" },
        { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3" },
      ],
      solution: `## Number of Islands — Editorial

Iterate through the grid. When '1' is found, increment count and run DFS to mark the entire island as visited.

- **Time**: O(m × n)
- **Space**: O(m × n) in worst case for recursion stack`,
      starterCode: {
        cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "11110\n11010\n11000\n00000", output: "1" },
        { input: "11000\n11000\n00100\n00011", output: "3" },
        { input: "0", output: "0" },
        { input: "1", output: "1", isHidden: true },
        { input: "101\n010", output: "4", isHidden: true },
      ],
    },
    {
      slug: "course-schedule",
      title: "Course Schedule",
      difficulty: "MEDIUM" as Difficulty,
      category: "Graphs",
      tags: ["graph", "topological-sort", "bfs", "dfs"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["This is a cycle detection problem in a directed graph", "Kahn's algorithm (BFS with indegree) is efficient", "If there's a cycle, it's impossible to finish all courses"],
      constraints: "1 ≤ numCourses ≤ 2000\n0 ≤ prerequisites.length ≤ 5000\nprerequisites[i].length == 2",
      description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a[i], b[i]]\` indicates that you must take course \`b[i]\` before course \`a[i]\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
      examples: [
        { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take 0 first, then 1." },
        { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "There is a cycle." },
      ],
      solution: `## Course Schedule — Editorial

Build an adjacency list and indegree array. Use Kahn's algorithm (BFS): enqueue nodes with indegree 0, process neighbors.

- **Time**: O(V + E)
- **Space**: O(V + E)`,
      starterCode: {
        cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your solution here\n    }\n};',
        java: 'import java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nvar canFinish = function(numCourses, prerequisites) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "2\n1 0", output: "true" },
        { input: "2\n1 0:0 1", output: "false" },
        { input: "3\n1 0:2 1", output: "true" },
        { input: "4\n1 0:2 1:3 2", output: "true", isHidden: true },
        { input: "3\n0 1:1 2:2 0", output: "false", isHidden: true },
      ],
    },
    {
      slug: "house-robber",
      title: "House Robber",
      difficulty: "MEDIUM" as Difficulty,
      category: "Dynamic Programming",
      tags: ["dp", "array"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["For each house, decide to rob or skip", "dp[i] = max(dp[i-1], dp[i-2] + nums[i])", "Only need to track last two values"],
      constraints: "1 ≤ nums.length ≤ 100\n0 ≤ nums[i] ≤ 400",
      description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected, so if two adjacent houses are robbed on the same night, the police will be called.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount you can rob tonight **without alerting the police**.`,
      examples: [
        { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) and house 3 (3): 1+3=4." },
        { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9), house 5 (1): 2+9+1=12." },
      ],
      solution: `## House Robber — Editorial

Dynamic programming: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Optimize to O(1) space with two variables.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int rob(int[] nums) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def rob(self, nums: List[int]) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums\n * @return {number}\n */\nvar rob = function(nums) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 3 1", output: "4" },
        { input: "2 7 9 3 1", output: "12" },
        { input: "2 1 1 2", output: "4" },
        { input: "5", output: "5", isHidden: true },
        { input: "1 3 1 3 100", output: "103", isHidden: true },
      ],
    },
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "EASY" as Difficulty,
      category: "Dynamic Programming",
      tags: ["dp", "math", "memoization"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["This is the Fibonacci sequence in disguise", "From step n, you came from either n-1 or n-2", "dp[n] = dp[n-1] + dp[n-2]"],
      constraints: "1 ≤ n ≤ 45",
      description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
      examples: [
        { input: "n = 2", output: "2", explanation: "1+1 or 2." },
        { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." },
      ],
      solution: `## Climbing Stairs — Editorial

Classic Fibonacci DP: ways[n] = ways[n-1] + ways[n-2]. Base: ways[1] = 1, ways[2] = 2.

- **Time**: O(n)
- **Space**: O(1)`,
      starterCode: {
        cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n    }\n}',
        python: 'class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "2", output: "2" },
        { input: "3", output: "3" },
        { input: "4", output: "5" },
        { input: "1", output: "1", isHidden: true },
        { input: "5", output: "8", isHidden: true },
      ],
    },
    {
      slug: "serialize-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "HARD" as Difficulty,
      category: "Trees",
      tags: ["tree", "bfs", "dfs", "design"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["Use preorder traversal with a sentinel for null nodes", "Use a queue to rebuild the tree level by level", "Choose a delimiter that doesn't appear in node values"],
      constraints: "0 ≤ nodes ≤ 10^4\n-1000 ≤ Node.val ≤ 1000",
      description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
      examples: [
        { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" },
        { input: "root = []", output: "[]" },
      ],
      solution: `## Serialize and Deserialize Binary Tree — Editorial

Use preorder DFS with 'null' markers. Serialize: recursive preorder. Deserialize: use a queue of values and rebuild recursively.

- **Time**: O(n) for both
- **Space**: O(n) for both`,
      starterCode: {
        cpp: '/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n * };\n */\nclass Codec {\npublic:\n    string serialize(TreeNode* root) {\n        // Write your solution here\n    }\n\n    TreeNode* deserialize(string data) {\n        // Write your solution here\n    }\n};',
        java: '/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode(int x) { val = x; }\n * }\n */\npublic class Codec {\n    public String serialize(TreeNode root) {\n        // Write your solution here\n    }\n\n    public TreeNode deserialize(String data) {\n        // Write your solution here\n    }\n}',
        python: '# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.left = None\n#         self.right = None\n\nclass Codec:\n    def serialize(self, root: Optional[TreeNode]) -> str:\n        # Write your solution here\n        pass\n\n    def deserialize(self, data: str) -> Optional[TreeNode]:\n        # Write your solution here\n        pass',
        javascript: '/**\n * Definition for a binary tree node.\n * function TreeNode(val) {\n *     this.val = val;\n *     this.left = this.right = null;\n * }\n */\n/**\n * Encodes a tree to a single string.\n *\n * @param {TreeNode} root\n * @return {string}\n */\nvar serialize = function(root) {\n    // Write your solution here\n};\n\n/**\n * Decodes your encoded data to tree.\n *\n * @param {string} data\n * @return {TreeNode}\n */\nvar deserialize = function(data) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 2 3 null null 4 5", output: "1 2 3 null null 4 5" },
        { input: "", output: "" },
        { input: "1", output: "1" },
        { input: "1 null 2 null null null 3", output: "1 null 2 null null null 3", isHidden: true },
        { input: "1 2", output: "1 2", isHidden: true },
      ],
    },
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "HARD" as Difficulty,
      category: "Binary Search",
      tags: ["binary-search", "array", "divide-and-conquer"],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: ["The median partitions both arrays such that left half count = right half count", "Binary search the smaller array for the correct partition", "All elements in left partition must be ≤ all elements in right partition"],
      constraints: "1 ≤ m + n ≤ 2000\n-10^6 ≤ nums1[i], nums2[i] ≤ 10^6\nBoth arrays are sorted in ascending order.",
      description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
      examples: [
        { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "Merged array = [1,2,3], median = 2." },
        { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000", explanation: "Merged array = [1,2,3,4], median = (2+3)/2 = 2.5." },
      ],
      solution: `## Median of Two Sorted Arrays — Editorial

Binary search on the smaller array to find a partition such that maxLeft ≤ minRight across both arrays.

- **Time**: O(log(min(m, n)))
- **Space**: O(1)`,
      starterCode: {
        cpp: '#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n    }\n};',
        java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n    }\n}',
        python: 'from typing import List\n\nclass Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        # Write your solution here\n        pass',
        javascript: '/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    // Write your solution here\n};',
      },
      testCases: [
        { input: "1 3\n2", output: "2.00000" },
        { input: "1 2\n3 4", output: "2.50000" },
        { input: "0 0\n0 0", output: "0.00000" },
        { input: "1\n2 3 4", output: "2.50000", isHidden: true },
        { input: "1 2 3\n4 5 6", output: "3.50000", isHidden: true },
      ],
    },
  ];

  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    const problem = await prisma.problem.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        category: p.category,
        tags: p.tags,
        companies: p.companies,
        hints: p.hints,
        constraints: p.constraints,
        examples: p.examples,
        starterCode: p.starterCode,
        solution: p.solution,
        order: i + 1,
        sheetId: [0, 1].includes(i) ? sheets[0].id : i < 5 ? sheets[1].id : undefined,
      },
    });

    if (p.testCases.length > 0) {
      await prisma.testCase.createMany({
        data: p.testCases.map((tc) => ({
          problemId: problem.id,
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden || false,
        })),
      });
    }
  }

  console.log(`Created ${problems.length} problems with test cases`);
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
