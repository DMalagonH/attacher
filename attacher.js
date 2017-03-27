/**
 * Plugin para carga de archivos directamente al servidor
 * 
 * Dependencias: jQuery, underscore, jQuery Form Plugin
 * Date: 2016-09-22
 * 
 * @author Diego Malagón <diegomalagonh@gmail.com>
 * @param {type} $ jQuery
 * @param {type} _ underscore
 * @returns {undefined}
 */
(function ($, _) {    
    var Attacher = function(){ 
        /**
         * Elementos html
         * 
         * @type Object
         */
        var el = {};
        
        /**
         * Opciones
         * 
         * @type Object
         */
        var options = {};
        
        /**
         * Función para construir interface y asignar funcionalidad
         * 
         * @returns {undefined}
         */
        var initGUI = function(){              
            var $tmpl = $(options.template).html();
            var template = _.template($tmpl)({});
                
            // Agregar template a contenedor
            el.$wrapper.html(template);
            
            // Extraer elementos
            el.$form = $(".attacher-form", el.$wrapper);
            el.$total = el.$wrapper.find(".attacher-count");
            el.$btn_select = $(".attacher-btn-file", el.$wrapper);              
            el.$btn_select_text = $(".btn-text", el.$btn_select);
            el.$btn_select_text.original = el.$btn_select_text.html();
            el.$btn_upload = $(".attacher-btn-upload", el.$wrapper);              
            el.$input = $(".attacher-input-file", el.$wrapper);
            el.$list = $(".attacher-file-list", el.$wrapper);
            el.$list_item_tmpl = $("#attacher-file-list-item");
            el.$progress = $(".attacher-progress", el.$wrapper);
            el.$progress_bar = $(".progress-bar", el.$progress);
                        
            el.$form.attr("method", options.method);
            el.$form.attr("action", options.url);
            el.$form.attr("enctype", "multipart/form-data");
            
            if(options.multiple){
                el.$input.attr("multiple", true);
                var name = el.$input.attr("name");
                el.$input.attr("name", name + "[]");
            }
            else{
                el.$input.attr("multiple", false);
            }
            
            resetForm();
            
            // Evento change del input file
            el.$input.on("change", function(){
                getFilesList();
            });
            
            // Asignar comportamiento de formulario
            el.$form.ajaxForm({
                dataType: "JSON",
                data: $.extend({"sentBy": "attacher"}, options.data),
                beforeSend: function(){
                    loadingForm();
                },
                uploadProgress: function(event, position, total, percent) {
                    el.$progress_bar.width(percent + '%');
                },
                complete: function(xhr){                    
                    resetForm();
                    
                    if(xhr.status === 200){
                        // callback
                        if(typeof(options.success) === "function"){
                            var response = xhr.responseText;
                            
                            if(options.response_type.toLowerCase() === "json"){
                                response = JSON.parse(response);
                            }
                            
                            options.success(response);
                        }
                    }
                },
                error: function(){
                    // callback
                    if(typeof(options.error) === "function"){
                        options.error();
                    }
                }
            });
            
            // Detener funcionamiento default del formulario
            el.$form.on("submit", function(e){
                e.preventDefault();
                e.stopPropagation();
            });
        };
        
        /**
         * Función que obtiene y muestra la lista de archivos seleccionados
         * 
         * @returns {undefined}
         */
        var getFilesList = function(){
            var list = el.$input.prop("files");
            var total = list.length;
            
            if(options.show_badge === true){
                el.$total.html(total);
            }
            
            if(options.show_list === true){
                // limpiar lista
                el.$list.html("");

                var $itmpl = el.$list_item_tmpl.html();

                for (var i = 0; i < total; i++){
                    el.$list.append(_.template($itmpl)({
                        name: list[i].name
                    }));
                }
            }
            
            if(total > 0){                
                if(options.auto_submit === true){
                    el.$form.submit();
                }
                else{
                    el.$btn_upload.show();
                }
            }
            else{
                el.$btn_upload.hide();
            }
        };
        
        /**
         * Función para resetear el formulario
         * 
         * @returns {undefined}
         */
        var resetForm = function(){
            el.$btn_upload.hide();
            el.$progress.hide();
            el.$progress_bar.width("0%");
            el.$input.attr("disabled", false);
            el.$btn_upload.attr("disabled", false);
            el.$total.html("");
            el.$btn_select.attr("disabled", false);
            el.$input.val("");
            el.$list.html("");
            el.$btn_select_text.html(el.$btn_select_text.original);
            
            if(typeof options.reset === "function"){
                options.reset();
            }
        };
        
        /**
         * Función para deshabilitar los controles del formulario mientras se esta enviando la petición
         * 
         * @returns {undefined}
         */
        var loadingForm = function(){
            el.$progress.fadeIn();
            el.$input.attr("disabled", true);
            el.$btn_upload.attr("disabled", true);
            el.$btn_select.attr("disabled", true);
            el.$btn_select_text.html(el.$btn_select.data("loading-text"));
            
            if(typeof options.loading === "function"){
                options.loading();
            }
        };
        
        return {
            init: function(element, opts){
                el.$wrapper = $(element);
                options = opts;
                
                initGUI();
            }
        };
    }();
    
    $.fn.attacher= function(options, args){        
        var element = this;
        
        if(Attacher[options]){
            return Attacher[options](args);
        }
        else if(typeof(options) === "object" || !options){
            
            options = $.extend({}, $.fn.attacher.defaults, options );
            
            return Attacher.init(element, options, args);
        }
    };
    
    $.fn.attacher.defaults = {
        method:         "POST",
        url:            "",
        data:           {},
        response_type:  "json",
        multiple:       true,
        auto_submit:    false,
        show_list:      true,
        show_badge:     true,
        template:       "#attacher-tmpl",
        success:        null,
        error:          null,
        loading:        null,
        reset:          null
    };
    
})(jQuery, _);