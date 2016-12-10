/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */


var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
	c1 = str.charCodeAt(i++) & 0xff;
	if(i == len)
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
	    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	    out += "==";
	    break;
	}
	c2 = str.charCodeAt(i++);
	if(i == len)
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
	    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	    out += "=";
	    break;
	}
	c3 = str.charCodeAt(i++);
	out += base64EncodeChars.charAt(c1 >> 2);
	out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
	out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
	/* c1 */
	do {
	    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	} while(i < len && c1 == -1);
	if(c1 == -1)
	    break;

	/* c2 */
	do {
	    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	} while(i < len && c2 == -1);
	if(c2 == -1)
	    break;

	out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

	/* c3 */
	do {
	    c3 = str.charCodeAt(i++) & 0xff;
	    if(c3 == 61)
		return out;
	    c3 = base64DecodeChars[c3];
	} while(i < len && c3 == -1);
	if(c3 == -1)
	    break;

	out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

	/* c4 */
	do {
	    c4 = str.charCodeAt(i++) & 0xff;
	    if(c4 == 61)
		return out;
	    c4 = base64DecodeChars[c4];
	} while(i < len && c4 == -1);
	if(c4 == -1)
	    break;
	out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

/****************************************************************************************/

/* MD5 Message-Digest
 * Copyright (C) 1999,2002 Masanao Izumo <iz@onicos.co.jp>
 * Version: 2.0.0
 * LastModified: May 13 2002
 *
 * This program is free software.  You can redistribute it and/or modify
 * it without any warranty.  This library calculates the MD5 based on RFC1321.
 * See RFC1321 for more information and algorism.
 */

/* Interface:
 * md5_128bits = MD5_hash(data);
 * md5_hexstr = MD5_hexhash(data);
 */

/* ChangeLog
 * 2002/05/13: Version 2.0.0 released
 * NOTICE: API is changed.
 * 2002/04/15: Bug fix about MD5 length.
 */


//    md5_T[i] = parseInt(Math.abs(Math.sin(i)) * 4294967296.0);
var MD5_T = new Array(0x00000000, 0xd76aa478, 0xe8c7b756, 0x242070db,
		      0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
		      0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1,
		      0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
		      0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51,
		      0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681,
		      0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87,
		      0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9,
		      0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
		      0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60,
		      0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085,
		      0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8,
		      0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7,
		      0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d,
		      0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314,
		      0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
		      0xeb86d391);

var MD5_round1 = new Array(new Array( 0, 7, 1), new Array( 1,12, 2),
			   new Array( 2,17, 3), new Array( 3,22, 4),
			   new Array( 4, 7, 5), new Array( 5,12, 6),
			   new Array( 6,17, 7), new Array( 7,22, 8),
			   new Array( 8, 7, 9), new Array( 9,12,10),
			   new Array(10,17,11), new Array(11,22,12),
			   new Array(12, 7,13), new Array(13,12,14),
			   new Array(14,17,15), new Array(15,22,16));

var MD5_round2 = new Array(new Array( 1, 5,17), new Array( 6, 9,18),
			   new Array(11,14,19), new Array( 0,20,20),
			   new Array( 5, 5,21), new Array(10, 9,22),
			   new Array(15,14,23), new Array( 4,20,24),
			   new Array( 9, 5,25), new Array(14, 9,26),
			   new Array( 3,14,27), new Array( 8,20,28),
			   new Array(13, 5,29), new Array( 2, 9,30),
			   new Array( 7,14,31), new Array(12,20,32));

var MD5_round3 = new Array(new Array( 5, 4,33), new Array( 8,11,34),
			   new Array(11,16,35), new Array(14,23,36),
			   new Array( 1, 4,37), new Array( 4,11,38),
			   new Array( 7,16,39), new Array(10,23,40),
			   new Array(13, 4,41), new Array( 0,11,42),
			   new Array( 3,16,43), new Array( 6,23,44),
			   new Array( 9, 4,45), new Array(12,11,46),
			   new Array(15,16,47), new Array( 2,23,48));

var MD5_round4 = new Array(new Array( 0, 6,49), new Array( 7,10,50),
			   new Array(14,15,51), new Array( 5,21,52),
			   new Array(12, 6,53), new Array( 3,10,54),
			   new Array(10,15,55), new Array( 1,21,56),
			   new Array( 8, 6,57), new Array(15,10,58),
			   new Array( 6,15,59), new Array(13,21,60),
			   new Array( 4, 6,61), new Array(11,10,62),
			   new Array( 2,15,63), new Array( 9,21,64));

function MD5_F(x, y, z) { return (x & y) | (~x & z); }
function MD5_G(x, y, z) { return (x & z) | (y & ~z); }
function MD5_H(x, y, z) { return x ^ y ^ z;          }
function MD5_I(x, y, z) { return y ^ (x | ~z);       }

var MD5_round = new Array(new Array(MD5_F, MD5_round1),
			  new Array(MD5_G, MD5_round2),
			  new Array(MD5_H, MD5_round3),
			  new Array(MD5_I, MD5_round4));

function MD5_pack(n32) {
  return String.fromCharCode(n32 & 0xff) +
	 String.fromCharCode((n32 >>> 8) & 0xff) +
	 String.fromCharCode((n32 >>> 16) & 0xff) +
	 String.fromCharCode((n32 >>> 24) & 0xff);
}

function MD5_unpack(s4) {
  return  s4.charCodeAt(0)        |
	 (s4.charCodeAt(1) <<  8) |
	 (s4.charCodeAt(2) << 16) |
	 (s4.charCodeAt(3) << 24);
}

function MD5_number(n) {
  while (n < 0)
    n += 4294967296;
  while (n > 4294967295)
    n -= 4294967296;
  return n;
}

function MD5_apply_round(x, s, f, abcd, r) {
  var a, b, c, d;
  var kk, ss, ii;
  var t, u;

  a = abcd[0];
  b = abcd[1];
  c = abcd[2];
  d = abcd[3];
  kk = r[0];
  ss = r[1];
  ii = r[2];

  u = f(s[b], s[c], s[d]);
  t = s[a] + u + x[kk] + MD5_T[ii];
  t = MD5_number(t);
  t = ((t<<ss) | (t>>>(32-ss)));
  t += s[b];
  s[a] = MD5_number(t);
}

function MD5_hash(data) {
  var abcd, x, state, s;
  var len, index, padLen, f, r;
  var i, j, k;
  var tmp;

  state = new Array(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);
  len = data.length;
  index = len & 0x3f;
  padLen = (index < 56) ? (56 - index) : (120 - index);
  if(padLen > 0) {
    data += "\x80";
    for(i = 0; i < padLen - 1; i++)
      data += "\x00";
  }
  data += MD5_pack(len * 8);
  data += MD5_pack(0);
  len  += padLen + 8;
  abcd = new Array(0, 1, 2, 3);
  x    = new Array(16);
  s    = new Array(4);

  for(k = 0; k < len; k += 64) {
    for(i = 0, j = k; i < 16; i++, j += 4) {
      x[i] = data.charCodeAt(j) |
	    (data.charCodeAt(j + 1) <<  8) |
	    (data.charCodeAt(j + 2) << 16) |
	    (data.charCodeAt(j + 3) << 24);
    }
    for(i = 0; i < 4; i++)
      s[i] = state[i];
    for(i = 0; i < 4; i++) {
      f = MD5_round[i][0];
      r = MD5_round[i][1];
      for(j = 0; j < 16; j++) {
	MD5_apply_round(x, s, f, abcd, r[j]);
	tmp = abcd[0];
	abcd[0] = abcd[3];
	abcd[3] = abcd[2];
	abcd[2] = abcd[1];
	abcd[1] = tmp;
      }
    }

    for(i = 0; i < 4; i++) {
      state[i] += s[i];
      state[i] = MD5_number(state[i]);
    }
  }

  return MD5_pack(state[0]) +
	 MD5_pack(state[1]) +
	 MD5_pack(state[2]) +
	 MD5_pack(state[3]);
}

function MD5_hexhash(data) {
    var i, out, c;
    var bit128;

    bit128 = MD5_hash(data);
    out = "";
    for(i = 0; i < 16; i++) {
	c = bit128.charCodeAt(i);
	out += "0123456789abcdef".charAt((c>>4) & 0xf);
	out += "0123456789abcdef".charAt(c & 0xf);
    }
    return out;
}

/****************************************************************************************/

/* Des library for JavaScript
 *
 * Copyright (C) 1998,1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.5.2
 * LastModified: Jan  6 2004
 *
 *  This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * ev = des_encrypt(key, val);
 * name = des_escape(ev);
 * ev = des_unescape(name);
 * val  = des_decrypt(key, ev);
 *
 * ev  = des_cbc_encrypt(key, str);
 * str = des_cbc_decrypt(key, ev);
 */

function des_encrypt(key, val) {
    var i, isstr;
    var out;
    if(typeof key == "string")
	key = des_str2arr(key);
    if(typeof val == "string") {
	val = des_str2arr(val);
	isstr = true;
    } else
	isstr = false;

    out = new Array(8);
    for(i = 0; i < 8; i++)
	out[i] = val[i];

    des_odd_key_parity(key);
    des_set_key(key);
    des_convert(out, true);
    return isstr ? des_arr2str(out) : out;
}

function des_decrypt(key, val) {
    var i, isstr;
    var out = new Array(8);

    if(typeof key == "string")
	key = des_str2arr(key);
    if(typeof val == "string") {
	val = des_str2arr(val);
	isstr = true;
    } else
	isstr = false;
    out = new Array(8);
    for(i = 0; i < 8; i++)
	out[i] = val[i];

    des_odd_key_parity(key);
    des_set_key(key);

    des_convert(out, false);

    return isstr ? des_arr2str(out) : out;
}

var des_hexString = new Array("0", "1", "2", "3", "4", "5", "6", "7", 
			      "8", "9", "A", "B", "C", "D", "E", "F");
function des_escape(val) {
    var i, c, len, out;

    len = val.length;
    out = "";
    for(i = 0; i < len; i++) {
	c = val.charCodeAt(i);
	out += des_hexString[c >> 4];
	out += des_hexString[c & 0xf];
    }
    return out;
}

function des_unescape(val) {
    var i, c1, c2, len, out;

    len = val.length;
    out = "";

    i = 0;
    while(i < len) {
	do {
	    c1 = "0123456789ABCDEF".indexOf(val.substr(i++, 1));
	} while(c1 == -1 && i < len);
	if(c1 == -1) break;
	do {
	    c2 = "0123456789ABCDEF".indexOf(val.substr(i++, 1));
	} while(c2 == -1 && i < len);
	if(c2 == -1) break;
	out += String.fromCharCode((c1<<4)|c2);
    }

    return out;
}


function des_cbc_encrypt(key, str) {
    var i, j, ilimit, rem;
    var input, tin;
    var out;

    if(typeof key == "string") {
	if(key.length > 8) {
	    key = des_split_key(key);
	    for(i = 0; i < key.length; i++)
		str = des_cbc_encrypt(key[i], str);
	    return str;
	}
	key = des_str2arr(key);
    }
    ilimit = str.length - 7;
    des_odd_key_parity(key);
    des_set_key(key);

    input = new Array(8);
    tin   = new Array(8);
    for(i = 0; i < 8; i++)
	tin[i] = 0;
    out = "";

    for(i = 0; i < ilimit; i += 8) {
	for(j = 0; j < 8; j++) {
	    input[j] = str.charCodeAt(i + j);
	    input[j] ^= tin[j];
	}
	des_convert(input, true);
	for(j = 0; j < 8; j++)
	    tin[j] = input[j];
	for(j = 0; j < 8; j++)
	    out += String.fromCharCode(input[j]);
    }
    rem = str.length - i;
    for(j = 0; j < rem; j++) {
	input[j] = str.charCodeAt(i + j);
	input[j] ^= tin[j];
    }
    for(i = 7 - rem; i > 0; i--, j++) {
	input[j] = String.fromCharCode(Math.floor(Math.random() * 256));
    	input[j] ^= tin[j];
    }
    input[7] = rem;
    input[7] ^= tin[7];
    des_convert(input, true);
    for(j = 0; j < 8; j++)
	tin[i] = input[i];
    for(j = 0; j < 8; j++)
	out += String.fromCharCode(input[j]);
    return out;
}

function des_cbc_decrypt(key, str) {
    var i, j, ilimit, rem;
    var input, tin, inxor;
    var out;

    if(typeof key == "string") {
	if(key.length > 8) {
	    key = des_split_key(key);
	    for(i = key.length - 1; i >= 0; i--)
		str = des_cbc_decrypt(key[i], str);
	    return str;
	}
	key = des_str2arr(key);
    }
    ilimit = str.length - 8;
    des_odd_key_parity(key);
    des_set_key(key);

    input = new Array(8);
    tin   = new Array(8);
    inxor = new Array(8);
    for(i = 0; i < 8; i++)
	inxor[i] = 0;
    out = "";
    for(i = 0; i < ilimit; i += 8) {
	for(j = 0; j < 8; j++)
	    tin[j] = input[j] = str.charCodeAt(i + j);
	des_convert(input, false);
	for(j = 0; j < 8; j++) {
	    input[j] ^= inxor[j];
	    inxor[j] = tin[j];
	}
	for(j = 0; j < 8; j++)
	    out += String.fromCharCode(input[j]);
    }

    for(j = 0; j < 8; j++)
	tin[j] = input[j] = str.charCodeAt(i + j);
    des_convert(input, false);
    for(j = 0; j < 8; j++) {
	input[j] ^= inxor[j];
	inxor[j] = tin[j];
    }
    rem = input[7] & 0x7;
    for(j = 0; j < rem; j++)
	out += String.fromCharCode(input[j]);
    return out;
}

/*
 * Internal variable and functions
 */

// for C bits (numbered as per FIPS 46) 1 2 3 4 5 6 
var des_skb0 = new Array(
    0x00000000,0x00000010,0x20000000,0x20000010,
    0x00010000,0x00010010,0x20010000,0x20010010,
    0x00000800,0x00000810,0x20000800,0x20000810,
    0x00010800,0x00010810,0x20010800,0x20010810,
    0x00000020,0x00000030,0x20000020,0x20000030,
    0x00010020,0x00010030,0x20010020,0x20010030,
    0x00000820,0x00000830,0x20000820,0x20000830,
    0x00010820,0x00010830,0x20010820,0x20010830,
    0x00080000,0x00080010,0x20080000,0x20080010,
    0x00090000,0x00090010,0x20090000,0x20090010,
    0x00080800,0x00080810,0x20080800,0x20080810,
    0x00090800,0x00090810,0x20090800,0x20090810,
    0x00080020,0x00080030,0x20080020,0x20080030,
    0x00090020,0x00090030,0x20090020,0x20090030,
    0x00080820,0x00080830,0x20080820,0x20080830,
    0x00090820,0x00090830,0x20090820,0x20090830);

// for C bits (numbered as per FIPS 46) 7 8 10 11 12 13 
var des_skb1 = new Array(
    0x00000000,0x02000000,0x00002000,0x02002000,
    0x00200000,0x02200000,0x00202000,0x02202000,
    0x00000004,0x02000004,0x00002004,0x02002004,
    0x00200004,0x02200004,0x00202004,0x02202004,
    0x00000400,0x02000400,0x00002400,0x02002400,
    0x00200400,0x02200400,0x00202400,0x02202400,
    0x00000404,0x02000404,0x00002404,0x02002404,
    0x00200404,0x02200404,0x00202404,0x02202404,
    0x10000000,0x12000000,0x10002000,0x12002000,
    0x10200000,0x12200000,0x10202000,0x12202000,
    0x10000004,0x12000004,0x10002004,0x12002004,
    0x10200004,0x12200004,0x10202004,0x12202004,
    0x10000400,0x12000400,0x10002400,0x12002400,
    0x10200400,0x12200400,0x10202400,0x12202400,
    0x10000404,0x12000404,0x10002404,0x12002404,
    0x10200404,0x12200404,0x10202404,0x12202404);

// for C bits (numbered as per FIPS 46) 14 15 16 17 19 20 
var des_skb2 = new Array(
    0x00000000,0x00000001,0x00040000,0x00040001,
    0x01000000,0x01000001,0x01040000,0x01040001,
    0x00000002,0x00000003,0x00040002,0x00040003,
    0x01000002,0x01000003,0x01040002,0x01040003,
    0x00000200,0x00000201,0x00040200,0x00040201,
    0x01000200,0x01000201,0x01040200,0x01040201,
    0x00000202,0x00000203,0x00040202,0x00040203,
    0x01000202,0x01000203,0x01040202,0x01040203,
    0x08000000,0x08000001,0x08040000,0x08040001,
    0x09000000,0x09000001,0x09040000,0x09040001,
    0x08000002,0x08000003,0x08040002,0x08040003,
    0x09000002,0x09000003,0x09040002,0x09040003,
    0x08000200,0x08000201,0x08040200,0x08040201,
    0x09000200,0x09000201,0x09040200,0x09040201,
    0x08000202,0x08000203,0x08040202,0x08040203,
    0x09000202,0x09000203,0x09040202,0x09040203);

// for C bits (numbered as per FIPS 46) 21 23 24 26 27 28 
var des_skb3 = new Array(
    0x00000000,0x00100000,0x00000100,0x00100100,
    0x00000008,0x00100008,0x00000108,0x00100108,
    0x00001000,0x00101000,0x00001100,0x00101100,
    0x00001008,0x00101008,0x00001108,0x00101108,
    0x04000000,0x04100000,0x04000100,0x04100100,
    0x04000008,0x04100008,0x04000108,0x04100108,
    0x04001000,0x04101000,0x04001100,0x04101100,
    0x04001008,0x04101008,0x04001108,0x04101108,
    0x00020000,0x00120000,0x00020100,0x00120100,
    0x00020008,0x00120008,0x00020108,0x00120108,
    0x00021000,0x00121000,0x00021100,0x00121100,
    0x00021008,0x00121008,0x00021108,0x00121108,
    0x04020000,0x04120000,0x04020100,0x04120100,
    0x04020008,0x04120008,0x04020108,0x04120108,
    0x04021000,0x04121000,0x04021100,0x04121100,
    0x04021008,0x04121008,0x04021108,0x04121108);

// for D bits (numbered as per FIPS 46) 1 2 3 4 5 6 
var des_skb4 = new Array(
    0x00000000,0x10000000,0x00010000,0x10010000,
    0x00000004,0x10000004,0x00010004,0x10010004,
    0x20000000,0x30000000,0x20010000,0x30010000,
    0x20000004,0x30000004,0x20010004,0x30010004,
    0x00100000,0x10100000,0x00110000,0x10110000,
    0x00100004,0x10100004,0x00110004,0x10110004,
    0x20100000,0x30100000,0x20110000,0x30110000,
    0x20100004,0x30100004,0x20110004,0x30110004,
    0x00001000,0x10001000,0x00011000,0x10011000,
    0x00001004,0x10001004,0x00011004,0x10011004,
    0x20001000,0x30001000,0x20011000,0x30011000,
    0x20001004,0x30001004,0x20011004,0x30011004,
    0x00101000,0x10101000,0x00111000,0x10111000,
    0x00101004,0x10101004,0x00111004,0x10111004,
    0x20101000,0x30101000,0x20111000,0x30111000,
    0x20101004,0x30101004,0x20111004,0x30111004);

// for D bits (numbered as per FIPS 46) 8 9 11 12 13 14 
var des_skb5 = new Array(
    0x00000000,0x08000000,0x00000008,0x08000008,
    0x00000400,0x08000400,0x00000408,0x08000408,
    0x00020000,0x08020000,0x00020008,0x08020008,
    0x00020400,0x08020400,0x00020408,0x08020408,
    0x00000001,0x08000001,0x00000009,0x08000009,
    0x00000401,0x08000401,0x00000409,0x08000409,
    0x00020001,0x08020001,0x00020009,0x08020009,
    0x00020401,0x08020401,0x00020409,0x08020409,
    0x02000000,0x0A000000,0x02000008,0x0A000008,
    0x02000400,0x0A000400,0x02000408,0x0A000408,
    0x02020000,0x0A020000,0x02020008,0x0A020008,
    0x02020400,0x0A020400,0x02020408,0x0A020408,
    0x02000001,0x0A000001,0x02000009,0x0A000009,
    0x02000401,0x0A000401,0x02000409,0x0A000409,
    0x02020001,0x0A020001,0x02020009,0x0A020009,
    0x02020401,0x0A020401,0x02020409,0x0A020409);

// for D bits (numbered as per FIPS 46) 16 17 18 19 20 21 
var des_skb6 = new Array(
    0x00000000,0x00000100,0x00080000,0x00080100,
    0x01000000,0x01000100,0x01080000,0x01080100,
    0x00000010,0x00000110,0x00080010,0x00080110,
    0x01000010,0x01000110,0x01080010,0x01080110,
    0x00200000,0x00200100,0x00280000,0x00280100,
    0x01200000,0x01200100,0x01280000,0x01280100,
    0x00200010,0x00200110,0x00280010,0x00280110,
    0x01200010,0x01200110,0x01280010,0x01280110,
    0x00000200,0x00000300,0x00080200,0x00080300,
    0x01000200,0x01000300,0x01080200,0x01080300,
    0x00000210,0x00000310,0x00080210,0x00080310,
    0x01000210,0x01000310,0x01080210,0x01080310,
    0x00200200,0x00200300,0x00280200,0x00280300,
    0x01200200,0x01200300,0x01280200,0x01280300,
    0x00200210,0x00200310,0x00280210,0x00280310,
    0x01200210,0x01200310,0x01280210,0x01280310);

// for D bits (numbered as per FIPS 46) 22 23 24 25 27 28 
var des_skb7 = new Array(
    0x00000000,0x04000000,0x00040000,0x04040000,
    0x00000002,0x04000002,0x00040002,0x04040002,
    0x00002000,0x04002000,0x00042000,0x04042000,
    0x00002002,0x04002002,0x00042002,0x04042002,
    0x00000020,0x04000020,0x00040020,0x04040020,
    0x00000022,0x04000022,0x00040022,0x04040022,
    0x00002020,0x04002020,0x00042020,0x04042020,
    0x00002022,0x04002022,0x00042022,0x04042022,
    0x00000800,0x04000800,0x00040800,0x04040800,
    0x00000802,0x04000802,0x00040802,0x04040802,
    0x00002800,0x04002800,0x00042800,0x04042800,
    0x00002802,0x04002802,0x00042802,0x04042802,
    0x00000820,0x04000820,0x00040820,0x04040820,
    0x00000822,0x04000822,0x00040822,0x04040822,
    0x00002820,0x04002820,0x00042820,0x04042820,
    0x00002822,0x04002822,0x00042822,0x04042822);

var des_shifts2 = new Array(
    false,false,true,true,true,true,true,true,
    false,true,true,true,true,true,true,false);

// used in encrypt or decrypt
var des_SP0 = new Array(
    0x00410100, 0x00010000, 0x40400000, 0x40410100,
    0x00400000, 0x40010100, 0x40010000, 0x40400000,
    0x40010100, 0x00410100, 0x00410000, 0x40000100,
    0x40400100, 0x00400000, 0x00000000, 0x40010000,
    0x00010000, 0x40000000, 0x00400100, 0x00010100,
    0x40410100, 0x00410000, 0x40000100, 0x00400100,
    0x40000000, 0x00000100, 0x00010100, 0x40410000,
    0x00000100, 0x40400100, 0x40410000, 0x00000000,
    0x00000000, 0x40410100, 0x00400100, 0x40010000,
    0x00410100, 0x00010000, 0x40000100, 0x00400100,
    0x40410000, 0x00000100, 0x00010100, 0x40400000,
    0x40010100, 0x40000000, 0x40400000, 0x00410000,
    0x40410100, 0x00010100, 0x00410000, 0x40400100,
    0x00400000, 0x40000100, 0x40010000, 0x00000000,
    0x00010000, 0x00400000, 0x40400100, 0x00410100,
    0x40000000, 0x40410000, 0x00000100, 0x40010100);

var des_SP1 = new Array(
    0x08021002, 0x00000000, 0x00021000, 0x08020000,
    0x08000002, 0x00001002, 0x08001000, 0x00021000,
    0x00001000, 0x08020002, 0x00000002, 0x08001000,
    0x00020002, 0x08021000, 0x08020000, 0x00000002,
    0x00020000, 0x08001002, 0x08020002, 0x00001000,
    0x00021002, 0x08000000, 0x00000000, 0x00020002,
    0x08001002, 0x00021002, 0x08021000, 0x08000002,
    0x08000000, 0x00020000, 0x00001002, 0x08021002,
    0x00020002, 0x08021000, 0x08001000, 0x00021002,
    0x08021002, 0x00020002, 0x08000002, 0x00000000,
    0x08000000, 0x00001002, 0x00020000, 0x08020002,
    0x00001000, 0x08000000, 0x00021002, 0x08001002,
    0x08021000, 0x00001000, 0x00000000, 0x08000002,
    0x00000002, 0x08021002, 0x00021000, 0x08020000,
    0x08020002, 0x00020000, 0x00001002, 0x08001000,
    0x08001002, 0x00000002, 0x08020000, 0x00021000);

var des_SP2 = new Array(
    0x20800000, 0x00808020, 0x00000020, 0x20800020,
    0x20008000, 0x00800000, 0x20800020, 0x00008020,
    0x00800020, 0x00008000, 0x00808000, 0x20000000,
    0x20808020, 0x20000020, 0x20000000, 0x20808000,
    0x00000000, 0x20008000, 0x00808020, 0x00000020,
    0x20000020, 0x20808020, 0x00008000, 0x20800000,
    0x20808000, 0x00800020, 0x20008020, 0x00808000,
    0x00008020, 0x00000000, 0x00800000, 0x20008020,
    0x00808020, 0x00000020, 0x20000000, 0x00008000,
    0x20000020, 0x20008000, 0x00808000, 0x20800020,
    0x00000000, 0x00808020, 0x00008020, 0x20808000,
    0x20008000, 0x00800000, 0x20808020, 0x20000000,
    0x20008020, 0x20800000, 0x00800000, 0x20808020,
    0x00008000, 0x00800020, 0x20800020, 0x00008020,
    0x00800020, 0x00000000, 0x20808000, 0x20000020,
    0x20800000, 0x20008020, 0x00000020, 0x00808000);

var des_SP3 = new Array(
    0x00080201, 0x02000200, 0x00000001, 0x02080201,
    0x00000000, 0x02080000, 0x02000201, 0x00080001,
    0x02080200, 0x02000001, 0x02000000, 0x00000201,
    0x02000001, 0x00080201, 0x00080000, 0x02000000,
    0x02080001, 0x00080200, 0x00000200, 0x00000001,
    0x00080200, 0x02000201, 0x02080000, 0x00000200,
    0x00000201, 0x00000000, 0x00080001, 0x02080200,
    0x02000200, 0x02080001, 0x02080201, 0x00080000,
    0x02080001, 0x00000201, 0x00080000, 0x02000001,
    0x00080200, 0x02000200, 0x00000001, 0x02080000,
    0x02000201, 0x00000000, 0x00000200, 0x00080001,
    0x00000000, 0x02080001, 0x02080200, 0x00000200,
    0x02000000, 0x02080201, 0x00080201, 0x00080000,
    0x02080201, 0x00000001, 0x02000200, 0x00080201,
    0x00080001, 0x00080200, 0x02080000, 0x02000201,
    0x00000201, 0x02000000, 0x02000001, 0x02080200);

var des_SP4 = new Array(
    0x01000000, 0x00002000, 0x00000080, 0x01002084,
    0x01002004, 0x01000080, 0x00002084, 0x01002000,
    0x00002000, 0x00000004, 0x01000004, 0x00002080,
    0x01000084, 0x01002004, 0x01002080, 0x00000000,
    0x00002080, 0x01000000, 0x00002004, 0x00000084,
    0x01000080, 0x00002084, 0x00000000, 0x01000004,
    0x00000004, 0x01000084, 0x01002084, 0x00002004,
    0x01002000, 0x00000080, 0x00000084, 0x01002080,
    0x01002080, 0x01000084, 0x00002004, 0x01002000,
    0x00002000, 0x00000004, 0x01000004, 0x01000080,
    0x01000000, 0x00002080, 0x01002084, 0x00000000,
    0x00002084, 0x01000000, 0x00000080, 0x00002004,
    0x01000084, 0x00000080, 0x00000000, 0x01002084,
    0x01002004, 0x01002080, 0x00000084, 0x00002000,
    0x00002080, 0x01002004, 0x01000080, 0x00000084,
    0x00000004, 0x00002084, 0x01002000, 0x01000004);

var des_SP5 = new Array(
    0x10000008, 0x00040008, 0x00000000, 0x10040400,
    0x00040008, 0x00000400, 0x10000408, 0x00040000,
    0x00000408, 0x10040408, 0x00040400, 0x10000000,
    0x10000400, 0x10000008, 0x10040000, 0x00040408,
    0x00040000, 0x10000408, 0x10040008, 0x00000000,
    0x00000400, 0x00000008, 0x10040400, 0x10040008,
    0x10040408, 0x10040000, 0x10000000, 0x00000408,
    0x00000008, 0x00040400, 0x00040408, 0x10000400,
    0x00000408, 0x10000000, 0x10000400, 0x00040408,
    0x10040400, 0x00040008, 0x00000000, 0x10000400,
    0x10000000, 0x00000400, 0x10040008, 0x00040000,
    0x00040008, 0x10040408, 0x00040400, 0x00000008,
    0x10040408, 0x00040400, 0x00040000, 0x10000408,
    0x10000008, 0x10040000, 0x00040408, 0x00000000,
    0x00000400, 0x10000008, 0x10000408, 0x10040400,
    0x10040000, 0x00000408, 0x00000008, 0x10040008);

var des_SP6 = new Array(
    0x00000800, 0x00000040, 0x00200040,-0x7fe00000,
   -0x7fdff7c0,-0x7ffff800, 0x00000840, 0x00000000,
    0x00200000,-0x7fdfffc0,-0x7fffffc0, 0x00200800,
   -0x80000000, 0x00200840, 0x00200800,-0x7fffffc0,
   -0x7fdfffc0, 0x00000800,-0x7ffff800,-0x7fdff7c0,
    0x00000000, 0x00200040,-0x7fe00000, 0x00000840,
   -0x7fdff800,-0x7ffff7c0, 0x00200840,-0x80000000,
   -0x7ffff7c0,-0x7fdff800, 0x00000040, 0x00200000,
   -0x7ffff7c0, 0x00200800,-0x7fdff800,-0x7fffffc0,
    0x00000800, 0x00000040, 0x00200000,-0x7fdff800,
   -0x7fdfffc0,-0x7ffff7c0, 0x00000840, 0x00000000,
    0x00000040,-0x7fe00000,-0x80000000, 0x00200040,
    0x00000000,-0x7fdfffc0, 0x00200040, 0x00000840,
   -0x7fffffc0, 0x00000800,-0x7fdff7c0, 0x00200000,
    0x00200840,-0x80000000,-0x7ffff800,-0x7fdff7c0,
   -0x7fe00000, 0x00200840, 0x00200800,-0x7ffff800);

var des_SP7 = new Array(
    0x04100010, 0x04104000, 0x00004010, 0x00000000,
    0x04004000, 0x00100010, 0x04100000, 0x04104010,
    0x00000010, 0x04000000, 0x00104000, 0x00004010,
    0x00104010, 0x04004010, 0x04000010, 0x04100000,
    0x00004000, 0x00104010, 0x00100010, 0x04004000,
    0x04104010, 0x04000010, 0x00000000, 0x00104000,
    0x04000000, 0x00100000, 0x04004010, 0x04100010,
    0x00100000, 0x00004000, 0x04104000, 0x00000010,
    0x00100000, 0x00004000, 0x04000010, 0x04104010,
    0x00004010, 0x04000000, 0x00000000, 0x00104000,
    0x04100010, 0x04004010, 0x04004000, 0x00100010,
    0x04104000, 0x00000010, 0x00100010, 0x04004000,
    0x04104010, 0x00100000, 0x04100000, 0x04000010,
    0x00104000, 0x00004010, 0x04004010, 0x04100000,
    0x00000010, 0x04104000, 0x00104010, 0x00000000,
    0x04000000, 0x04100010, 0x00004000, 0x00104010);

// Odd parity table
var des_parity = new Array(
    0x80, 0x01, 0x02, 0x83, 0x04, 0x85, 0x86, 0x07,
    0x08, 0x89, 0x8a, 0x0b, 0x8c, 0x0d, 0x0e, 0x8f,
    0x10, 0x91, 0x92, 0x13, 0x94, 0x15, 0x16, 0x97,
    0x98, 0x19, 0x1a, 0x9b, 0x1c, 0x9d, 0x9e, 0x1f,
    0x20, 0xa1, 0xa2, 0x23, 0xa4, 0x25, 0x26, 0xa7,
    0xa8, 0x29, 0x2a, 0xab, 0x2c, 0xad, 0xae, 0x2f,
    0xb0, 0x31, 0x32, 0xb3, 0x34, 0xb5, 0xb6, 0x37,
    0x38, 0xb9, 0xba, 0x3b, 0xbc, 0x3d, 0x3e, 0xbf,
    0x40, 0xc1, 0xc2, 0x43, 0xc4, 0x45, 0x46, 0xc7,
    0xc8, 0x49, 0x4a, 0xcb, 0x4c, 0xcd, 0xce, 0x4f,
    0xd0, 0x51, 0x52, 0xd3, 0x54, 0xd5, 0xd6, 0x57,
    0x58, 0xd9, 0xda, 0x5b, 0xdc, 0x5d, 0x5e, 0xdf,
    0xe0, 0x61, 0x62, 0xe3, 0x64, 0xe5, 0xe6, 0x67,
    0x68, 0xe9, 0xea, 0x6b, 0xec, 0x6d, 0x6e, 0xef,
    0x70, 0xf1, 0xf2, 0x73, 0xf4, 0x75, 0x76, 0xf7,
    0xf8, 0x79, 0x7a, 0xfb, 0x7c, 0xfd, 0xfe, 0x7f,
    0x80, 0x01, 0x02, 0x83, 0x04, 0x85, 0x86, 0x07,
    0x08, 0x89, 0x8a, 0x0b, 0x8c, 0x0d, 0x0e, 0x8f,
    0x10, 0x91, 0x92, 0x13, 0x94, 0x15, 0x16, 0x97,
    0x98, 0x19, 0x1a, 0x9b, 0x1c, 0x9d, 0x9e, 0x1f,
    0x20, 0xa1, 0xa2, 0x23, 0xa4, 0x25, 0x26, 0xa7,
    0xa8, 0x29, 0x2a, 0xab, 0x2c, 0xad, 0xae, 0x2f,
    0xb0, 0x31, 0x32, 0xb3, 0x34, 0xb5, 0xb6, 0x37,
    0x38, 0xb9, 0xba, 0x3b, 0xbc, 0x3d, 0x3e, 0xbf,
    0x40, 0xc1, 0xc2, 0x43, 0xc4, 0x45, 0x46, 0xc7,
    0xc8, 0x49, 0x4a, 0xcb, 0x4c, 0xcd, 0xce, 0x4f,
    0xd0, 0x51, 0x52, 0xd3, 0x54, 0xd5, 0xd6, 0x57,
    0x58, 0xd9, 0xda, 0x5b, 0xdc, 0x5d, 0x5e, 0xdf,
    0xe0, 0x61, 0x62, 0xe3, 0x64, 0xe5, 0xe6, 0x67,
    0x68, 0xe9, 0xea, 0x6b, 0xec, 0x6d, 0x6e, 0xef,
    0x70, 0xf1, 0xf2, 0x73, 0xf4, 0x75, 0x76, 0xf7,
    0xf8, 0x79, 0x7a, 0xfb, 0x7c, 0xfd, 0xfe, 0x7f);

var des_ks = new Array(32);	// Key Scheduler
var des_l, des_r;		// Left&Right bits

// Internal functions

function des_set_key(key) {
    var i, s, t;
    var l, r;

    des_l = (key[0]  )|
	(key[1] <<  8)|
	(key[2] << 16)|
	(key[3] << 24);
    des_r = (key[4]  )|
	(key[5] <<  8)|
	(key[6] << 16)|
	(key[7] << 24);

    doPC1();

    l = des_l;
    r = des_r;
    for(i = 0; i < 16; i++) {
	if(des_shifts2[i]) {
	    l=(l>>2)|(l<<26);
	    r=(r>>2)|(r<<26);
	} else {
	    l=(l>>1)|(l<<27);
	    r=(r>>1)|(r<<27);
	}
	l&=0x0fffffff;
	r&=0x0fffffff;

	s=	des_skb0[ (l    )&0x3f		  ]|
		des_skb1[((l>> 6)&0x03)|((l>> 7)&0x3c)]|
		des_skb2[((l>>13)&0x0f)|((l>>14)&0x30)]|
		des_skb3[((l>>20)&0x01)|((l>>21)&0x06) |
				     ((l>>22)&0x38)];
	t=	des_skb4[ (r    )&0x3f		  ]|
		des_skb5[((r>> 7)&0x03)|((r>> 8)&0x3c)]|
		des_skb6[ (r>>15)&0x3f		  ]|
		des_skb7[((r>>21)&0x0f)|((r>>22)&0x30)];
	  des_ks[2 * i    ] = (t<<16)|(s&0x0000ffff);
	  s=                  ((s>>16)&0x0000ffff)|(t&-65536);
	  des_ks[2 * i + 1] = (s<<4)|((s>>28)&0xf);
    }
}

function doPC1() {
    var t;
    var l, r;

    l = des_l;
    r = des_r;

    t=((r>>4)^l)&0x0f0f0f0f;
    r^=(t<<4); l^=t;

    // do l first 
    t=((l<<18)^l)&-859045888;
    l=l^t^((t>>18)&0x00003fff);
    t=((l<<17)^l)&-1431699456;
    l=l^t^((t>>17)&0x00007fff);
    t=((l<< 8)^l)&0x00ff0000;
    l=l^t^((t>> 8)&0x00ffffff);
    t=((l<<17)^l)&-1431699456;
    l=l^t^((t>>17)&0x00007fff);

    // now do r
    t=((r<<24)^r)&-16777216;
    r=r^t^((t>>24)&0x000000ff);
    t=((r<< 8)^r)&0x00ff0000;
    r=r^t^((t>> 8)&0x00ffffff);
    t=((r<<14)^r)&0x33330000;
    r=r^t^((t>>14)&0x0003ffff);
    r=((r&0x00aa00aa)<<7)|((r&0x55005500)>>7)|(r&-1437226411);
    r=((r>>8)&0x00ffffff)|(((l&-268435456)>>4)&0x0fffffff);
    l&=0x0fffffff;

    des_l = l;
    des_r = r;
}

function des_convert(input, encrypt) {
    var i, t, u;
    var l, r;

    // Get the bytes in the order we want.
    des_l=     (input[0])|
           (input[1]<< 8)|
           (input[2]<<16)|
           (input[3]<<24);
    des_r=     (input[4])|
           (input[5]<< 8)|
           (input[6]<<16)|
           (input[7]<<24);
    doIP();

    l = des_l;
    r = des_r;

    if(encrypt) {
      for(i = 0; i < 32; i += 4) {
	t=(((r&0x7fffffff)<<1)|((r>>31)&0x00000001));
	u=t^des_ks[i  ];
	t=t^des_ks[i+1];
	t=(((t>>4)&0x0fffffff)|((t&0x0000000f)<<28));
	l^=    des_SP1[ t     &0x3f]|
	       des_SP3[(t>> 8)&0x3f]|
	       des_SP5[(t>>16)&0x3f]|
	       des_SP7[(t>>24)&0x3f]|
	       des_SP0[ u     &0x3f]|
	       des_SP2[(u>> 8)&0x3f]|
	       des_SP4[(u>>16)&0x3f]|
	       des_SP6[(u>>24)&0x3f];

	t=(l<<1)|((l>>31)&0x1);
	u=t^des_ks[i+2];
	t=t^des_ks[i+3];
	t=((t>>4)&0x0fffffff)|(t<<28);
	r^=    des_SP1[ t     &0x3f]|
	       des_SP3[(t>> 8)&0x3f]|
	       des_SP5[(t>>16)&0x3f]|
	       des_SP7[(t>>24)&0x3f]|
	       des_SP0[ u     &0x3f]|
	       des_SP2[(u>> 8)&0x3f]|
	       des_SP4[(u>>16)&0x3f]|
	       des_SP6[(u>>24)&0x3f];
      }
    } else {
      for(i = 30; i > 0; i -= 4)
	{
	  t=(r<<1)|((r>>31)&0x1);
	  u=t^des_ks[i  ];
	  t=t^des_ks[i+1];
	  t=((t>>4)&0x0fffffff)|(t<<28)
	  l^=    des_SP1[ t     &0x3f]|
		 des_SP3[(t>> 8)&0x3f]|
		 des_SP5[(t>>16)&0x3f]|
		 des_SP7[(t>>24)&0x3f]|
		 des_SP0[ u     &0x3f]|
		 des_SP2[(u>> 8)&0x3f]|
		 des_SP4[(u>>16)&0x3f]|
		 des_SP6[(u>>24)&0x3f];

	  t=(l<<1)|((l>>31)&0x1);
	  u=t^des_ks[i-2];
	  t=t^des_ks[i-1];
	  t=((t>>4)&0x0fffffff)|(t<<28);
	  r^=    des_SP1[ t     &0x3f]|
		 des_SP3[(t>> 8)&0x3f]|
		 des_SP5[(t>>16)&0x3f]|
		 des_SP7[(t>>24)&0x3f]|
		 des_SP0[ u     &0x3f]|
		 des_SP2[(u>> 8)&0x3f]|
		 des_SP4[(u>>16)&0x3f]|
		 des_SP6[(u>>24)&0x3f];
	}
    }
    des_l = l;
    des_r = r;
    doFP();
    l = des_l;
    r = des_r;
    input[0] = l&0xff;
    input[1] = (l>> 8)&0xff;
    input[2] = (l>>16)&0xff;
    input[3] = (l>>24)&0xff;
    input[4] = r&0xff;
    input[5] = (r>> 8)&0xff;
    input[6] = (r>>16)&0xff;
    input[7] = (r>>24)&0xff;
}

function doIP() {
    var t;
    var l, r;

    l = des_l;
    r = des_r;

    t=((r>> 4)^l)&0x0f0f0f0f;
    r^=(t<< 4); l^=t;
    t=((l>>16)^r)&0x0000ffff;
    l^=(t<<16); r^=t;
    t=((r>> 2)^l)&0x33333333;
    r^=(t<< 2); l^=t;
    t=((l>> 8)^r)&0x00ff00ff;
    l^=(t<< 8); r^=t;
    t=((r>> 1)^l)&0x55555555;
    r^=(t<< 1); l^=t;
    t=l;
    l=r;
    r=t;

    des_l = l;
    des_r = r;
}

function doFP() {
    var t;
    var l, r;

    l = des_l;
    r = des_r;

    t=((r>> 1)^l)&0x55555555;
    r^=(t<< 1); l^=t;
    t=((l>> 8)^r)&0x00ff00ff;
    l^=(t<< 8); r^=t;
    t=((r>> 2)^l)&0x33333333;
    r^=(t<< 2); l^=t;
    t=((l>>16)^r)&0x0000ffff;
    l^=(t<<16); r^=t;
    t=((r>> 4)^l)&0x0f0f0f0f;
    r^=(t<< 4); l^=t;

    des_l = l;
    des_r = r;
}

function des_odd_key_parity(key) {
    var i;
    for(i = 0; i < 8; i++)
      key[i] = des_parity[key[i] & 0xff];
}

function des_str2arr(str) {
    var a = new Array(8);
    var i, len;

    if((len = str.length) > 8)
	len = 8;
    for(i = 0; i < len; i++)
	a[i] = str.charCodeAt(i);
    for(; i < 8; i++)
	a[i] = 0;
    return a;
}

function des_arr2str(a) {
    var i, s;
    s = "";
    for(i = 0; i < 8; i++)
	s += String.fromCharCode(a[i]);
    return s;
}

function des_split_key(key) {
    var kk, i, n;

    n = (key.length + 7) >> 3;
    kk = new Array(n);
    for(i = 0; i < n; i++)
	kk[i] = key.substr(i * 8, 8);
    return kk;
}

/* for NN 3.0
var des_ascii =
	"\000\001\002\003\004\005\006\007\010\011\012\013\014\015\016\017" +
	"\020\021\022\023\024\025\026\027\030\031\032\033\034\035\036\037" +
	"!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^" +
	"_`abcdefghijklmnopqrstuvwxyz{|}~\177\200\201\202\203\204\205\206" +
	"\207\210\211\212\213\214\215\216\217\220\221\222\223\224\225\226" +
	"\227\230\231\232\233\234\235\236\237\240\241\242\243\244\245\246" +
	"\247\250\251\252\253\254\255\256\257\260\261\262\263\264\265\266" +
	"\267\270\271\272\273\274\275\276\277\300\301\302\303\304\305\306" +
	"\307\310\311\312\313\314\315\316\317\320\321\322\323\324\325\326" +
	"\327\330\331\332\333\334\335\336\337\340\341\342\343\344\345\346" +
	"\347\350\351\352\353\354\355\356\357\360\361\362\363\364\365\366" +
	"\367\370\371\372\373\374\375\376\377";
function fromCharCode(code) {
    return des_ascii.substr(code & 0xff, 1);
}
function charCodeAt(str, idx) {
    var i;
    if((i = des_ascii.indexOf(str.substr(idx, 1))) < 0)
	i = 0;
    return i;
}
*/