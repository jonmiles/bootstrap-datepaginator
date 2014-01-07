/* =========================================================
 * bootstrap-datepaginator.js v1.2.0
 * =========================================================
 * Copyright 2013 Jonathan Miles 
 * Project URL : http://www.jondmiles.com/bootstrap-datepaginator
 *	
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

;(function($, window, document, undefined) {

	/*global jQuery, moment*/

	'use strict';

	var pluginName = 'datepaginator';

	var DatePaginator = function(element, options) {
		this._element = element;
		this.$element = $(element);
		this._init(options);
	};

	// Default date formats
	DatePaginator.formats = {
		date: 'YYYY-MM-DD',
		day: 'ddd'
	};

	// Default plugin options
	DatePaginator.defaults = {

		injectStyle: true,

		text: 'ddd<br/>Do',
		textSelected: 'dddd<br/>Do, MMMM YYYY',
		hint: 'dddd, Do MMMM YYYY',

		fillWidth: true,
		width: 0,
		itemWidth: 35,
		navItemWidth: 20,
		selectedItemWidth: 140,
		size: undefined,

		highlightSelectedDate: true,
		highlightToday: true,
		showCalendar: true,
		squareEdges: false,
		showOffDays: true,
		showStartOfWeek: true,

		dateFormat: DatePaginator.formats.date,
		dayFormat: DatePaginator.formats.day,

		startDate: {
			date: moment(new Date(-8640000000000000)),
			format: DatePaginator.formats.date
		},

		endDate: {
			date: moment(new Date(8640000000000000)),
			format: DatePaginator.formats.date
		},

		selectedDate: {
			date: moment().clone().startOf('day'),
			format: DatePaginator.formats.date
		},

		offDays: [
			{
				dates: [ 'Sat', 'Sun' ],
				format: DatePaginator.formats.day,
				disable: false
			}
		],

		// TODO Rename periodDividers - accept array as with offDays
		startOfWeek: {
			dates: [ 'Mon' ],
			format: DatePaginator.formats.day
		},

		onSelectedDateChanged: null
	};

	DatePaginator.prototype = {

		setSelectedDate: function(date, format) {
			this._setSelectedDate(moment(date, format ? format : this.options.selectedDate.format));
			this._render();
		},

		remove: function () {

			// Cleanup dom and remove events
			this._destroy();

			// Only remove data if user initiated
			$.removeData(this, 'plugin_' + pluginName);
		},

		_init: function(options) {

			this.options = $.extend({}, DatePaginator.defaults, options);
			this._normalizeOptions();
			this._destroy();
			this._subscribeEvents();
			this._render();
		},

		_normalizeOptions: function() {

			// If no width provided, default to fill full width
			// this.options.width = this.options.width ? this.options.width : this.$element.width();
			if (this.options.width) {
				this.options.fillWidth = false;
			}
			else {
				this.options.width = this.$element.width();
				this.options.fillWidth = true;
			}

			// Parse and nomalize size options
			if (this.options.size === 'small') {
				this.options.size = 'sm';
			}
			else if (this.options.size === 'large') {
				this.options.size = 'lg';
			}


			// Parse start and end dates 
			this._shimDateObject('startDate');
			this._shimDateObject('endDate');

			// Parse, set and validate the initially selected date 
			// 1. overridding the default value of today 
			this._shimDateObject('selectedDate');
			// 2. enforce selectedDate is within start and end date range
			if (this.options.selectedDate.date.isBefore(this.options.startDate.date)) {
				this.options.selectedDate.date = this.options.startDate.date.clone();
			}
			if (this.options.selectedDate.date.isAfter(this.options.endDate.date)) {
				this.options.selectedDate.date = this.options.endDate.date.clone();
			}


			// If string startOfWeek then convert to object structure
			if ((typeof this.options.startOfWeek) === 'string') {
				this.options.startOfWeek = {
					dates: [ this.options.startOfWeek ],
					format: (this.options.startOfWeekFormat) ? this.options.startOfWeekFormat : 'ddd'
				};
			}
			// this._shimDayObject('startOfWeek');

			// If string offDays then convert to objects structure
			if ((typeof this.options.offDays) === 'string') {
				this.options.offDays = [{
					dates: this.options.offDays.split(','),
					format: (this.options.offDaysFormat) ? this.options.offDaysFormat : 'ddd'
				}];
			}
			// this._shimDayObject('offDays');
		},

		// _shimDayObject: function (option) {

		// 	var format = this.options.dayFormat;
		// 	if (this.options.hasOwnProperty(option + 'Format')) {
		// 		format = this.options[option + 'Format'];
		// 		delete this.options[option + 'Format'];
		// 	}

		// 	if (typeof this.options[option] === 'string') {
		// 		this.options[option] = {
		// 			d: [ this.options[option].split(',') ],
		// 			f: format
		// 		};
		// 	}
		// },

		_shimDateObject: function (option) {

			var format = this.options.dateFormat;
			if (this.options.hasOwnProperty(option + 'Format')) {
				format = this.options[option + 'Format'];
				delete this.options[option + 'Format'];
			}

			if ((typeof this.options[option]) === 'string') {

				// start date as string, check we've got a start date format required to parse
				this.options[option] = {
					date: moment(this.options[option], format).clone().startOf('day'),
					format: format
				};
			}
			else if (typeof this.options[option] === 'object') {

				if (this.options[option].constructor.name === 'Moment') {

					// got moment, shim into object
					this.options[option] = {
						date: this.options[option].clone().startOf('day'),
						format: format
					};
				}
				else if (this.options[option].hasOwnProperty('date') &&
						(typeof this.options[option].date === 'string')) {

					// almost right, parse date string into moment
					if (this.options[option].hasOwnProperty('format')) {
						format = this.options[option].format;
					}
					this.options[option].date = moment(this.options[option].date, format).clone().startOf('day');
					this.options[option].format = format;
				}
				else if (this.options[option].hasOwnProperty('date') &&
					(this.options[option].constructor.name === 'Moment')) {

					this.options[option].date = this.options[option].date.startOf('day');
				}
			}
		},

		_unsubscribeEvents: function () {

			// $(window).off(); // TODO Turns off all resize events not just the one being destroyed
			this.$element.off('click');
			this.$element.off('selectedDateChanged');
		},

		_subscribeEvents: function () {

			this._unsubscribeEvents();

			this.$element.on('click', $.proxy(this._clickedHandler, this));

			if (typeof (this.options.onSelectedDateChanged) === 'function') {
				this.$element.on('selectedDateChanged', this.options.onSelectedDateChanged);
			}

			if (this.options.fillWidth) {
				$(window).on('resize', $.proxy(this._resize, this));
			}
		},

		_destroy: function () {

			if (this.initialized) {

				// Cleanup dom
				if (this.$calendar) {
					this.$calendar.datepicker('remove');
				}
				this.$wrapper.remove();
				this.$wrapper = null;
				// this.$element.remove();

				// Switch off events
				this._unsubscribeEvents();
			}

			// Reset flag
			this.initialized = false;
		},

		_clickedHandler: function(event) {

			event.preventDefault();
			var target = $(event.target).closest('a');
			var classList = target.attr('class') ? target.attr('class').split(' ') : [];

			if (classList.indexOf('dp-no-select') !== -1) {
				// do nothing
			}
			else if (classList.indexOf('dp-nav-left') !== -1) {
				this._navBack();
			}
			else if (classList.indexOf('dp-nav-right') !== -1) {
				this._navForward();
			}
			else if (classList.indexOf('dp-item') !== -1) {
				this._select(target.attr('data-moment'));
			}
		},

		_setSelectedDate: function(selectedDate) {

			if ((!selectedDate.isSame(this.options.selectedDate.date)) &&
					(!selectedDate.isBefore(this.options.startDate.date)) &&
					(!selectedDate.isAfter(this.options.endDate.date))) {
				
				this.options.selectedDate.date = selectedDate.startOf('day');
				this.$element.trigger('selectedDateChanged', [selectedDate.clone()]);
			}
		},

		_next: function (m, fn) {

			var tmp = m,
				next,
				offDay,
				inRange = true;

			do {
				// get next date
				tmp = fn(tmp);
				offDay = this._isOffDay(tmp);
				inRange = this._inRange(tmp);
				// check date valid and in range
				if ((!offDay || !offDay.disable) && inRange) {
					next = tmp;
					break;
				}
			}
			while (inRange);

			return next;
		},

		_back: function (m) {
			return m.clone().subtract('day', 1);
		},

		_forward: function (m) {
			return m.clone().add('day', 1);
		},

		_navBack: function () {
			
			var next = this._next(this.options.selectedDate.date, this._back);
			if (next) {
				this._setSelectedDate(next);
				this._render();
			}
		},

		_navForward: function () {

			var next = this._next(this.options.selectedDate.date, this._forward);
			if (next) {
				this._setSelectedDate(next);
				this._render();
			}
		},

		_select: function(date) {

			this._setSelectedDate(moment(date, this.options.selectedDate.format));
			this._render();
		},

		_calendarSelect: function(event) {

			this._setSelectedDate(moment(event.date));
			this._render();
		},

		_resize: function () {

			this.options.width = this.$element.width();
			this._render();
		},

		_render: function () {

			var self = this;

			if (!this.initialized) {

				// Setup first time only components, reused on later _renders
				this.$element
					.removeClass('datepaginator datepaginator-sm datepaginator-lg')
					.addClass(this.options.size === 'sm' ? 'datepaginator-sm' : this.options.size === 'lg' ? 'datepaginator-lg' : 'datepaginator');
				this.$wrapper = $(this._template.list);
				this.$leftNav = $(this._template.navItem)
					.addClass('dp-nav-left')
					.addClass(this.options.size === 'sm' ? 'dp-nav-sm' : this.options.size === 'lg' ? 'dp-nav-lg' : '')
					.addClass(this.options.squareEdges ? 'dp-nav-square-edges' : '')
					.append($(this._template.icon)
						.addClass('glyphicon-chevron-left'))
					.width(this.options.navItemWidth);
				this.$rightNav = $(this._template.navItem)
					.addClass('dp-nav-right')
					.addClass(this.options.size === 'sm' ? 'dp-nav-sm' : this.options.size === 'lg' ? 'dp-nav-lg' : '')
					.addClass(this.options.squareEdges ? 'dp-nav-square-edges' : '')
					.append($(this._template.icon)
						.addClass('glyphicon-chevron-right'))
					.width(this.options.navItemWidth);
				this.$calendar = this.options.showCalendar ? $(this._template.calendar) : undefined;
				this._injectStyle();
				this.initialized = true;
			}
			else {

				// Remove datepicker from DOM
				if (this.$calendar) {
					this.$calendar.datepicker('remove');
				}
			}

			// Get data then string together DOM elements
			var data = this._buildData();
			this.$element.empty().append(this.$wrapper.empty());

			// Left nav
			this.$leftNav
				.removeClass('dp-no-select')
				.attr('title', '');
			if (data.startOfRange) {
				this.$leftNav
					.addClass('dp-no-select')
					.attr('title', 'Start of Range');
			}
			this.$wrapper.append($(self._template.listItem).append(this.$leftNav));

			// Items
			$.each(data.items, function(id, item) {

				var $a = $(self._template.dateItem)
					.attr('data-moment', item.m)
					.attr('title', item.hint)
					.width(item.itemWidth);

				if (item.isSelected && self.options.highlightSelectedDate) {
					$a.addClass('dp-selected');
				}
				if (item.isToday && self.options.highlightToday) {
					$a.addClass('dp-today');
				}
				if (item.isStartOfWeek && self.options.showStartOfWeek) {
					$a.addClass('dp-divider');
				}
				if (item.isOffDay && self.options.showOffDays) {
					$a.addClass('dp-off');
					if (item.isOffDay.disable) {
						$a.addClass('dp-no-select');
					}
				}
				if (item.isSelected && self.options.showCalendar) {
					$a.append(self.$calendar);
				}
				if (self.options.size === 'sm') {
					$a.addClass('dp-item-sm');
				}
				else if (self.options.size === 'lg') {
					$a.addClass('dp-item-lg');
				}
				if (!item.inRange) {
					$a.addClass('dp-no-select');
				}
				$a.append(item.text);

				self.$wrapper.append($(self._template.listItem).append($a));
			});

			// Right nav
			this.$rightNav
				.removeClass('dp-no-select')
				.attr('title', '');
			if (data.endOfRange) {
				this.$rightNav
					.addClass('dp-no-select')
					.attr('title', 'End of Range');
			}
			this.$wrapper.append($(self._template.listItem).append(this.$rightNav));

			// Add datepicker and setup event handling
			if (this.$calendar) {
				this.$calendar
					.datepicker({
						autoclose: true,
						forceParse: true,
						startView: 0, //2
						minView: 0, //2
						// todayBtn: true,
						todayHighlight: true,
						startDate: this.options.startDate.date.toDate(),
						endDate: this.options.endDate.date.toDate()
					})
					.datepicker('update', this.options.selectedDate.date.toDate())
					.on('changeDate', $.proxy(this._calendarSelect, this));
			}
		},

		_injectStyle: function () {
			// Make sure we only add it once
			if (this.options.injectStyle && !document.getElementById('bootstrap-datepaginator-style')) {
				$('<style type="text/css" id="bootstrap-datepaginator-style">' + this._css + '</style>').appendTo('head');
			}
		},

		_buildData: function () {

			var viewWidth = (this.options.width - ((this.options.selectedItemWidth - this.options.itemWidth) + (this.options.navItemWidth * 2))),
				units = Math.floor(viewWidth / this.options.itemWidth),
				unitsPerSide = parseInt(units / 2),
				adjustedItemWidth = Math.floor(viewWidth / units),
				adjustedSelectedItemWidth = Math.floor(this.options.selectedItemWidth + (viewWidth - (units * adjustedItemWidth))),
				start = this.options.selectedDate.date.clone().subtract('days', unitsPerSide),
				end = this.options.selectedDate.date.clone().add('days', (units - unitsPerSide));

			var data = {
				startOfRange: this._next(this.options.selectedDate.date, this._back) ? false : true,
				endOfRange: this._next(this.options.selectedDate.date, this._forward) ? false : true,
				items: []
			};

			for (var m = start; m.isBefore(end); m.add('days', 1)) {

				var inRange = this._inRange(m),
					isSelected = this._isSelectedDate(m),
					isToday = this._isToday(m),
					isStartOfWeek = this._isStartOfWeek(m),
					isOffDay = this._isOffDay(m);

				data.items[data.items.length] = {
					m: m.clone().format(this.options.selectedDate.format),
					inRange: inRange,
					isSelected: isSelected,
					isOffDay: isOffDay,
					isStartOfWeek: isStartOfWeek,
					isToday: isToday,
					text: this._formatText(m, isSelected),
					hint: this._formatHint(m, inRange, isOffDay),
					itemWidth: isSelected ? adjustedSelectedItemWidth : adjustedItemWidth
				};
			}

			return data;
		},

		_formatText: function (m, isSelected) {

			var text = m.format(this.options.text);
			if (isSelected) {
				text = m.format(this.options.textSelected);
			}
			return text;
		},

		_formatHint: function (m, inRange, isOffDay) {

			var hint = m.format(this.options.hint);
			if (!inRange) {
				hint = 'Out of Range';
			}
			else if (isOffDay && isOffDay.disable) {
				hint = isOffDay.disable.hint ? isOffDay.disable.hint : 'Disabled';
			}
			return hint;
		},

		_inRange: function (m) {

			if ((m.isSame(this.options.startDate.date) || m.isAfter(this.options.startDate.date)) &&
					(m.isSame(this.options.endDate.date) || m.isBefore(this.options.endDate.date))) {
				return true;
			}
			else {
				return false;
			}
		},

		_isSelectedDate: function (m) {

			return m.isSame(this.options.selectedDate.date);
		},

		_isToday: function (m) {

			if (m.isSame(moment().startOf('day'))) {
				return true;
			}
			else {
				return false;
			}
		},

		_isStartOfWeek: function (m) {

			var formattedDate = m.format(this.options.startOfWeek.format);
			if (this.options.startOfWeek.dates.indexOf(formattedDate) !== -1) {
				return true;
			}
			return false;
		},

		// If an off day then we also need it's options i.e. selectable,
		// so we'll return the offDays object itself
		_isOffDay: function (m) {

			var result = false;
			$.each(this.options.offDays, function (index, offDays) {
				if (offDays.dates.indexOf(m.format(offDays.format)) !== -1) {
					result = offDays;
					return;
				}
			});
			return result;
		},

		_template: {
			list: '<ul class="pagination"></ul>',
			listItem: '<li></li>',
			navItem: '<a href="#" class="dp-nav"></a>',
			dateItem: '<a href="#" class="dp-item"></a>',
			icon: '<i class="glyphicon"></i>',
			calendar: '<i id="dp-calendar" class="glyphicon glyphicon-calendar"></i>'
		},

		_css: '.datepaginator{font-size:12px;height:60px}.datepaginator-sm{font-size:10px;height:40px}.datepaginator-lg{font-size:14px;height:80px}.pagination{margin:0;padding:0;white-space:nowrap}.dp-nav{height:60px;padding:22px 0!important;width:20px;margin:0!important;text-align:center}.dp-nav-square-edges{border-radius:0!important}.dp-item{height:60px;padding:13px 0!important;width:35px;margin:0!important;border-left-style:hidden!important;text-align:center}.dp-item-sm{height:40px!important;padding:5px!important}.dp-item-lg{height:80px!important;padding:22px 0!important}.dp-nav-sm{height:40px!important;padding:11px 0!important}.dp-nav-lg{height:80px!important;padding:33px 0!important}a.dp-nav-right{border-left-style:hidden!important}.dp-divider{border-left:2px solid #ddd!important}.dp-off{background-color:#F0F0F0!important}.dp-no-select{color:#ccc!important;background-color:#F0F0F0!important}.dp-today{background-color:#88B5DB!important;color:#fff!important}.dp-selected{background-color:#428bca!important;color:#fff!important;width:140px}#dp-calendar{padding:3px 5px 0 0!important;margin-right:3px;position:absolute;right:0;top:10}'
	};

	var logError = function(message) {
        if(window.console) {
            window.console.error(message);
        }
    };

	// Prevent against multiple instantiations,
	// handle updates and method calls
	$.fn[pluginName] = function(options, args) {
		return this.each(function () {
			var self = $.data(this, 'plugin_' + pluginName);
			if (typeof options === 'string') {
				if (!self) {
					logError('Not initialized, can not call method : ' + options);
				}
				else if (!$.isFunction(self[options]) || options.charAt(0) === '_') {
					logError('No such method : ' + options);
				}
				else {
					if (typeof args === 'string') {
						args = [args];
					}
					self[options].apply(self, args);
				}
			}
			else {
				if (!self) {
					$.data(this, 'plugin_' + pluginName,
							new DatePaginator(this, $.extend(true, {}, options)));
				}
				else {
					self._init(options);
				}
			}
		});
	};

})(jQuery, window, document);