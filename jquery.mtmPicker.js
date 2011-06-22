/**
* jQuery Plugin to easily manage ajax creation of many-to-many widgets in a form
* @author Ryan Bales
* Usage:
			$(".initial-add-anchor").mtmPicker({
				source : '/controller/ajaxCreationAction',
				container : $('#parent-container'),
				remove_label : 'Remove this element',
				delete_widget : true
			});
**/
(function($) {

	$.fn.mtmPicker = function(options) {

		var defaults = {
			delete_widget : false,
			remove_label : 'Remove',
			source : null, // must be set at runtime
			container : null, // must be set at runtime
			callback : null // option to callback after complete
		};

		var options = $.extend(defaults,options);
		// initialize widget pointer
		var widget_block_pointer = 0;
		if( options.delete_widget === true ) { 
			$('div[class^=mtm]').each(function() {
				var pointer = parseInt($(this).attr('class').replace(/^mtm(.*)/,'$1'));
				if( !isNaN(pointer) ) {
					if( pointer >= widget_block_pointer ) {
						widget_block_pointer = pointer + 1;
					}
				}
			});
		}

		var remove_mtm_block = function() {
			$(this).closest('.mtm' + widget_block_pointer).remove();
		}

		var addNewElementSet = function($node) {
			$.get(options.source,function(response,status) {
				if( status === 'success' ) {
					if( options.delete_widget === false ) {
						if( typeof(options.callback) === 'function' ) {
							options.callback($(response).insertBefore($node));
						}
						else {
							$(response).insertBefore($node);
						}
					}
					else if ( options.delete_widget === true ) {
						var inserted_div = 
						$('<div/>')
							.attr('class','mtm' + widget_block_pointer)
							.append(response)
							.append($('<a/>')
									.attr('class','delete-mtm')
									.text(options.remove_label)
									.css('cursor','pointer')
									.css('margin-left','5px')
							)
							.insertBefore($node);
						// bind anchor to remove function
						$('.mtm' + widget_block_pointer + ':last').find('a.delete-mtm').click(remove_mtm_block);
						if( typeof(options.callback) === 'function' ) {
							options.callback(inserted_div);
						}
					}
				}
			});
		};


		this.each(function() {
			(function($node) {
				$node.click(function() {
					addNewElementSet($( this ));
				});
			})($( this ));	
		});
	};

})(jQuery);
