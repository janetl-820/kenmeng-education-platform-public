const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publishable = ['index.html', 'course-data.js', 'schedule-utils.js', 'README.md', 'assets/A-white.png'];

test('public package contains only the intended website files', () => {
  for (const file of publishable) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `missing ${file}`);
  }
});

test('public text files contain no private spreadsheet links, employee codes, or real-person demo data', () => {
  const files = ['index.html', 'course-data.js', 'schedule-utils.js', 'README.md'];
  const text = files.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  const forbidden = [
    /docs\.google\.com\/spreadsheets/i,
    /drive\.google\.com/i,
    /(?:P|Q|TP|TQ)\d{6}/,
    /X\d{3}/,
    /林怡君|王雅婷|陳小美|林小芳|李小華|張惠玲|黃思妤|吳佳蓉|周映辰|怡君|雅婷|佳蓉|小美|小芳|小華|惠玲|思妤|安琪/,
    /Ryan|Evan|Iris|Enzo|Ash|Marcus|Dan|Jimmy|Stella|Wendy|Twiggy/,
    /晨光美學館|沐光沙龍|恬日美研|信義自營店|綠櫻桃|轉角教室/,
    /14UduUgNZdCLu6-NOvFToDYYDPLTlOJD3ikcL38h32-k/,
    /1IvIZpoEMSetfYH0IUi8gvvCLjd1-JiM1zsS-LcV0kOY/,
  ];
  for (const pattern of forbidden) assert.doesNotMatch(text, pattern);
});

test('public course catalog is explicitly demo-only', () => {
  const { septemberCourses, courseSnapshot } = require('../course-data.js');
  assert.equal(courseSnapshot.sourceUrl, '');
  assert.equal(courseSnapshot.demoOnly, true);
  assert.ok(septemberCourses.length >= 3);
  assert.ok(septemberCourses.every((course) => course.teacher.startsWith('示範講師')));
});
