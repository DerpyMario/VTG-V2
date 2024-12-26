! function e(t, n, o) {
    function a(r, s) {
        if (!n[r]) {
            if (!t[r]) {
                var l = "function" == typeof require && require;
                if (!s && l) return l(r, !0);
                if (i) return i(r, !0);
                var d = new Error("Cannot find module '" + r + "'");
                throw d.code = "MODULE_NOT_FOUND", d
            }
            var c = n[r] = {
                exports: {}
            };
            t[r][0].call(c.exports, (function(e) {
                return a(t[r][1][e] || e)
            }), c, c.exports, e, t, n, o)
        }
        return n[r].exports
    }
    for (var i = "function" == typeof require && require, r = 0; r < o.length; r++) a(o[r]);
    return a
}({
    1: [function(e, t, n) {
        "use strict";
        n.byteLength = function(e) {
            var t = d(e),
                n = t[0],
                o = t[1];
            return 3 * (n + o) / 4 - o
        }, n.toByteArray = function(e) {
            var t, n, o = d(e),
                r = o[0],
                s = o[1],
                l = new i(function(e, t, n) {
                    return 3 * (t + n) / 4 - n
                }(0, r, s)),
                c = 0,
                u = s > 0 ? r - 4 : r;
            for (n = 0; n < u; n += 4) t = a[e.charCodeAt(n)] << 18 | a[e.charCodeAt(n + 1)] << 12 | a[e.charCodeAt(n + 2)] << 6 | a[e.charCodeAt(n + 3)], l[c++] = t >> 16 & 255, l[c++] = t >> 8 & 255, l[c++] = 255 & t;
            2 === s && (t = a[e.charCodeAt(n)] << 2 | a[e.charCodeAt(n + 1)] >> 4, l[c++] = 255 & t);
            1 === s && (t = a[e.charCodeAt(n)] << 10 | a[e.charCodeAt(n + 1)] << 4 | a[e.charCodeAt(n + 2)] >> 2, l[c++] = t >> 8 & 255, l[c++] = 255 & t);
            return l
        }, n.fromByteArray = function(e) {
            for (var t, n = e.length, a = n % 3, i = [], r = 16383, s = 0, l = n - a; s < l; s += r) i.push(c(e, s, s + r > l ? l : s + r));
            1 === a ? (t = e[n - 1], i.push(o[t >> 2] + o[t << 4 & 63] + "==")) : 2 === a && (t = (e[n - 2] << 8) + e[n - 1], i.push(o[t >> 10] + o[t >> 4 & 63] + o[t << 2 & 63] + "="));
            return i.join("")
        };
        for (var o = [], a = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, l = r.length; s < l; ++s) o[s] = r[s], a[r.charCodeAt(s)] = s;

        function d(e) {
            var t = e.length;
            if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
            var n = e.indexOf("=");
            return -1 === n && (n = t), [n, n === t ? 0 : 4 - n % 4]
        }

        function c(e, t, n) {
            for (var a, i, r = [], s = t; s < n; s += 3) a = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]), r.push(o[(i = a) >> 18 & 63] + o[i >> 12 & 63] + o[i >> 6 & 63] + o[63 & i]);
            return r.join("")
        }
        a["-".charCodeAt(0)] = 62, a["_".charCodeAt(0)] = 63
    }, {}],
    2: [function(e, t, n) {
        (function(t) {
            (function() {
                /*!
                 * The buffer module from node.js, for the browser.
                 *
                 * @author   Feross Aboukhadijeh <https://feross.org>
                 * @license  MIT
                 */
                "use strict";
                var t = e("base64-js"),
                    o = e("ieee754");
                n.Buffer = r, n.SlowBuffer = function(e) {
                    +e != e && (e = 0);
                    return r.alloc(+e)
                }, n.INSPECT_MAX_BYTES = 50;
                var a = 2147483647;

                function i(e) {
                    if (e > a) throw new RangeError('The value "' + e + '" is invalid for option "size"');
                    var t = new Uint8Array(e);
                    return t.__proto__ = r.prototype, t
                }

                function r(e, t, n) {
                    if ("number" == typeof e) {
                        if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
                        return d(e)
                    }
                    return s(e, t, n)
                }

                function s(e, t, n) {
                    if ("string" == typeof e) return function(e, t) {
                        "string" == typeof t && "" !== t || (t = "utf8");
                        if (!r.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
                        var n = 0 | p(e, t),
                            o = i(n),
                            a = o.write(e, t);
                        a !== n && (o = o.slice(0, a));
                        return o
                    }(e, t);
                    if (ArrayBuffer.isView(e)) return c(e);
                    if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                    if (F(e, ArrayBuffer) || e && F(e.buffer, ArrayBuffer)) return function(e, t, n) {
                        if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
                        if (e.byteLength < t + (n || 0)) throw new RangeError('"length" is outside of buffer bounds');
                        var o;
                        o = void 0 === t && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, t) : new Uint8Array(e, t, n);
                        return o.__proto__ = r.prototype, o
                    }(e, t, n);
                    if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
                    var o = e.valueOf && e.valueOf();
                    if (null != o && o !== e) return r.from(o, t, n);
                    var a = function(e) {
                        if (r.isBuffer(e)) {
                            var t = 0 | u(e.length),
                                n = i(t);
                            return 0 === n.length || e.copy(n, 0, 0, t), n
                        }
                        if (void 0 !== e.length) return "number" != typeof e.length || H(e.length) ? i(0) : c(e);
                        if ("Buffer" === e.type && Array.isArray(e.data)) return c(e.data)
                    }(e);
                    if (a) return a;
                    if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return r.from(e[Symbol.toPrimitive]("string"), t, n);
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
                }

                function l(e) {
                    if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
                    if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"')
                }

                function d(e) {
                    return l(e), i(e < 0 ? 0 : 0 | u(e))
                }

                function c(e) {
                    for (var t = e.length < 0 ? 0 : 0 | u(e.length), n = i(t), o = 0; o < t; o += 1) n[o] = 255 & e[o];
                    return n
                }

                function u(e) {
                    if (e >= a) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
                    return 0 | e
                }

                function p(e, t) {
                    if (r.isBuffer(e)) return e.length;
                    if (ArrayBuffer.isView(e) || F(e, ArrayBuffer)) return e.byteLength;
                    if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
                    var n = e.length,
                        o = arguments.length > 2 && !0 === arguments[2];
                    if (!o && 0 === n) return 0;
                    for (var a = !1;;) switch (t) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return n;
                        case "utf8":
                        case "utf-8":
                            return O(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * n;
                        case "hex":
                            return n >>> 1;
                        case "base64":
                            return B(e).length;
                        default:
                            if (a) return o ? -1 : O(e).length;
                            t = ("" + t).toLowerCase(), a = !0
                    }
                }

                function m(e, t, n) {
                    var o = !1;
                    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                    if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
                    if ((n >>>= 0) <= (t >>>= 0)) return "";
                    for (e || (e = "utf8");;) switch (e) {
                        case "hex":
                            return $(this, t, n);
                        case "utf8":
                        case "utf-8":
                            return T(this, t, n);
                        case "ascii":
                            return E(this, t, n);
                        case "latin1":
                        case "binary":
                            return C(this, t, n);
                        case "base64":
                            return k(this, t, n);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return A(this, t, n);
                        default:
                            if (o) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(), o = !0
                    }
                }

                function f(e, t, n) {
                    var o = e[t];
                    e[t] = e[n], e[n] = o
                }

                function h(e, t, n, o, a) {
                    if (0 === e.length) return -1;
                    if ("string" == typeof n ? (o = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), H(n = +n) && (n = a ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
                        if (a) return -1;
                        n = e.length - 1
                    } else if (n < 0) {
                        if (!a) return -1;
                        n = 0
                    }
                    if ("string" == typeof t && (t = r.from(t, o)), r.isBuffer(t)) return 0 === t.length ? -1 : g(e, t, n, o, a);
                    if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? a ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : g(e, [t], n, o, a);
                    throw new TypeError("val must be string, number or Buffer")
                }

                function g(e, t, n, o, a) {
                    var i, r = 1,
                        s = e.length,
                        l = t.length;
                    if (void 0 !== o && ("ucs2" === (o = String(o).toLowerCase()) || "ucs-2" === o || "utf16le" === o || "utf-16le" === o)) {
                        if (e.length < 2 || t.length < 2) return -1;
                        r = 2, s /= 2, l /= 2, n /= 2
                    }

                    function d(e, t) {
                        return 1 === r ? e[t] : e.readUInt16BE(t * r)
                    }
                    if (a) {
                        var c = -1;
                        for (i = n; i < s; i++)
                            if (d(e, i) === d(t, -1 === c ? 0 : i - c)) {
                                if (-1 === c && (c = i), i - c + 1 === l) return c * r
                            } else - 1 !== c && (i -= i - c), c = -1
                    } else
                        for (n + l > s && (n = s - l), i = n; i >= 0; i--) {
                            for (var u = !0, p = 0; p < l; p++)
                                if (d(e, i + p) !== d(t, p)) {
                                    u = !1;
                                    break
                                } if (u) return i
                        }
                    return -1
                }

                function b(e, t, n, o) {
                    n = Number(n) || 0;
                    var a = e.length - n;
                    o ? (o = Number(o)) > a && (o = a) : o = a;
                    var i = t.length;
                    o > i / 2 && (o = i / 2);
                    for (var r = 0; r < o; ++r) {
                        var s = parseInt(t.substr(2 * r, 2), 16);
                        if (H(s)) return r;
                        e[n + r] = s
                    }
                    return r
                }

                function y(e, t, n, o) {
                    return U(O(t, e.length - n), e, n, o)
                }

                function w(e, t, n, o) {
                    return U(function(e) {
                        for (var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
                        return t
                    }(t), e, n, o)
                }

                function v(e, t, n, o) {
                    return w(e, t, n, o)
                }

                function x(e, t, n, o) {
                    return U(B(t), e, n, o)
                }

                function _(e, t, n, o) {
                    return U(function(e, t) {
                        for (var n, o, a, i = [], r = 0; r < e.length && !((t -= 2) < 0); ++r) o = (n = e.charCodeAt(r)) >> 8, a = n % 256, i.push(a), i.push(o);
                        return i
                    }(t, e.length - n), e, n, o)
                }

                function k(e, n, o) {
                    return 0 === n && o === e.length ? t.fromByteArray(e) : t.fromByteArray(e.slice(n, o))
                }

                function T(e, t, n) {
                    n = Math.min(e.length, n);
                    for (var o = [], a = t; a < n;) {
                        var i, r, s, l, d = e[a],
                            c = null,
                            u = d > 239 ? 4 : d > 223 ? 3 : d > 191 ? 2 : 1;
                        if (a + u <= n) switch (u) {
                            case 1:
                                d < 128 && (c = d);
                                break;
                            case 2:
                                128 == (192 & (i = e[a + 1])) && (l = (31 & d) << 6 | 63 & i) > 127 && (c = l);
                                break;
                            case 3:
                                i = e[a + 1], r = e[a + 2], 128 == (192 & i) && 128 == (192 & r) && (l = (15 & d) << 12 | (63 & i) << 6 | 63 & r) > 2047 && (l < 55296 || l > 57343) && (c = l);
                                break;
                            case 4:
                                i = e[a + 1], r = e[a + 2], s = e[a + 3], 128 == (192 & i) && 128 == (192 & r) && 128 == (192 & s) && (l = (15 & d) << 18 | (63 & i) << 12 | (63 & r) << 6 | 63 & s) > 65535 && l < 1114112 && (c = l)
                        }
                        null === c ? (c = 65533, u = 1) : c > 65535 && (c -= 65536, o.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), o.push(c), a += u
                    }
                    return function(e) {
                        var t = e.length;
                        if (t <= S) return String.fromCharCode.apply(String, e);
                        var n = "",
                            o = 0;
                        for (; o < t;) n += String.fromCharCode.apply(String, e.slice(o, o += S));
                        return n
                    }(o)
                }
                n.kMaxLength = a, r.TYPED_ARRAY_SUPPORT = function() {
                    try {
                        var e = new Uint8Array(1);
                        return e.__proto__ = {
                            __proto__: Uint8Array.prototype,
                            foo: function() {
                                return 42
                            }
                        }, 42 === e.foo()
                    } catch (e) {
                        return !1
                    }
                }(), r.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(r.prototype, "parent", {
                    enumerable: !0,
                    get: function() {
                        if (r.isBuffer(this)) return this.buffer
                    }
                }), Object.defineProperty(r.prototype, "offset", {
                    enumerable: !0,
                    get: function() {
                        if (r.isBuffer(this)) return this.byteOffset
                    }
                }), "undefined" != typeof Symbol && null != Symbol.species && r[Symbol.species] === r && Object.defineProperty(r, Symbol.species, {
                    value: null,
                    configurable: !0,
                    enumerable: !1,
                    writable: !1
                }), r.poolSize = 8192, r.from = function(e, t, n) {
                    return s(e, t, n)
                }, r.prototype.__proto__ = Uint8Array.prototype, r.__proto__ = Uint8Array, r.alloc = function(e, t, n) {
                    return function(e, t, n) {
                        return l(e), e <= 0 ? i(e) : void 0 !== t ? "string" == typeof n ? i(e).fill(t, n) : i(e).fill(t) : i(e)
                    }(e, t, n)
                }, r.allocUnsafe = function(e) {
                    return d(e)
                }, r.allocUnsafeSlow = function(e) {
                    return d(e)
                }, r.isBuffer = function(e) {
                    return null != e && !0 === e._isBuffer && e !== r.prototype
                }, r.compare = function(e, t) {
                    if (F(e, Uint8Array) && (e = r.from(e, e.offset, e.byteLength)), F(t, Uint8Array) && (t = r.from(t, t.offset, t.byteLength)), !r.isBuffer(e) || !r.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    if (e === t) return 0;
                    for (var n = e.length, o = t.length, a = 0, i = Math.min(n, o); a < i; ++a)
                        if (e[a] !== t[a]) {
                            n = e[a], o = t[a];
                            break
                        } return n < o ? -1 : o < n ? 1 : 0
                }, r.isEncoding = function(e) {
                    switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1
                    }
                }, r.concat = function(e, t) {
                    if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === e.length) return r.alloc(0);
                    var n;
                    if (void 0 === t)
                        for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
                    var o = r.allocUnsafe(t),
                        a = 0;
                    for (n = 0; n < e.length; ++n) {
                        var i = e[n];
                        if (F(i, Uint8Array) && (i = r.from(i)), !r.isBuffer(i)) throw new TypeError('"list" argument must be an Array of Buffers');
                        i.copy(o, a), a += i.length
                    }
                    return o
                }, r.byteLength = p, r.prototype._isBuffer = !0, r.prototype.swap16 = function() {
                    var e = this.length;
                    if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (var t = 0; t < e; t += 2) f(this, t, t + 1);
                    return this
                }, r.prototype.swap32 = function() {
                    var e = this.length;
                    if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (var t = 0; t < e; t += 4) f(this, t, t + 3), f(this, t + 1, t + 2);
                    return this
                }, r.prototype.swap64 = function() {
                    var e = this.length;
                    if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                    for (var t = 0; t < e; t += 8) f(this, t, t + 7), f(this, t + 1, t + 6), f(this, t + 2, t + 5), f(this, t + 3, t + 4);
                    return this
                }, r.prototype.toString = function() {
                    var e = this.length;
                    return 0 === e ? "" : 0 === arguments.length ? T(this, 0, e) : m.apply(this, arguments)
                }, r.prototype.toLocaleString = r.prototype.toString, r.prototype.equals = function(e) {
                    if (!r.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e || 0 === r.compare(this, e)
                }, r.prototype.inspect = function() {
                    var e = "",
                        t = n.INSPECT_MAX_BYTES;
                    return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">"
                }, r.prototype.compare = function(e, t, n, o, a) {
                    if (F(e, Uint8Array) && (e = r.from(e, e.offset, e.byteLength)), !r.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                    if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === o && (o = 0), void 0 === a && (a = this.length), t < 0 || n > e.length || o < 0 || a > this.length) throw new RangeError("out of range index");
                    if (o >= a && t >= n) return 0;
                    if (o >= a) return -1;
                    if (t >= n) return 1;
                    if (this === e) return 0;
                    for (var i = (a >>>= 0) - (o >>>= 0), s = (n >>>= 0) - (t >>>= 0), l = Math.min(i, s), d = this.slice(o, a), c = e.slice(t, n), u = 0; u < l; ++u)
                        if (d[u] !== c[u]) {
                            i = d[u], s = c[u];
                            break
                        } return i < s ? -1 : s < i ? 1 : 0
                }, r.prototype.includes = function(e, t, n) {
                    return -1 !== this.indexOf(e, t, n)
                }, r.prototype.indexOf = function(e, t, n) {
                    return h(this, e, t, n, !0)
                }, r.prototype.lastIndexOf = function(e, t, n) {
                    return h(this, e, t, n, !1)
                }, r.prototype.write = function(e, t, n, o) {
                    if (void 0 === t) o = "utf8", n = this.length, t = 0;
                    else if (void 0 === n && "string" == typeof t) o = t, n = this.length, t = 0;
                    else {
                        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t >>>= 0, isFinite(n) ? (n >>>= 0, void 0 === o && (o = "utf8")) : (o = n, n = void 0)
                    }
                    var a = this.length - t;
                    if ((void 0 === n || n > a) && (n = a), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    o || (o = "utf8");
                    for (var i = !1;;) switch (o) {
                        case "hex":
                            return b(this, e, t, n);
                        case "utf8":
                        case "utf-8":
                            return y(this, e, t, n);
                        case "ascii":
                            return w(this, e, t, n);
                        case "latin1":
                        case "binary":
                            return v(this, e, t, n);
                        case "base64":
                            return x(this, e, t, n);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return _(this, e, t, n);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + o);
                            o = ("" + o).toLowerCase(), i = !0
                    }
                }, r.prototype.toJSON = function() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                var S = 4096;

                function E(e, t, n) {
                    var o = "";
                    n = Math.min(e.length, n);
                    for (var a = t; a < n; ++a) o += String.fromCharCode(127 & e[a]);
                    return o
                }

                function C(e, t, n) {
                    var o = "";
                    n = Math.min(e.length, n);
                    for (var a = t; a < n; ++a) o += String.fromCharCode(e[a]);
                    return o
                }

                function $(e, t, n) {
                    var o = e.length;
                    (!t || t < 0) && (t = 0), (!n || n < 0 || n > o) && (n = o);
                    for (var a = "", i = t; i < n; ++i) a += N(e[i]);
                    return a
                }

                function A(e, t, n) {
                    for (var o = e.slice(t, n), a = "", i = 0; i < o.length; i += 2) a += String.fromCharCode(o[i] + 256 * o[i + 1]);
                    return a
                }

                function I(e, t, n) {
                    if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                    if (e + t > n) throw new RangeError("Trying to access beyond buffer length")
                }

                function P(e, t, n, o, a, i) {
                    if (!r.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > a || t < i) throw new RangeError('"value" argument is out of bounds');
                    if (n + o > e.length) throw new RangeError("Index out of range")
                }

                function L(e, t, n, o, a, i) {
                    if (n + o > e.length) throw new RangeError("Index out of range");
                    if (n < 0) throw new RangeError("Index out of range")
                }

                function D(e, t, n, a, i) {
                    return t = +t, n >>>= 0, i || L(e, 0, n, 4), o.write(e, t, n, a, 23, 4), n + 4
                }

                function R(e, t, n, a, i) {
                    return t = +t, n >>>= 0, i || L(e, 0, n, 8), o.write(e, t, n, a, 52, 8), n + 8
                }
                r.prototype.slice = function(e, t) {
                    var n = this.length;
                    (e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), t < e && (t = e);
                    var o = this.subarray(e, t);
                    return o.__proto__ = r.prototype, o
                }, r.prototype.readUIntLE = function(e, t, n) {
                    e >>>= 0, t >>>= 0, n || I(e, t, this.length);
                    for (var o = this[e], a = 1, i = 0; ++i < t && (a *= 256);) o += this[e + i] * a;
                    return o
                }, r.prototype.readUIntBE = function(e, t, n) {
                    e >>>= 0, t >>>= 0, n || I(e, t, this.length);
                    for (var o = this[e + --t], a = 1; t > 0 && (a *= 256);) o += this[e + --t] * a;
                    return o
                }, r.prototype.readUInt8 = function(e, t) {
                    return e >>>= 0, t || I(e, 1, this.length), this[e]
                }, r.prototype.readUInt16LE = function(e, t) {
                    return e >>>= 0, t || I(e, 2, this.length), this[e] | this[e + 1] << 8
                }, r.prototype.readUInt16BE = function(e, t) {
                    return e >>>= 0, t || I(e, 2, this.length), this[e] << 8 | this[e + 1]
                }, r.prototype.readUInt32LE = function(e, t) {
                    return e >>>= 0, t || I(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                }, r.prototype.readUInt32BE = function(e, t) {
                    return e >>>= 0, t || I(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                }, r.prototype.readIntLE = function(e, t, n) {
                    e >>>= 0, t >>>= 0, n || I(e, t, this.length);
                    for (var o = this[e], a = 1, i = 0; ++i < t && (a *= 256);) o += this[e + i] * a;
                    return o >= (a *= 128) && (o -= Math.pow(2, 8 * t)), o
                }, r.prototype.readIntBE = function(e, t, n) {
                    e >>>= 0, t >>>= 0, n || I(e, t, this.length);
                    for (var o = t, a = 1, i = this[e + --o]; o > 0 && (a *= 256);) i += this[e + --o] * a;
                    return i >= (a *= 128) && (i -= Math.pow(2, 8 * t)), i
                }, r.prototype.readInt8 = function(e, t) {
                    return e >>>= 0, t || I(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                }, r.prototype.readInt16LE = function(e, t) {
                    e >>>= 0, t || I(e, 2, this.length);
                    var n = this[e] | this[e + 1] << 8;
                    return 32768 & n ? 4294901760 | n : n
                }, r.prototype.readInt16BE = function(e, t) {
                    e >>>= 0, t || I(e, 2, this.length);
                    var n = this[e + 1] | this[e] << 8;
                    return 32768 & n ? 4294901760 | n : n
                }, r.prototype.readInt32LE = function(e, t) {
                    return e >>>= 0, t || I(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                }, r.prototype.readInt32BE = function(e, t) {
                    return e >>>= 0, t || I(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                }, r.prototype.readFloatLE = function(e, t) {
                    return e >>>= 0, t || I(e, 4, this.length), o.read(this, e, !0, 23, 4)
                }, r.prototype.readFloatBE = function(e, t) {
                    return e >>>= 0, t || I(e, 4, this.length), o.read(this, e, !1, 23, 4)
                }, r.prototype.readDoubleLE = function(e, t) {
                    return e >>>= 0, t || I(e, 8, this.length), o.read(this, e, !0, 52, 8)
                }, r.prototype.readDoubleBE = function(e, t) {
                    return e >>>= 0, t || I(e, 8, this.length), o.read(this, e, !1, 52, 8)
                }, r.prototype.writeUIntLE = function(e, t, n, o) {
                    (e = +e, t >>>= 0, n >>>= 0, o) || P(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                    var a = 1,
                        i = 0;
                    for (this[t] = 255 & e; ++i < n && (a *= 256);) this[t + i] = e / a & 255;
                    return t + n
                }, r.prototype.writeUIntBE = function(e, t, n, o) {
                    (e = +e, t >>>= 0, n >>>= 0, o) || P(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                    var a = n - 1,
                        i = 1;
                    for (this[t + a] = 255 & e; --a >= 0 && (i *= 256);) this[t + a] = e / i & 255;
                    return t + n
                }, r.prototype.writeUInt8 = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
                }, r.prototype.writeUInt16LE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                }, r.prototype.writeUInt16BE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                }, r.prototype.writeUInt32LE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
                }, r.prototype.writeUInt32BE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                }, r.prototype.writeIntLE = function(e, t, n, o) {
                    if (e = +e, t >>>= 0, !o) {
                        var a = Math.pow(2, 8 * n - 1);
                        P(this, e, t, n, a - 1, -a)
                    }
                    var i = 0,
                        r = 1,
                        s = 0;
                    for (this[t] = 255 & e; ++i < n && (r *= 256);) e < 0 && 0 === s && 0 !== this[t + i - 1] && (s = 1), this[t + i] = (e / r >> 0) - s & 255;
                    return t + n
                }, r.prototype.writeIntBE = function(e, t, n, o) {
                    if (e = +e, t >>>= 0, !o) {
                        var a = Math.pow(2, 8 * n - 1);
                        P(this, e, t, n, a - 1, -a)
                    }
                    var i = n - 1,
                        r = 1,
                        s = 0;
                    for (this[t + i] = 255 & e; --i >= 0 && (r *= 256);) e < 0 && 0 === s && 0 !== this[t + i + 1] && (s = 1), this[t + i] = (e / r >> 0) - s & 255;
                    return t + n
                }, r.prototype.writeInt8 = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                }, r.prototype.writeInt16LE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                }, r.prototype.writeInt16BE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                }, r.prototype.writeInt32LE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
                }, r.prototype.writeInt32BE = function(e, t, n) {
                    return e = +e, t >>>= 0, n || P(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                }, r.prototype.writeFloatLE = function(e, t, n) {
                    return D(this, e, t, !0, n)
                }, r.prototype.writeFloatBE = function(e, t, n) {
                    return D(this, e, t, !1, n)
                }, r.prototype.writeDoubleLE = function(e, t, n) {
                    return R(this, e, t, !0, n)
                }, r.prototype.writeDoubleBE = function(e, t, n) {
                    return R(this, e, t, !1, n)
                }, r.prototype.copy = function(e, t, n, o) {
                    if (!r.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                    if (n || (n = 0), o || 0 === o || (o = this.length), t >= e.length && (t = e.length), t || (t = 0), o > 0 && o < n && (o = n), o === n) return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
                    if (o < 0) throw new RangeError("sourceEnd out of bounds");
                    o > this.length && (o = this.length), e.length - t < o - n && (o = e.length - t + n);
                    var a = o - n;
                    if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, n, o);
                    else if (this === e && n < t && t < o)
                        for (var i = a - 1; i >= 0; --i) e[i + t] = this[i + n];
                    else Uint8Array.prototype.set.call(e, this.subarray(n, o), t);
                    return a
                }, r.prototype.fill = function(e, t, n, o) {
                    if ("string" == typeof e) {
                        if ("string" == typeof t ? (o = t, t = 0, n = this.length) : "string" == typeof n && (o = n, n = this.length), void 0 !== o && "string" != typeof o) throw new TypeError("encoding must be a string");
                        if ("string" == typeof o && !r.isEncoding(o)) throw new TypeError("Unknown encoding: " + o);
                        if (1 === e.length) {
                            var a = e.charCodeAt(0);
                            ("utf8" === o && a < 128 || "latin1" === o) && (e = a)
                        }
                    } else "number" == typeof e && (e &= 255);
                    if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
                    if (n <= t) return this;
                    var i;
                    if (t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e)
                        for (i = t; i < n; ++i) this[i] = e;
                    else {
                        var s = r.isBuffer(e) ? e : r.from(e, o),
                            l = s.length;
                        if (0 === l) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                        for (i = 0; i < n - t; ++i) this[i + t] = s[i % l]
                    }
                    return this
                };
                var M = /[^+/0-9A-Za-z-_]/g;

                function N(e) {
                    return e < 16 ? "0" + e.toString(16) : e.toString(16)
                }

                function O(e, t) {
                    var n;
                    t = t || 1 / 0;
                    for (var o = e.length, a = null, i = [], r = 0; r < o; ++r) {
                        if ((n = e.charCodeAt(r)) > 55295 && n < 57344) {
                            if (!a) {
                                if (n > 56319) {
                                    (t -= 3) > -1 && i.push(239, 191, 189);
                                    continue
                                }
                                if (r + 1 === o) {
                                    (t -= 3) > -1 && i.push(239, 191, 189);
                                    continue
                                }
                                a = n;
                                continue
                            }
                            if (n < 56320) {
                                (t -= 3) > -1 && i.push(239, 191, 189), a = n;
                                continue
                            }
                            n = 65536 + (a - 55296 << 10 | n - 56320)
                        } else a && (t -= 3) > -1 && i.push(239, 191, 189);
                        if (a = null, n < 128) {
                            if ((t -= 1) < 0) break;
                            i.push(n)
                        } else if (n < 2048) {
                            if ((t -= 2) < 0) break;
                            i.push(n >> 6 | 192, 63 & n | 128)
                        } else if (n < 65536) {
                            if ((t -= 3) < 0) break;
                            i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                        } else {
                            if (!(n < 1114112)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                        }
                    }
                    return i
                }

                function B(e) {
                    return t.toByteArray(function(e) {
                        if ((e = (e = e.split("=")[0]).trim().replace(M, "")).length < 2) return "";
                        for (; e.length % 4 != 0;) e += "=";
                        return e
                    }(e))
                }

                function U(e, t, n, o) {
                    for (var a = 0; a < o && !(a + n >= t.length || a >= e.length); ++a) t[a + n] = e[a];
                    return a
                }

                function F(e, t) {
                    return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
                }

                function H(e) {
                    return e != e
                }
            }).call(this)
        }).call(this, e("buffer").Buffer)
    }, {
        "base64-js": 1,
        buffer: 2,
        ieee754: 3
    }],
    3: [function(e, t, n) {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
        n.read = function(e, t, n, o, a) {
            var i, r, s = 8 * a - o - 1,
                l = (1 << s) - 1,
                d = l >> 1,
                c = -7,
                u = n ? a - 1 : 0,
                p = n ? -1 : 1,
                m = e[t + u];
            for (u += p, i = m & (1 << -c) - 1, m >>= -c, c += s; c > 0; i = 256 * i + e[t + u], u += p, c -= 8);
            for (r = i & (1 << -c) - 1, i >>= -c, c += o; c > 0; r = 256 * r + e[t + u], u += p, c -= 8);
            if (0 === i) i = 1 - d;
            else {
                if (i === l) return r ? NaN : 1 / 0 * (m ? -1 : 1);
                r += Math.pow(2, o), i -= d
            }
            return (m ? -1 : 1) * r * Math.pow(2, i - o)
        }, n.write = function(e, t, n, o, a, i) {
            var r, s, l, d = 8 * i - a - 1,
                c = (1 << d) - 1,
                u = c >> 1,
                p = 23 === a ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                m = o ? 0 : i - 1,
                f = o ? 1 : -1,
                h = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, r = c) : (r = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -r)) < 1 && (r--, l *= 2), (t += r + u >= 1 ? p / l : p * Math.pow(2, 1 - u)) * l >= 2 && (r++, l /= 2), r + u >= c ? (s = 0, r = c) : r + u >= 1 ? (s = (t * l - 1) * Math.pow(2, a), r += u) : (s = t * Math.pow(2, u - 1) * Math.pow(2, a), r = 0)); a >= 8; e[n + m] = 255 & s, m += f, s /= 256, a -= 8);
            for (r = r << a | s, d += a; d > 0; e[n + m] = 255 & r, m += f, r /= 256, d -= 8);
            e[n + m - f] |= 128 * h
        }
    }, {}],
    4: [function(e, t, n) {
        const {
            socket: o
        } = e("./socket");
        t.exports.ban = function() {
            const e = {
                bad_src: [/^https?:\/\/[^/]*raw[^/]*git[^/]*\/(metonator|Deklost|NomoX|RogerioBlanco)/gi, /.*pxlsbot(\.min)?\.js/gi, /^chrome-extension:\/\/lmleofkkoohkbgjikogbpmnjmpdedfil/gi, /^https?:\/\/.*mlpixel\.org/gi],
                bad_events: ["mousedown", "mouseup", "click"],
                checkSrc: function(t) {
                    for (let n = 0; n < e.bad_src.length; n++) t.match(e.bad_src[n]) && e.shadow("checkSrc pattern #" + n)
                },
                init: function() {
                    setInterval(e.update, 5e3), window.MouseEvent = function() {
                        e.me("new MouseEvent instance")
                    };
                    const t = Event;
                    Event = function(n, o) {
                        return -1 !== e.bad_events.indexOf(n.toLowerCase()) && e.shadow("bad Event " + e.bad_events[e.bad_events.indexOf(n.toLowerCase())]), new t(n, o)
                    };
                    const n = CustomEvent;
                    CustomEvent = function(t, o) {
                        return -1 !== e.bad_events.indexOf(t.toLowerCase()) && e.shadow("bad CustomEvent " + e.bad_events[e.bad_events.indexOf(t.toLowerCase())]), new n(t, o)
                    };
                    const o = document.createEvent;
                    document.createEvent = function(t, n) {
                        return -1 !== e.bad_events.indexOf(t.toLowerCase()) && e.shadow("bad document.createEvent " + e.bad_events[e.bad_events.indexOf(t.toLowerCase())]), o(t, n)
                    }, $(window).on("DOMNodeInserted", (function(t) {
                        "SCRIPT" === t.target.nodeName && e.checkSrc(t.target.src)
                    })), $("script").map((function() {
                        e.checkSrc(this.src)
                    }))
                },
                shadow: function(e) {
                    o.send(`{"type": "shadowbanme", "reason": "${e}"}`)
                },
                me: function(e) {
                    o.send(`{"type": "banme", "reason": "${e}"}`), o.close(), window.location.href = "https://www.youtube.com/watch?v=QHvKSo4BFi0"
                },
                update: function() {
                    window.App.attemptPlace = () => e.me("window.App.attemptPlace"), window.App.doPlace = () => e.me("window.App.doPlace"), null != document.autoPxlsScriptRevision && e.shadow("document.autoPxlsScriptRevision"), null != document.autoPxlsScriptRevision_ && e.shadow("document.autoPxlsScriptRevision_"), null != document.autoPxlsRandomNumber && e.shadow("document.autoPxlsRandomNumber"), null != document.RN && e.shadow("document.RN"), null != window.AutoPXLS && e.shadow("window.AutoPXLS"), null != window.AutoPXLS2 && e.shadow("window.AutoPXLS2"), null != document.defaultCaptchaFaviconSource && e.shadow("document.defaultCaptchaFaviconSource"), null != window.CFS && e.shadow("window.CFS"), $("div.info").find("#autopxlsinfo").length && e.shadow("#autopxlsinfo"), null != window.xD && e.shadow("window.xD (autopxls2)"), null != window.vdk && e.shadow("window.vdk (autopxls2)"), $(".botpanel").length && e.shadow(".botpanel (notabot/generic)"), null != window.Notabot && e.shadow("window.Notabot (notabot)"), null != window.Botnet && e.shadow("window.Botnet"), null != window.DrawIt && e.shadow("window.DrawIt"), null != window.NomoXBot && e.shadow("window.NomoXBot (nomo)"), null != window.UBot && e.shadow("window.UBot (nomo)"), null != document.querySelector(".xbotpanel") && e.shadow(".xbotpanel (nomo)"), null != document.querySelector(".botalert") && e.shadow(".botalert (nomo)"), null != document.getElementById("restartbot") && e.shadow("#restartbot (nomo)")
                }
            };
            return {
                init: e.init,
                shadow: e.shadow,
                me: e.me
            }
        }()
    }, {
        "./socket": 21
    }],
    5: [function(e, t, n) {
        const {
            lookup: o
        } = e("./lookup"), {
            place: a
        } = e("./place"), {
            settings: i
        } = e("./settings"), {
            template: r
        } = e("./template"), {
            panels: s
        } = e("./panels"), {
            user: l
        } = e("./user"), {
            uiHelper: d
        } = e("./uiHelper"), {
            chat: c
        } = e("./chat"), {
            overlays: u
        } = e("./overlays"), {
            socket: p
        } = e("./socket"), {
            grid: m
        } = e("./grid"), {
            ls: f
        } = e("./storage"), {
            coords: h
        } = e("./coords");
        let g;
        const {
            flags: b,
            createImageData: y,
            binaryAjax: w
        } = e("./helpers"), {
            haveImageRendering: v,
            haveZoomRendering: x
        } = b, _ = function() {
            const t = {
                elements: {
                    board: $("#board"),
                    board_render: null,
                    mover: $("#board-mover"),
                    zoomer: $("#board-zoomer"),
                    container: $("#board-container")
                },
                ctx: null,
                use_js_render: !v && !x,
                use_zoom: !v && x,
                width: 0,
                height: 0,
                scale: 1,
                id: null,
                intView: null,
                pan: {
                    x: 0,
                    y: 0
                },
                allowDrag: !0,
                pannedWithKeys: !1,
                rgbPalette: [],
                loaded: !1,
                pixelBuffer: [],
                holdTimer: {
                    id: -1,
                    holdTimeout: 500,
                    handler: function(e) {
                        t.holdTimer.id = -1, o.runLookup(e.x, e.y)
                    }
                },
                webInfo: !1,
                updateViewport: function(e) {
                    isNaN(e.scale) || t.setScale(parseFloat(e.scale), !1), t.centerOn(e.x, e.y)
                },
                centerOn: function(e, n, o = !1) {
                    null != e && (t.pan.x = t.width / 2 - e), null != n && (t.pan.y = t.height / 2 - n), t.update(null, o)
                },
                replayBuffer: function() {
                    $.map(t.pixelBuffer, (function(e) {
                        t.setPixelIndex(e.x, e.y, e.c, !1)
                    })), t.refresh(), t.pixelBuffer = []
                },
                draw: function(e) {
                    t.id = y(t.width, t.height), t.ctx.mozImageSmoothingEnabled = t.ctx.webkitImageSmoothingEnabled = t.ctx.msImageSmoothingEnabled = t.ctx.imageSmoothingEnabled = !1, t.intView = new Uint32Array(t.id.data.buffer), t.rgbPalette = a.getPaletteABGR();
                    for (let n = 0; n < t.width * t.height; n++) t._setPixelIndex(n, e[n]);
                    t.ctx.putImageData(t.id, 0, 0), t.update(), t.loaded = !0, t.replayBuffer()
                },
                initInteraction: function() {
                    const e = function(e) {
                        t.allowDrag && (t.pan.x += e.dx / t.scale, t.pan.y += e.dy / t.scale, t.update())
                    };
                    let n, l, d;

                    function c(e) {
                        ["INPUT", "TEXTAREA"].includes(document.activeElement.nodeName) && document.activeElement.blur();
                        let o = 0,
                            a = 0,
                            i = !0;
                        e.changedTouches && e.changedTouches[0] ? (o = e.changedTouches[0].clientX, a = e.changedTouches[0].clientY) : (o = e.clientX, a = e.clientY, null != e.button && (i = 0 === e.button)), n = o, l = a, i && -1 === t.holdTimer.id && (t.holdTimer.id = setTimeout(t.holdTimer.handler, t.holdTimer.holdTimeout, {
                            x: o,
                            y: a
                        })), d = Date.now()
                    }

                    function u(e) {
                        if (-1 === t.holdTimer.id) return;
                        let o = -1,
                            a = -1;
                        e.changedTouches && e.changedTouches[0] ? (o = e.changedTouches[0].clientX, a = e.changedTouches[0].clientY) : (o = e.clientX, a = e.clientY), (Math.abs(n - o) > 5 || Math.abs(l - a) > 5) && (clearTimeout(t.holdTimer.id), t.holdTimer.id = -1)
                    }
                    interact(t.elements.container[0]).draggable({
                        inertia: !0,
                        onmove: e
                    }).gesturable({
                        onmove: function(n) {
                            t.allowDrag && (t.scale *= 1 + n.ds), e(n)
                        }
                    }), $(document.body).on("keydown", (function(e) {
                        if (!["INPUT", "TEXTAREA"].includes(e.target.nodeName)) {
                            switch (e.originalEvent.code || e.keyCode || e.which || e.key) {
                                case "KeyW":
                                case "ArrowUp":
                                case 38:
                                case 87:
                                case "w":
                                case "W":
                                    t.pan.y += 100 / t.scale;
                                    break;
                                case "KeyD":
                                case "ArrowRight":
                                case 39:
                                case 68:
                                case "d":
                                case "D":
                                    t.pan.x -= 100 / t.scale;
                                    break;
                                case "KeyS":
                                case "ArrowDown":
                                case 40:
                                case 83:
                                case "s":
                                case "S":
                                    t.pan.y -= 100 / t.scale;
                                    break;
                                case "KeyA":
                                case "ArrowLeft":
                                case 37:
                                case 65:
                                case "a":
                                case "A":
                                    t.pan.x += 100 / t.scale;
                                    break;
                                case "KeyP":
                                case 80:
                                case "p":
                                case "P":
                                    t.save();
                                    break;
                                case "KeyL":
                                case 76:
                                case "l":
                                case "L":
                                    i.board.lock.enable.toggle();
                                    break;
                                case "KeyR":
                                case 82:
                                case "r":
                                case "R": {
                                    const e = r.getOptions();
                                    e.use ? t.centerOn(e.x + r.getDisplayWidth() / 2, e.y + r.getDisplayHeight() / 2) : a.lastPixel && t.centerOn(a.lastPixel.x, a.lastPixel.y);
                                    break
                                }
                                case "KeyJ":
                                case 74:
                                case "j":
                                case "J":
                                    a.color < 1 ? a.switch(a.palette.length - 1) : a.switch(a.color - 1);
                                    break;
                                case "KeyK":
                                case 75:
                                case "k":
                                case "K":
                                    a.color + 1 >= a.palette.length ? a.switch(0) : a.switch(a.color + 1);
                                    break;
                                case "KeyE":
                                case "Equal":
                                case "NumpadAdd":
                                case 69:
                                case 107:
                                case 187:
                                case 171:
                                case "=":
                                case "e":
                                case "E":
                                    t.nudgeScale(1);
                                    break;
                                case "KeyQ":
                                case "Minus":
                                case "NumpadSubtract":
                                case 81:
                                case 109:
                                case 173:
                                case 189:
                                case "q":
                                case "Q":
                                case "-":
                                    t.nudgeScale(-1);
                                    break;
                                case "t":
                                case "T":
                                case "KeyT":
                                case 84:
                                    s.toggle("settings");
                                    break;
                                case "i":
                                case "I":
                                case "KeyI":
                                case 73:
                                    s.toggle("info");
                                    break;
                                case "b":
                                case "B":
                                case "KeyB":
                                case 66:
                                    i.chat.enable.get() && s.toggle("chat")
                            }
                            t.pannedWithKeys = !0, t.update()
                        }
                    })), t.elements.container[0].addEventListener("wheel", (function(e) {
                        if (!t.allowDrag) return;
                        const n = t.getScale();
                        let o = -e.deltaY;
                        switch (e.deltaMode) {
                            case WheelEvent.DOM_DELTA_PIXEL:
                                o /= 53;
                                break;
                            case WheelEvent.DOM_DELTA_LINE:
                                o /= 3;
                                break;
                            case WheelEvent.DOM_DELTA_PAGE:
                                o = Math.sign(o)
                        }
                        t.nudgeScale(o);
                        const i = t.getScale();
                        if (n !== i) {
                            const o = e.clientX - t.elements.container.width() / 2,
                                r = e.clientY - t.elements.container.height() / 2;
                            t.pan.x -= o / n, t.pan.x += o / i, t.pan.y -= r / n, t.pan.y += r / i, t.update(), a.update()
                        }
                    }), {
                        passive: !0
                    }), t.elements.board_render.on("pointerdown mousedown", c).on("pointermove mousemove", u).on("pointerup mouseup touchend", (function(e) {
                        -1 !== t.holdTimer.id && clearTimeout(t.holdTimer.id);
                        if (!0 === e.shiftKey) return;
                        t.holdTimer.id = -1;
                        let o = !1,
                            r = e.clientX,
                            s = e.clientY,
                            c = Date.now() - d;
                        "touchend" === e.type && (o = !0, r = e.changedTouches[0].clientX, s = e.changedTouches[0].clientY);
                        const u = Math.abs(n - r),
                            p = Math.abs(l - s);
                        if ((0 === e.button || o) && c < 500) {
                            let e;
                            !t.allowDrag && u < 25 && p < 25 ? (e = t.fromScreen(n, l), a.place(e.x, e.y)) : u < 5 && p < 5 && (e = t.fromScreen(r, s), a.place(e.x, e.y))
                        }
                        if (c = 0, null != e.button && !0 === i.place.picker.enable.get() && 1 === e.button && u < 15 && p < 15) {
                            const {
                                x: n,
                                y: o
                            } = t.fromScreen(e.clientX, e.clientY);
                            a.switch(t.getPixelIndex(n, o))
                        }
                    })).contextmenu((function(e) {
                        switch (e.preventDefault(), i.place.rightclick.action.get()) {
                            case "clear":
                                a.switch(-1);
                                break;
                            case "copy": {
                                const t = _.fromScreen(e.clientX, e.clientY, !0),
                                    n = _.getPixelIndex(t.x, t.y);
                                a.switch(n);
                                break
                            }
                            case "lookup":
                                o.runLookup(e.clientX, e.clientY);
                                break;
                            case "clearlookup":
                                a.switch(-1), o.runLookup(e.clientX, e.clientY)
                        }
                    })), t.elements.board_render[0].addEventListener("touchstart", c, {
                        passive: !1
                    }), t.elements.board_render[0].addEventListener("touchmove", u, {
                        passive: !1
                    })
                },
                init: function() {
                    g = e("./query").query, $(window).on("pxls:queryUpdated", ((e, t, n, o) => {
                        const a = null == o;
                        switch (t.toLowerCase()) {
                            case "x":
                            case "y":
                                _.centerOn(g.get("x") >> 0, g.get("y") >> 0);
                                break;
                            case "scale":
                                _.setScale(o >> 0, !0);
                                break;
                            case "template":
                                r.queueUpdate({
                                    template: o,
                                    use: null !== o
                                });
                                break;
                            case "ox":
                                r.queueUpdate({
                                    ox: a ? null : o >> 0
                                });
                                break;
                            case "oy":
                                r.queueUpdate({
                                    oy: a ? null : o >> 0
                                });
                                break;
                            case "tw":
                                r.queueUpdate({
                                    tw: a ? null : o >> 0
                                });
                                break;
                            case "title":
                                r.queueUpdate({
                                    title: a ? "" : o
                                });
                                break;
                            case "convert":
                                r.queueUpdate({
                                    convert: o
                                })
                        }
                    })), $("#ui").hide(), t.elements.container.hide(), t.use_js_render ? (t.elements.board_render = $("<canvas>").css({
                        width: "100vw",
                        height: "100vh",
                        margin: 0,
                        marginTop: 3
                    }), t.elements.board.parent().append(t.elements.board_render), t.elements.board.detach()) : t.elements.board_render = t.elements.board, t.ctx = t.elements.board[0].getContext("2d"), t.initInteraction(), i.board.template.beneathoverlays.listen((function(e) {
                        t.elements.container.toggleClass("lower-template", e)
                    }))
                },
                start: function() {
                    const {
                        chromeOffsetWorkaround: n
                    } = e("./chromeOffsetWorkaround");
                    $.get("/info", (async e => {
                        t.webInfo = e, o.webinit(), u.webinit(e), l.webinit(e), t.width = e.width, t.height = e.height, a.setPalette(e.palette), r.webinit(e), d.setMax(e.maxStacked), c.webinit(e), d.initBanner(e.chatBannerText), n.update(), e.captchaKey && ($(".g-recaptcha").attr("data-sitekey", e.captchaKey), $.getScript("https://www.google.com/recaptcha/api.js")), t.elements.board.attr({
                            width: t.width,
                            height: t.height
                        });
                        const s = g.get("x") || t.width / 2,
                            h = g.get("y") || t.height / 2;
                        t.setScale(g.get("scale") || t.scale, !1), t.centerOn(s, h, !0), p.init(), t.use_js_render ? $(window).resize((function() {
                            t.update()
                        })).resize() : $(window).resize((function() {
                            a.update(), m.update()
                        }));
                        const b = g.get("template");
                        b && r.queueUpdate({
                            use: !0,
                            x: parseFloat(g.get("ox")),
                            y: parseFloat(g.get("oy")),
                            width: parseFloat(g.get("tw")),
                            title: g.get("title"),
                            url: b,
                            convertMode: g.get("convert")
                        });
                        let y = parseFloat(g.get("spin"));
                        if (y) {
                            y = 360 / (1e3 * y);
                            let e = 0,
                                n = null;
                            const o = function(a) {
                                n || (n = a);
                                e += y * (a - n), e %= 360, n = a, t.elements.container.css("transform", "rotate(" + e + "deg)"), window.requestAnimationFrame(o)
                            };
                            window.requestAnimationFrame(o)
                        }
                        const v = f.get("color");
                        null != v && a.switch(parseInt(v)), i.board.zoom.rounding.enable.listen((function(e) {
                            t.setScale(t.getScale())
                        }));
                        try {
                            t.draw(await w("/boarddata?_" + (new Date).getTime()))
                        } catch (e) {
                            console.error("Error drawing board:", e), p.reconnect()
                        }
                    })).fail((function(e) {
                        console.error("Error fetching /info:", e), p.reconnect()
                    }))
                },
                update: function(e, n = !1) {
                    const o = t.getScale();
                    if (t.loaded && (t.pan.x = Math.min(t.width / 2, Math.max(-t.width / 2, t.pan.x)), t.pan.y = Math.min(t.height / 2, Math.max(-t.height / 2, t.pan.y)), g.set({
                            x: Math.round(t.width / 2 - t.pan.x),
                            y: Math.round(t.height / 2 - t.pan.y),
                            scale: Math.round(100 * o) / 100
                        }, !0)), t.use_js_render) {
                        const e = t.elements.board_render[0].getContext("2d");
                        let n = -t.pan.x + (t.width - window.innerWidth / o) / 2,
                            i = -t.pan.y + (t.height - window.innerHeight / o) / 2,
                            s = 0,
                            l = 0,
                            d = 0,
                            c = 0,
                            u = window.innerWidth / o,
                            p = window.innerHeight / o;
                        return n < 0 && (s = -n, n = 0, u -= s, d += s), i < 0 && (l = -i, i = 0, p -= l, c += l), n + u > t.width && (d += u + n - t.width, u = t.width - n), i + p > t.height && (c += p + i - t.height, p = t.height - i), e.canvas.width = window.innerWidth, e.canvas.height = window.innerHeight, e.mozImageSmoothingEnabled = e.webkitImageSmoothingEnabled = e.msImageSmoothingEnabled = e.imageSmoothingEnabled = o < 1, e.globalAlpha = 1, e.fillStyle = "#CCCCCC", e.fillRect(0, 0, e.canvas.width, e.canvas.height), e.drawImage(t.elements.board[0], n, i, u, p, 0 + s * o, 0 + l * o, window.innerWidth - d * o, window.innerHeight - c * o), r.draw(e, n, i), a.update(), m.update(), !0
                    }
                    return !e && (t.elements.board.toggleClass("pixelate", o > 1), u.heatmap.setPixelated(o >= 1), u.heatbackground.setPixelated(o >= 1), u.virginmap.setPixelated(o >= 1), u.virginbackground.setPixelated(o >= 1), r.setPixelated(o >= r.getWidthRatio()), (n || t.allowDrag || !t.allowDrag && t.pannedWithKeys) && t.elements.mover.css({
                        width: t.width,
                        height: t.height,
                        transform: "translate(" + (o <= 1 ? Math.round(t.pan.x) : t.pan.x) + "px, " + (o <= 1 ? Math.round(t.pan.y) : t.pan.y) + "px)"
                    }), t.use_zoom ? t.elements.zoomer.css("zoom", (100 * o).toString() + "%") : t.elements.zoomer.css("transform", "scale(" + o + ")"), a.update(), m.update(), !0)
                },
                getScale: function() {
                    return Math.abs(t.scale)
                },
                setScale: function(e, n = !0) {
                    const o = parseFloat(i.board.zoom.limit.minimum.get()),
                        a = parseFloat(i.board.zoom.limit.maximum.get());
                    if ((e = parseFloat(e)) > a ? e = a : e <= o && (e = o), i.board.zoom.rounding.enable.get()) {
                        let n;
                        n = e < t.scale ? Math.floor : Math.ceil, e = e > 1 ? t.scale < 1 ? 1 : n(e) : t.scale > 1 ? 1 : 2 ** n(Math.log(e) / Math.log(2))
                    }
                    t.scale = e, n && t.update()
                },
                getZoomBase: function() {
                    return parseFloat(i.board.zoom.sensitivity.get()) || 1.5
                },
                nudgeScale: function(e) {
                    const n = t.getZoomBase();
                    t.setScale(t.scale * n ** e)
                },
                getPixelIndex: function(e, n) {
                    if (e = Math.floor(e), n = Math.floor(n), !t.loaded) return t.pixelBuffer.findIndex((t => t.x === e && t.y === n));
                    const o = t.intView[n * t.width + e],
                        a = t.rgbPalette.indexOf(o);
                    return -1 !== a ? a : 255
                },
                _setPixelIndex: function(e, n) {
                    t.intView[e] = -1 === n || 255 === n ? 0 : t.rgbPalette[n]
                },
                setPixelIndex: function(e, n, o, a) {
                    t.loaded ? (void 0 === a && (a = !0), t._setPixelIndex(n * t.width + e, o), a && t.ctx.putImageData(t.id, 0, 0)) : t.pixelBuffer.push({
                        x: e,
                        y: n,
                        c: o
                    })
                },
                refresh: function() {
                    t.loaded && t.ctx.putImageData(t.id, 0, 0)
                },
                fromScreen: function(e, n, o = !0) {
                    let a = {
                            x: 0,
                            y: 0
                        },
                        i = 0,
                        r = 0;
                    t.scale < 0 && (i = t.width, r = t.height);
                    const s = t.getScale();
                    if (t.use_js_render) a = {
                        x: -t.pan.x + (t.width - window.innerWidth / s) / 2 + e / s + i,
                        y: -t.pan.y + (t.height - window.innerHeight / s) / 2 + n / s + r
                    };
                    else {
                        const o = t.elements.board[0].getBoundingClientRect();
                        a = t.use_zoom ? {
                            x: e / s - o.left + i,
                            y: n / s - o.top + r
                        } : {
                            x: (e - o.left) / s + i,
                            y: (n - o.top) / s + r
                        }
                    }
                    return o && (a.x >>= 0, a.y >>= 0), a
                },
                toScreen: function(e, n) {
                    const o = t.getScale();
                    if (o < 0 && (e -= t.width - 1, n -= t.height - 1), t.use_js_render) return {
                        x: (e + t.pan.x - (t.width - window.innerWidth / o) / 2) * o,
                        y: (n + t.pan.y - (t.height - window.innerHeight / o) / 2) * o
                    };
                    const a = t.elements.board[0].getBoundingClientRect();
                    return t.use_zoom ? {
                        x: (e + a.left) * o,
                        y: (n + a.top) * o
                    } : {
                        x: e * o + a.left,
                        y: n * o + a.top
                    }
                },
                save: function() {
                    const e = document.createElement("a"),
                        n = i.board.snapshot.format.get();
                    e.href = t.elements.board[0].toDataURL(n, 1), e.download = (new Date).toISOString().replace(/^(\d+-\d+-\d+)T(\d+):(\d+):(\d).*$/, `pxls canvas $1 $2.$3.$4.${n.split("/")[1]}`), document.body.appendChild(e), e.click(), document.body.removeChild(e), "function" == typeof e.remove && e.remove()
                },
                getRenderBoard: function() {
                    return t.elements.board_render
                },
                validateCoordinates: (e, n) => e >= 0 && e <= t.width && n >= 0 && n <= t.height
            };
            return {
                init: t.init,
                start: t.start,
                update: t.update,
                getScale: t.getScale,
                nudgeScale: t.nudgeScale,
                setScale: t.setScale,
                getPixelIndex: t.getPixelIndex,
                setPixelIndex: t.setPixelIndex,
                fromScreen: t.fromScreen,
                toScreen: t.toScreen,
                save: t.save,
                centerOn: t.centerOn,
                getRenderBoard: t.getRenderBoard,
                getContainer: () => t.elements.container,
                getWidth: () => t.width,
                getHeight: () => t.height,
                refresh: t.refresh,
                updateViewport: t.updateViewport,
                get allowDrag() {
                    return t.allowDrag
                },
                setAllowDrag: e => {
                    t.allowDrag = !0 === e, t.allowDrag ? h.lockIcon.fadeOut(200) : h.lockIcon.fadeIn(200)
                },
                validateCoordinates: t.validateCoordinates,
                get webInfo() {
                    return t.webInfo
                },
                get snipMode() {
                    return t.webInfo && !0 === t.webInfo.snipMode
                }
            }
        }();
        t.exports.board = _
    }, {
        "./chat": 6,
        "./chromeOffsetWorkaround": 7,
        "./coords": 8,
        "./grid": 9,
        "./helpers": 10,
        "./lookup": 11,
        "./overlays": 15,
        "./panels": 16,
        "./place": 17,
        "./query": 18,
        "./settings": 20,
        "./socket": 21,
        "./storage": 22,
        "./template": 23,
        "./uiHelper": 26,
        "./user": 27
    }],
    6: [function(e, t, n) {
        const {
            ls: o
        } = e("./storage"), {
            socket: a
        } = e("./socket"), {
            panels: i
        } = e("./panels"), {
            serviceWorkerHelper: r
        } = e("./serviceworkers"), {
            settings: s
        } = e("./settings"), {
            modal: l
        } = e("./modal"), {
            TH: d
        } = e("./typeahead");
        let c, u, p, m;
        const {
            intToHex: f
        } = e("./helpers"), h = function() {
            const t = {
                ratelimitMessage: "Please wait ",
                seenHistory: !1,
                stickToBottom: !0,
                repositionTimer: !1,
                pings: 0,
                pingsList: [],
                pingAudio: new Audio("chatnotify.wav"),
                lastPingAudioTimestamp: 0,
                linkMinimumPixelCount: 0,
                sendLinkToStaff: !1,
                last_opened_panel: o.get("chat.last_opened_panel") >> 0,
                idLog: [],
                typeahead: {
                    helper: null,
                    suggesting: !1,
                    hasResults: !1,
                    highlightedIndex: 0,
                    lastLength: !1,
                    get shouldInsert() {
                        return t.typeahead.suggesting && t.typeahead.hasResults && -1 !== t.typeahead.highlightedIndex
                    }
                },
                ignored: [],
                chatban: {
                    banned: !1,
                    banStart: 0,
                    banEnd: 0,
                    permanent: !1,
                    banEndFormatted: "",
                    timeLeft: 0,
                    timer: 0
                },
                timeout: {
                    ends: 0,
                    timer: 0
                },
                elements: {
                    message_icon: $("#message-icon"),
                    panel_trigger: $(".panel-trigger[data-panel=chat]"),
                    ping_counter: $("#ping-counter"),
                    input: $("#txtChatContent"),
                    body: $("#chat-body"),
                    rate_limit_overlay: $(".chat-ratelimit-overlay"),
                    rate_limit_counter: $("#chat-ratelimit"),
                    chat_panel: $(".panel[data-panel=chat]"),
                    chat_hints: $(".chat-hints"),
                    chat_hint: $("#chat-hint"),
                    chat_settings_button: $("#btnChatSettings"),
                    pings_button: $("#btnPings"),
                    jump_button: $("#jump-to-bottom"),
                    toggle_mention_button: $("#toggle-mention"),
                    toggle_mention_label: $("#toggle-mention-label"),
                    cancel_reply_button: $("#cancel-reply"),
                    reply_label: $("#reply-label"),
                    reply_label_username: $("#reply-label-username"),
                    emoji_button: $("#emojiPanelTrigger"),
                    typeahead: $("#typeahead"),
                    typeahead_list: $("#typeahead ul"),
                    ping_audio_volume_value: $("#chat-pings-audio-volume-value"),
                    username_color_select: $("#selChatUsernameColor"),
                    username_color_feedback_label: $("#lblChatUsernameColorFeedback"),
                    user_ignore_select: $("#selChatUserIgnore"),
                    user_unignore_button: $("#btnChatUserUnignore"),
                    user_ignore_feedback_label: $("#lblChatUserIgnoreFeedback")
                },
                picker: null,
                markdownProcessor: null,
                TEMPLATE_ACTIONS: {
                    ASK: {
                        id: "ask",
                        pretty: "Ask"
                    },
                    NEW_TAB: {
                        id: "new tab",
                        pretty: "Open in a new tab"
                    },
                    CURRENT_TAB: {
                        id: "current tab",
                        pretty: "Open in current tab (replacing template)"
                    },
                    JUMP_ONLY: {
                        id: "jump only",
                        pretty: "Jump to coordinates without replacing template"
                    }
                },
                init: () => {
                    if (c = e("./uiHelper").uiHelper, u = e("./user").user, p = e("./place").place, m = e("./board").board, !s.chat.enable.get()) return void t.elements.panel_trigger.hide();
                    t.markdownProcessor = c.makeMarkdownProcessor().use((function() {
                        this.Compiler.prototype.visitors.link = (e, n) => {
                            const o = new URL(e.url, location.href),
                                a = new URLSearchParams(o.hash.substr(1)),
                                i = e => a.has(e) ? a.get(e) : o.searchParams.get(e),
                                r = parseFloat(i("x")),
                                s = parseFloat(i("y"));
                            if (location.origin && o.origin && location.origin === o.origin && !isNaN(r) && !isNaN(s) && m.validateCoordinates(r, s)) {
                                const e = parseFloat(i("scale"));
                                return t._makeCoordinatesElement(o.toString(), r, s, isNaN(e) ? 20 : e, i("template"), i("title"))
                            }
                            return crel("a", {
                                href: e.url,
                                target: "_blank"
                            }, n())
                        }, this.Compiler.prototype.visitors.coordinate = (e, n) => t._makeCoordinatesElement(e.url, e.x, e.y, e.scale)
                    })), t.reloadIgnores(), a.on("chat_user_update", (e => {
                        if (e.who && e.updates && "object" == typeof e.updates)
                            for (const n of Object.entries(e.updates)) switch (n[0]) {
                                case "NameColor":
                                    t._updateAuthorNameColor(e.who, Math.floor(n[1]));
                                    break;
                                case "DisplayedFaction":
                                    t._updateAuthorDisplayedFaction(e.who, n[1]);
                                    break;
                                default:
                                    console.warn("Got an unknown chat_user_update from %o: %o (%o)", e.who, n, e)
                            } else console.warn("Malformed chat_user_update: %o", e)
                    })), a.on("faction_update", (e => t._updateFaction(e.faction))), a.on("faction_clear", (e => t._clearFaction(e.fid))), a.on("chat_history", (e => {
                        if (t.seenHistory) return;
                        for (const n of e.messages.reverse()) t._process(n, !0);
                        const n = t.elements.body.find("li[data-id]").last()[0];
                        n && (t._doScroll(n), n.dataset.id && n.dataset.id > o.get("chat-last_seen_id") && ("message" === s.ui.chat.icon.badge.get() && t.elements.panel_trigger.addClass("has-ping"), "message" === s.ui.chat.icon.color.get() && t.elements.message_icon.addClass("has-notification"))), t.seenHistory = !0, t.addServerAction("History loaded at " + moment().format("MMM Do YYYY, hh:mm:ss A")), setTimeout((() => a.send({
                            type: "ChatbanState"
                        })), 0)
                    })), a.on("chat_message", (e => {
                        t._process(e.message);
                        const n = i.isOpen("chat");
                        if (n || ("message" === s.ui.chat.icon.badge.get() && t.elements.panel_trigger.addClass("has-ping"), "message" === s.ui.chat.icon.color.get() && t.elements.message_icon.addClass("has-notification")), t.stickToBottom) {
                            t.elements.body.find(`.chat-line[data-id="${e.message.id}"]`)[0] && (n && c.tabHasFocus() && o.set("chat-last_seen_id", e.message.id), t.elements.body[0].scrollTop = t.elements.body[0].scrollHeight)
                        }
                    })), r.addMessageListener("focus", (({
                        data: e
                    }) => {
                        if (c.tabId === e.id && i.isOpen("chat")) {
                            const e = t.elements.body.find(".chat-line[data-id]").last()[0];
                            e && o.set("chat-last_seen_id", e.dataset.id)
                        }
                    })), a.on("message_cooldown", (e => {
                        t.timeout.ends = Date.now() + 1e3 * (e.diff >> 0) + 1e3, c.tabHasFocus() && t.elements.input.val(e.message), Date.now() > t.timeout.ends ? t.elements.rate_limit_overlay.fadeOut() : t.elements.rate_limit_overlay.fadeIn(), t.timeout.timer > 0 && clearInterval(t.timeout.timer);
                        const n = () => {
                            const e = (t.timeout.ends - Date.now()) / 1e3 >> 0,
                                n = moment(t.timeout.ends).toNow(!0);
                            t.elements.rate_limit_counter.text(t.ratelimitMessage + n), e <= 0 && (t.elements.rate_limit_overlay.fadeOut(), t.elements.rate_limit_counter.text(""), clearInterval(t.timeout.timer), t.timeout.timer = 0)
                        };
                        t.timeout.timer = setInterval(n, 1e3), n()
                    })), a.on("chat_message_blocked", (e => {
                        t.sendLinkToStaff || t.addServerAction(e.message)
                    })), a.on("chat_lookup", (e => {
                        if (e.target && Array.isArray(e.history) && Array.isArray(e.chatbans)) {
                            const t = !0 === s.chat.timestamps["24h"].get(),
                                n = "MMM Do YYYY, " + (t ? "HH:mm" : "hh:mm A"),
                                o = "dddd, MMMM Do YYYY, " + (t ? "HH:mm:ss" : "h:mm:ss a"),
                                a = crel("div", {
                                    class: "halves"
                                }, crel("div", {
                                    class: "side chat-lookup-side"
                                }, e.history.length > 0 ? [crel("h3", {
                                    style: "text-align: center"
                                }, `Last ${e.history.length} messages`), crel("hr"), crel("ul", {
                                    class: "chat-history chat-body"
                                }, e.history.map((t => crel("li", {
                                    class: ("chat-line " + (t.purged ? "purged" : "")).trimRight()
                                }, crel("span", {
                                    title: moment(1e3 * t.sent).format(o)
                                }, moment(1e3 * t.sent).format(n)), " ", (() => {
                                    const t = crel("span", {
                                        class: "user"
                                    }, e.target.username);
                                    return c.styleElemWithChatNameColor(t, e.target.chatNameColor, "color"), t
                                })(), ": ", crel("span", {
                                    class: "content"
                                }, t.content)))))] : [crel("h3", {
                                    style: "text-align: center"
                                }, "Last Messages"), crel("hr"), crel("p", "No message history")]), crel("div", {
                                    class: "side chat-lookup-side"
                                }, crel("h3", {
                                    style: "text-align: center"
                                }, "Chat Bans"), crel("hr"), crel("ul", {
                                    class: "chatban-history"
                                }, e.chatbans.map((t => crel("li", crel("article", {
                                    class: "chatban"
                                }, crel("header", crel("h4", `${t.initiator_name} ${"UNBAN"===t.type?"un":""}banned ${e.target.username}${t.type,""}`)), crel("div", crel("table", crel("tbody", crel("tr", crel("th", "Reason:"), crel("td", t.reason || "$No reason provided$")), crel("tr", crel("th", "When:"), crel("td", moment(1e3 * t.when).format(o))), "UNBAN" !== t.type ? [crel("tr", crel("th", "Length:"), crel("td", "PERMA" === t.type.toUpperCase().trim() ? "Permanent" : `${t.expiry-t.when}s${t.expiry-t.when>=60?` (${moment.duration(t.expiry-t.when,"seconds").humanize()})`:""}`)), "PERMA" === t.type.toUpperCase().trim() ? null : crel("tr", crel("th", "Expiry:"), crel("td", moment(1e3 * t.expiry).format(o))), crel("tr", crel("th", "Purged:"), crel("td", String(t.purged)))] : null))))))))));
                            l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Chat Lookup"), a))
                        }
                    }));
                    const n = e => {
                        clearInterval(t.timeout.timer), t.chatban.banStart = moment.now(), t.chatban.banEnd = moment(e.expiry), t.chatban.permanent = e.permanent, t.chatban.banEndFormatted = t.chatban.banEnd.format("MMM Do YYYY, hh:mm:ss A"), setTimeout((() => {
                            clearInterval(t.chatban.timer), t.elements.input.prop("disabled", !0), t.elements.emoji_button.hide(), e.expiry - t.chatban.banStart > 0 && !e.permanent ? (t.chatban.banned = !0, t.elements.rate_limit_counter.text("You have been banned from chat."), t.addServerAction("You are banned from chat " + (e.permanent ? "permanently." : "until " + t.chatban.banEndFormatted)), e.reason && t.addServerAction(`Ban reason: ${e.reason}`), t.chatban.timer = setInterval((() => {
                                const e = t.chatban.banEnd - moment();
                                e > 0 ? (t.elements.rate_limit_overlay.show(), t.elements.rate_limit_counter.text(`Chatban expires in ${Math.ceil(e/1e3)}s, at ${t.chatban.banEndFormatted}`)) : (t.elements.rate_limit_overlay.hide(), t.elements.rate_limit_counter.text(""), t.elements.emoji_button.show(), t._handleChatbanVisualState(!0))
                            }), 150)) : e.permanent ? (t.chatban.banned = !0, t.elements.rate_limit_counter.text("You have been banned from chat."), t.addServerAction("You are banned from chat" + (e.permanent ? " permanently." : "until " + t.chatban.banEndFormatted)), e.reason && t.addServerAction(`Ban reason: ${e.reason}`)) : "chat_ban_state" !== e.type && (t.addServerAction("You have been unbanned from chat."), t.elements.rate_limit_counter.text("You cannot use chat while canvas banned."), t.chatban.banned = !1), t._handleChatbanVisualState(t._canChat())
                        }), 0)
                    };
                    a.on("chat_ban", n), a.on("chat_ban_state", n);
                    const d = (e, n, o) => {
                            if (u.hasPermission("chat.history.purged")) return t._markMessagePurged(e, n);
                            if ("chat_purge_specific" === n.type ? t.pingsList = t.pingsList.filter((e => !n.IDs.includes(e.id))) : "chat_purge" === n.type && (t.pingsList = t.pingsList.filter((t => t.author !== n.target && t.message_raw !== e.attributes["data-message-raw"].value))), !o) return e.remove();
                            for (e.classList.add("reply-preview-nojump"); e.childNodes.length > 1;) e.removeChild(e.lastChild);
                            e.appendChild(document.createTextNode("Message was purged")), e.title = ""
                        },
                        f = (e, n, o) => {
                            const a = Array.from(t.elements.body[0].querySelectorAll(e));
                            if (!Array.isArray(a) || !a.length) return;
                            const i = o ? 2147483647 : n.amount;
                            i || console.warn("_purgeSelector called without e.amount or isReplyPreview"), a.sort(((e, t) => (e.dataset.date >> 0) - (t.dataset.date >> 0)));
                            for (let e = 0; e < i; e++) {
                                const e = a.pop();
                                if (!e) break;
                                d(e, n, o)
                            }
                        };
                    a.on("chat_purge", (e => {
                        f(`.chat-line[data-author="${e.target}"]`, e, !1), f(`.reply-preview[data-author="${e.target}"]`, e, !0), e.announce && (e.amount >= 2147483647 ? t.addServerAction(`${e.initiator} purged all messages from ${e.target}.`) : t.addServerAction(`${e.amount} message${1!==e.amount?"s":""} from ${e.target} ${1!==e.amount?"were":"was"} purged by ${e.initiator}.`))
                    })), a.on("chat_purge_specific", (e => {
                        const n = [];
                        e.IDs && e.IDs.length && e.IDs.forEach((o => {
                            const a = t.elements.body.find(`.chat-line[data-id="${o}"]`)[0];
                            a && (n.push(a), f(`.reply-preview[data-id="${o}"]`, e, !0))
                        })), n.length && (n.forEach((t => d(t, e, !1))), e.announce && t.addServerAction(`${e.IDs.length} message${1!==e.IDs.length?"s":""} from ${e.target} ${1!==e.IDs.length?"were":"was"} purged by ${e.initiator}`))
                    })), a.send({
                        type: "ChatHistory"
                    }), t.elements.rate_limit_overlay.hide();
                    let h = !0;
                    const g = e => {
                        const n = e.match(/((?!-))(xn--)?[a-z0-9 ][a-z0-9_ -]{0,61}[a-z0-9 ]{0,1}\.(xn--)?([a-z0-9-]{1,61}|[a-z0-9 -]{1,30}\.[a-z ]{2,})/g);
                        return !(n && n.length && u.getPixelCountAllTime() < t.linkMinimumPixelCount)
                    };

                    function b(e, n) {
                        const o = ["del", "li"],
                            a = o[(0 + n) % 2],
                            i = o[(1 + n) % 2];
                        Array.from(document.querySelectorAll(`${a}.chat-line[data-author="${e}"]`)).forEach((e => {
                            t._changeElemTag(e, i)
                        })), Array.from(document.querySelectorAll(`.reply-preview[data-author="${e}"]`)).forEach((e => {
                            const t = e.parentNode;
                            (n ? t.firstChild.classList.contains("reply-preview") && !t.firstChild.dataset.ignoreText : t.firstChild.dataset.ignoreText) && (n || t.firstChild.remove(), (n || t.firstChild.classList.contains("reply-preview")) && (n ? t.firstChild.classList.add("hidden") : t.firstChild.classList.remove("hidden"), n && t.prepend(crel("div", {
                                class: "reply-preview reply-preview-nojump",
                                "data-ignore-text": "1"
                            }, crel("i", {
                                class: "fas fa-reply fa-flip-horizontal"
                            }), "Message was ignored"))))
                        })), n && (t.pings = t.pings.filter((t => t.author !== e)))
                    }
                    t.elements.input.on("keydown", (e => {
                        e.stopPropagation();
                        const n = t.elements.input[0].value.trim(),
                            o = t.elements.input[0].dataset.replyTarget,
                            a = "On" === t.elements.toggle_mention_button[0].dataset.state;
                        if ("Enter" !== e.originalEvent.key && 13 !== e.originalEvent.which || e.shiftKey) "Tab" !== e.originalEvent.key && 9 !== e.originalEvent.which || (e.stopPropagation(), e.preventDefault());
                        else {
                            if (e.preventDefault(), !h) return;
                            if (0 === n.length) return;
                            if (t.timeout.timer) return;
                            t.typeahead.shouldInsert || (g(n) && (t.cancelReply(), t.typeahead.lastLength = -1, t.elements.input.val("")), t._send({
                                message: n,
                                replyingToId: void 0 !== o ? o : 0,
                                replyShouldMention: a
                            }))
                        }
                    })).on("keydown keyup", (e => {
                        e.stopPropagation();
                        const n = t.elements.input[0].value.trim();
                        let o = n;
                        try {
                            o = decodeURIComponent(n)
                        } catch (e) {}
                        o.includes("data:image") ? (h = !1, t.showHint("Please upload your template image to a third-party image host.", !0)) : g(n) ? (h = !0, t.hideHints()) : (t.sendLinkToStaff || (h = !1), t.showHint("You must have at least " + t.linkMinimumPixelCount + " pixels to send links.", !0))
                    })).on("focus", (e => {
                        t.stickToBottom && setTimeout(t.scrollToBottom, 300)
                    })), $(window).on("pxls:chat:userIgnored", ((e, t) => {
                        b(t, !0)
                    })), $(window).on("pxls:chat:userUnignored", ((e, t) => {
                        b(t, !1)
                    })), $(window).on("pxls:panel:opened", ((e, n) => {
                        if ("chat" === n) {
                            o.set("chat.last_opened_panel", new Date / 1e3 >> 0), t.clearPings();
                            const e = t.elements.body.find(".chat-line[data-id]").last()[0];
                            e && o.set("chat-last_seen_id", e.dataset.id), u.isLoggedIn() ? t._handleChatbanVisualState(t._canChat()) : (t._handleChatbanVisualState(!1), t.elements.rate_limit_counter.text("You must be logged in to chat."))
                        }
                    })), window.addEventListener("storage", (e => {
                        if (e.storageArea === window.localStorage && "chat-last_seen_id" === e.key) {
                            t.elements.body.find(`.chat-line[data-id="${JSON.parse(e.newValue)}"]`).is(":last-child") && t.clearPings()
                        }
                    })), $(window).on("pxls:user:loginState", ((e, n) => {
                        t.updateInputLoginState(n), t.elements.username_color_select.disabled = n, n && (t._populateUsernameColor(), c.styleElemWithChatNameColor(t.elements.username_color_select[0], u.getChatNameColor()))
                    })), $(window).on("mouseup", (e => {
                        let t = e.target;
                        const n = document.querySelector(".popup");
                        if (n && (e.originalEvent && e.originalEvent.target && (t = e.originalEvent.target), t)) {
                            t.closest(".popup") || n.remove()
                        }
                    })), $(window).on("resize", (e => {
                        const n = document.querySelector(".popup[data-popup-for]");
                        if (!n) return;
                        const o = document.querySelector(`.chat-line[data-id="${n.dataset.popupFor}"] [data-action="actions-panel"]`);
                        if (!o) return console.warn("no cog");
                        t.repositionTimer && clearTimeout(t.repositionTimer), t.repositionTimer = setTimeout((() => {
                            t._positionPopupRelativeToX(n, o), t.repositionTimer = !1
                        }), 25)
                    })), t.elements.body[0].addEventListener("wheel", (e => {
                        const t = document.querySelector(".popup");
                        t && t.remove()
                    })), t.elements.chat_settings_button[0].addEventListener("click", (() => {
                        s.filter.search("Chat"), i.toggle("settings")
                    })), t.elements.pings_button[0].addEventListener("click", (function() {
                        const e = crel("div", {
                                class: "popup panel"
                            }),
                            n = crel("header", {
                                class: "panel-header"
                            }, crel("button", {
                                class: "left panel-closer"
                            }, crel("i", {
                                class: "fas fa-times",
                                onclick: function() {
                                    if (this && this.closest) {
                                        const e = this.closest(".popup");
                                        e && e.remove()
                                    }
                                }
                            })), crel("h2", "Pings"), crel("div", {
                                class: "right"
                            })),
                            o = crel("ul", {
                                class: "pings-list"
                            }, t.pingsList.map((e => {
                                console.info(e);
                                const n = crel("span", t.processMessage(e.message_raw));
                                return crel("li", {
                                    title: n.textContent
                                }, crel("i", {
                                    class: "fas fa-external-link-alt fa-is-left",
                                    style: "font-size: .65rem; cursor: pointer;",
                                    "data-id": e.id,
                                    onclick: t._handlePingJumpClick
                                }), `${m.snipMode?"-snip-":e.author}: `, n)
                            }))),
                            a = crel(e, n, crel("div", {
                                class: "pane pane-full"
                            }, o));
                        document.body.appendChild(a), t._positionPopupRelativeToX(a, this), o.scrollTop = o.scrollHeight
                    })), t.elements.jump_button[0].addEventListener("click", t.scrollToBottom), t.elements.jump_button[0].addEventListener("mousedown", (e => e.preventDefault())), t.elements.cancel_reply_button[0].addEventListener("click", t.cancelReply), t.elements.reply_label_username[0].addEventListener("click", (() => {
                        t.scrollToCMID(t.elements.input[0].dataset.replyTarget)
                    })), t.elements.reply_label_username[0].addEventListener("mousedown", (e => e.preventDefault())), t.elements.toggle_mention_button[0].addEventListener("click", t.toggleMention), t.elements.toggle_mention_button[0].addEventListener("mousedown", (e => e.preventDefault()));
                    const y = document.querySelector('.panel[data-panel="notifications"] .panel-body');
                    t.elements.body.css("font-size", `${s.chat.font.size.get()>>0||16}px`), y.style.fontSize = `${s.chat.font.size.get()>>0||16}px`, t.elements.body.on("scroll", (e => {
                        t.updateStickToBottom(), t.stickToBottom && t.elements.chat_panel[0].classList.contains("open") && t.clearPings(), t.elements.jump_button.css("display", t.stickToBottom ? "none" : "block")
                    })), s.chat.font.size.listen((function(e) {
                        if (isNaN(e)) l.showText("Invalid chat font size. Expected a number between 1 and 72."), s.chat.font.size.set(16);
                        else {
                            const n = e >> 0;
                            n < 1 || n > 72 ? (l.showText("Invalid chat font size. Expected a number between 1 and 72."), s.chat.font.size.set(16)) : (t.elements.body.css("font-size", `${n}px`), document.querySelector('.panel[data-panel="notifications"] .panel-body').style.fontSize = `${n}px`)
                        }
                    })), s.chat.truncate.max.listen((function(e) {
                        if (isNaN(e)) l.showText("Invalid maximum chat messages. Expected a number greater than 50."), s.chat.truncate.max.set(50);
                        else {
                            e >> 0 < 50 && (l.showText("Invalid maximum chat messages. Expected a number greater than 50."), s.chat.truncate.max.set(50))
                        }
                    })), s.chat.pings.audio.volume.listen((function(e) {
                        const n = parseFloat(e),
                            o = isNaN(n) ? 1 : n;
                        t.elements.ping_audio_volume_value.text((100 * o >> 0) + "%")
                    })), s.chat.badges.enable.listen((function() {
                        t._toggleTextIconFlairs()
                    })), s.chat.factiontags.enable.listen((function() {
                        t._toggleFactionTagFlairs()
                    }));
                    const w = $("#setting-chat-links-internal-behavior");
                    w.append(Object.values(t.TEMPLATE_ACTIONS).map((e => crel("option", {
                        value: e.id
                    }, e.pretty)))), s.chat.links.internal.behavior.controls.add(w), t.elements.username_color_select.disabled = !0, t.elements.user_ignore_select.append(t.getIgnores().sort(((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()))).map((e => crel("option", {
                        value: e
                    }, e)))), t.elements.user_unignore_button.on("click", (function() {
                        t.removeIgnore(t.elements.user_ignore_select.val()) ? (t.elements.user_ignore_select.find(`option[value="${t.elements.user_ignore_select.val()}"]`).remove(), t.elements.user_ignore_feedback_label.text("User unignored."), t.elements.user_ignore_feedback_label.css("color", "var(--text-red-color)"), t.elements.user_ignore_feedback_label.css("display", "block"), setTimeout((() => t.elements.user_ignore_feedback_label.fadeOut(500)), 3e3)) : 0 === t.ignored.length ? (t.elements.user_ignore_feedback_label.text("You haven't ignored any users. Congratulations!"), t.elements.user_ignore_feedback_label.css("color", "var(--text-red-color)"), t.elements.user_ignore_feedback_label.css("display", "block"), setTimeout((() => t.elements.user_ignore_feedback_label.fadeOut(500)), 3e3)) : (t.elements.user_ignore_feedback_label.text("Failed to unignore user. Either they weren't actually ignored, or an error occurred. Contact a developer if the problem persists."), t.elements.user_ignore_feedback_label.css("color", "var(--text-red-color)"), t.elements.user_ignore_feedback_label.css("display", "block"), setTimeout((() => t.elements.user_ignore_feedback_label.fadeOut(500)), 5e3))
                    }))
                },
                disable: () => {
                    i.setEnabled("chat", !1), t.elements.username_color_select.attr("disabled", "")
                },
                _handleChatbanVisualState(e) {
                    e ? (t.elements.input.prop("disabled", !1), t.elements.rate_limit_overlay.hide(), t.elements.rate_limit_counter.text(""), t.elements.emoji_button.show()) : (t.elements.input.prop("disabled", !0), t.elements.rate_limit_overlay.show(), t.elements.emoji_button.hide())
                },
                webinit(e) {
                    t.setCharLimit(e.chatCharacterLimit), t.setLinkMinimumPixelCount(e.chatLinkMinimumPixelCount), t.setLinkSendToStaff(e.chatLinkSendToStaff), t.ratelimitMessage = e.chatRatelimitMessage, t.canvasBanRespected = e.chatRespectsCanvasBan, t._populateUsernameColor(), t.elements.username_color_select.value = u.getChatNameColor(), t.elements.username_color_select.on("change", (function() {
                        t.elements.username_color_select.disabled = !0;
                        const e = this.value >> 0;
                        $.post({
                            type: "POST",
                            url: "/chat/setColor",
                            data: {
                                color: e
                            },
                            success: () => {
                                u.setChatNameColor(e), t.updateSelectedNameColor(e), t.elements.username_color_feedback_label.innerText = "Color updated"
                            },
                            error: e => {
                                const n = e.responseJSON && e.responseJSON.details ? e.responseJSON.details : e.responseText;
                                200 === e.status ? t.elements.username_color_feedback_label.innerText = n : t.elements.username_color_feedback_label.innerText = "Couldn't change chat color: " + n
                            },
                            complete: () => {
                                t.elements.username_color_select.value = u.getChatNameColor(), t.elements.username_color_select.disabled = !1
                            }
                        })
                    })), e.chatEnabled ? (t.customEmoji = e.customEmoji.map((({
                        name: e,
                        emoji: t
                    }) => ({
                        name: e,
                        emoji: `./emoji/${t}`
                    }))), t.initEmojiPicker(), t.initTypeahead()) : t.disable()
                },
                initTypeahead() {
                    const e = new d.Database("emoji", {}, !1, !1, (e => twemoji.test(e.value) ? e.value : ":" + e.key + ":"), (e => twemoji.test(e.value) ? `${twemoji.parse(e.value)} :${e.key}:` : `${'<img class="emoji emoji--custom" draggable="false" alt="'+e.key+'" src="'+e.value+'"/>'} :${e.key}:`)),
                        n = new d.Database("users", {}, !1, !1, (e => `@${e.value} `), (e => `@${e.value}`));
                    window.emojiDB && Object.keys(window.emojiDB).sort(((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()))).forEach((t => {
                        e.addEntry(t, window.emojiDB[t])
                    })), t.customEmoji.length > 0 && t.customEmoji.forEach((function(t) {
                        window.emojiDB[t.name.toLowerCase()] = t.emoji, e.addEntry(t.name, t.emoji)
                    }));
                    const o = new d.Trigger(":", "emoji", !0, 2),
                        a = new d.Trigger("@", "users", !1);

                    function i() {
                        const e = t.typeahead.helper.scan(t.elements.input[0].selectionStart, t.elements.input[0].value);
                        let n = !1;
                        if (t.typeahead.lastLength = t.elements.input[0].value.length, t.typeahead.suggesting = !1 !== e, e)
                            if (n = t.typeahead.helper.suggestions(e), t.typeahead.hasResults = n.length > 0, n.length) {
                                t.elements.typeahead_list[0].innerHTML = "";
                                const o = t.typeahead.helper.getDatabase(e.trigger.dbType),
                                    a = n.slice(0, 50).map((n => {
                                        const a = crel("button", {
                                            "data-insert": o.inserter(n),
                                            "data-start": e.start,
                                            "data-end": e.end,
                                            onclick: t._handleTypeaheadInsert
                                        });
                                        return a.innerHTML = o.renderer(n), crel("li", a)
                                    }));
                                a[0].classList.add("active"), crel(t.elements.typeahead_list[0], a)
                            } else t.elements.typeahead_list[0].innerHTML = '<li class="no-results">No Results</li>';
                        t.elements.typeahead[0].style.display = t.typeahead.suggesting && t.typeahead.hasResults ? "block" : "none", document.body.classList.toggle("typeahead-open", t.typeahead.suggesting)
                    }
                    t.typeahead.helper = new d.Typeahead([o, a], [" "], [e, n]), window.th = t.typeahead.helper, t.elements.typeahead[0].querySelectorAll('[data-dismiss="typeahead"]').forEach((e => e.addEventListener("click", (() => {
                        t.resetTypeahead(), t.elements.input[0].focus()
                    })))), t.elements.input[0].addEventListener("click", (() => i())), t.elements.input[0].addEventListener("keyup", (function(e) {
                        switch (e.key || e.code || e.which || e.charCode) {
                            case "Escape":
                            case 27:
                                t.typeahead.suggesting && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), t.resetTypeahead());
                                break;
                            case "Tab":
                            case 9:
                                if (t.typeahead.suggesting) return e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), void t.selectNextTypeaheadEntry(e.shiftKey ? -1 : 1);
                                i();
                                break;
                            case "ArrowUp":
                            case 38:
                                if (t.typeahead.suggesting) return e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), void t.selectNextTypeaheadEntry(-1);
                                break;
                            case "ArrowDown":
                            case 40:
                                if (t.typeahead.suggesting) return e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), void t.selectNextTypeaheadEntry(1);
                                break;
                            case "Enter":
                            case 13:
                                if (t.typeahead.shouldInsert) {
                                    e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
                                    const n = t.elements.typeahead_list[0].querySelector("button[data-insert].active");
                                    if (n) t._handleTypeaheadInsert(n);
                                    else {
                                        const e = t.elements.typeahead_list[0].querySelector("li:first-child > button[data-insert]");
                                        e && t._handleTypeaheadInsert(e)
                                    }
                                    return
                                }
                        }
                        t.elements.input[0].value.length !== t.typeahead.lastLength && i()
                    }))
                },
                _handleTypeaheadInsert: function(e) {
                    if (this instanceof HTMLElement) e = this;
                    else if (!(e instanceof HTMLElement)) return console.warn("Got non-elem on handleTypeaheadInsert: %o", e);
                    const n = parseInt(e.dataset.start),
                        o = parseInt(e.dataset.end),
                        a = e.dataset.insert || "";
                    if (!a || n >= o) return console.warn("Got invalid data on elem %o.");
                    t.elements.input[0].value = t.elements.input[0].value.substring(0, n) + a + t.elements.input[0].value.substring(o), t.elements.input[0].focus(), t.resetTypeahead()
                },
                selectNextTypeaheadEntry(e) {
                    let n = t.typeahead.highlightedIndex + e;
                    const o = t.elements.typeahead_list[0].querySelectorAll("button[data-insert]");
                    e < 0 && n < 0 ? n = o.length - 1 : e > 0 && n >= o.length && (n = 0);
                    const a = o[-1 === t.typeahead.highlightedIndex ? n : t.typeahead.highlightedIndex];
                    a && a.classList.remove("active"), o[n].classList.add("active"), o[n].scrollIntoView(), t.typeahead.highlightedIndex = n
                },
                resetTypeahead: () => {
                    t.typeahead.suggesting = !1, t.typeahead.hasResults = !1, t.typeahead.highlightedIndex = 0, t.elements.typeahead[0].style.display = "none", t.elements.typeahead_list[0].innerHTML = "", document.body.classList.remove("typeahead-open")
                },
                initEmojiPicker() {
                    const e = {
                        position: "left-start",
                        style: "twemoji",
                        zIndex: 30,
                        emojiVersion: "13.0"
                    };
                    t.customEmoji.length > 0 && (e.custom = t.customEmoji), t.picker = new EmojiButton.EmojiButton(e), t.picker.on("emoji", (e => {
                        e.custom ? (t.elements.input[0].value += ":" + e.name + ":", t.elements.input[0].focus()) : (t.elements.input[0].value += e.emoji, t.elements.input[0].focus())
                    })), t.elements.emoji_button.on("click", (function() {
                        t.picker.pickerVisible ? t.picker.hidePicker() : t.picker.showPicker(this);
                        const e = t.picker.pickerEl.querySelector(".emoji-picker__search");
                        e && e.addEventListener("keydown", (e => e.stopPropagation()))
                    }))
                },
                _changeElemTag: (e, t) => {
                    const n = document.createElement(t);
                    for (const t of e.attributes) n.setAttribute(t.name, t.value);
                    for (; e.firstChild;) n.appendChild(e.firstChild);
                    e.replaceWith(n)
                },
                reloadIgnores: () => {
                    t.ignored = (o.get("chat.ignored") || "").split(",")
                },
                saveIgnores: () => o.set("chat.ignored", (t.ignored || []).join(",")),
                addIgnore: e => e.toLowerCase().trim() !== u.getUsername().toLowerCase().trim() && !t.ignored.includes(e) && (t.ignored.push(e), t.saveIgnores(), $(window).trigger("pxls:chat:userIgnored", e), t.elements.user_ignore_select.append(crel("option", {
                    value: e
                }, e)), !0),
                removeIgnore: e => {
                    const n = t.ignored.indexOf(e);
                    if (n >= 0) {
                        const o = t.ignored.splice(n, 1);
                        return t.saveIgnores(), $(window).trigger("pxls:chat:userUnignored", !(!o || !o[0]) && o[0]), t.elements.user_ignore_select.find(`option[value="${e}"]`).remove(), o && o[0]
                    }
                    return !1
                },
                getIgnores: () => [].concat(t.ignored || []),
                updateStickToBottom() {
                    const e = t.elements.body[0];
                    t.stickToBottom = t._numWithinDrift(e.scrollTop >> 0, e.scrollHeight - e.offsetHeight, 2)
                },
                _handlePingJumpClick: function() {
                    this && this.dataset && this.dataset.id && t.scrollToCMID(this.dataset.id)
                },
                scrollToCMID(e) {
                    const n = t.elements.body[0].querySelector(`.chat-line[data-id="${e}"]`);
                    if (n) {
                        t._doScroll(n);
                        const e = function() {
                            n.removeEventListener("animationend", e), n.classList.remove("-scrolled-to")
                        };
                        n.addEventListener("animationend", e), n.classList.add("-scrolled-to")
                    }
                },
                scrollToBottom() {
                    t.elements.body[0].scrollTop = t.elements.body[0].scrollHeight, t.stickToBottom = !0
                },
                toggleMention() {
                    const e = t.elements.toggle_mention_button[0];
                    e.dataset.state = "On" === e.dataset.state ? "Off" : "On", t.elements.toggle_mention_label[0].innerHTML = "On" === e.dataset.state ? "On" : "Off"
                },
                cancelReply() {
                    const e = t.elements.input[0].dataset.replyTarget;
                    if (!e) return;
                    $(`[data-id=${e}]`).removeClass("replying-to"), t.elements.body.css("padding-bottom", "0"), delete t.elements.input[0].dataset.replyTarget, t.elements.reply_label[0].style.display = "none", t.elements.reply_label_username[0].removeChild(t.elements.reply_label_username[0].lastChild), t.elements.jump_button.css("top", "-1.25rem"), t.elements.toggle_mention_button[0].dataset.state = "On", t.elements.toggle_mention_label[0].innerHTML = "On"
                },
                setCharLimit(e) {
                    t.elements.input.prop("maxlength", e)
                },
                setLinkMinimumPixelCount(e) {
                    t.linkMinimumPixelCount = e
                },
                setLinkSendToStaff(e) {
                    t.sendLinkToStaff = e
                },
                isChatBanned: () => t.chatban.permanent || t.chatban.banEnd - moment.now() > 0,
                updateInputLoginState: e => {
                    const n = t.isChatBanned();
                    e && !n ? (t.elements.input.prop("disabled", !1), t.elements.rate_limit_overlay.hide(), t.elements.rate_limit_counter.text(""), t.elements.emoji_button.show()) : (t.elements.input.prop("disabled", !0), t.elements.rate_limit_overlay.show(), n || t.elements.rate_limit_counter.text("You must be logged in to chat."), t.elements.emoji_button.hide())
                },
                clearPings: () => {
                    t.elements.message_icon.removeClass("has-notification"), t.elements.panel_trigger.removeClass("has-ping"), t.elements.pings_button.removeClass("has-notification"), t.pings = 0
                },
                _numWithinDrift: (e, t, n) => e >= t - n && e <= t + n,
                showHint: (e, n = !1) => {
                    t.elements.chat_hints.show(), t.elements.chat_hint.toggleClass("text-red", !0 === n).text(e)
                },
                hideHints: () => {
                    t.elements.chat_hints.hide()
                },
                addServerAction: e => {
                    const n = moment(),
                        o = crel("li", {
                            class: "chat-line server-action"
                        }, crel("span", {
                            title: n.format("MMM Do YYYY, hh:mm:ss A")
                        }, n.format(!0 === s.chat.timestamps["24h"].get() ? "HH:mm" : "hh:mm A")), document.createTextNode(" - "), crel("span", {
                            class: "content"
                        }, e));
                    t.elements.body.append(o), t.stickToBottom && t._doScroll(o)
                },
                _send: e => {
                    e.type = "ChatMessage", a.send(e)
                },
                jump: (e, t, n) => {
                    "number" != typeof e && (e = parseFloat(e)), "number" != typeof t && (t = parseFloat(t)), null == n ? n = !1 : "number" != typeof n && (n = parseFloat(n)), m.centerOn(e, t), n && m.setScale(n, !0)
                },
                updateSelectedNameColor: e => {
                    t.elements.username_color_select[0].value = e, c.styleElemWithChatNameColor(t.elements.username_color_select[0], e)
                },
                _populateUsernameColor: () => {
                    const e = e => u.hasPermission(`chat.usercolor.${e}`),
                        n = e("donator") || e("donator.*");
                    t.elements.username_color_select.empty().append(e("rainbow") ? crel("option", {
                        value: -1,
                        class: "rainbow"
                    }, "*. Rainbow") : null, n || e("donator.green") ? crel("option", {
                        value: -2,
                        class: "donator donator--green"
                    }, "*. Donator Green") : null, n || e("donator.gray") ? crel("option", {
                        value: -3,
                        class: "donator donator--gray"
                    }, "*. Donator Gray") : null, n || e("donator.synthwave") ? crel("option", {
                        value: -4,
                        class: "donator donator--synthwave"
                    }, "*. Donator Synthwave") : null, n || e("donator.ace") ? crel("option", {
                        value: -5,
                        class: "donator donator--ace"
                    }, "*. Donator Asexual") : null, n || e("donator.trans") ? crel("option", {
                        value: -6,
                        class: "donator donator--trans"
                    }, "*. Donator Transgender") : null, n || e("donator.bi") ? crel("option", {
                        value: -7,
                        class: "donator donator--bi"
                    }, "*. Donator Bisexual") : null, n || e("donator.pan") ? crel("option", {
                        value: -8,
                        class: "donator donator--pan"
                    }, "*. Donator Pansexual") : null, n || e("donator.nonbinary") ? crel("option", {
                        value: -9,
                        class: "donator donator--nonbinary"
                    }, "*. Donator Nonbinary") : null, n || e("donator.mines") ? crel("option", {
                        value: -10,
                        class: "donator donator--mines"
                    }, "*. Donator Mines") : null, n || e("donator.eggplant") ? crel("option", {
                        value: -11,
                        class: "donator donator--eggplant"
                    }, "*. Donator Eggplant") : null, n || e("donator.banana") ? crel("option", {
                        value: -12,
                        class: "donator donator--banana"
                    }, "*. Donator Banana") : null, n || e("donator.teal") ? crel("option", {
                        value: -13,
                        class: "donator donator--teal"
                    }, "*. Donator Teal") : null, n || e("donator.icy") ? crel("option", {
                        value: -14,
                        class: "donator donator--icy"
                    }, "*. Donator Icy") : null, n || e("donator.icy") ? crel("option", {
                        value: -15,
                        class: "donator donator--blood"
                    }, "*. Donator Blood") : null, p.palette.map((({
                        name: e,
                        value: t
                    }, n) => crel("option", {
                        value: n,
                        "data-idx": n,
                        style: `background-color: #${t}`
                    }, `${n}. ${e}`)))), t.elements.username_color_select[0].value = u.getChatNameColor()
                },
                _updateAuthorNameColor: (e, n) => {
                    t.elements.body.find(`.chat-line[data-author="${e}"] > :not(.reply-preview) .user, .reply-preview[data-author="${e}"] .user`).each((function() {
                        c.styleElemWithChatNameColor(this, n, "color")
                    }))
                },
                _updateAuthorDisplayedFaction: (e, n) => {
                    const o = n && n.tag || "",
                        a = n ? f(n && n.color) : null,
                        i = n && n.tag ? `[${twemoji.parse(n.tag)}]` : "";
                    let r = "";
                    n && null != n.name && null != n.id && (r = `${n.name} (ID: ${n.id})`), t.elements.body.find(`.chat-line[data-author="${e}"], .reply-preview[data-author="${e}"]`).each((function() {
                        this.dataset.faction = n && n.id || "", this.dataset.tag = o, $(this).children("span").find(".faction-tag").each((function() {
                            this.dataset.tag = o, this.style.color = a, this.style.display = !0 === s.chat.factiontags.enable.get() ? "initial" : "none", this.innerHTML = i, this.setAttribute("title", r)
                        }))
                    }))
                },
                _updateFaction: e => {
                    if (null == e || null == e.id) return;
                    const n = `#${("000000"+(e.color>>>0).toString(16)).slice(-6)}`;
                    t.elements.body.find(`.chat-line[data-faction="${e.id}"], .reply-preview[data-faction="${e.id}"]`).each((function() {
                        this.dataset.tag = e.tag, $(this).children("span").find(".faction-tag").attr("data-tag", e.tag).attr("title", `${e.name} (ID: ${e.id})`).css("color", n).html(`[${twemoji.parse(e.tag)}]`)
                    }))
                },
                _clearFaction: e => {
                    null != e && t.elements.body.find(`.chat-line[data-faction="${e}"], .reply-preview[data-faction="${e}"]`).each((function() {
                        const e = $(this).children("span").find(".faction-tag")[0];
                        ["tag", "faction", "title"].forEach((t => {
                            this.dataset[t] = "", e.dataset[t] = ""
                        })), e.innerHTML = ""
                    }))
                },
                _toggleTextIconFlairs: (e = !0 === s.chat.badges.enable.get()) => {
                    t.elements.body.find(".chat-line .flairs .text-badge").each((function() {
                        this.style.display = e ? "initial" : "none"
                    }))
                },
                _toggleFactionTagFlairs: (e = !0 === s.chat.factiontags.enable.get()) => {
                    t.elements.body.find('.chat-line:not([data-faction=""]) > span > .userDisplay > .flairs > .faction-tag, .reply-preview:not([data-faction=""]) > span > .userDisplay > .flairs > .faction-tag').each((function() {
                        this.style.display = e ? "initial" : "none"
                    }))
                },
                hooks: [],
                registerHook: function(...e) {
                    return t.hooks.push(...$.map(e, (function(e) {
                        return {
                            id: e.id || "hook",
                            get: e.get || function() {}
                        }
                    })))
                },
                replaceHook: function(e, n) {
                    delete n.id;
                    for (const o in t.hooks) {
                        const a = t.hooks[o];
                        if (a.id === e) return void(t.hooks[o] = Object.assign(a, n))
                    }
                },
                unregisterHook: function(e) {
                    t.hooks = $.grep(t.hooks, (function(t) {
                        return t.id !== e
                    }))
                },
                _process: (e, n = !1) => {
                    if (e.id) {
                        if (t.idLog.includes(e.id)) return;
                        t.idLog.unshift(e.id), t.idLog.length > 50 && t.idLog.pop()
                    }
                    const o = t.hooks.map((t => Object.assign({}, {
                        pings: []
                    }, t.get(e))));
                    m.snipMode || t.typeahead.helper.getDatabase("users").addEntry(e.author, e.author);
                    let a = !m.snipMode && !0 === s.chat.pings.enable.get() && u.isLoggedIn() && o.some((e => e.pings.length > 0));
                    const r = moment.unix(e.date),
                        l = crel("span", {
                            class: "flairs"
                        });
                    Array.isArray(e.badges) && e.badges.forEach((e => {
                        switch (e.type) {
                            case "text": {
                                const t = s.chat.badges.enable.get() ? "initial" : "none";
                                crel(l, crel("span", {
                                    class: "flair text-badge",
                                    style: `display: ${t}`,
                                    title: e.tooltip || ""
                                }, e.displayName || ""));
                                break
                            }
                            case "icon":
                                crel(l, crel("span", {
                                    class: "flair icon-badge"
                                }, crel("i", {
                                    class: e.cssIcon || "",
                                    title: e.tooltip || ""
                                }, document.createTextNode(" "))))
                        }
                    }));
                    const d = e.strippedFaction ? e.strippedFaction.tag : "";
                    if (!m.snipMode) {
                        const t = e.strippedFaction ? f(e.strippedFaction.color) : 0,
                            n = e.strippedFaction && !0 === s.chat.factiontags.enable.get() ? "initial" : "none",
                            o = e.strippedFaction ? `${e.strippedFaction.name} (ID: ${e.strippedFaction.id})` : "",
                            a = crel("span", {
                                class: "flair faction-tag",
                                "data-tag": d,
                                style: `color: ${t}; display: ${n}`,
                                title: o
                            });
                        a.innerHTML = `[${twemoji.parse(d)}]`, crel(l, a)
                    }
                    const h = crel("span", {
                        class: "content"
                    }, t.processMessage(e.message_raw, (e => {
                        e !== u.getUsername() || a || (a = !0)
                    })));
                    let g = "user";
                    Array.isArray(e.authorNameClass) && (g += ` ${e.authorNameClass.join(" ")}`);
                    const b = t.elements.body.children().length - s.chat.truncate.max.get();
                    b > 1 && t.elements.body.children().slice(0, b).remove();
                    const y = t._generateReplyPreview(e.replyingToId, e.replyShouldMention, a);
                    a = y.hasPing;
                    const w = crel("span", {
                            class: "userDisplay"
                        }, l, crel("span", {
                            class: g,
                            style: `color: #${p.getPaletteColorValue(e.authorNameColor)}`,
                            onclick: t._popUserPanel,
                            onmousemiddledown: t._addAuthorMentionToChatbox
                        }, m.snipMode ? "-snip-" : e.author)),
                        v = crel("span", {}, w, document.createTextNode(": "), h, document.createTextNode(" ")),
                        x = !t.snipMode && t.ignored.indexOf(e.author) >= 0,
                        _ = crel(x ? "del" : "li", {
                            "data-id": e.id,
                            "data-tag": m.snipMode ? "" : d,
                            "data-faction": m.snipMode ? "" : e.strippedFaction && e.strippedFaction.id || "",
                            "data-author": e.author,
                            "data-date": e.date,
                            "data-badges": JSON.stringify(e.badges || []),
                            "data-message-raw": e.message_raw,
                            class: `chat-line${a?" has-ping":""} ${e.author.toLowerCase().trim()===u.getUsername().toLowerCase().trim()?"is-from-us":""}`
                        }, y.div, crel("span", {
                            title: r.format("MMM Do YYYY, hh:mm:ss A")
                        }, r.format(!0 === s.chat.timestamps["24h"].get() ? "HH:mm" : "hh:mm A")), document.createTextNode(" "), v, crel("button", {
                            class: "reply-button",
                            title: "Reply",
                            onclick: n => {
                                t._addReplyToChatbox(n, e.id, w)
                            },
                            onmousedown: e => e.preventDefault()
                        }, crel("i", {
                            class: "fas fa-reply"
                        })));
                    if (t.elements.body.append(_), e.purge && t._markMessagePurged(_, e.purge), e.authorWasShadowBanned && t._markMessageShadowBanned(_), a && !x && !e.purge) {
                        t.pingsList.push(e), i.isOpen("chat") && t.stickToBottom || e.date < t.last_opened_panel || (++t.pings, "ping" === s.ui.chat.icon.badge.get() && t.elements.panel_trigger.addClass("has-ping"), "ping" === s.ui.chat.icon.color.get() && t.elements.message_icon.addClass("has-notification"));
                        const o = s.chat.pings.audio.when.get(),
                            a = !n && s.audio.enable.get() && "off" !== o && Date.now() - t.lastPingAudioTimestamp > 5e3;
                        i.isOpen("chat") && document.hasFocus() && "always" !== o || !c.tabHasFocus() || !a || (t.pingAudio.volume = parseFloat(s.chat.pings.audio.volume.get()), t.pingAudio.play(), t.lastPingAudioTimestamp = Date.now())
                    }
                },
                processMessage: (e, n) => {
                    let o = e;
                    try {
                        const a = t.markdownProcessor().use(pxlsMarkdown.plugins.mention, {
                            mentionCallback: n
                        });
                        o = a.processSync(e).result
                    } catch (t) {
                        console.error(`could not process chat message "${e}"`, t, "\nDefaulting to raw content.")
                    }
                    return o
                },
                _generateReplyPreview: (e, n, o) => {
                    if (0 === e) return {
                        div: [],
                        hasPing: o
                    };
                    const a = $(`.chat-line[data-id=${e}]`);
                    if (!a[0]) return {
                        div: crel("div", {
                            class: "reply-preview reply-preview-nojump"
                        }, crel("i", {
                            class: "fas fa-reply fa-flip-horizontal"
                        }), "Message couldn't be found"),
                        hasPing: o
                    };
                    const i = a.children(".reply-preview").length + 1,
                        r = a.children().eq(i).clone();
                    if (!r[0]) return {
                        div: crel("div", {
                            class: "reply-preview reply-preview-nojump"
                        }, crel("i", {
                            class: "fas fa-reply fa-flip-horizontal"
                        }), "Message couldn't be found"),
                        hasPing: o
                    };
                    Array.from(r[0].querySelectorAll(".content a")).forEach((e => e.removeAttribute("href")));
                    const s = a[0].dataset.author;
                    s === u.getUsername() && !o && n && (o = !0);
                    const l = !m.snipMode && t.ignored.indexOf(s) >= 0,
                        d = ["reply-preview"];
                    a[0].classList.contains("purged") && d.push("purged"), a[0].classList.contains("shadow-banned") && d.push("shadow-banned"), l && d.push("hidden"), n && r.find(".user").prepend("@");
                    const c = [crel("div", {
                        class: d.join(" "),
                        dataset: ["id", "tag", "faction", "author", "date"].reduce(((e, t) => (e[t] = a[0].dataset[t], e)), {}),
                        title: `${s}: ${a[0].dataset.messageRaw}`,
                        onclick: t._handlePingJumpClick,
                        onmousedown: e => e.preventDefault()
                    }, crel("i", {
                        class: "fas fa-reply fa-flip-horizontal"
                    }), r[0])];
                    return l && c.unshift(crel("div", {
                        class: "reply-preview reply-preview-nojump",
                        "data-ignore-text": "1"
                    }, crel("i", {
                        class: "fas fa-reply fa-flip-horizontal"
                    }), "Message was ignored")), {
                        div: c,
                        hasPing: o
                    }
                },
                _markMessagePurged: (e, t) => {
                    e.classList.add("purged");
                    const n = t.reason || "none provided";
                    e.setAttribute("title", `Purged by ${t.initiator} with reason: ${n}`), e.dataset.purgedBy = t.initiator
                },
                _markMessageShadowBanned: e => {
                    e.classList.add("shadow-banned"), e.dataset.shadowBanned = "true"
                },
                _makeCoordinatesElement: (e, n, o, a, i, r) => {
                    let d = `(${n}, ${o}${null!=a?`, ${a}x`:""})`;
                    if (null != i && i.length >= 11) {
                        let e = !0 !== s.chat.links.templates.preferurls.get() && r && r.trim() ? r : i;
                        try {
                            e = decodeURIComponent(e)
                        } catch (e) {
                            if (!(e instanceof URIError)) throw e
                        }
                        e.length > 25 && (e = `${e.substr(0,22)}...`), d += ` (template: ${e})`
                    }
                    return crel("a", {
                        class: "link coordinates",
                        dataset: {
                            raw: e,
                            x: n,
                            y: o,
                            scale: a,
                            template: i,
                            title: r
                        },
                        href: e,
                        onclick: function(e) {
                            if (!(e.shiftKey || e.ctrlKey || e.metaKey))
                                if (e.preventDefault(), i) {
                                    const n = s.chat.links.internal.behavior.get();
                                    n === t.TEMPLATE_ACTIONS.ASK.id ? t._popTemplateOverwriteConfirm(e.target).then((n => {
                                        l.closeAll(), t._handleTemplateOverwriteAction(n, e.target)
                                    })) : t._handleTemplateOverwriteAction(n, e.target)
                                } else t.jump(parseFloat(n), parseFloat(o), parseFloat(a))
                        }
                    }, d)
                },
                _handleTemplateOverwriteAction: (e, n) => {
                    switch (e) {
                        case !1:
                            break;
                        case t.TEMPLATE_ACTIONS.CURRENT_TAB.id:
                            t._pushStateMaybe(), document.location.href = n.dataset.raw;
                            break;
                        case t.TEMPLATE_ACTIONS.JUMP_ONLY.id:
                            t._pushStateMaybe(), t.jump(parseFloat(n.dataset.x), parseFloat(n.dataset.y), parseFloat(n.dataset.scale));
                            break;
                        case t.TEMPLATE_ACTIONS.NEW_TAB.id:
                            window.open(n.dataset.raw, "_blank") || l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Open Failed"), crel("div", crel("h3", "Failed to automatically open in a new tab"), crel("a", {
                                href: n.dataset.raw,
                                target: "_blank"
                            }, "Click here to open in a new tab instead"))))
                    }
                },
                _popTemplateOverwriteConfirm: e => new Promise(((e, n) => {
                    const o = crel("div");
                    l.show(l.buildDom(crel("h2", {
                        class: "modal-title"
                    }, "Open Template"), crel(o, crel("h3", {
                        class: "text-orange"
                    }, "This link will overwrite your current template. What would you like to do?"), Object.values(t.TEMPLATE_ACTIONS).map((e => e.id === t.TEMPLATE_ACTIONS.ASK.id ? null : crel("label", {
                        style: "display: block; margin: 3px 3px 3px 1rem; margin-left: 1rem;"
                    }, crel("input", {
                        type: "radio",
                        name: "link-action-rb",
                        "data-action-id": e.id
                    }), e.pretty))), crel("span", {
                        class: "text-muted"
                    }, "Note: You can set a default action in the settings menu which bypasses this popup completely.")), [
                        ["Cancel", () => e(!1)],
                        ["OK", () => e(o.querySelector("input[type=radio]:checked").dataset.actionId)]
                    ].map((e => crel("button", {
                        class: "text-button",
                        style: "margin-left: 3px; position: initial !important; bottom: initial !important; right: initial !important;",
                        onclick: e[1]
                    }, e[0]))))), o.querySelector(`input[type="radio"][data-action-id="${t.TEMPLATE_ACTIONS.NEW_TAB.id}"]`).checked = !0
                })),
                _pushStateMaybe(e) {
                    "function" == typeof history.pushState && history.pushState(null, document.title, null == e ? document.location.href : e)
                },
                _addAuthorMentionToChatbox: function(e) {
                    if (e.preventDefault(), this && this.closest) {
                        const e = this.closest(".chat-line[data-id]");
                        if (!e) return console.warn("no closets chat-line on self: %o", this);
                        t.elements.input.val(t.elements.input.val() + "@" + e.dataset.author + " "), t.elements.input.focus()
                    }
                },
                _addReplyToChatbox: function(e, n, o) {
                    t.cancelReply(), e.shiftKey && t.toggleMention();
                    $(`.chat-line[data-id=${n}]`).addClass("replying-to"), t.elements.input[0].dataset.replyTarget = n, t.elements.reply_label_username[0].appendChild(o.cloneNode(!0)), t.elements.reply_label[0].style.display = "flex", t.elements.jump_button.css("top", "-2.5rem"), t.elements.body.css("padding-bottom", "1.25em"), t.stickToBottom && (t.elements.body[0].scrollTop = t.elements.body[0].scrollHeight), t.elements.input.focus()
                },
                _popUserPanel: function(e) {
                    if (this && this.closest) {
                        const e = this.closest(".chat-line[data-id]");
                        if (!e) return console.warn("no closets chat-line on self: %o", this);
                        const n = e.dataset.id;
                        let o = [];
                        try {
                            o = JSON.parse(e.dataset.badges)
                        } catch (e) {}
                        const a = crel("span", {
                            class: "badges"
                        });
                        o.forEach((e => {
                            switch (e.type) {
                                case "text":
                                    crel(a, crel("span", {
                                        class: "text-badge",
                                        title: e.tooltip || ""
                                    }, e.displayName || ""), document.createTextNode(" "));
                                    break;
                                case "icon":
                                    crel(a, crel("i", {
                                        class: (e.cssIcon || "") + " icon-badge",
                                        title: e.tooltip || ""
                                    }, document.createTextNode(" ")), document.createTextNode(" "))
                            }
                        }));
                        const i = function() {
                            if (this && this.closest) {
                                const e = this.closest(".popup");
                                e && e.remove()
                            }
                        };
                        let r = null;
                        e.dataset.tag && (r = document.createElement("span", {
                            class: "flair faction-tag"
                        }), r.innerHTML = `[${twemoji.parse(e.dataset.tag)}] `);
                        const l = crel("div", {
                                class: "popup panel",
                                "data-popup-for": n
                            }),
                            d = crel("header", {
                                class: "panel-header"
                            }, crel("button", {
                                class: "left panel-closer"
                            }, crel("i", {
                                class: "fas fa-times",
                                onclick: i
                            })), crel("span", r, e.dataset.author, a), crel("div", {
                                class: "right"
                            })),
                            c = crel("div", {
                                class: "pane details-wrapper chat-line"
                            }),
                            p = crel("div", {
                                class: "pane actions-wrapper"
                            }),
                            f = crel("ul", {
                                class: "actions-list"
                            }),
                            h = [{
                                label: "Report",
                                action: "report",
                                class: "dangerous-button"
                            }, {
                                label: "Mention",
                                action: "mention"
                            }, {
                                label: "Reply",
                                action: "reply"
                            }, {
                                label: "Ignore",
                                action: "ignore"
                            }, (!m.snipMode || App.user.hasPermission("user.receivestaffbroadcasts")) && {
                                label: "Profile",
                                action: "profile"
                            }, {
                                label: "Chat (un)ban",
                                action: "chatban",
                                staffaction: !0
                            }, !m.snipMode && {
                                label: "Purge User",
                                action: "purge",
                                staffaction: !0
                            }, {
                                label: "Delete",
                                action: "delete",
                                staffaction: !0
                            }, {
                                label: "Mod Lookup",
                                action: "lookup-mod",
                                staffaction: !0
                            }, {
                                label: "Chat Lookup",
                                action: "lookup-chat",
                                staffaction: !0
                            }];
                        crel(c, crel("p", {
                            class: "popup-timestamp-header text-muted"
                        }, moment.unix(e.dataset.date >> 0).format("MMM Do YYYY, " + (!0 === s.chat.timestamps["24h"].get() ? "HH:mm:ss" : "hh:mm:ss A")))), crel(c, crel("p", {
                            class: "content",
                            style: "margin-top: 3px; margin-left: 3px; text-align: left;"
                        }, e.querySelector(":not(.reply-preview) > span > .content").textContent)), crel(f, h.filter((e => e && (u.isStaff() || !e.staffaction))).map((e => crel("li", crel("button", {
                            type: "button",
                            class: "text-button fullwidth " + (e.class || ""),
                            "data-action": e.action,
                            "data-id": n,
                            onclick: t._handleActionClick
                        }, e.label))))), crel(p, f);
                        const g = crel(l, d, c, p);
                        document.body.appendChild(g), t._positionPopupRelativeToX(g, this)
                    }
                },
                _positionPopupRelativeToX(e, t) {
                    const n = document.body.getBoundingClientRect(),
                        o = t.getBoundingClientRect();
                    let a = e.getBoundingClientRect();
                    o.left < a.width / 2 ? e.style.left = (o.left >> 0) + "px" : e.style.left = (o.left + (o.width / 2 >> 0) - (a.width / 2 >> 0) >> 0) + "px", e.style.top = `${o.top+o.height+2}px`, a = e.getBoundingClientRect(), a.bottom > n.bottom && (e.style.bottom = "2px", e.style.top = null), a.top < n.top && (e.style.top = "2px", e.style.bottom = null), a.right > n.right && (e.style.right = "2px", e.style.left = null), a.left < n.left && (e.style.left = "2px", e.style.right = null)
                },
                _handleActionClick: function(e) {
                    if (!this.dataset) return console.trace("onClick attached to invalid object");
                    const n = t.elements.body.find(`.chat-line[data-id="${this.dataset.id}"]`)[0];
                    if (!n && !this.dataset.target) return console.warn("no chatLine/target? searched for id %o", this.dataset.id);
                    const o = !!n,
                        i = o ? n.querySelector(":not(.reply-preview) > span > .content").textContent : "",
                        r = o ? n.dataset.author : this.dataset.target;
                    switch ($(".popup").remove(), this.dataset.action.toLowerCase().trim()) {
                        case "report": {
                            const e = crel("button", {
                                    class: "text-button dangerous-button",
                                    type: "submit"
                                }, "Report"),
                                t = crel("textarea", {
                                    placeholder: "Enter a reason for your report",
                                    style: "width: 100%; border: 1px solid #999;",
                                    onkeydown: e => e.stopPropagation()
                                }),
                                n = crel("span", crel("span", {
                                    style: "font-weight: bold"
                                }, r)).innerHTML,
                                o = crel("span", crel("span", {
                                    title: i
                                }, i.substr(0, 60) + (i.length > 60 ? "..." : ""))).innerHTML,
                                a = crel("form", {
                                    class: "report chat-report",
                                    "data-chat-id": this.dataset.id
                                }, $("<p>").css("font-size", "1rem !important;").html(`You are reporting a chat message from ${n} with the content:` + o)[0], t, crel("div", {
                                    style: "text-align: right"
                                }, crel("button", {
                                    class: "text-button",
                                    style: "position: initial; margin-right: .25rem",
                                    type: "button",
                                    onclick: () => {
                                        l.closeAll(), a.remove()
                                    }
                                }, "Cancel"), e));
                            a.onsubmit = n => {
                                if (n.preventDefault(), e.disabled = !0, !this.dataset.id) return console.error("!! No id to report? !!", this);
                                $.post("/reportChat", {
                                    cmid: this.dataset.id,
                                    report_message: t.value
                                }, (function() {
                                    l.closeTop(!0), new SLIDEIN.Slidein("Sent report!", "info-circle").show().closeAfter(3e3)
                                })).fail((function() {
                                    new SLIDEIN.Slidein("Error sending report.", "info-circle").show().closeAfter(3e3), e.disabled = !1
                                }))
                            }, l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Report User"), a));
                            break
                        }
                        case "mention":
                            r ? t.elements.input.val(t.elements.input.val() + `@${r} `) : console.warn("no reportingTarget");
                            break;
                        case "reply": {
                            if (!o) return void console.warn("reply called in with false mode");
                            const a = n.querySelector(":not(.reply-preview) > span > .userDisplay");
                            if (!a) return void console.warn("reply couldn't find userDisplay");
                            t._addReplyToChatbox(e, this.dataset.id, a);
                            break
                        }
                        case "ignore":
                            r ? h.addIgnore(r) ? l.showText("User ignored. You can unignore from chat settings.") : l.showText("Failed to ignore user. Either they're already ignored, or an error occurred. If the problem persists, contact a developer.") : console.warn("no reportingTarget");
                            break;
                        case "chatban": {
                            const e = o ? crel("table", {
                                    class: "chatmod-table"
                                }, crel("tr", crel("th", "ID: "), crel("td", this.dataset.id)), crel("tr", crel("th", "Message: "), crel("td", {
                                    title: i
                                }, `${i.substr(0,120)}${i.length>120?"...":""}`)), crel("tr", crel("th", "User: "), crel("td", r))) : crel("table", {
                                    class: "chatmod-table"
                                }, crel("tr", crel("th", "User: "), crel("td", r))),
                                t = [
                                    ["Unban", -3],
                                    ["Permanent", -1],
                                    ["Temporary", -2]
                                ],
                                n = crel("select", {
                                    name: "selBanLength"
                                }, t.map((e => crel("option", {
                                    value: e[1]
                                }, e[0])))),
                                a = crel("div", {
                                    style: "display: block; margin-top: .5rem"
                                }),
                                s = crel("select", {
                                    name: "selCustomLength",
                                    style: "display: inline-block; width: auto;"
                                }, crel("option", {
                                    value: "1"
                                }, "Seconds"), crel("option", {
                                    value: "60"
                                }, "Minutes"), crel("option", {
                                    value: "3600"
                                }, "Hours"), crel("option", {
                                    value: "86400"
                                }, "Days")),
                                d = crel("input", {
                                    type: "number",
                                    name: "txtCustomLength",
                                    style: "display: inline-block; width: auto;",
                                    min: "1",
                                    step: "1",
                                    value: "10"
                                }),
                                c = crel("select", crel("option", "Rule 3: Spam"), crel("option", "Rule 1: Chat civility"), crel("option", "Rule 2: Hate Speech"), crel("option", "Rule 5: NSFW"), crel("option", "Custom")),
                                u = crel("div", {
                                    style: "margin-top: .5rem;"
                                }),
                                p = crel("textarea", {
                                    type: "text",
                                    name: "txtAdditionalReasonInfo"
                                }),
                                f = crel("div", {
                                    style: "display: block;"
                                }),
                                h = crel("input", {
                                    type: "radio",
                                    name: "rbPurge",
                                    checked: String(!m.snipMode)
                                }),
                                g = crel("input", {
                                    type: "radio",
                                    name: "rbPurge"
                                }),
                                b = crel("div", {
                                    style: "display: block;"
                                }),
                                y = crel("input", {
                                    type: "checkbox",
                                    name: "cbSilentPurge",
                                    style: "display: inline; width: initial; margin-right: 5px;"
                                }),
                                w = crel("div", {
                                    style: "display: block;"
                                }),
                                v = crel("button", {
                                    class: "text-button",
                                    type: "button",
                                    onclick: () => {
                                        _.remove(), l.closeAll()
                                    }
                                }, "Cancel"),
                                x = crel("button", {
                                    class: "text-button dangerous-button",
                                    type: "submit"
                                }, "Ban"),
                                _ = crel("form", {
                                    class: "chatmod-container",
                                    "data-chat-id": this.dataset.id
                                }, crel("h5", o ? "Banning:" : "Message:"), e, crel("h5", "Ban Length"), n, crel(a, d, s), crel(w, crel("h5", "Reason"), c, crel(u, p)), crel(f, crel("h5", "Purge Messages"), m.snipMode ? crel("span", {
                                    class: "text-orange extra-warning"
                                }, crel("i", {
                                    class: "fas fa-exclamation-triangle"
                                }), " Purging all messages is disabled during snip mode") : [crel("label", {
                                    style: "display: inline;"
                                }, h, "Yes"), crel("label", {
                                    style: "display: inline;"
                                }, g, "No")]), m.snipMode ? "" : crel(b, crel("label", {
                                    style: "display: inline;"
                                }, y, "Silent (no purge message)")), crel("div", {
                                    class: "buttons"
                                }, v, x));
                            n.value = t[2][1], n.addEventListener("change", (function() {
                                const e = "-2" === this.value;
                                a.style.display = e ? "block" : "none", d.required = e;
                                const t = "-3" === n.value;
                                w.style.display = t ? "none" : "block", f.style.display = t ? "none" : "block", b.style.display = t ? "none" : "block", x.innerHTML = t ? "Unban" : "Ban"
                            })), s.selectedIndex = 1;
                            const k = () => {
                                const e = "Custom" === c.value;
                                p.placeholder = e ? "Custom reason" : "Additional information (if applicable)", p.required = e
                            };
                            k(), c.addEventListener("change", k), p.onkeydown = e => e.stopPropagation(), d.onkeydown = e => e.stopPropagation(), _.onsubmit = e => {
                                e.preventDefault();
                                const t = {
                                    type: "temp",
                                    reason: "none provided",
                                    removalAmount: m.snipMode ? 0 : h.checked ? -1 : 0,
                                    announce: !y.checked,
                                    banLength: 0
                                };
                                "Custom" === c.value ? t.reason = p.value : (t.reason = c.value, p.value && (t.reason += `. Additional information: ${p.value}`)), "-3" === n.value ? (t.type = "unban", t.reason = "(web shell unban)", t.banLength = -1) : "-2" === n.value ? t.banLength = (d.value >> 0) * (s.value >> 0) : "-1" === n.value ? (t.type = "perma", t.banLength = 0) : t.banLength = n.value >> 0, o ? t.cmid = this.dataset.id : t.who = r, $.post("/admin/chatban", t, (() => {
                                    l.showText("Chatban initiated")
                                })).fail((() => {
                                    l.showText("Error occurred while chatbanning")
                                }))
                            }, l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Chatban"), crel("div", {
                                style: "padding-left: 1em"
                            }, _)));
                            break
                        }
                        case "delete": {
                            const t = crel("input", {
                                    type: "text",
                                    name: "txtReason",
                                    style: "display: inline-block; width: 100%; font-family: sans-serif; font-size: 1rem;"
                                }),
                                n = crel("input", {
                                    type: "checkbox",
                                    name: "cbSilentPurge",
                                    id: "cbSilentPurge",
                                    style: "display: inline-block; width: 100%;"
                                }),
                                o = () => $.post("/admin/delete", {
                                    cmid: this.dataset.id,
                                    reason: t.value,
                                    silent: n.checked
                                }, (() => {
                                    l.closeAll()
                                })).fail((() => {
                                    l.showText("Failed to delete")
                                }));
                            if (!0 === e.shiftKey) return o();
                            const a = crel("button", {
                                class: "text-button dangerous-button"
                            }, "Delete");
                            a.onclick = () => o();
                            const s = crel("div", {
                                class: "chatmod-container"
                            }, crel("table", crel("tr", crel("th", "ID: "), crel("td", this.dataset.id)), crel("tr", crel("th", "User: "), crel("td", r)), crel("tr", crel("th", "Message: "), crel("td", {
                                title: i
                            }, `${i.substr(0,120)}${i.length>120?"...":""}`)), crel("tr", crel("th", "Reason: "), crel("td", t)), crel("tr", crel("th", n), crel("td", crel("label", {
                                for: "cbSilentPurge"
                            }, "Silent (no purge message)")))), crel("div", {
                                class: "buttons"
                            }, crel("button", {
                                class: "text-button",
                                type: "button",
                                onclick: () => {
                                    s.remove(), l.closeAll()
                                }
                            }, "Cancel"), a));
                            l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Delete Message"), s));
                            break
                        }
                        case "purge": {
                            const e = crel("input", {
                                    type: "text",
                                    onkeydown: e => e.stopPropagation()
                                }),
                                t = crel("input", {
                                    type: "checkbox",
                                    name: "cbSilentPurge",
                                    style: "display: inline; width: initial; margin-right: 5px;"
                                }),
                                n = crel("button", {
                                    class: "text-button dangerous-button",
                                    type: "submit"
                                }, "Purge"),
                                a = o ? crel("table", crel("tr", crel("th", "ID: "), crel("td", this.dataset.id)), crel("tr", crel("th", "Message: "), crel("td", {
                                    title: i
                                }, `${i.substr(0,120)}${i.length>120?"...":""}`))) : crel("table", {
                                    class: "chatmod-table"
                                }, crel("tr", crel("th", "User: "), crel("td", r))),
                                s = crel("form", {
                                    class: "chatmod-container"
                                }, crel("h5", "Selected Message"), a, crel("div", crel("h5", "Purge Reason"), e), crel("label", {
                                    style: "display: inline;"
                                }, t, "Silent (no purge message)"), crel("div", {
                                    class: "buttons"
                                }, crel("button", {
                                    class: "text-button",
                                    type: "button",
                                    onclick: () => {
                                        s.remove(), l.closeAll()
                                    }
                                }, "Cancel"), n));
                            s.onsubmit = n => {
                                n.preventDefault(), $.post("/admin/chatPurge", {
                                    who: r,
                                    reason: e.value,
                                    silent: t.checked
                                }, (function() {
                                    s.remove(), l.showText("User purged")
                                })).fail((function() {
                                    l.showText("Error sending purge.")
                                }))
                            }, l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Purge User"), crel("div", {
                                style: "padding-left: 1em"
                            }, s)));
                            break
                        }
                        case "lookup-mod":
                            if (u.admin && u.admin.checkUser && u.admin.checkUser.check) {
                                const e = m.snipMode ? "cmid" : "username",
                                    t = m.snipMode ? this.dataset.id : r;
                                u.admin.checkUser.check(t, e)
                            }
                            break;
                        case "lookup-chat":
                            a.send({
                                type: "ChatLookup",
                                arg: m.snipMode ? this.dataset.id : r,
                                mode: m.snipMode ? "cmid" : "username"
                            });
                            break;
                        case "request-rename": {
                            const e = crel("input", {
                                    type: "radio",
                                    name: "rbState"
                                }),
                                t = crel("input", {
                                    type: "radio",
                                    name: "rbState"
                                }),
                                n = crel("label", {
                                    style: "display: inline-block"
                                }, e, " On"),
                                o = crel("label", {
                                    style: "display: inline-block"
                                }, t, " Off"),
                                a = crel("button", {
                                    class: "text-button",
                                    type: "submit"
                                }, "Set"),
                                i = crel("p", {
                                    style: "display: none; color: #f00; font-weight: bold; font-size: .9rem",
                                    class: "rename-error"
                                }, "");
                            t.checked = !0;
                            const s = crel("form", {
                                class: "chatmod-container"
                            }, crel("h3", "Toggle Rename Request"), crel("p", "Select one of the options below to set the current rename request state."), crel("div", n, o), i, crel("div", {
                                class: "buttons"
                            }, crel("button", {
                                class: "text-button",
                                type: "button",
                                onclick: () => {
                                    s.remove(), l.closeAll()
                                }
                            }, "Cancel"), a));
                            s.onsubmit = t => {
                                t.preventDefault(), $.post("/admin/flagNameChange", {
                                    user: r,
                                    flagState: !0 === e.checked
                                }, (function() {
                                    s.remove(), l.showText("Rename request updated")
                                })).fail((function(e) {
                                    let t = "An unknown error occurred. Please contact a developer";
                                    if (e.responseJSON) t = e.responseJSON.details || t;
                                    else if (e.responseText) try {
                                        t = JSON.parse(e.responseText).details
                                    } catch (e) {}
                                    i.style.display = null, i.innerHTML = t
                                }))
                            }, l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Request Rename"), s));
                            break
                        }
                        case "force-rename": {
                            const e = crel("input", {
                                    type: "text",
                                    required: "true",
                                    onkeydown: e => e.stopPropagation()
                                }),
                                t = crel("label", "New Name: ", e),
                                n = crel("button", {
                                    class: "text-button",
                                    type: "submit"
                                }, "Set"),
                                o = crel("p", {
                                    style: "display: none; color: #f00; font-weight: bold; font-size: .9rem",
                                    class: "rename-error"
                                }, ""),
                                a = crel("form", {
                                    class: "chatmod-container"
                                }, crel("p", "Enter the new name for the user below. Please note that if you're trying to change the caps, you'll have to rename to something else first."), t, o, crel("div", {
                                    class: "buttons"
                                }, crel("button", {
                                    class: "text-button",
                                    type: "button",
                                    onclick: () => {
                                        l.closeAll()
                                    }
                                }, "Cancel"), n));
                            a.onsubmit = t => {
                                t.preventDefault(), $.post("/admin/forceNameChange", {
                                    user: r,
                                    newName: e.value.trim()
                                }, (function() {
                                    l.showText("User renamed")
                                })).fail((function(e) {
                                    let t = "An unknown error occurred. Please contact a developer";
                                    if (e.responseJSON) t = e.responseJSON.details || t;
                                    else if (e.responseText) try {
                                        t = JSON.parse(e.responseText).details
                                    } catch (e) {}
                                    o.style.display = null, o.innerHTML = t
                                }))
                            }, l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Force Rename"), a));
                            break
                        }
                        case "profile":
                            window.open(`/profile/${r}`, "_blank") || l.show(l.buildDom(crel("h2", {
                                class: "modal-title"
                            }, "Open Failed"), crel("div", crel("h3", "Failed to automatically open in a new tab"), crel("a", {
                                href: `/profile/${r}`,
                                target: "_blank"
                            }, "Click here to open in a new tab instead"))))
                    }
                },
                _doScroll: e => {
                    try {
                        e.scrollIntoView({
                            block: "nearest",
                            inline: "nearest"
                        })
                    } catch (t) {
                        e.scrollIntoView(!1)
                    }
                },
                _canChat: () => !!u.isLoggedIn() && (t.canvasBanRespected ? !t.chatban.banned && !t.canvasBanned : !t.chatban.banned),
                updateCanvasBanState(e) {
                    t.canvasBanned = e;
                    const n = t._canChat();
                    t._handleChatbanVisualState(n), n || 0 === t.elements.rate_limit_counter.text().trim().length && t.elements.rate_limit_counter.text("You cannot use chat while canvas banned.")
                }
            };
            return {
                init: t.init,
                webinit: t.webinit,
                _handleActionClick: t._handleActionClick,
                clearPings: t.clearPings,
                setCharLimit: t.setCharLimit,
                processMessage: t.processMessage,
                saveIgnores: t.saveIgnores,
                reloadIgnores: t.reloadIgnores,
                addIgnore: t.addIgnore,
                removeIgnore: t.removeIgnore,
                getIgnores: t.getIgnores,
                typeahead: t.typeahead,
                updateSelectedNameColor: t.updateSelectedNameColor,
                updateCanvasBanState: t.updateCanvasBanState,
                registerHook: t.registerHook,
                replaceHook: t.replaceHook,
                unregisterHook: t.unregisterHook,
                runLookup: t.runLookup,
                get markdownProcessor() {
                    return t.markdownProcessor
                },
                get canvasBanRespected() {
                    return t.canvasBanRespected
                }
            }
        }();
        t.exports.chat = h
    }, {
        "./board": 5,
        "./helpers": 10,
        "./modal": 12,
        "./panels": 16,
        "./place": 17,
        "./serviceworkers": 19,
        "./settings": 20,
        "./socket": 21,
        "./storage": 22,
        "./typeahead": 25,
        "./uiHelper": 26,
        "./user": 27
    }],
    7: [function(e, t, n) {
        const {
            board: o
        } = e("./board"), {
            settings: a
        } = e("./settings"), {
            webkitBased: i
        } = e("./helpers").flags;
        t.exports.chromeOffsetWorkaround = function() {
            const e = {
                elements: {
                    boardContainer: o.getContainer(),
                    setting: $("#chrome-canvas-offset-setting")
                },
                init: () => {
                    if (!i) return a.fix.chrome.offset.enable.controls.remove(e.elements.setting.find("input")), void e.elements.setting.parent().remove();
                    a.fix.chrome.offset.enable.listen((t => {
                        t ? e.enable() : e.disable()
                    }))
                },
                enable: () => {
                    window.addEventListener("resize", e.updateContainer), e.updateContainer()
                },
                updateContainer: () => {
                    const t = (window.innerWidth + o.getWidth()) % 2,
                        n = (window.innerHeight + o.getHeight()) % 2;
                    e.elements.boardContainer.css("width", window.innerWidth - t + "px"), e.elements.boardContainer.css("height", window.innerHeight - n + "px")
                },
                disable: () => {
                    window.removeEventListener("resize", e.updateContainer), e.elements.boardContainer.css("width", ""), e.elements.boardContainer.css("height", "")
                }
            };
            return {
                init: e.init,
                update: () => {
                    a.fix.chrome.offset.enable.get() && e.updateContainer()
                }
            }
        }()
    }, {
        "./board": 5,
        "./helpers": 10,
        "./settings": 20
    }],
    8: [function(e, t, n) {
        let o, a;
        t.exports.coords = function() {
            const t = {
                elements: {
                    coordsWrapper: $("#coords-info"),
                    coords: $("#coords-info .coords"),
                    lockIcon: $("#canvas-lock-icon")
                },
                mouseCoords: null,
                init: function() {
                    a = e("./board").board, o = e("./query").query, t.elements.coordsWrapper.hide();
                    const n = a.getRenderBoard()[0];

                    function i(e) {
                        const n = a.fromScreen(e.clientX, e.clientY);
                        t.mouseCoords = n, t.elements.coords.text("(" + n.x + ", " + n.y + ")"), t.elements.coordsWrapper.is(":visible") || t.elements.coordsWrapper.fadeIn(200)
                    }

                    function r(e) {
                        const n = a.fromScreen(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                        t.mouseCoords = n, t.elements.coords.text("(" + n.x + ", " + n.y + ")"), t.elements.coordsWrapper.is(":visible") || t.elements.coordsWrapper.fadeIn(200)
                    }
                    n.addEventListener("pointermove", i, {
                        passive: !1
                    }), n.addEventListener("mousemove", i, {
                        passive: !1
                    }), n.addEventListener("touchstart", r, {
                        passive: !1
                    }), n.addEventListener("touchmove", r, {
                        passive: !1
                    }), $(window).keydown((e => {
                        ["INPUT", "TEXTAREA"].includes(e.target.nodeName) || e.ctrlKey || e.metaKey || "c" !== e.key && "C" !== e.key && 67 !== e.keyCode || t.copyCoords()
                    }))
                },
                copyCoords: function(e = !1) {
                    if (!navigator.clipboard || !t.mouseCoords) return;
                    const n = e ? o.get("x") : t.mouseCoords.x,
                        a = e ? o.get("y") : t.mouseCoords.y,
                        i = e ? o.get("scale") : 20;
                    navigator.clipboard.writeText(t.getLinkToCoords(n, a, i)), t.elements.coordsWrapper.addClass("copyPulse"), setTimeout((() => {
                        t.elements.coordsWrapper.removeClass("copyPulse")
                    }), 200)
                },
                getLinkToCoords: (e = 0, t = 0, n = 20) => {
                    const a = ["template", "tw", "ox", "oy", "title", "convert"].filter(o.has).map((e => `${e}=${encodeURIComponent(o.get(e))}`)).join("&");
                    return `${location.origin}/#x=${Math.floor(e)}&y=${Math.floor(t)}&scale=${n}&${a}`
                }
            };
            return {
                init: t.init,
                copyCoords: t.copyCoords,
                getLinkToCoords: t.getLinkToCoords,
                lockIcon: t.elements.lockIcon
            }
        }()
    }, {
        "./board": 5,
        "./query": 18
    }],
    9: [function(e, t, n) {
        const {
            settings: o
        } = e("./settings");
        let a;
        t.exports.grid = function() {
            const t = {
                elements: {
                    grid: $("#grid")
                },
                init: function() {
                    a = e("./board").board, o.board.grid.enable.listen((function(e) {
                        t.elements.grid.toggleClass("transparent", !e)
                    }));
                    let n = !1;
                    const i = e => "g" === e.key || "G" === e.key || 71 === e.which;
                    $(window).keydown((function(e) {
                        if (!["INPUT", "TEXTAREA"].includes(e.target.nodeName) && i(e)) {
                            if (n) return;
                            n = !0, o.board.grid.enable.toggle()
                        }
                    })), $(window).keyup((function(e) {
                        i(e) && (n = !1)
                    }))
                },
                update: function() {
                    const e = a.fromScreen(0, 0, !1),
                        n = a.getScale(),
                        o = Math.max(1, Math.floor(n)),
                        i = n / o;
                    t.elements.grid.css({
                        backgroundSize: o + "px " + o + "px",
                        transform: "translate(" + Math.floor(-e.x % 1 * o) + "px," + Math.floor(-e.y % 1 * o) + "px) scale(" + i + ")",
                        opacity: (n - 2) / 6
                    })
                }
            };
            return {
                init: t.init,
                update: t.update
            }
        }()
    }, {
        "./board": 5,
        "./settings": 20
    }],
    10: [function(e, t, n) {
        t.exports.binaryAjax = async function(e) {
            const t = await fetch(e);
            return new Uint8Array(await t.arrayBuffer())
        }, t.exports.createImageData = function(e, t) {
            try {
                return new ImageData(e, t)
            } catch (n) {
                const o = document.createElement("canvas");
                return o.width = e, o.height = t, o.getContext("2d").getImageData(0, 0, e, t)
            }
        }, t.exports.intToHex = e => `#${("000000"+(e>>>0).toString(16)).slice(-6)}`, t.exports.hexToRGB = function(e) {
            const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
            return t ? {
                r: parseInt(t[1], 16),
                g: parseInt(t[2], 16),
                b: parseInt(t[3], 16)
            } : null
        }, t.exports.analytics = function() {
            window.ga && window.ga.apply(this, arguments)
        };
        class o extends Promise {
            constructor(e) {
                super((e => {
                    e()
                })), this.execute = e, this.promise = null
            }
            static wrap(e) {
                return new o((t => {
                    t(e())
                }))
            }
            then(e, t) {
                this.promise = this.promise || new Promise(this.execute), this.promise.then(e, t)
            } catch (e) {
                this.promise = this.promise || new Promise(this.execute), this.promise.catch(e)
            } finally(e) {
                this.promise = this.promise || new Promise(this.execute), this.promise.finally(e)
            }
        }
        t.exports.LazyPromise = o;
        const a = navigator.userAgent;
        let i = function() {
                const e = function(e, t, n, o) {
                    const a = document.createElement("div");
                    return !(!t || (a.style.imageRendering = e + "crisp-edges", a.style.imageRendering !== e + "crisp-edges")) || (!(!n || (a.style.imageRendering = e + "pixelated", a.style.imageRendering !== e + "pixelated")) || !(!o || (a.style.imageRendering = e + "optimize-contrast", a.style.imageRendering !== e + "optimize-contrast")))
                };
                return e("", !0, !0, !1) || e("-o-", !0, !1, !1) || e("-moz-", !0, !1, !1) || e("-webkit-", !0, !1, !0)
            }(),
            r = !1;
        const s = a.match(/AppleWebKit/i),
            l = a.match(/(iPod|iPhone|iPad)/i) && s,
            d = a.match(/safari/i) && !a.match(/chrome/i),
            c = a.indexOf("Edge") > -1,
            u = window.innerWidth < 768 && a.includes("Mobile");
        if (l) {
            i = !1, (parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || !1) >= 11 && (r = !0)
        } else d && (i = !1, r = !0);
        c && (i = !1), t.exports.flags = {
            haveZoomRendering: r,
            webkitBased: s,
            possiblyMobile: u,
            haveImageRendering: i
        }
    }, {}],
    11: [function(e, t, n) {
        const {
            modal: o
        } = e("./modal"), {
            settings: a
        } = e("./settings"), {
            user: i
        } = e("./user"), {
            template: r
        } = e("./template"), {
            chat: s
        } = e("./chat"), {
            coords: l
        } = e("./coords");
        let d;
        t.exports.lookup = function() {
            const t = {
                elements: {
                    lookup: $("#lookup"),
                    prompt: $("#prompt")
                },
                handle: null,
                report: function(e, n, a) {
                    const i = crel("button", {
                        class: "text-button dangerous-button"
                    }, "Report");
                    i.addEventListener("click", (function() {
                        this.disabled = !0, this.textContent = "Sending...";
                        const i = this.closest(".modal").querySelector("select").value,
                            r = this.closest(".modal").querySelector("textarea").value.trim();
                        let s = i;
                        if ("other" === i) {
                            if ("" === r) return void o.showText("You must specify the details.");
                            s = r
                        } else "" !== r && (s += `; additional information: ${r}`);
                        $.post("/report", {
                            id: e,
                            x: n,
                            y: a,
                            message: s
                        }, (function() {
                            new SLIDEIN.Slidein("Sent report!", "info-circle").show().closeAfter(3e3), o.closeTop(!0), t.elements.lookup.hide()
                        })).fail((function() {
                            new SLIDEIN.Slidein("Error sending report.", "info-circle").show().closeAfter(3e3)
                        }))
                    })), o.show(o.buildDom(crel("h2", {
                        class: "modal-title"
                    }, "Report Pixel"), crel("div", crel("select", {
                        style: "width: 100%; margin-bottom: 1em;"
                    }, crel("option", "Rule #1: Hateful/derogatory speech or symbols"), crel("option", "Rule #2: Nudity, genitalia, or non-PG-13 content"), crel("option", "Rule #3: Multi-account"), crel("option", "Rule #4: Botting"), crel("option", {
                        value: "other"
                    }, "Other (specify below)")), crel("textarea", {
                        placeholder: "Additional information (if applicable)",
                        style: "width: 100%; height: 5em",
                        onkeydown: e => e.stopPropagation()
                    }), crel("div", {
                        class: "buttons"
                    }, crel("button", {
                        class: "text-button",
                        onclick: () => o.closeAll()
                    }, "Cancel"), i))))
                },
                hooks: [],
                registerHook: function(...e) {
                    return t.hooks.push(...$.map(e, (function(e) {
                        return {
                            id: e.id || "hook",
                            name: e.name || "Hook",
                            sensitive: e.sensitive || !1,
                            backgroundCompatible: e.backgroundCompatible || !1,
                            get: e.get || function() {},
                            css: e.css || {}
                        }
                    })))
                },
                replaceHook: function(e, n) {
                    delete n.id;
                    for (const o in t.hooks) {
                        const a = t.hooks[o];
                        if (a.id === e) return void(t.hooks[o] = Object.assign(a, n))
                    }
                },
                unregisterHook: function(e) {
                    t.hooks = $.grep(t.hooks, (function(t) {
                        return t.id !== e
                    }))
                },
                create: function(e) {
                    const n = [];
                    t._makeShell(e).find(".content").first().append((() => e.bg ? $("<p>").text("This pixel is background (was not placed by a user).") : "")).append((() => {
                        const o = e.bg ? t.hooks.filter((e => e.backgroundCompatible)) : t.hooks;
                        return $.map(o, (t => {
                            const o = t.get(e);
                            if (null == o) return null;
                            const i = "object" == typeof o ? o instanceof Node ? $(o) : o : $("<span>").text(o),
                                r = $('<div data-sensitive="' + t.sensitive + '">').append($("<b>").text(t.name + ": "), i.css(t.css)).attr("id", "lookuphook_" + t.id);
                            return t.sensitive && (n.push(r), a.lookup.filter.sensitive.enable.get() && r.css("display", "none")), r
                        }))
                    })).append((() => {
                        if (e.bg || n.length < 1) return "";
                        const t = $("<label>"),
                            o = $('<input type="checkbox">').css("margin-top", "10px"),
                            i = $('<span class="label-text">').text("Hide sensitive information");
                        return t.prepend(o, i), a.lookup.filter.sensitive.enable.controls.add(o), t
                    })), t.elements.lookup.fadeIn(200)
                },
                _makeShell: function(e) {
                    return t.elements.lookup.empty().append($("<div>").addClass("content"), !e.bg && i.isLoggedIn() ? $("<button>").css("float", "left").addClass("dangerous-button text-button").text("Report").click((function() {
                        t.report(e.id, e.x, e.y)
                    })) : "", $("<button>").css("float", "right").addClass("text-button").text("Close").click((function() {
                        t.elements.lookup.fadeOut(200)
                    })), r.getOptions().use ? $("<button>").css("float", "right").addClass("text-button").text("Move Template Here").click((function() {
                        r.queueUpdate({
                            ox: e.x,
                            oy: e.y
                        })
                    })) : "")
                },
                runLookup(e, n) {
                    const o = d.fromScreen(e, n);
                    $.get("/lookup", o, (function(e) {
                        (e = e || {
                            x: o.x,
                            y: o.y,
                            bg: !0
                        }) && e.username && s.typeahead.helper && s.typeahead.helper.getDatabase("users").addEntry(e.username, e.username), t.handle ? t.handle(e) : t.create(e)
                    })).fail((function() {
                        t._makeShell({
                            x: o.x,
                            y: o.y
                        }).find(".content").first().append($("<p>").css("color", "#c00").text("An error occurred, either you aren't logged in or you may be attempting to look up users too fast. Please try again in 60 seconds")), t.elements.lookup.fadeIn(200)
                    }))
                },
                webinit: function() {
                    d = e("./board").board, t.registerHook({
                        id: "coords",
                        name: "Coords",
                        get: e => $("<a>").text("(" + e.x + ", " + e.y + ")").attr("href", l.getLinkToCoords(e.x, e.y)),
                        backgroundCompatible: !0
                    }, {
                        id: "username",
                        name: "Username",
                        sensitive: d.snipMode,
                        get: e => e.username ? d.snipMode ? e.username : crel("a", {
                            href: `/profile/${e.username}`,
                            target: "_blank",
                            title: "View Profile"
                        }, e.username) : null
                    }, {
                        id: "faction",
                        name: "Faction",
                        sensitive: d.snipMode,
                        get: e => e.faction || null
                    }, {
                        id: "origin",
                        name: "Origin",
                        get: e => {
                            switch (e.origin) {
                                case "nuke":
                                    return "Part of a nuke";
                                case "mod":
                                    return "Placed by a staff member using placement overrides";
                                default:
                                    return null
                            }
                        }
                    }, {
                        id: "time",
                        name: "Time",
                        get: e => {
                            const t = ((new Date).getTime() - e.time) / 1e3,
                                n = new Date(e.time).toLocaleString(),
                                o = $("<span>");
                            if (o.attr("title", n), t > 86400) return o.text(n);
                            if (t < 5) return o.text("just now");
                            {
                                const e = Math.floor(t % 60),
                                    n = e < 10 ? "0" + e : e,
                                    a = Math.floor(t / 60) % 60,
                                    i = a < 10 ? "0" + a : a,
                                    r = Math.floor(t / 3600),
                                    s = r < 10 ? "0" + r : r;
                                return o.text(`${s}:${i}:${n} ago`)
                            }
                        }
                    }, {
                        id: "pixels",
                        name: "Pixels",
                        sensitive: d.snipMode,
                        get: e => e.pixelCount
                    }, {
                        id: "pixels_alltime",
                        name: "Alltime Pixels",
                        sensitive: d.snipMode,
                        get: e => e.pixelCountAlltime
                    }, {
                        id: "discord_name",
                        name: "Discord",
                        sensitive: d.snipMode,
                        get: e => e.discordName
                    }), a.lookup.filter.sensitive.enable.listen((function(e) {
                        $("[data-sensitive=true]").css("display", e ? "none" : "")
                    })), t.elements.lookup.hide(), t.elements.prompt.hide(), d.getRenderBoard().on("click", (function(e) {
                        e.shiftKey && (e.preventDefault(), t.runLookup(e.clientX, e.clientY))
                    }))
                },
                registerHandle: function(e) {
                    t.handle = e
                },
                clearHandle: function() {
                    t.handle = null
                }
            };
            return {
                webinit: t.webinit,
                registerHandle: t.registerHandle,
                registerHook: t.registerHook,
                replaceHook: t.replaceHook,
                unregisterHook: t.unregisterHook,
                runLookup: t.runLookup,
                clearHandle: t.clearHandle
            }
        }()
    }, {
        "./board": 5,
        "./chat": 6,
        "./coords": 8,
        "./modal": 12,
        "./settings": 20,
        "./template": 23,
        "./user": 27
    }],
    12: [function(e, t, n) {
        const o = {
            showText: function(e, t) {
                return t = Object.assign({}, {
                    title: "Pxls",
                    modalOpts: {}
                }, t), o.show(o.buildDom(crel("h2", {
                    class: "modal-title"
                }, t.title || "Pxls"), crel("p", {
                    style: "margin: 0;"
                }, e)), t.modalOpts)
            },
            show: function(e, t) {
                if (!(e instanceof HTMLElement)) throw new Error("Invalid modal object supplied. Expected an HTMLElement");
                t = Object.assign({}, $.modal.defaults || {}, {
                    closeExisting: !0,
                    escapeClose: !0,
                    clickClose: !0,
                    showClose: !1,
                    closeText: '<i class="fas fa-times"></i>'
                }, {
                    removeOnClose: !0
                }, t), document.body.contains(e) || document.body.appendChild(e);
                const n = $(e).modal(t);
                return !0 === t.removeOnClose && n.on($.modal.AFTER_CLOSE, (function() {
                    $(this).remove()
                })), n
            },
            buildCloser: function() {
                const e = crel("button", {
                    class: "panel-closer"
                }, crel("i", {
                    class: "fas fa-times"
                }));
                return e.addEventListener("click", (() => o.closeTop())), e
            },
            buildDom: function(e, t, n) {
                return crel("div", {
                    class: "modal panel",
                    tabindex: "-1",
                    role: "dialog"
                }, crel("div", {
                    class: "modal-wrapper",
                    role: "document"
                }, null == e ? null : crel("header", {
                    class: "modal-header panel-header"
                }, crel("div", {
                    class: "left"
                }), crel("div", {
                    class: "mid"
                }, e), crel("div", {
                    class: "right"
                }, this.buildCloser())), null == t ? null : crel("div", {
                    class: "modal-body panel-body"
                }, t), null == n ? null : crel("footer", {
                    class: "modal-footer panel-footer"
                }, n)))
            },
            closeAll: function(e = !0) {
                for (; $.modal.isActive();) $.modal.close();
                e && Array.from(document.querySelectorAll(".modal")).forEach((e => e.remove()))
            },
            closeTop: function(e = !0) {
                const t = $.modal.close();
                e && t && t[0] && t[0].remove()
            }
        };
        t.exports.modal = o
    }, {}],
    13: [function(e, t, n) {
        const {
            settings: o
        } = e("./settings"), {
            uiHelper: a
        } = e("./uiHelper"), {
            template: i
        } = e("./template");
        t.exports.nativeNotifications = function() {
            const e = {
                elements: {},
                init: () => {
                    o.place.notification.enable.listen((function(t) {
                        t && e.request()
                    }))
                },
                request: () => {
                    try {
                        Notification.requestPermission()
                    } catch (e) {
                        console.warn("Notifications not available")
                    }
                },
                show: e => {
                    let t = a.initTitle;
                    const n = i.getOptions();
                    n.use && n.title && (t = `${n.title} - ${t}`);
                    try {
                        const n = new Notification(t, {
                            body: e,
                            icon: "favicon.ico"
                        });
                        return n.onclick = () => {
                            parent.focus(), window.focus(), n.close()
                        }, n
                    } catch (e) {
                        console.warn("Notifications not available")
                    }
                    return null
                },
                maybeShow: t => {
                    if (o.place.notification.enable.get() && a.tabHasFocus() && "granted" === Notification.permission) return e.show(t)
                }
            };
            return {
                init: e.init,
                maybeShow: e.maybeShow
            }
        }()
    }, {
        "./settings": 20,
        "./template": 23,
        "./uiHelper": 26
    }],
    14: [function(e, t, n) {
        const {
            socket: o
        } = e("./socket"), {
            ls: a
        } = e("./storage"), {
            chat: i
        } = e("./chat");
        t.exports.notifications = function() {
            const e = {
                elems: {
                    body: document.querySelector('.panel[data-panel="notifications"] .panel-body'),
                    bell: document.getElementById("notifications-icon"),
                    pingCounter: document.getElementById("notifications-ping-counter")
                },
                init() {
                    $.get("/notifications", (function(t) {
                        Array.isArray(t) && t.length && (t.forEach((t => e._handleNotif(t))), e._checkLatest(t[0].id))
                    })).fail((function() {
                        console.error("Failed to get initial notifications from server")
                    })), o.on("notification", (t => {
                        const n = !(!t || !t.notification) && t.notification;
                        n && (e._handleNotif(n, !0), e._checkLatest(n.id))
                    })), $(window).on("pxls:panel:opened", ((t, n) => {
                        "notifications" === n && e.elems.body && e.elems.body.firstChild && (e.elems.bell.closest(".panel-trigger[data-panel]").classList.remove("has-ping"), e.elems.bell.classList.remove("has-notification"), a.set("notifications.lastSeen", e.elems.body.firstChild.dataset.notificationId >> 0))
                    }))
                },
                _checkLatest(t) {
                    a.get("notifications.lastSeen") >= t || (e.elems.body.closest(".panel[data-panel]").classList.contains("open") ? a.set("notifications.lastSeen", t) : (e.elems.bell.closest(".panel-trigger[data-panel]").classList.add("has-ping"), e.elems.bell.classList.add("has-notification")))
                },
                _handleNotif(t, n = !1) {
                    !1 !== t && (n && e.elems.body.firstChild ? e.elems.body.insertBefore(e.makeDomForNotification(t), e.elems.body.firstChild) : crel(e.elems.body, e.makeDomForNotification(t)))
                },
                makeDomForNotification(e) {
                    const t = e.expiry ? moment.unix(e.expiry).format("MMM DD YYYY") : null;
                    return crel("article", {
                        class: "notification",
                        "data-notification-id": e.id
                    }, crel("header", {
                        class: "notification-title"
                    }, crel("h2", e.title)), crel("div", {
                        class: "notification-body"
                    }, i.processMessage(e.content)), crel("footer", {
                        class: "notification-footer"
                    }, e.who ? document.createTextNode(`Posted by ${e.who}`) : null, 0 !== e.expiry ? crel("span", {
                        class: "notification-expiry float-left"
                    }, crel("i", {
                        class: "far fa-clock fa-is-left"
                    }), crel("span", {
                        title: moment.unix(e.expiry).format("MMMM DD, YYYY, hh:mm:ss A")
                    }, `Expires ${t}`)) : null))
                }
            };
            return {
                init: e.init
            }
        }()
    }, {
        "./chat": 6,
        "./socket": 21,
        "./storage": 22
    }],
    15: [function(e, t, n) {
        const {
            uiHelper: o
        } = e("./uiHelper"), {
            socket: a
        } = e("./socket"), {
            settings: i
        } = e("./settings"), {
            createImageData: r,
            binaryAjax: s,
            LazyPromise: l
        } = e("./helpers");
        t.exports.overlays = function() {
            const e = {
                overlays: {},
                add: function(t, n, a) {
                    if (t in e.overlays) throw new Error(`Overlay '${t}' already exists.`);
                    const i = function(e, t, n = (() => {})) {
                        const a = {
                            name: e,
                            elements: {
                                overlay: crel("canvas", {
                                    id: e,
                                    class: "pixelate noselect overlay transparent"
                                })
                            },
                            ctx: null,
                            width: null,
                            height: null,
                            isShown: !1,
                            previouslyLazyInited: !1,
                            lazyInitStarted: !1,
                            lazyInitDone: !1,
                            lazyInit: async function() {
                                if (a.lazyInitStarted) return;
                                a.lazyInitStarted = !0;
                                const e = await t();
                                $(a.elements.overlay).attr({
                                    width: a.width = e.width,
                                    height: a.height = e.height
                                }), a.ctx = a.elements.overlay.getContext("2d"), a.ctx.mozImageSmoothingEnabled = a.ctx.webkitImageSmoothingEnabled = a.ctx.msImageSmoothingEnabled = a.ctx.imageSmoothingEnabled = !1, a.setImageData(e), a.lazyInitDone = !0, n(a.width, a.height, a.previouslyLazyInited), a.previouslyLazyInited = !0, o.setLoadingBubbleState(a.name, !1), a.setShown()
                            },
                            setPixel: function(e, t, n) {
                                null !== a.ctx && (a.ctx.fillStyle = n, a.ctx.fillRect(e, t, 1, 1))
                            },
                            getImageData: function() {
                                return a.ctx && a.ctx.getImageData(0, 0, a.width, a.height)
                            },
                            setImageData: function(e) {
                                null !== a.ctx && a.ctx.putImageData(e, 0, 0)
                            },
                            clear: function() {
                                a.lazyInitDone && a.setImageData(r(a.width, a.height))
                            },
                            setOpacity: function(e) {
                                $(a.elements.overlay).css("opacity", e)
                            },
                            setShown: function(e = a.isShown) {
                                a.isShown = !0 === e, a.isShown && !a.lazyInitStarted && a.lazyInit(), a.lazyInitDone ? $(a.elements.overlay).toggleClass("transparent", !a.isShown) : o.setLoadingBubbleState(a.name, a.isShown)
                            },
                            remove: function() {
                                a.elements.overlay.remove()
                            },
                            reload: function() {
                                a.lazyInitStarted && !a.lazyInitDone || (a.lazyInitStarted = a.lazyInitDone = !1, a.lazyInit())
                            }
                        };
                        return $("#board").before(a.elements.overlay), {
                            get name() {
                                return a.name
                            },
                            get isShown() {
                                return a.isShown
                            },
                            setPixel: a.setPixel,
                            getImageData: a.getImageData,
                            setImageData: a.setImageData,
                            clear: a.clear,
                            setOpacity: a.setOpacity,
                            show: function() {
                                a.setShown(!0)
                            },
                            hide: function() {
                                a.setShown(!1)
                            },
                            toggle: function() {
                                a.setShown(!a.isShown)
                            },
                            setShown: a.setShown,
                            remove: a.remove,
                            reload: a.reload,
                            setPixelated: function(e = !0) {
                                $(a.elements.overlay).toggleClass("pixelate", e)
                            }
                        }
                    }(t, n, a);
                    return e.overlays[t] = i, i
                },
                remove: function(t) {
                    t in e.overlays && (e.overlays[t].remove(), delete e.overlays[t])
                },
                webinit: function(t) {
                    const n = t.width,
                        o = t.height;
                    async function d(e, t, a, i = 0) {
                        const [s, l] = await Promise.all([e, t]), d = r(n, o), c = new Uint32Array(d.data.buffer);
                        for (let e = 0; e < n * o; e++) 255 === l[e] ? c[e] = 0 : c[e] = (s[e] ^ i) << 24 | a;
                        return d
                    }
                    const c = l.wrap((() => s("/virginmap?_" + (new Date).getTime()))),
                        u = l.wrap((() => s("/heatmap?_" + (new Date).getTime()))),
                        p = l.wrap((() => s("/placemap?_" + (new Date).getTime()))),
                        m = e.add("virginbackground", (() => d(c, p, 65280, 0))),
                        f = e.add("virginmap", (() => d(c, p, 0, 255)), ((e, t, n) => {
                            n || (a.on("pixel", (e => {
                                $.map(e.pixels, (e => {
                                    f.setPixel(e.x, e.y, "#000000")
                                }))
                            })), $(window).keydown((function(e) {
                                ["INPUT", "TEXTAREA"].includes(e.target.nodeName) || "u" !== e.key && "U" !== e.key && 117 !== e.which && 85 !== e.which || f.clear()
                            })))
                        }));
                    i.board.virginmap.opacity.listen((function(e) {
                        m.setOpacity(e)
                    })), $("#vmapClear").click((function() {
                        f.clear()
                    })), i.board.virginmap.enable.listen((function(e) {
                        e ? (f.show(), m.show()) : (f.hide(), m.hide())
                    }));
                    const h = e.add("heatbackground", (() => d(u, p, 4278190080))),
                        g = e.add("heatmap", (() => d(u, p, 6053069)), ((e, n, o) => {
                            o || (setInterval((() => {
                                const t = g.getImageData(),
                                    o = new Uint32Array(t.data.buffer);
                                for (let t = 0; t < e * n; t++) {
                                    let e = o[t] >> 24;
                                    e && (e--, o[t] = e << 24 | 6053069)
                                }
                                g.setImageData(t)
                            }), 1e3 * t.heatmapCooldown / 256), a.on("pixel", (e => {
                                $.map(e.pixels, (e => {
                                    g.setPixel(e.x, e.y, "#CD5C5C")
                                }))
                            })), $(window).keydown((e => {
                                ["INPUT", "TEXTAREA"].includes(e.target.nodeName) || "o" !== e.key && "O" !== e.key && 111 !== e.which && 79 !== e.which || g.clear()
                            })))
                        }));
                    i.board.heatmap.opacity.listen((function(e) {
                        h.setOpacity(e)
                    })), $("#hmapClear").click((function() {
                        g.clear()
                    })), i.board.heatmap.enable.listen((function(e) {
                        e ? (g.show(), h.show()) : (g.hide(), h.hide())
                    }));
                    let b = !1;
                    const y = e => "h" === e.key || "H" === e.key || 72 === e.which;
                    $(window).keydown((function(e) {
                        if (!["INPUT", "TEXTAREA"].includes(e.target.nodeName) && y(e)) {
                            if (b) return;
                            b = !0, i.board.heatmap.enable.toggle()
                        }
                    })), $(window).keyup((function(e) {
                        y(e) && (b = !1)
                    }));
                    let w = !1;
                    const v = e => "x" === e.key || "X" === e.key || 88 === e.which;
                    $(window).keydown((function(e) {
                        if (!["INPUT", "TEXTAREA"].includes(e.target.nodeName) && v(e)) {
                            if (w) return;
                            w = !0, i.board.virginmap.enable.toggle()
                        }
                    })), $(window).keyup((function(e) {
                        v(e) && (w = !1)
                    }))
                }
            };
            return {
                webinit: e.webinit,
                add: e.add,
                remove: e.remove,
                get heatmap() {
                    return e.overlays.heatmap
                },
                get heatbackground() {
                    return e.overlays.heatbackground
                },
                get virginmap() {
                    return e.overlays.virginmap
                },
                get virginbackground() {
                    return e.overlays.virginbackground
                }
            }
        }()
    }, {
        "./helpers": 10,
        "./settings": 20,
        "./socket": 21,
        "./uiHelper": 26
    }],
    16: [function(e, t, n) {
        const {
            ls: o
        } = e("./storage");
        t.exports.panels = function() {
            const e = {
                init: () => {
                    Array.from(document.querySelectorAll(".panel-trigger[data-panel]")).forEach((t => {
                        t.addEventListener("click", (t => {
                            if (!t.target) return console.debug("[PANELS:TRIGGER] No target?");
                            const n = t.target.closest(".panel-trigger[data-panel]");
                            if (n) {
                                const t = n.dataset.panel;
                                if (t && t.trim()) {
                                    const n = document.querySelector(`.panel[data-panel="${t.trim()}"]`);
                                    n ? e._setOpenState(n, !0, !0) : console.debug("[PANELS:TRIGGER] Bad descriptor? Got: %o", t)
                                } else console.debug("[PANELS:TRIGGER] No descriptor? Elem: %o", n)
                            } else console.debug("[PANELS:TRIGGER] No trigger?")
                        }))
                    })), Array.from(document.querySelectorAll(".panel-closer")).forEach((t => {
                        t.addEventListener("click", (t => {
                            if (!t.target) return console.debug("[PANELS:CLOSER] No target?");
                            const n = t.target.closest(".panel");
                            n ? e._setOpenState(n, !1, !1) : console.debug("[PANELS:CLOSER] No panel?")
                        }))
                    })), !0 !== o.get("seen_initial_info") && (o.set("seen_initial_info", !0), e._setOpenState("info", !0))
                },
                _getPanelElement: e => e instanceof HTMLElement ? e : document.querySelector(`.panel[data-panel="${e}"]`),
                _getPanelTriggerElement: t => (t = e._getPanelElement(t)) ? document.querySelector(`.panel-trigger[data-panel="${t.dataset.panel}"]`) : null,
                setEnabled: (t, n) => {
                    t = e._getPanelElement(t), n ? delete t.dataset.disabled : t.dataset.disabled = "";
                    const o = e._getPanelTriggerElement(t);
                    o && (o.style.display = n ? "" : "none")
                },
                isEnabled: t => (t = e._getPanelElement(t)) && null == t.dataset.disabled,
                isOpen: t => (t = e._getPanelElement(t)) && e.isEnabled(t) && t.classList.contains("open"),
                _toggleOpenState: (t, n = !0) => {
                    (t = e._getPanelElement(t)) && e.isEnabled(t) && e._setOpenState(t, !t.classList.contains("open"), n)
                },
                _setOpenState: (t, n, o = !0) => {
                    if (n = !!n, t = e._getPanelElement(t)) {
                        const e = t.dataset.panel,
                            a = t.classList.contains("right") ? "right" : "left";
                        n ? (o && document.querySelectorAll(`.panel[data-panel].${a}.open`).forEach((e => {
                            e.classList.remove("open"), $(window).trigger("pxls:panel:closed", e.dataset.panel)
                        })), $(window).trigger("pxls:panel:opened", e), document.body.classList.toggle("panel-open", !0), document.body.classList.toggle(`panel-${a}`, !0)) : ($(window).trigger("pxls:panel:closed", e), document.body.classList.toggle("panel-open", document.querySelectorAll(".panel.open").length - 1 > 0), document.body.classList.toggle(`panel-${a}`, !1)), t.classList.toggle("open", n), document.body.classList.toggle(`panel-${a}-halfwidth`, $(`.panel[data-panel].${a}.open.half-width`).length > 0), document.body.classList.toggle(`panel-${a}-horizontal`, $(`.panel[data-panel].${a}.open.horizontal`).length > 0)
                    }
                }
            };
            return {
                init: e.init,
                open: t => e._setOpenState(t, !0),
                close: t => e._setOpenState(t, !1),
                toggle: (t, n = !0) => e._toggleOpenState(t, n),
                isOpen: e.isOpen,
                setEnabled: e.setEnabled,
                isEnabled: e.isEnabled
            }
        }()
    }, {
        "./storage": 22
    }],
    17: [function(e, t, n) {
        const {
            ls: o
        } = e("./storage"), {
            timer: a
        } = e("./timer"), {
            socket: i
        } = e("./socket"), {
            settings: r
        } = e("./settings"), {
            uiHelper: s
        } = e("./uiHelper"), {
            modal: l
        } = e("./modal");
        let d, c;
        const {
            analytics: u,
            hexToRGB: p
        } = e("./helpers");
        t.exports.place = function() {
            const t = {
                elements: {
                    palette: $("#palette"),
                    cursor: $("#cursor"),
                    reticule: $("#reticule"),
                    undo: $("#undo")
                },
                undoTimeout: !1,
                palette: [],
                reticule: {
                    x: 0,
                    y: 0
                },
                audio: new Audio("place.wav"),
                color: -1,
                isDoingCaptcha: !1,
                lastPixel: null,
                autoreset: !0,
                setAutoReset: function(e) {
                    t.autoreset = !!e
                },
                switch: function(e) {
                    const n = e >= 0 && e < t.palette.length,
                        a = 255 === e && c.placementOverrides && c.placementOverrides.canPlaceAnyColor;
                    if (n || a || (e = -1), t.color = e, o.set("color", e), $(".palette-color").removeClass("active"), $("body").toggleClass("show-placeable-bubble", -1 === e), -1 === e) return t.toggleCursor(!1), t.toggleReticule(!1), void("removeProperty" in document.documentElement.style && document.documentElement.style.removeProperty("--selected-palette-color"));
                    if (t.scale <= 15 && t.toggleCursor(!0), "setProperty" in document.documentElement.style && document.documentElement.style.setProperty("--selected-palette-color", a ? "transparent" : `#${t.palette[e].value}`), [t.elements.cursor, t.elements.reticule].forEach((o => o.css("background-color", n ? `#${t.palette[e].value}` : a ? "var(--general-background)" : null))), -1 !== e) {
                        $($(".palette-color[data-idx=" + e + "],.palette-color[data-idx=-1]")).addClass("active");
                        try {
                            $(`.palette-color[data-idx="${e}"]`)[0].scrollIntoView({
                                block: "nearest",
                                inline: "nearest"
                            })
                        } catch (t) {
                            $(`.palette-color[data-idx="${e}"]`)[0].scrollIntoView(!1)
                        }
                    }
                },
                place: function(e, n, o = null) {
                    a.cooledDown() && -1 !== t.color && t._place(e, n, o)
                },
                _place: function(e, n, o = null) {
                    null == o && (o = t.color), t.lastPixel = {
                        x: e,
                        y: n,
                        color: o
                    }, i.send({
                        type: "pixel",
                        x: e,
                        y: n,
                        color: o
                    }), u("send", "event", "Pixels", "Place"), t.autoreset && t.switch(-1)
                },
                update: function(e, n) {
                    if (void 0 !== e) {
                        const o = d.fromScreen(e, n);
                        t.reticule = {
                            x: o.x,
                            y: o.y
                        }
                    }
                    if (-1 === t.color) return t.toggleReticule(!1), void t.toggleCursor(!1);
                    if (r.ui.reticule.enable.get()) {
                        const e = d.toScreen(t.reticule.x, t.reticule.y),
                            n = d.getScale();
                        t.elements.reticule.css({
                            left: e.x - 1,
                            top: e.y - 1,
                            width: n - 1,
                            height: n - 1
                        }), t.toggleReticule(!0)
                    }
                    r.ui.cursor.enable.get() && t.toggleCursor(!0)
                },
                setNumberedPaletteEnabled: function(e) {
                    t.elements.palette[0].classList.toggle("no-pills", !e)
                },
                toggleReticule: e => {
                    e && r.ui.reticule.enable.get() ? t.elements.reticule.show() : e || t.elements.reticule.hide()
                },
                toggleCursor: e => {
                    e && r.ui.cursor.enable.get() ? t.elements.cursor.show() : e || t.elements.cursor.hide()
                },
                setPalette: function(e) {
                    t.palette = e, t.elements.palette.find(".palette-color").remove().end().append($.map(t.palette, (function(e, n) {
                        return $("<button>").attr("title", e.name).attr("type", "button").attr("data-idx", n).addClass("palette-color").addClass("ontouchstart" in window ? "touch" : "no-touch").css("background-color", `#${e.value}`).append($("<span>").addClass("palette-number").text(n)).click((function() {
                            t.switch(n)
                        }))
                    }))), t.elements.palette.prepend($("<button>").attr("type", "button").attr("data-idx", 255).addClass("palette-color palette-color-special checkerboard-background pixelate").addClass("ontouchstart" in window ? "touch" : "no-touch").hide().click((function() {
                        t.switch(255)
                    }))), t.elements.palette.prepend($("<button>").attr("type", "button").attr("data-idx", -1).addClass("palette-color no-border deselect-button").addClass("ontouchstart" in window ? "touch" : "no-touch").css("background-color", "transparent").append(crel("i", {
                        class: "fas fa-times"
                    })).click((function() {
                        t.switch(-1)
                    })))
                },
                togglePaletteSpecialColors: e => {
                    t.elements.palette.find(".palette-color.palette-color-special").toggle(e)
                },
                can_undo: !1,
                undo: function(e) {
                    e.stopPropagation(), i.send({
                        type: "undo"
                    }), t.can_undo = !1, document.body.classList.remove("undo-visible"), t.elements.undo.removeClass("open")
                },
                init: function() {
                    d = e("./board").board, c = e("./user").user, t.toggleReticule(!1), t.toggleCursor(!1), document.body.classList.remove("undo-visible"), t.elements.undo.removeClass("open"), d.getRenderBoard().on("pointermove mousemove", (function(e) {
                        t.update(e.clientX, e.clientY)
                    })), $(window).on("pointermove mousemove touchstart touchmove", (function(e) {
                        let n = 0,
                            o = 0;
                        e.changedTouches && e.changedTouches[0] ? (n = e.changedTouches[0].clientX, o = e.changedTouches[0].clientY) : (n = e.clientX, o = e.clientY), !1 !== r.ui.cursor.enable.get() && t.elements.cursor.css("transform", "translate(" + n + "px, " + o + "px)"), t.can_undo
                    })).keydown((function(e) {
                        ["INPUT", "TEXTAREA"].includes(e.target.nodeName) || t.can_undo && ("z" === e.key || "Z" === e.key || 90 === e.keyCode) && e.ctrlKey && t.undo(e)
                    })).on("touchstart", (function(e) {
                        -1 === t.color || t.can_undo
                    })), i.on("pixel", (function(e) {
                        $.map(e.pixels, (function(e) {
                            d.setPixelIndex(e.x, e.y, e.color, !1)
                        })), d.refresh(), d.update(!0)
                    })), i.on("ACK", (function(e) {
                        switch (e.ackFor) {
                            case "PLACE":
                                if ($(window).trigger("pxls:ack:place", [e.x, e.y]), s.tabHasFocus() && r.audio.enable.get()) {
                                    const e = t.audio.cloneNode(!1);
                                    e.volume = parseFloat(r.audio.alert.volume.get()), e.play()
                                }
                                break;
                            case "UNDO":
                                $(window).trigger("pxls:ack:undo", [e.x, e.y])
                        }
                        0 === s.getAvailable() && s.setPlaceableText("PLACE" === e.ackFor ? 0 : 1)
                    })), i.on("admin_placement_overrides", (function(e) {
                        t.togglePaletteSpecialColors(e.placementOverrides.canPlaceAnyColor), e.placementOverrides.canPlaceAnyColor || 255 !== t.color || t.switch(-1)
                    })), i.on("captcha_required", (function(e) {
                        t.isDoingCaptcha || (s.toggleCaptchaLoading(!0), grecaptcha.reset()), grecaptcha.execute(), t.isDoingCaptcha = !0, u("send", "event", "Captcha", "Execute")
                    })), i.on("captcha_status", (function(e) {
                        e.success ? (t._place(t.lastPixel.x, t.lastPixel.y, t.lastPixel.color), u("send", "event", "Captcha", "Accepted")) : (l.showText("Failed captcha verification"), u("send", "event", "Captcha", "Failed")), s.toggleCaptchaLoading(!1)
                    })), i.on("can_undo", (function(e) {
                        document.body.classList.add("undo-visible"), t.elements.undo.addClass("open"), t.can_undo = !0, !1 !== t.undoTimeout && clearTimeout(t.undoTimeout), t.undoTimeout = setTimeout((function() {
                            document.body.classList.remove("undo-visible"), t.elements.undo.removeClass("open"), t.can_undo = !1, t.undoTimeout = !1
                        }), 1e3 * e.time)
                    })), t.elements.undo.click(t.undo), window.recaptchaCallback = function(e) {
                        t.isDoingCaptcha = !1, i.send({
                            type: "captcha",
                            token: e
                        }), u("send", "event", "Captcha", "Sent")
                    }, t.elements.palette.on("wheel", (e => {
                        if (!0 !== r.place.palette.scrolling.enable.get() || !e.originalEvent.deltaY) return;
                        const n = -40 * e.originalEvent.deltaY,
                            o = (t.color + (n > 0 ? 1 : -1) * (!0 === r.place.palette.scrolling.invert.get() ? -1 : 1)) % t.palette.length;
                        t.switch(o <= -1 ? t.palette.length - 1 : o)
                    })), r.place.deselectonplace.enable.listen((function(e) {
                        t.setAutoReset(e)
                    }))
                },
                getPaletteABGR: function() {
                    const e = new Uint32Array(t.palette.length);
                    for (const n in t.palette) {
                        const {
                            r: o,
                            g: a,
                            b: i
                        } = p(t.palette[n].value);
                        e[n] = 4278190080 | i << 16 | a << 8 | o
                    }
                    return e
                }
            };
            return {
                init: t.init,
                update: t.update,
                place: t.place,
                switch: t.switch,
                setPalette: t.setPalette,
                get palette() {
                    return t.palette
                },
                getPaletteColorValue: (e, n = "000000") => t.palette[e] ? t.palette[e].value : n,
                getPaletteABGR: t.getPaletteABGR,
                togglePaletteSpecialColors: t.togglePaletteSpecialColors,
                setAutoReset: t.setAutoReset,
                setNumberedPaletteEnabled: t.setNumberedPaletteEnabled,
                get color() {
                    return t.color
                },
                get lastPixel() {
                    return t.lastPixel
                },
                toggleReticule: t.toggleReticule,
                toggleCursor: t.toggleCursor
            }
        }()
    }, {
        "./board": 5,
        "./helpers": 10,
        "./modal": 12,
        "./settings": 20,
        "./socket": 21,
        "./storage": 22,
        "./timer": 24,
        "./uiHelper": 26,
        "./user": 27
    }],
    18: [function(e, t, n) {
        const {
            ss: o
        } = e("./storage"), {
            board: a
        } = e("./board"), {
            template: i
        } = e("./template");
        t.exports.query = function() {
            const e = {
                params: {},
                initialized: !1,
                _trigger: function(e, t, n) {
                    $(window).trigger("pxls:queryUpdated", [e, t, n])
                },
                _update: function(t) {
                    let n = window.location.hash.substring(1);
                    window.location.search.length > 0 && (n += "&" + window.location.search.substring(1));
                    const o = n.split("&"),
                        a = {};
                    o.forEach((e => {
                        const t = e.split("="),
                            n = t.shift().toLowerCase();
                        n.length && (a[n] = t.shift())
                    }));
                    const i = Object.keys(a);
                    for (let n = 0; n < i.length; n++) {
                        const o = i[n],
                            r = a[o];
                        if (!0 === t) {
                            if (!Object.prototype.hasOwnProperty.call(e.params, o) || e.params[o] !== a[o]) {
                                const t = e.params[o],
                                    n = null == a[o] ? null : a[o].toString();
                                e.params[o] = n, e._trigger(o, t, r)
                            }
                        } else Object.prototype.hasOwnProperty.call(e.params, o) || (e.params[o] = a[o])
                    }!0 === t && Object.keys(e.params).filter((e => !i.includes(e))).forEach((t => e.remove(t))), window.location.search.substring(1) && (window.location = window.location.pathname + "#" + e.getStr())
                },
                setIfDifferent: function() {
                    let t = {},
                        n = !1;
                    if ("string" == typeof arguments[0]) {
                        const e = arguments[1];
                        n = arguments[2], t[arguments[0]] = e
                    } else "object" == typeof arguments[0] && (t = arguments[0], n = arguments[1]);
                    n = null != n && !0 === n;
                    const o = Object.entries(t);
                    for (let t = 0; t < o.length; t++) {
                        const a = o[t][0],
                            i = o[t][1].toString();
                        e.get(a) !== i && e.set(a, i, n)
                    }
                },
                init: function() {
                    o.get("url_params") ? (window.location.hash = o.get("url_params"), o.remove("url_params")) : (e._update(), "replaceState" in window.history && (window.onhashchange = function() {
                        e._update(!0)
                    })), $(window).on("message", (function(e) {
                        if ((e = e.originalEvent).data && e.data.type && e.data.data) {
                            const t = e.data;
                            switch (t.type.toUpperCase().trim()) {
                                case "TEMPLATE_UPDATE":
                                    i.queueUpdate(t.data);
                                    break;
                                case "VIEWPORT_UPDATE":
                                    a.updateViewport(t.data);
                                    break;
                                default:
                                    console.warn("Unknown data type: %o", t.type)
                            }
                        }
                    }))
                },
                has: function(t) {
                    return null != e.get(t)
                },
                getStr: function() {
                    const t = [];
                    for (const n in e.params)
                        if (Object.prototype.hasOwnProperty.call(e.params, n)) {
                            let o = encodeURIComponent(n);
                            if (null !== e.params[n]) {
                                const t = decodeURIComponent(e.params[n]);
                                let a = e.params[n];
                                t === a && (a = encodeURIComponent(a)), o += "=" + a
                            }
                            t.push(o)
                        } return t.join("&")
                },
                update: function() {
                    const t = e.getStr();
                    window.history.replaceState ? window.history.replaceState(null, null, "#" + t) : window.location.hash = t
                },
                set: function(t, n, o) {
                    const a = e.params[t];
                    e.params[t] = n.toString(), !0 !== o && e._trigger(t, a, n.toString()), e.lazy_update()
                },
                get: function(t) {
                    return e.params[t]
                },
                remove: function(t, n) {
                    delete e.params[t], e.lazy_update(), !0 !== n && e._trigger(t, e.params[t], null)
                },
                timer: null,
                lazy_update: function() {
                    null !== e.timer && clearTimeout(e.timer), e.timer = setTimeout((function() {
                        e.timer = null, e.update()
                    }), 200)
                }
            };
            return {
                init: e.init,
                get: e.get,
                set: e.setIfDifferent,
                has: e.has,
                update: e.update,
                remove: e.remove,
                lazy_update: e.lazy_update
            }
        }()
    }, {
        "./board": 5,
        "./storage": 22,
        "./template": 23
    }],
    19: [function(e, t, n) {
        t.exports.serviceWorkerHelper = (() => {
            const e = {
                isInit: !1,
                messageListeners: {},
                hasSupport: "serviceWorker" in window.navigator,
                init() {
                    e.hasSupport && (null == navigator.serviceWorker.controller ? navigator.serviceWorker.register("/serviceWorker.js").then((() => {
                        e.isInit = !0
                    })).catch((e => {
                        console.error("Failed to register Service Worker:", e)
                    })) : e.isInit = !0, navigator.serviceWorker.addEventListener("message", (t => {
                        if ("object" == typeof t.data && "type" in t.data) {
                            if (t.data.type in e.messageListeners)
                                for (const n of e.messageListeners[t.data.type]) n(t);
                            if ("*" in e.messageListeners)
                                for (const n of e.messageListeners["*"]) n(t)
                        } else console.warn(`${e.tabId}: Received non-data message from ${t.source.id} (${t.source.type})`, t.data)
                    })))
                },
                addMessageListener(t, n) {
                    const o = e.messageListeners[t] || [];
                    o.includes(n) || (o.push(n), e.messageListeners[t] = o)
                },
                removeMessageListener(t, n) {
                    if (!(t in e.messageListeners)) return;
                    const o = e.messageListeners[t],
                        a = o.indexOf(n); - 1 !== a && o.splice(a, 1)
                },
                postMessage(t) {
                    e.isInit && navigator.serviceWorker.ready.then((({
                        installing: e,
                        waiting: n,
                        active: o
                    }) => {
                        (navigator.serviceWorker.controller || e || n || o).postMessage(t)
                    }))
                }
            };
            return {
                get hasSupport() {
                    return e.hasSupport
                },
                get readyPromise() {
                    return navigator.serviceWorker.ready.then((t => (e.isInit = !0, t)))
                },
                init: e.init,
                addMessageListener: e.addMessageListener,
                removeMessageListener: e.removeMessageListener,
                postMessage: e.postMessage
            }
        })()
    }, {}],
    20: [function(e, t, n) {
        const {
            webkitBased: o,
            possiblyMobile: a
        } = e("./helpers").flags, {
            ls: i
        } = e("./storage");
        t.exports.settings = function() {
            const e = 0,
                t = 1,
                n = 2,
                r = 3,
                s = 4,
                l = 5,
                d = function(o, a, i) {
                    switch (i) {
                        case e:
                            if (!0 === o || !1 === o) return o;
                            break;
                        case n:
                            if ("string" == typeof o) return o;
                            break;
                        case r:
                        case t:
                            if (!isNaN(parseFloat(o))) return o;
                            break;
                        case s:
                        case l:
                            if (null != o) return o
                    }
                    return a
                },
                c = function(o, a, c, u = $()) {
                    const p = [];
                    let m = $();
                    const f = function(t) {
                            const n = d(t, c, a);
                            i.set(o, n), m.length > 0 && (a === l ? m.each(((e, n) => {
                                n.checked = n.value === t
                            })) : a === e ? m.prop("checked", n) : m.prop("value", n)), p.forEach((e => e(n)))
                        },
                        h = e => {
                            "Enter" !== e.key && 13 !== e.which || $(this).blur(), e.stopPropagation()
                        };
                    let g = e => f(e.target.value),
                        b = "change";
                    switch (a) {
                        case l:
                            b = "click";
                            break;
                        case t:
                            b = "input change";
                            break;
                        case e:
                            g = e => y.set(e.target.checked)
                    }
                    const y = {
                        get: function() {
                            const e = i.get(o);
                            return d(e, c, a)
                        },
                        set: f,
                        reset: function() {
                            y.set(c)
                        },
                        listen: function(e) {
                            p.push(e), e(y.get())
                        },
                        unlisten: function(e) {
                            const t = p.indexOf(e); - 1 !== t && p.splice(t, 1)
                        },
                        controls: {
                            add: function(o) {
                                const i = function(o, a) {
                                    switch (a) {
                                        case e:
                                            return o.filter("input[type=checkbox]");
                                        case t:
                                            return o.filter("input[type=range]");
                                        case n:
                                            return o.filter("input[type=text]");
                                        case r:
                                            return o.filter("input[type=number]");
                                        case s:
                                            return o.filter("select");
                                        case l:
                                            return o.filter("input[type=radio]")
                                    }
                                }($(o), a);
                                m = m.add(i), a !== n && a !== r || i.on("keydown", h), i.on(b, g), y.set(y.get())
                            },
                            remove: function(e) {
                                const t = m.filter($(e));
                                m = m.not(t), a !== n && a !== r || t.off("keydown", h), t.off(b, g)
                            },
                            disable: function() {
                                m.prop("disabled", !0)
                            },
                            enable: function() {
                                m.prop("disabled", !1)
                            }
                        }
                    };
                    return a === e && (y.toggle = function() {
                        y.set(!y.get())
                    }), y.controls.add(u), y
                },
                u = ["audio_muted", "increased_zoom", "canvas.unlocked"];
            Object.entries({
                currentTheme: "ui.theme.index",
                audio_muted: "audio.enable",
                heatmap: "board.heatmap.enable",
                virgimap: "board.virginmap.enable",
                view_grid: "board.grid.enable",
                "canvas.unlocked": "board.lock.enable",
                "nativenotifications.pixel-avail": "place.notification.enable",
                autoReset: "place.deselectonplace.enable",
                zoomBaseValue: "board.zoom.sensitivity",
                increased_zoom: "board.zoom.limit.enable",
                scrollSwitchEnabled: "place.palette.scrolling.enable",
                scrollSwitchDirectionInverted: "place.palette.scrolling.invert",
                "ui.show-reticule": "ui.reticule.enable",
                "ui.show-cursor": "ui.cursor.enable",
                templateBeneathHeatmap: "board.template.beneathoverlays",
                enableMiddleMouseSelect: "place.picker.enable",
                enableNumberedPalette: "ui.palette.numbers.enable",
                heatmap_background_opacity: "board.heatmap.opacity",
                virginmap_background_opacity: "board.virginmap.opacity",
                snapshotImageFormat: "board.snapshot.format",
                "bubble-position": "ui.bubble.position",
                "brightness.enabled": "ui.brightness.enable",
                colorBrightness: "ui.brightness.value",
                "alert.src": "audio.alert.src",
                "alert.volume": "audio.alert.volume",
                alert_delay: "place.alert.delay",
                "chrome-canvas-offset-workaround": "fix.chrome.offset.enable",
                hide_sensitive: "lookup.filter.sensitive.enable",
                "chat.font-size": "chat.font.size",
                "chat.internalClickDefault": "chat.links.internal.behavior",
                "chat.24h": "chat.timestamps.24h",
                "chat.text-icons-enabled": "chat.badges.enable",
                "chat.faction-tags-enabled": "chat.factiontags.enable",
                "chat.pings-enabled": "chat.pings.enable",
                "chat.ping-audio-state": "chat.pings.audio.when",
                "chat.ping-audio-volume": "chat.pings.audio.volume",
                "chat.banner-enabled": "ui.chat.banner.enable",
                "chat.use-template-urls": "chat.links.templates.preferurls",
                "chat.horizontal": "ui.chat.horizontal.enable"
            }).forEach((e => {
                if (i.has(e[0])) {
                    const t = i.get(e[0]);
                    i.set(e[1], -1 === u.indexOf(e[0]) ? t : !t), i.remove(e[0])
                }
            }));
            const p = $("#settings-search-input").val(null),
                m = $("<p>").text("No Results").addClass("hidden text-muted").css({
                    "text-align": "center",
                    "margin-top": "5em",
                    "font-style": "italic"
                });
            $("#settings > .panel-body").append(m);
            const f = function(e, t, n = !1) {
                const o = t.data("keywords");
                return o && o.split(";").some((t => e.test(t))) || n && e.test(t.text())
            };

            function h(e) {
                const t = f.bind(null, new RegExp(e.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), "i")),
                    n = $("#settings > .panel-body > article").filter(((e, n) => {
                        const o = $(n),
                            a = o.children("header + *").children(":not(section)"),
                            i = o.children("header + *").children("section");
                        if (t(o)) return o.toggleClass("hidden", !1), a.toggleClass("hidden", !1), i.toggleClass("hidden", !1), i.children(":not(h4)").toggleClass("hidden", !1), !0;
                        {
                            const e = a.filter(((e, n) => {
                                    const o = $(n),
                                        a = t(o, !0);
                                    return o.toggleClass("hidden", !a), a
                                })),
                                n = i.filter(((e, n) => {
                                    const o = $(n),
                                        a = o.children(":not(h4)");
                                    if (t(o)) return o.toggleClass("hidden", !1), a.toggleClass("hidden", !1), !0;
                                    {
                                        const e = 0 === a.filter(((e, n) => {
                                            const o = $(n),
                                                a = t(o, !0);
                                            return o.toggleClass("hidden", !a), a
                                        })).length;
                                        return o.toggleClass("hidden", e), !e
                                    }
                                })).length + e.length === 0;
                            return o.toggleClass("hidden", n), !n
                        }
                    }));
                m.toggleClass("hidden", n.length > 0)
            }
            p.on("keyup", (function(e) {
                "Enter" !== e.key && 13 !== e.which || $(this).blur(), h(p.val()), e.stopPropagation()
            })), p.on("change", (function() {
                h(p.val())
            }));
            const g = {
                filter: {
                    search: e => {
                        p.val(e), "string" == typeof e && h(e)
                    }
                },
                ui: {
                    language: {
                        override: c("ui.language.override", s, "", $("#setting-ui-language-override"))
                    },
                    theme: {
                        index: c("ui.theme.index", s, "-1", $("#setting-ui-theme-index"))
                    },
                    reticule: {
                        enable: c("ui.reticule.enable", e, !a, $("#setting-ui-reticule-enable"))
                    },
                    cursor: {
                        enable: c("ui.cursor.enable", e, !a, $("#setting-ui-cursor-enable"))
                    },
                    bubble: {
                        position: c("ui.bubble.position", s, "bottom left", $("#setting-ui-bubble-position")),
                        compact: c("ui.bubble.compact", e, !1)
                    },
                    brightness: {
                        enable: c("ui.brightness.enable", e, !1, $("#setting-ui-brightness-enable")),
                        value: c("ui.brightness.value", t, 1, $("#setting-ui-brightness-value"))
                    },
                    palette: {
                        numbers: {
                            enable: c("ui.palette.numbers.enable", e, !1, $("#setting-ui-palette-numbers-enable"))
                        },
                        scrollbar: {
                            thin: {
                                enable: c("ui.palette.scrollbar.thin.enable", e, !0, $("#setting-ui-palette-scrollbar-thin-enable"))
                            }
                        },
                        stacking: {
                            enable: c("ui.palette.stacking.enable", e, !1, $("#setting-ui-palette-stacking-enable"))
                        }
                    },
                    chat: {
                        banner: {
                            enable: c("ui.chat.banner.enable", e, !0, $("#setting-ui-chat-banner-enable"))
                        },
                        horizontal: {
                            enable: c("ui.chat.horizontal.enable", e, !1, $("#setting-ui-chat-horizontal-enable"))
                        },
                        icon: {
                            badge: c("ui.chat.icon.badge", s, "ping", $("#setting-ui-chat-icon-badge")),
                            color: c("ui.chat.icon.color", s, "message", $("#setting-ui-chat-icon-color"))
                        }
                    }
                },
                audio: {
                    enable: c("audio.enable", e, !0, $("#setting-audio-enable")),
                    alert: {
                        src: c("audio.alert.src", n, "", $("#setting-audio-alert-src")),
                        volume: c("audio.alert.volume", t, 1, $("#setting-audio-alert-volume"))
                    }
                },
                board: {
                    heatmap: {
                        enable: c("board.heatmap.enable", e, !1, $("#setting-board-heatmap-enable")),
                        opacity: c("board.heatmap.opacity", t, .5, $("#setting-board-heatmap-opacity"))
                    },
                    virginmap: {
                        enable: c("board.virginmap.enable", e, !1, $("#setting-board-virginmap-enable")),
                        opacity: c("board.virginmap.opacity", t, .5, $("#setting-board-virginmap-opacity"))
                    },
                    grid: {
                        enable: c("board.grid.enable", e, !1, $("#setting-board-grid-enable"))
                    },
                    lock: {
                        enable: c("board.lock.enable", e, !1, $("#setting-board-lock-enable"))
                    },
                    zoom: {
                        sensitivity: c("board.zoom.sensitivity", t, 1.5, $("#setting-board-zoom-sensitivity")),
                        limit: {
                            minimum: c("board.zoom.limit.minimum", r, .5, $("#setting-board-zoom-limit-minimum")),
                            maximum: c("board.zoom.limit.maximum", r, 50, $("#setting-board-zoom-limit-maximum"))
                        },
                        rounding: {
                            enable: c("board.zoom.rounding.enable", e, !1, $("#setting-board-zoom-rounding-enable"))
                        }
                    },
                    template: {
                        beneathoverlays: c("board.template.beneathoverlays", e, !1, $("#setting-board-template-beneathoverlays")),
                        opacity: c("board.template.opacity", t, 1, $("#template-opacity")),
                        style: {
                            source: c("board.template.style.source", s, null, $("#template-style-mode")),
                            customsource: c("board.template.style.customsource", n, "", $("#template-custom-style-url"))
                        }
                    },
                    snapshot: {
                        format: c("board.snapshot.format", s, "image/png", $("#setting-board-snapshot-format"))
                    }
                },
                place: {
                    notification: {
                        enable: c("place.notification.enable", e, !0, $("#setting-place-notification-enable"))
                    },
                    deselectonplace: {
                        enable: c("place.deselectonplace.enable", e, !1, $("#setting-place-deselectonplace-enable"))
                    },
                    palette: {
                        scrolling: {
                            enable: c("place.palette.scrolling.enable", e, !1, $("#setting-place-palette-scrolling-enable")),
                            invert: c("place.palette.scrolling.invert", e, !1, $("#setting-place-palette-scrolling-invert"))
                        }
                    },
                    picker: {
                        enable: c("place.picker.enable", e, !0, $("#setting-place-picker-enable"))
                    },
                    rightclick: {
                        action: c("ui.rightclick.action", s, "nothing", $("#setting-ui-right-click-action"))
                    },
                    alert: {
                        delay: c("place.alert.delay", r, 0, $("#setting-place-alert-delay"))
                    }
                },
                lookup: {
                    filter: {
                        sensitive: {
                            enable: c("lookup.filter.sensitive.enable", e, !1)
                        }
                    }
                },
                chat: {
                    enable: c("chat.enable", e, !0, $("#setting-chat-enable")),
                    timestamps: {
                        "24h": c("chat.timestamps.24h", e, !1, $("#setting-chat-timestamps-24h"))
                    },
                    badges: {
                        enable: c("chat.badges.enable", e, !1, $("#setting-chat-badges-enable"))
                    },
                    factiontags: {
                        enable: c("chat.factiontags.enable", e, !0, $("#setting-chat-factiontags-enable"))
                    },
                    pings: {
                        enable: c("chat.pings.enable", e, !0, $("#setting-chat-pings-enable")),
                        audio: {
                            when: c("chat.pings.audio.when", s, "off", $("#setting-chat-pings-audio-when")),
                            volume: c("chat.pings.audio.volume", t, .5, $("#setting-chat-pings-audio-volume"))
                        }
                    },
                    links: {
                        templates: {
                            preferurls: c("chat.links.templates.preferurls", e, !1, $("#setting-chat-links-templates-preferurls"))
                        },
                        internal: {
                            behavior: c("chat.links.internal.behavior", s, "ask")
                        }
                    },
                    font: {
                        size: c("chat.font.size", r, 16, $("#setting-chat-font-size"))
                    },
                    truncate: {
                        max: c("chat.truncate.max", r, 250, $("#setting-chat-truncate-max"))
                    }
                },
                fix: {
                    chrome: {
                        offset: {
                            enable: c("fix.chrome.offset.enable", e, o, $("#setting-fix-chrome-offset-enable"))
                        }
                    }
                }
            };
            return $(window).on("pxls:panel:closed", ((e, t) => {
                "settings" === t && g.filter.search("")
            })), g
        }()
    }, {
        "./helpers": 10,
        "./storage": 22
    }],
    21: [function(e, t, n) {
        let o;
        t.exports.socket = function() {
            const t = {
                ws: null,
                hooks: [],
                sendQueue: [],
                wps: WebSocket.prototype.send,
                wpc: WebSocket.prototype.close,
                ws_open_state: WebSocket.OPEN,
                reconnect: function() {
                    $("#reconnecting").show(), setTimeout((function() {
                        $.get(window.location.pathname + "?_" + (new Date).getTime(), (function() {
                            window.location.reload()
                        })).fail((function() {
                            console.info("Server still down..."), t.reconnect()
                        }))
                    }), 3e3)
                },
                reconnectSocket: function() {
                    t.ws.onclose = function() {}, t.connectSocket()
                },
                connectSocket: function() {
                    const e = window.location,
                        n = ("https:" === e.protocol ? "wss://" : "ws://") + e.host + e.pathname + "ws";
                    t.ws = new WebSocket(n), t.ws.onopen = e => {
                        setTimeout((() => {
                            for (; t.sendQueue.length > 0;) {
                                const e = t.sendQueue.shift();
                                t.send(e)
                            }
                        }), 0)
                    }, t.ws.onmessage = function(e) {
                        const n = JSON.parse(e.data);
                        $.map(t.hooks, (function(e) {
                            e.type === n.type && e.fn(n)
                        }))
                    }, t.ws.onclose = function() {
                        t.reconnect()
                    }
                },
                init: function() {
                    o = e("./user").user, null === t.ws && (t.connectSocket(), $(window).on("beforeunload", (function() {
                        t.ws.onclose = function() {}, t.close()
                    })), $("#board-container").show(), $("#ui").show(), $("#loading").fadeOut(500), o.wsinit())
                },
                on: function(e, n) {
                    t.hooks.push({
                        type: e,
                        fn: n
                    })
                },
                close: function() {
                    t.ws.close = t.wpc, t.ws.close()
                },
                send: function(e) {
                    const n = "string" == typeof e ? e : JSON.stringify(e);
                    null == t.ws || t.ws.readyState !== t.ws_open_state ? t.sendQueue.push(n) : (t.ws.send = t.wps, t.ws.send(n))
                }
            };
            return {
                init: t.init,
                on: t.on,
                send: t.send,
                close: t.close,
                reconnect: t.reconnect,
                reconnectSocket: t.reconnectSocket
            }
        }()
    }, {
        "./user": 27
    }],
    22: [function(e, t, n) {
        const o = t.exports.getCookie = function(e) {
                let t, n, o;
                const a = document.cookie.split(";");
                for (t = 0; t < a.length; t++)
                    if (n = a[t].substr(0, a[t].indexOf("=")), o = a[t].substr(a[t].indexOf("=") + 1), n = n.replace(/^\s+|\s+$/g, ""), n === e) return unescape(o)
            },
            a = t.exports.setCookie = function(e, t, n) {
                const o = new Date;
                let a = escape(t);
                o.setDate(o.getDate() + n), a += null == n ? "" : "; expires=" + o.toUTCString(), document.cookie = e + "=" + a
            },
            i = function(e, t, n) {
                const i = function(n, a) {
                    let i;
                    return i = a ? e.getItem(n) : o(t + n), void 0 === i && (i = null), i
                };
                return {
                    haveSupport: null,
                    support: function() {
                        if (null == this.haveSupport) try {
                            e.setItem("test", "1"), this.haveSupport = "1" === e.getItem("test"), e.removeItem("test")
                        } catch (e) {
                            this.haveSupport = !1
                        }
                        return this.haveSupport
                    },
                    get: function(e) {
                        const t = i(e, this.support());
                        try {
                            return JSON.parse(t)
                        } catch (e) {
                            return null
                        }
                    },
                    has: function(e) {
                        return null !== i(e, this.support())
                    },
                    set: function(o, i) {
                        i = JSON.stringify(i), this.support() ? e.setItem(o, i) : a(t + o, i, n)
                    },
                    remove: function(n) {
                        this.support() ? e.removeItem(n) : a(t + n, "", -1)
                    }
                }
            };
        t.exports.ls = i(localStorage, "ls_", 99), t.exports.ss = i(sessionStorage, "ss_", null)
    }, {}],
    23: [function(e, t, n) {
        const {
            settings: o
        } = e("./settings");
        let a, i, r;
        t.exports.template = function() {
            const t = {
                elements: {
                    visibles: null,
                    template: $("<canvas>"),
                    sourceImage: $("<img>").attr({
                        crossOrigin: ""
                    }),
                    styleImage: $("<img>").attr({
                        crossOrigin: ""
                    }),
                    useCheckbox: $("#template-use"),
                    titleInput: $("#template-title"),
                    urlInput: $("#template-url"),
                    imageErrorWarning: $("#template-image-error-warning"),
                    coordsXInput: $("#template-coords-x"),
                    coordsYInput: $("#template-coords-y"),
                    widthInput: $("#template-width"),
                    widthResetBtn: $("#template-width-reset"),
                    styleSelect: $("#template-style-mode"),
                    styleOptionCustom: $("#template-style-mode-custom"),
                    conversionModeSelect: $("#template-conversion-mode-select"),
                    opacityPercentage: $("#template-opacity-percentage")
                },
                gl: {
                    context: null,
                    textures: {
                        source: null,
                        downscaled: null,
                        style: null
                    },
                    framebuffers: {
                        main: null,
                        intermediate: null
                    },
                    buffers: {
                        vertex: null
                    },
                    programs: {
                        downscaling: {
                            unconverted: null,
                            nearestCustom: null
                        },
                        stylize: null
                    }
                },
                corsProxy: {
                    base: void 0,
                    param: null,
                    safeHosts: ["imgur.com", "media.discordapp.net", "pxlsfiddle.com", "zaix.ru", window.location.host]
                },
                queueTimer: 0,
                loading: !1,
                _queuedUpdates: {},
                _defaults: {
                    url: "",
                    x: 0,
                    y: 0,
                    width: -1,
                    title: "",
                    convertMode: "unconverted",
                    style: void 0
                },
                options: {},
                initCORS: function(e, n) {
                    t.corsProxy.base = e, t.corsProxy.param = n, t.loadImage()
                },
                cors: function(e) {
                    try {
                        const n = new URL(e);
                        return "data:" === n.protocol || t.corsProxy.safeHosts.some((e => n.hostname.endsWith(e))) ? n.href : t.corsProxy.param ? `${t.corsProxy.base}?${t.corsProxy.param}=${encodeURIComponent(n.href)}` : `${t.corsProxy.base}/${n.href}`
                    } catch (t) {
                        return e
                    }
                },
                loadImage: function() {
                    if (void 0 !== t.corsProxy.base) {
                        if (t.loading = !0, t.elements.imageErrorWarning.empty(), t.elements.imageErrorWarning.hide(), void 0 === t.options.url) return;
                        fetch(t.cors(t.options.url), {
                            method: "GET",
                            credentials: "omit"
                        }).then((e => {
                            if (e.ok) return e.blob();
                            throw new Error(`HTTP ${e.status} ${e.statusText}`)
                        })).then((e => {
                            const n = new FileReader;
                            n.onload = () => {
                                t.elements.sourceImage.attr("src", n.result)
                            }, n.readAsDataURL(e)
                        })).catch((e => {
                            t.elements.imageErrorWarning.text(`Error loading template image: ${e}`), t.elements.imageErrorWarning.show()
                        })).finally((() => {
                            t.loading = !1
                        }))
                    }
                },
                updateSettings: function() {
                    t.elements.useCheckbox.prop("checked", t.options.use), t.elements.urlInput.val(t.options.url ? t.options.url : ""), t.elements.titleInput.prop("disabled", !t.options.use).val(t.options.title ? t.options.title : ""), t.options.use ? o.board.template.opacity.controls.enable() : o.board.template.opacity.controls.disable(), t.elements.coordsXInput.prop("disabled", !t.options.use).val(t.options.x), t.elements.coordsYInput.prop("disabled", !t.options.use).val(t.options.y), t.elements.widthInput.prop("disabled", !t.options.use), t.options.width >= 0 ? t.elements.widthInput.val(t.options.width) : t.elements.template ? t.elements.widthInput.val(t.getSourceWidth()) : t.elements.widthInput.val(null), t.elements.conversionModeSelect.val(t.options.convertMode)
                },
                normalizeTemplateObj(e, t) {
                    const n = [
                        ["tw", "width"],
                        ["ox", "x"],
                        ["oy", "y"],
                        ["template", "url"],
                        ["title", "title"],
                        ["convert", "convertMode"]
                    ];
                    if (!0 !== t)
                        for (let e = 0; e < n.length; e++) n[e].reverse();
                    for (let t = 0; t < n.length; t++) {
                        const o = n[t];
                        o[0] in e && null == e[o[1]] && (e[o[1]] = e[o[0]], delete e[o[0]])
                    }
                    return e
                },
                queueUpdate: function(e) {
                    e = t.normalizeTemplateObj(e, !0), t._queuedUpdates = Object.assign(t._queuedUpdates, e), t.queueTimer && clearTimeout(t.queueTimer), t.queueTimer = setTimeout((function() {
                        t._update(t._queuedUpdates), t._queuedUpdates = {}, t.queueTimer = 0
                    }), 200)
                },
                _update: function(e, n = !0) {
                    if (!Object.keys(e).length) return;
                    const o = e.url !== t.options.url && decodeURIComponent(e.url) !== t.options.url && null != e.url;
                    null != e.url && e.url.length > 0 && (e.url = decodeURIComponent(e.url)), null != e.title && e.title.length > 0 && (e.title = decodeURIComponent(e.title)), o && !t.options.use && ["width", "x", "y", "convertMode"].forEach((n => {
                        Object.prototype.hasOwnProperty.call(e, n) || (e[n] = t._defaults[n])
                    })), e = Object.assign({}, t._defaults, t.options, t.normalizeTemplateObj(e, !0)), Object.keys(t._defaults).forEach((n => {
                        (null == e[n] || "number" == typeof e[n] && isNaN(e[n])) && (e[n] = t._defaults[n])
                    })), e.convertMode in t.gl.programs.downscaling || (e.convertMode = t._defaults.convertMode);
                    const s = e.convertMode !== t.options.convertMode;
                    t.options = e, 0 === e.url.length || !1 === e.use ? (t.options.use = !1, a.update(!0), ["template", "ox", "oy", "tw", "title", "convert"].forEach((e => i.remove(e, !0)))) : (t.options.use = !0, !0 === o && t.loadImage(), t.loading || !t.isDirty() && !s || t.rasterizeTemplate(), [
                        ["url", "template"],
                        ["x", "ox"],
                        ["y", "oy"],
                        ["width", "tw"],
                        ["title", "title"],
                        ["convertMode", "convert"]
                    ].forEach((e => {
                        i.set(e[1], t.options[e[0]], !0)
                    }))), t.elements.styleImage.prop("src") !== t.options.style && fetch(t.cors(t.options.style), {
                        method: "GET",
                        credentials: "omit"
                    }).then((e => {
                        if (e.ok) return e.blob();
                        throw new Error(`HTTP ${e.status} ${e.statusText}`)
                    })).then((e => {
                        const n = new FileReader;
                        n.onload = () => {
                            t.elements.styleImage.attr("src", n.result)
                        }, n.readAsDataURL(e)
                    })), t.applyOptions(), n && t.updateSettings(), document.title = r.getTitle(), t.setPixelated(i.get("scale") >= t.getWidthRatio())
                },
                usesStyle: () => !!t.options.style,
                applyOptions() {
                    t.options.use && [
                        ["left", "x"],
                        ["top", "y"]
                    ].forEach((e => {
                        t.elements.visibles.css(e[0], t.options[e[1]])
                    })), t.elements.visibles.css("opacity", o.board.template.opacity.get()), t.elements.template.toggleClass("hidden", !t.options.use || !t.usesStyle()), t.elements.sourceImage.toggleClass("hidden", !t.options.use || t.usesStyle())
                },
                updateSize: function() {
                    t.elements.visibles.css({
                        width: t.getDisplayWidth()
                    }), t.elements.template.attr({
                        width: t.getInternalWidth(),
                        height: t.getInternalHeight()
                    })
                },
                isDirty: function() {
                    return parseFloat(t.elements.visibles.css("width")) !== t.getDisplayWidth() || parseFloat(t.elements.visibles.attr("width")) !== t.getInternalWidth() || parseFloat(t.elements.visibles.attr("height")) !== t.getInternalHeight()
                },
                disableTemplate: function() {
                    t._update({
                        url: null
                    })
                },
                draw: function(e, n, i) {
                    if (!t.options.use) return;
                    let r = t.elements.template[0].width,
                        s = t.elements.template[0].height;
                    const l = a.getScale(); - 1 !== t.options.width && (s *= t.options.width / r, r = t.options.width), e.globalAlpha = o.board.template.opacity.get(), e.drawImage(t.elements.template[0], (t.options.x - n) * l, (t.options.y - i) * l, r * l, s * l)
                },
                init: function() {
                    a = e("./board").board, i = e("./query").query, r = e("./uiHelper").uiHelper, t.elements.visibles = $().add(t.elements.template).add(t.elements.sourceImage).addClass("noselect board-template"), t.elements.imageErrorWarning.hide(), t.elements.useCheckbox.change((e => t._update({
                        use: e.target.checked
                    }))), t.elements.titleInput.change((e => t._update({
                        title: e.target.value
                    }, !1))), t.elements.urlInput.change((e => t._update({
                        use: !0,
                        url: e.target.value
                    }))), t.elements.coordsXInput.on("change input", (e => t._update({
                        x: parseInt(e.target.value)
                    }, !1))), t.elements.coordsYInput.on("change input", (e => t._update({
                        y: parseInt(e.target.value)
                    }, !1))), t.elements.widthInput.on("change input", (e => t._update({
                        width: parseFloat(e.target.value)
                    }, !1))), t.elements.widthResetBtn.on("click", (e => t._update({
                        width: -1
                    }))), o.board.template.opacity.listen((e => {
                        t.elements.opacityPercentage.text(`${Math.floor(100*e)}%`), t.applyOptions()
                    })), o.board.template.style.source.listen((e => {
                        void 0 === t.corsProxy.base ? t.options.style = e : t._update({
                            style: e
                        })
                    })), o.board.template.style.customsource.listen((e => {
                        t.elements.styleOptionCustom.attr({
                            value: e
                        }), o.board.template.style.source.set(o.board.template.style.source.get()), t.elements.styleSelect.trigger("change")
                    })), t.elements.conversionModeSelect.on("change input", (e => t._update({
                        convertMode: e.target.value
                    }))), t.updateSettings(), $(window).keydown((function(e) {
                        if (["INPUT", "TEXTAREA"].includes(e.target.nodeName)) return;
                        if (t.options.use) switch (e.originalEvent.code || e.originalEvent.keyCode || e.originalEvent.which || e.originalEvent.key) {
                            case "ControlLeft":
                            case "ControlRight":
                            case "Control":
                            case 17:
                            case "AltLeft":
                            case "AltRight":
                            case "Alt":
                            case 18:
                                e.preventDefault(), t.elements.visibles.css("pointer-events", "initial")
                        }
                        let n = 0;
                        switch (e.code || e.keyCode || e.which || e.key) {
                            case "PageUp":
                            case 33:
                                n = Math.min(1, t.options.opacity + .1), o.board.template.opacity.set(n);
                                break;
                            case "PageDown":
                            case 34:
                                n = Math.max(0, t.options.opacity - .1), o.board.template.opacity.set(n);
                                break;
                            case "KeyV":
                            case 86:
                            case "v":
                            case "V":
                                t._update({
                                    use: !t.options.use
                                })
                        }
                    })).on("keyup blur", t.stopDragging);
                    const n = {
                        x: 0,
                        y: 0
                    };
                    t.elements.visibles.data("dragging", !1).on("mousedown pointerdown", (function(e) {
                        e.preventDefault(), $(this).data("dragging", !0), n.x = e.clientX, n.y = e.clientY, e.stopPropagation()
                    })).on("mouseup pointerup", (function(e) {
                        e.preventDefault(), $(this).data("dragging", !1), e.stopPropagation()
                    })).on("mousemove pointermove", (function(e) {
                        if (e.preventDefault(), $(this).data("dragging")) {
                            if (!e.ctrlKey && !e.altKey) return void t.stopDragging();
                            const o = a.fromScreen(n.x, n.y),
                                r = a.fromScreen(e.clientX, e.clientY),
                                s = r.x - o.x,
                                l = r.y - o.y,
                                d = t.options.x + s,
                                c = t.options.y + l;
                            t._update({
                                x: d,
                                y: c
                            }), i.set({
                                ox: d,
                                oy: c
                            }, !0), 0 !== s && (n.x = e.clientX), 0 !== l && (n.y = e.clientY)
                        }
                    })), t.elements.styleImage.on("load", (function(e) {
                        t.loadStyle(!t.loading)
                    })), t.elements.sourceImage.on("load", (e => {
                        t.loading = !1, t.rasterizeTemplate(), t.options.width >= 0 || t.elements.widthInput.val(t.elements.sourceImage[0].naturalWidth), t.elements.visibles.toggleClass("pixelate", i.get("scale") > t.getWidthRatio())
                    })).on("error", (() => {
                        t.loading = !1, t.elements.imageErrorWarning.show(), t.elements.imageErrorWarning.text("There was an error getting the image"), t._update({
                            use: !1
                        })
                    })), a.update(!0) || a.getRenderBoard().parent().prepend(t.elements.visibles)
                },
                webinit: function(e) {
                    t.initGl(t.elements.template[0].getContext("webgl", {
                        premultipliedAlpha: !1
                    }), e.palette), t.initCORS(e.corsBase, e.corsParam), t.loading || t.rasterizeTemplate()
                },
                stopDragging: function() {
                    t.options.use && t.elements.visibles.css("pointer-events", "none").data("dragging", !1)
                },
                setPixelated: function(e = !0) {
                    t.elements.visibles.toggleClass("pixelate", e)
                },
                getWidthRatio: function() {
                    return t.usesStyle() ? t.getInternalWidth() / t.getDisplayWidth() : t.getSourceWidth() / t.getDisplayWidth()
                },
                getDownscaleWidthRatio: function() {
                    return t.getSourceWidth() / t.getDisplayWidth()
                },
                getDownscaleHeightRatio: function() {
                    return t.getSourceHeight() / t.getDisplayHeight()
                },
                getDisplayWidth: function() {
                    return Math.round(t.options.width >= 0 ? t.options.width : t.getSourceWidth())
                },
                getDisplayHeight: function() {
                    return Math.round(t.getDisplayWidth() * t.getAspectRatio())
                },
                getStyleWidth: function() {
                    return t.elements.styleImage[0].naturalWidth / 16
                },
                getStyleHeight: function() {
                    return t.elements.styleImage[0].naturalHeight / 16
                },
                getSourceWidth: function() {
                    return t.elements.sourceImage[0].naturalWidth
                },
                getSourceHeight: function() {
                    return t.elements.sourceImage[0].naturalHeight
                },
                getAspectRatio: function() {
                    return 0 === t.getSourceWidth() ? 1 : t.getSourceHeight() / t.getSourceWidth()
                },
                getInternalWidth: function() {
                    return t.getDisplayWidth() * t.getStyleWidth()
                },
                getInternalHeight: function() {
                    return t.getDisplayHeight() * t.getStyleHeight()
                },
                loadStyle: function(e = !0) {
                    const n = t.elements.styleImage[0];
                    null !== t.gl.context && 0 !== n.naturalWidth && 0 !== n.naturalHeight && (t.gl.context.activeTexture(t.gl.context.TEXTURE1), t.gl.context.bindTexture(t.gl.context.TEXTURE_2D, t.gl.textures.style), t.gl.context.texImage2D(t.gl.context.TEXTURE_2D, 0, t.gl.context.ALPHA, t.gl.context.ALPHA, t.gl.context.UNSIGNED_BYTE, n), e && t.stylizeTemplate())
                },
                initGl: function(e, n) {
                    if (t.gl.context = e, null === t.gl.context) return void console.info("WebGL is unsupported on this system");
                    t.gl.context.clearColor(0, 0, 0, 0), t.gl.context.pixelStorei(t.gl.context.UNPACK_FLIP_Y_WEBGL, !0), t.gl.textures.source = t.createGlTexture(), t.gl.textures.downscaled = t.createGlTexture(), t.gl.framebuffers.intermediate = t.gl.context.createFramebuffer(), t.gl.context.bindFramebuffer(t.gl.context.FRAMEBUFFER, t.gl.framebuffers.intermediate), t.gl.context.framebufferTexture2D(t.gl.context.FRAMEBUFFER, t.gl.context.COLOR_ATTACHMENT0, t.gl.context.TEXTURE_2D, t.gl.textures.downscaled, 0), t.gl.textures.style = t.createGlTexture(), t.loadStyle(!1), t.gl.buffers.vertex = t.gl.context.createBuffer(), t.gl.context.bindBuffer(t.gl.context.ARRAY_BUFFER, t.gl.buffers.vertex), t.gl.context.bufferData(t.gl.context.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), t.gl.context.STATIC_DRAW);
                    const o = "\n        attribute vec2 a_Pos;\n        varying vec2 v_TexCoord;\n        void main() {\n          v_TexCoord = a_Pos * vec2(0.5, 0.5) + vec2(0.5, 0.5);\n          gl_Position = vec4(a_Pos, 0.0, 1.0);\n        }\n      ",
                        a = `\n        #define PALETTE_LENGTH ${n.length}\n        #define PALETTE_MAXSIZE 255.0\n        #define PALETTE_TRANSPARENT (PALETTE_MAXSIZE - 1.0) / PALETTE_MAXSIZE\n        #define PALETTE_UNKNOWN 1.0\n      `,
                        i = (e = null) => `\n        precision mediump float;\n        // GLES (and thus WebGL) does not support dynamic for loops\n        // the workaround is to specify the condition as an upper bound\n        // then break the loop early if we reach our dynamic limit \n        #define MAX_SAMPLE_SIZE 16.0\n        \n        ${a}\n        ${null!==e?"#define CONVERT_COLORS":""}\n        #define HIGHEST_DIFF 999999.9\n        uniform sampler2D u_Template;\n        uniform vec2 u_TexelSize;\n        uniform vec2 u_SampleSize;\n        uniform vec3 u_Palette[PALETTE_LENGTH];\n        varying vec2 v_TexCoord;\n        const float epsilon = 1.0 / 128.0;\n        // The alpha channel is used to index the palette: \n        const vec4 transparentColor = vec4(0.0, 0.0, 0.0, PALETTE_TRANSPARENT);\n        \n        #define LUMA_WEIGHTS vec3(0.299, 0.587, 0.114)\n        // a simple custom colorspace that stores:\n        // - brightness\n        // - red/green-ness\n        // - blue/yellow-ness\n        // this storing of contrasts is similar to how humans\n        // see color difference and provides a simple difference function\n        // with decent results.\n        vec3 rgb2Custom(vec3 rgb) {\n          return vec3(\n            length(rgb * LUMA_WEIGHTS),\n            rgb.r - rgb.g,\n            rgb.b - (rgb.r + rgb.g) / 2.0\n          );\n        }\n        float diffCustom(vec3 col1, vec3 col2) {\n          return length(rgb2Custom(col1) - rgb2Custom(col2));\n        }\n      \n        void main () {\n          vec4 color = vec4(0.0);\n          vec2 actualSampleSize = min(u_SampleSize, vec2(MAX_SAMPLE_SIZE));\n          vec2 sampleTexSize = u_TexelSize / actualSampleSize;\n          // sample is taken from center of fragment\n          // this moves the coordinates to the starting corner and to the center of the sample texel\n          vec2 sampleOrigin = v_TexCoord - sampleTexSize * (actualSampleSize / 2.0 - 0.5);\n          float sampleCount = 0.0;\n          for(float x = 0.0; x < MAX_SAMPLE_SIZE; x++) {\n            if(x >= u_SampleSize.x) {\n              break;\n            }\n            for(float y = 0.0; y < MAX_SAMPLE_SIZE; y++) {\n              if(y >= u_SampleSize.y) {\n                break;\n              }\n              vec2 pos = sampleOrigin + sampleTexSize * vec2(x, y);\n              vec4 sample = texture2D(u_Template, pos);\n              // pxlsfiddle uses the alpha channel of the first pixel to store\n              // scale information. This can affect color sampling, so drop the\n              // top-left-most subtexel unless its alpha is typical (1 or 0 exactly).\n              if(x == 0.0 && y == 0.0\n                && pos.x < u_TexelSize.x && (1.0 - pos.y) < u_TexelSize.y\n                && sample.a != 1.0) {\n                continue;\n              }\n              if(sample.a == 0.0) {\n                continue;\n              }\n              color += sample;\n              sampleCount++;\n            }\n          }\n          if(sampleCount == 0.0) {\n            gl_FragColor = transparentColor;\n            return;\n          }\n          color /= sampleCount;\n          #ifdef CONVERT_COLORS\n            float bestDiff = HIGHEST_DIFF;\n            int bestIndex = int(PALETTE_MAXSIZE);\n            vec3 bestColor = vec3(0.0);\n            for(int i = 0; i < PALETTE_LENGTH; i++) {\n              float diff = ${e}(color.rgb, u_Palette[i]);\n              if(diff < bestDiff) {\n                bestDiff = diff;\n                bestIndex = i;\n                bestColor = u_Palette[i];\n              }\n            }\n            gl_FragColor = vec4(bestColor, float(bestIndex) / PALETTE_MAXSIZE);\n          #else\n            for(int i = 0; i < PALETTE_LENGTH; i++) {\n              if(all(lessThan(abs(u_Palette[i] - color.rgb), vec3(epsilon)))) {\n                gl_FragColor = vec4(u_Palette[i], float(i) / PALETTE_MAXSIZE);\n                return;\n              }\n            }\n            gl_FragColor = vec4(color.rgb, PALETTE_UNKNOWN);\n          #endif\n        }\n      `;
                    t.gl.programs.downscaling.unconverted = t.createGlProgram(o, i(null)), t.gl.programs.downscaling.nearestCustom = t.createGlProgram(o, i("diffCustom"));
                    const r = new Float32Array(n.flatMap((e => {
                        return (t = parseInt(e.value, 16), [t >> 16 & 255, t >> 8 & 255, 255 & t]).map((e => e / 255));
                        var t
                    })));
                    for (const e of Object.values(t.gl.programs.downscaling)) {
                        t.gl.context.useProgram(e);
                        const n = t.gl.context.getAttribLocation(e, "a_Pos");
                        t.gl.context.vertexAttribPointer(n, 2, t.gl.context.FLOAT, !1, 0, 0), t.gl.context.enableVertexAttribArray(n), t.gl.context.uniform1i(t.gl.context.getUniformLocation(e, "u_Template"), 0), t.gl.context.uniform3fv(t.gl.context.getUniformLocation(e, "u_Palette"), r)
                    }
                    t.gl.programs.stylize = t.createGlProgram(o, `\n        precision mediump float;\n        #define STYLES_X float(16)\n        #define STYLES_Y float(16)\n        ${a}\n        uniform sampler2D u_Template;\n        uniform sampler2D u_Style;\n        uniform vec2 u_TexelSize;\n        varying vec2 v_TexCoord;\n        const vec2 styleSize = vec2(1.0 / STYLES_X, 1.0 / STYLES_Y);\n        void main () {\n          vec4 templateSample = texture2D(u_Template, v_TexCoord);\n          float index = floor(templateSample.a * PALETTE_MAXSIZE + 0.5);\n          vec2 indexCoord = vec2(mod(index, STYLES_X), STYLES_Y - floor(index / STYLES_Y) - 1.0);\n          vec2 subTexCoord = mod(v_TexCoord, u_TexelSize) / u_TexelSize;\n          vec2 styleCoord = (indexCoord + subTexCoord) * styleSize;\n          \n          vec4 styleMask = vec4(1.0, 1.0, 1.0, texture2D(u_Style, styleCoord).a);\n          gl_FragColor = vec4(templateSample.rgb, templateSample.a == PALETTE_TRANSPARENT ? 0.0 : 1.0) * styleMask;\n        }\n      `), t.gl.context.useProgram(t.gl.programs.stylize);
                    const s = t.gl.context.getAttribLocation(t.gl.programs.stylize, "a_Pos");
                    t.gl.context.vertexAttribPointer(s, 2, t.gl.context.FLOAT, !1, 0, 0), t.gl.context.enableVertexAttribArray(s), t.gl.context.uniform1i(t.gl.context.getUniformLocation(t.gl.programs.stylize, "u_Template"), 0), t.gl.context.uniform1i(t.gl.context.getUniformLocation(t.gl.programs.stylize, "u_Style"), 1)
                },
                createGlProgram: function(e, n) {
                    const o = t.gl.context.createProgram();
                    if (t.gl.context.attachShader(o, t.createGlShader(t.gl.context.VERTEX_SHADER, e)), t.gl.context.attachShader(o, t.createGlShader(t.gl.context.FRAGMENT_SHADER, n)), t.gl.context.linkProgram(o), !t.gl.context.getProgramParameter(o, t.gl.context.LINK_STATUS)) throw new Error("Failed to link WebGL template program:\n\n" + t.gl.context.getProgramInfoLog(o));
                    return o
                },
                createGlShader: function(e, n) {
                    const o = t.gl.context.createShader(e);
                    if (t.gl.context.shaderSource(o, n), t.gl.context.compileShader(o), !t.gl.context.getShaderParameter(o, t.gl.context.COMPILE_STATUS)) throw new Error("Failed to compile WebGL template shader:\n\n" + t.gl.context.getShaderInfoLog(o));
                    return o
                },
                createGlTexture: function() {
                    const e = t.gl.context.createTexture();
                    return t.gl.context.bindTexture(t.gl.context.TEXTURE_2D, e), t.gl.context.texParameteri(t.gl.context.TEXTURE_2D, t.gl.context.TEXTURE_WRAP_S, t.gl.context.CLAMP_TO_EDGE), t.gl.context.texParameteri(t.gl.context.TEXTURE_2D, t.gl.context.TEXTURE_WRAP_T, t.gl.context.CLAMP_TO_EDGE), t.gl.context.texParameteri(t.gl.context.TEXTURE_2D, t.gl.context.TEXTURE_MIN_FILTER, t.gl.context.NEAREST), t.gl.context.texParameteri(t.gl.context.TEXTURE_2D, t.gl.context.TEXTURE_MAG_FILTER, t.gl.context.NEAREST), e
                },
                rasterizeTemplate: function() {
                    t.downscaleTemplate(), t.stylizeTemplate()
                },
                downscaleTemplate: function() {
                    const e = t.getDisplayWidth(),
                        n = t.getDisplayHeight();
                    if (null == t.gl.context || 0 === e || 0 === n) return;
                    t.gl.context.activeTexture(t.gl.context.TEXTURE0), t.gl.context.bindTexture(t.gl.context.TEXTURE_2D, t.gl.textures.downscaled), t.gl.context.texImage2D(t.gl.context.TEXTURE_2D, 0, t.gl.context.RGBA, e, n, 0, t.gl.context.RGBA, t.gl.context.UNSIGNED_BYTE, null), t.gl.context.bindFramebuffer(t.gl.context.FRAMEBUFFER, t.gl.framebuffers.intermediate), t.gl.context.clear(t.gl.context.COLOR_BUFFER_BIT), t.gl.context.viewport(0, 0, e, n);
                    const o = t.gl.programs.downscaling[t.options.convertMode];
                    t.gl.context.useProgram(o), t.gl.context.uniform2f(t.gl.context.getUniformLocation(o, "u_SampleSize"), Math.max(1, t.getDownscaleWidthRatio()), Math.max(1, t.getDownscaleHeightRatio())), t.gl.context.uniform2f(t.gl.context.getUniformLocation(o, "u_TexelSize"), 1 / t.getDisplayWidth(), 1 / t.getDisplayHeight()), t.gl.context.bindTexture(t.gl.context.TEXTURE_2D, t.gl.textures.source);
                    const a = t.elements.sourceImage[0];
                    t.gl.context.texImage2D(t.gl.context.TEXTURE_2D, 0, t.gl.context.RGBA, t.gl.context.RGBA, t.gl.context.UNSIGNED_BYTE, a), t.gl.context.drawArrays(t.gl.context.TRIANGLE_STRIP, 0, 4)
                },
                stylizeTemplate: function() {
                    t.updateSize();
                    const e = t.getInternalWidth(),
                        n = t.getInternalHeight();
                    null != t.gl.context && 0 !== e && 0 !== n && (t.gl.context.bindFramebuffer(t.gl.context.FRAMEBUFFER, t.gl.framebuffers.main), t.gl.context.clear(t.gl.context.COLOR_BUFFER_BIT), t.gl.context.viewport(0, 0, e, n), t.gl.context.useProgram(t.gl.programs.stylize), t.gl.context.uniform2f(t.gl.context.getUniformLocation(t.gl.programs.stylize, "u_TexelSize"), 1 / t.getDisplayWidth(), 1 / t.getDisplayHeight()), t.gl.context.activeTexture(t.gl.context.TEXTURE0), t.gl.context.bindTexture(t.gl.context.TEXTURE_2D, t.gl.textures.downscaled), t.gl.context.activeTexture(t.gl.context.TEXTURE1), t.gl.context.bindTexture(t.gl.context.TEXTURE_2D, t.gl.textures.style), t.gl.context.drawArrays(t.gl.context.TRIANGLE_STRIP, 0, 4))
                }
            };
            return {
                normalizeTemplateObj: t.normalizeTemplateObj,
                update: t._update,
                draw: t.draw,
                init: t.init,
                webinit: t.webinit,
                queueUpdate: t.queueUpdate,
                getOptions: () => t.options,
                setPixelated: t.setPixelated,
                getDisplayWidth: t.getDisplayWidth,
                getDisplayHeight: t.getDisplayHeight,
                getWidthRatio: t.getWidthRatio
            }
        }()
    }, {
        "./board": 5,
        "./query": 18,
        "./settings": 20,
        "./uiHelper": 26
    }],
    24: [function(e, t, n) {
        const {
            settings: o
        } = e("./settings"), {
            nativeNotifications: a
        } = e("./nativeNotifications"), {
            uiHelper: i
        } = e("./uiHelper"), {
            socket: r
        } = e("./socket");
        t.exports.timer = function() {
            const e = {
                elements: {
                    palette: $("#palette"),
                    timer_container: $("#cooldown"),
                    timer_countdown: $("#cooldown-timer"),
                    timer_chat: $("#txtMobileChatCooldown")
                },
                hasFiredNotification: !0,
                cooldown: 0,
                runningTimer: !1,
                audio: new Audio("notify.wav"),
                title: "",
                currentTimer: "",
                cooledDown: function() {
                    return e.cooldown < (new Date).getTime()
                },
                update: function(t) {
                    let n = (e.cooldown - (new Date).getTime() - 1) / 1e3;
                    !1 === e.runningTimer && e.elements.timer_container.hide(), e.status && e.elements.timer_countdown.text(e.status);
                    const r = o.place.alert.delay.get();
                    if (r < 0 && n < Math.abs(r) && !e.hasFiredNotification) {
                        let t;
                        e.playAudio();
                        const o = Math.abs(r);
                        document.hasFocus() || (t = a.maybeShow(`Your next pixel will be available in ${o} seconds!`)), setTimeout((() => {
                            i.setPlaceableText(1), t && $(window).one("pxls:ack:place", (() => t.close()))
                        }), 1e3 * n), e.hasFiredNotification = !0
                    }
                    if (n > 0) {
                        e.elements.timer_container.show(), n++;
                        const o = Math.floor(n % 60),
                            a = o < 10 ? "0" + o : o,
                            r = Math.floor(n / 60),
                            s = r < 10 ? "0" + r : r;
                        if (e.currentTimer = `${s}:${a}`, e.elements.timer_countdown.text(`${e.currentTimer}`), e.elements.timer_chat.text(`(${e.currentTimer})`), document.title = i.getTitle(), e.runningTimer && !t) return;
                        return e.runningTimer = !0, void setTimeout((function() {
                            e.update(!0)
                        }), 1e3)
                    }
                    if (e.runningTimer = !1, e.currentTimer = "", document.title = i.getTitle(), e.elements.timer_container.hide(), e.elements.timer_chat.text(""), r > 0 && !e.hasFiredNotification) return setTimeout((() => {
                        if (!this.runningTimer && (e.playAudio(), !document.hasFocus())) {
                            const e = a.maybeShow(`Your next pixel has been available for ${r} seconds!`);
                            e && $(window).one("pxls:ack:place", (() => e.close()))
                        }
                        e.hasFiredNotification = !0
                    }), 1e3 * r), void setTimeout((() => {
                        i.setPlaceableText(1)
                    }), 1e3 * n);
                    if (!e.hasFiredNotification) {
                        if (e.playAudio(), !document.hasFocus()) {
                            const e = a.maybeShow("Your next pixel is available!");
                            e && $(window).one("pxls:ack:place", (() => e.close()))
                        }
                        i.setPlaceableText(1), e.hasFiredNotification = !0
                    }
                },
                init: function() {
                    e.title = document.title, e.elements.timer_container.hide(), e.elements.timer_chat.text(""), setTimeout((function() {
                        e.cooledDown() && 0 === i.getAvailable() && i.setPlaceableText(1)
                    }), 250), r.on("cooldown", (function(t) {
                        e.cooldown = (new Date).getTime() + 1e3 * t.wait, e.hasFiredNotification = 0 === t.wait, e.update()
                    }))
                },
                playAudio: function() {
                    i.tabHasFocus() && o.audio.enable.get() && e.audio.play()
                },
                getCurrentTimer: function() {
                    return e.currentTimer
                }
            };
            return {
                init: e.init,
                cooledDown: e.cooledDown,
                playAudio: e.playAudio,
                getCurrentTimer: e.getCurrentTimer,
                audioElem: e.audio
            }
        }()
    }, {
        "./nativeNotifications": 13,
        "./settings": 20,
        "./socket": 21,
        "./uiHelper": 26
    }],
    25: [function(e, t, n) {
        t.exports.TH = function() {
            function e(e, t, n = !1, o = 0) {
                this.char = e, this.dbType = t, this.hasPair = n, this.minLength = o
            }

            function t(e, t, n, o) {
                this.start = e, this.end = t, this.trigger = n, this.word = o
            }
            const n = e => e.value;
            return {
                Typeahead: function(n, o = [" "], a = []) {
                    this.triggers = {}, this.triggersCache = [], this.stops = o, this.DBs = a, !Array.isArray(n) && n instanceof e && (n = [n]), n.forEach((e => {
                        this.triggers[e.char] = e, this.triggersCache.includes(e.char) || this.triggersCache.push(e.char)
                    })), this.scan = (e, n) => {
                        const o = new t(0, n.length, null, "");
                        let a = !1,
                            i = !1;
                        for (let t = e - 1; t >= 0; t--) {
                            const e = n.charAt(t);
                            if (this.triggersCache.includes(e)) {
                                if (o.start = t, o.trigger = this.triggers[e], a = !0, i) break;
                                i = !0
                            } else if (this.stops.includes(e)) break
                        }
                        if (a) {
                            for (let t = e; t < n.length; t++) {
                                const e = n.charAt(t);
                                if (this.stops.includes(e)) {
                                    o.end = t;
                                    break
                                }
                            }
                            const t = o.trigger.hasPair && n.charAt(o.end - 1) === o.trigger.char ? o.end - 1 : o.end;
                            o.word = n.substring(o.start + 1, t)
                        }
                        return !!a && (o.word.length >= o.trigger.minLength && o)
                    }, this.suggestions = e => {
                        let t = this.DBs.filter((t => t.name === e.trigger.dbType));
                        return t && t.length ? (t = t[0], t.search(e.word, e.trigger.leftAnchored)) : []
                    }, this.getDatabase = e => {
                        for (const t of this.DBs)
                            if (t.name === e.trim()) return t;
                        return null
                    }
                },
                TriggerMatch: t,
                Trigger: e,
                Database: function(e, t = {}, o = !1, a = !1, i = n, r = n) {
                    this.name = e, this._caseSensitive = o, this.initData = t, this.leftAnchored = a, this.inserter = i, this.renderer = r;
                    const s = e => this._caseSensitive ? e.trim() : e.toLowerCase().trim();
                    this.search = e => (e = s(e), Object.entries(this.initData).filter((t => {
                        const n = s(t[0]);
                        return this.leftAnchored ? n.startsWith(e) : n.includes(e)
                    })).map((e => ({
                        key: e[0],
                        value: e[1]
                    })))), this.addEntry = (e, t) => {
                        e = e.trim(), this.initData[e] = t
                    }, this.removeEntry = (e, t) => {
                        e = e.trim(), delete this.initData[e]
                    }
                }
            }
        }()
    }, {}],
    26: [function(e, t, n) {
        (function(n) {
            (function() {
                const {
                    modal: o
                } = e("./modal"), {
                    settings: a
                } = e("./settings"), {
                    panels: i
                } = e("./panels"), {
                    coords: r
                } = e("./coords"), {
                    socket: s
                } = e("./socket"), {
                    chat: l
                } = e("./chat"), {
                    serviceWorkerHelper: d
                } = e("./serviceworkers"), {
                    template: c
                } = e("./template"), {
                    ls: u,
                    setCookie: p
                } = e("./storage");
                let m, f, h;
                const g = function() {
                    const t = {
                        tabId: null,
                        _workerIsTabFocused: !1,
                        _available: -1,
                        pixelsAvailable: -1,
                        maxStacked: -1,
                        _alertUpdateTimer: !1,
                        initTitle: "",
                        isLoadingBubbleShown: !1,
                        loadingStates: {},
                        banner: {
                            elements: [],
                            curElem: 0,
                            intervalID: 0,
                            timeout: 1e4,
                            enabled: !0
                        },
                        elements: {
                            mainBubble: $("#main-bubble"),
                            loadingBubble: $("#loading-bubble"),
                            stackCount: $("#placeable-count, #placeableCount-cursor"),
                            captchaLoadingIcon: $(".captcha-loading-icon"),
                            coords: $("#coords-info .coords"),
                            lblAlertVolume: $("#lblAlertVolume"),
                            btnForceAudioUpdate: $("#btnForceAudioUpdate"),
                            themeSelect: $("#setting-ui-theme-index"),
                            themeColorMeta: $('meta[name="theme-color"]'),
                            txtDiscordName: $("#txtDiscordName"),
                            bottomBanner: $("#bottom-banner"),
                            dragDropTarget: $("#drag-drop-target"),
                            dragDrop: $("#drag-drop"),
                            dragDropExit: $("#drag-drop-exit")
                        },
                        themes: [{
                            name: "Dark",
                            location: "/themes/dark.css",
                            color: "#1A1A1A"
                        }, {
                            name: "Darker",
                            location: "/themes/darker.css",
                            color: "#000"
                        }, {
                            name: "Blue",
                            location: "/themes/blue.css",
                            color: "#0000FF"
                        }, {
                            name: "Purple",
                            location: "/themes/purple.css",
                            color: "#5a2f71"
                        }, {
                            name: "Green",
                            location: "/themes/green.css",
                            color: "#005f00"
                        }, {
                            name: "Matte",
                            location: "/themes/matte.css",
                            color: "#468079"
                        }, {
                            name: "Terminal",
                            location: "/themes/terminal.css",
                            color: "#94e044"
                        }, {
                            name: "Red",
                            location: "/themes/red.css",
                            color: "#cf0000"
                        }, {
                            name: "Synthwave",
                            location: "/themes/synthwave.css",
                            color: "#1d192c"
                        }],
                        specialChatColorClasses: ["rainbow", ["donator", "donator--green"],
                            ["donator", "donator--gray"],
                            ["donator", "donator--synthwave"],
                            ["donator", "donator--ace"],
                            ["donator", "donator--trans"],
                            ["donator", "donator--bi"],
                            ["donator", "donator--pan"],
                            ["donator", "donator--nonbinary"],
                            ["donator", "donator--mines"],
                            ["donator", "donator--eggplant"],
                            ["donator", "donator--banana"],
                            ["donator", "donator--teal"],
                            ["donator", "donator--icy"],
                            ["donator", "donator--blood"]
                        ],
                        init: function() {
                            m = e("./timer").timer, f = e("./place").place, h = e("./board").board, t.initTitle = document.title, t._initThemes(), t._initStack(), t._initAudio(), t._initAccount(), t._initMultiTabDetection(), t.prettifyRange("input[type=range]"), t.elements.coords.click((() => r.copyCoords(!0))), s.on("alert", (e => {
                                o.show(o.buildDom(crel("h2", {
                                    class: "modal-title"
                                }, "Alert"), crel("p", {
                                    style: "padding: 0; margin: 0;"
                                }, l.processMessage(e.message)), crel("span", `Sent from ${e.sender||"$Unknown"}`)), {
                                    closeExisting: !1
                                })
                            })), s.on("received_report", (e => {
                                const t = e.report_type.toLowerCase();
                                new SLIDEIN.Slidein(`A new ${t} report has been received.`, "info-circle").show().closeAfter(3e3)
                            }));
                            const d = u.get("settings.collapse.states");
                            if (d)
                                for (const [e, t] of Object.entries(d)) t && $(`article[data-id=${e}] > header`).next().addClass("hidden");
                            $("article > header").on("click", (e => {
                                const t = $(e.currentTarget).next(),
                                    n = e.currentTarget.parentNode.dataset.id;
                                if (!n) return t.toggleClass("hidden");
                                let o = u.get("settings.collapse.states");
                                null === o && (o = {});
                                const a = void 0 === o[n] || !o[n];
                                o[n] = a, a ? t.addClass("hidden") : t.removeClass("hidden"), u.set("settings.collapse.states", o)
                            })), $("#lock-button i").toggleClass("fa-lock", a.board.lock.enable.get()).toggleClass("fa-unlock", !a.board.lock.enable.get()), $("#lock-button").on("click", (() => {
                                a.board.lock.enable.toggle()
                            })), a.board.lock.enable.listen((function(e) {
                                $("#lock-button i").toggleClass("fa-lock", e).toggleClass("fa-unlock", !e)
                            })), a.ui.palette.numbers.enable.listen((function(e) {
                                f.setNumberedPaletteEnabled(e)
                            })), a.ui.palette.scrollbar.thin.enable.listen((function(e) {
                                document.querySelector("#palette").classList.toggle("thin-scrollbar", e)
                            })), a.ui.palette.stacking.enable.listen((function(e) {
                                document.querySelector("#palette").classList.toggle("palette-stacking", e)
                            })), a.board.lock.enable.listen((e => h.setAllowDrag(!e))), a.ui.chat.banner.enable.listen((function(e) {
                                t.setBannerEnabled(e)
                            })), a.ui.chat.horizontal.enable.listen((function(e) {
                                const t = document.querySelector('aside.panel[data-panel="chat"]');
                                t && (t.classList.toggle("horizontal", !0 === e), t.classList.contains("open") && document.body.classList.toggle(`panel-${t.classList.contains("right")?"right":"left"}-horizontal`, !0 === e))
                            }));
                            const c = (e, t) => isNaN(e) ? t : e,
                                g = $("<div>").attr("id", "brightness-fixer").addClass("noselect");
                            a.ui.brightness.enable.listen((function(e) {
                                e ? (a.ui.brightness.value.controls.enable(), $("#board-mover").prepend(g)) : (a.ui.brightness.value.controls.disable(), g.remove()), t.adjustColorBrightness(e ? c(parseFloat(a.ui.brightness.value.get()), 1) : null)
                            })), a.ui.brightness.value.listen((function(e) {
                                if (!0 === a.ui.brightness.enable.get()) {
                                    const n = c(parseFloat(e), 1);
                                    t.adjustColorBrightness(n)
                                }
                            })), a.ui.bubble.position.listen((function(e) {
                                t.elements.mainBubble.attr("position", e)
                            })), $("#setting-ui-bubble-compact").on("click", a.ui.bubble.compact.toggle), a.ui.bubble.compact.listen((function(e) {
                                t.elements.mainBubble.toggleClass("compact", e)
                            })), a.ui.reticule.enable.listen((function(e) {
                                f.toggleReticule(e && -1 !== f.color)
                            })), a.ui.cursor.enable.listen((function(e) {
                                f.toggleCursor(e && -1 !== f.color)
                            }));
                            let b = null;
                            a.ui.language.override.listen((function(e) {
                                null !== b && b !== e ? (e ? p("pxls-accept-language-override", e) : p("pxls-accept-language-override", null, -1), window.location.reload()) : b = e
                            })), $(window).keydown((e => {
                                if (!["INPUT", "TEXTAREA"].includes(e.target.nodeName)) switch (e.key || e.which) {
                                    case "Escape":
                                    case 27: {
                                        const e = $("#lookup, #prompt, #alert, .popup"),
                                            t = $(".panel.open");
                                        e.is(":visible") ? e.fadeOut(200) : t.length ? t.each(((e, t) => i.close(t))) : f.switch(-1);
                                        break
                                    }
                                }
                            }));
                            const y = document.querySelector('.panel[data-panel="info"]');
                            if (y.classList.contains("open")) y.querySelectorAll("iframe[data-lazysrc]").forEach((e => {
                                e.src = e.dataset.lazysrc, delete e.dataset.lazysrc
                            }));
                            else {
                                const e = (t, n) => {
                                    if ("info" === n) {
                                        const t = document.querySelectorAll("iframe[data-lazysrc]");
                                        t && t.length && t.forEach((e => {
                                            e.src = e.dataset.lazysrc, delete e.dataset.lazysrc
                                        })), $(window).off("pxls:panel:opened", e)
                                    }
                                };
                                $(window).on("pxls:panel:opened", e)
                            }
                            t.elements.dragDropTarget.hide(), t.elements.dragDrop.hide(), document.addEventListener("dragover", (e => e.preventDefault()), !1), document.addEventListener("dragenter", (e => {
                                e.preventDefault(), t.elements.dragDropTarget.is(":visible") || (t.elements.dragDropTarget.show(), t.elements.dragDrop.fadeIn(200))
                            }), !1), document.addEventListener("dragleave", (e => {
                                e.preventDefault(), t.elements.dragDropTarget.is(e.target) && (t.elements.dragDropTarget.hide(), t.elements.dragDrop.fadeOut(200))
                            }), !1), document.addEventListener("drop", (async e => {
                                e.preventDefault(), t.elements.dragDropTarget.hide(), t.elements.dragDrop.fadeOut(200);
                                const a = e.dataTransfer;
                                let i;
                                if (a.types.includes("Files")) {
                                    const e = a.files[0];
                                    i = await new Promise((t => {
                                        const o = new FileReader;
                                        o.onload = () => {
                                            if (o.result.startsWith("data:application/octet-stream")) {
                                                const e = n.from(o.result.split(",")[1], "base64"),
                                                    a = String.fromCharCode.apply(null, e);
                                                t(a.split("URL=")[1].trim())
                                            }
                                            t(o.result)
                                        }, o.readAsDataURL(e)
                                    }))
                                } else {
                                    if (0 === a.types.length) return;
                                    i = a.getData("text/plain")
                                }
                                if (i.startsWith("file:")) o.showText("Cannot fetch local files. Use the file selector in template settings.");
                                else if (i.startsWith(window.location.origin)) o.show(o.buildDom(crel("h2", {
                                    class: "modal-title"
                                }, "Redirect Warning"), crel("div", crel("p", "Are you sure you want to redirect to the following URL?"), crel("p", {
                                    style: "font-family: monospace; max-width: 50vw;"
                                }, i), crel("div", {
                                    class: "buttons"
                                }, crel("button", {
                                    class: "dangerous-button text-button",
                                    onclick: () => {
                                        window.location.href = i, o.closeAll()
                                    }
                                }, "Yes"), crel("button", {
                                    class: "text-button",
                                    onclick: () => o.closeAll()
                                }, "No")))));
                                else {
                                    if (i.startsWith("data:")) {
                                        const e = i.substring(5, i.indexOf(";"));
                                        if (!["image/png", "image/jpeg", "image/webp"].includes(e)) return void o.showText("Drag and dropped file must be a valid image.")
                                    }
                                    t.handleFileUrl(i)
                                }
                            }), !1), t.elements.dragDropExit.click((() => {
                                t.elements.dragDropTarget.hide(), t.elements.dragDrop.fadeOut(200)
                            }))
                        },
                        prettifyRange: function(e) {
                            function t(e) {
                                var t = e.min,
                                    n = e.max,
                                    o = e.value;
                                $(e).css({
                                    backgroundSize: 100 * (o - t) / (n - t) + "% 100%"
                                })
                            }(e = $(e)).on("input", (e => t(e.target))), e.each(((e, n) => t(n)))
                        },
                        _initThemes: function() {
                            for (let e = 0; e < t.themes.length; e++) t.themes[e].element = $('<link data-theme="' + e + '" rel="stylesheet" href="' + t.themes[e].location + '">'), t.themes[e].loaded = !1, t.elements.themeSelect.append($("<option>", {
                                value: e,
                                text: t.themes[e].name
                            }));
                            a.ui.theme.index.set(a.ui.theme.index.get()), a.ui.theme.index.listen((async function(e) {
                                await t.loadTheme(parseInt(e))
                            }))
                        },
                        _initStack: function() {
                            s.on("pixels", (function(e) {
                                t.updateAvailable(e.count, e.cause)
                            }))
                        },
                        _initAudio: function() {
                            m.audioElem.addEventListener("error", (e => {
                                console.warn && console.warn("An error occurred on the audioElem node: %o", e)
                            })), a.audio.alert.src.listen((function(e) {
                                !1 !== t._alertUpdateTimer && clearTimeout(t._alertUpdateTimer), t._alertUpdateTimer = setTimeout((function(e) {
                                    t.updateAudio(e), t._alertUpdateTimer = !1
                                }), 250, e)
                            })), t.elements.btnForceAudioUpdate.click((() => a.audio.alert.src.set(a.audio.alert.src.get()))), a.audio.alert.volume.listen((function(e) {
                                const n = parseFloat(e),
                                    o = isNaN(n) ? 1 : n;
                                t.elements.lblAlertVolume.text((100 * o >> 0) + "%"), m.audioElem.volume = o
                            })), $("#btnAlertAudioTest").click((() => m.audioElem.play())), $("#btnAlertReset").click((() => {
                                t.updateAudio("notify.wav"), a.audio.alert.src.reset()
                            }))
                        },
                        _initAccount: function() {
                            t.elements.txtDiscordName.keydown((function(e) {
                                "Enter" !== e.key && 13 !== e.which || t.handleDiscordNameSet(), e.stopPropagation()
                            })), $("#btnDiscordNameSet").click((() => {
                                t.handleDiscordNameSet()
                            })), $("#btnDiscordNameRemove").click((() => {
                                t.setDiscordName(""), t.handleDiscordNameSet()
                            }))
                        },
                        initBanner(e) {
                            t.banner.enabled = !1 !== a.ui.chat.banner.enable.get();
                            const n = g.makeMarkdownProcessor({
                                inline: ["coordinate", "emoji_raw", "emoji_name", "mention", "escape", "autoLink", "link", "url", "underline", "strong", "emphasis", "deletion", "code", "fontAwesomeIcon"]
                            });
                            t.banner.elements = [];
                            for (const o in e) try {
                                const a = n.processSync(e[o]);
                                t.banner.elements.push(a.result)
                            } catch (e) {
                                console.error(`Failed to parse chat banner text at index ${o}:`, e)
                            }
                            t._bannerIntervalTick()
                        },
                        _initMultiTabDetection() {
                            let e;
                            if (d.hasSupport) d.addMessageListener("request-id", (({
                                source: e,
                                data: n
                            }) => {
                                t.tabId = n.id, document.hasFocus() && e.postMessage({
                                    type: "focus"
                                })
                            })), d.addMessageListener("focus", (({
                                data: e
                            }) => {
                                t._workerIsTabFocused = t.tabId === e.id
                            })), d.readyPromise.then((async () => {
                                d.postMessage({
                                    type: "request-id"
                                })
                            })).catch((() => {
                                t.tabHasFocus = !0
                            })), window.addEventListener("focus", (() => {
                                d.postMessage({
                                    type: "focus"
                                })
                            })), e = () => d.postMessage({
                                type: "leave"
                            });
                            else {
                                const n = u.get("tabs.open") || [];
                                for (; null == t.tabId || n.includes(t.tabId);) t.tabId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                n.push(t.tabId), u.set("tabs.open", n);
                                const o = () => u.set("tabs.has-focus", t.tabId);
                                document.hasFocus() && o(), window.addEventListener("focus", o), e = () => {
                                    const e = u.get("tabs.open") || [];
                                    e.splice(e.indexOf(t.tabId), 1), u.set("tabs.open", e)
                                }
                            }
                            if (e) {
                                let t = !1;
                                const n = () => {
                                    t || (t = !0, e())
                                };
                                window.addEventListener("beforeunload", n, !1), window.addEventListener("unload", n, !1)
                            }
                        },
                        _setBannerElems(e) {
                            const n = t.elements.bottomBanner[0];
                            for (; n.lastChild;) n.removeChild(n.lastChild);
                            n.append(...e)
                        },
                        _bannerIntervalTick() {
                            const e = t.banner.elements[t.banner.curElem++ % t.banner.elements.length >> 0];
                            if (!e) return;
                            const n = t.elements.bottomBanner[0],
                                o = function() {
                                    t.banner.enabled ? (n.classList.add("transparent"), n.removeEventListener("animationend", o), requestAnimationFrame((() => {
                                        n.classList.remove("fade"), t._setBannerElems(e), requestAnimationFrame((() => {
                                            n.classList.add("fade-rev"), n.addEventListener("animationend", a)
                                        }))
                                    }))) : t.resetBanner()
                                },
                                a = function() {
                                    t.banner.enabled ? (n.removeEventListener("animationend", a), n.classList.remove("transparent", "fade-rev"), setTimeout((() => t._bannerIntervalTick()), t.banner.timeout)) : t.resetBanner()
                                };
                            t.banner.enabled ? requestAnimationFrame((() => {
                                n.addEventListener("animationend", o), n.classList.add("fade")
                            })) : t.resetBanner()
                        },
                        resetBanner: () => {
                            t.banner.curElem = 1, t._setBannerElems(t.banner.elements[0] || []), t.elements.bottomBanner[0].classList.remove("transparent", "fade", "fade-rev")
                        },
                        setBannerEnabled: e => {
                            t.banner.enabled = !0 === e, e ? t._bannerIntervalTick() : t.resetBanner()
                        },
                        handleDiscordNameSet() {
                            const e = t.elements.txtDiscordName.val();
                            $.post({
                                type: "POST",
                                url: "/setDiscordName",
                                data: {
                                    discordName: e
                                },
                                success: function() {
                                    o.showText("Discord name updated successfully")
                                },
                                error: function(e) {
                                    const t = e.responseJSON && e.responseJSON.details ? e.responseJSON.details : e.responseText;
                                    200 === e.status ? o.showText(t) : o.showText("Couldn't change discord name: " + t)
                                }
                            })
                        },
                        updateAudio: function(e) {
                            try {
                                e || (e = "notify.wav"), m.audioElem.src = e
                            } catch (e) {
                                o.showText(__("Failed to update audio src, using default sound.")), m.audioElem.src = "notify.wav"
                            }
                        },
                        updateAvailable: function(e, n) {
                            e > 0 && "stackGain" === n && m.playAudio(), t.setPlaceableText(e)
                        },
                        setMax(e) {
                            t.maxStacked = e + 1
                        },
                        setPlaceableText(e) {
                            t.elements.stackCount.text(`${e}/${t.maxStacked}`), t.pixelsAvailable = e, document.title = g.getTitle()
                        },
                        setDiscordName(e) {
                            t.elements.txtDiscordName.val(e)
                        },
                        adjustColorBrightness(e) {
                            $(["#board-container", "#cursor", "#reticule", "#palette .palette-color"].join(", ")).css("filter", null != e ? `brightness(${e})` : "")
                        },
                        getAvailable: () => t._available,
                        styleElemWithChatNameColor: (e, n, o = "bg") => {
                            if (e.classList.remove(...t.specialChatColorClasses.reduce(((e, t) => (e.push(...Array.isArray(t) ? t : [t]), e)), [])), n >= 0) switch (o) {
                                case "bg":
                                    e.style.backgroundColor = `#${f.getPaletteColorValue(n)}`;
                                    break;
                                case "color":
                                    e.style.color = `#${f.getPaletteColorValue(n)}`
                            } else {
                                e.style.backgroundColor = null, e.style.color = null;
                                const o = t.specialChatColorClasses[-n - 1];
                                e.classList.add(...Array.isArray(o) ? o : [o])
                            }
                        },
                        setLoadingBubbleState: (e, n) => {
                            t.loadingStates[e] = n;
                            const o = t.elements.loadingBubble.children(`.loading-bubble-item[data-process="${e}"]`),
                                a = Object.values(t.loadingStates).some((e => e));
                            a && !t.isLoadingBubbleShown ? (o.show(), t.elements.loadingBubble.fadeIn(300), t.isLoadingBubbleShown = !0) : !a && t.isLoadingBubbleShown ? (t.elements.loadingBubble.fadeOut(300, (() => o.hide())), t.isLoadingBubbleShown = !1) : o.toggle(n)
                        },
                        toggleCaptchaLoading: e => {
                            t.elements.captchaLoadingIcon.css("display", e ? "inline-block" : "none")
                        },
                        loadTheme: async e => {
                            if (-1 === e) return void t.enableTheme(-1);
                            if (!(e in t.themes)) return console.warn(`Tried to load invalid theme "${e}"`);
                            const n = t.themes[e];
                            n.loaded ? t.enableTheme(e) : await new Promise(((o, a) => {
                                n.element.one("load", (() => {
                                    n.loaded || (n.loaded = !0, t.enableTheme(e)), o()
                                })), n.element.appendTo(document.head)
                            }))
                        },
                        enableTheme: e => {
                            if (-1 === e) t.elements.themeColorMeta.attr("content", null);
                            else {
                                if (!(e in t.themes)) return console.warn(`Tried to enable invalid theme "${e}"`);
                                const n = t.themes[e];
                                n.element.prop("disabled", !1), t.elements.themeColorMeta.attr("content", n.color)
                            }
                            $(`*[data-theme]:not([data-theme=${e}])`).prop("disabled", !0)
                        },
                        makeMarkdownProcessor: (e = {}) => (e = {
                            block: e && e.block || ["blankLine"],
                            inline: e && e.inline || ["coordinate", "emoji_raw", "emoji_name", "mention", "escape", "autoLink", "url", "underline", "strong", "emphasis", "deletion", "code"]
                        }, pxlsMarkdown.processor().use(pxlsMarkdown.plugins.emoji, {
                            emojiDB: window.emojiDB,
                            emojiRegex: /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/
                        }).use(pxlsMarkdown.plugins.methodWhitelist, e).use((function() {
                            this.Compiler.prototype.visitors.emoji = (e, t) => {
                                if (twemoji.test(e.value)) {
                                    const t = twemoji.parse(crel("span", e.value)).children[0];
                                    return t.title = `:${e.emojiName}:`, t
                                }
                                return crel("img", {
                                    draggable: !1,
                                    class: "emoji emoji--custom",
                                    alt: `:${e.emojiName}:`,
                                    src: e.value,
                                    title: `:${e.emojiName}:`
                                })
                            }
                        }))),
                        handleFile(e) {
                            const n = new FileReader;
                            n.onload = () => t.handleFileUrl(n.result), n.readAsDataURL(e.files[0])
                        },
                        handleFileUrl(e) {
                            c.update({
                                use: !0,
                                url: e,
                                convertMode: "nearestCustom"
                            })
                        }
                    };
                    return {
                        init: t.init,
                        initBanner: t.initBanner,
                        updateTimer: t.updateTimer,
                        updateAvailable: t.updateAvailable,
                        getAvailable: t.getAvailable,
                        setPlaceableText: t.setPlaceableText,
                        setMax: t.setMax,
                        setDiscordName: t.setDiscordName,
                        updateAudio: t.updateAudio,
                        styleElemWithChatNameColor: t.styleElemWithChatNameColor,
                        setBannerEnabled: t.setBannerEnabled,
                        get initTitle() {
                            return t.initTitle
                        },
                        getTitle: e => {
                            "string" != typeof e && (e = t.pixelsAvailable > 0 ? `[${t.pixelsAvailable}/${t.maxStacked}]` : 0 === t.pixelsAvailable ? `[${m.getCurrentTimer()}]` : "");
                            const n = c.getOptions();
                            let o = t.initTitle;
                            return n.use && n.title && (o = n.title), `${e?e+" ":""}${decodeURIComponent(o)}`
                        },
                        setLoadingBubbleState: t.setLoadingBubbleState,
                        makeMarkdownProcessor: t.makeMarkdownProcessor,
                        toggleCaptchaLoading: t.toggleCaptchaLoading,
                        get tabId() {
                            return t.tabId
                        },
                        tabHasFocus: () => d.hasSupport ? t._workerIsTabFocused : u.get("tabs.has-focus") === t.tabId,
                        prettifyRange: t.prettifyRange,
                        handleFile: t.handleFile
                    }
                }();
                t.exports.uiHelper = g
            }).call(this)
        }).call(this, e("buffer").Buffer)
    }, {
        "./board": 5,
        "./chat": 6,
        "./coords": 8,
        "./modal": 12,
        "./panels": 16,
        "./place": 17,
        "./serviceworkers": 19,
        "./settings": 20,
        "./socket": 21,
        "./storage": 22,
        "./template": 23,
        "./timer": 24,
        buffer: 2
    }],
    27: [function(e, t, n) {
        const {
            ls: o
        } = e("./storage"), {
            socket: a
        } = e("./socket"), {
            modal: i
        } = e("./modal"), {
            place: r
        } = e("./place"), {
            chat: s
        } = e("./chat"), {
            uiHelper: l
        } = e("./uiHelper"), {
            lookup: d
        } = e("./lookup"), {
            ban: c
        } = e("./ban"), {
            analytics: u
        } = e("./helpers"), p = function() {
            const e = {
                instaban: !1,
                elements: {
                    users: $("#online-count"),
                    userInfo: $("#user-info"),
                    pixelCounts: $("#pixel-counts"),
                    loginOverlay: $("#login-overlay"),
                    userMessage: $("#user-message"),
                    prompt: $("#prompt"),
                    signup: $("#signup")
                },
                roles: [],
                pendingSignupToken: null,
                loggedIn: !1,
                username: "",
                placementOverrides: null,
                chatNameColor: 0,
                getRoles: () => e.roles,
                isStaff: () => e.hasPermission("user.admin"),
                isDonator: () => e.hasPermission("user.donator"),
                getPermissions: () => {
                    let t = [];
                    return e.roles.flatMap((function e(n) {
                        if (n.inherits.length > 0) return t.push(...n.permissions), n.inherits.flatMap(e);
                        t.push(n.permissions)
                    })), t = t.flatMap((e => e)), [...new Set(t)]
                },
                hasPermission: t => e.getPermissions().includes(t),
                getUsername: () => e.username,
                getPixelCount: () => e.pixelCount,
                getPixelCountAllTime: () => e.pixelCountAllTime,
                signin: function() {
                    const t = o.get("auth_respond");
                    t && (o.remove("auth_respond"), t.signup ? (e.pendingSignupToken = t.token, e.elements.signup.fadeIn(200)) : a.reconnectSocket(), e.elements.prompt.fadeOut(200))
                },
                isLoggedIn: function() {
                    return e.loggedIn
                },
                webinit: function(t) {
                    e.elements.loginOverlay.find("a").click((function(n) {
                        n.preventDefault();
                        const a = crel("button", {
                            class: "float-right text-button"
                        }, "Cancel");
                        a.addEventListener("click", (function() {
                            e.elements.prompt.fadeOut(200)
                        })), e.elements.prompt[0].innerHTML = "", crel(e.elements.prompt[0], crel("div", {
                            class: "content"
                        }, crel("h1", "Sign in with..."), crel("ul", Object.values(t.authServices).map((e => {
                            const t = crel("a", {
                                href: `/signin/${e.id}?redirect=1`
                            }, e.name);
                            t.addEventListener("click", (function(e) {
                                window.open(this.href, "_blank") ? e.preventDefault() : o.set("auth_same_window", !0)
                            }));
                            const n = crel("li", t);
                            return e.registrationEnabled || crel(n, crel("span", {
                                style: "font-style: italic; font-size: .75em; font-weight: bold; color: red; margin-left: .5em"
                            }, "New Accounts Disabled")), n
                        })))), a), e.elements.prompt.fadeIn(200)
                    }))
                },
                wsinit: function() {
                    o.get("auth_proceed") && (o.remove("auth_proceed"), e.signin())
                },
                doSignup: function() {
                    e.pendingSignupToken && $.post({
                        type: "POST",
                        url: "/signup",
                        data: {
                            token: e.pendingSignupToken,
                            username: e.elements.signup.find("#signup-username-input").val(),
                            discord: e.elements.signup.find("#signup-discord-input").val()
                        },
                        success: function() {
                            e.elements.signup.find("#error").text(""), e.elements.signup.find("#signup-username-input").val(""), e.elements.signup.find("#signup-discord-input").val(""), e.elements.signup.fadeOut(200), a.reconnectSocket(), e.pendingSignupToken = null
                        },
                        error: function(t) {
                            e.elements.signup.find("#error").text(t.responseJSON.message)
                        }
                    })
                },
                doSignOut: function() {
                    return fetch("/logout").then((() => {
                        e.elements.userInfo.fadeOut(200), e.elements.pixelCounts.fadeOut(200), e.elements.userMessage.fadeOut(200), e.elements.loginOverlay.fadeIn(200), window.deInitAdmin && window.deInitAdmin(), e.loggedIn = !1, $(window).trigger("pxls:user:loginState", [!1]), a.reconnectSocket()
                    }))
                },
                init: function(t) {
                    e.instaban = t, e.elements.userMessage.hide(), e.elements.signup.hide(), e.elements.signup.find("input").keydown((function(t) {
                        t.stopPropagation(), "Enter" !== t.key && 13 !== t.which || e.doSignup()
                    })), e.elements.signup.find("#signup-button").click(e.doSignup), $.get("/users", (t => {
                        e.elements.users.text(t.count + " online").fadeIn(200)
                    })).fail((function(t) {
                        console.error("Error fetching /users: ", t), e.elements.users.hide()
                    })), e.elements.pixelCounts.hide(), e.elements.userInfo.hide(), e.elements.userInfo.find(".logout").click((function(t) {
                        t.preventDefault(), i.show(i.buildDom(crel("h2", {
                            class: "modal-title"
                        }, "Sign Out"), crel("div", crel("p", "Are you sure you want to sign out?"), crel("div", {
                            class: "buttons"
                        }, crel("button", {
                            class: "dangerous-button text-button",
                            onclick: () => e.doSignOut().then((() => i.closeAll()))
                        }, "Yes"), crel("button", {
                            class: "text-button",
                            onclick: () => i.closeAll()
                        }, "No")))))
                    })), $(window).bind("storage", (function(t) {
                        "auth" === t.originalEvent.key && (o.remove("auth"), e.signin())
                    })), a.on("users", (function(t) {
                        e.elements.users.text(t.count + " online")
                    })), a.on("userinfo", (function(t) {
                        let n = !1;
                        const o = crel("div", {
                            class: "ban-alert-content"
                        });
                        if (e.username = t.username, e.loggedIn = !0, e.pixelCount = t.pixelCount, e.pixelCountAllTime = t.pixelCountAllTime, e.updatePixelCountElements(), e.elements.pixelCounts.fadeIn(200), e.placementOverrides = t.placementOverrides, r.togglePaletteSpecialColors(t.placementOverrides.canPlaceAnyColor), e.chatNameColor = t.chatNameColor, s.updateSelectedNameColor(t.chatNameColor), e.roles = t.roles, $(window).trigger("pxls:user:loginState", [!0]), e.renameRequested = t.renameRequested, l.setDiscordName(t.discordName || null), e.elements.loginOverlay.fadeOut(200), e.elements.userInfo.find("span#username").html(crel("a", {
                                href: `/profile/${t.username}`,
                                target: "_blank",
                                title: "My Profile"
                            }, t.username).outerHTML), "ip" === t.method ? e.elements.userInfo.hide() : e.elements.userInfo.fadeIn(200), 0 === t.banExpiry) n = !0, crel(o, crel("p", "You are permanently banned."));
                        else if (!0 === t.banned) {
                            n = !0;
                            const e = new Date(t.banExpiry).toLocaleString();
                            crel(o, crel("p", `You are temporarily banned and will not be allowed to place until ${e}`))
                        } else if (e.isStaff()) {
                            window.deInitAdmin && window.deInitAdmin();
                            let t = "admin";
                            const n = document.documentElement.lang;
                            "en" !== n && (t += "_" + n), $.getScript(`admin/${t}.js`).done((function() {
                                window.initAdmin({
                                    socket: a,
                                    user: p,
                                    modal: i,
                                    lookup: d,
                                    chat: s
                                }, (t => {
                                    e.admin = t
                                }))
                            }))
                        } else window.deInitAdmin && window.deInitAdmin();
                        n ? (e.elements.userMessage.empty().show().text("You can contact us using one of the links in the info menu.").fadeIn(200), crel(o, crel("p", "If you think this was an error, please contact us using one of the links in the info tab."), crel("p", "Ban reason:"), crel("p", t.banReason)), i.show(i.buildDom(crel("h2", "Banned"), o), {
                            escapeClose: !1,
                            clickClose: !1
                        }), window.deInitAdmin && window.deInitAdmin()) : t.renameRequested ? e.showRenameRequest() : e.elements.userMessage.hide(), s.updateCanvasBanState(n), e.instaban && c.shadow("App existed beforehand"), u("send", "event", "Auth", "Login", t.method)
                    })), a.on("pixelCounts", (function(t) {
                        e.pixelCount = t.pixelCount, e.pixelCountAllTime = t.pixelCountAllTime, e.updatePixelCountElements(), $(window).trigger("pxls:pixelCounts:update", Object.assign({}, t))
                    })), a.on("admin_placement_overrides", (function(t) {
                        e.placementOverrides = t.placementOverrides
                    })), a.on("rename", (function(t) {
                        !0 === t.requested ? e.showRenameRequest() : e.hideRenameRequest()
                    })), a.on("rename_success", (t => {
                        e.username = t.newName, e.elements.userInfo.find("span.name").text(t.newName)
                    }))
                },
                _handleRenameSubmit: function(t) {
                    t.preventDefault();
                    const n = this.querySelector(".rename-input"),
                        o = this.querySelector(".rename-submit"),
                        a = this.querySelector(".rename-error");
                    if (!(n && n.value && o && a)) return console.error("Missing one or more variables from querySelector. input: %o, btn: %o, err: %o", n, o, a);
                    n.disabled = o.disabled = !0, $.post("/execNameChange", {
                        newName: n.value.trim()
                    }, (function() {
                        e.renameRequested = !1, e.hideRenameRequest(), i.closeAll()
                    })).fail((function(e) {
                        let t = "An unknown error occurred. Please contact staff on discord";
                        if (e.responseJSON) t = e.responseJSON.details || t;
                        else if (e.responseText) try {
                            t = JSON.parse(e.responseText).details
                        } catch (e) {}
                        a.style.display = null, a.innerHTML = t
                    })).always((function() {
                        n.disabled = o.disabled = !1
                    }))
                },
                _handleRenameClick: function(t) {
                    const n = crel("form", {
                        onsubmit: e._handleRenameSubmit
                    }, crel("p", "Staff have required you to change your username, this usually means your name breaks one of our rules."), crel("p", "If you disagree, please contact us on Discord (link in the info panel)."), crel("label", "New Username: ", crel("input", {
                        type: "text",
                        class: "rename-input",
                        required: "true",
                        onkeydown: e => e.stopPropagation()
                    })), crel("p", {
                        style: "display: none; font-weight: bold; color: #f00; font-size: .9rem;",
                        class: "rename-error"
                    }, ""), crel("div", {
                        style: "text-align: right"
                    }, crel("button", {
                        class: "text-button",
                        onclick: () => i.closeAll()
                    }, "Not now"), crel("button", {
                        class: "rename-submit text-button",
                        type: "submit"
                    }, "Change")));
                    i.show(i.buildDom(crel("h2", {
                        class: "modal-title"
                    }, "Rename Requested"), n))
                },
                showRenameRequest: () => {
                    e.elements.userMessage.empty().show().append(crel("span", "You must change your username. ", crel("span", {
                        style: "cursor: pointer; text-decoration: underline;",
                        onclick: e._handleRenameClick
                    }, "Click here to continue."))).fadeIn(200)
                },
                hideRenameRequest: () => {
                    e.elements.userMessage.fadeOut(200)
                },
                updatePixelCountElements: () => {
                    e.elements.pixelCounts.find("#current-pixel-count").text(e.pixelCount.toLocaleString()), e.elements.pixelCounts.find("#alltime-pixel-count").text(e.pixelCountAllTime.toLocaleString())
                }
            };
            return {
                init: e.init,
                getRoles: e.getRoles,
                isStaff: e.isStaff,
                isDonator: e.isDonator,
                getPermissions: e.getPermissions,
                hasPermission: e.hasPermission,
                getUsername: e.getUsername,
                getPixelCount: e.getPixelCount,
                getPixelCountAllTime: e.getPixelCountAllTime,
                webinit: e.webinit,
                wsinit: e.wsinit,
                isLoggedIn: e.isLoggedIn,
                renameRequested: e.renameRequested,
                showRenameRequest: e.showRenameRequest,
                hideRenameRequest: e.hideRenameRequest,
                getChatNameColor: () => e.chatNameColor,
                setChatNameColor: t => {
                    e.chatNameColor = t
                },
                get admin() {
                    return e.admin || !1
                },
                get placementOverrides() {
                    return e.placementOverrides
                }
            }
        }();
        t.exports.user = p
    }, {
        "./ban": 4,
        "./chat": 6,
        "./helpers": 10,
        "./lookup": 11,
        "./modal": 12,
        "./place": 17,
        "./socket": 21,
        "./storage": 22,
        "./uiHelper": 26
    }],
    28: [function(e, t, n) {
        "use strict";
        crel.attrMap.onmousemiddledown = function(e, t) {
            e.addEventListener("mousedown", (function(e) {
                1 === e.button && t.call(this, e)
            }))
        }, crel.attrMap.dataset = function(e, t) {
            for (const n in t) t[n] && (e.dataset[n] = t[n])
        };
        let o = !1;
        void 0 !== window.App && (o = !0), window.__ = e => e, window.App = function() {
            const {
                ls: t,
                ss: n
            } = e("./include/storage"), {
                TH: a
            } = e("./include/typeahead"), {
                settings: i
            } = e("./include/settings"), {
                query: r
            } = e("./include/query"), {
                ban: s
            } = e("./include/ban"), {
                board: l
            } = e("./include/board"), {
                overlays: d
            } = e("./include/overlays"), {
                template: c
            } = e("./include/template"), {
                grid: u
            } = e("./include/grid"), {
                place: p
            } = e("./include/place"), {
                lookup: m
            } = e("./include/lookup"), {
                serviceWorkerHelper: f
            } = e("./include/serviceworkers"), {
                uiHelper: h
            } = e("./include/uiHelper"), {
                panels: g
            } = e("./include/panels"), {
                chat: b
            } = e("./include/chat"), {
                timer: y
            } = e("./include/timer"), {
                coords: w
            } = e("./include/coords"), {
                user: v
            } = e("./include/user"), {
                nativeNotifications: x
            } = e("./include/nativeNotifications"), {
                notifications: _
            } = e("./include/notifications"), {
                chromeOffsetWorkaround: k
            } = e("./include/chromeOffsetWorkaround"), {
                modal: T
            } = e("./include/modal");
            return r.init(), l.init(), c.init(), s.init(), u.init(), p.init(), y.init(), f.init(), h.init(), g.init(), w.init(), v.init(o), x.init(), _.init(), b.init(), k.init(), l.start(), console.info("%cHey, be careful!", "color: red; font-size: 24px;"), console.info("%cIt's safer to close this unless you KNOW what you're doing.", "font-size: 16px;"), console.info("%cDeveloper documentation can be found here: https://github.com/pxlsspace/Pxls/blob/master/developer.md", "font-size: 14px;"), window.TH = window.TH || a, {
                ls: t,
                ss: n,
                settings: i,
                query: r,
                overlays: {
                    add: d.add,
                    remove: d.remove,
                    get heatmap() {
                        return {
                            clear: d.heatmap.clear,
                            reload: d.heatmap.reload
                        }
                    },
                    get heatbackground() {
                        return {
                            reload: d.heatbackground.reload
                        }
                    },
                    get virginmap() {
                        return {
                            clear: d.virginmap.clear,
                            reload: d.virginmap.reload
                        }
                    },
                    get virginbackground() {
                        return {
                            reload: d.virginbackground.reload
                        }
                    }
                },
                uiHelper: {
                    get tabId() {
                        return h.tabId
                    },
                    tabHasFocus: h.tabHasFocus,
                    updateAudio: h.updateAudio,
                    handleFile: h.handleFile
                },
                template: {
                    update: function(e) {
                        c.queueUpdate(e)
                    },
                    normalize: function(e, t = !0) {
                        return c.normalizeTemplateObj(e, t)
                    }
                },
                lookup: {
                    registerHook: function() {
                        return m.registerHook(...arguments)
                    },
                    replaceHook: function() {
                        return m.replaceHook(...arguments)
                    },
                    unregisterHook: function() {
                        return m.unregisterHook(...arguments)
                    }
                },
                centerBoardOn: function(e, t) {
                    l.centerOn(e, t)
                },
                updateTemplate: function(e) {
                    c.queueUpdate(e)
                },
                alert: function(e) {
                    T.showText(e, {
                        title: "Alert",
                        modalOpts: {
                            closeExisting: !1
                        }
                    })
                },
                doPlace: function() {
                    s.me("call to doPlace()")
                },
                attemptPlace: function() {
                    s.me("call to attemptPlace()")
                },
                chat: b,
                typeahead: b.typeahead,
                user: {
                    getUsername: v.getUsername,
                    getPixelCount: v.getPixelCount,
                    getPixelCountAllTime: v.getPixelCountAllTime,
                    getRoles: v.getRoles,
                    isLoggedIn: v.isLoggedIn,
                    isStaff: v.isStaff,
                    isDonator: v.isDonator,
                    getPermissions: v.getPermissions,
                    hasPermission: v.hasPermission
                },
                modal: T
            }
        }()
    }, {
        "./include/ban": 4,
        "./include/board": 5,
        "./include/chat": 6,
        "./include/chromeOffsetWorkaround": 7,
        "./include/coords": 8,
        "./include/grid": 9,
        "./include/lookup": 11,
        "./include/modal": 12,
        "./include/nativeNotifications": 13,
        "./include/notifications": 14,
        "./include/overlays": 15,
        "./include/panels": 16,
        "./include/place": 17,
        "./include/query": 18,
        "./include/serviceworkers": 19,
        "./include/settings": 20,
        "./include/storage": 22,
        "./include/template": 23,
        "./include/timer": 24,
        "./include/typeahead": 25,
        "./include/uiHelper": 26,
        "./include/user": 27
    }]
}, {}, [28]);
