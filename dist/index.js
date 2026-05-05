import { Fragment as e, Teleport as t, Transition as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, defineComponent as u, mergeModels as d, nextTick as f, normalizeClass as p, normalizeStyle as m, onBeforeUnmount as h, onMounted as g, openBlock as _, reactive as v, ref as y, renderList as b, resolveDynamicComponent as x, toDisplayString as S, unref as C, useModel as w, vModelText as T, watch as E, withCtx as D, withDirectives as O, withModifiers as k } from "vue";
import { EditorContent as A, NodeViewContent as j, NodeViewWrapper as M, VueNodeViewRenderer as N, nodeViewProps as P, useEditor as F } from "@tiptap/vue-3";
import I from "@tiptap/starter-kit";
import L from "@tiptap/extension-placeholder";
import { TaskItem as R, TaskList as z } from "@tiptap/extension-list";
import { Image as B } from "@tiptap/extension-image";
import { AlignCenter as ee, AlignJustify as te, AlignLeft as V, AlignRight as ne, ArrowDownFromLine as re, ArrowLeftFromLine as H, ArrowRightFromLine as ie, ArrowUpFromLine as ae, Bold as oe, Check as se, CheckSquare as ce, ChevronDown as le, ChevronLeft as U, Code as ue, Code2 as W, Copy as de, ExternalLink as G, GripVertical as K, Heading1 as fe, Heading2 as pe, Heading3 as me, Highlighter as he, Image as ge, ImageIcon as _e, Italic as ve, Link as ye, List as be, ListOrdered as xe, Maximize2 as Se, Minus as Ce, Plus as q, Quote as J, Strikethrough as we, Table as Te, Trash2 as Y, Type as Ee, Underline as De, Upload as Oe, X as ke } from "lucide-vue-next";
import Ae from "@tiptap/extension-highlight";
import { marked as je } from "marked";
import Me from "turndown";
import { Table as Ne } from "@tiptap/extension-table";
import { TableRow as Pe } from "@tiptap/extension-table-row";
import { TableCell as Fe } from "@tiptap/extension-table-cell";
import { TableHeader as Ie } from "@tiptap/extension-table-header";
import Le from "@tiptap/extension-link";
import Re from "@tiptap/extension-text-align";
import { Blockquote as ze } from "@tiptap/extension-blockquote";
import { CodeBlock as Be } from "@tiptap/extension-code-block";
import { EditorView as Ve, drawSelection as He, keymap as Ue } from "@codemirror/view";
import { Compartment as We, EditorState as Ge } from "@codemirror/state";
import { defaultKeymap as Ke, history as qe, historyKeymap as Je, indentWithTab as Ye } from "@codemirror/commands";
import { HighlightStyle as Xe, LanguageDescription as Ze, bracketMatching as Qe, indentOnInput as $e, syntaxHighlighting as et } from "@codemirror/language";
import { closeBrackets as tt, closeBracketsKeymap as nt } from "@codemirror/autocomplete";
import { languages as rt } from "@codemirror/language-data";
import { NodeSelection as it, Plugin as at, PluginKey as ot, Selection as st, TextSelection as ct } from "@tiptap/pm/state";
import { exitCode as lt } from "@tiptap/pm/commands";
import { redo as ut, undo as dt } from "@tiptap/pm/history";
import { tags as X } from "@lezer/highlight";
import { all as ft, createLowlight as pt } from "lowlight";
import mt from "@tiptap/extension-underline";
import { Extension as ht } from "@tiptap/core";
import gt from "@tiptap/suggestion";
//#region src/components/editor/extensions/image/ImageView.vue?vue&type=script&setup=true&lang.ts
var _t = {
	key: 0,
	class: "img-nv__toolbar"
}, vt = ["src", "alt"], yt = /* @__PURE__ */ u({
	__name: "ImageView",
	props: {
		node: {},
		updateAttributes: { type: Function },
		selected: { type: Boolean },
		editor: {},
		deleteNode: { type: Function }
	},
	setup(t) {
		let c = t, u = y(null), d = y(!1), f = "right", g = 0, v = 0;
		function b(e, t) {
			e.preventDefault(), f = t, g = e.clientX, v = c.node.attrs.width ?? u.value?.offsetWidth ?? 400, d.value = !0, window.addEventListener("mousemove", x), window.addEventListener("mouseup", S);
		}
		function x(e) {
			let t = f === "right" ? e.clientX - g : g - e.clientX, n = Math.max(80, Math.round(v + t));
			c.updateAttributes({ width: n });
		}
		function S() {
			d.value = !1, window.removeEventListener("mousemove", x), window.removeEventListener("mouseup", S);
		}
		h(() => {
			window.removeEventListener("mousemove", x), window.removeEventListener("mouseup", S);
		});
		let w = r(() => c.node.attrs.align ?? "center"), T = {
			left: "flex-start",
			center: "center",
			right: "flex-end"
		}, E = r(() => ({ justifyContent: T[w.value] ?? "center" })), O = r(() => ({
			width: c.node.attrs.width ? `${c.node.attrs.width}px` : void 0,
			maxWidth: "100%"
		}));
		return (r, c) => (_(), i(C(M), {
			class: p(["img-nv", { "img-nv--resizing": d.value }]),
			style: m(E.value)
		}, {
			default: D(() => [s("div", { class: p(["img-nv__wrap", {
				"img-nv__wrap--selected": t.selected,
				"img-nv__wrap--active": t.selected || d.value
			}]) }, [
				l(n, { name: "img-tb" }, {
					default: D(() => [t.selected || d.value ? (_(), o("div", _t, [
						s("button", {
							class: p(["img-nv__tb-btn", { "img-nv__tb-btn--active": w.value === "left" }]),
							title: "По левому краю",
							onMousedown: c[0] ||= k((e) => t.updateAttributes({ align: "left" }), ["prevent"])
						}, [l(C(V), { size: 13 })], 34),
						s("button", {
							class: p(["img-nv__tb-btn", { "img-nv__tb-btn--active": w.value === "center" }]),
							title: "По центру",
							onMousedown: c[1] ||= k((e) => t.updateAttributes({ align: "center" }), ["prevent"])
						}, [l(C(ee), { size: 13 })], 34),
						s("button", {
							class: p(["img-nv__tb-btn", { "img-nv__tb-btn--active": w.value === "right" }]),
							title: "По правому краю",
							onMousedown: c[2] ||= k((e) => t.updateAttributes({ align: "right" }), ["prevent"])
						}, [l(C(ne), { size: 13 })], 34),
						c[6] ||= s("div", { class: "img-nv__tb-sep" }, null, -1),
						s("button", {
							class: "img-nv__tb-btn img-nv__tb-btn--danger",
							title: "Удалить",
							onMousedown: c[3] ||= k((...e) => t.deleteNode && t.deleteNode(...e), ["prevent"])
						}, [l(C(Y), { size: 13 })], 32)
					])) : a("", !0)]),
					_: 1
				}),
				s("img", {
					ref_key: "imgRef",
					ref: u,
					src: t.node.attrs.src,
					alt: t.node.attrs.alt ?? "",
					style: m(O.value),
					draggable: "false",
					class: "img-nv__img"
				}, null, 12, vt),
				t.selected || d.value ? (_(), o(e, { key: 0 }, [s("div", {
					class: "img-nv__handle img-nv__handle--left",
					onMousedown: c[4] ||= k((e) => b(e, "left"), ["prevent"])
				}, null, 32), s("div", {
					class: "img-nv__handle img-nv__handle--right",
					onMousedown: c[5] ||= k((e) => b(e, "right"), ["prevent"])
				}, null, 32)], 64)) : a("", !0)
			], 2)]),
			_: 1
		}, 8, ["class", "style"]));
	}
}), Z = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, bt = /* @__PURE__ */ Z(yt, [["__scopeId", "data-v-7c2ab3a4"]]), xt = B.extend({
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
		return N(bt);
	}
}).configure({ inline: !1 }), St = [
	Ne.configure({ resizable: !0 }),
	Pe,
	Ie,
	Fe
], Ct = { class: "tbl-ctx-group" }, wt = { class: "tbl-ctx-group" }, Tt = { class: "tbl-ctx-group" }, Et = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "TableControls",
	props: /* @__PURE__ */ d({ editor: {} }, {
		wrap: { default: null },
		wrapModifiers: {}
	}),
	emits: ["update:wrap"],
	setup(r) {
		let c = r, u = w(r, "wrap"), d = y(null), f = y(!1);
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
		function g() {
			d.value = null;
		}
		function v(e) {
			let t = d.value, n = c.editor;
			if (!(!t || !n)) {
				g();
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
		function b() {
			let e = d.value, t = c.editor;
			if (!e || !t) return;
			g();
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
			g();
			let n = e.anchorCell.closest("table"), r = n?.closest(".tableWrapper") ?? n?.parentElement;
			if (!n || !r) return;
			let i = r.clientWidth;
			if (!i) return;
			let a = n.style.tableLayout, o = n.style.width;
			n.style.tableLayout = "auto", n.style.width = "auto";
			let s = Array.from(n.querySelectorAll("tr:first-child th, tr:first-child td")).map((e) => e.offsetWidth), l = s.reduce((e, t) => e + t, 0);
			n.style.tableLayout = a, n.style.width = o;
			let u = i / Math.max(l, 1), f = s.map((e) => Math.max(64, Math.round(e * u))), p = f.reduce((e, t) => e + t, 0), m = f.length - 1;
			m >= 0 && (f[m] = Math.max(64, (f[m] ?? 0) + (i - p)));
			let h = t.view, _ = h.state.tr, v = !1;
			n.querySelectorAll("tr").forEach((e) => {
				Array.from(e.querySelectorAll("td, th")).forEach((e, t) => {
					if (!(t >= f.length)) try {
						let n = h.posAtDOM(e, 0) - 1, r = _.doc.nodeAt(n);
						if (!r) return;
						_ = _.setNodeMarkup(n, void 0, {
							...r.attrs,
							colwidth: [f[t]]
						}), v = !0;
					} catch {}
				});
			}), v && h.dispatch(_);
		}
		let S = y(null), T = y(null), O = y(null), A = null, j = null;
		function M() {
			A ||= setTimeout(() => {
				S.value = null, T.value = null, O.value = null, A = null;
			}, 400);
		}
		function N() {
			A &&= (clearTimeout(A), null);
		}
		function P() {
			S.value = null, T.value = null, O.value = null, A &&= (clearTimeout(A), null);
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
			A &&= (clearTimeout(A), null), I(t);
			let n = t.getBoundingClientRect(), r = (t.closest(".tableWrapper") ?? t).getBoundingClientRect();
			S.value = {
				top: n.bottom,
				left: r.left + r.width / 2,
				table: t
			}, T.value = {
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
					O.value = {
						left: o.right,
						top: n.top + n.height / 2,
						height: 24
					}, i = !0;
					break;
				}
			}
			i || (O.value = null);
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
			let e = c.editor, t = T.value?.table;
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
		return E(u, (e, t) => {
			t && (t.removeEventListener("contextmenu", p), t.removeEventListener("mousemove", F), t.removeEventListener("mouseleave", M)), e && (e.addEventListener("contextmenu", p), e.addEventListener("mousemove", F), e.addEventListener("mouseleave", M), B = () => {
				e.removeEventListener("contextmenu", p), e.removeEventListener("mousemove", F), e.removeEventListener("mouseleave", M);
			});
		}, { immediate: !0 }), h(() => {
			B?.(), j !== null && cancelAnimationFrame(j);
		}), (r, c) => (_(), o(e, null, [
			(_(), i(t, { to: "body" }, [d.value ? (_(), o("div", {
				key: 0,
				class: "tbl-ctx-overlay",
				onMousedown: k(g, ["self"])
			}, null, 32)) : a("", !0)])),
			l(n, { name: "tbl-ctx" }, {
				default: D(() => [d.value ? (_(), o("div", {
					key: 0,
					class: "tbl-ctx-menu",
					style: m({
						top: d.value.top + "px",
						left: d.value.left + "px"
					})
				}, [
					s("div", Ct, [
						c[10] ||= s("p", { class: "tbl-ctx-label" }, "Добавить", -1),
						f.value ? a("", !0) : (_(), o("button", {
							key: 0,
							class: "tbl-ctx-item",
							onMousedown: c[0] ||= k((e) => v("addRowBefore"), ["prevent"])
						}, [l(C(ae), { size: 13 }), c[6] ||= s("span", null, "Строку выше", -1)], 32)),
						s("button", {
							class: "tbl-ctx-item",
							onMousedown: c[1] ||= k((e) => v("addRowAfter"), ["prevent"])
						}, [l(C(re), { size: 13 }), c[7] ||= s("span", null, "Строку ниже", -1)], 32),
						s("button", {
							class: "tbl-ctx-item",
							onMousedown: c[2] ||= k((e) => v("addColumnBefore"), ["prevent"])
						}, [l(C(H), { size: 13 }), c[8] ||= s("span", null, "Столбец слева", -1)], 32),
						s("button", {
							class: "tbl-ctx-item",
							onMousedown: c[3] ||= k((e) => v("addColumnAfter"), ["prevent"])
						}, [l(C(ie), { size: 13 }), c[9] ||= s("span", null, "Столбец справа", -1)], 32)
					]),
					c[16] ||= s("div", { class: "tbl-ctx-separator" }, null, -1),
					s("div", wt, [s("button", {
						class: "tbl-ctx-item",
						onMousedown: k(b, ["prevent"])
					}, [l(C(te), { size: 13 }), c[11] ||= s("span", null, "Равная ширина столбцов", -1)], 32), s("button", {
						class: "tbl-ctx-item",
						onMousedown: k(x, ["prevent"])
					}, [l(C(Se), { size: 13 }), c[12] ||= s("span", null, "По ширине страницы", -1)], 32)]),
					c[17] ||= s("div", { class: "tbl-ctx-separator" }, null, -1),
					s("div", Tt, [
						c[15] ||= s("p", { class: "tbl-ctx-label" }, "Удалить", -1),
						s("button", {
							class: "tbl-ctx-item tbl-ctx-item--danger",
							onMousedown: c[4] ||= k((e) => v("deleteRow"), ["prevent"])
						}, [l(C(Y), { size: 13 }), c[13] ||= s("span", null, "Строку", -1)], 32),
						s("button", {
							class: "tbl-ctx-item tbl-ctx-item--danger",
							onMousedown: c[5] ||= k((e) => v("deleteColumn"), ["prevent"])
						}, [l(C(Y), { size: 13 }), c[14] ||= s("span", null, "Столбец", -1)], 32)
					])
				], 4)) : a("", !0)]),
				_: 1
			}),
			(_(), i(t, { to: "body" }, [
				l(n, { name: "tbl-resize" }, {
					default: D(() => [O.value ? (_(), o("div", {
						key: 0,
						class: "tbl-resize-handle",
						style: m({
							left: O.value.left + "px",
							top: O.value.top + "px",
							height: O.value.height + "px"
						})
					}, null, 4)) : a("", !0)]),
					_: 1
				}),
				l(n, { name: "tbl-add" }, {
					default: D(() => [S.value ? (_(), o("button", {
						key: 0,
						class: "tbl-add-btn tbl-add-btn--row",
						style: m({
							top: S.value.top + "px",
							left: S.value.left + "px"
						}),
						onMouseenter: N,
						onMouseleave: M,
						onMousedown: k(R, ["prevent"]),
						title: "Добавить строку"
					}, [l(C(q), { size: 12 })], 36)) : a("", !0)]),
					_: 1
				}),
				l(n, { name: "tbl-add" }, {
					default: D(() => [T.value ? (_(), o("button", {
						key: 0,
						class: "tbl-add-btn tbl-add-btn--col",
						style: m({
							top: T.value.top + "px",
							left: T.value.left + "px"
						}),
						onMouseenter: N,
						onMouseleave: M,
						onMousedown: k(z, ["prevent"]),
						title: "Добавить столбец"
					}, [l(C(q), { size: 12 })], 36)) : a("", !0)]),
					_: 1
				})
			]))
		], 64));
	}
}), [["__scopeId", "data-v-23910278"]]), Dt = Le.configure({
	openOnClick: !1,
	autolink: !0,
	linkOnPaste: !0,
	HTMLAttributes: {
		class: "ed-link",
		rel: "noopener noreferrer"
	}
}), Ot = { class: "lnk-ctx__input-row" }, kt = { class: "lnk-ctx__actions" }, At = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "LinkControls",
	props: /* @__PURE__ */ d({ editor: {} }, {
		wrap: { default: null },
		wrapModifiers: {}
	}),
	emits: ["update:wrap"],
	setup(r) {
		let c = r, u = w(r, "wrap");
		function d(e) {
			e.target.closest("a.ed-link") && e.preventDefault();
		}
		function p(e) {
			let t = e.target.closest("a.ed-link");
			t && (e.preventDefault(), e.stopImmediatePropagation(), (e.ctrlKey || e.metaKey) && window.open(t.href, "_blank", "noopener,noreferrer"));
		}
		let g = y(null), v = y(null), b = y("");
		function x(e) {
			let t = e.target.closest("a.ed-link");
			if (!t) return;
			e.preventDefault(), e.stopImmediatePropagation();
			let n = c.editor, r = u.value;
			if (!(!n || !r)) try {
				let i = n.view.posAtDOM(t, 0), a = r.getBoundingClientRect();
				g.value = {
					top: e.clientY - a.top + 4,
					left: e.clientX - a.left + 4,
					pos: i,
					originalHref: t.href
				}, b.value = t.href, f(() => {
					v.value?.focus(), v.value?.select();
				});
			} catch (e) {
				console.error("[LinkControls] posAtDOM error:", e);
			}
		}
		function S() {
			A && clearTimeout(A), g.value = null, b.value = "";
		}
		let A = null;
		function j(e) {
			let t = c.editor, n = g.value;
			if (!(!t || !n)) try {
				t.chain().setTextSelection(n.pos).extendMarkRange("link").updateAttributes("link", { href: e }).run();
			} catch (e) {
				console.error("[LinkControls] save error:", e);
			}
		}
		E(b, (e) => {
			if (!g.value) return;
			A && clearTimeout(A);
			let t = e.trim();
			t && (A = setTimeout(() => j(t), 400));
		});
		function M() {
			let e = c.editor, t = g.value;
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
			let e = b.value.trim() || g.value?.originalHref;
			e && window.open(e, "_blank", "noopener,noreferrer");
		}
		function P() {
			let e = b.value.trim() || g.value?.originalHref;
			e && navigator.clipboard.writeText(e), S();
		}
		function F(e) {
			if (e.key === "Enter") {
				A && clearTimeout(A);
				let e = b.value.trim();
				e && j(e), S();
			}
			e.key === "Escape" && S();
		}
		let I = null;
		return E(u, (e, t) => {
			t && (t.removeEventListener("contextmenu", x), t.removeEventListener("mousedown", d, { capture: !0 }), t.removeEventListener("click", p, { capture: !0 })), e && (e.addEventListener("contextmenu", x), e.addEventListener("mousedown", d, { capture: !0 }), e.addEventListener("click", p, { capture: !0 }), I = () => {
				e.removeEventListener("contextmenu", x), e.removeEventListener("mousedown", d, { capture: !0 }), e.removeEventListener("click", p, { capture: !0 });
			});
		}, { immediate: !0 }), h(() => I?.()), (r, c) => (_(), o(e, null, [(_(), i(t, { to: "body" }, [g.value ? (_(), o("div", {
			key: 0,
			class: "lnk-overlay",
			onMousedown: k(S, ["self"])
		}, null, 32)) : a("", !0)])), l(n, { name: "lnk-ctx" }, {
			default: D(() => [g.value ? (_(), o("div", {
				key: 0,
				class: "lnk-ctx",
				style: m({
					top: g.value.top + "px",
					left: g.value.left + "px"
				})
			}, [
				s("div", Ot, [O(s("input", {
					ref_key: "inputRef",
					ref: v,
					"onUpdate:modelValue": c[0] ||= (e) => b.value = e,
					class: "lnk-ctx__input",
					type: "url",
					placeholder: "https://example.com",
					autocomplete: "off",
					spellcheck: "false",
					onKeydown: F
				}, null, 544), [[T, b.value]]), s("button", {
					class: "lnk-ctx__icon-btn",
					title: "Открыть в новой вкладке",
					onMousedown: k(N, ["prevent"])
				}, [l(C(G), { size: 13 })], 32)]),
				c[3] ||= s("div", { class: "lnk-ctx-separator" }, null, -1),
				s("div", kt, [s("button", {
					class: "lnk-ctx-item lnk-ctx-item--danger",
					onMousedown: k(M, ["prevent"])
				}, [l(C(Y), { size: 13 }), c[1] ||= s("span", null, "Удалить", -1)], 32), s("button", {
					class: "lnk-ctx-item lnk-ctx-item--copy",
					onMousedown: k(P, ["prevent"])
				}, [l(C(de), { size: 13 }), c[2] ||= s("span", null, "Копировать", -1)], 32)])
			], 4)) : a("", !0)]),
			_: 1
		})], 64));
	}
}), [["__scopeId", "data-v-5e6cc804"]]), jt = {
	key: 0,
	class: "ed-blockquote__fade"
}, Mt = ["title"], Nt = 500, Pt = "7rem", Ft = /* @__PURE__ */ u({
	__name: "BlockquoteView",
	props: P,
	setup(e) {
		let t = e, n = r(() => (t.node.textContent?.length ?? 0) > Nt), c = y(!1), u = y(null), d = y(Pt), f = y(!0);
		function p() {
			let e = u.value;
			e && (c.value ? (d.value = e.scrollHeight + "px", e.offsetHeight, requestAnimationFrame(() => {
				d.value = Pt, f.value = !0;
			})) : (d.value = e.scrollHeight + "px", f.value = !1, e.addEventListener("transitionend", () => {
				d.value = "auto";
			}, { once: !0 })), c.value = !c.value);
		}
		return (e, t) => (_(), i(C(M), {
			as: "blockquote",
			class: "ed-blockquote"
		}, {
			default: D(() => [
				l(C(J), {
					class: "ed-blockquote__icon",
					"aria-hidden": "true",
					contenteditable: "false"
				}),
				s("div", {
					ref_key: "bodyRef",
					ref: u,
					class: "ed-blockquote__body",
					style: m(n.value ? {
						height: d.value,
						overflow: "hidden"
					} : { display: "contents" })
				}, [l(C(j), { class: "ed-blockquote__content" }), n.value && f.value ? (_(), o("div", jt)) : a("", !0)], 4),
				n.value ? (_(), o("button", {
					key: 0,
					class: "ed-blockquote__toggle",
					contenteditable: "false",
					title: c.value ? "Свернуть" : "Развернуть",
					onClick: k(p, ["prevent"])
				}, [l(C(le), {
					size: 14,
					"stroke-width": 2,
					style: m({
						transform: c.value ? "rotate(180deg)" : "rotate(0deg)",
						transition: "transform 0.2s"
					})
				}, null, 8, ["style"]), s("span", null, S(c.value ? "Свернуть" : "Читать полностью"), 1)], 8, Mt)) : a("", !0)
			]),
			_: 1
		}));
	}
}), It = ze.extend({
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
		return N(Ft);
	}
}), Lt = Ve.theme({
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
}), Rt = Xe.define([
	{
		tag: [X.keyword, X.modifier],
		color: "oklch(0.6 0.15 290)"
	},
	{
		tag: [
			X.standard(X.name),
			X.bool,
			X.null,
			X.self
		],
		color: "oklch(0.6 0.15 290)"
	},
	{
		tag: [X.string, X.special(X.string)],
		color: "oklch(0.62 0.14 150)"
	},
	{
		tag: X.number,
		color: "oklch(0.65 0.14 55)"
	},
	{
		tag: [
			X.comment,
			X.blockComment,
			X.lineComment
		],
		color: "var(--muted-foreground)",
		fontStyle: "italic"
	},
	{
		tag: [X.function(X.variableName), X.function(X.propertyName)],
		color: "oklch(0.65 0.15 220)"
	},
	{
		tag: [X.definition(X.name), X.className],
		color: "oklch(0.65 0.15 220)"
	},
	{
		tag: [X.attributeName, X.attributeValue],
		color: "oklch(0.6 0.13 20)"
	},
	{
		tag: X.propertyName,
		color: "oklch(0.6 0.13 20)"
	},
	{
		tag: [X.operator, X.punctuation],
		color: "var(--muted-foreground)"
	},
	{
		tag: X.tagName,
		color: "oklch(0.6 0.15 290)"
	},
	{
		tag: X.regexp,
		color: "oklch(0.62 0.14 150)"
	},
	{
		tag: X.meta,
		color: "oklch(0.58 0.12 240)"
	},
	{
		tag: X.typeName,
		color: "oklch(0.65 0.14 55)"
	},
	{
		tag: X.inserted,
		color: "oklch(0.58 0.16 150)",
		background: "oklch(0.58 0.16 150 / 0.1)"
	},
	{
		tag: X.deleted,
		color: "oklch(0.55 0.18 20)",
		background: "oklch(0.55 0.18 20 / 0.1)"
	},
	{
		tag: X.heading,
		color: "var(--foreground)",
		fontWeight: "bold"
	}
]), zt = pt(ft), Bt = "ed-code-block-styles";
function Vt() {
	if (typeof document > "u") return;
	let e = document.getElementById(Bt);
	e || (e = document.createElement("style"), e.id = Bt, document.head.appendChild(e)), e.textContent = "\n\n/* ── Обёртка ──────────────────────────────────────────────────────────────── */\n.ed-code-block {\n  position: relative;\n  margin: 1rem 0;\n  border-radius: var(--radius-md, 0.5rem);\n  border: 0.0625rem solid var(--border);\n  background: color-mix(in oklch, var(--muted) 10%, transparent);\n  overflow: visible;\n  font-family: 'Monaspace Neon', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;\n}\n\n.dark .ed-code-block {\n  background: oklch(0.145 0.004 240 / 0.1);\n}\n\n/* ── Иконка на рамке ──────────────────────────────────────────────────────── */\n.ed-code-block__icon {\n  position: absolute;\n  top: 0;\n  left: 1rem;\n  transform: translateY(-50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.25rem;\n  height: 1.25rem;\n  padding: 0.2rem;\n  border-radius: 9999px;\n  background: var(--background);\n  color: var(--muted-foreground);\n  border: 0.0625rem solid var(--border);\n}\n\n.ed-code-block__icon svg {\n  width: 100%;\n  height: 100%;\n  stroke-width: 1.5;\n}\n\n/* ── Оверлей ──────────────────────────────────────────────────────────────── */\n.ed-code-block__overlay {\n  position: absolute;\n  top: 0.5rem;\n  right: 0.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.375rem;\n  z-index: 2;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.15s ease;\n}\n\n.ed-code-block:hover .ed-code-block__overlay {\n  opacity: 1;\n  pointer-events: auto;\n}\n\n/* ── Badge языка ──────────────────────────────────────────────────────────── */\n.ed-code-block__lang-badge {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  letter-spacing: 0.03em;\n  color: var(--muted-foreground);\n  font-family: inherit;\n  padding: 0.15rem 0.45rem;\n  border-radius: var(--radius-sm, 0.25rem);\n  background: color-mix(in oklch, var(--background) 80%, transparent);\n  border: 0.0625rem solid var(--border);\n  line-height: 1.4;\n  user-select: none;\n  backdrop-filter: blur(4px);\n}\n\n/* ── Кнопка карандаша ─────────────────────────────────────────────────────── */\n.ed-code-block__edit-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.5rem;\n  height: 1.5rem;\n  padding: 0;\n  border: 0.0625rem solid var(--border);\n  border-radius: var(--radius-sm, 0.25rem);\n  background: color-mix(in oklch, var(--background) 80%, transparent);\n  color: var(--muted-foreground);\n  cursor: pointer;\n  transition: color 0.12s, background 0.12s, border-color 0.12s;\n  backdrop-filter: blur(4px);\n}\n\n.ed-code-block__edit-btn:hover {\n  color: var(--foreground);\n  background: var(--background);\n  border-color: color-mix(in oklch, var(--border) 70%, var(--foreground));\n}\n\n/* ── Кнопка копирования ───────────────────────────────────────────────────── */\n.ed-code-block__copy-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.15rem 0.45rem;\n  border: 0.0625rem solid var(--border);\n  border-radius: var(--radius-sm, 0.25rem);\n  background: color-mix(in oklch, var(--background) 80%, transparent);\n  color: var(--muted-foreground);\n  font-size: 0.6875rem;\n  font-family: inherit;\n  line-height: 1.4;\n  cursor: pointer;\n  transition: color 0.12s, background 0.12s, border-color 0.12s;\n  backdrop-filter: blur(4px);\n}\n\n.ed-code-block__copy-btn:hover {\n  color: var(--foreground);\n  background: var(--background);\n  border-color: color-mix(in oklch, var(--border) 70%, var(--foreground));\n}\n\n/* ── Collapse body ────────────────────────────────────────────────────────── */\n.ed-code-block__body {\n  position: relative;\n  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n/* ── Fade при свёрнутом состоянии ─────────────────────────────────────────── */\n.ed-code-block__fade {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 5rem;\n  background: linear-gradient(\n    to bottom,\n    transparent,\n    color-mix(in oklch, var(--muted) 10%, var(--background))\n  );\n  pointer-events: none;\n  border-radius: 0 0 var(--radius-md, 0.5rem) var(--radius-md, 0.5rem);\n}\n\n.dark .ed-code-block__fade {\n  background: linear-gradient(to bottom, transparent, oklch(0.145 0.004 240));\n}\n\n/* ── Кнопка свернуть/развернуть ──────────────────────────────────────────── */\n/*\n  Точно повторяет .ed-blockquote__toggle.\n  font-family явно НЕ inherit: родитель .ed-code-block задаёт monospace,\n  inherit его и подхватил бы. Указываем sans-serif напрямую.\n  box-sizing: border-box + width: 100% — граница идёт от края до края.\n*/\n.ed-code-block__toggle {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  width: calc(100% - 2rem);\n  margin: 0.5rem 1rem 0;\n  padding: 0.5rem 0 0.625rem;\n  border: none;\n  border-top: 0.0625rem solid var(--border);\n  background: none;\n  color: var(--muted-foreground);\n  font-size: 0.75rem;\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\n  font-style: normal;\n  cursor: pointer;\n  transition: color 0.15s;\n  user-select: none;\n}\n\n.ed-code-block__toggle:hover {\n  color: var(--foreground);\n}\n\n/* ── CodeMirror контейнер ─────────────────────────────────────────────────── */\n.ed-code-block__cm {\n  padding: 1rem 1rem 0.875rem;\n  overflow-x: auto;\n}\n\n.ed-code-block .cm-editor {\n  background: transparent !important;\n}\n\n.ed-code-block .cm-focused {\n  outline: none !important;\n}\n\n.ed-code-block .cm-scroller {\n  overflow: visible;\n}\n\n.ed-code-block .cm-content {\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n/* Placeholder не должен пробиваться в CM */\n.ed-code-block .is-empty::before {\n  display: none !important;\n}\n\n\n/* ── Lang picker — точная копия shadcn <Command> ──────────────────────────── */\n\n.ed-lang-picker {\n  position: fixed;\n  z-index: 9999;\n  width: 14rem;\n  overflow: hidden;\n  border-radius: var(--radius-md, 0.5rem);\n  border: 0.0625rem solid var(--border);\n  background: var(--popover);\n  color: var(--popover-foreground);\n  box-shadow:\n    0 0 0 0.0625rem oklch(0 0 0 / 0.04),\n    0 4px 6px -1px oklch(0 0 0 / 0.08),\n    0 10px 24px -4px oklch(0 0 0 / 0.08);\n  display: flex;\n  flex-direction: column;\n}\n\n.ed-lang-picker__search-wrap {\n  display: flex;\n  align-items: center;\n  padding: 0 0.625rem;\n  border-bottom: 0.0625rem solid var(--border);\n}\n\n.ed-lang-picker__search-icon {\n  color: var(--muted-foreground);\n  flex-shrink: 0;\n  margin-right: 0.375rem;\n}\n\n.ed-lang-picker__search {\n  flex: 1;\n  padding: 0.625rem 0;\n  border: none;\n  background: transparent;\n  color: var(--popover-foreground);\n  font-size: 0.875rem;\n  font-family: inherit;\n  outline: none;\n  min-width: 0;\n}\n\n.ed-lang-picker__search::placeholder {\n  color: var(--muted-foreground);\n}\n\n.ed-lang-picker__list {\n  max-height: 15rem;\n  overflow-y: auto;\n  padding: 0.25rem;\n  display: flex;\n  flex-direction: column;\n  overscroll-behavior: contain;\n}\n\n.ed-lang-picker__group-label {\n  padding: 0.375rem 0.5rem 0.25rem;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: var(--muted-foreground);\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n\n.ed-lang-picker__item {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.375rem 0.5rem;\n  border: none;\n  border-radius: calc(var(--radius-md, 0.5rem) - 2px);\n  background: transparent;\n  color: var(--popover-foreground);\n  font-size: 0.8125rem;\n  font-family: inherit;\n  text-align: left;\n  cursor: pointer;\n  transition: background 0.1s;\n  user-select: none;\n}\n\n.ed-lang-picker__item:hover,\n.ed-lang-picker__item:focus-visible {\n  background: var(--accent);\n  color: var(--accent-foreground);\n  outline: none;\n}\n\n.ed-lang-picker__item--active {\n  background: var(--accent);\n  color: var(--accent-foreground);\n  font-weight: 500;\n}\n\n.ed-lang-picker__item--active::after {\n  content: '';\n  margin-left: auto;\n  width: 0.875rem;\n  height: 0.875rem;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\");\n  background-size: contain;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0.7;\n}\n\n.ed-lang-picker__item--auto {\n  color: var(--muted-foreground);\n  margin-bottom: 0.25rem;\n  padding-bottom: 0.5rem;\n  border-bottom: 0.0625rem solid var(--border);\n  border-radius: 0;\n}\n\n.ed-lang-picker__item--auto:hover {\n  background: var(--accent);\n  color: var(--accent-foreground);\n  border-radius: calc(var(--radius-md, 0.5rem) - 2px);\n  border-bottom-color: transparent;\n}\n\n";
}
//#endregion
//#region src/components/editor/extensions/code-block/CodeMirrorNodeView.ts
var Ht = {
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
}, Ut = {
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
}, Wt = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/></svg>", Gt = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/></svg>", Kt = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg>", qt = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z\"/></svg>", Jt = [
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
], Yt = class e {
	node;
	view;
	getPos;
	dom;
	cm;
	langConf = new We();
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
	constructor(t, n, r) {
		this.node = t, this.view = n, this.getPos = r, Vt(), this.dom = document.createElement("div"), this.dom.className = "ed-code-block";
		let i = document.createElement("span");
		i.className = "ed-code-block__icon", i.setAttribute("contenteditable", "false"), i.setAttribute("aria-hidden", "true"), i.innerHTML = Wt, this.dom.appendChild(i);
		let a = document.createElement("div");
		a.className = "ed-code-block__overlay", a.setAttribute("contenteditable", "false"), this.langBadge = document.createElement("span"), this.langBadge.className = "ed-code-block__lang-badge", this.langBadge.style.display = "none", a.appendChild(this.langBadge), this.editBtn = document.createElement("button"), this.editBtn.className = "ed-code-block__edit-btn", this.editBtn.type = "button", this.editBtn.title = "Выбрать язык", this.editBtn.innerHTML = qt, this.editBtn.addEventListener("mousedown", (e) => {
			e.preventDefault(), e.stopPropagation(), this.togglePicker();
		}), a.appendChild(this.editBtn), this.copyBtn = document.createElement("button"), this.copyBtn.className = "ed-code-block__copy-btn", this.copyBtn.type = "button", this.setCopyIdle(), this.copyBtn.addEventListener("mousedown", (e) => {
			e.preventDefault(), this.handleCopy();
		}), a.appendChild(this.copyBtn), this.dom.appendChild(a), this.collapseBody = document.createElement("div"), this.collapseBody.className = "ed-code-block__body";
		let o = document.createElement("div");
		o.className = "ed-code-block__cm", this.collapseBody.appendChild(o), this.fadeEl = document.createElement("div"), this.fadeEl.className = "ed-code-block__fade", this.fadeEl.setAttribute("contenteditable", "false"), this.collapseBody.appendChild(this.fadeEl), this.dom.appendChild(this.collapseBody), this.collapseBtn = document.createElement("button"), this.collapseBtn.className = "ed-code-block__toggle", this.collapseBtn.type = "button", this.collapseBtn.setAttribute("contenteditable", "false"), this.collapseBtn.addEventListener("mousedown", (e) => {
			e.preventDefault(), this.toggleCollapse();
		}), this.dom.appendChild(this.collapseBtn);
		let s = t.textContent ? t.textContent.split("\n").length : 1;
		this.isCollapsed = s > e.COLLAPSE_LINES, this.isCollapsed ? (this.collapseBody.style.height = e.COLLAPSED_HEIGHT, this.collapseBody.style.overflow = "hidden") : this.fadeEl.style.display = "none", this.collapseBtn.style.display = this.isCollapsed ? "" : "none", this.renderCollapseBtn(), this.cm = new Ve({
			state: Ge.create({
				doc: t.textContent,
				extensions: [
					qe(),
					He(),
					$e(),
					Qe(),
					tt(),
					et(Rt, { fallback: !0 }),
					Lt,
					this.langConf.of([]),
					Ue.of([
						...this.buildKeymap(),
						Ye,
						...nt,
						...Ke,
						...Je
					]),
					Ve.updateListener.of((e) => this.forwardUpdate(e))
				]
			}),
			parent: o
		}), setTimeout(() => this.applyLanguage(t.attrs.language, t.textContent), 0);
	}
	normalizeLangName(e) {
		let t = e.toLowerCase();
		return Ht[t] ?? t;
	}
	displayName(e) {
		return Ut[e.toLowerCase()] ?? e;
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
		let r = Ze.matchLanguageName(rt, n, !0);
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
			return zt.highlightAuto(e, { subset: t }).data?.language ?? null;
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
		return this.applyLanguage(e.attrs.language, e.textContent), this.syncCollapseState(t), !0;
	}
	forwardUpdate(e) {
		if (this.updating || !this.cm.hasFocus) return;
		let t = this.getPos() + 1, { main: n } = e.state.selection, r = t + n.from, i = t + n.to, a = this.view.state.selection;
		if (e.docChanged || a.from !== r || a.to !== i) {
			let n = this.view.state.tr;
			e.docChanged && (e.changes.iterChanges((e, r, i, a, o) => {
				o.length ? n.replaceWith(t + e, t + r, this.view.state.schema.text(o.toString())) : n.delete(t + e, t + r), t += a - i - (r - e);
			}), this.node.attrs.language || this.scheduleDetect(e.state.doc.toString())), n.setSelection(ct.create(n.doc, r, i)), this.view.dispatch(n);
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
				run: () => lt(this.view.state, this.view.dispatch) ? (this.view.focus(), !0) : !1
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
				run: () => (dt(this.view.state, this.view.dispatch), !0)
			},
			{
				key: "Shift-Ctrl-z",
				mac: "Shift-Cmd-z",
				run: () => (ut(this.view.state, this.view.dispatch), !0)
			},
			{
				key: "Ctrl-y",
				mac: "Cmd-y",
				run: () => (ut(this.view.state, this.view.dispatch), !0)
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
		let i = this.getPos() + (t < 0 ? 0 : this.node.nodeSize), a = st.near(this.view.state.doc.resolve(i), t);
		return this.view.dispatch(this.view.state.tr.setSelection(a).scrollIntoView()), this.view.focus(), !0;
	}
	setCopyIdle() {
		this.copyBtn.innerHTML = `${Gt}<span>Копировать</span>`;
	}
	setCopied() {
		this.copyBtn.innerHTML = `${Kt}<span>Скопировано</span>`;
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
	togglePicker() {
		if (this.picker) {
			this.closePicker();
			return;
		}
		this.openPicker();
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
			}), i.appendChild(n), Jt.filter(({ label: e }) => !t || e.toLowerCase().includes(t)).forEach(({ lang: e, label: t }) => {
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
		let t = this.getPos(), n = this.view.state.tr.setNodeMarkup(t, void 0, {
			...this.node.attrs,
			language: e
		});
		this.view.dispatch(n), this.closePicker(), e ? (this.currentLang = e, this.updateBadge(e), this.applyLanguage(e, this.node.textContent)) : (this.currentLang = null, this.updateBadge(null), this.scheduleDetect(this.node.textContent));
	}
	destroy() {
		this.copyTimer && clearTimeout(this.copyTimer), this.detectTimer && clearTimeout(this.detectTimer), this.closePicker(), this.cm.destroy();
	}
}, Xt = Be.extend({ addNodeView() {
	return (e) => new Yt(e.node, e.editor.view, e.getPos);
} }).configure({
	exitOnTripleEnter: !1,
	exitOnArrowDown: !1
}), Zt = ["title"], Qt = ["title", "onClick"], $t = ["title", "onClick"], en = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "BubbleMenuBar",
	props: { editor: {} },
	setup(c) {
		let u = c, d = y(null), v = y(!1), w = y(0), A = y(0), j = !1;
		function M() {
			let e = u.editor;
			if (!e) {
				v.value = !1;
				return;
			}
			if (d.value?.contains(document.activeElement)) return;
			let { from: t, to: n } = e.state.selection;
			if (t === n || e.isActive("image") || e.isActive("codeBlock")) {
				v.value = !1;
				return;
			}
			j || (v.value = !0, f(() => {
				let r = d.value;
				if (r) try {
					let i = e.view.coordsAtPos(t), a = e.view.coordsAtPos(n), o = (i.left + a.right) / 2;
					w.value = Math.max(r.offsetWidth / 2 + 8, Math.min(o, window.innerWidth - r.offsetWidth / 2 - 8)), A.value = Math.max(8, Math.min(i.top, a.top) - r.offsetHeight - 8);
				} catch {
					v.value = !1;
				}
			}));
		}
		E(() => u.editor, (e, t) => {
			t && t.off("selectionUpdate", M), e && e.on("selectionUpdate", M);
		}, { immediate: !0 });
		function N(e) {
			j = !0, !d.value?.contains(e.target) && (u.editor?.view.dom.contains(e.target) || (v.value = !1, I()));
		}
		function P() {
			j = !1, M();
		}
		g(() => {
			document.addEventListener("mousedown", N), document.addEventListener("mouseup", P);
		}), h(() => {
			document.removeEventListener("mousedown", N), document.removeEventListener("mouseup", P), u.editor?.off("selectionUpdate", M);
		});
		let F = y("toolbar");
		function I() {
			F.value = "toolbar", L.value = "";
		}
		let L = y(""), R = y(null);
		function z() {
			L.value = u.editor?.getAttributes("link").href ?? "", F.value = "link", f(() => {
				R.value?.focus(), R.value?.select();
			});
		}
		function B() {
			let e = L.value.trim();
			e ? u.editor?.chain().focus().extendMarkRange("link").setLink({ href: e }).run() : u.editor?.chain().focus().extendMarkRange("link").unsetLink().run(), I();
		}
		function te(e) {
			e.key === "Enter" && B(), e.key === "Escape" && (I(), u.editor?.commands.focus());
		}
		let re = [
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
		], H = r(() => {
			let e = u.editor;
			return !e || !e.isActive("highlight") ? null : e.getAttributes("highlight").color ?? null;
		});
		function ie(e) {
			let t = u.editor;
			t && (H.value === e ? t.chain().focus().unsetHighlight().run() : t.chain().focus().setHighlight({ color: e }).run(), I());
		}
		function ae() {
			u.editor?.chain().focus().unsetHighlight().run(), I();
		}
		let ce = [
			{
				value: "left",
				icon: V,
				title: "По левому краю"
			},
			{
				value: "center",
				icon: ee,
				title: "По центру"
			},
			{
				value: "right",
				icon: ne,
				title: "По правому краю"
			}
		], W = r(() => {
			let e = u.editor;
			return e ? e.isActive({ textAlign: "center" }) ? "center" : e.isActive({ textAlign: "right" }) ? "right" : "left" : "left";
		}), de = r(() => ce.find((e) => e.value === W.value)?.icon ?? V), G = y(0), K = y(0);
		function ge() {
			let e = u.editor;
			e && (G.value = e.state.selection.from, K.value = e.state.selection.to, F.value = "turninto");
		}
		let _e = r(() => {
			let e = u.editor;
			if (!e) return [];
			let t = () => e.chain().focus().setTextSelection({
				from: G.value,
				to: K.value
			});
			return [
				{
					label: "Текст",
					icon: Ee,
					action: () => t().setParagraph().run(),
					isActive: () => e.isActive("paragraph")
				},
				{
					label: "Заголовок 1",
					icon: fe,
					action: () => t().setHeading({ level: 1 }).run(),
					isActive: () => e.isActive("heading", { level: 1 })
				},
				{
					label: "Заголовок 2",
					icon: pe,
					action: () => t().setHeading({ level: 2 }).run(),
					isActive: () => e.isActive("heading", { level: 2 })
				},
				{
					label: "Заголовок 3",
					icon: me,
					action: () => t().setHeading({ level: 3 }).run(),
					isActive: () => e.isActive("heading", { level: 3 })
				},
				{
					label: "Список",
					icon: be,
					action: () => q("bulletList"),
					isActive: () => e.isActive("bulletList")
				},
				{
					label: "Нумерация",
					icon: xe,
					action: () => q("orderedList"),
					isActive: () => e.isActive("orderedList")
				},
				{
					label: "Цитата",
					icon: J,
					action: () => t().toggleBlockquote().run(),
					isActive: () => e.isActive("blockquote")
				}
			];
		}), Se = r(() => {
			let e = u.editor;
			return e ? e.isActive("heading", { level: 1 }) ? "Заголовок 1" : e.isActive("heading", { level: 2 }) ? "Заголовок 2" : e.isActive("heading", { level: 3 }) ? "Заголовок 3" : e.isActive("bulletList") ? "Список" : e.isActive("orderedList") ? "Нумерация" : e.isActive("blockquote") ? "Цитата" : "Текст" : "Текст";
		});
		function Ce(e) {
			e.action(), I();
		}
		function q(e) {
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
		function Te() {
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
		let Y = r(() => {
			let e = u.editor;
			return e ? e.isActive("code") || e.isActive("codeBlock") : !1;
		});
		return (r, u) => (_(), i(t, { to: "body" }, [l(n, { name: "bm" }, {
			default: D(() => [v.value && c.editor ? (_(), o("div", {
				key: 0,
				ref_key: "barRef",
				ref: d,
				class: "bm",
				style: m({
					left: w.value + "px",
					top: A.value + "px"
				}),
				onMousedown: u[11] ||= k(() => {}, ["prevent"])
			}, [F.value === "toolbar" ? (_(), o(e, { key: 0 }, [
				s("button", {
					class: "bm__turn-btn",
					onClick: u[0] ||= (e) => ge()
				}, [s("span", null, S(Se.value), 1), l(C(le), { size: 11 })]),
				u[12] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: p(["bm__btn", { "bm__btn--active": c.editor.isActive("bold") }]),
					title: "Жирный (Ctrl+B)",
					onClick: u[1] ||= (e) => c.editor.chain().focus().toggleBold().run()
				}, [l(C(oe), { size: 13 })], 2),
				s("button", {
					class: p(["bm__btn", { "bm__btn--active": c.editor.isActive("italic") }]),
					title: "Курсив (Ctrl+I)",
					onClick: u[2] ||= (e) => c.editor.chain().focus().toggleItalic().run()
				}, [l(C(ve), { size: 13 })], 2),
				s("button", {
					class: p(["bm__btn", { "bm__btn--active": c.editor.isActive("underline") }]),
					title: "Подчёркнутый (Ctrl+U)",
					onClick: u[3] ||= (e) => c.editor.chain().focus().toggleUnderline().run()
				}, [l(C(De), { size: 13 })], 2),
				s("button", {
					class: p(["bm__btn", { "bm__btn--active": c.editor.isActive("strike") }]),
					title: "Зачёркнутый",
					onClick: u[4] ||= (e) => c.editor.chain().focus().toggleStrike().run()
				}, [l(C(we), { size: 13 })], 2),
				s("button", {
					class: p(["bm__btn", { "bm__btn--active": Y.value }]),
					title: "Код",
					onClick: u[5] ||= (e) => Te()
				}, [l(C(ue), { size: 13 })], 2),
				s("button", {
					class: p(["bm__btn bm__btn--highlight", { "bm__btn--active": c.editor.isActive("highlight") }]),
					title: "Выделить цветом",
					onClick: u[6] ||= (e) => F.value = "highlight"
				}, [l(C(he), { size: 13 }), s("span", {
					class: "bm__hl-dot",
					style: m(H.value ? { background: H.value } : {})
				}, null, 4)], 2),
				u[13] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: "bm__btn",
					title: `Выравнивание: ${W.value}`,
					onClick: u[7] ||= (e) => c.editor.chain().focus().setTextAlign(W.value === "left" ? "center" : W.value === "center" ? "right" : "left").run()
				}, [(_(), i(x(de.value), { size: 13 }))], 8, Zt),
				u[14] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: p(["bm__btn", { "bm__btn--active": c.editor.isActive("link") }]),
					title: "Ссылка",
					onClick: z
				}, [l(C(ye), { size: 13 })], 2)
			], 64)) : F.value === "link" ? (_(), o(e, { key: 1 }, [
				s("button", {
					class: "bm__btn",
					onClick: u[8] ||= (e) => {
						I(), c.editor.commands.focus();
					}
				}, [l(C(U), { size: 13 })]),
				u[15] ||= s("div", { class: "bm__sep" }, null, -1),
				O(s("input", {
					ref_key: "linkInputRef",
					ref: R,
					"onUpdate:modelValue": u[9] ||= (e) => L.value = e,
					class: "bm__link-input",
					type: "url",
					placeholder: "https://example.com",
					autocomplete: "off",
					spellcheck: "false",
					onMousedown: u[10] ||= k(() => {}, ["stop"]),
					onKeydown: te
				}, null, 544), [[T, L.value]]),
				s("button", {
					class: "bm__btn bm__btn--confirm",
					onClick: B
				}, [l(C(se), { size: 13 })])
			], 64)) : F.value === "turninto" ? (_(), o(e, { key: 2 }, [
				s("button", {
					class: "bm__btn",
					onClick: I
				}, [l(C(U), { size: 13 })]),
				u[16] ||= s("div", { class: "bm__sep" }, null, -1),
				(_(!0), o(e, null, b(_e.value, (e) => (_(), o("button", {
					key: e.label,
					class: p(["bm__btn", { "bm__btn--active": e.isActive() }]),
					title: e.label,
					onClick: (t) => Ce(e)
				}, [(_(), i(x(e.icon), { size: 13 }))], 10, Qt))), 128))
			], 64)) : F.value === "highlight" ? (_(), o(e, { key: 3 }, [
				s("button", {
					class: "bm__btn",
					onClick: I
				}, [l(C(U), { size: 13 })]),
				u[18] ||= s("div", { class: "bm__sep" }, null, -1),
				(_(), o(e, null, b(re, (e) => s("button", {
					key: e.value,
					class: p(["bm__hl-swatch", { "bm__hl-swatch--active": H.value === e.value }]),
					title: e.label,
					style: m({ background: e.value }),
					onClick: (t) => ie(e.value)
				}, null, 14, $t)), 64)),
				u[19] ||= s("div", { class: "bm__sep" }, null, -1),
				s("button", {
					class: "bm__btn bm__btn--hl-clear",
					title: "Убрать выделение",
					onClick: ae
				}, [...u[17] ||= [s("span", { class: "bm__hl-clear-icon" }, "✕", -1)]])
			], 64)) : a("", !0)], 36)) : a("", !0)]),
			_: 1
		})]));
	}
}), [["__scopeId", "data-v-09847e9c"]]), tn = [
	{
		title: "Текст",
		description: "Обычный параграф",
		icon: Ee,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setParagraph().run()
	},
	{
		title: "Заголовок 1",
		description: "Большой заголовок",
		icon: fe,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHeading({ level: 1 }).run()
	},
	{
		title: "Заголовок 2",
		description: "Средний заголовок",
		icon: pe,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHeading({ level: 2 }).run()
	},
	{
		title: "Заголовок 3",
		description: "Небольшой заголовок",
		icon: me,
		category: "Основные",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHeading({ level: 3 }).run()
	},
	{
		title: "Маркированный список",
		description: "Список с точками",
		icon: be,
		category: "Списки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).toggleBulletList().run()
	},
	{
		title: "Нумерованный список",
		description: "Список с номерами",
		icon: xe,
		category: "Списки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).toggleOrderedList().run()
	},
	{
		title: "Список задач",
		description: "Список с чекбоксами",
		icon: ce,
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
		icon: J,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).toggleBlockquote().run()
	},
	{
		title: "Блок кода",
		description: "Код с подсветкой синтаксиса",
		icon: W,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setCodeBlock().run()
	},
	{
		title: "Таблица",
		description: "Вставить таблицу 3×3",
		icon: Te,
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
		icon: Ce,
		category: "Блоки",
		command: ({ editor: e, range: t }) => e.chain().focus().deleteRange(t).setHorizontalRule().run()
	},
	{
		title: "Изображение",
		description: "По ссылке или с компьютера",
		icon: ge,
		category: "Медиа",
		showImagePopover: !0,
		command: ({ editor: e, range: t, item: n }) => {
			let r = n._src;
			r ? e.chain().focus().deleteRange(t).setImage({ src: r }).run() : e.chain().focus().deleteRange(t).run();
		}
	}
], Q = v({
	visible: !1,
	x: 0,
	y: 0,
	items: [],
	selectedIndex: 0,
	runCommand: null,
	pendingEditor: null,
	pendingRange: null,
	openImagePopover: !1
}), nn = ht.create({
	name: "slashMenu",
	addProseMirrorPlugins() {
		return [gt({
			editor: this.editor,
			char: "/",
			allowSpaces: !1,
			items: ({ query: e }) => {
				let t = e.toLowerCase().trim();
				return t ? tn.filter((e) => e.title.toLowerCase().includes(t) || e.description.toLowerCase().includes(t) || e.category.toLowerCase().includes(t)) : tn;
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
}), rn = { class: "ip__header" }, an = { class: "ip__icon" }, on = { class: "ip__tabs" }, sn = { class: "ip__body" }, cn = { class: "ip__field" }, ln = {
	key: 0,
	class: "ip__error"
}, un = {
	key: 0,
	class: "ip__error"
}, dn = 320, fn = 160, pn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "ImageInsertPopover",
	props: {
		visible: { type: Boolean },
		x: {},
		y: {}
	},
	emits: ["insert", "close"],
	setup(u, { emit: d }) {
		let h = u, g = d, v = y("url"), b = y(""), x = y(""), w = y(null), A = y(null);
		E(() => h.visible, (e) => {
			e && (v.value = "url", b.value = "", x.value = "", f(() => w.value?.focus()));
		});
		let j = r(() => {
			let e = Math.min(h.x, window.innerWidth - dn - 8), t = h.y + fn > window.innerHeight ? h.y - fn - 12 : h.y;
			return {
				left: Math.max(8, e) + "px",
				top: Math.max(8, t) + "px"
			};
		});
		function M() {
			let e = b.value.trim();
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
		function N(e) {
			e.key === "Enter" && (e.preventDefault(), M()), e.key === "Escape" && (e.preventDefault(), g("close"));
		}
		function P() {
			A.value?.click();
		}
		function F(e) {
			let t = e.target.files?.[0];
			if (!t) return;
			if (!t.type.startsWith("image/")) {
				x.value = "Выберите файл изображения";
				return;
			}
			let n = new FileReader();
			n.onload = (e) => {
				let t = e.target?.result;
				g("insert", t);
			}, n.readAsDataURL(t), e.target.value = "";
		}
		function I() {
			g("close");
		}
		function L(e) {
			e.stopPropagation();
		}
		return (r, d) => (_(), i(t, { to: "body" }, [l(n, { name: "ip" }, {
			default: D(() => [u.visible ? (_(), o("div", {
				key: 0,
				class: "ip-overlay",
				onMousedown: I
			}, [s("div", {
				class: "ip",
				style: m(j.value),
				onMousedown: L
			}, [
				s("div", rn, [
					s("div", an, [l(C(_e), { size: 14 })]),
					d[4] ||= s("span", { class: "ip__title" }, "Вставить изображение", -1),
					s("button", {
						class: "ip__close",
						onMousedown: d[0] ||= k((e) => g("close"), ["prevent"])
					}, [l(C(ke), { size: 14 })], 32)
				]),
				s("div", on, [s("button", {
					class: p(["ip__tab", { "ip__tab--active": v.value === "url" }]),
					onMousedown: d[1] ||= k(() => {
						v.value = "url", f(() => w.value?.focus());
					}, ["prevent"])
				}, [l(C(ye), { size: 12 }), d[5] ||= c(" По ссылке ", -1)], 34), s("button", {
					class: p(["ip__tab", { "ip__tab--active": v.value === "upload" }]),
					onMousedown: d[2] ||= k((e) => v.value = "upload", ["prevent"])
				}, [l(C(Oe), { size: 12 }), d[6] ||= c(" С компьютера ", -1)], 34)]),
				s("div", sn, [v.value === "url" ? (_(), o(e, { key: 0 }, [
					s("div", cn, [O(s("input", {
						ref_key: "urlInput",
						ref: w,
						"onUpdate:modelValue": d[3] ||= (e) => b.value = e,
						class: "ip__input",
						type: "url",
						placeholder: "https://example.com/image.png",
						onKeydown: N
					}, null, 544), [[T, b.value]])]),
					x.value ? (_(), o("p", ln, S(x.value), 1)) : a("", !0),
					s("button", {
						class: "ip__submit",
						onMousedown: k(M, ["prevent"])
					}, " Вставить ", 32)
				], 64)) : (_(), o(e, { key: 1 }, [
					x.value ? (_(), o("p", un, S(x.value), 1)) : a("", !0),
					s("button", {
						class: "ip__upload-btn",
						onMousedown: k(P, ["prevent"])
					}, [l(C(Oe), { size: 16 }), d[7] ||= c(" Выбрать файл ", -1)], 32),
					d[8] ||= s("p", { class: "ip__hint" }, "PNG, JPG, GIF, WebP, SVG, AVIF", -1),
					s("input", {
						ref_key: "fileInput",
						ref: A,
						type: "file",
						accept: "image/*",
						style: { display: "none" },
						onChange: F
					}, null, 544)
				], 64))])
			], 36)], 32)) : a("", !0)]),
			_: 1
		})]));
	}
}), [["__scopeId", "data-v-9476e63c"]]), mn = {
	key: 0,
	class: "sm__empty"
}, hn = { class: "sm__group-label" }, gn = ["data-selected", "onMousedown"], _n = { class: "sm__item-icon" }, vn = { class: "sm__item-body" }, yn = { class: "sm__item-title" }, bn = { class: "sm__item-desc" }, xn = 272, Sn = 360, Cn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "SlashMenu",
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
		}), d = y(null);
		E(() => Q.selectedIndex, () => {
			f(() => {
				d.value?.querySelector("[data-selected=\"true\"]")?.scrollIntoView({ block: "nearest" });
			});
		});
		let h = r(() => {
			let e = Math.min(Q.x, window.innerWidth - xn - 8), t = Q.y + Sn > window.innerHeight ? Q.y - Sn - 12 : Q.y;
			return {
				left: Math.max(8, e) + "px",
				top: Math.max(8, t) + "px"
			};
		}), g = y(!1), v = y(0), w = y(0);
		function T() {
			v.value = Q.x, w.value = Q.y, g.value = !0, Q.openImagePopover = !1;
		}
		function O(e) {
			if (e.showImagePopover) {
				Q.visible = !1, T();
				return;
			}
			Q.runCommand?.(e);
		}
		E(() => Q.openImagePopover, (e) => {
			e && T();
		});
		function A(e) {
			g.value = !1;
			let t = Q.pendingEditor, n = Q.pendingRange;
			t && n && (t.chain().focus().deleteRange(n).setImage({ src: e }).run(), f(() => {
				let { doc: e, tr: r } = t.view.state, i = n.from, a = -1;
				if (e.nodesBetween(i, Math.min(i + 5, e.content.size), (e, t) => {
					e.type.name === "image" && a === -1 && (a = t);
				}), a >= 0) {
					let e = it.create(t.view.state.doc, a);
					t.view.dispatch(t.view.state.tr.setSelection(e));
				}
			})), Q.pendingEditor = null, Q.pendingRange = null;
		}
		function j() {
			g.value = !1, Q.openImagePopover = !1;
		}
		return (r, c) => (_(), o(e, null, [(_(), i(t, { to: "body" }, [l(n, { name: "sm" }, {
			default: D(() => [C(Q).visible ? (_(), o("div", {
				key: 0,
				class: "sm",
				style: m(h.value)
			}, [C(Q).items.length ? (_(), o("div", {
				key: 1,
				ref_key: "listRef",
				ref: d,
				class: "sm__list"
			}, [(_(!0), o(e, null, b(u.value, (t) => (_(), o("div", {
				key: t.category,
				class: "sm__group"
			}, [s("p", hn, S(t.category), 1), (_(!0), o(e, null, b(t.items, (e) => (_(), o("button", {
				key: e.title,
				class: p(["sm__item", { "sm__item--active": e.index === C(Q).selectedIndex }]),
				"data-selected": e.index === C(Q).selectedIndex,
				onMousedown: k((t) => O(e), ["prevent"])
			}, [s("span", _n, [(_(), i(x(e.icon), { size: 15 }))]), s("span", vn, [s("span", yn, S(e.title), 1), s("span", bn, S(e.description), 1)])], 42, gn))), 128))]))), 128))], 512)) : (_(), o("div", mn, " Ничего не найдено "))], 4)) : a("", !0)]),
			_: 1
		})])), l(pn, {
			visible: g.value,
			x: v.value,
			y: w.value,
			onInsert: A,
			onClose: j
		}, null, 8, [
			"visible",
			"x",
			"y"
		])], 64));
	}
}), [["__scopeId", "data-v-f2cb7907"]]), $ = v({
	visible: !1,
	y: 0,
	blockPos: -1,
	blockEl: null,
	isDragging: !1
}), wn = new ot("dragHandle");
function Tn(e, t) {
	let n = t;
	for (; n && n.parentElement !== e.dom;) n = n.parentElement;
	return n ?? null;
}
var En = ht.create({
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
			s = !0;
		}
		function l() {
			s = !1;
		}
		function u(t) {
			if ($.isDragging || s) return;
			let c = r();
			c && !o && (c.addEventListener("mouseleave", a), o = !0);
			let l = t.target;
			if (!c || !c.contains(l) || l.closest("[data-drag-panel]")) return;
			let u = e.view;
			if (!u.dom.contains(l) || l === u.dom) return;
			let d = Tn(u, l);
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
		return [new at({
			key: wn,
			view() {
				return document.addEventListener("mousemove", u), document.addEventListener("mousedown", c), document.addEventListener("mouseup", l), { destroy() {
					document.removeEventListener("mousemove", u), document.removeEventListener("mousedown", c), document.removeEventListener("mouseup", l), t?.removeEventListener("mouseleave", a);
				} };
			}
		})];
	}
}), Dn = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "DragHandleBar",
	props: { editor: {} },
	setup(e) {
		let t = e, c = r(() => ({ top: `${$.y}px` })), u = y(!1);
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
			let c = s.dom, l = a[o + 1], f = l ? l.rect.top - s.rect.top : s.rect.height, p = c.offsetParent ?? document.documentElement, m = p.getBoundingClientRect(), g = s.rect.top - m.top, _ = s.rect.left - m.left, v = e.clientY - s.rect.top;
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
				w(), e !== o && h(n, o, e);
			}
			window.addEventListener("mousemove", C), window.addEventListener("mouseup", T);
		}
		function h(e, t, n) {
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
		return (t, r) => (_(), i(n, { name: "dh" }, {
			default: D(() => [C($).visible && e.editor && !u.value ? (_(), o("div", {
				key: 0,
				class: "dh",
				style: m(c.value),
				"data-drag-panel": ""
			}, [s("button", {
				class: "dh__btn",
				title: "Добавить блок",
				onMousedown: k(f, ["prevent"])
			}, [l(C(q), { size: 14 })], 32), s("div", {
				class: "dh__btn dh__grip",
				title: "Перетащить блок",
				onMousedown: p
			}, [l(C(K), { size: 14 })], 32)], 4)) : a("", !0)]),
			_: 1
		}));
	}
}), [["__scopeId", "data-v-ec6c96bb"]]), On = /* @__PURE__ */ Z(/* @__PURE__ */ u({
	__name: "DocEditor",
	props: {
		modelValue: { default: "" },
		outputFormat: { default: "html" }
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		je.use({
			gfm: !0,
			breaks: !0
		});
		function n(e) {
			return /^#{1,6}\s|^\s*[-*+]\s|^\s*\|.+\||\*\*.+\*\*|__.+__|`{1,3}|\[.+\]\(.+\)|\n\|[-:| ]+\|/m.test(e);
		}
		let r = new Me({
			headingStyle: "atx",
			hr: "---",
			bulletListMarker: "-",
			codeBlockStyle: "fenced",
			fence: "```",
			emDelimiter: "_",
			strongDelimiter: "**",
			linkStyle: "inlined"
		});
		r.addRule("table", {
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
		}), r.addRule("highlight", {
			filter: ["mark"],
			replacement: (e) => `==${e}==`
		}), r.addRule("underline", {
			filter: ["u"],
			replacement: (e) => `<u>${e}</u>`
		}), r.addRule("taskItem", {
			filter(e) {
				return e.nodeName === "LI" && e.parentElement?.getAttribute("data-type") === "taskList";
			},
			replacement(e, t) {
				return `- [${t.getAttribute("data-checked") === "true" ? "x" : " "}] ${e.trim()}\n`;
			}
		});
		function i(e) {
			return r.turndown(e);
		}
		let a = e, s = t;
		function c(e) {
			return e ? a.outputFormat === "json" ? JSON.parse(e) : a.outputFormat === "markdown" ? je.parse(e) : e : "<p></p>";
		}
		function u(e) {
			switch (a.outputFormat) {
				case "json": return JSON.stringify(e.getJSON());
				case "text": return e.getText();
				case "markdown": return i(e.getHTML());
				default: return e.getHTML();
			}
		}
		let d = a.modelValue, f = y(null), p = F({
			content: c(a.modelValue),
			extensions: [
				I.configure({
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
				L.configure({
					placeholder: ({ node: e }) => e.type.name === "codeBlock" ? "" : e.type.name === "heading" ? {
						1: "Заголовок 1",
						2: "Заголовок 2",
						3: "Заголовок 3"
					}[e.attrs.level] ?? "" : "Введите текст или нажмите / для команд",
					includeChildren: !0
				}),
				z,
				R.configure({ nested: !0 }),
				mt,
				xt,
				Ae.configure({ multicolor: !0 }),
				Dt,
				Re.configure({ types: ["heading", "paragraph"] }),
				It,
				Xt,
				...St,
				nn,
				En
			],
			editorProps: {
				attributes: { class: "doc-editor__content" },
				handlePaste(e, t) {
					let r = t.clipboardData;
					if (!r) return !1;
					let i = Array.from(r.items).find((e) => e.kind === "file" && e.type.startsWith("image/"));
					if (i) {
						t.preventDefault();
						let e = i.getAsFile();
						if (e) {
							let t = new FileReader();
							t.onload = (e) => {
								let t = e.target?.result;
								p.value?.commands.setImage({ src: t });
							}, t.readAsDataURL(e);
						}
						return !0;
					}
					let a = r.getData("text/plain") ?? "", o = r.getData("text/html") ?? "";
					return !o && /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(a.trim()) ? (t.preventDefault(), p.value?.commands.setImage({ src: a.trim() }), !0) : o && /<[a-z][\s\S]*>/i.test(o) ? !1 : a && n(a) ? (t.preventDefault(), p.value?.commands.insertContent(je.parse(a)), !0) : !1;
				}
			},
			onUpdate: ({ editor: e }) => {
				let t = u(e);
				d = t, s("update:modelValue", t);
			}
		});
		return E(() => a.modelValue, (e) => {
			!p.value || e === d || p.value.commands.setContent(c(e), { emitUpdate: !1 });
		}), h(() => {
			p.value?.destroy();
		}), (e, t) => (_(), o("div", {
			ref_key: "wrapRef",
			ref: f,
			class: "doc-editor"
		}, [
			l(en, { editor: C(p) }, null, 8, ["editor"]),
			l(Cn),
			l(Dn, { editor: C(p) }, null, 8, ["editor"]),
			l(C(A), { editor: C(p) }, null, 8, ["editor"]),
			l(At, {
				wrap: f.value,
				"onUpdate:wrap": t[0] ||= (e) => f.value = e,
				editor: C(p)
			}, null, 8, ["wrap", "editor"]),
			l(Et, {
				wrap: f.value,
				"onUpdate:wrap": t[1] ||= (e) => f.value = e,
				editor: C(p)
			}, null, 8, ["wrap", "editor"])
		], 512));
	}
}), [["__scopeId", "data-v-293f57e9"]]);
//#endregion
export { On as DocEditor, tn as SLASH_ITEMS, It as blockquoteExtension, Xt as codeBlockExtension, En as dragHandleExtension, $ as dragHandleState, xt as imageExtension, Dt as linkExtension, nn as slashMenuExtension, Q as slashState, St as tableExtensions };

//# sourceMappingURL=index.js.map