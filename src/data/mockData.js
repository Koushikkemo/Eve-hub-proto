export const colleges = [
  {
    id: 'srm',
    name: 'SRM Institute of Science and Technology',
    city: 'Chennai',
    tagline: 'Innovation and campus energy',
  },
  {
    id: 'anna',
    name: 'Anna University',
    city: 'Chennai',
    tagline: 'Tech culture and engineering excellence',
  },
  {
    id: 'vit',
    name: 'VIT Vellore',
    city: 'Vellore',
    tagline: 'Innovation-driven student experiences',
  },
  {
    id: 'psg',
    name: 'PSG College of Technology',
    city: 'Coimbatore',
    tagline: 'Strong technical learning community',
  },
  {
    id: 'abc',
    name: 'ABC Engineering College',
    city: 'Bengaluru',
    tagline: 'Future-ready events and showcases',
  },
]

export const mainEvents = [
  {
    id: 'technova-2026',
    name: 'TECHNOVA 2K26',
    collegeId: 'srm',
    collegeName: 'SRM Institute of Science and Technology',
    description:
      'A three-day technology festival with innovation stalls, student showcases, and expert talks.',
    startDate: '10 Mar 2026',
    endDate: '12 Mar 2026',
    venue: 'SRM Main Campus, Chennai',
    banner:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'innovision-2026',
    name: 'INNOVISION 2026',
    collegeId: 'anna',
    collegeName: 'Anna University',
    description:
      'A student-led event for robotics, product demos, research, and creative problem solving.',
    startDate: '17 Mar 2026',
    endDate: '19 Mar 2026',
    venue: 'Anna University Convention Center',
    banner:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'codefest-2026',
    name: 'CODEFEST 2026',
    collegeId: 'vit',
    collegeName: 'VIT Vellore',
    description:
      'A dynamic tech festival featuring coding competitions, AI sessions, and startup showcases.',
    startDate: '22 Mar 2026',
    endDate: '24 Mar 2026',
    venue: 'VIT Innovation Arena',
    banner:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  },
]

export const subEvents = [
  {
    id: 'bugthon-2026',
    title: 'BUGTHON 2026',
    mainEventId: 'technova-2026',
    category: 'Hackathon',
    tags: ['Coding', 'AI', 'Programming'],
    date: '11 Mar 2026',
    time: '09:30 AM',
    venue: 'Innovation Hall A',
    description:
      'A team-based hackathon focused on building real-world solutions in AI, cloud, and app innovation.',
    banner:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    seats: 320,
    fee: 'Free',
  },
  {
    id: 'codeblast',
    title: 'CODEBLAST',
    mainEventId: 'technova-2026',
    category: 'Competition',
    tags: ['Coding', 'Algorithms'],
    date: '11 Mar 2026',
    time: '01:00 PM',
    venue: 'Tech Lab 2',
    description:
      'A fast-paced coding challenge designed to test speed, logic, and optimization under pressure.',
    banner:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    seats: 120,
    fee: 'Free',
  },
  {
    id: 'ai-innovate',
    title: 'AI INNOVATE',
    mainEventId: 'technova-2026',
    category: 'Workshop',
    tags: ['AI', 'ML', 'Research'],
    date: '12 Mar 2026',
    time: '10:00 AM',
    venue: 'Seminar Block',
    description:
      'Learn how machine learning models are being used to solve real community and business challenges.',
    banner:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80',
    seats: 150,
    fee: 'Free',
  },
  {
    id: 'robo-race',
    title: 'ROBO RACE',
    mainEventId: 'innovision-2026',
    category: 'Sports',
    tags: ['Robotics', 'Build', 'Competition'],
    date: '18 Mar 2026',
    time: '11:00 AM',
    venue: 'Open Ground',
    description:
      'Robotics enthusiasts race their machines through a custom track and showcase engineering skills.',
    banner:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80',
    seats: 80,
    fee: 'Free',
  },
  {
    id: 'web3-talk',
    title: 'WEB3 TALK',
    mainEventId: 'innovision-2026',
    category: 'Seminar',
    tags: ['Blockchain', 'Startup', 'Talk'],
    date: '19 Mar 2026',
    time: '02:00 PM',
    venue: 'Smart Hall',
    description:
      'A current-focused session on blockchain, product strategy, and digital ecosystems.',
    banner:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    seats: 200,
    fee: 'Free',
  },
  {
    id: 'design-showcase',
    title: 'DESIGN SHOWCASE',
    mainEventId: 'codefest-2026',
    category: 'Cultural',
    tags: ['Design', 'UI/UX', 'Creativity'],
    date: '23 Mar 2026',
    time: '12:30 PM',
    venue: 'Artist Lounge',
    description:
      'Showcase innovative digital experiences and prototypes from student designers across campuses.',
    banner:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    seats: 100,
    fee: 'Free',
  },
]

export const categories = [
  'Hackathon',
  'Workshop',
  'Seminar',
  'Sports',
  'Cultural',
  'Competition',
  'Technical',
  'Non-Technical',
]

export const registrations = [
  {
    id: 'REG-2048',
    name: 'Aarav Nair',
    college: 'SRM Institute of Science and Technology',
    department: 'CSE',
    year: '2nd Year',
    status: 'Checked In',
    date: '10 Mar 2026',
  },
  {
    id: 'REG-2049',
    name: 'Nisha Reddy',
    college: 'VIT Vellore',
    department: 'IT',
    year: '3rd Year',
    status: 'Pending',
    date: '10 Mar 2026',
  },
  {
    id: 'REG-2050',
    name: 'Karan Mehta',
    college: 'Anna University',
    department: 'ECE',
    year: '2nd Year',
    status: 'Checked In',
    date: '10 Mar 2026',
  },
  {
    id: 'REG-2051',
    name: 'Sana Joseph',
    college: 'PSG College of Technology',
    department: 'AI & DS',
    year: '1st Year',
    status: 'Pending',
    date: '10 Mar 2026',
  },
]
