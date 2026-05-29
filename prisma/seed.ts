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

    // Create test cases
    for (const tc of p.testCases) {
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden || false,
        },
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
