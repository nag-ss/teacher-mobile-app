export const classStudents = [
  { id: '01', name: 'Akshay Kumar .N', grade: 'B Grade - 82%', progress: '-02%', attendance: '92%', engagement: 'High', quiz: '85% (A)' },
  { id: '02', name: 'Diya Choudhary.k', grade: 'A Grade - 92%', progress: '+05%', attendance: '88%', engagement: 'Medium', quiz: '56% (D)' },
  { id: '03', name: 'Kabir Joshi Singh', grade: 'C Grade -75%', progress: '-02%', attendance: '72%', engagement: 'Low', quiz: '73% (B)' },
  { id: '04', name: 'Aditi Desai', grade: 'A Grade -86%', progress: '+10%', attendance: '64%', engagement: 'High', quiz: '64% (C)' },
  { id: '05', name: 'G.Saanvi Reddy', grade: 'D Grade -62%', progress: '+00%', attendance: '88%', engagement: 'Medium', quiz: '45% (E)' },
  { id: '06', name: 'Rohan Gupta', grade: 'B Grade -79%', progress: '-06%', attendance: '45%', engagement: 'Low', quiz: '85% (A)' },
  { id: '07', name: 'Rohan Gupta', grade: 'B Grade -79%', progress: '-06%', attendance: '45%', engagement: 'Low', quiz: '85% (A)' },
];

export const classAssignments = [
  { id: '01', title: 'Algebra Homework', dueDate: 'Apr 30', stats: '28/30 Submitted', status: 'Closed' },
  { id: '02', title: 'Trigonometry Assignment', dueDate: 'May 2', stats: '15/30 Submitted', status: 'In Progress' },
  { id: '03', title: 'Calculus Assignment', dueDate: 'May 5', stats: '10/30 Submitted', status: 'Low Participation' },
  { id: '04', title: 'Algebra Homework', dueDate: 'Apr 30', stats: '28/30 Submitted', status: 'Closed' },
  { id: '05', title: 'Trigonometry Assignment', dueDate: 'May 2', stats: '15/30 Submitted', status: 'In Progress' },
  { id: '06', title: 'Geometry Worksheet', dueDate: 'May 8', stats: '22/30 Submitted', status: 'In Progress' },
  { id: '07', title: 'Statistics Project', dueDate: 'May 12', stats: '09/30 Submitted', status: 'Low Participation' },
];

export const classQuizCards = [
  {
    title: 'Trigonometry',
    scheduledAt: 'May 5th',
    status: 'Upcoming in 3 days',
    details: [
      { label: 'Topics', value: 'Pythagorean Theorem, Identities' },
      { label: 'Total Marks', value: '50' },
      { label: 'Duration', value: '30 min' },
    ],
    nextSteps: ['Remind Students to Prepare.', 'Recommend Study Material.'],
    buttonText: 'Notify Students',
  },
  {
    title: 'Algebra Basics',
    scheduledAt: 'Mar 25th',
    status: 'Completed',
    details: [
      { label: 'Average Score', value: '78%' },
      { label: 'Highest Score', value: '95%' },
      { label: 'Lowest Score', value: '45%' },
    ],
    nextSteps: [
      'Reteach Quadratic Equations (30% scored low)',
      'Assign Extra Practice for Weak Students',
    ],
    buttonText: 'View Results',
  },
  {
    title: 'Geometry',
    scheduledAt: 'Apr 10th',
    status: 'Upcoming in 2 weeks',
    details: [
      { label: 'Topics', value: 'Triangles, Similarity' },
      { label: 'Total Marks', value: '40' },
      { label: 'Duration', value: '25 min' },
    ],
    nextSteps: ['Practice triangle proofs.', 'Review similarity formulas.'],
    buttonText: 'Notify Students',
  },
  {
    title: 'Algebra Basics',
    scheduledAt: 'Mar 25th',
    status: 'Completed',
    details: [
      { label: 'Topics Covered', value: '78%' },
      { label: 'Highest Score', value: '95%' },
      { label: 'Lowest Score', value: '45%' },
    ],
    nextSteps: ['Reteach Quadratic Equations (30% scored low)', 'Assign Extra Practice'],
    buttonText: 'View Results',
  },
];
