import { randomBytes } from 'crypto';

function bytesToUuid(buf: Buffer) {
	const byteToHex = [];
	for (let i = 0; i < 256; ++i) {
		byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}
	let i = 0;
	const bth = byteToHex;
	return [
		bth[buf[i++]],
		bth[buf[i++]],
		bth[buf[i++]],
		bth[buf[i++]],
		'-',
		bth[buf[i++]],
		bth[buf[i++]],
		'-',
		bth[buf[i++]],
		bth[buf[i++]],
		'-',
		bth[buf[i++]],
		bth[buf[i++]],
		'-',
		bth[buf[i++]],
		bth[buf[i++]],
		bth[buf[i++]],
		bth[buf[i++]],
		bth[buf[i++]],
		bth[buf[i++]]
	].join('');
}

export function UUID_V4() {
	let rnds = randomBytes(16);

	rnds[6] = (rnds[6] & 0x0f) | 0x40;
	rnds[8] = (rnds[8] & 0x3f) | 0x80;

	return bytesToUuid(rnds);
}
