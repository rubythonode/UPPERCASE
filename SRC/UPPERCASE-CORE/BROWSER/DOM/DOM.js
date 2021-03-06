/**
 * DOM 객체를 생성하고 다루는 클래스
 */
global.DOM = CLASS({

	preset : function() {
		'use strict';

		return NODE;
	},

	init : function(inner, self, params) {
		'use strict';
		//REQUIRED: params
		//OPTIONAL: params.tag		생설할 DOM 객체에 해당하는 태그 지정
		//OPTIONAL: params.el		태그를 지정하지 않고 HTML element를 직접 지정
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트
		//OPTIONAL: params.__TEXT	UPPERCASE가 문자열 DOM 객체를 생성하기 위해 내부적으로 사용하는 파라미터

		var
		// tag
		tag = params.tag,

		// HTML Element
		el = params.el,
		
		// id
		id = params.id,
		
		// cls
		cls = params.cls,

		// __TEXT
		__TEXT = params.__TEXT,

		// get el.
		getEl,

		// set el.
		setEl,

		// set attr.
		setAttr;

		// when tag is not undefined
		if (tag !== undefined) {

			if (tag === 'body') {
				el = document.body;
			} else if (tag === '__STRING') {
				el = document.createTextNode(__TEXT);
			} else {
				el = document.createElement(tag);
			}
		}

		// when tag is undefined, el is not undefined
		else if (el !== document.body && el.parentNode !== TO_DELETE) {

			self.setParent(DOM({
				el : el.parentNode
			}));
		}

		self.getEl = getEl = function() {
			return el;
		};

		inner.setEl = setEl = function(_el) {
			//REQUIRED: _el

			el = _el;

			inner.setDom(self);
		};

		setEl(el);

		inner.setAttr = setAttr = function(params) {
			//REQUIRED: params
			//REQUIRED: params.name
			//REQUIRED: params.value

			var
			// name
			name = params.name,

			// value
			value = params.value;

			el.setAttribute(name, value);
		};
		
		if (id !== undefined) {
			setAttr({
				name : 'id',
				value : id
			});
		}
		
		if (cls !== undefined) {
			setAttr({
				name : 'class',
				value : cls
			});
		}
	}
});
