// Run: node --test src/lib/email-typo.test.ts
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { suggestEmail } from './email-typo.ts';

test('suggests the intended domain', () => {
	assert.equal(suggestEmail('jua@gmail.con'), 'jua@gmail.com');
	assert.equal(suggestEmail('jua@gmial.com'), 'jua@gmail.com');
	assert.equal(suggestEmail('jua@gmai.com'), 'jua@gmail.com');
	assert.equal(suggestEmail('jua@yaho.com'), 'jua@yahoo.com');
	assert.equal(suggestEmail('Jua@Hotmial.com'), 'Jua@hotmail.com');
	assert.equal(suggestEmail('jua@studio.con'), 'jua@studio.com');
});

test('leaves valid or unknown domains alone', () => {
	for (const email of ['jua@gmail.com', 'jua@mail.com', 'jua@email.com', 'jua@yahoo.co.id', 'jua@yahoo.co.uk', 'jua@studio.co', 'jua@srirona.id', 'jua@studio.om', 'jua@', 'jua'])
		assert.equal(suggestEmail(email), undefined, email);
});
