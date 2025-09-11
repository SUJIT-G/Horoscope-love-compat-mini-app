const express = require('express');
const tips = [
'Today is good for planning.',
'A short walk clears your head.',
'Say no once if you need time.'
];
lines.push(randomFrom(tips));


return {
sign,
generated_at: now.toISOString(),
mood,
text: lines.join(' ')
};
}


app.get('/api/horoscope', (req, res) => {
const sign = (req.query.sign || '').toLowerCase();
if(!SIGNS.includes(sign)){
return res.status(400).json({ error: 'Invalid or missing sign. Valid: ' + SIGNS.join(', ') });
}
const data = generateHoroscope(sign);
res.json(data);
});


app.get('/api/compatibility', (req, res) => {
const s1 = (req.query.sign1 || '').toLowerCase();
const s2 = (req.query.sign2 || '').toLowerCase();
if(!SIGNS.includes(s1) || !SIGNS.includes(s2)){
return res.status(400).json({ error: 'Invalid or missing signs. Use sign1 and sign2 query params.'});
}


const e1 = ELEMENT[s1];
const e2 = ELEMENT[s2];
let base = ELEMENT_COMPAT[e1][e2] || 50;


// small random variance for 'fresh' feeling
const variance = Math.floor((Math.random()-0.5)*11); // -5..+5
const score = Math.max(0, Math.min(100, base + variance));


let desc = '';
if(score >= 80) desc = 'Excellent harmony — strong emotional & intellectual connection.';
else if(score >= 65) desc = 'Good match — plenty of shared values and understanding.';
else if(score >= 45) desc = 'Mixed compatibility — effort needed to bridge differences.';
else desc = 'Challenging match — needs patience and compromise.';


res.json({ sign1: s1, sign2: s2, element1: e1, element2: e2, score, description: desc });
});


// fallback to index
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));