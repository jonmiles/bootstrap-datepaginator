/* global module, test, ok, equal, deepEqual, moment, $ */

;(function () {

	'use strict';

	module('Options');

	// Initialize a new paginator for testing
	function init(options) {
		return $('#paginator').datepaginator(options);
	}

	// Get options from paginator once initialized
	function getOptions(el) {
		return el.data('plugin_datepaginator').options;
	}

	test('Options setup', function () {
		// First test defaults option values
		var el = init(),
			options = getOptions(el);
		ok(options, 'Defaults created ok');
		equal(options.fillWidth, true, 'fillWidth default ok');
		equal(options.highlightSelectedDate, true, 'highlightSelectedDate default ok');
		equal(options.highlightToday, true, 'highlightToday default ok');
		equal(options.hint, 'dddd, Do MMMM YYYY', 'hint default ok');
		equal(options.injectStyle, true, 'injectStyle default ok');
		equal(options.itemWidth, 35, 'itemWidth default ok');
		equal(options.navItemWidth, 20, 'navItemWidth default ok');
		deepEqual(options.offDays, [{ dates: ['Sat', 'Sun'], format: 'ddd', disable: false }], 'offDays default ok');
		equal(options.onSelectedDateChanged, null, 'onSelectedDateChanged default ok');
		equal(options.selectedDate.date.format('YYYY-MM-DD'), moment().startOf('day').format('YYYY-MM-DD'), 'selectedDate default ok');
		equal(options.selectedDate.format, 'YYYY-MM-DD', 'selectedDateFormat default ok');
		equal(options.selectedItemWidth, 140, 'selectedItemWidth default ok');
		equal(options.showCalendar, true, 'showCalendar default ok');
		equal(options.size, undefined, 'size default ok');
		deepEqual(options.periodSeparators, [{ dates: ['Mon'], format: 'ddd' }], 'periodSeparators default ok');
		equal(options.squareEdges, false, 'squareEdges default ok');
		equal(options.text, 'ddd<br/>Do', 'text default ok');
		equal(options.textSelected, 'dddd<br/>Do, MMMM YYYY', 'textSelected default ok');
		equal(options.width, el.width(), 'width default ok');
		deepEqual(options.startDate, {date:moment(new Date(-8640000000000000)), format:'YYYY-MM-DD'}, 'startDate default ok');
		deepEqual(options.endDate, {date:moment(new Date(8640000000000000)), format:'YYYY-MM-DD'}, 'endDate default ok');

		// Then test user options are correctly set
		var opts = {
			highlightSelectedDate: false,
			highlightToday: false,
			hint: 'Do MMMM YYYY',
			injectStyle: false,
			itemWidth: 50,
			navItemWidth: 50,
			offDays: [{
				dates: ['7', '0'],
				format: 'd'
			}],
			onSelectedDateChanged: function () {},
			selectedDate: {
				date: '05-10-2013',
				format: 'DD-MM-YYYY'
			},
			selectedItemWidth: 200,
			showCalendar: false,
			size: 'small',
			periodSeparators: [{
				dates: ['0'],
				format: 'd'
			}],
			squareEdges: true,
			text: 'Do<br/>ddd',
			textSelected: 'dddd<br/>Do, MMMM YYYY',
			width: 400,
			startDate: {
				date: '01-01-2013',
				format: 'DD-MM-YYYY'
			},
			endDate: {
				date: '31-12-2013',
				format: 'DD-MM-YYYY'
			}
		};

		options = getOptions(init(opts));
		ok(options, 'User options created ok');
		equal(options.fillWidth, false, 'fillWidth set ok');
		equal(options.highlightSelectedDate, opts.highlightSelectedDate, 'highlightSelectedDate set ok');
		equal(options.highlightToday, opts.highlightToday, 'highlightToday set ok');
		equal(options.hint, opts.hint, 'hint set ok');
		equal(options.injectStyle, opts.injectStyle, 'injectStyle set ok');
		equal(options.itemWidth, opts.itemWidth, 'itemWidth set ok');
		equal(options.navItemWidth, opts.navItemWidth, 'navItemWidth set ok');
		deepEqual(options.offDays, opts.offDays, 'offDays set ok');
		equal(typeof options.onSelectedDateChanged, 'function', 'onSelectedDateChanged set ok');
		equal(options.selectedDate.date.format('YYYY-MM-DD'),
			moment(opts.selectedDate.date, opts.selectedDate.format).startOf('day').format('YYYY-MM-DD'), 'selectedDate set ok');
		equal(options.selectedDate.format, opts.selectedDate.format, 'selectedFte.format set ok');
		equal(options.selectedItemWidth, opts.selectedItemWidth, 'selectedItemWidth set ok');
		equal(options.showCalendar, opts.showCalendar, 'showCalendar set ok');
		equal(options.size, 'sm', 'size set ok');
		deepEqual(options.periodSeparators, opts.periodSeparators, 'periodSeparators set ok');
		equal(options.squareEdges, opts.squareEdges, 'squareEdges set ok');
		equal(options.text, opts.text, 'text set ok');
		equal(options.textSelected, opts.textSelected, 'textSelected set ok');
		equal(options.width, 400, 'width set ok');
		deepEqual(options.startDate, opts.startDate, 'startDate set ok');
		deepEqual(options.endDate, opts.endDate, 'endDate set ok');
	});

	test('Options 1.2.0 backwards compatible', function () {

		var opts = {
			offDays: 'Sat,Sun',
			offDaysFormat: 'ddd',
			startOfWeek: 'Mon',
			startOfWeekFormat: 'ddd',
			startDate: '2014-01-01',
			startDateFormat: 'YYYY-MM-DD',
			endDate: '2014-12-31',
			endDateFormat: 'YYYY-MM-DD',
			selectedDate: '2014-01-01',
			selectedDateFormat: 'YYYY-MM-DD'
		};
		var options = getOptions(init(opts));

		var expectedOffDays = [
			{
				dates: [ 'Sat', 'Sun' ],
				format: 'ddd'
			}
		];
		ok((((typeof options.offDays) === 'object') &&
			(options.offDays instanceof Array)), 'offDays convert to the right type');
		deepEqual(expectedOffDays, options.offDays, 'offDays contain the correct dates');

		var expectedPeriodSeparators = [
			{
				dates: [ 'Mon' ],
				format: 'ddd'
			}
		];
		ok(((typeof options.periodSeparators) === 'object'), 'startOfWeek converts to the right type');
		deepEqual(expectedPeriodSeparators, options.periodSeparators, 'startOfWeek contains the correct dates');

		var expectedStartDate = {
			date: moment('2014-01-01', 'YYYY-MM-DD').startOf('day'),
			format: 'YYYY-MM-DD'
		};
		ok(((typeof options.startDate) === 'object'), 'startDate converts to the right type');
		deepEqual(expectedStartDate, options.startDate, 'startDate contains the correct dates');

		var expectedEndDate = {
			date: moment('2014-12-31', 'YYYY-MM-DD').startOf('day'),
			format: 'YYYY-MM-DD'
		};
		ok(((typeof options.endDate) === 'object'), 'endDate converts to the right type');
		deepEqual(expectedEndDate, options.endDate, 'endDate contains the correct dates');

		var expectedSelectedDate = {
			date: moment('2014-01-01', 'YYYY-MM-DD'),
			format: 'YYYY-MM-DD'
		};
		ok(((typeof options.selectedDate) === 'object'), 'selectedDate converts to the right type');
		deepEqual(expectedSelectedDate, options.selectedDate, 'selectedDate contains the correct dates');
	});

	
	module('Appearance');

	test('Highlight selected date', function () {
		init();
		equal($('.dp-selected').attr('data-moment'), moment().format('YYYY-MM-DD'), 'Correct date is highlighted when set to true');
		init({highlightSelectedDate:false});
		ok(!$('.dp-selected').length, 'No date is highlighted when set to false');
	});

	test('Highlight today', function () {
		init();
		equal($('.dp-today').attr('data-moment'), moment().format('YYYY-MM-DD'), 'Correct date is highlighted when set to true');
		init({highlightToday:false});
		ok(!$('.dp-today').length, 'No date is highlighted when set to false');
	});

	test('Hint', function () {
		var options = getOptions(init()),
			item = $('.dp-item:first'),
			expected = moment(item.attr('data-moment'), options.selectedDate.format).format(options.hint),
			actual = item.attr('title');
		equal(expected, actual, 'Hint correct "' + expected + '" = "' + actual + '"');
	});

	// test('injectStyle', function () {
	// 	init({injectStyle:false});
	// 	console.log('style = ' + $('#bootstrap-datepaginator-style'));
	// 	ok($('#bootstrap-datepaginator-style'))
	// });

	// test('itemWidth', function () {
	// 	var options = getOptions(init({itemWidth:50}));
	// 	console.log('width = ' + $('.dp-item').width() + ' / ' + options.itemWidth);
	// 	ok($('.dp-item:first').css('width') >= 50, 'Item width ok');
	// });

	// test('navItemWidth', function () {
	// 	var el = init({navItemWidth:50});
	// 	console.log('nav width = ' + $('.dp-nav:first').width());
	// 	ok($('.dp-nav:first').width() >= 50, 'Item width ok');
	// });

	// test('selectedItemWidth', function () {
	// 	var el = init({selectedItemWidth:150});
	// 	console.log('nav width = ' + $('.dp-selected').width());
	// 	ok($('.dp-selected').width() >= 150, 'Item width ok');
	// });

	test('Show calendar', function () {
		init();
		ok($('#dp-calendar'), 'Calendar shown when set to true');
		init({showCalendar:false});
		ok(!$('#dp-calendar').length, 'No calendar when set to false');
	});

	test('Off days', function () {

		function dayOfWeek(obj, options, offDays) {
			return moment($(obj).attr('data-moment'), options.selectedDate.format).format(offDays.format);
		}
		
		function offDaysCorrect(options) {
			var correct = true;
			$.each($('.dp-item.dp-off'), function (i, obj) {
				$.each(options.offDays, function (i, offDays) {
					var day = dayOfWeek(obj, options, offDays);
					if (offDays.dates.indexOf(day) === -1) {
						correct = false;
					}
				});
			});
			return correct;
		}

		ok(offDaysCorrect(getOptions(init())), 'Correct off days shown when using default');
		ok(offDaysCorrect(getOptions(init({offDays:[{dates:['Mon']}]}))), 'Correct off days shown when using a single custom value');
		ok(offDaysCorrect(getOptions(init({offDays:[{dates:['Mon','Wed','Fri']}]}))), 'Correct off days shown when using multiple custom values');
		ok(offDaysCorrect(getOptions(init({offDays:[{dates:['0','1'],format:'d'}]}))), 'Correct off days shown when using custom offDaysFormat');
		ok(offDaysCorrect(getOptions(init({offDays:undefined}))), 'Correct off days shown when offDays set to undefined');
	});

	test('Period separators', function () {

		function dayOfWeek(obj, options, separators) {
			return moment($(obj).attr('data-moment'), options.selectedDate.format).format(separators.format);
		}
		
		function separatorsCorrect(options) {
			var correct = true;
			$.each($('.dp-item.dp-separator'), function(i, obj) {
				$.each(options.periodSeparators, function (i, separators) {
					if (separators) {
						var day = dayOfWeek(obj, options, separators);
						if (separators.dates.indexOf(day) === -1) {
							correct = false;
						}
					}
				});
			});
			return correct;
		}

		ok(separatorsCorrect(getOptions(init())), 'Correct period separators shown when using default');
		ok(separatorsCorrect(getOptions(init({periodSeparators:[{dates:['Wed']}]}))), 'Correct period separators shown when using a single custom value');
		ok(separatorsCorrect(getOptions(init({periodSeparators:[{dates:['Fri','Wed']}]}))), 'Correct period separators shown when using multiple custom values');
		ok(separatorsCorrect(getOptions(init({periodSeparators:[{dates:['0'],format:'d'}]}))), 'Correct period separators shown when using custom periodSeparators.format');
		ok(separatorsCorrect(getOptions(init({periodSeparators:undefined}))), 'Correct period separators shown when periodSeparators set to undefined');
	});

	test('Selected date', function () {

		var options = getOptions(init());
		equal($('.dp-selected').attr('data-moment'), moment().format(options.selectedDate.format),
			'Correct selectedDate when using default : todays date');

		options = getOptions(init({selectedDate:{ date: '2013-10-05' }}));
		equal($('.dp-selected').attr('data-moment'), moment('2013-10-05',options.selectedDate.format).format(options.selectedDate.format), //'2013-10-05', 
			'Correct selectedDate when set via selectedDate option');

		options = getOptions(init({selectedDate:{ date:'05-10-2013', format:'DD-MM-YYYY' }}));
		equal($('.dp-selected').attr('data-moment'), moment('05-10-2013',options.selectedDate.format).format(options.selectedDate.format), //'05-10-2013', 
			'Correct selectedDate when set via selectedDate using a custom date format');
		
		options = getOptions(init().datepaginator('setSelectedDate', { date: '2013-10-06' }));
		equal($('.dp-selected').attr('data-moment'), moment('2013-10-06',options.selectedDate.format).format(options.selectedDate.format), //'2013-10-06', 
			'Correct selectedDate when set via setSelectedDate method using default format');

		options = getOptions(init({selectedDate:{ date: '2013-10-05', format: 'DD-MM-YYYY' }}).datepaginator('setSelectedDate', { date: '06-10-2013' }));
		equal($('.dp-selected').attr('data-moment'), moment('06-10-2013',options.selectedDate.format).format(options.selectedDate.format), //'06-10-2013', 
			'Correct selectedDate when set via setSelectedDate method using custom selectedDate.format set via options');

		options = getOptions(init().datepaginator('setSelectedDate', { date: '06-10-2013', format: 'DD-MM-YYYY'}));
		equal($('.dp-selected').attr('data-moment'), moment('06-10-2013','DD-MM-YYYY').format(options.selectedDate.format), //'2013-10-06',
			'Correct selectedDate when set via setSelectedDate method using custom selectedDate.format set in method arguments');

		options = getOptions(init({startDate:'2013-12-01',selectedDate:{ date: '2013-11-01' }}));
		equal($('.dp-selected').attr('data-moment'), options.startDate.date.format(options.selectedDate.format),
			'Correctly overrides selectedDate when invalid : selectedDate < startDate');

		options = getOptions(init({endDate:'2013-12-31',selectedDate:{ date: '2014-01-01' }}));
		equal($('.dp-selected').attr('data-moment'), options.endDate.date.format(options.selectedDate.format),
			'Correctly overrides selectedDate when invalid : selectedDate > endDate');
	});

	test('Item text', function () {

		function formatText(el, format) {
			return moment(el.attr('data-moment')).format(format)
				.replace('<br/>', '').replace('<br>','');
		}
		
		// Test first with default values
		var options = getOptions(init()),
			itemEl = $('.dp-item:first'),
			selectedItemEl = $('.dp-selected');
		equal(itemEl.text(), formatText(itemEl, options.text),
			'Item text correct when using default');
		equal(selectedItemEl.text(), formatText(selectedItemEl, options.textSelected),
			'Selected item text correct when using default value');

		// then with custom values
		options = getOptions(init({text:'Do<br>ddd',textSelected:'Do, MMMM YYYY<br>dddd'}));
		itemEl = $('.dp-item:first');
		selectedItemEl = $('.dp-selected');
		equal(itemEl.text(), formatText(itemEl, 'Do<br>ddd'),
			'Item text correct when using custom value');
		equal(selectedItemEl.text(), formatText(selectedItemEl, 'Do, MMMM YYYY<br>dddd'),
			'Selected item text correct when using custom value');
	});

	test('Size', function () {
		init();
		ok($('.datepaginator'), 'Correctly set .datepaginator when using default ');
		ok(!$('.dp-item-sm').length || !$('.dp-item-lg').length, 'Item set correct when using default');
		ok(!$('.dp-nav-sm').length || !$('.dp-nav-lg').length, 'Nav item set correct when using default');
		init({size:'normal'});
		ok($('.datepaginator'), 'Correctly set .datepaginator when size set as normal ');
		ok(!$('.dp-item-sm').length || !$('.dp-item-lg').length, 'Item set correct when size set as normal');
		ok(!$('.dp-nav-sm').length || !$('.dp-nav-lg').length, 'Nav item set correct when size set as normal');
		init({size:'small'});
		ok($('.datepaginator-sm'), 'Container set to .datepaginator-sm when size set to small');
		ok($('.dp-item-sm'), 'Item set to .dp-item-sm when size is set to small');
		ok($('.dp-nav-sm'), 'Nav item set to .dp-nav-sm when size is set to small');
		init({size:'large'});
		ok($('.datepaginator-lg'), 'Container set to .datepaginator-lg when size set to large');
		ok($('.dp-item-lg'), 'Item set to .dp-item-lg when size is set to large');
		ok($('.dp-nav-lg'), 'Nav item set to .dp-nav-lg when size is set to large');
	});


	test('Square Edges', function () {
		init();
		ok(!$('.dp-nav-sqauare-edges').length, 'Using rounded edges by default');
		init({squareEdges:false});
		ok(!$('.dp-nav-sqauare-edges').length, 'Square edges not used when squareEdges set to false');
		init({squareEdges:true});
		ok($('.dp-nav-sqauare-edges'), 'Square edges set correctly when squareEdges set to true');
	});



	module('Behaviour');

	test('Is chainable', function () {
		var el = init();
		ok(el.addClass('test'), 'Is chainable');
		equal(el.attr('class'), 'datepaginator test', 'Test class was added');
	});

	function getSelectedDateAsMoment(options) {
		return moment($('.dp-selected').attr('data-moment'), options.selectedDate.format);
	}

	test('Navigate backwards', function () {

		// Test valid navigation
		var options = getOptions(init()),
			selectedDate = getSelectedDateAsMoment(options);
		$('.dp-nav-left').trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(selectedDate.clone().subtract('day', 1)),
			'Navigate backwards moves back 1 day');

		// Test invalid navigation
		options = getOptions(init({startDate:'2013-11-01',selectedDate:'2013-11-01'}));
		selectedDate = getSelectedDateAsMoment(options);
		$('a .dp-nav-left').trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(selectedDate),
			'Navigate backwards stops at start date');
	});

	test('Navigate forwards', function () {

		// Test valid navigation
		var options = getOptions(init()),
			selectedDate = getSelectedDateAsMoment(options);
		$('.dp-nav-right').trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(selectedDate.clone().add('day', 1)),
			'Navigate forwards moves forward 1 day');

		// Test invalid navigation
		options = getOptions(init({endDate:'2013-11-01',selectedDate:'2013-11-01'}));
		selectedDate = getSelectedDateAsMoment(options);
		$('a .dp-nav-right').trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(selectedDate),
			'Navigate forwards stops at end date');
	});

	test('Navigate to selected date', function () {

		// Test valid navigation
		var options = getOptions(init()),
			el = $('.dp-item:first');
		el.trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(moment(el.attr('data-moment'), options.selectedDate.format)),
			'Navigate to selected date works');

		// Invalid navigation
		// - startDate
		options = getOptions(init({startDate:'2013-11-01',selectedDate:'2013-11-01'}));
		el = $('.dp-item:first');
		el.trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(getSelectedDateAsMoment(options)),
			'Navigate to selected date does not allow dates before start date');

		// - endDate
		options = getOptions(init({endDate:'2013-11-01',selectedDate:'2013-11-01'}));
		el = $('.dp-item:last');
		el.trigger('click');
		ok(getSelectedDateAsMoment(options).isSame(getSelectedDateAsMoment(options)),
			'Navigate to selected date does not allow dates after end date');
	});

	test('Calendar select', function () {

		// Valid navigation
		var options = getOptions(init());
		var event = $.Event('changeDate');
		event.date = moment('2013-01-01', 'YYYY-MM-DD').toDate();
		$('#dp-calendar').trigger(event);
		ok(getSelectedDateAsMoment(options).isSame(moment('2013-01-01', 'YYYY-MM-DD')),
			'Navigate to calendar selected date works');

		// Invalid navigation
		// - startDate
		options = getOptions(init({startDate:'2013-11-01',selectedDate:'2013-11-01'}));
		event.date = moment('2013-10-01', 'YYYY-MM-DD').toDate();
		$('#dp-calendar').trigger(event);
		ok(getSelectedDateAsMoment(options).isSame(getSelectedDateAsMoment(options)),
			'Navigate to calendar selected date does not allow dates before start date');

		// - endDate
		options = getOptions(init({endDate:'2013-11-01',selectedDate:'2013-11-01'}));
		event.date = moment('2013-12-01', 'YYYY-MM-DD').toDate();
		$('#dp-calendar').trigger(event);
		ok(getSelectedDateAsMoment(options).isSame(getSelectedDateAsMoment(options)),
			'Navigate to calendar selected date does not allow dates after end date');
	});

	test('Event selectedDateChanged', function () {
		var cbWorked, onWorked = false;
		init({
			onSelectedDateChanged: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('selectedDateChanged', function(/*event, date*/) {
			onWorked = true;
		});

		$('.dp-item:first').trigger('click');
		
		ok(cbWorked, 'Worked using callback handler');
		ok(onWorked, 'Worked using jQuery on method');
	});

}());