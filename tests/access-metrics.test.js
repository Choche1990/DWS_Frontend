const {test}=require('node:test');const assert=require('node:assert/strict');const m=require('../frontend/dist/access-metrics');
const events=[
{timestamp:'2026-09-10T12:00:00',event:'LOGIN_SUCCESS',email:'a@test',name:'A',group:'pmo'},
{timestamp:'2026-09-10T13:00:00',event:'GANTT_ENTER',email:'a@test',group:'pmo'},
{timestamp:'2026-09-11T12:00:00',event:'GANTT_ENTER',email:'a@test',group:'datalab'},
{timestamp:'2026-09-11T13:00:00',event:'GANTT_ENTER',email:'b@test'},
{timestamp:'2026-09-11T14:00:00',event:'LOGIN_FAILED',email:'bad@test'},
{timestamp:'2026-09-11T15:00:00',event:'LOGOUT',email:'a@test'}];
test('access metrics count successful activity, unique users and recurrence across days',()=>{const s=m.summarize(events);assert.equal(s.total,4);assert.equal(s.active,2);assert.equal(s.average,2);assert.equal(s.returning,1);assert.equal(s.users[0].count,3);assert.equal(s.teams.find(t=>t.key==='__unknown').count,1);assert.equal(s.days.length,2);});
test('module, team, inclusive date and user filters compose without inferring historical teams',()=>{assert.equal(m.select(events,{module:'gantt'}).length,3);assert.equal(m.select(events,{module:'gantt',team:'pmo'}).length,1);assert.equal(m.select(events,{from:'2026-09-11',to:'2026-09-11',search:'A@TEST',module:'gantt'}).length,1);assert.equal(m.select(events,{team:'__unknown',module:'gantt'})[0].email,'b@test');assert.equal(m.summarize([]).average,0);});
