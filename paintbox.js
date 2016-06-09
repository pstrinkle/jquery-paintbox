/**
 * jquery-paintbox - jQuery Plugin to build out a grid-based coloring system
 * similar to MS Paint.
 * URL: http://pstrinkle.github.com/jquery-paintbox
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 0.1
 * License: Apache 2
 */
(function ($) {
    function PaintBox(config) {
        this.init(config);
    }

    PaintBox.prototype = {

        constructor: PaintBox,

        init: function(config) {
            $.extend(this, config);
        },

        el: null,
        elId: '',
        penColor: 'black',
        penDown: false,
        cols: 50,
        rows: 50,
        colors : ['black', 'red', 'green', 'blue', 'white', 'yellow', 'pink'],
    }

    /**
     * Set up a paintbox.
     * 
     * @param configOrCommand - Config object or command name
     *     Example: { ... };
     *     you may set any public property (see above);
     *
     * @param commandArgument - Some commands (like 'increment') may require an 
     *     argument
     */
    $.fn.paintbox = function(configOrCommand, commandArgument) {
        var dataName = 'paintbox';

        var buildIt = function(instance) {
            var el = instance.el;
            var baseId = instance.elId;

            var clicked = function(event) {
                /* click's this is the individual element */
                $(this).css('background-color', instance.penColor);
            };
            var colorSelect = function(event) {
                instance.penColor = $(this).attr('id');
            };

            el.append($('<div>', {id: baseId + 'pen_box', style: 'clear:both;'}));
            el.append($('<div>', {id: baseId + 'master_box', style: 'clear:both;'}));

            var mId = '#' + baseId + 'master_box';            
            var $dest = $(mId);
            var $pens = $('#' + baseId + 'pen_box');
            var i = 0, j = 0;
            var itm = 'box';

            /* fixup grid container. */
            var master_width = instance.cols * 10;
            var master_height = instance.rows * 10;
            $dest.css('width', master_width + 'px');
            $dest.css('height', master_height + 'px');
                    
            /* build grid */
            for (i = 0; i < instance.rows; i++) {
                for (j = 0; j < instance.cols; j++) {
                    var $n = $('<div>');
                    $n.css('width', '10px');
                    $n.css('height', '10px');
                    $n.css('background-color', 'white');
                    $n.css('float', 'left');
                    $n.css('display', 'inline');

                    $n.attr('id', i + ',' + j);
                    $n.on('click', clicked);
                    $n.addClass(itm);

                    $dest.append($n);
                }
            }

            /* this won't work with multiple paintbox's on the same page. */
            $(mId + ' .box').hover(function(event) {
                /* if pen is selected, and mousedown has been activated, 
                 * then we draw, otherwise we temporarily hover.
                 */                        
                $(this).css('border', '1px solid ' + instance.penColor);

                if (instance.penDown) {
                    $(this).css('background-color', instance.penColor);
                }
            }, function(event) {
                /* if pen is selected, and mousedown has been activated, 
                 * don't undo things.
                 */
                $(this).css('border', 'none');
            });

            /* create pen boxes. */
            $.each(instance.colors, function(index, element) {
                var $color = $('<div>', {id: element, style: "float:left"});
                $pens.append($color);
            });

            /* just do this next. */
            $.each($pens.children(), function(index, element) {
                $(element).css('width', '10px');
                $(element).css('height', '10px');
                $(element).css('float', 'left');
                $(element).css('display', 'inline');

                var id = $(element).attr('id');
                if (id) {
                    $(element).css('background-color', id);
                    $(element).on('click', colorSelect);

                    if (id === 'black') {
                        $(element).css('border', '1px solid white');
                    } else {
                        $(element).css('border', '1px solid black');
                    }
                }
            });

            $dest.on('mousedown', function(event) {
                instance.penDown = true;
            });
            $dest.on('mouseup', function(event) {
                instance.penDown = false;
            });
            $dest.on('mouseleave', function(event) {
                instance.penDown = false;
            });
        };

        return this.each(function() {
            var el = $(this), instance = el.data(dataName),
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                instance.init(config); 
                buildIt(instance);
            } else {
                var initialConfig = $.extend({}, el.data());
                config = $.extend(initialConfig, config);
                config.el = el;
                config.elId = el.attr('id');
                // throw exception if no ID is set for this.

                instance = new PaintBox(config);
                el.data(dataName, instance);
                    
                buildIt(instance);
            }
        });
    }
}(jQuery));
