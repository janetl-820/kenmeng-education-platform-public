(function (root) {
  const sourceRows = [
    ['9/2', '週三', '技術師課', '授課', '剪髮', 'C', '示範梯次', '基礎剪髮實作', '示範教室 A', ['示範講師 A'], '10:00'],
    ['9/3', '週四', '技術師課', '授課', '染髮', 'D', '示範梯次', '色彩設計練習', '示範教室 B', ['示範講師 A'], '13:30'],
    ['9/8', '週二', '新人課', '授課', '洗護', '', '', '新人服務流程', '示範教室 A', ['示範講師 B'], '09:30'],
    ['9/15', '週二', 'Salon 選修課', '授課', '造型', '', '', '造型技巧示範', '示範教室 B', ['示範講師 B'], '14:00'],
    ['9/16', '週三', '技術師課', '授課', '燙髮', 'F+', '示範梯次', '進階燙髮實作', '示範教室 A', ['示範講師 A'], '10:00'],
    ['9/24', '週四', '集體必修課', '授課', '顧客服務', '', '', '顧客溝通與服務', '示範教室 C', ['示範講師 C'], '13:00'],
  ];

  const septemberCourses = sourceRows.map((row, index) => {
    const [shortDate, weekday, category, activity, technique, level, cohort, title, place, teachers, time] = row;
    const day = Number(shortDate.split('/')[1]);
    return {
      id: `demo-${String(index + 1).padStart(2, '0')}`,
      date: `2026-09-${String(day).padStart(2, '0')}`,
      day: String(day).padStart(2, '0'),
      month: 'SEP', weekday, category, activity, technique,
      level: level || null, cohort: cohort || null, title, place,
      teacher: teachers.join('、'), time,
      cost: null, capacity: null, bookingReady: false,
    };
  }).sort((a, b) => a.date.localeCompare(b.date));

  const courseSnapshot = {
    spreadsheetId: '',
    spreadsheetTitle: '公開展示資料',
    sheet: '展示課程',
    range: '',
    snapshotDate: '2026-09-03',
    sourceUrl: '',
    demoOnly: true,
  };

  function filterSeptemberCourses(category) {
    return category === '全部'
      ? [...septemberCourses]
      : septemberCourses.filter((course) => course.category === category);
  }

  root.SEPTEMBER_COURSES = septemberCourses;
  root.COURSE_SNAPSHOT = courseSnapshot;
  root.filterSeptemberCourses = filterSeptemberCourses;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { septemberCourses, courseSnapshot, filterSeptemberCourses };
  }
})(typeof window !== 'undefined' ? window : globalThis);
