# Attacher
Uploading and previewing files from an input file via ajax   
Carga y previsualización de archivos adjuntos de un input file a través de ajax


## Dependencies
* jQuery
* underscore
* jQuery Form Plugin
* Bootstrap

## Usage

### Underscore templates
#### Form
	<script type="text/template" id="share-attacher-tmpl">
	    <div class="attacher-wrapper attacher-block">
	        <form class="attacher-form">
	            <div class="row">
	                <div class="col-ml-12">
	                    <div class="progress attacher-progress">
	                        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 40%"></div>
	                    </div>
	                    <input type="file" name="file" class="attacher-input-file"/>
	                    <a class="btn btn-default btn-sm attacher-btn-file no-disable" data-loading-text="Subiendo..."><i class="fa fa-paperclip"></i> <span class="badge attacher-count"></span></a>
	                </div>
	            </div>
	        </form>
	    </div>
	</script>  

#### Preview
	<script type="text/template" id="attachments-tmpl">
    <% if(post.attachments.length > 0){ %>
        <div class="row attachments-preview">
            <% _.each(post.attachments, function(attachment){ %>
                <div class="col-xs-6 col-md-2 attachment-thumbnail">
                    <div class="thumbnail">
                        <% if(typeof delete_btn !== "undefined" && delete_btn === true){ %>
                            <div class="options">
                                <a class="pointer remove-attachment" data-url="<%= attachment.url %>"> <i class="fa fa-close"></i></a>
                                <div class="loading display-none">
                                    <img src="loadingimg.gif"/>
                                </div>
                            </div>
                        <% } %>
                        <a href="<%= attachment.url %>">
                            <% if(attachment.type === "jpg" || attachment.type === "jpeg" || attachment.type === "png" || attachment.type === "gif"){ %>
                                <img src="<%= attachment.url %>" alt="<%= attachment.name%>" />
                            <% } else { %>
                                <img src="{{ cdn('assets/images/attachment-128.png') }}" alt="<%= attachment.name%>" />
                            <% } %>
                        </a>
                        <div class="no-word-wrap">
                            <a href="<%= attachment.url %>"><%= attachment.name %></a>
                        </div>
                    </div>
                 </div>
            <% }); %>
        </div>
    <% } %> 
</script>


### HTML
	<div id="attachments-preview"></div>
	<div class="post-attacher share-attacher"></div>

### JavaScript
	
        $(".share-attacher").attacher({
            template:       "#share-attacher-tmpl",
            url:            url/to/upload/files,
            data: {
                path:       "/path/to/storage/files/"
            },
            show_list:      true,
            show_badge:     true,
            auto_submit:    true,
            loading: function(){
                // loading actions
            },
            reset: function(){
                // reset actions
            },
            success: function(response){                
                // Render file list
                $("#attachment_preview").html(_.template($("#attachments-tmpl").html())({
                    post: {
                        attachments: response.files
                    },
                    delete_btn: true
                }));
            },
            error: function(){
                console.error("UPLOAD ERROR");
            }
        });