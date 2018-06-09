let db = [
    
    { // Events
        id: "fgkpbzawo0op1bnm7jua4",
        type: 'Event',
        title: 'Event 1',
        date: '5/31/2018',
        startTime: '14:00',
        endTime: '14:45',
        repeats: false,
        repeatPeriod: null,
        open: true,
        fixed: true,
        priority: null,
        concurrent: false
    },
    
    {
        id: "3f73dnqxqilxyppz6zv10",
        type: 'Event',
        title: 'Event 2',
        date: '5/31/2018',
        startTime: '17:00',
        endTime: '19:00',
        repeats: false,
        repeatPeriod: null,
        open: true,
        fixed: true,
        priority: null,
        concurrent: false
    },

    { // Tasks
        id: "zitxj96nxew0nztxskxmu",
        type: 'Task',
        title: 'Task 1',
        dueDate: '6/15/2018',
        requiredTime: '10:00',
        sessionTime: [ '1:00', '2:00' ],
        priority: '5',
        open: true,
        fixed: false,
        concurrent: false,
        remainingTime: '10:30'
    },

    {
        id: "j0v32j1utg4hv293544k9",
        type: 'Task',
        title: 'Task 2',
        dueDate: '6/10/2018',
        requiredTime: '5:00',
        sessionTime: [ '1:00', '2:30' ],
        priority: '10',
        open: true,
        fixed: false,
        concurrent: false,
        remainingTime: '5:15' 
    },

    { // Recurring
        id: "elpm5li4sus938nu1xrbq",
        type: 'Recurring',
        title: 'Recurring 1',
        requiredTime: '0:45',
        priority: '3',
        repeatType: '1',
        repeatInterval: 'M T W Th F',
        specialCaseType: '1',
        scheduleBefore: '10:00',
        scheduleAfter: null,
        open: true,
        fixed: false,
        concurrent: false 
    },

    {
        id: "9tlp63q26y1y2wffmnt7g",
        type: 'Recurring',
        title: 'Recurring 2',
        requiredTime: '1:30',
        priority: '7',
        repeatType: '2',
        repeatInterval: '31',
        specialCaseType: '2',
        scheduleBefore: '15:00',
        scheduleAfter: '12:00',
        open: true,
        fixed: false,
        concurrent: false 
    }

];

module.exports = db;