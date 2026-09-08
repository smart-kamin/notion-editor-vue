import { Fragment as e, Teleport as t, Transition as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, defineComponent as u, h as d, mergeModels as f, nextTick as p, normalizeClass as m, normalizeStyle as h, onBeforeUnmount as g, onMounted as _, openBlock as v, reactive as y, ref as b, renderList as x, resolveDynamicComponent as S, toDisplayString as C, unref as w, useModel as T, vModelText as E, watch as D, withCtx as O, withDirectives as k, withModifiers as A } from "vue";
import { EditorContent as j, NodeViewContent as M, NodeViewWrapper as N, VueNodeViewRenderer as P, nodeViewProps as F, useEditor as I } from "@tiptap/vue-3";
import L from "@tiptap/starter-kit";
import R from "@tiptap/extension-placeholder";
import { TaskItem as z, TaskList as B } from "@tiptap/extension-list";
import { Image as ee } from "@tiptap/extension-image";
import te from "@tiptap/extension-highlight";
import { marked as V } from "marked";
import ne from "turndown";
import { Table as re } from "@tiptap/extension-table";
import { TableRow as ie } from "@tiptap/extension-table-row";
import { TableCell as H } from "@tiptap/extension-table-cell";
import { TableHeader as ae } from "@tiptap/extension-table-header";
import U from "@tiptap/extension-link";
import W from "@tiptap/extension-text-align";
import { Blockquote as oe } from "@tiptap/extension-blockquote";
import { CodeBlock as se } from "@tiptap/extension-code-block";
import { EditorView as G, drawSelection as ce, keymap as K } from "@codemirror/view";
import { Compartment as le, EditorState as ue } from "@codemirror/state";
import { defaultKeymap as de, history as fe, historyKeymap as pe, indentWithTab as me } from "@codemirror/commands";
import { HighlightStyle as he, LanguageDescription as ge, bracketMatching as _e, indentOnInput as ve, syntaxHighlighting as ye } from "@codemirror/language";
import { closeBrackets as be, closeBracketsKeymap as xe } from "@codemirror/autocomplete";
import { languages as Se } from "@codemirror/language-data";
import { NodeSelection as Ce, Plugin as we, PluginKey as Te, Selection as Ee, TextSelection as De } from "@tiptap/pm/state";
import { exitCode as Oe } from "@tiptap/pm/commands";
import { redo as ke, undo as Ae } from "@tiptap/pm/history";
import { tags as q } from "@lezer/highlight";
import { all as je, createLowlight as Me } from "lowlight";
import Ne from "@tiptap/extension-underline";
import { Extension as Pe } from "@tiptap/core";
import Fe from "@tiptap/suggestion";
import { Decoration as Ie, DecorationSet as Le } from "@tiptap/pm/view";
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.33_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var Re = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, ze = (e) => e === "", Be = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Ve = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), He = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Ue = (e) => {
	let t = He(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, J = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, We = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = J.width, color: s = J.stroke, ...c }, { slots: l }) => d("svg", {
	...J,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": ze(n) || ze(r) || n === !0 || r === !0 ? Number(i || a || J["stroke-width"]) * 24 / Number(o) : i || a || J["stroke-width"],
	class: Be("lucide", c.class, ...e ? [`lucide-${Ve(Ue(e))}-icon`, `lucide-${Ve(e)}`] : ["lucide-icon"]),
	...!l.default && !Re(c) && { "aria-hidden": "true" }
}, [...t.map((e) => d(...e)), ...l.default ? [l.default()] : []]), Y = (e, t) => (n, { slots: r, attrs: i }) => d(We, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), Ge = Y("arrow-down-from-line", [
	["path", {
		d: "M19 3H5",
		key: "1236rx"
	}],
	["path", {
		d: "M12 21V7",
		key: "gj6g52"
	}],
	["path", {
		d: "m6 15 6 6 6-6",
		key: "h15q88"
	}]
]), Ke = Y("arrow-left-from-line", [
	["path", {
		d: "m9 6-6 6 6 6",
		key: "7v63n9"
	}],
	["path", {
		d: "M3 12h14",
		key: "13k4hi"
	}],
	["path", {
		d: "M21 19V5",
		key: "b4bplr"
	}]
]), qe = Y("arrow-right-from-line", [
	["path", {
		d: "M3 5v14",
		key: "1nt18q"
	}],
	["path", {
		d: "M21 12H7",
		key: "13ipq5"
	}],
	["path", {
		d: "m15 18 6-6-6-6",
		key: "6tx3qv"
	}]
]), Je = Y("arrow-up-from-line", [
	["path", {
		d: "m18 9-6-6-6 6",
		key: "kcunyi"
	}],
	["path", {
		d: "M12 3v14",
		key: "7cf3v8"
	}],
	["path", {
		d: "M5 21h14",
		key: "11awu3"
	}]
]), Ye = Y("bold", [["path", {
	d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
	key: "mg9rjx"
}]]), Xe = Y("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Ze = Y("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), Qe = Y("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]), $e = Y("code-xml", [
	["path", {
		d: "m18 16 4-4-4-4",
		key: "1inbqp"
	}],
	["path", {
		d: "m6 8-4 4 4 4",
		key: "15zrgr"
	}],
	["path", {
		d: "m14.5 4-5 16",
		key: "e7oirm"
	}]
]), et = Y("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), tt = Y("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]), nt = Y("external-link", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "M10 14 21 3",
		key: "gplh6r"
	}],
	["path", {
		d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
		key: "a6xqqp"
	}]
]), rt = Y("grip-vertical", [
	["circle", {
		cx: "9",
		cy: "12",
		r: "1",
		key: "1vctgf"
	}],
	["circle", {
		cx: "9",
		cy: "5",
		r: "1",
		key: "hp0tcf"
	}],
	["circle", {
		cx: "9",
		cy: "19",
		r: "1",
		key: "fkjjf6"
	}],
	["circle", {
		cx: "15",
		cy: "12",
		r: "1",
		key: "1tmaij"
	}],
	["circle", {
		cx: "15",
		cy: "5",
		r: "1",
		key: "19l28e"
	}],
	["circle", {
		cx: "15",
		cy: "19",
		r: "1",
		key: "f4zoj3"
	}]
]), it = Y("heading-1", [
	["path", {
		d: "M4 12h8",
		key: "17cfdx"
	}],
	["path", {
		d: "M4 18V6",
		key: "1rz3zl"
	}],
	["path", {
		d: "M12 18V6",
		key: "zqpxq5"
	}],
	["path", {
		d: "m17 12 3-2v8",
		key: "1hhhft"
	}]
]), at = Y("heading-2", [
	["path", {
		d: "M4 12h8",
		key: "17cfdx"
	}],
	["path", {
		d: "M4 18V6",
		key: "1rz3zl"
	}],
	["path", {
		d: "M12 18V6",
		key: "zqpxq5"
	}],
	["path", {
		d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",
		key: "9jr5yi"
	}]
]), ot = Y("heading-3", [
	["path", {
		d: "M4 12h8",
		key: "17cfdx"
	}],
	["path", {
		d: "M4 18V6",
		key: "1rz3zl"
	}],
	["path", {
		d: "M12 18V6",
		key: "zqpxq5"
	}],
	["path", {
		d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2",
		key: "68ncm8"
	}],
	["path", {
		d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2",
		key: "1ejuhz"
	}]
]), st = Y("highlighter", [["path", {
	d: "m9 11-6 6v3h9l3-3",
	key: "1a3l36"
}], ["path", {
	d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",
	key: "14a9rk"
}]]), ct = Y("image", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		ry: "2",
		key: "1m3agn"
	}],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2",
		key: "af1f0g"
	}],
	["path", {
		d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
		key: "1xmnt7"
	}]
]), lt = Y("italic", [
	["line", {
		x1: "19",
		x2: "10",
		y1: "4",
		y2: "4",
		key: "15jd3p"
	}],
	["line", {
		x1: "14",
		x2: "5",
		y1: "20",
		y2: "20",
		key: "bu0au3"
	}],
	["line", {
		x1: "15",
		x2: "9",
		y1: "4",
		y2: "20",
		key: "uljnxc"
	}]
]), ut = Y("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), dt = Y("list-ordered", [
	["path", {
		d: "M11 5h10",
		key: "1cz7ny"
	}],
	["path", {
		d: "M11 12h10",
		key: "1438ji"
	}],
	["path", {
		d: "M11 19h10",
		key: "11t30w"
	}],
	["path", {
		d: "M4 4h1v5",
		key: "10yrso"
	}],
	["path", {
		d: "M4 9h2",
		key: "r1h2o0"
	}],
	["path", {
		d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02",
		key: "xtkcd5"
	}]
]), ft = Y("list", [
	["path", {
		d: "M3 5h.01",
		key: "18ugdj"
	}],
	["path", {
		d: "M3 12h.01",
		key: "nlz23k"
	}],
	["path", {
		d: "M3 19h.01",
		key: "noohij"
	}],
	["path", {
		d: "M8 5h13",
		key: "1pao27"
	}],
	["path", {
		d: "M8 12h13",
		key: "1za7za"
	}],
	["path", {
		d: "M8 19h13",
		key: "m83p4d"
	}]
]), pt = Y("maximize-2", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "m21 3-7 7",
		key: "1l2asr"
	}],
	["path", {
		d: "m3 21 7-7",
		key: "tjx5ai"
	}],
	["path", {
		d: "M9 21H3v-6",
		key: "wtvkvv"
	}]
]), mt = Y("minus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}]]), ht = Y("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), gt = Y("quote", [["path", {
	d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
	key: "rib7q0"
}], ["path", {
	d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
	key: "1ymkrd"
}]]), _t = Y("square-check-big", [["path", {
	d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
	key: "2acyp4"
}], ["path", {
	d: "m9 11 3 3L22 4",
	key: "1pflzl"
}]]), vt = Y("strikethrough", [
	["path", {
		d: "M16 4H9a3 3 0 0 0-2.83 4",
		key: "43sutm"
	}],
	["path", {
		d: "M14 12a4 4 0 0 1 0 8H6",
		key: "nlfj13"
	}],
	["line", {
		x1: "4",
		x2: "20",
		y1: "12",
		y2: "12",
		key: "1e0a9i"
	}]
]), yt = Y("table", [
	["path", {
		d: "M12 3v18",
		key: "108xh3"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}],
	["path", {
		d: "M3 9h18",
		key: "1pudct"
	}],
	["path", {
		d: "M3 15h18",
		key: "5xshup"
	}]
]), bt = Y("text-align-center", [
	["path", {
		d: "M21 5H3",
		key: "1fi0y6"
	}],
	["path", {
		d: "M17 12H7",
		key: "16if0g"
	}],
	["path", {
		d: "M19 19H5",
		key: "vjpgq2"
	}]
]), xt = Y("text-align-end", [
	["path", {
		d: "M21 5H3",
		key: "1fi0y6"
	}],
	["path", {
		d: "M21 12H9",
		key: "dn1m92"
	}],
	["path", {
		d: "M21 19H7",
		key: "4cu937"
	}]
]), St = Y("text-align-justify", [
	["path", {
		d: "M3 5h18",
		key: "1u36vt"
	}],
	["path", {
		d: "M3 12h18",
		key: "1i2n21"
	}],
	["path", {
		d: "M3 19h18",
		key: "awlh7x"
	}]
]), Ct = Y("text-align-start", [
	["path", {
		d: "M21 5H3",
		key: "1fi0y6"
	}],
	["path", {
		d: "M15 12H3",
		key: "6jk70r"
	}],
	["path", {
		d: "M17 19H3",
		key: "z6ezky"
	}]
]), X = Y("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]), wt = Y("type", [
	["path", {
		d: "M12 4v16",
		key: "1654pz"
	}],
	["path", {
		d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",
		key: "e0r10z"
	}],
	["path", {
		d: "M9 20h6",
		key: "s66wpe"
	}]
]), Tt = Y("underline", [["path", {
	d: "M6 4v6a6 6 0 0 0 12 0V4",
	key: "9kb039"
}], ["line", {
	x1: "4",
	x2: "20",
	y1: "20",
	y2: "20",
	key: "nun2al"
}]]), Et = Y("upload", [
	["path", {
		d: "M12 3v12",
		key: "1x0j5s"
	}],
	["path", {
		d: "m17 8-5-5-5 5",
		key: "7q97r8"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}]
]), Dt = Y("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Ot = {
	key: 0,
	class: "img-nv__toolbar"
}, kt = ["src", "alt"], At = /* @__PURE__ */ u({
	__name: "ImageView",
	props: {
		node: {},
		updateAttributes: { type: Function },
		selected: { type: Boolean },
		editor: {},
		deleteNode: { type: Function }
	},
	setup(t) {
		let c = t, u = b(null), d = r(() => c.editor?.isEditable !== !1);
		function f() {
			return c.editor?.isEditable !== !1;
		}
		function p(e) {
			f() && c.updateAttributes({ align: e });
		}
		function _() {
			f() && c.deleteNode();
		}
		let y = b(!1), x = "right", S = 0, C = 0;
		function T(e, t) {
			f() && (e.preventDefault(), x = t, S = e.clientX, C = c.node.attrs.width ?? u.value?.offsetWidth ?? 400, y.value = !0, window.addEventListener("mousemove", E), window.addEventListener("mouseup", D));
		}
		function E(e) {
			if (!f()) return;
			let t = x === "right" ? e.clientX - S : S - e.clientX, n = Math.max(80, Math.round(C + t));
			c.updateAttributes({ width: n });
		}
		function D() {
			y.value = !1, window.removeEventListener("mousemove", E), window.removeEventListener("mouseup", D);
		}
		g(() => {
			window.removeEventListener("mousemove", E), window.removeEventListener("mouseup", D);
		});
		let k = r(() => c.node.attrs.align ?? "center"), j = {
			left: "flex-start",
			center: "center",
			right: "flex-end"
		}, M = r(() => ({ justifyContent: j[k.value] ?? "center" })), P = r(() => ({
			width: c.node.attrs.width ? `${c.node.attrs.width}px` : void 0,
			maxWidth: "100%"
		}));
		return (r, c) => (v(), i(w(N), {
			class: m(["img-nv", { "img-nv--resizing": y.value }]),
			style: h(M.value)
		}, {
			default: O(() => [s("div", { class: m(["img-nv__wrap", {
				"img-nv__wrap--selected": t.selected,
				"img-nv__wrap--active": t.selected || y.value
			}]) }, [
				l(n, { name: "img-tb" }, {
					default: O(() => [(t.selected || y.value) && d.value ? (v(), o("div", Ot, [
						s("button", {
							class: m(["img-nv__tb-btn", { "img-nv__tb-btn--active": k.value === "left" }]),
							title: "По левому краю",
							onMousedown: c[0] ||= A((e) => p("left"), ["prevent"])
						}, [l(w(Ct), { size: 13 })], 34),
						s("button", {
							class: m(["img-nv__tb-btn", { "img-nv__tb-btn--active": k.value === "center" }]),
							title: "По центру",
							onMousedown: c[1] ||= A((e) => p("center"), ["prevent"])
						}, [l(w(bt), { size: 13 })], 34),
						s("button", {
							class: m(["img-nv__tb-btn", { "img-nv__tb-btn--active": k.value === "right" }]),
							title: "По правому краю",
							onMousedown: c[2] ||= A((e) => p("right"), ["prevent"])
						}, [l(w(xt), { size: 13 })], 34),
						c[5] ||= s("div", { class: "img-nv__tb-sep" }, null, -1),
						s("button", {
							class: "img-nv__tb-btn img-nv__tb-btn--danger",
							title: "Удалить",
							onMousedown: A(_, ["prevent"])
						}, [l(w(X), { size: 13 })], 32)
					])) : a("", !0)]),
					_: 1
				}),
				s("img", {
					ref_key: "imgRef",
					ref: u,
					src: t.node.attrs.src,
					alt: t.node.attrs.alt ?? "",
					style: h(P.value),
					draggable: "false",
					class: "img-nv__img"
				}, null, 12, kt),
				(t.selected || y.value) && d.value ? (v(), o(e, { key: 0 }, [s("div", {
					class: "img-nv__handle img-nv__handle--left",
					onMousedown: c[3] ||= A((e) => T(e, "left"), ["prevent"])
				}, null, 32), s("div", {
					class: "img-nv__handle img-nv__handle--right",
					onMousedown: c[4] ||= A((e) => T(e, "right"), ["prevent"])
				}, null, 32)], 64)) : a("", !0)
			], 2)]),
			_: 1
		}, 8, ["class", "style"]));
	}
}), Z = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, jt = /* @__PURE__ */ Z(At, [["__scopeId", "data-v-886f8cf5"]]), Mt = ee.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			width: {
				default: null,
				parseHTML: (e) => e.getAttribute("width") ? Number(e.getAttribute("width")) : null,
				renderHTML: (e) => e.width ? { width: e.width } : {}
			},
			align: {
				default: "center",
				parseHTML: (e) => e.getAttribute("data-align") ?? "center",
				renderHTML: (e) => ({ "data-align": e.align })
			}
		};
	},
	addNodeView() {
		return P(jt);
	}
}).configure({ inline: !1 }), Nt = [
	re.configure({ resizable: !0 }),
	ie,
	ae,
	H
], Pt = { class: "tbl-ctx-group" }, Ft = { class: "tbl-ctx-group" }, It = { class: "tbl-ctx-group" }, Lt = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "TableControls",
	props: /* @__PURE__ */ f({ editor: {} }, {
		wrap: { default: null },
		wrapModifiers: {}
	}),
	emits: ["update:wrap"],
	setup(r) {
		let c = r, u = T(r, "wrap"), d = b(null), f = b(!1);
		function p(e) {
			let t = e.target.closest("td, th");
			if (!t) return;
			e.preventDefault();
			let n = u.value;
			if (!n) return;
			let r = n.getBoundingClientRect(), i = t.closest("table");
			f.value = !!i && t.closest("tr") === i.querySelector("tr"), d.value = {
				top: e.clientY - r.top + 4,
				left: e.clientX - r.left + 4,
				anchorCell: t
			};
		}
		function m() {
			d.value = null;
		}
		function _(e) {
			let t = d.value, n = c.editor;
			if (!(!t || !n)) {
				m();
				try {
					let r = n.view.posAtDOM(t.anchorCell, 0) + 1;
					n.chain().focus().setTextSelection(r).run(), setTimeout(() => {
						n.commands[e]();
					}, 20);
				} catch (e) {
					console.error("[TableControls] cmd error:", e);
				}
			}
		}
		function y() {
			let e = d.value, t = c.editor;
			if (!e || !t) return;
			m();
			let n = e.anchorCell.closest("table");
			if (!n) return;
			let r = Array.from(n.querySelectorAll("tr:first-child th, tr:first-child td")).length;
			if (!r) return;
			let i = Array.from(n.querySelectorAll("colgroup col")).reduce((e, t) => e + (parseFloat(t.style.width) || 0), 0), a = i > 0 ? i : n.offsetWidth, o = Math.max(64, Math.floor(a / r)), s = t.view, l = s.state.tr, u = !1;
			n.querySelectorAll("tr").forEach((e) => {
				Array.from(e.querySelectorAll("td, th")).forEach((e, t) => {
					if (!(t >= r)) try {
						let t = s.posAtDOM(e, 0) - 1, n = l.doc.nodeAt(t);
						if (!n) return;
						l = l.setNodeMarkup(t, void 0, {
							...n.attrs,
							colwidth: [o]
						}), u = !0;
					} catch {}
				});
			}), u && s.dispatch(l);
		}
		function x() {
			let e = d.value, t = c.editor;
			if (!e || !t) return;
			m();
			let n = e.anchorCell.closest("table"), r = n?.closest(".tableWrapper") ?? n?.parentElement;
			if (!n || !r) return;
			let i = r.clientWidth;
			if (!i) return;
			let a = n.style.tableLayout, o = n.style.width;
			n.style.tableLayout = "auto", n.style.width = "auto";
			let s = Array.from(n.querySelectorAll("tr:first-child th, tr:first-child td")).map((e) => e.offsetWidth), l = s.reduce((e, t) => e + t, 0);
			n.style.tableLayout = a, n.style.width = o;
			let u = i / Math.max(l, 1), f = s.map((e) => Math.max(64, Math.round(e * u))), p = f.reduce((e, t) => e + t, 0), h = f.length - 1;
			h >= 0 && (f[h] = Math.max(64, (f[h] ?? 0) + (i - p)));
			let g = t.view, _ = g.state.tr, v = !1;
			n.querySelectorAll("tr").forEach((e) => {
				Array.from(e.querySelectorAll("td, th")).forEach((e, t) => {
					if (!(t >= f.length)) try {
						let n = g.posAtDOM(e, 0) - 1, r = _.doc.nodeAt(n);
						if (!r) return;
						_ = _.setNodeMarkup(n, void 0, {
							...r.attrs,
							colwidth: [f[t]]
						}), v = !0;
					} catch {}
				});
			}), v && g.dispatch(_);
		}
		let S = b(null), C = b(null), E = b(null), k = null, j = null;
		function M() {
			k ||= setTimeout(() => {
				S.value = null, C.value = null, E.value = null, k = null;
			}, 400);
		}
		function N() {
			k &&= (clearTimeout(k), null);
		}
		function P() {
			S.value = null, C.value = null, E.value = null, k &&= (clearTimeout(k), null);
		}
		function F(e) {
			j === null && (j = requestAnimationFrame(() => {
				j = null, L(e);
			}));
		}
		function I(e) {
			let t = c.editor;
			if (!t) return;
			let n = e.querySelector("colgroup col");
			if (n && n.style.width) return;
			let r = (e.closest(".tableWrapper") ?? e.parentElement)?.clientWidth ?? e.offsetWidth, i = e.querySelectorAll("tr:first-child th, tr:first-child td").length;
			if (!i) return;
			let a = Math.max(64, Math.floor(r / i)), o = t.view, s = o.state.tr, l = !1;
			e.querySelectorAll("tr").forEach((e) => {
				Array.from(e.querySelectorAll("td, th")).forEach((e, t) => {
					if (!(t >= i)) try {
						let t = o.posAtDOM(e, 0) - 1, n = s.doc.nodeAt(t);
						if (!n || n.attrs.colwidth?.[0]) return;
						s = s.setNodeMarkup(t, void 0, {
							...n.attrs,
							colwidth: [a]
						}), l = !0;
					} catch {}
				});
			}), l && o.dispatch(s);
		}
		function L(e) {
			if (e.target.closest(".tbl-add-btn")) {
				N();
				return;
			}
			let t = e.target.closest("table");
			if (!t) {
				M();
				return;
			}
			k &&= (clearTimeout(k), null), I(t);
			let n = t.getBoundingClientRect(), r = (t.closest(".tableWrapper") ?? t).getBoundingClientRect();
			S.value = {
				top: n.bottom,
				left: r.left + r.width / 2,
				table: t
			}, C.value = {
				top: n.top + n.height / 2,
				left: n.right,
				table: t
			};
			let i = !1, a = Array.from(t.querySelectorAll("tr:first-child th"));
			for (let t = 0; t < a.length; t++) {
				let r = a[t];
				if (!r) continue;
				let o = r.getBoundingClientRect(), s = o.right - e.clientX;
				if (s >= -8 && s <= 8) {
					E.value = {
						left: o.right,
						top: n.top + n.height / 2,
						height: 24
					}, i = !0;
					break;
				}
			}
			i || (E.value = null);
		}
		function R() {
			let e = c.editor, t = S.value?.table;
			if (P(), !e || !t) return;
			let n = t.querySelector("tr:last-child td, tr:last-child th");
			if (n) try {
				let t = e.view.posAtDOM(n, 0) + 1;
				e.chain().focus().setTextSelection(t).run(), setTimeout(() => {
					e.commands.addRowAfter();
				}, 20);
			} catch {}
		}
		function z() {
			let e = c.editor, t = C.value?.table;
			if (P(), !e || !t) return;
			let n = t.querySelector("tr:first-child th:last-child, tr:first-child td:last-child");
			if (n) try {
				let t = e.view.posAtDOM(n, 0) + 1;
				e.chain().focus().setTextSelection(t).run(), setTimeout(() => {
					e.commands.addColumnAfter();
				}, 20);
			} catch {}
		}
		let B = null;
		return D(u, (e, t) => {
			t && (t.removeEventListener("contextmenu", p), t.removeEventListener("mousemove", F), t.removeEventListener("mouseleave", M)), e && (e.addEventListener("contextmenu", p), e.addEventListener("mousemove", F), e.addEventListener("mouseleave", M), B = () => {
				e.removeEventListener("contextmenu", p), e.removeEventListener("mousemove", F), e.removeEventListener("mouseleave", M);
			});
		}, { immediate: !0 }), g(() => {
			B?.(), j !== null && cancelAnimationFrame(j);
		}), (r, c) => (v(), o(e, null, [
			(v(), i(t, { to: "body" }, [d.value ? (v(), o("div", {
				key: 0,
				class: "tbl-ctx-overlay",
				onMousedown: A(m, ["self"])
			}, null, 32)) : a("", !0)])),
			l(n, { name: "tbl-ctx" }, {
				default: O(() => [d.value ? (v(), o("div", {
					key: 0,
					class: "tbl-ctx-menu",
					style: h({
						top: d.value.top + "px",
						left: d.value.left + "px"
					})
				}, [
					s("div", Pt, [
						c[10] ||= s("p", { class: "tbl-ctx-label" }, "Добавить", -1),
						f.value ? a("", !0) : (v(), o("button", {
							key: 0,
							class: "tbl-ctx-item",
							onMousedown: c[0] ||= A((e) => _("addRowBefore"), ["prevent"])
						}, [l(w(Je), { size: 13 }), c[6] ||= s("span", null, "Строку выше", -1)], 32)),
						s("button", {
							class: "tbl-ctx-item",
							onMousedown: c[1] ||= A((e) => _("addRowAfter"), ["prevent"])
						}, [l(w(Ge), { size: 13 }), c[7] ||= s("span", null, "Строку ниже", -1)], 32),
						s("button", {
							class: "tbl-ctx-item",
							onMousedown: c[2] ||= A((e) => _("addColumnBefore"), ["prevent"])
						}, [l(w(Ke), { size: 13 }), c[8] ||= s("span", null, "Столбец слева", -1)], 32),
						s("button", {
							class: "tbl-ctx-item",
							onMousedown: c[3] ||= A((e) => _("addColumnAfter"), ["prevent"])
						}, [l(w(qe), { size: 13 }), c[9] ||= s("span", null, "Столбец справа", -1)], 32)
					]),
					c[16] ||= s("div", { class: "tbl-ctx-separator" }, null, -1),
					s("div", Ft, [s("button", {
						class: "tbl-ctx-item",
						onMousedown: A(y, ["prevent"])
					}, [l(w(St), { size: 13 }), c[11] ||= s("span", null, "Равная ширина столбцов", -1)], 32), s("button", {
						class: "tbl-ctx-item",
						onMousedown: A(x, ["prevent"])
					}, [l(w(pt), { size: 13 }), c[12] ||= s("span", null, "По ширине страницы", -1)], 32)]),
					c[17] ||= s("div", { class: "tbl-ctx-separator" }, null, -1),
					s("div", It, [
						c[15] ||= s("p", { class: "tbl-ctx-label" }, "Удалить", -1),
						s("button", {
							class: "tbl-ctx-item tbl-ctx-item--danger",
							onMousedown: c[4] ||= A((e) => _("deleteRow"), ["prevent"])
						}, [l(w(X), { size: 13 }), c[13] ||= s("span", null, "Строку", -1)], 32),
						s("button", {
							class: "tbl-ctx-item tbl-ctx-item--danger",
							onMousedown: c[5] ||= A((e) => _("deleteColumn"), ["prevent"])
						}, [l(w(X), { size: 13 }), c[14] ||= s("span", null, "Столбец", -1)], 32)
					])
				], 4)) : a("", !0)]),
				_: 1
			}),
			(v(), i(t, { to: "body" }, [
				l(n, { name: "tbl-resize" }, {
					default: O(() => [E.value ? (v(), o("div", {
						key: 0,
						class: "tbl-resize-handle",
						style: h({
							left: E.value.left + "px",
							top: E.value.top + "px",
							height: E.value.height + "px"
						})
					}, null, 4)) : a("", !0)]),
					_: 1
				}),
				l(n, { name: "tbl-add" }, {
					default: O(() => [S.value ? (v(), o("button", {
						key: 0,
						class: "tbl-add-btn tbl-add-btn--row",
						style: h({
							top: S.value.top + "px",
							left: S.value.left + "px"
						}),
						onMouseenter: N,
						onMouseleave: M,
						onMousedown: A(R, ["prevent"]),
						title: "Добавить строку"
					}, [l(w(ht), { size: 12 })], 36)) : a("", !0)]),
					_: 1
				}),
				l(n, { name: "tbl-add" }, {
					default: O(() => [C.value ? (v(), o("button", {
						key: 0,
						class: "tbl-add-btn tbl-add-btn--col",
						style: h({
							top: C.value.top + "px",
							left: C.value.left + "px"
						}),
						onMouseenter: N,
						onMouseleave: M,
						onMousedown: A(z, ["prevent"]),
						title: "Добавить столбец"
					}, [l(w(ht), { size: 12 })], 36)) : a("", !0)]),
					_: 1
				})
			]))
		], 64));
	}
}), [["__scopeId", "data-v-23910278"]]), Rt = U.configure({
	openOnClick: !1,
	autolink: !0,
	linkOnPaste: !0,
	HTMLAttributes: {
		class: "ed-link",
		rel: "noopener noreferrer"
	}
}), zt = { class: "lnk-ctx__input-row" }, Bt = { class: "lnk-ctx__actions" }, Vt = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "LinkControls",
	props: /* @__PURE__ */ f({ editor: {} }, {
		wrap: { default: null },
		wrapModifiers: {}
	}),
	emits: ["update:wrap"],
	setup(r) {
		let c = r, u = T(r, "wrap");
		function d(e) {
			e.target.closest("a.ed-link") && e.preventDefault();
		}
		function f(e) {
			let t = e.target.closest("a.ed-link");
			t && (e.preventDefault(), e.stopImmediatePropagation(), (e.ctrlKey || e.metaKey) && window.open(t.href, "_blank", "noopener,noreferrer"));
		}
		let m = b(null), _ = b(null), y = b("");
		function x(e) {
			let t = e.target.closest("a.ed-link");
			if (!t) return;
			e.preventDefault(), e.stopImmediatePropagation();
			let n = c.editor, r = u.value;
			if (!(!n || !r)) try {
				let i = n.view.posAtDOM(t, 0), a = r.getBoundingClientRect();
				m.value = {
					top: e.clientY - a.top + 4,
					left: e.clientX - a.left + 4,
					pos: i,
					originalHref: t.href
				}, y.value = t.href, p(() => {
					_.value?.focus(), _.value?.select();
				});
			} catch (e) {
				console.error("[LinkControls] posAtDOM error:", e);
			}
		}
		function S() {
			C && clearTimeout(C), m.value = null, y.value = "";
		}
		let C = null;
		function j(e) {
			let t = c.editor, n = m.value;
			if (!(!t || !n)) try {
				t.chain().setTextSelection(n.pos).extendMarkRange("link").updateAttributes("link", { href: e }).run();
			} catch (e) {
				console.error("[LinkControls] save error:", e);
			}
		}
		D(y, (e) => {
			if (!m.value) return;
			C && clearTimeout(C);
			let t = e.trim();
			t && (C = setTimeout(() => j(t), 400));
		});
		function M() {
			let e = c.editor, t = m.value;
			if (!(!e || !t)) {
				try {
					e.chain().focus().setTextSelection(t.pos).extendMarkRange("link").unsetLink().run();
				} catch (e) {
					console.error("[LinkControls] remove error:", e);
				}
				S();
			}
		}
		function N() {
			let e = y.value.trim() || m.value?.originalHref;
			e && window.open(e, "_blank", "noopener,noreferrer");
		}
		function P() {
			let e = y.value.trim() || m.value?.originalHref;
			e && navigator.clipboard.writeText(e), S();
		}
		function F(e) {
			if (e.key === "Enter") {
				C && clearTimeout(C);
				let e = y.value.trim();
				e && j(e), S();
			}
			e.key === "Escape" && S();
		}
		let I = null;
		return D(u, (e, t) => {
			t && (t.removeEventListener("contextmenu", x), t.removeEventListener("mousedown", d, { capture: !0 }), t.removeEventListener("click", f, { capture: !0 })), e && (e.addEventListener("contextmenu", x), e.addEventListener("mousedown", d, { capture: !0 }), e.addEventListener("click", f, { capture: !0 }), I = () => {
				e.removeEventListener("contextmenu", x), e.removeEventListener("mousedown", d, { capture: !0 }), e.removeEventListener("click", f, { capture: !0 });
			});
		}, { immediate: !0 }), g(() => I?.()), (r, c) => (v(), o(e, null, [(v(), i(t, { to: "body" }, [m.value ? (v(), o("div", {
			key: 0,
			class: "lnk-overlay",
			onMousedown: A(S, ["self"])
		}, null, 32)) : a("", !0)])), l(n, { name: "lnk-ctx" }, {
			default: O(() => [m.value ? (v(), o("div", {
				key: 0,
				class: "lnk-ctx",
				style: h({
					top: m.value.top + "px",
					left: m.value.left + "px"
				})
			}, [
				s("div", zt, [k(s("input", {
					ref_key: "inputRef",
					ref: _,
					"onUpdate:modelValue": c[0] ||= (e) => y.value = e,
					class: "lnk-ctx__input",
					type: "url",
					placeholder: "https://example.com",
					autocomplete: "off",
					spellcheck: "false",
					onKeydown: F
				}, null, 544), [[E, y.value]]), s("button", {
					class: "lnk-ctx__icon-btn",
					title: "Открыть в новой вкладке",
					onMousedown: A(N, ["prevent"])
				}, [l(w(nt), { size: 13 })], 32)]),
				c[3] ||= s("div", { class: "lnk-ctx-separator" }, null, -1),
				s("div", Bt, [s("button", {
					class: "lnk-ctx-item lnk-ctx-item--danger",
					onMousedown: A(M, ["prevent"])
				}, [l(w(X), { size: 13 }), c[1] ||= s("span", null, "Удалить", -1)], 32), s("button", {
					class: "lnk-ctx-item lnk-ctx-item--copy",
					onMousedown: A(P, ["prevent"])
				}, [l(w(tt), { size: 13 }), c[2] ||= s("span", null, "Копировать", -1)], 32)])
			], 4)) : a("", !0)]),
			_: 1
		})], 64));
	}
}), [["__scopeId", "data-v-5e6cc804"]]), Ht = {
	key: 0,
	class: "ed-blockquote__fade"
}, Ut = ["title"], Wt = 500, Gt = "7rem", Kt = /* @__PURE__ */ u({
	__name: "BlockquoteView",
	props: F,
	setup(e) {
		let t = e, n = r(() => (t.node.textContent?.length ?? 0) > Wt), c = b(!1), u = b(null), d = b(Gt), f = b(!0);
		function p() {
			let e = u.value;
			e && (c.value ? (d.value = e.scrollHeight + "px", e.offsetHeight, requestAnimationFrame(() => {
				d.value = Gt, f.value = !0;
			})) : (d.value = e.scrollHeight + "px", f.value = !1, e.addEventListener("transitionend", () => {
				d.value = "auto";
			}, { once: !0 })), c.value = !c.value);
		}
		return (e, t) => (v(), i(w(N), {
			as: "blockquote",
			class: "ed-blockquote"
		}, {
			default: O(() => [
				l(w(gt), {
					class: "ed-blockquote__icon",
					"aria-hidden": "true",
					contenteditable: "false"
				}),
				s("div", {
					ref_key: "bodyRef",
					ref: u,
					class: "ed-blockquote__body",
					style: h(n.value ? {
						height: d.value,
						overflow: "hidden"
					} : { display: "contents" })
				}, [l(w(M), { class: "ed-blockquote__content" }), n.value && f.value ? (v(), o("div", Ht)) : a("", !0)], 4),
				n.value ? (v(), o("button", {
					key: 0,
					class: "ed-blockquote__toggle",
					contenteditable: "false",
					title: c.value ? "Свернуть" : "Развернуть",
					onClick: A(p, ["prevent"])
				}, [l(w(Ze), {
					size: 14,
					"stroke-width": 2,
					style: h({
						transform: c.value ? "rotate(180deg)" : "rotate(0deg)",
						transition: "transform 0.2s"
					})
				}, null, 8, ["style"]), s("span", null, C(c.value ? "Свернуть" : "Читать полностью"), 1)], 8, Ut)) : a("", !0)
			]),
			_: 1
		}));
	}
}), qt = oe.extend({
	addKeyboardShortcuts() {
		return { "Mod-a": ({ editor: e }) => {
			let { state: t } = e, n = t.doc.resolve(t.selection.from);
			for (let t = n.depth; t >= 0; t--) if (n.node(t).type.name === "blockquote") return e.commands.setTextSelection({
				from: n.start(t),
				to: n.end(t)
			}), !0;
			return !1;
		} };
	},
	addNodeView() {
		return P(Kt);
	}
}), Jt = G.theme({
	"&": {
		background: "transparent",
		color: "var(--foreground)"
	},
	"&.cm-focused": { outline: "none" },
	".cm-scroller": {
		fontFamily: "'Monaspace Neon', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
		fontSize: "0.8125rem",
		lineHeight: "1.7",
		fontFeatureSettings: "'calt' 1, 'liga' 1, 'ss01' 1, 'ss02' 1"
	},
	".cm-content": {
		padding: "0",
		caretColor: "var(--foreground)"
	},
	".cm-line": { padding: "0" },
	".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--foreground)" },
	".cm-selectionBackground": { background: "color-mix(in oklch, var(--primary) 18%, transparent)" },
	"&.cm-focused .cm-selectionBackground": { background: "color-mix(in oklch, var(--primary) 25%, transparent)" },
	".cm-selectionMatch": { background: "color-mix(in oklch, var(--primary) 12%, transparent)" },
	".cm-matchingBracket, .cm-nonmatchingBracket": {
		background: "color-mix(in oklch, var(--primary) 15%, transparent)",
		outline: "none"
	},
	".cm-gutters": { display: "none" },
	".cm-activeLine": { background: "transparent" },
	".cm-tooltip": {
		background: "var(--popover)",
		border: "0.0625rem solid var(--border)",
		borderRadius: "var(--radius-sm, 0.25rem)",
		color: "var(--popover-foreground)"
	},
	".cm-tooltip .cm-completionLabel": { color: "var(--foreground)" }
}), Yt = he.define([
	{
		tag: [q.keyword, q.modifier],
		color: "oklch(0.6 0.15 290)"
	},
	{
		tag: [
			q.standard(q.name),
			q.bool,
			q.null,
			q.self
		],
		color: "oklch(0.6 0.15 290)"
	},
	{
		tag: [q.string, q.special(q.string)],
		color: "oklch(0.62 0.14 150)"
	},
	{
		tag: q.number,
		color: "oklch(0.65 0.14 55)"
	},
	{
		tag: [
			q.comment,
			q.blockComment,
			q.lineComment
		],
		color: "var(--muted-foreground)",
		fontStyle: "italic"
	},
	{
		tag: [q.function(q.variableName), q.function(q.propertyName)],
		color: "oklch(0.65 0.15 220)"
	},
	{
		tag: [q.definition(q.name), q.className],
		color: "oklch(0.65 0.15 220)"
	},
	{
		tag: [q.attributeName, q.attributeValue],
		color: "oklch(0.6 0.13 20)"
	},
	{
		tag: q.propertyName,
		color: "oklch(0.6 0.13 20)"
	},
	{
		tag: [q.operator, q.punctuation],
		color: "var(--muted-foreground)"
	},
	{
		tag: q.tagName,
		color: "oklch(0.6 0.15 290)"
	},
	{
		tag: q.regexp,
		color: "oklch(0.62 0.14 150)"
	},
	{
		tag: q.meta,
		color: "oklch(0.58 0.12 240)"
	},
	{
		tag: q.typeName,
		color: "oklch(0.65 0.14 55)"
	},
	{
		tag: q.inserted,
		color: "oklch(0.58 0.16 150)",
		background: "oklch(0.58 0.16 150 / 0.1)"
	},
	{
		tag: q.deleted,
		color: "oklch(0.55 0.18 20)",
		background: "oklch(0.55 0.18 20 / 0.1)"
	},
	{
		tag: q.heading,
		color: "var(--foreground)",
		fontWeight: "bold"
	}
]), Xt = Me(je), Zt = "ed-code-block-styles";
function Qt() {
	if (typeof document > "u") return;
	let e = document.getElementById(Zt);
	e || (e = document.createElement("style"), e.id = Zt, document.head.appendChild(e)), e.textContent = "\n\n/* ── Обёртка ──────────────────────────────────────────────────────────────── */\n.ed-code-block {\n  position: relative;\n  margin: 1rem 0;\n  border-radius: var(--radius-md, 0.5rem);\n  border: 0.0625rem solid var(--border);\n  background: color-mix(in oklch, var(--muted) 10%, transparent);\n  overflow: visible;\n  font-family: 'Monaspace Neon', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;\n}\n\n.dark .ed-code-block {\n  background: oklch(0.145 0.004 240 / 0.1);\n}\n\n/* ── Иконка на рамке ──────────────────────────────────────────────────────── */\n.ed-code-block__icon {\n  position: absolute;\n  top: 0;\n  left: 1rem;\n  transform: translateY(-50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.25rem;\n  height: 1.25rem;\n  padding: 0.2rem;\n  border-radius: 9999px;\n  background: var(--background);\n  color: var(--muted-foreground);\n  border: 0.0625rem solid var(--border);\n}\n\n.ed-code-block__icon svg {\n  width: 100%;\n  height: 100%;\n  stroke-width: 1.5;\n}\n\n/* ── Оверлей ──────────────────────────────────────────────────────────────── */\n.ed-code-block__overlay {\n  position: absolute;\n  top: 0.5rem;\n  right: 0.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.375rem;\n  z-index: 2;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.15s ease;\n}\n\n.ed-code-block:hover .ed-code-block__overlay {\n  opacity: 1;\n  pointer-events: auto;\n}\n\n/* ── Badge языка ──────────────────────────────────────────────────────────── */\n.ed-code-block__lang-badge {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  letter-spacing: 0.03em;\n  color: var(--muted-foreground);\n  font-family: inherit;\n  padding: 0.15rem 0.45rem;\n  border-radius: var(--radius-sm, 0.25rem);\n  background: color-mix(in oklch, var(--background) 80%, transparent);\n  border: 0.0625rem solid var(--border);\n  line-height: 1.4;\n  user-select: none;\n  backdrop-filter: blur(4px);\n}\n\n/* ── Кнопка карандаша ─────────────────────────────────────────────────────── */\n.ed-code-block__edit-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.5rem;\n  height: 1.5rem;\n  padding: 0;\n  border: 0.0625rem solid var(--border);\n  border-radius: var(--radius-sm, 0.25rem);\n  background: color-mix(in oklch, var(--background) 80%, transparent);\n  color: var(--muted-foreground);\n  cursor: pointer;\n  transition: color 0.12s, background 0.12s, border-color 0.12s;\n  backdrop-filter: blur(4px);\n}\n\n.ed-code-block__edit-btn:hover {\n  color: var(--foreground);\n  background: var(--background);\n  border-color: color-mix(in oklch, var(--border) 70%, var(--foreground));\n}\n\n/* ── Кнопка копирования ───────────────────────────────────────────────────── */\n.ed-code-block__copy-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.15rem 0.45rem;\n  border: 0.0625rem solid var(--border);\n  border-radius: var(--radius-sm, 0.25rem);\n  background: color-mix(in oklch, var(--background) 80%, transparent);\n  color: var(--muted-foreground);\n  font-size: 0.6875rem;\n  font-family: inherit;\n  line-height: 1.4;\n  cursor: pointer;\n  transition: color 0.12s, background 0.12s, border-color 0.12s;\n  backdrop-filter: blur(4px);\n}\n\n.ed-code-block__copy-btn:hover {\n  color: var(--foreground);\n  background: var(--background);\n  border-color: color-mix(in oklch, var(--border) 70%, var(--foreground));\n}\n\n/* ── Collapse body ────────────────────────────────────────────────────────── */\n.ed-code-block__body {\n  position: relative;\n  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n/* ── Fade при свёрнутом состоянии ─────────────────────────────────────────── */\n.ed-code-block__fade {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 5rem;\n  background: linear-gradient(\n    to bottom,\n    transparent,\n    color-mix(in oklch, var(--muted) 10%, var(--background))\n  );\n  pointer-events: none;\n  border-radius: 0 0 var(--radius-md, 0.5rem) var(--radius-md, 0.5rem);\n}\n\n.dark .ed-code-block__fade {\n  background: linear-gradient(to bottom, transparent, oklch(0.145 0.004 240));\n}\n\n/* ── Кнопка свернуть/развернуть ──────────────────────────────────────────── */\n/*\n  Точно повторяет .ed-blockquote__toggle.\n  font-family явно НЕ inherit: родитель .ed-code-block задаёт monospace,\n  inherit его и подхватил бы. Указываем sans-serif напрямую.\n  box-sizing: border-box + width: 100% — граница идёт от края до края.\n*/\n.ed-code-block__toggle {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  width: calc(100% - 2rem);\n  margin: 0.5rem 1rem 0;\n  padding: 0.5rem 0 0.625rem;\n  border: none;\n  border-top: 0.0625rem solid var(--border);\n  background: none;\n  color: var(--muted-foreground);\n  font-size: 0.75rem;\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\n  font-style: normal;\n  cursor: pointer;\n  transition: color 0.15s;\n  user-select: none;\n}\n\n.ed-code-block__toggle:hover {\n  color: var(--foreground);\n}\n\n/* ── CodeMirror контейнер ─────────────────────────────────────────────────── */\n.ed-code-block__cm {\n  padding: 1rem 1rem 0.875rem;\n  overflow-x: auto;\n}\n\n.ed-code-block .cm-editor {\n  background: transparent !important;\n}\n\n.ed-code-block .cm-focused {\n  outline: none !important;\n}\n\n.ed-code-block .cm-scroller {\n  overflow: visible;\n}\n\n.ed-code-block .cm-content {\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n/* Placeholder не должен пробиваться в CM */\n.ed-code-block .is-empty::before {\n  display: none !important;\n}\n\n\n/* ── Lang picker — точная копия shadcn <Command> ──────────────────────────── */\n\n.ed-lang-picker {\n  position: fixed;\n  z-index: 9999;\n  width: 14rem;\n  overflow: hidden;\n  border-radius: var(--radius-md, 0.5rem);\n  border: 0.0625rem solid var(--border);\n  background: var(--popover);\n  color: var(--popover-foreground);\n  box-shadow:\n    0 0 0 0.0625rem oklch(0 0 0 / 0.04),\n    0 4px 6px -1px oklch(0 0 0 / 0.08),\n    0 10px 24px -4px oklch(0 0 0 / 0.08);\n  display: flex;\n  flex-direction: column;\n}\n\n.ed-lang-picker__search-wrap {\n  display: flex;\n  align-items: center;\n  padding: 0 0.625rem;\n  border-bottom: 0.0625rem solid var(--border);\n}\n\n.ed-lang-picker__search-icon {\n  color: var(--muted-foreground);\n  flex-shrink: 0;\n  margin-right: 0.375rem;\n}\n\n.ed-lang-picker__search {\n  flex: 1;\n  padding: 0.625rem 0;\n  border: none;\n  background: transparent;\n  color: var(--popover-foreground);\n  font-size: 0.875rem;\n  font-family: inherit;\n  outline: none;\n  min-width: 0;\n}\n\n.ed-lang-picker__search::placeholder {\n  color: var(--muted-foreground);\n}\n\n.ed-lang-picker__list {\n  max-height: 15rem;\n  overflow-y: auto;\n  padding: 0.25rem;\n  display: flex;\n  flex-direction: column;\n  overscroll-behavior: contain;\n}\n\n.ed-lang-picker__group-label {\n  padding: 0.375rem 0.5rem 0.25rem;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: var(--muted-foreground);\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n\n.ed-lang-picker__item {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.375rem 0.5rem;\n  border: none;\n  border-radius: calc(var(--radius-md, 0.5rem) - 2px);\n  background: transparent;\n  color: var(--popover-foreground);\n  font-size: 0.8125rem;\n  font-family: inherit;\n  text-align: left;\n  cursor: pointer;\n  transition: background 0.1s;\n  user-select: none;\n}\n\n.ed-lang-picker__item:hover,\n.ed-lang-picker__item:focus-visible {\n  background: var(--accent);\n  color: var(--accent-foreground);\n  outline: none;\n}\n\n.ed-lang-picker__item--active {\n  background: var(--accent);\n  color: var(--accent-foreground);\n  font-weight: 500;\n}\n\n.ed-lang-picker__item--active::after {\n  content: '';\n  margin-left: auto;\n  width: 0.875rem;\n  height: 0.875rem;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\");\n  background-size: contain;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0.7;\n}\n\n.ed-lang-picker__item--auto {\n  color: var(--muted-foreground);\n  margin-bottom: 0.25rem;\n  padding-bottom: 0.5rem;\n  border-bottom: 0.0625rem solid var(--border);\n  border-radius: 0;\n}\n\n.ed-lang-picker__item--auto:hover {\n  background: var(--accent);\n  color: var(--accent-foreground);\n  border-radius: calc(var(--radius-md, 0.5rem) - 2px);\n  border-bottom-color: transparent;\n}\n\n";
}
//#endregion
//#region src/components/editor/extensions/code-block/CodeMirrorNodeView.ts
var $t = {
	js: "javascript",
	ts: "typescript",
	jsx: "jsx",
	tsx: "tsx",
	py: "python",
	rb: "ruby",
	rs: "rust",
	sh: "shell",
	bash: "shell",
	zsh: "shell",
	yml: "yaml",
	md: "markdown",
	kt: "kotlin",
	cs: "csharp"
}, en = {
	javascript: "JavaScript",
	typescript: "TypeScript",
	jsx: "JSX",
	tsx: "TSX",
	vue: "Vue",
	python: "Python",
	ruby: "Ruby",
	rust: "Rust",
	go: "Go",
	java: "Java",
	csharp: "C#",
	cpp: "C++",
	c: "C",
	php: "PHP",
	swift: "Swift",
	kotlin: "Kotlin",
	shell: "Shell",
	bash: "Bash",
	sql: "SQL",
	html: "HTML",
	css: "CSS",
	scss: "SCSS",
	less: "Less",
	json: "JSON",
	yaml: "YAML",
	toml: "TOML",
	xml: "XML",
	markdown: "Markdown",
	graphql: "GraphQL",
	dockerfile: "Dockerfile"
}, tn = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/></svg>", nn = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/></svg>", rn = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg>", an = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z\"/></svg>", on = [
	{
		lang: "javascript",
		label: "JavaScript"
	},
	{
		lang: "typescript",
		label: "TypeScript"
	},
	{
		lang: "jsx",
		label: "JSX"
	},
	{
		lang: "tsx",
		label: "TSX"
	},
	{
		lang: "vue",
		label: "Vue"
	},
	{
		lang: "python",
		label: "Python"
	},
	{
		lang: "ruby",
		label: "Ruby"
	},
	{
		lang: "rust",
		label: "Rust"
	},
	{
		lang: "go",
		label: "Go"
	},
	{
		lang: "java",
		label: "Java"
	},
	{
		lang: "kotlin",
		label: "Kotlin"
	},
	{
		lang: "swift",
		label: "Swift"
	},
	{
		lang: "csharp",
		label: "C#"
	},
	{
		lang: "cpp",
		label: "C++"
	},
	{
		lang: "c",
		label: "C"
	},
	{
		lang: "php",
		label: "PHP"
	},
	{
		lang: "scala",
		label: "Scala"
	},
	{
		lang: "dart",
		label: "Dart"
	},
	{
		lang: "elixir",
		label: "Elixir"
	},
	{
		lang: "haskell",
		label: "Haskell"
	},
	{
		lang: "lua",
		label: "Lua"
	},
	{
		lang: "perl",
		label: "Perl"
	},
	{
		lang: "r",
		label: "R"
	},
	{
		lang: "shell",
		label: "Shell"
	},
	{
		lang: "bash",
		label: "Bash"
	},
	{
		lang: "powershell",
		label: "PowerShell"
	},
	{
		lang: "sql",
		label: "SQL"
	},
	{
		lang: "html",
		label: "HTML"
	},
	{
		lang: "css",
		label: "CSS"
	},
	{
		lang: "scss",
		label: "SCSS"
	},
	{
		lang: "less",
		label: "Less"
	},
	{
		lang: "json",
		label: "JSON"
	},
	{
		lang: "yaml",
		label: "YAML"
	},
	{
		lang: "toml",
		label: "TOML"
	},
	{
		lang: "xml",
		label: "XML"
	},
	{
		lang: "markdown",
		label: "Markdown"
	},
	{
		lang: "graphql",
		label: "GraphQL"
	},
	{
		lang: "dockerfile",
		label: "Dockerfile"
	}
], sn = class e {
	node;
	view;
	getPos;
	dom;
	cm;
	langConf = new le();
	editableConf = new le();
	wasEditable;
	updating = !1;
	langBadge;
	copyBtn;
	editBtn;
	picker = null;
	copyTimer = null;
	currentLang = null;
	detectTimer = null;
	static COLLAPSE_LINES = 10;
	static COLLAPSED_HEIGHT = "17rem";
	collapseBody;
	collapseBtn;
	fadeEl;
	isCollapsed = !1;
	constructor(t, n, r, i) {
		this.registry = i, this.node = t, this.view = n, this.getPos = r, this.wasEditable = n.editable, this.registry?.add(this), Qt(), this.dom = document.createElement("div"), this.dom.className = "ed-code-block";
		let a = document.createElement("span");
		a.className = "ed-code-block__icon", a.setAttribute("contenteditable", "false"), a.setAttribute("aria-hidden", "true"), a.innerHTML = tn, this.dom.appendChild(a);
		let o = document.createElement("div");
		o.className = "ed-code-block__overlay", o.setAttribute("contenteditable", "false"), this.langBadge = document.createElement("span"), this.langBadge.className = "ed-code-block__lang-badge", this.langBadge.style.display = "none", o.appendChild(this.langBadge), this.editBtn = document.createElement("button"), this.editBtn.className = "ed-code-block__edit-btn", this.editBtn.type = "button", this.editBtn.title = "Выбрать язык", this.editBtn.innerHTML = an, this.editBtn.addEventListener("mousedown", (e) => {
			e.preventDefault(), e.stopPropagation(), this.togglePicker();
		}), o.appendChild(this.editBtn), this.copyBtn = document.createElement("button"), this.copyBtn.className = "ed-code-block__copy-btn", this.copyBtn.type = "button", this.setCopyIdle(), this.copyBtn.addEventListener("mousedown", (e) => {
			e.preventDefault(), this.handleCopy();
		}), o.appendChild(this.copyBtn), this.dom.appendChild(o), this.collapseBody = document.createElement("div"), this.collapseBody.className = "ed-code-block__body";
		let s = document.createElement("div");
		s.className = "ed-code-block__cm", this.collapseBody.appendChild(s), this.fadeEl = document.createElement("div"), this.fadeEl.className = "ed-code-block__fade", this.fadeEl.setAttribute("contenteditable", "false"), this.collapseBody.appendChild(this.fadeEl), this.dom.appendChild(this.collapseBody), this.collapseBtn = document.createElement("button"), this.collapseBtn.className = "ed-code-block__toggle", this.collapseBtn.type = "button", this.collapseBtn.setAttribute("contenteditable", "false"), this.collapseBtn.addEventListener("mousedown", (e) => {
			e.preventDefault(), this.toggleCollapse();
		}), this.dom.appendChild(this.collapseBtn);
		let c = t.textContent ? t.textContent.split("\n").length : 1;
		this.isCollapsed = c > e.COLLAPSE_LINES, this.isCollapsed ? (this.collapseBody.style.height = e.COLLAPSED_HEIGHT, this.collapseBody.style.overflow = "hidden") : this.fadeEl.style.display = "none", this.collapseBtn.style.display = this.isCollapsed ? "" : "none", this.renderCollapseBtn(), this.cm = new G({
			state: ue.create({
				doc: t.textContent,
				extensions: [
					fe(),
					ce(),
					ve(),
					_e(),
					be(),
					ye(Yt, { fallback: !0 }),
					Jt,
					this.langConf.of([]),
					this.editableConf.of(G.editable.of(n.editable)),
					K.of([
						...this.buildKeymap(),
						me,
						...xe,
						...de,
						...pe
					]),
					G.updateListener.of((e) => this.forwardUpdate(e))
				]
			}),
			parent: s
		}), this.applyEditableToChrome(this.wasEditable), setTimeout(() => this.applyLanguage(t.attrs.language, t.textContent), 0);
	}
	normalizeLangName(e) {
		let t = e.toLowerCase();
		return $t[t] ?? t;
	}
	displayName(e) {
		return en[e.toLowerCase()] ?? e;
	}
	updateBadge(e) {
		e ? (this.langBadge.textContent = this.displayName(e), this.langBadge.style.display = "inline") : (this.langBadge.textContent = "", this.langBadge.style.display = "none");
	}
	applyLanguage(e, t) {
		let n = e ? this.normalizeLangName(e) : this.detectLang(t);
		if (n === this.currentLang) return;
		if (this.currentLang = n, this.updateBadge(n), !n) {
			this.cm.dispatch({ effects: this.langConf.reconfigure([]) });
			return;
		}
		let r = ge.matchLanguageName(Se, n, !0);
		if (!r) {
			this.cm.dispatch({ effects: this.langConf.reconfigure([]) });
			return;
		}
		r.load().then((e) => {
			this.cm.dispatch({ effects: this.langConf.reconfigure(e) });
		}).catch(() => {
			this.cm.dispatch({ effects: this.langConf.reconfigure([]) });
		});
	}
	detectLang(e) {
		if (!e || e.trim().length < 20) return null;
		let t = /* @__PURE__ */ "javascript.typescript.python.java.c.cpp.csharp.go.rust.ruby.php.swift.kotlin.scala.r.perl.lua.dart.elixir.haskell.shell.bash.powershell.html.xml.css.scss.json.yaml.toml.sql.markdown.graphql.dockerfile".split(".");
		try {
			return Xt.highlightAuto(e, { subset: t }).data?.language ?? null;
		} catch {
			return null;
		}
	}
	scheduleDetect(e) {
		this.detectTimer && clearTimeout(this.detectTimer), this.detectTimer = setTimeout(() => {
			this.node.attrs.language || this.applyLanguage(null, e);
		}, 600);
	}
	update(e) {
		if (e.type !== this.node.type) return !1;
		if (this.node = e, this.updating) return !0;
		let t = e.textContent, n = this.cm.state.doc.toString();
		if (t !== n) {
			let e = 0, r = n.length, i = t.length;
			for (; e < r && n[e] === t[e];) e++;
			for (; r > e && i > e && n[r - 1] === t[i - 1];) r--, i--;
			this.updating = !0, this.cm.dispatch({ changes: {
				from: e,
				to: r,
				insert: t.slice(e, i)
			} }), this.updating = !1;
		}
		return this.applyLanguage(e.attrs.language, e.textContent), this.syncCollapseState(t), this.syncEditable(), !0;
	}
	forwardUpdate(e) {
		if (this.updating || !this.cm.hasFocus) return;
		let t = this.getPos() + 1, { main: n } = e.state.selection, r = t + n.from, i = t + n.to, a = this.view.state.selection;
		if (e.docChanged || a.from !== r || a.to !== i) {
			let n = this.view.state.tr;
			e.docChanged && (e.changes.iterChanges((e, r, i, a, o) => {
				o.length ? n.replaceWith(t + e, t + r, this.view.state.schema.text(o.toString())) : n.delete(t + e, t + r), t += a - i - (r - e);
			}), this.node.attrs.language || this.scheduleDetect(e.state.doc.toString())), n.setSelection(De.create(n.doc, r, i)), this.view.dispatch(n);
		}
	}
	setSelection(e, t) {
		this.cm.focus(), this.updating = !0, this.cm.dispatch({ selection: {
			anchor: e,
			head: t
		} }), this.updating = !1;
	}
	selectNode() {
		this.cm.focus();
	}
	stopEvent() {
		return !0;
	}
	buildKeymap() {
		return [
			{
				key: "ArrowUp",
				run: () => this.maybeEscape("line", -1)
			},
			{
				key: "ArrowLeft",
				run: () => this.maybeEscape("char", -1)
			},
			{
				key: "ArrowDown",
				run: () => this.maybeEscape("line", 1)
			},
			{
				key: "ArrowRight",
				run: () => this.maybeEscape("char", 1)
			},
			{
				key: "Ctrl-Enter",
				run: () => Oe(this.view.state, this.view.dispatch) ? (this.view.focus(), !0) : !1
			},
			{
				key: "Backspace",
				run: (e) => {
					if (e.state.doc.length === 0) {
						let e = this.getPos();
						return this.view.dispatch(this.view.state.tr.delete(e, e + this.node.nodeSize)), this.view.focus(), !0;
					}
					return !1;
				}
			},
			{
				key: "Ctrl-z",
				mac: "Cmd-z",
				run: () => (Ae(this.view.state, this.view.dispatch), !0)
			},
			{
				key: "Shift-Ctrl-z",
				mac: "Shift-Cmd-z",
				run: () => (ke(this.view.state, this.view.dispatch), !0)
			},
			{
				key: "Ctrl-y",
				mac: "Cmd-y",
				run: () => (ke(this.view.state, this.view.dispatch), !0)
			}
		];
	}
	maybeEscape(e, t) {
		let { state: n } = this.cm, { main: r } = n.selection;
		if (!r.empty) return !1;
		if (e === "line") {
			let e = n.doc.lineAt(r.head);
			if (t < 0 ? e.from > 0 : e.to < n.doc.length) return !1;
		} else if (t < 0 ? r.from > 0 : r.to < n.doc.length) return !1;
		let i = this.getPos() + (t < 0 ? 0 : this.node.nodeSize), a = Ee.near(this.view.state.doc.resolve(i), t);
		return this.view.dispatch(this.view.state.tr.setSelection(a).scrollIntoView()), this.view.focus(), !0;
	}
	setCopyIdle() {
		this.copyBtn.innerHTML = `${nn}<span>Копировать</span>`;
	}
	setCopied() {
		this.copyBtn.innerHTML = `${rn}<span>Скопировано</span>`;
	}
	async handleCopy() {
		try {
			await navigator.clipboard.writeText(this.node.textContent);
		} catch {
			let e = document.createElement("textarea");
			e.value = this.node.textContent, document.body.appendChild(e), e.select(), document.execCommand("copy"), document.body.removeChild(e);
		}
		this.setCopied(), this.copyTimer && clearTimeout(this.copyTimer), this.copyTimer = setTimeout(() => this.setCopyIdle(), 2e3);
	}
	syncCollapseState(t) {
		let n = (t ? t.split("\n").length : 1) > e.COLLAPSE_LINES;
		if (this.collapseBtn.style.display = n ? "" : "none", this.isCollapsed) if (!n) this.collapseBody.style.transition = "none", this.collapseBody.style.height = "", this.collapseBody.style.overflow = "", this.fadeEl.style.display = "none", this.isCollapsed = !1, requestAnimationFrame(() => {
			this.collapseBody.style.transition = "";
		});
		else {
			let e = this.collapseBody.scrollHeight;
			e < this.collapseBody.offsetHeight && (this.collapseBody.style.transition = "none", this.collapseBody.style.height = e + "px", this.fadeEl.style.display = "none", requestAnimationFrame(() => {
				this.collapseBody.style.transition = "";
			}));
		}
	}
	toggleCollapse() {
		let t = this.collapseBody, n = this.isCollapsed;
		if (n) {
			let e = t.scrollHeight + "px";
			t.style.height = e, this.fadeEl.style.display = "none", t.addEventListener("transitionend", () => {
				t.style.height = "auto", t.style.overflow = "";
			}, { once: !0 });
		} else t.style.height = t.scrollHeight + "px", t.style.overflow = "hidden", t.offsetHeight, requestAnimationFrame(() => {
			t.style.height = e.COLLAPSED_HEIGHT, t.addEventListener("transitionend", () => {
				this.fadeEl.style.display = "";
			}, { once: !0 });
		});
		this.isCollapsed = !n, this.renderCollapseBtn();
	}
	renderCollapseBtn() {
		let e = this.isCollapsed ? "0deg" : "180deg";
		this.collapseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           style="transform:rotate(${e});transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);flex-shrink:0">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      <span>${this.isCollapsed ? "Показать полностью" : "Свернуть"}</span>
    `;
	}
	syncEditable() {
		let e = this.view.editable;
		e !== this.wasEditable && (this.wasEditable = e, this.cm.dispatch({ effects: this.editableConf.reconfigure(G.editable.of(e)) }), this.applyEditableToChrome(e));
	}
	applyEditableToChrome(e) {
		this.editBtn.style.display = e ? "" : "none", e || this.closePicker();
	}
	togglePicker() {
		if (this.view.editable) {
			if (this.picker) {
				this.closePicker();
				return;
			}
			this.openPicker();
		}
	}
	openPicker() {
		let e = document.createElement("div");
		e.className = "ed-lang-picker", this.picker = e;
		let t = document.createElement("div");
		t.className = "ed-lang-picker__search-wrap";
		let n = document.createElement("span");
		n.className = "ed-lang-picker__search-icon", n.innerHTML = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.35-4.35\"/></svg>";
		let r = document.createElement("input");
		r.className = "ed-lang-picker__search", r.type = "text", r.placeholder = "Поиск языка...", r.setAttribute("spellcheck", "false"), t.appendChild(n), t.appendChild(r), e.appendChild(t);
		let i = document.createElement("div");
		i.className = "ed-lang-picker__list", e.appendChild(i);
		let a = (e) => {
			i.innerHTML = "";
			let t = e.toLowerCase(), n = document.createElement("button");
			n.className = "ed-lang-picker__item ed-lang-picker__item--auto", n.type = "button", n.textContent = "Авто-определение", this.node.attrs.language || n.classList.add("ed-lang-picker__item--active"), n.addEventListener("mousedown", (e) => {
				e.preventDefault(), this.setLanguage(null);
			}), i.appendChild(n), on.filter(({ label: e }) => !t || e.toLowerCase().includes(t)).forEach(({ lang: e, label: t }) => {
				let n = document.createElement("button");
				n.className = "ed-lang-picker__item", n.type = "button", n.textContent = t, this.node.attrs.language === e && n.classList.add("ed-lang-picker__item--active"), n.addEventListener("mousedown", (t) => {
					t.preventDefault(), this.setLanguage(e);
				}), i.appendChild(n);
			});
		};
		a(""), r.addEventListener("input", () => a(r.value)), document.body.appendChild(e);
		let o = this.editBtn.getBoundingClientRect(), s = e.getBoundingClientRect().height, c = e.getBoundingClientRect().width, l = o.bottom + 6, u = o.right - c;
		u < 8 && (u = 8), l + s > window.innerHeight - 8 && (l = o.top - s - 6), e.style.top = `${l}px`, e.style.left = `${u}px`;
		let d = (t) => {
			!e.contains(t.target) && t.target !== this.editBtn && (this.closePicker(), document.removeEventListener("mousedown", d), document.removeEventListener("keydown", f));
		}, f = (e) => {
			e.key === "Escape" && (this.closePicker(), document.removeEventListener("mousedown", d), document.removeEventListener("keydown", f));
		};
		setTimeout(() => {
			document.addEventListener("mousedown", d), document.addEventListener("keydown", f), r.focus();
		}, 50);
	}
	closePicker() {
		this.picker?.remove(), this.picker = null;
	}
	setLanguage(e) {
		if (!this.view.editable) return;
		let t = this.getPos(), n = this.view.state.tr.setNodeMarkup(t, void 0, {
			...this.node.attrs,
			language: e
		});
		this.view.dispatch(n), this.closePicker(), e ? (this.currentLang = e, this.updateBadge(e), this.applyLanguage(e, this.node.textContent)) : (this.currentLang = null, this.updateBadge(null), this.scheduleDetect(this.node.textContent));
	}
	destroy() {
		this.registry?.delete(this), this.copyTimer && clearTimeout(this.copyTimer), this.detectTimer && clearTimeout(this.detectTimer), this.closePicker(), this.cm.destroy();
	}
}, cn = se.extend({
	addStorage() {
		return { views: /* @__PURE__ */ new Set() };
	},
	addNodeView() {
		return (e) => new sn(e.node, e.editor.view, e.getPos, e.editor.storage.codeBlock?.views);
	}
}).configure({
	exitOnTripleEnter: !1,
	exitOnArrowDown: !1
});
function ln(e) {
	e.storage.codeBlock?.views?.forEach((e) => e.syncEditable());
}
//#endregion
//#region src/components/editor/extensions/bubble-menu/BubbleMenuBar.vue?vue&type=script&setup=true&lang.ts
var un = ["title"], dn = ["title", "onClick"], fn = ["title", "onClick"], pn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "BubbleMenuBar",
	props: { editor: {} },
	setup(c) {
		let u = c, d = b(null), f = b(!1), y = b(0), T = b(0), j = !1;
		function M() {
			let e = u.editor;
			if (!e) {
				f.value = !1;
				return;
			}
			if (d.value?.contains(document.activeElement)) return;
			let { from: t, to: n } = e.state.selection;
			if (t === n || e.isActive("image") || e.isActive("codeBlock")) {
				f.value = !1;
				return;
			}
			j || (f.value = !0, p(() => {
				let r = d.value;
				if (r) try {
					let i = e.view.coordsAtPos(t), a = e.view.coordsAtPos(n), o = (i.left + a.right) / 2;
					y.value = Math.max(r.offsetWidth / 2 + 8, Math.min(o, window.innerWidth - r.offsetWidth / 2 - 8)), T.value = Math.max(8, Math.min(i.top, a.top) - r.offsetHeight - 8);
				} catch {
					f.value = !1;
				}
			}));
		}
		D(() => u.editor, (e, t) => {
			t && t.off("selectionUpdate", M), e && e.on("selectionUpdate", M);
		}, { immediate: !0 });
		function N(e) {
			j = !0, !d.value?.contains(e.target) && (u.editor?.view.dom.contains(e.target) || (f.value = !1, I()));
		}
		function P() {
			j = !1, M();
		}
		_(() => {
			document.addEventListener("mousedown", N), document.addEventListener("mouseup", P);
		}), g(() => {
			document.removeEventListener("mousedown", N), document.removeEventListener("mouseup", P), u.editor?.off("selectionUpdate", M);
		});
		let F = b("toolbar");
		function I() {
			F.value = "toolbar", L.value = "";
		}
		let L = b(""), R = b(null);
		function z() {
			L.value = u.editor?.getAttributes("link").href ?? "", F.value = "link", p(() => {
				R.value?.focus(), R.value?.select();
			});
		}
		function B() {
			let e = L.value.trim();
			e ? u.editor?.chain().focus().extendMarkRange("link").setLink({ href: e }).run() : u.editor?.chain().focus().extendMarkRange("link").unsetLink().run(), I();
		}
		function ee(e) {
			e.key === "Enter" && B(), e.key === "Escape" && (I(), u.editor?.commands.focus());
		}
		let te = [
			{
				label: "Жёлтый",
				value: "#fef08a"
			},
			{
				label: "Зелёный",
				value: "#bbf7d0"
			},
			{
				label: "Голубой",
				value: "#bae6fd"
			},
			{
				label: "Розовый",
				value: "#fbcfe8"
			},
			{
				label: "Оранжевый",
				value: "#fed7aa"
			},
			{
				label: "Фиолетовый",
				value: "#e9d5ff"
			},
			{
				label: "Красный",
				value: "#fecaca"
			},
			{
				label: "Серый",
				value: "#e5e7eb"
			}
		], V = r(() => {
			let e = u.editor;
			return !e || !e.isActive("highlight") ? null : e.getAttributes("highlight").color ?? null;
		});
		function ne(e) {
			let t = u.editor;
			t && (V.value === e ? t.chain().focus().unsetHighlight().run() : t.chain().focus().setHighlight({ color: e }).run(), I());
		}
		function re() {
			u.editor?.chain().focus().unsetHighlight().run(), I();
		}
		let ie = [
			{
				value: "left",
				icon: Ct,
				title: "По левому краю"
			},
			{
				value: "center",
				icon: bt,
				title: "По центру"
			},
			{
				value: "right",
				icon: xt,
				title: "По правому краю"
			}
		], H = r(() => {
			let e = u.editor;
			return e ? e.isActive({ textAlign: "center" }) ? "center" : e.isActive({ textAlign: "right" }) ? "right" : "left" : "left";
		}), ae = r(() => ie.find((e) => e.value === H.value)?.icon ?? Ct), U = b(0), W = b(0);
		function oe() {
			let e = u.editor;
			e && (U.value = e.state.selection.from, W.value = e.state.selection.to, F.value = "turninto");
		}
		let se = r(() => {
			let e = u.editor;
			if (!e) return [];
			let t = () => e.chain().focus().setTextSelection({
				from: U.value,
				to: W.value
			});
			return [
				{
					label: "Текст",
					icon: wt,
					action: () => t().setParagraph().run(),
					isActive: () => e.isActive("paragraph")
				},
				{
					label: "Заголовок 1",
					icon: it,
					action: () => t().setHeading({ level: 1 }).run(),
					isActive: () => e.isActive("heading", { level: 1 })
				},
				{
					label: "Заголовок 2",
					icon: at,
					action: () => t().setHeading({ level: 2 }).run(),
					isActive: () => e.isActive("heading", { level: 2 })
				},
				{
					label: "Заголовок 3",
					icon: ot,
					action: () => t().setHeading({ level: 3 }).run(),
					isActive: () => e.isActive("heading", { level: 3 })
				},
				{
					label: "Список",
					icon: ft,
					action: () => K("bulletList"),
					isActive: () => e.isActive("bulletList")
				},
				{
					label: "Нумерация",
					icon: dt,
					action: () => K("orderedList"),
					isActive: () => e.isActive("orderedList")
				},
				{
					label: "Цитата",
					icon: gt,
					action: () => t().toggleBlockquote().run(),
					isActive: () => e.isActive("blockquote")
				}
			];
		}), G = r(() => {
			let e = u.editor;
			return e ? e.isActive("heading", { level: 1 }) ? "Заголовок 1" : e.isActive("heading", { level: 2 }) ? "Заголовок 2" : e.isActive("heading", { level: 3 }) ? "Заголовок 3" : e.isActive("bulletList") ? "Список" : e.isActive("orderedList") ? "Нумерация" : e.isActive("blockquote") ? "Цитата" : "Текст" : "Текст";
		});
		function ce(e) {
			e.action(), I();
		}
		function K(e) {
			let t = u.editor;
			if (!t) return;
			let { from: n, to: r } = t.state.selection, i = t.state.doc.textBetween(n, r, "\n").split("\n");
			t.chain().focus().deleteSelection().insertContent({
				type: e,
				content: i.map((e) => ({
					type: "listItem",
					content: [{
						type: "paragraph",
						content: e ? [{
							type: "text",
							text: e
						}] : []
					}]
				}))
			}).run();
		}
		function le() {
			let e = u.editor;
			if (!e) return;
			let { from: t, to: n } = e.state.selection, r = e.state.doc.textBetween(t, n, "\n");
			r.includes("\n") ? e.chain().focus().deleteSelection().insertContent({
				type: "codeBlock",
				content: r ? [{
					type: "text",
					text: r
				}] : []
			}).run() : e.chain().focus().toggleCode().run();
		}
		let ue = r(() => {
			let e = u.editor;
			return e ? e.isActive("code") || e.isActive("codeBlock") : !1;
		});
		return (r, u) => (v(), i(t, { to: "body" }, [l(n, { name: "bm" }, {
			default: O(() => [f.value && c.editor ? (v(), o("div", {
				key: 0,
				ref_key: "barRef",
				ref: d,
				class: "bm",
				style: h({
					left: y.value + "px",
					top: T.value + "px"
				}),
				onMousedown: u[11] ||= A(() => {}, ["prevent"])
			}, [F.value === "toolbar" ? (v(), o(e, { key: 0 }, [
				s("button", {
					class: "bm__turn-btn",
					onClick: u[0] ||= (e) => oe()
				}, [s("span", null, C(G.value), 1), l(w(Ze), { size: 11 })]),
				u[12] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: m(["bm__btn", { "bm__btn--active": c.editor.isActive("bold") }]),
					title: "Жирный (Ctrl+B)",
					onClick: u[1] ||= (e) => c.editor.chain().focus().toggleBold().run()
				}, [l(w(Ye), { size: 13 })], 2),
				s("button", {
					class: m(["bm__btn", { "bm__btn--active": c.editor.isActive("italic") }]),
					title: "Курсив (Ctrl+I)",
					onClick: u[2] ||= (e) => c.editor.chain().focus().toggleItalic().run()
				}, [l(w(lt), { size: 13 })], 2),
				s("button", {
					class: m(["bm__btn", { "bm__btn--active": c.editor.isActive("underline") }]),
					title: "Подчёркнутый (Ctrl+U)",
					onClick: u[3] ||= (e) => c.editor.chain().focus().toggleUnderline().run()
				}, [l(w(Tt), { size: 13 })], 2),
				s("button", {
					class: m(["bm__btn", { "bm__btn--active": c.editor.isActive("strike") }]),
					title: "Зачёркнутый",
					onClick: u[4] ||= (e) => c.editor.chain().focus().toggleStrike().run()
				}, [l(w(vt), { size: 13 })], 2),
				s("button", {
					class: m(["bm__btn", { "bm__btn--active": ue.value }]),
					title: "Код",
					onClick: u[5] ||= (e) => le()
				}, [l(w(et), { size: 13 })], 2),
				s("button", {
					class: m(["bm__btn bm__btn--highlight", { "bm__btn--active": c.editor.isActive("highlight") }]),
					title: "Выделить цветом",
					onClick: u[6] ||= (e) => F.value = "highlight"
				}, [l(w(st), { size: 13 }), s("span", {
					class: "bm__hl-dot",
					style: h(V.value ? { background: V.value } : {})
				}, null, 4)], 2),
				u[13] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: "bm__btn",
					title: `Выравнивание: ${H.value}`,
					onClick: u[7] ||= (e) => c.editor.chain().focus().setTextAlign(H.value === "left" ? "center" : H.value === "center" ? "right" : "left").run()
				}, [(v(), i(S(ae.value), { size: 13 }))], 8, un),
				u[14] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: m(["bm__btn", { "bm__btn--active": c.editor.isActive("link") }]),
					title: "Ссылка",
					onClick: z
				}, [l(w(ut), { size: 13 })], 2)
			], 64)) : F.value === "link" ? (v(), o(e, { key: 1 }, [
				s("button", {
					class: "bm__btn",
					onClick: u[8] ||= (e) => {
						I(), c.editor.commands.focus();
					}
				}, [l(w(Qe), { size: 13 })]),
				u[15] ||= s("div", { class: "bm__sep" }, null, -1),
				k(s("input", {
					ref_key: "linkInputRef",
					ref: R,
					"onUpdate:modelValue": u[9] ||= (e) => L.value = e,
					class: "bm__link-input",
					type: "url",
					placeholder: "https://example.com",
					autocomplete: "off",
					spellcheck: "false",
					onMousedown: u[10] ||= A(() => {}, ["stop"]),
					onKeydown: ee
				}, null, 544), [[E, L.value]]),
				s("button", {
					class: "bm__btn bm__btn--confirm",
					onClick: B
				}, [l(w(Xe), { size: 13 })])
			], 64)) : F.value === "turninto" ? (v(), o(e, { key: 2 }, [
				s("button", {
					class: "bm__btn",
					onClick: I
				}, [l(w(Qe), { size: 13 })]),
				u[16] ||= s("div", { class: "bm__sep" }, null, -1),
				(v(!0), o(e, null, x(se.value, (e) => (v(), o("button", {
					key: e.label,
					class: m(["bm__btn", { "bm__btn--active": e.isActive() }]),
					title: e.label,
					onClick: (t) => ce(e)
				}, [(v(), i(S(e.icon), { size: 13 }))], 10, dn))), 128))
			], 64)) : F.value === "highlight" ? (v(), o(e, { key: 3 }, [
				s("button", {
					class: "bm__btn",
					onClick: I
				}, [l(w(Qe), { size: 13 })]),
				u[18] ||= s("div", { class: "bm__sep" }, null, -1),
				(v(), o(e, null, x(te, (e) => s("button", {
					key: e.value,
					class: m(["bm__hl-swatch", { "bm__hl-swatch--active": V.value === e.value }]),
					title: e.label,
					style: h({ background: e.value }),
					onClick: (t) => ne(e.value)
				}, null, 14, fn)), 64)),
				u[19] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: "bm__btn bm__btn--hl-clear",
					title: "Убрать выделение",
					onClick: re
				}, [...u[17] ||= [s("span", { class: "bm__hl-clear-icon" }, "✕", -1)]])
			], 64)) : a("", !0)], 36)) : a("", !0)]),
			_: 1
		})]));
	}
}), [["__scopeId", "data-v-09847e9c"]]), mn = [
	{
		title: "Текст",
		description: "Обычный параграф",
		icon: wt,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setParagraph().run()
	},
	{
		title: "Заголовок 1",
		description: "Большой заголовок",
		icon: it,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHeading({ level: 1 }).run()
	},
	{
		title: "Заголовок 2",
		description: "Средний заголовок",
		icon: at,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHeading({ level: 2 }).run()
	},
	{
		title: "Заголовок 3",
		description: "Небольшой заголовок",
		icon: ot,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHeading({ level: 3 }).run()
	},
	{
		title: "Маркированный список",
		description: "Список с точками",
		icon: ft,
		category: "Списки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).toggleBulletList().run()
	},
	{
		title: "Нумерованный список",
		description: "Список с номерами",
		icon: dt,
		category: "Списки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).toggleOrderedList().run()
	},
	{
		title: "Список задач",
		description: "Список с чекбоксами",
		icon: _t,
		category: "Списки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).insertContent({
			type: "taskList",
			content: [{
				type: "taskItem",
				attrs: { checked: !1 },
				content: [{ type: "paragraph" }]
			}]
		}).run()
	},
	{
		title: "Цитата",
		description: "Выделенная цитата",
		icon: gt,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).toggleBlockquote().run()
	},
	{
		title: "Блок кода",
		description: "Код с подсветкой синтаксиса",
		icon: $e,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setCodeBlock().run()
	},
	{
		title: "Таблица",
		description: "Вставить таблицу 3×3",
		icon: yt,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).insertTable({
			rows: 3,
			cols: 3,
			withHeaderRow: !0
		}).run()
	},
	{
		title: "Разделитель",
		description: "Горизонтальная линия",
		icon: mt,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHorizontalRule().run()
	},
	{
		title: "Изображение",
		description: "По ссылке или с компьютера",
		icon: ct,
		category: "Медиа",
		showImagePopover: !0,
		command: ({ editor: e, range: t, item: n }) => {
			let r = n._src;
			r ? e.chain().focus().deleteRange(t).setImage({ src: r }).run() : e.chain().focus().deleteRange(t).run();
		}
	}
], Q = y({
	visible: !1,
	x: 0,
	y: 0,
	items: [],
	selectedIndex: 0,
	runCommand: null,
	pendingEditor: null,
	pendingRange: null,
	openImagePopover: !1
}), hn = Pe.create({
	name: "slashMenu",
	addProseMirrorPlugins() {
		return [Fe({
			editor: this.editor,
			char: "/",
			allowSpaces: !1,
			items: ({ query: e }) => {
				let t = e.toLowerCase().trim();
				return t ? mn.filter((e) => e.title.toLowerCase().includes(t) || e.description.toLowerCase().includes(t) || e.category.toLowerCase().includes(t)) : mn;
			},
			command: ({ editor: e, range: t, props: n }) => {
				n.command({
					editor: e,
					range: t,
					item: n
				});
			},
			render: () => ({
				onStart(e) {
					Q.items = e.items, Q.selectedIndex = 0, Q.runCommand = (t) => e.command(t), Q.pendingEditor = e.editor, Q.pendingRange = e.range;
					let t = e.clientRect?.();
					t && (Q.x = t.left, Q.y = t.bottom + 6), Q.visible = !0;
				},
				onUpdate(e) {
					Q.items = e.items, Q.selectedIndex = 0, Q.runCommand = (t) => e.command(t), Q.pendingEditor = e.editor, Q.pendingRange = e.range;
					let t = e.clientRect?.();
					t && (Q.x = t.left, Q.y = t.bottom + 6);
				},
				onKeyDown({ event: e }) {
					let t = Q.items.length;
					if (!t) return !1;
					if (e.key === "ArrowUp") return Q.selectedIndex = (Q.selectedIndex - 1 + t) % t, !0;
					if (e.key === "ArrowDown") return Q.selectedIndex = (Q.selectedIndex + 1) % t, !0;
					if (e.key === "Enter") {
						let e = Q.items[Q.selectedIndex];
						return e && (e.showImagePopover ? (Q.visible = !1, Q.openImagePopover = !0) : Q.runCommand?.(e)), !0;
					}
					return !1;
				},
				onExit() {
					Q.visible = !1;
				}
			})
		})];
	}
}), gn = { class: "ip__header" }, _n = { class: "ip__icon" }, vn = { class: "ip__tabs" }, yn = ["disabled"], bn = ["disabled"], xn = { class: "ip__body" }, Sn = { class: "ip__field" }, Cn = {
	key: 0,
	class: "ip__error"
}, wn = {
	key: 0,
	class: "ip__error"
}, Tn = ["disabled"], En = 320, Dn = 160, On = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "ImageInsertPopover",
	props: {
		visible: { type: Boolean },
		x: {},
		y: {},
		onUpload: { type: Function }
	},
	emits: ["insert", "close"],
	setup(u, { emit: d }) {
		let f = u, g = d, _ = b("url"), y = b(""), x = b(""), S = b(null), T = b(null), j = b(!1);
		D(() => f.visible, (e) => {
			e && (_.value = "url", y.value = "", x.value = "", j.value = !1, p(() => S.value?.focus()));
		});
		let M = r(() => {
			let e = Math.min(f.x, window.innerWidth - En - 8), t = f.y + Dn > window.innerHeight ? f.y - Dn - 12 : f.y;
			return {
				left: Math.max(8, e) + "px",
				top: Math.max(8, t) + "px"
			};
		});
		function N() {
			let e = y.value.trim();
			if (!e) {
				x.value = "Введите ссылку";
				return;
			}
			if (!/^https?:\/\//i.test(e)) {
				x.value = "Ссылка должна начинаться с http(s)://";
				return;
			}
			x.value = "", g("insert", e);
		}
		function P(e) {
			e.key === "Enter" && (e.preventDefault(), N()), e.key === "Escape" && (e.preventDefault(), g("close"));
		}
		function F() {
			j.value || T.value?.click();
		}
		async function I(e) {
			let t = e.target, n = t.files?.[0];
			if (t.value = "", n) {
				if (!n.type.startsWith("image/")) {
					x.value = "Выберите файл изображения";
					return;
				}
				if (x.value = "", !f.onUpload) {
					let e = new FileReader();
					e.onload = (e) => g("insert", e.target?.result), e.readAsDataURL(n);
					return;
				}
				j.value = !0;
				try {
					g("insert", await f.onUpload(n));
				} catch (e) {
					x.value = e instanceof Error && e.message ? e.message : "Не удалось загрузить файл";
				} finally {
					j.value = !1;
				}
			}
		}
		function L() {
			j.value || g("close");
		}
		function R(e) {
			e.stopPropagation();
		}
		return (r, d) => (v(), i(t, { to: "body" }, [l(n, { name: "ip" }, {
			default: O(() => [u.visible ? (v(), o("div", {
				key: 0,
				class: "ip-overlay",
				onMousedown: L
			}, [s("div", {
				class: "ip",
				style: h(M.value),
				onMousedown: R
			}, [
				s("div", gn, [
					s("div", _n, [l(w(ct), { size: 14 })]),
					d[4] ||= s("span", { class: "ip__title" }, "Вставить изображение", -1),
					s("button", {
						class: "ip__close",
						onMousedown: d[0] ||= A((e) => g("close"), ["prevent"])
					}, [l(w(Dt), { size: 14 })], 32)
				]),
				s("div", vn, [s("button", {
					class: m(["ip__tab", { "ip__tab--active": _.value === "url" }]),
					disabled: j.value,
					onMousedown: d[1] ||= A(() => {
						_.value = "url", p(() => S.value?.focus());
					}, ["prevent"])
				}, [l(w(ut), { size: 12 }), d[5] ||= c(" По ссылке ", -1)], 42, yn), s("button", {
					class: m(["ip__tab", { "ip__tab--active": _.value === "upload" }]),
					disabled: j.value,
					onMousedown: d[2] ||= A((e) => _.value = "upload", ["prevent"])
				}, [l(w(Et), { size: 12 }), d[6] ||= c(" С компьютера ", -1)], 42, bn)]),
				s("div", xn, [_.value === "url" ? (v(), o(e, { key: 0 }, [
					s("div", Sn, [k(s("input", {
						ref_key: "urlInput",
						ref: S,
						"onUpdate:modelValue": d[3] ||= (e) => y.value = e,
						class: "ip__input",
						type: "url",
						placeholder: "https://example.com/image.png",
						onKeydown: P
					}, null, 544), [[E, y.value]])]),
					x.value ? (v(), o("p", Cn, C(x.value), 1)) : a("", !0),
					s("button", {
						class: "ip__submit",
						onMousedown: A(N, ["prevent"])
					}, " Вставить ", 32)
				], 64)) : (v(), o(e, { key: 1 }, [
					x.value ? (v(), o("p", wn, C(x.value), 1)) : a("", !0),
					s("button", {
						class: "ip__upload-btn",
						disabled: j.value,
						onMousedown: A(F, ["prevent"])
					}, [l(w(Et), { size: 16 }), c(" " + C(j.value ? "Загрузка…" : "Выбрать файл"), 1)], 40, Tn),
					d[7] ||= s("p", { class: "ip__hint" }, "PNG, JPG, GIF, WebP, SVG, AVIF", -1),
					s("input", {
						ref_key: "fileInput",
						ref: T,
						type: "file",
						accept: "image/*",
						style: { display: "none" },
						onChange: I
					}, null, 544)
				], 64))])
			], 36)], 32)) : a("", !0)]),
			_: 1
		})]));
	}
}), [["__scopeId", "data-v-bb658ff5"]]), kn = {
	key: 0,
	class: "sm__empty"
}, An = { class: "sm__group-label" }, jn = ["data-selected", "onMousedown"], Mn = { class: "sm__item-icon" }, Nn = { class: "sm__item-body" }, Pn = { class: "sm__item-title" }, Fn = { class: "sm__item-desc" }, In = 272, Ln = 360, Rn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "SlashMenu",
	props: { onImageUpload: { type: Function } },
	setup(c) {
		let u = r(() => {
			let e = [], t = {}, n = 0;
			for (let r of Q.items) r.category in t || (t[r.category] = e.length, e.push({
				category: r.category,
				items: []
			})), e[t[r.category]].items.push({
				...r,
				index: n++
			});
			return e;
		}), d = b(null);
		D(() => Q.selectedIndex, () => {
			p(() => {
				d.value?.querySelector("[data-selected=\"true\"]")?.scrollIntoView({ block: "nearest" });
			});
		});
		let f = r(() => {
			let e = Math.min(Q.x, window.innerWidth - In - 8), t = Q.y + Ln > window.innerHeight ? Q.y - Ln - 12 : Q.y;
			return {
				left: Math.max(8, e) + "px",
				top: Math.max(8, t) + "px"
			};
		}), g = b(!1), _ = b(0), y = b(0);
		function T() {
			_.value = Q.x, y.value = Q.y, g.value = !0, Q.openImagePopover = !1;
		}
		function E(e) {
			if (e.showImagePopover) {
				Q.visible = !1, T();
				return;
			}
			Q.runCommand?.(e);
		}
		D(() => Q.openImagePopover, (e) => {
			e && T();
		});
		function k(e) {
			g.value = !1;
			let t = Q.pendingEditor, n = Q.pendingRange;
			t && n && (t.chain().focus().deleteRange(n).setImage({ src: e }).run(), p(() => {
				let { doc: e, tr: r } = t.view.state, i = n.from, a = -1;
				if (e.nodesBetween(i, Math.min(i + 5, e.content.size), (e, t) => {
					e.type.name === "image" && a === -1 && (a = t);
				}), a >= 0) {
					let e = Ce.create(t.view.state.doc, a);
					t.view.dispatch(t.view.state.tr.setSelection(e));
				}
			})), Q.pendingEditor = null, Q.pendingRange = null;
		}
		function j() {
			g.value = !1, Q.openImagePopover = !1;
		}
		return (r, p) => (v(), o(e, null, [(v(), i(t, { to: "body" }, [l(n, { name: "sm" }, {
			default: O(() => [w(Q).visible ? (v(), o("div", {
				key: 0,
				class: "sm",
				style: h(f.value)
			}, [w(Q).items.length ? (v(), o("div", {
				key: 1,
				ref_key: "listRef",
				ref: d,
				class: "sm__list"
			}, [(v(!0), o(e, null, x(u.value, (t) => (v(), o("div", {
				key: t.category,
				class: "sm__group"
			}, [s("p", An, C(t.category), 1), (v(!0), o(e, null, x(t.items, (e) => (v(), o("button", {
				key: e.title,
				class: m(["sm__item", { "sm__item--active": e.index === w(Q).selectedIndex }]),
				"data-selected": e.index === w(Q).selectedIndex,
				onMousedown: A((t) => E(e), ["prevent"])
			}, [s("span", Mn, [(v(), i(S(e.icon), { size: 15 }))]), s("span", Nn, [s("span", Pn, C(e.title), 1), s("span", Fn, C(e.description), 1)])], 42, jn))), 128))]))), 128))], 512)) : (v(), o("div", kn, " Ничего не найдено "))], 4)) : a("", !0)]),
			_: 1
		})])), l(On, {
			visible: g.value,
			x: _.value,
			y: y.value,
			"on-upload": c.onImageUpload,
			onInsert: k,
			onClose: j
		}, null, 8, [
			"visible",
			"x",
			"y",
			"on-upload"
		])], 64));
	}
}), [["__scopeId", "data-v-05837410"]]), $ = y({
	visible: !1,
	y: 0,
	blockPos: -1,
	blockEl: null,
	isDragging: !1
}), zn = new Te("dragHandle");
function Bn(e, t) {
	let n = t;
	for (; n && n.parentElement !== e.dom;) n = n.parentElement;
	return n ?? null;
}
var Vn = Pe.create({
	name: "dragHandle",
	addProseMirrorPlugins() {
		let e = this.editor, t = null, n = null;
		function r() {
			return t ||= e.view.dom.closest(".doc-editor"), t;
		}
		function i() {
			n?.removeAttribute("data-dh-hovered"), n = null;
		}
		function a() {
			$.isDragging || (i(), $.visible = !1, $.blockEl = null);
		}
		let o = !1, s = !1;
		function c() {
			e.isEditable && (s = !0);
		}
		function l() {
			s = !1;
		}
		function u(t) {
			if (!e.isEditable) {
				$.visible && (i(), $.visible = !1, $.blockEl = null);
				return;
			}
			if ($.isDragging || s) return;
			let c = r();
			c && !o && (c.addEventListener("mouseleave", a), o = !0);
			let l = t.target;
			if (!c || !c.contains(l) || l.closest("[data-drag-panel]")) return;
			let u = e.view;
			if (!u.dom.contains(l) || l === u.dom) return;
			let d = Bn(u, l);
			if (d) try {
				let e = -1;
				if (u.state.doc.forEach((t, n) => {
					u.nodeDOM(n) === d && (e = n);
				}), e < 0) return;
				let t = d.getBoundingClientRect(), r = parseInt(getComputedStyle(d).lineHeight) || 24, a = c.getBoundingClientRect(), o = d.querySelector("table, img") !== null;
				n !== d && (i(), o || (d.setAttribute("data-dh-hovered", ""), n = d)), $.blockPos = e, $.blockEl = d, $.y = t.top - a.top + Math.max(0, (r - 24) / 2), $.visible = !0;
			} catch {
				$.visible = !1;
			}
		}
		return [new we({
			key: zn,
			view() {
				return document.addEventListener("mousemove", u), document.addEventListener("mousedown", c), document.addEventListener("mouseup", l), { destroy() {
					document.removeEventListener("mousemove", u), document.removeEventListener("mousedown", c), document.removeEventListener("mouseup", l), t?.removeEventListener("mouseleave", a);
				} };
			}
		})];
	}
}), Hn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "DragHandleBar",
	props: { editor: {} },
	setup(e) {
		let t = e, c = r(() => ({ top: `${$.y}px` })), u = b(!1);
		function d(e) {
			let t = [];
			return e.state.doc.forEach((n, r) => {
				let i = e.nodeDOM(r);
				i instanceof HTMLElement && t.push({
					pos: r,
					size: n.nodeSize,
					dom: i,
					rect: i.getBoundingClientRect()
				});
			}), t;
		}
		function f() {
			let e = t.editor;
			if (!e || $.blockPos < 0) return;
			let { doc: n } = e.view.state, r = n.nodeAt($.blockPos);
			if (!r) return;
			if (r.type.name === "paragraph" && r.content.size === 0) {
				e.chain().focus().setTextSelection($.blockPos + 1).insertContent("/").run();
				return;
			}
			let i = $.blockPos + r.nodeSize;
			e.chain().focus().insertContentAt(i, { type: "paragraph" }).setTextSelection(i + 1).insertContent("/").run();
		}
		function p(e) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let n = t.editor;
			if (!n || $.blockPos < 0) return;
			let r = n.view, i = r.dom.closest(".doc-editor");
			if (!i) return;
			let a = d(r), o = a.findIndex((e) => e.pos === $.blockPos);
			if (o < 0) return;
			let s = a[o];
			if (!s) return;
			let c = s.dom, l = a[o + 1], f = l ? l.rect.top - s.rect.top : s.rect.height, p = c.offsetParent ?? document.documentElement, h = p.getBoundingClientRect(), g = s.rect.top - h.top, _ = s.rect.left - h.left, v = e.clientY - s.rect.top;
			u.value = !0, $.isDragging = !0, $.visible = !1, document.body.style.userSelect = "none", document.body.style.cursor = "grabbing", c.removeAttribute("data-dh-hovered");
			let y = r.domObserver;
			y?.stop?.(), Object.assign(c.style, {
				position: "absolute",
				top: `${g}px`,
				left: `${_ - 6}px`,
				width: `${s.rect.width + 6}px`,
				margin: "0",
				paddingLeft: "6px",
				boxSizing: "border-box",
				zIndex: "10",
				willChange: "box-shadow",
				transition: "none"
			}), a.forEach((e, t) => {
				t !== o && (e.dom.style.transition = "none", e.dom.style.willChange = "transform");
			}), S(o), i.offsetHeight, a.forEach((e, t) => {
				t !== o && (e.dom.style.transition = "transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)");
			}), requestAnimationFrame(() => {
				c.style.transition = "box-shadow 0.15s ease-out", c.style.borderRadius = "var(--radius-md, 0.375rem)", c.style.boxShadow = "inset 0 0 0 2px var(--border), 0 4px 16px -4px rgba(0,0,0,.12)", c.style.background = "var(--background)";
			});
			let b = o;
			function x(e) {
				let t = 0;
				for (let n = 0; n < a.length; n++) {
					if (n === o) continue;
					let r = a[n]?.rect;
					r && e > r.top + r.height / 2 && t++;
				}
				return t;
			}
			function S(e) {
				a.forEach((t, n) => {
					if (n === o) return;
					let r = n < o ? n : n - 1, i = 0;
					i = n < o ? r >= e ? f : 0 : r < e ? 0 : f, t.dom.style.transform = i ? `translateY(${i}px)` : "";
				});
			}
			function C(e) {
				let t = p.getBoundingClientRect();
				c.style.top = `${e.clientY - v - t.top}px`;
				let n = x(e.clientY);
				n !== b && (b = n, S(n));
			}
			function w() {
				Object.assign(c.style, {
					position: "",
					top: "",
					left: "",
					width: "",
					margin: "",
					zIndex: "",
					willChange: "",
					transform: "",
					transition: "",
					boxShadow: "",
					borderRadius: "",
					background: "",
					paddingLeft: "",
					boxSizing: ""
				}), a.forEach((e, t) => {
					t !== o && (e.dom.style.transition = "", e.dom.style.transform = "", e.dom.style.willChange = "");
				}), y?.start?.(), document.body.style.userSelect = "", document.body.style.cursor = "", u.value = !1, $.isDragging = !1;
			}
			function T() {
				window.removeEventListener("mousemove", C), window.removeEventListener("mouseup", T);
				let e = b;
				w(), e !== o && m(n, o, e);
			}
			window.addEventListener("mousemove", C), window.addEventListener("mouseup", T);
		}
		function m(e, t, n) {
			let { state: r } = e.view, { doc: i } = r, a = [];
			if (i.forEach((e, t) => a.push({
				pos: t,
				size: e.nodeSize,
				node: e
			})), t < 0 || t >= a.length) return;
			let o = a[t];
			if (!o || n === t) return;
			let s = a.filter((e, n) => n !== t), c;
			if (n <= 0) {
				let e = a[0];
				if (!e) return;
				c = e.pos;
			} else if (n >= s.length) {
				let e = s[s.length - 1];
				if (!e) return;
				c = e.pos + e.size;
			} else {
				let e = s[n];
				if (!e) return;
				c = e.pos;
			}
			let l = r.tr;
			l.delete(o.pos, o.pos + o.size), o.pos < c && (c -= o.size), l.insert(c, o.node), e.view.dispatch(l), e.view.focus();
		}
		return (t, r) => (v(), i(n, { name: "dh" }, {
			default: O(() => [w($).visible && e.editor && !u.value ? (v(), o("div", {
				key: 0,
				class: "dh",
				style: h(c.value),
				"data-drag-panel": ""
			}, [s("button", {
				class: "dh__btn",
				title: "Добавить блок",
				onMousedown: A(f, ["prevent"])
			}, [l(w(ht), { size: 14 })], 32), s("div", {
				class: "dh__btn dh__grip",
				title: "Перетащить блок",
				onMousedown: p
			}, [l(w(rt), { size: 14 })], 32)], 4)) : a("", !0)]),
			_: 1
		}));
	}
}), [["__scopeId", "data-v-ec6c96bb"]]), Un = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ё: "e",
	ж: "zh",
	з: "z",
	и: "i",
	й: "y",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "h",
	ц: "ts",
	ч: "ch",
	ш: "sh",
	щ: "sch",
	ъ: "",
	ы: "y",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya"
};
function Wn(e) {
	let t = e.toLowerCase().trim(), n = "";
	for (let e of t) e in Un ? n += Un[e] : /[a-z0-9]/.test(e) ? n += e : n += "-";
	return n.replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function Gn(e, t) {
	let n = Wn(e) || "zagolovok", r = t.get(n) ?? 0;
	return t.set(n, r + 1), r === 0 ? n : `${n}-${r + 1}`;
}
function Kn(e) {
	let t = e;
	return typeof t.text == "string" ? t.text : Array.isArray(t.content) ? t.content.map(Kn).join("") : "";
}
function qn(e) {
	if (!e) return [];
	let t = typeof e.toJSON == "function" ? e.toJSON() : e, n = /* @__PURE__ */ new Map(), r = [];
	for (let e of t.content ?? []) {
		let t = e;
		if (t.type !== "heading") continue;
		let i = t.attrs?.level;
		if (i !== 1 && i !== 2 && i !== 3) continue;
		let a = Kn(e);
		r.push({
			level: i,
			text: a,
			id: Gn(a, n)
		});
	}
	return r;
}
//#endregion
//#region src/components/editor/extensions/heading/index.ts
var Jn = new Te("headingAnchor"), Yn = Pe.create({
	name: "headingAnchor",
	addProseMirrorPlugins() {
		return [new we({
			key: Jn,
			props: { decorations(e) {
				let t = /* @__PURE__ */ new Map(), n = [];
				return e.doc.forEach((e, r) => {
					if (e.type.name !== "heading") return;
					let i = e.attrs.level;
					if (i !== 1 && i !== 2 && i !== 3) return;
					let a = Gn(e.textContent, t);
					n.push(Ie.node(r, r + e.nodeSize, { id: a }));
				}), Le.create(e.doc, n);
			} }
		})];
	}
}), Xn = {
	key: 2,
	class: "doc-editor__uploading"
}, Zn = "<p></p>", Qn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "DocEditor",
	props: {
		modelValue: { default: "" },
		outputFormat: { default: "html" },
		editable: {
			type: Boolean,
			default: !0
		},
		onImageUpload: {},
		extensions: {}
	},
	emits: [
		"update:modelValue",
		"imageUploadError",
		"parseError"
	],
	setup(t, { expose: n, emit: r }) {
		V.use({
			gfm: !0,
			breaks: !0
		});
		function s(e) {
			return /^#{1,6}\s|^\s*[-*+]\s|^\s*\|.+\||\*\*.+\*\*|__.+__|`{1,3}|\[.+\]\(.+\)|\n\|[-:| ]+\|/m.test(e);
		}
		let c = new ne({
			headingStyle: "atx",
			hr: "---",
			bulletListMarker: "-",
			codeBlockStyle: "fenced",
			fence: "```",
			emDelimiter: "_",
			strongDelimiter: "**",
			linkStyle: "inlined"
		});
		c.addRule("table", {
			filter: ["table"],
			replacement(e, t) {
				let n = Array.from(t.querySelectorAll("tr"));
				if (!n.length) return "";
				let r = (e, t) => {
					let n = Array.from(e.querySelectorAll("th, td")).map((e) => e.textContent?.trim().replace(/\|/g, "\\|") ?? ""), r = `| ${n.join(" | ")} |`, i = `| ${n.map(() => "---").join(" | ")} |`;
					return t ? `${r}\n${i}` : r;
				};
				return "\n\n" + n.map((e, t) => r(e, t === 0)).join("\n") + "\n\n";
			}
		}), c.addRule("highlight", {
			filter: ["mark"],
			replacement: (e) => `==${e}==`
		}), c.addRule("underline", {
			filter: ["u"],
			replacement: (e) => `<u>${e}</u>`
		}), c.addRule("taskItem", {
			filter(e) {
				return e.nodeName === "LI" && e.parentElement?.getAttribute("data-type") === "taskList";
			},
			replacement(e, t) {
				return `- [${t.getAttribute("data-checked") === "true" ? "x" : " "}] ${e.trim()}\n`;
			}
		});
		function u(e) {
			return c.turndown(e);
		}
		let d = t, f = r;
		function p(e) {
			if (!e) return Zn;
			try {
				if (d.outputFormat === "json") return JSON.parse(e);
				if (d.outputFormat === "markdown") return V.parse(e);
			} catch (e) {
				return f("parseError", e), Zn;
			}
			return e;
		}
		function h(e) {
			switch (d.outputFormat) {
				case "json": return JSON.stringify(e.getJSON());
				case "text": return e.getText();
				case "markdown": return u(e.getHTML());
				default: return e.getHTML();
			}
		}
		let _ = d.modelValue, y = b(!1);
		async function x(e) {
			if (!d.onImageUpload) {
				let t = new FileReader();
				t.onload = (e) => {
					let t = e.target?.result;
					C.value?.commands.setImage({ src: t });
				}, t.readAsDataURL(e);
				return;
			}
			y.value = !0;
			try {
				let t = await d.onImageUpload(e);
				C.value?.commands.setImage({ src: t });
			} catch (e) {
				f("imageUploadError", e);
			} finally {
				y.value = !1;
			}
		}
		let S = b(null), C = I({
			content: p(d.modelValue),
			editable: d.editable,
			extensions: [
				L.configure({
					heading: { levels: [
						1,
						2,
						3
					] },
					blockquote: !1,
					codeBlock: !1,
					link: !1,
					underline: !1
				}),
				R.configure({
					placeholder: ({ editor: e, node: t }) => !e.isEditable || t.type.name === "codeBlock" ? "" : t.type.name === "heading" ? {
						1: "Заголовок 1",
						2: "Заголовок 2",
						3: "Заголовок 3"
					}[t.attrs.level] ?? "" : "Введите текст или нажмите / для команд",
					includeChildren: !0
				}),
				B,
				z.configure({ nested: !0 }),
				Ne,
				Mt,
				te.configure({ multicolor: !0 }),
				Rt,
				W.configure({ types: ["heading", "paragraph"] }),
				qt,
				cn,
				...Nt,
				hn,
				Vn,
				Yn,
				...d.extensions ?? []
			],
			editorProps: {
				attributes: { class: "doc-editor__content" },
				handlePaste(e, t) {
					let n = t.clipboardData;
					if (!n) return !1;
					let r = Array.from(n.items).find((e) => e.kind === "file" && e.type.startsWith("image/"));
					if (r) {
						t.preventDefault();
						let e = r.getAsFile();
						return e && x(e), !0;
					}
					let i = n.getData("text/plain") ?? "", a = n.getData("text/html") ?? "";
					return !a && /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(i.trim()) ? (t.preventDefault(), C.value?.commands.setImage({ src: i.trim() }), !0) : a && /<[a-z][\s\S]*>/i.test(a) ? !1 : i && s(i) ? (t.preventDefault(), C.value?.commands.insertContent(V.parse(i)), !0) : !1;
				},
				handleDrop(e, t) {
					let n = t.dataTransfer?.files, r = n && n.length ? n[0] : null;
					return !r || !r.type.startsWith("image/") ? !1 : (t.preventDefault(), x(r), !0);
				}
			},
			onUpdate: ({ editor: e }) => {
				let t = h(e);
				_ = t, f("update:modelValue", t);
			}
		});
		return D(() => d.modelValue, (e) => {
			!C.value || e === _ || C.value.commands.setContent(p(e), { emitUpdate: !1 });
		}), D(() => d.editable, (e) => {
			let t = C.value;
			t && (t.setEditable(e), ln(t));
		}), g(() => {
			C.value?.destroy();
		}), n({ editor: C }), (n, r) => (v(), o("div", {
			ref_key: "wrapRef",
			ref: S,
			class: m(["doc-editor", { "doc-editor--readonly": !t.editable }])
		}, [
			t.editable ? (v(), o(e, { key: 0 }, [
				l(pn, { editor: w(C) }, null, 8, ["editor"]),
				l(Rn, { "on-image-upload": t.onImageUpload }, null, 8, ["on-image-upload"]),
				l(Hn, { editor: w(C) }, null, 8, ["editor"])
			], 64)) : a("", !0),
			l(w(j), { editor: w(C) }, null, 8, ["editor"]),
			l(Vt, {
				wrap: S.value,
				"onUpdate:wrap": r[0] ||= (e) => S.value = e,
				editor: w(C)
			}, null, 8, ["wrap", "editor"]),
			t.editable ? (v(), i(Lt, {
				key: 1,
				wrap: S.value,
				"onUpdate:wrap": r[1] ||= (e) => S.value = e,
				editor: w(C)
			}, null, 8, ["wrap", "editor"])) : a("", !0),
			y.value ? (v(), o("div", Xn, "Загрузка изображения…")) : a("", !0)
		], 2));
	}
}), [["__scopeId", "data-v-3880cb0b"]]);
//#endregion
export { Qn as DocEditor, mn as SLASH_ITEMS, Gn as anchorFor, qt as blockquoteExtension, cn as codeBlockExtension, qn as collectHeadings, Vn as dragHandleExtension, $ as dragHandleState, Yn as headingAnchorExtension, Mt as imageExtension, Rt as linkExtension, hn as slashMenuExtension, Q as slashState, Wn as slugify, ln as syncCodeBlocksEditable, Nt as tableExtensions };

//# sourceMappingURL=index.js.map