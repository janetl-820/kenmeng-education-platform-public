(function (root) {
  function isoDate(year, monthIndex, day) {
    return new Date(Date.UTC(year, monthIndex, day)).toISOString().slice(0, 10);
  }

  function buildMonthGrid(year, monthIndex, courses) {
    const firstDayOffset = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: cellCount }, (_, index) => {
      const date = isoDate(year, monthIndex, index - firstDayOffset + 1);
      const parts = date.split('-').map(Number);
      return {
        date,
        day: parts[2],
        inMonth: parts[0] === year && parts[1] === monthIndex + 1,
        courses: courses.filter((course) => course.date === date),
      };
    });
  }

  function getScheduleCourses(courses, view, assignedCourseIds) {
    if (view === 'all') return [...courses];
    const assigned = new Set(assignedCourseIds);
    return courses.filter((course) => assigned.has(course.id));
  }

  function createLeaveRequest({ courseId, reason, assignedCourseIds }) {
    if (!assignedCourseIds.includes(courseId)) throw new Error('Leave is only available for an assigned course');
    const normalizedReason = String(reason || '').trim();
    if (!normalizedReason) throw new Error('A leave reason is required');
    return {
      courseId,
      reason: normalizedReason,
      status: 'pending_admin',
      deductPoints: false,
      makeupRequired: false,
    };
  }

  function approveLeaveRequest(request) {
    if (request.status !== 'pending_admin') throw new Error('Only pending leave can be approved');
    return { ...request, status: 'approved_leave' };
  }

  function htmlEscape(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  function renderInternalCourseCard(course) {
    const color = course.category === '新人課'
      ? 'newcomer'
      : course.category === '集體必修課'
        ? 'collective'
        : course.category === 'Salon 選修課' ? 'elective' : '';
    const detail = [course.category, course.technique, course.level ? `等級 ${course.level}` : '']
      .filter(Boolean)
      .map(htmlEscape)
      .join('・');
    return `<article class="card course"><div class="course-cover ${color}"><span class="tag">${detail}</span><div class="datebox"><b>${htmlEscape(course.day)}</b><span>${htmlEscape(course.month)}</span></div></div><div class="course-body"><h4>${htmlEscape(course.title)}</h4><div class="meta"><span>◷ ${htmlEscape(course.weekday)}・${htmlEscape(course.time || '時間待行政設定')}</span><span>⌖ ${htmlEscape(course.place)}</span><span>講師　${htmlEscape(course.teacher)}</span></div><div class="course-foot"><span class="hint">行政安排課程</span><button class="btn secondary small" onclick="toast('已開啟課程須知')">查看課程須知</button></div></div></article>`;
  }

  function savePartnerSession(course, input) {
    const partnerOpen = Boolean(input.partnerOpen);
    const values = {
      time: String(input.time || '').trim(),
      cost: Number(input.cost) || 0,
      capacity: Number(input.capacity) || 0,
      deadline: String(input.deadline || '').trim(),
      notice: String(input.notice || '').trim(),
    };
    if (partnerOpen) {
      const missing = [];
      if (!values.time) missing.push('time');
      if (values.cost <= 0) missing.push('points');
      if (values.capacity <= 0) missing.push('capacity');
      if (!values.deadline) missing.push('deadline');
      if (!values.notice) missing.push('course notice');
      if (missing.length) throw new Error(`Missing required partner booking settings: ${missing.join(', ')}`);
    }
    return { ...values, partnerOpen, bookingReady: partnerOpen };
  }

  function getPartnerCatalog(courses, sessionSettings) {
    return courses
      .filter((course) => sessionSettings[course.id]?.partnerOpen)
      .map((course) => ({ ...course, ...sessionSettings[course.id] }));
  }

  function getTeacherCourses(courses, teacherName) {
    const name = String(teacherName || '').trim();
    if (!name) return [];
    return courses.filter((course) => course.teacher.includes(name));
  }

  root.buildMonthGrid = buildMonthGrid;
  root.getScheduleCourses = getScheduleCourses;
  root.createLeaveRequest = createLeaveRequest;
  root.approveLeaveRequest = approveLeaveRequest;
  root.renderInternalCourseCard = renderInternalCourseCard;
  root.savePartnerSession = savePartnerSession;
  root.getPartnerCatalog = getPartnerCatalog;
  root.getTeacherCourses = getTeacherCourses;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      buildMonthGrid,
      getScheduleCourses,
      createLeaveRequest,
      approveLeaveRequest,
      renderInternalCourseCard,
      savePartnerSession,
      getPartnerCatalog,
      getTeacherCourses,
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
