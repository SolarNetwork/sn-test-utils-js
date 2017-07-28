import test from 'ava';

import TestAuthBuilder from '../src/testAuthBuilder';

const TEST_DATE_STR = 'Tue, 25 Apr 2017 14:30:00 GMT';
const TEST_DATE = new Date(TEST_DATE_STR);
const TEST_DATE2_STR = 'Tue, 25 Apr 2017 15:30:00 GMT';
const TEST_DATE2 = new Date(TEST_DATE2_STR);

test('date', t => {
    const auth = new TestAuthBuilder();
    auth.date(TEST_DATE);
    t.is(auth.requestDate.getTime(), TEST_DATE.getTime());
});

test('fixedDate', t => {
    const auth = new TestAuthBuilder();
    auth.fixedDate = TEST_DATE;
    auth.date(TEST_DATE2);
    t.is(auth.requestDate.getTime(), TEST_DATE.getTime(), 'fixedDate overrides date');
});