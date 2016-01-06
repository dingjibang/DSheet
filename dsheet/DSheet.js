/**
 *	Excel-like web sheet
 *	@author dingjibang 
 */

function _to_sheet(_dom,_param){
	this.dom = $(DSheet.tmpl()).appendTo($(_dom));
	this.content = this.dom.find(".sheet_content");
	var posText = this.dom.find(".sheet_pos");
	var that = this;
	var param = _param;
	//生成默认参数
	if(typeof(param) == "undefined") param = new Object();
	if(typeof(param.row) == "undefined") param.row = window.screen.width / 85;
	if(typeof(param.col) == "undefined") param.col = window.screen.height / 25 + 5;
	if(typeof(param.readonly) == "undefined") param.readonly = false;
	if(typeof(param.hideToolbar) == "undefined") param.hideToolbar = false;
	if(typeof(param.funcable) == "undefined") param.funcable = true;
	if(typeof(param.autofunc) == "undefined") param.autofunc = true;
	if(typeof(param.scrollLock) == "undefined") param.scrollLock = false;
	if(typeof(param.sizeEditor) == "undefined") param.sizeEditor = false;
	if(typeof(param.unfold) == "undefined") param.unfold = "none";
	
	var text = this.dom.find(".sheet_text");
	if(param.readonly) text.attr("readonly","readonly");
	
	var ie8 = (navigator.appName=="Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g,"")=="MSIE8.0");
	
	var clzTodo = function(selector,clz,recdom){
		var obj = {
			selector:selector,
			clz:clz,
			flag:recdom.prop("checked"),
			redo:function(){
				obj.selector.toggleClass(obj.clz,obj.flag);
			},
			undo:function(){
				obj.selector.toggleClass(obj.clz,!obj.flag);
			}
		};
		obj.redo();
		todo(obj);
		return obj;
	};
	
	var _reginput = function(selector,func){
		return selector.change(func).on('input propertychange',function(){
			if(typeof(window.event) != "undefined" && typeof(window.event.propertyName) != "undefined" && window.event.propertyName != "value")
				return;
			$(this).change();
		});
	};
	
	var fontsize = _reginput(this.dom.find(".sheet_font_size"),function(){
		if(!isNaN(fontsize.val()))
			$.each(that.selection.dom,function(idx,_dom){
				_dom.css("font-size",fontsize.val()+"px");
			});
	});
	
	var cellWidth = _reginput(this.dom.find(".sizebox input").first(),function(){
		if($(this).attr("c") != null){$(this).attr("c",null);return;}
		$.each(that.selection.dom,function(idx,_dom){
			that.col(_dom).trigger("dblclick",cellWidth.val());
		});
	});
	
	var cellHeight = _reginput(this.dom.find(".sizebox input").last(),function(){
		if($(this).attr("c") != null){$(this).attr("c",null);return;}
		$.each(that.selection.dom,function(idx,_dom){
			that.row(_dom).trigger("dblclick",cellHeight.val());
		});
	});
	
	var font = this.dom.find(".sheet_font").change(function(){
		var _that = $(this);
		$.each(that.selection.dom,function(idx,_dom){
			_dom.css("font-family",_that.val());
		});
	});
	
	var bOption = this.dom.find(".sheet_bold").change(function(){
		clzTodo($(".sheet_select"),"sheet_content_bold",$(this));
	});
	var iOption = this.dom.find(".sheet_italic").change(function(){
		clzTodo($(".sheet_select"),"sheet_content_italic",$(this));
	});
	var uOption = this.dom.find(".sheet_underline").change(function(){
		clzTodo($(".sheet_select"),"sheet_content_underline",$(this));
	});

	
	var blOption = this.dom.find(".sheet_border_left").click(function(){
		if(param.readonly) return;
		var checked = $(this).prop("checked");
		$(".sheet_select").each(function(){
			_border($(this),"sheet_content_border_left",checked);
		});
	});
	var brOption = this.dom.find(".sheet_border_right").click(function(){
		if(param.readonly) return;
		var checked = $(this).prop("checked");
		$(".sheet_select").each(function(){
			_border($(this),"sheet_content_border_right",checked);
		});
	});
	var btOption = this.dom.find(".sheet_border_top").click(function(){
		if(param.readonly) return;
		var checked = $(this).prop("checked");
		$(".sheet_select").each(function(){
			_border($(this),"sheet_content_border_top",checked);
		});
	});
	var bbOption = this.dom.find(".sheet_border_bottom").click(function(){
		if(param.readonly) return;
		var checked = $(this).prop("checked");
		$(".sheet_select").each(function(){
			_border($(this),"sheet_content_border_bottom",checked);
		});
	});
	
	var fx = this.dom.find(".sheet_fx").click(function(){
		if(param.readonly) return;
		if(that.selection.dom.length == 1){
			var flag = $(this).hasClass("select");
			var dom = that.selection.dom[0];
			dom.attr("type",flag ? "blank" : "formula");
			dom.attr("formula",flag ? null : dom.text());
		}
		$(this).toggleClass("select");
	});
	if(!param.funcable) fx.hide();
	
	var alignLeft = this.dom.find(".sheet_align_left").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_align_right").removeClass("sheet_content_align_center").addClass("sheet_content_align_left");
	});
	var alignCenter = this.dom.find(".sheet_align_center").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_align_right").removeClass("sheet_content_align_left").addClass("sheet_content_align_center");
	});
	var alignRight = this.dom.find(".sheet_align_right").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_align_left").removeClass("sheet_content_align_center").addClass("sheet_content_align_right");
	});
	
	var valignTop = this.dom.find(".sheet_valign_top").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_valign_bottom").removeClass("sheet_content_valign_center").addClass("sheet_content_valign_top");
	});
	var valignCenter = this.dom.find(".sheet_valign_center").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_valign_top").removeClass("sheet_content_valign_bottom").addClass("sheet_content_valign_center");
	});
	var valignBottom = this.dom.find(".sheet_valign_bottom").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_valign_top").removeClass("sheet_content_valign_center").addClass("sheet_content_valign_bottom");
	});
	
	var color = this.dom.find(".sheet_color_selector");
	
	var removeDom = this.dom.find(".sheet_remove_dom").click(function(){
		if(param.readonly) return;
		$.each(that.selection.dom,function(idx,dom){
			dom.text("");
		});
	});
	var mergeButton = this.dom.find(".sheet_merge");
	var mask = this.dom.find(".sheet_drag_mask");
	
	var _start,_end;
	var _offx = 0,_offy = 0,_drag = null;
	var ctrl = false;
	var shift = false;
	
	var _selected = function(dom,clean){
		_end = dom;
		that.selection.set(_start,_end);
		if(clean)
			_start = _end = null;
	}
	
	this.table = this.content.find(".sheet_table").mouseover(function(e){
		if(_start != null && $(".editbox").length == 0){
			var target = $(e.target);
			_selected( target.is("pre") ? target.parent() : target,false);
		}
		return true;
	});
	
	var headTable = this.content.find(".sheet_head");
	var leftTable = this.content.find(".sheet_left");
	
	this.selectAll = function(){
		that.selection.set(that.table.find("td[col='1'][row='1']"),that.table.find("tr").last().find("td").last(),false);
		return false;
	};
	
	//删除样式
	var clearStyle = this.dom.find(".sheet_clear_style").click(function(){
		if(param.readonly) return;
		$(".sheet_select").removeClass("sheet_content_italic").removeClass("sheet_content_bold").removeClass("sheet_content_underline")
			.removeClass("sheet_content_align_left").removeClass("sheet_content_align_center").removeClass("sheet_content_align_right")
			.removeClass("sheet_content_valign_top").removeClass("sheet_content_valign_center").removeClass("sheet_content_valign_bottom")
			.removeClass("sheet_content_border_left").removeClass("sheet_content_border_right").removeClass("sheet_content_border_top").removeClass("sheet_content_border_bottom")
			.attr("style",null);
		that.dom.find(".toolbar input[type='checkbox']").prop("checked",false);
	});
	
	this.remove = function(){removeDom.click();};
	this.clearStyle = function(){clearStyle.click();};
	
	color.spectrum({
		preferredFormat:"rgb",
		showPaletteOnly: true,
	    showPalette:true,
	    palette: [
			['f2f2f2','7f7f7f','ddd9c3','c6d9f0','dbe5f1','f2dcdb','ebf1dd','e5e0ec','dbeef3','fdeada'],
			['d8d8d8','595959','c4bd97','8db3e2','b8cce4','e5b9b7','d7e3bc','ccc1d9','b7dde8','fbd5b5'],
			['bfbfbf','3f3f3f','938953','548dd4','95b3d7','d99694','c3d69b','b2a2c7','92cddc','fac08f'],
			['ffffff','000000','eeece1','1f497d','4f81bd','c0504d','9bbb59','8064a2','4bacc6','f79646'],
			['a5a5a5','262626','494429','17365d','366092','953734','76923c','5f497a','31859b','e36c09'],
			['7f7f7f','0c0c0c','1d1b10','0f243e','244061','632423','4f6128','3f3151','205867','974806'],
			['c00000','ff0000','ffc000','ffff00','92d050','00b050','00b0f0','0070c0','002060','7030a0']
		],
		disabled:param.readonly,
	}).change(function(){
		var css = $(this).attr("for") == "bg" ? 'background-color' : 'color';
		var color = $(this).val();
		$(this).css(css,color);
		$.each(that.selection.dom,function(idx,dom){
			dom.css(css,color);
		});
		$(this).next().find(".sheet_color_view").css("background-color",$(this).val());
	});
	
	//撤销、重做
	
	var doarr = [];
	var dopoint = 0;
	
	var undoButton = this.dom.find(".sheet_undo").click(function(){
		if(param.readonly) return;
		that.undo();
	});
	
	var redoButton = this.dom.find(".sheet_redo").click(function(){
		if(param.readonly) return;
		that.redo();
	});
	
	this.undo = function(){
		if(dopoint > 0){
			doarr[--dopoint].undo();
		}
		dotest();
		return false;
	};
	
	this.redo = function(){
		if(dopoint < doarr.length){
			doarr[dopoint++].redo();
		}
		dotest();
		return false;
	};
	
	var todo = function(arr){
		if(doarr.length != dopoint)
			doarr.splice(dopoint);
		doarr.push(arr);
		dopoint = doarr.length;
		dotest();
		return arr;
	};
	
	//好丑！
	var dotest = function(){
		if(dopoint < doarr.length){
			redoButton[0].src = redoButton[0].src.replace("redo_disable","redo");
		}else{
			if(redoButton[0].src.indexOf("_disable") < 0)
				redoButton[0].src = redoButton[0].src.replace("redo","redo_disable");
		}
		
		if(dopoint > 0){
			undoButton[0].src = undoButton[0].src.replace("undo_disable","undo");
		}else{
			if(undoButton[0].src.indexOf("_disable") < 0)
				undoButton[0].src = undoButton[0].src.replace("undo","undo_disable");
		}
	};
	
	//选区
	this.selection = {};
	this.selection.dom = new Array(); 
	this.selection.clear = function(dirty){
		if(typeof(dirty) != "undefined" && dirty && param.funcable && param.autofunc){
			that.table.find("td[formula]").each(function(){
				_calc($(this));
			});
		}
		$.each(that.selection.dom,function(idx,dom){
			dom.todo = undefined;
		});
		that.selection.dom = new Array();
		$(".sheet_select").removeClass("sheet_select");
		$(".sheet_head_select").removeClass("sheet_head_select");
		text.unbind("input propertychange").val("");
		text.attr("modify",null).attr("unmodify",null);
		return that.selection;
	};
	
	this.selection.region = function(startDom,endDom){
		var table = that.table;
		var region = {};
		region.dom = [];
		
		if(startDom.attr("head")!=null && endDom.attr("head")!=null && (startDom.attr("col") == endDom.attr("col") || startDom.attr("row") == endDom.attr("row"))){
			if(startDom.attr("col") == "0"){
				startDom = table.find("td[row='"+startDom.attr("row")+"']").first();
				endDom = table.find("td[row='"+endDom.attr("row")+"']").last();
			}else{
				startDom = table.find("tbody td[col='"+startDom.attr("col")+"']").first();
				endDom = table.find("tbody td[col='"+endDom.attr("col")+"']").last();
			}
		}
		var x1 = parseInt(startDom.attr("col")),x2 = parseInt(endDom.attr("col")),y1 = parseInt(startDom.attr("row")),y2 = parseInt(endDom.attr("row"));
		if(x1 > x2)	{x1^=x2;x2^=x1;x1^=x2;}
		if(y1 > y2)	{y1^=y2;y2^=y1;y1^=y2;}
		for(var x=x1;x<=x2;x++){
			for(var y=y1;y<=y2;y++){
				var __dom = table.find("td[col='"+x+"'][row='"+y+"']");
				if(__dom.attr("head") == null && __dom.attr("meta") == null)
					region.dom.push(__dom);
			}
		}
		
		region.x1 = x1;
		region.x2 = x2;
		region.y1 = y1;
		region.y2 = y2;
		return region;
	};
	
	this.selection.set = function(startDom,endDom,dirty){
		var selection = that.selection;
		
		if(typeof(dirty) == "undefined")
			dirty = true;
		
		if(!ctrl && !shift)
			selection.clear(dirty);
		
		
		if(shift && selection.dom.length != 0){
			endDom = selection.dom[0];
			shift = false;
		}
		
		var region = selection.region(startDom,endDom);
		selection.dom = region.dom;
		var simple = region.dom.length == 1;
		
		posText.val(DSheet.colName(region.x1-1)+DSheet.rowName(region.y1-1) + (simple ? "" : (":" + DSheet.colName(region.x2-1)+DSheet.rowName(region.y2-1))));
		
		var flag = function(){
			var result = false;
			$.each(selection.dom,function(idx,dom){
				if(dom.text().length!=0)
					result = true;
			});
			return result;
		}();
		var b=flag,i=flag,u=flag;
		
		$.each(selection.dom,function(idx,dom){
			if(!dom.hasClass("sheet_content_bold") && dom.text().length != 0)
				b=false;
			if(!dom.hasClass("sheet_content_italic") && dom.text().length != 0)
				i=false;
			if(!dom.hasClass("sheet_content_underline") && dom.text().length != 0)
				u=false;
			
			that.col(dom).addClass("sheet_head_select");
			that.row(dom).addClass("sheet_head_select");
		});
		
		bOption.prop("checked",b).parent().prev().toggleClass("select",b);
		iOption.prop("checked",i).parent().prev().toggleClass("select",i);
		uOption.prop("checked",u).parent().prev().toggleClass("select",u);
		
		color.each(function(){
			var bg = $(this).attr("for") == "bg";
			var css = bg ? 'background-color' : 'color';
			var c = "";
			$.each(selection.dom,function(idx,dom){
				if(idx == 0){
					c = dom.hexColor(css);
				}else{
					if(c != dom.hexColor(css))
						c = bg ? "#ffffff" : "#000000";
				}
			});
			$(this).spectrum("set",c);
			$(this).next().find(".sheet_color_view").css("background-color",c);
		});
		
		//选择单个dom时的特殊操作
		if(simple){
			var dom = that.selection.dom[0];
			//格式
			var formula = (dom.attr("type") == "formula");
			fx.toggleClass("select",formula);
			if(formula){
				dom.find("pre").text(dom.attr("formula"));
			}
			
			text.focus().attr("c",null).unbind("input propertychange").val(dom.text()).attr("unmodify",dom.text()).on('input propertychange',function(){
				if(typeof(window.event) != "undefined" && typeof(window.event.propertyName) != "undefined" && window.event.propertyName != "value")
					return;
				if($(this).attr("b") != null)
					return;
				if($(this).attr("c") != null){
					$(this).attr("c",null);
				}else{
					if($(this).attr("modify") == null){
						$(this).attr("modify",$(this).attr("unmodify"));
						var __text = $(this).val();
						var modify = $(this).attr("modify");
						
						var arr = ({
							modify:modify,
							text:__text,
							undo:function(){
								dom.find("pre").text(arr.modify).find("input").val(arr.modify);
								if(dom.attr("type") == "formula" && param.funcable)
									dom.attr("formula",dom.text());
								text.attr("b","b").val(arr.modify).attr("b",null);
							},
							redo:function(dirty){ 
									dom.find("pre").text(arr.text).find("input").val(arr.text);
								if(dom.attr("type") == "formula" && param.funcable)
									dom.attr("formula",dom.text());
								if(typeof(dirty) == "undefined" || !dirty)
									text.attr("b","b").val(arr.text).attr("b",null);
							}
						});
						
						dom.todo = todo(arr);
						arr.redo(true);
					}else{
						if(typeof(dom.todo) != "undefined"){
							dom.todo.text = $(this).val(); 
							dom.todo.redo(true);
						}
					}
				}
			});
			
			fontsize.val(dom.css("font-size").split("px")[0]);
			font.val(dom.css("font-family"));
			cellWidth.attr("c","c").val(that.col(dom).width());
			cellHeight.attr("c","c").val(that.row(dom).height());
		}
		
		$.each(that.selection.dom,function(idx,dom){
			dom.addClass("sheet_select");
		});
		
		
	}
	
	//注册有关事件
	var reg = function(cell){
		if(cell.attr("col") == "0" && cell.attr("row") == "0"){
			cell.attr("meta","meta").click(function(){
				that.selectAll();
			}).text("全选");//.width(85).height(23);
			return;
		}
		cell.mousedown(function(e){
			var target = $(e.target);
			if(e.which == 1 && !target.is("div"))
				_start = target.find("input").length == 0 ? target.is("pre") ? target.parent() : target : null;
		}).mouseup(function(e){
			var target = $(e.target);
			if(_start != null && $(".editbox").length == 0)
				_selected( target.is("pre") ? target.parent() : target,true);
		});
		if(cell.attr("head") == null){
			$("<pre></pre>").appendTo(cell);
			cell.add(cell.find("pre")).unbind("dblclick").dblclick(function(){
				if(param.readonly || cell.find("input").length != 0 || (cell.attr("type") == "formula" && param.funcable))
					return;
				var _text = cell.text();
				cell.find("pre").html("").hide();
				var blur = ie8;
				$("<input type='text' class='editbox'/>").appendTo(cell).unbind().focus().val(_text).blur().focus()//这里持续的blur和focus是为了解决傻逼IE8不响应propertychange的bug
				.css("color",cell.hexColor('color')).css("font-size",cell.css("font-size")).css("font-family",cell.css("font-family"))
				.on('input propertychange',function(){
					if(typeof(window.event) != "undefined" && typeof(window.event.propertyName) != "undefined" && window.event.propertyName != "value")
						return;
					text.val($(this).val()).attr("c",null);
					if($(this).attr("c") != null){
						$(this).attr("c",null);return;
					}
					var _text = $(this).val();
					var modify = text.attr("unmodify");
					if(text.attr("modify") == null){
						var arr = {
							modify:modify,
							text:_text,
							undo:function(){
								cell.find("pre").text(arr.modify).parent().find("input").attr("c","c").val(arr.modify);
								if(cell.attr("type") == "formula" && param.funcable)
									cell.attr("formula",arr.modify);
								text.attr("c","c").val(arr.modify);
							},
							redo:function(dirty){
								if(typeof(dirty) == "undefined" || !dirty)
									cell.find("pre").text(arr.text).parent().find("input").attr("c","c").val(arr.text);
								if(cell.attr("type") == "formula" && param.funcable)
									cell.attr("formula",arr.text);
								text.attr("c","c").val(arr.text);
							}
						};
						cell.todo = todo(arr);
						arr.redo(true);
					}else{
						if(typeof(cell.todo) != "undefined"){
							cell.todo.text = text.val();
							cell.todo.redo(true);
						}
					}
				})
				.blur(function(){
					if(blur){blur = false;return;}//使用一个flag来在初始化input时，防止因为修复IE8的blur而导致删除自身
					
					cell.find("pre").text($(this).val()).show();
					$(this).remove();
				});
			});
		}else{
			var isCol = cell.attr("col") == 0;
			cell.dblclick(function(e,val){
				var result = val;
				if(typeof(val) == "undefined")
					result = prompt("请输入"+(isCol?"列高":"行宽"),isCol?cell.height():cell.width());
				if(result){
					if(!isCol) cell.width(0); else cell.height(0);
					cell.find("div").trigger("mousedown",{pageY:cell.height(),pageX:cell.width()});
					mask.trigger("mousemove",{pageY:parseInt(result),pageX:parseInt(result)});
					mask.mouseup();
				}
			});
			
			if(isCol){
				$("<div></div>").appendTo(cell).addClass("sheet_left_split").mousedown(function(e,cobj){
					_offy = (typeof(cobj) == "undefined") ? e.pageY : cobj.pageY;
					_drag = cell;
					mask.show();
					var mtodo = {
						osize:cell.height(),
						size:cell.height(),
						drag:_drag,
						undo:function(){
							that.table.find("td[row='"+mtodo.drag.attr("row")+"']").first().height(mtodo.osize);
							mtodo.drag.height(mtodo.osize);
							mtodo.drag.find("div").css("bottom","initial").css("top",(mtodo.drag.height()-mtodo.drag.find("div").height())/(ie8?2:1)+(ie8?10:0));//what the fuck
						},
						redo:function(){
							that.table.find("td[row='"+mtodo.drag.attr("row")+"']").first().height(mtodo.size);
							mtodo.drag.height(mtodo.size);
							mtodo.drag.find("div").css("bottom","initial").css("top",(mtodo.drag.height()-mtodo.drag.find("div").height())/(ie8?2:1)+(ie8?10:4));//what the fuck
						}
					};
					mask.todo = todo(mtodo);
					return false;
				});
			}else{
				$("<div></div>").appendTo(cell).addClass("sheet_head_split").mousedown(function(e,cobj){
					_offx = (typeof(cobj) == "undefined") ? e.pageX : cobj.pageX;
					_drag = cell;
					mask.show();
					var mtodo = {
						osize:cell.width(),
						size:cell.width(),
						drag:_drag,
						undo:function(){
							mtodo.drag.width(mtodo.osize);
							that.table.find(".fixHead td").eq(parseInt(mtodo.drag.attr("col"))).width(mtodo.osize);
						},
						redo:function(){
							mtodo.drag.width(mtodo.size);
							that.table.find(".fixHead td").eq(parseInt(mtodo.drag.attr("col"))).width(mtodo.size);
						}
					};
					mask.todo = todo(mtodo);
					return false;
				});
			}
		}
	}
	
	var _border = function(dom,sty,toggle){
		if(sty == "sheet_content_border_left"){
			var dom1 = dom.prev();
			if(dom1.length != 0 && !dom1.hasClass("sheet_content_border_right"))
				dom.toggleClass(sty,toggle);
		}
		if(sty == "sheet_content_border_right"){
			var dom1 = dom.next();
			if(dom1.length != 0 && !dom1.hasClass("sheet_content_border_left"))
				dom.toggleClass(sty,toggle);
		}
		if(sty == "sheet_content_border_top"){
			var dom1 = dom.parent().prev().find("td").eq(dom.prevAll().length);
			if(dom1.length != 0 && !dom1.hasClass("sheet_content_border_bottom"))
				dom.toggleClass(sty,toggle);
		}
		if(sty == "sheet_content_border_bottom"){
			var dom1 = dom.parent().next().find("td").eq(dom.prevAll().length);
			if(dom1.length != 0 && !dom1.hasClass("sheet_content_border_top"))
				dom.toggleClass(sty,toggle);
		}
	};
	
	this.col = function(param){
		if(typeof(param) == "number"){
			return that.table.find("td[col='"+param+"']").not("td[head]");
		}else if(typeof(param) == "string"){
			return that.table.find("td[col='"+DSheet.colName(param)+"']").not("td[head]");
		}else if(typeof(param) == "undefined"){
			that.table.find("tr").each(function(idx,el){
				var row = $("<td></td>").appendTo($(this));
				var ln = $(this).find("td").length;
				row.attr("col",ln - 1).attr("row",idx);//.width(85); 
				if(idx == 0){
					reg(row.clone(true).text(DSheet.colName(ln - 2)).attr("head","row").attr("row","0").appendTo(headTable.find("tr")));
				}
				reg(row);
			});
			return that;
		}else{
			return headTable.find("td[col='"+$(param).attr("col")+"']");
		}
	}
	
	this.row = function(param){
		if(typeof(param) == "number"){
			return that.table.find("td[row='"+param+"']").not("td[head]");
		}else if(typeof(param) == "string"){
			return that.table.find("td[row='"+DSheet.rowName(param)+"']").not("td[head]");
		}else if(typeof(param) == "undefined"){
			var cols = that.table.find("tr");
			var ln = cols.length - 1; 
			var col = $("<tr></tr>").appendTo(that.table.find("tbody")).height(20);
			cols.first().find("td").each(function(idx,el){
				var row = $("<td></td>").appendTo(col).attr("col",idx - 1).attr("row",ln + 2);
				if(idx == 0)
					reg(row.text(DSheet.rowName(ln + 1)).attr("head","row").attr("col","0").appendTo($("<tr></tr>").appendTo(leftTable).height(20)));
				reg(row);
			});
		}else{
			return leftTable.find("td[row='"+$(param).attr("row")+"']");
		}
	}
	
	//生成表格函数
	this.generate = function(rowCount,colCount){
		//清空内容（如果有）
		that.table.find("tbody").children().remove();
		
		for(var i=0;i<colCount;i++){
			var col = $("<tr></tr>").appendTo(i!=0 ? that.table.find("tbody") : headTable);
			for(var j=0;j<rowCount;j++){
				var row = $("<td></td>").appendTo(col).attr("col",j).attr("row",i);
				if(i == 0 && j != 0)
					row = row.text(DSheet.colName(j - 1)).attr("head","col");
				if(i != 0 && j == 0)
					row = row.text(DSheet.rowName(i - 1)).attr("head","row").height(20).clone(true).appendTo($("<tr></tr>").appendTo(leftTable));
				reg(row);
			}
		}
		
		that.table.find("tr").first().clone(false).prependTo(that.table.find("tbody")).addClass("fixHead").children().attr("col",null).attr("row",null);
		
		return that;
	};
	
	this.generate(param.row, param.col);
	
	this.read = function(_json){
		var json = _json;
		if(typeof(json) == "string")
			json = eval("("+json+")");
		var maxRow = that.table.find("tr").length;
		var ln = json.rows.length;
		if(maxRow < ln)
			for(var i=0;i<ln-maxRow + 3;i++)
				that.row();
		
		for(var i in json.rows){
			var rowInfo = json.rows[i];
			var rows = rowInfo.row;
			var rowNum = parseInt(i) + 1;
			that.content.find("td[col='0'][row='"+rowNum+"']").height(rowInfo.height < 20 ? 20 : rowInfo.height);
			for(var j in rows){
				var row = rows[j];
				var style = row.style;
				var colNum = parseInt(j) + 1;
				
				var dom = that.table.find("td[col='"+colNum+"'][row='"+rowNum+"']");
				dom.find("pre").text(row.value);
				if(style.bold) dom.addClass("sheet_content_bold");
				if(style.italic) dom.addClass("sheet_content_italic");
				if(style.underline) dom.addClass("sheet_content_underline");
				if(style.bg != "000000") dom.css("background-color","#"+style.bg);
				if(style.fg != "000000") dom.css("color","#"+style.fg);
				dom.css("font-family",style.fontName.replace(new RegExp("'",'gm'),""));
				dom.css("font-size",style.fontSize+"px");
				dom.addClass("sheet_content_align_"+style.align);
				dom.addClass("sheet_content_valign_"+style.valign);
				dom.attr("type",style.type);
				if(style.type == "formula" && param.funcable)
					dom.attr("formula",dom.text());
				if(style.borderLeft != 0) _border(dom,"sheet_content_border_left");
				if(style.borderRight != 0) _border(dom,"sheet_content_border_right");
				if(style.borderTop != 0) _border(dom,"sheet_content_border_top");
				if(style.borderBottom != 0) _border(dom,"sheet_content_border_bottom");
			}
		}
		
		for(var i in json.cellWidth){
			var width = json.cellWidth[i];
			var colNum = parseInt(i) + 1;
			
			that.table.find(".fixHead td").eq(colNum).width(width);
			headTable.find("td[col='"+colNum+"']").width(width);
		}
		
		for(var i in json.merge){
			var merge = json.merge[i];
			that.selection.clear();
			var startDom = that.table.find("td[row='"+(merge.startRow+1)+"'][col='"+(merge.startCol+1)+"']");
			var endDom = that.table.find("td[row='"+(merge.endRow+1)+"'][col='"+(merge.endCol+1)+"']");
			that.selection.set(startDom,endDom,false);
			mergeButton.trigger("click",true);
		}
		
		var first = that.table.find("td[row='1'][col='1']");
		that.table.find("td[formula]").each(function(){
			that.selection.set($(this),$(this));
			that.selection.set(first,first);
		});
	};
	
	//合并单元格
	mergeButton.click(function(e,dirty){
		if(param.readonly && !dirty) return;
		var arr = that.selection.dom;
		if(arr.length == 0)
			return;
		
		var start = arr[0];
		var end = arr[arr.length-1];
		var w = parseInt(end.attr("col")) - parseInt(start.attr("col")) + 1;
		var h = parseInt(end.attr("row")) - parseInt(start.attr("row")) + 1;
		
		start.attr("colspan",w).attr("rowspan",h);
		var merged = start.attr("col")+","+start.attr("row");
		if(arr.length != 1){
			$.each(arr,function(idx,___dom){
				//fix head bug
				if(idx != 0){
					___dom.hide().attr("merge",merged);
				}
			});
		}else{
			$("td[merge='"+merged+"']").show().attr("merge",null);
		}
		that.selection.clear();
	});
	
	this.calc = function(){
		that.table.find("td[formula]").each(function(){_calc($(this));});
		return that;
	};
	this.autofunc = function(bo){
		param.autofunc = bo;
		if(bo) that.calc();
		return that;
	};
	this.scrollLock = function(bo){
		param.scrollLock = bo;
		return that;
	};
	this.readonly = function(bo){
		param.readonly = bo;
		return that;
	};
	
	//函数计算
	var _calc = function(dom){
		var func = dom.attr("formula");
		var SUM = function(domSelection){
			var start,end;
			if(domSelection.indexOf(":") > 0){
				var split = domSelection.split(":");
				start = that.getCell(split[0]);
				end = that.getCell(split[1]);
			}else{
				start = end = that.getCell(domSelection);
			}
			var region = that.selection.region(start,end);
			var dec = new Decimal(0);
			$.each(region.dom,function(idx,_dom){
				if(_dom.text() != "" && !isNaN(_dom.text()))
					dec = dec.plus(parseFloat(_dom.text()));
			});
			return dec.toString();//TODO wtf
		};
		
		func = func.replace("(","('").replace(")","')");
		
		var evald = "";
		try {
			evald = eval("("+func+")");
		} catch (e) {
			console.log(e);
		}
		dom.find("pre").text(evald);
	};
	
	//导出为json格式
	this.toJSON = function(){
		var rowNum = 0,colNum = 0;
		//获取最大行
		that.table.find("tr").each(function(tridx){
			//获取最大列
			var include = false;
			$(this).find("td").each(function(tdidx){
				if($(this).text().length != 0){
					include = true;
					if(colNum < tdidx)
						colNum = tdidx;
				}
			});
			
			if(include)
				rowNum = tridx;
		});
		
		rowNum++;
		colNum++;
		
		var json = {};
		json.cellWidth = [];
		//写入表格宽度
		headTable.find("td[head]").slice(0,colNum).each(function(){
			json.cellWidth.push($(this).innerWidth() - 4);
		});
		//写入行列数据
		json.rows = [];
		that.table.find("tr").slice(1,rowNum).each(function(){
			var rowInfo = {};
			
			rowInfo.height = $(this).innerHeight() - 4;
			rowInfo.row = [];
			
			$(this).find("td").slice(1,colNum).each(function(){
				var row = {};
				row.value = $(this).attr("type") == "formula" ? $(this).attr("formula") : $(this).text();
				row.style = {};
				
				row.style.bg = $(this).hexColor("background-color").split("#")[1];
				row.style.fg = $(this).hexColor("color").split("#")[1];
				
				var align = "left";
				if($(this).hasClass("sheet_content_align_center")) align = "center";
				if($(this).hasClass("sheet_content_align_right")) align = "right";
				row.style.align = align;
				
				var valign = "top";
				if($(this).hasClass("sheet_content_valign_center")) valign = "center";
				if($(this).hasClass("sheet_content_valign_bottom")) valign = "bottom";
				row.style.valign = valign;
				
				row.style.bold = $(this).hasClass("sheet_content_bold");
				row.style.italic = $(this).hasClass("sheet_content_italic");
				row.style.underline = $(this).hasClass("sheet_content_underline");
				row.style.fontName = $(this).css("font-family");
				row.style.fontSize = parseInt($(this).css("font-size").split("px")[0]);
				row.style.borderLeft = $(this).hasClass("sheet_content_border_left") ? 1 : 0;
				row.style.borderRight = $(this).hasClass("sheet_content_border_right") ? 1 : 0;
				row.style.borderTop = $(this).hasClass("sheet_content_border_top") ? 1 : 0;
				row.style.borderBottom = $(this).hasClass("sheet_content_border_bottom") ? 1 : 0;
				row.style.type = $(this).attr("type");
				
				rowInfo.row.push(row);
			});
			
			json.rows.push(rowInfo);
		});
		
		//写入合并信息
		json.merge = [];
		that.table.find("td[colspan]").each(function(){
			var rowspan = parseInt($(this).attr("rowspan"));
			var colspan = parseInt($(this).attr("colspan"));
			if(rowspan != 1 || colspan != 1){
				var merge = {};
				merge.startRow = parseInt($(this).attr("row")) - 1;
				merge.startCol = parseInt($(this).attr("col")) - 1;
				merge.endRow = merge.startRow + rowspan - 1;
				merge.endCol = merge.startCol + colspan - 1;
				json.merge.push(merge);
			}
		});
		
		return JSON.stringify(json);
	};
	
	this.getCell = function(str){
		var row = str.match(/\d+/g);
		var col = str.split(row)[0];
		return that.table.find("td[row='"+DSheet.rowName(row)+"'][col='"+DSheet.colName(col)+"']");
	};
	
	mask.mousemove(function(e,cobj){
		var pageY = (typeof(cobj) == "undefined") ? e.pageY : cobj.pageY;
		var pageX = (typeof(cobj) == "undefined") ? e.pageX : cobj.pageX;
		if(!_drag)
			return;
		if(_drag.attr("row") == "0"){
			var width = _drag.width() + pageX - _offx;
			width = width <= 0 ? 1 : width;
			mask.todo.size = width;
			mask.todo.redo();
			_offx = pageX;
		}else{
			var height = _drag.height() + pageY - _offy;
			height = height <=0 ? 1 : height;
			mask.todo.size = height;
			mask.todo.redo();
			_offy = pageY;
		}
		return false;
	}).mouseup(function(){
		$(this).hide();
		mask.todo = undefined;
		_drag = null;
	}).mousedown(function(){
		popup.hide();
		mask.hide();
		return true;
	});
	
	//注册scroll
	this.content.scroll(function(e){
		leftTable.css("left",$(this).scrollLeft());
		headTable.css("top",$(this).scrollTop());
		if(param.readonly || param.scrollLock) return;
		var bottom = $(this).scrollTop() - that.table.height() + $(this).height();
		var right = that.table.width() - $(this).scrollLeft() - $(document).width();
		//扩展行或列
		if(bottom > 0)
			that.row();
		if(right < 100)
			that.col();
	});
	
	if(typeof(param.height) == "undefined") param.height = "auto";
	if(typeof(param.width) == "undefined") param.width = "auto";
	
	if(typeof(param.height) == "function")
		setInterval(function(){
			that.content.height(param.height());
		},200);
	else if(param.height != "auto")
		setInterval(function(){
			that.content.height(param.height);
		},200);
	else
		setInterval(function(){
			that.content.height(that.dom.outerHeight()-that.dom.find(".toolbar").outerHeight());
		},100);
	
	//key
	$(document).keydown(function(e){
		ctrl = e.ctrlKey;
		shift = e.shiftKey;
		if($(".editbox").length != 0)
			return true;
		if(e.ctrlKey && e.keyCode == 65) //ctrl+A
			return that.selectAll();
		if(e.ctrlKey && e.keyCode == 90) //ctrl+Z
			return that.undo();
		if(e.ctrlKey && e.keyCode == 89) //ctrl+Y
			return that.redo();
		if(e.ctrlKey && e.keyCode == 66) //ctrl+B
			bOption.parent().prev().click();
		if(e.ctrlKey && e.keyCode == 73) //ctrl+I
			iOption.parent().prev().click();
		return true;
	}).keyup(function(e){
		ctrl = e.ctrlKey;
		shift = e.shiftKey;
		return true;
	});
	
	$(window).blur(function(){
		ctrl = shift = false;
	});
	
	that.dom.find(".toolbar input[type='checkbox']").each(function(){
		var bg = $(this).attr("bg");
		var that = $(this);
		var img = $("<img src='"+bg+"'>").insertBefore($(this).parent());
		img.click(function(){
			if(param.readonly) return;
			that.prop("checked",$(this).toggleClass("select").hasClass("select")).change();
		});
		$(this).change(function(){
			img.toggleClass("select",that.prop("checked"));
		});
		img.attr("title",$(this).parent().text());
		$(this).parent().hide();
	});
	
	that.dom.find(".sheet_text_color").appendTo(that.dom.find(".sheet_color_selector[for='fg']").next());
	that.dom.find(".sheet_bg_color").appendTo(that.dom.find(".sheet_color_selector[for='bg']").next());
	
	var toolbar = this.dom.find(".toolbar");
	toolbar.toggle(!param.hideToolbar);
	if(param.hideToolbar)
		toolbar.parents("tr").height(0);
	
	toolbar.find("span[toggle]").each(function(){
		var that = $(this);
		var toggle = toolbar.find("."+that.attr("toggle"));
		toggle.parent().add($(that)).hover(function(){
			if($(this).attr("c") == null)
				that.show().css("left",toggle.offset().left).css("top",toggle.offset().top+toggle.height());
			else 
				$(this).attr("c",null);
			$(this).find("input").attr("c",null);
		},function(){
			that.hide();
		});
		that.hide();
	});
	
	if(typeof(param.content) != "undefined")
		this.read(param.content);
	
	var numC = function(dom,count){
		if(isNaN(dom.val()) || dom.val().length == 0)
			dom.val(0);
		var result = parseInt(dom.val())+count;
		dom.val(result < 0 ? 0 : result);
	};
	
	fontsize.add(cellWidth).add(cellHeight).each(function(){
		var that = $(this);
		$("<div class='numsp'><div class='numup'></div><div class='numdown'></div></div>").insertAfter($(this)).children().each(function(idx,dom){
			$(dom).click(function(){
				numC(that,idx == 0 ? 1 : -1);
				that.change();
			});
		});
	});
	
	var sheetSize = this.dom.find(".sheet_size").parent().toggle(param.sizeEditor).end();
	
	this.selection.clear(false);
	
	var popup = this.dom.find(".sheet_popup").hide();
	this.content.contextmenu(function(e){
		if(!ctrl){
			popup.show().css("top",e.clientY).css("left",e.clientX);
			mask.show(); 
			return false;
		}
		return true;
	});
	
	popup.children().click(function(e){
		if($(this).hasClass("sheet_popup_selectall"))
			that.selectAll();
		if($(this).hasClass("sheet_popup_delete"))
			that.remove();
		if($(this).hasClass("sheet_popup_clear"))
			that.clearStyle();
		if($(this).hasClass("sheet_popup_size"))
			that.dom.find("span[toggle='sheet_size']").show().attr("c","c").css({top:e.clientY-80,left:e.clientX-50});
		if($(this).hasClass("sheet_popup_merge"))
			that.merge();
		popup.add(mask).hide();
	});
	
	this.merge = function(){mergeButton.click();};
	
	if(param.unfold != "none"){
		var unfold = param.unfold.split(" ");
		if(param.unfold == "all") unfold = ["size","align","border"];
		$.each(unfold,function(idx,obj){
			var togcls = "sheet_"+obj;
			that.dom.find("img."+togcls).parent().remove();
			that.dom.find("span[toggle='"+togcls+"']").children().unwrap().css("color","white");
		});
	}
	
	return this;
}

//static
var DSheet = {
	// 仅仅支持A-ZZ
	_A_code:"A".charCodeAt(),
	colName:function(index){
		if(typeof(index) == "number"){
			if(index < 0)
				return DSheet.colName(0);
			if(index < 26)
				return String.fromCharCode(DSheet._A_code + index);
			else
				return String.fromCharCode(DSheet._A_code + Math.floor(index / 26) - 1) + String.fromCharCode(DSheet._A_code + index % 26 );
		}else{
			var result = 0;
			var arr = index.split("");
			for(var i=0;i<arr.length;i++)
				result += (arr[i].charCodeAt() - DSheet._A_code + 1) * Math.pow(26,arr.length - 1 - i);
			return result;
		}
	},
	rowName:function(index){
		if(typeof(index) == "number")
			if(index < 0)
				return DSheet.rowName(0);
			else
				return index + 1;
		else
			return parseInt(index);
	},
	path:(document.scripts[document.scripts.length-1].src.substring(0,document.scripts[document.scripts.length-1].src.lastIndexOf("/")+1)),
	tmpl:function(){
		if(!DSheet._isLoadedCss)
			DSheet._isLoadedCss = DSheet._loadCss(DSheet.path+"DSheet.css");
			
		return '\
		<table class="sheet" cellpadding="0" cellspacing="0" style="width:100%;height:100%;">\
		<tr height="20px;">\
		<td>\
		<ul class="toolbar">\
		<li><input type="text" class="sheet_pos" title="位置"/></li>\
		<li class="split"></li>\
		<li><input type="text" class="sheet_text" title="文字"/></li>\
		<li><img src="<%=path%>/image/fx.png" class="sheet_fx" title="函数模式"/></li>\
		<li class="split"></li>\
		<li><label><input type="checkbox" class="sheet_bold" bg="<%=path%>/image/b.png"/>粗体</label></li>\
		<li><label><input type="checkbox" class="sheet_italic" bg="<%=path%>/image/i.png"/>斜体</label></li>\
		<li><label><input type="checkbox" class="sheet_underline" bg="<%=path%>/image/u.png"/>下划线</label></li>\
		<li class="split"></li>\
		<li><input type="text" class="sheet_font_size" title="文字大小"/></li>\
		<li class="split"></li>\
		<select class="sheet_font" title="字体">\
		<option value="微软雅黑">微软雅黑</option>\
		<option value="宋体">宋体</option>\
		<option value="黑体">黑体</option>\
		<option value="隶书">隶书</option>\
		<option value="Arial">Arial</option>\
		<option value="Calibri">Calibri</option>\
		</select>\
		<li class="split"></li>\
		<li><img src="<%=path%>/image/undo_disable.png" class="sheet_undo" title="撤销"/></li>\
		<li><img src="<%=path%>/image/redo_disable.png" class="sheet_redo" title="重做"/></li>\
		<li class="split"></li>\
		<li><img src="<%=path%>/image/ac.png" class="sheet_align" title="对齐选项"/></li>\
		<span toggle="sheet_align">\
		<li><img src="<%=path%>/image/al.png" class="sheet_align_left" title="水平左对齐"/></li>\
		<li><img src="<%=path%>/image/ac.png" class="sheet_align_center" title="水平居中对齐"/></li>\
		<li><img src="<%=path%>/image/ar.png" class="sheet_align_right" title="水平右对齐"/></li>\
		<li><img src="<%=path%>/image/vt.png" class="sheet_valign_top" title="垂直上方对齐"/></li>\
		<li><img src="<%=path%>/image/vc.png" class="sheet_valign_center" title="垂直居中对齐"/></li>\
		<li><img src="<%=path%>/image/vb.png" class="sheet_valign_bottom" title="垂直下方对齐"/></li>\
		</span>\
		<li><img src="<%=path%>/image/border.png" class="sheet_border" title="边框样式"/></li>\
		<span toggle="sheet_border">\
		<li><img src="<%=path%>/image/bl.png" class="sheet_border_left" title="左边框"/></li>\
		<li><img src="<%=path%>/image/bt.png" class="sheet_border_top" title="上边框"/></li>\
		<li><img src="<%=path%>/image/br.png" class="sheet_border_right" title="右边框"/></li>\
		<li><img src="<%=path%>/image/bb.png" class="sheet_border_bottom" title="底边框"/></li>\
		</span>\
		<li><img src="<%=path%>/image/size.png" class="sheet_size" title="单元格大小"/></li>\
		<span toggle="sheet_size"><li class="sizebox">宽度：<input type="text"/>&nbsp;&nbsp;&nbsp;高度：<input type="text"/></li></span>\
		<li class="split"></li>\
		<li><img src="<%=path%>/image/cf.png" class="sheet_clear_style" title="删除样式"/></li>\
		<li><img src="<%=path%>/image/del.png" class="sheet_remove_dom" title="删除"/></li>\
		<li class="split"></li>\
		<li><input type="text" class="sheet_color_selector" for="fg"></div><div class="sheet_color sheet_text_color" title="文字颜色"><div class="sheet_color_view"></div></div></li>\
		<li><input type="text" class="sheet_color_selector" for="bg"></div><div class="sheet_color sheet_bg_color" title="文字颜色"><div class="sheet_color_view"></div></div></li>\
		<li class="split"></li>\
		<li><img src="<%=path%>/image/merge.png" class="sheet_merge" title="合并单元格"/></li>\
		</ul>\
		</td>\
		</tr>\
		<tr>\
		<td class="">\
		<div class="sheet_content disable_select" onselectstart="if ((event.target || event.srcElement).nodeName !== \'INPUT\') return false;">\
		<table class="sheet_head"></table>\
		<table class="sheet_left"></table>\
		<table class="sheet_table">\
		<thead>\
		</thead>\
		<tbody>\
		</tbody>\
		</table>\
		</div>\
		<div class="sheet_drag_mask"></div>\
		<div class="sheet_popup">\
		<p class="sheet_popup_cut negative">剪切</p>\
		<p class="sheet_popup_copy negative">复制</p>\
		<p class="sheet_popup_paste negative">粘贴</p>\
		<hr class="negative"/>\
		<p class="sheet_popup_delete">删除</p>\
		<p class="sheet_popup_clear">清除样式</p>\
		<p class="sheet_popup_merge">合并单元格</p>\
		<hr/>\
		<p class="sheet_popup_selectall">全选</p>\
		<hr/>\
		<p class="sheet_popup_size">设置尺寸</p>\
		</div>\
		</td>\
		</tr>\
		</table>\
		'.replace(new RegExp("<%=path%>","gm"),DSheet.path);
	},
	_isLoadedCss:false,
	_loadCss:function(name){
		var head = document.getElementsByTagName('HEAD').item(0);
		var style = document.createElement('link');
		style.href = name;
		style.rel = 'stylesheet';
		style.type = 'text/css';
		head.appendChild(style);
		return true;
	}
}

$.fn.dsheet = function(param){
	return _to_sheet.call({},this,param);
};

$.fn.hexColor = function(sty) { 
	var rgb = $(this).css(sty); 
	if(typeof(rgb) != "undefined" && rgb.indexOf("rgb") >= 0){ 
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/); 
		function hex(x) { 
			return ("0" + parseInt(x).toString(16)).slice(-2); 
		}
		if(rgb == null || rgb.length < 3)
			rgb = "#000000";
		else
			rgb= "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
	} 
	return rgb; 
}



/** spectrum 1.7 (https://github.com/bgrins/spectrum)**/
~(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{if(typeof exports=="object"&&typeof module=="object"){module.exports=factory}else{factory(jQuery)}}})(function($,undefined){var defaultOpts={beforeShow:noop,move:noop,change:noop,show:noop,hide:noop,color:false,flat:false,showInput:false,allowEmpty:false,showButtons:true,clickoutFiresChange:true,showInitial:false,showPalette:false,showPaletteOnly:false,hideAfterPaletteSelect:false,togglePaletteOnly:false,showSelectionPalette:true,localStorageKey:false,appendTo:"body",maxSelectionSize:7,cancelText:"cancel",chooseText:"choose",togglePaletteMoreText:"more",togglePaletteLessText:"less",clearText:"Clear Color Selection",noColorSelectedText:"No Color Selected",preferredFormat:false,className:"",containerClassName:"",replacerClassName:"",showAlpha:false,theme:"sp-light",palette:[["#ffffff","#000000","#ff0000","#ff8000","#ffff00","#008000","#0000ff","#4b0082","#9400d3"]],selectionPalette:[],disabled:false,offset:null},spectrums=[],IE=!!/msie/i.exec(window.navigator.userAgent),rgbaSupport=(function(){function contains(str,substr){return !!~(""+str).indexOf(substr)}var elem=document.createElement("div");var style=elem.style;style.cssText="background-color:rgba(0,0,0,.5)";return contains(style.backgroundColor,"rgba")||contains(style.backgroundColor,"hsla")})(),replaceInput=["<div class='sp-replacer'>","<div class='sp-preview'><div class='sp-preview-inner'></div></div>","<div class='sp-dd'>&#9660;</div>","</div>"].join(""),markup=(function(){var gradientFix="";if(IE){for(var i=1;i<=6;i++){gradientFix+="<div class='sp-"+i+"'></div>"}}return["<div class='sp-container sp-hidden'>","<div class='sp-palette-container'>","<div class='sp-palette sp-thumb sp-cf'></div>","<div class='sp-palette-button-container sp-cf'>","<button type='button' class='sp-palette-toggle'></button>","</div>","</div>","<div class='sp-picker-container'>","<div class='sp-top sp-cf'>","<div class='sp-fill'></div>","<div class='sp-top-inner'>","<div class='sp-color'>","<div class='sp-sat'>","<div class='sp-val'>","<div class='sp-dragger'></div>","</div>","</div>","</div>","<div class='sp-clear sp-clear-display'>","</div>","<div class='sp-hue'>","<div class='sp-slider'></div>",gradientFix,"</div>","</div>","<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>","</div>","<div class='sp-input-container sp-cf'>","<input class='sp-input' type='text' spellcheck='false'  />","</div>","<div class='sp-initial sp-thumb sp-cf'></div>","<div class='sp-button-container sp-cf'>","<a class='sp-cancel' href='#'></a>","<button type='button' class='sp-choose'></button>","</div>","</div>","</div>"].join("")})();function paletteTemplate(p,color,className,opts){var html=[];for(var i=0;i<p.length;i++){var current=p[i];if(current){var tiny=tinycolor(current);var c=tiny.toHsl().l<0.5?"sp-thumb-el sp-thumb-dark":"sp-thumb-el sp-thumb-light";c+=(tinycolor.equals(color,current))?" sp-thumb-active":"";var formattedString=tiny.toString(opts.preferredFormat||"rgb");var swatchStyle=rgbaSupport?("background-color:"+tiny.toRgbString()):"filter:"+tiny.toFilter();html.push('<span title="'+formattedString+'" data-color="'+tiny.toRgbString()+'" class="'+c+'"><span class="sp-thumb-inner" style="'+swatchStyle+';" /></span>')}else{var cls="sp-clear-display";html.push($("<div />").append($('<span data-color="" style="background-color:transparent;" class="'+cls+'"></span>').attr("title",opts.noColorSelectedText)).html())}}return"<div class='sp-cf "+className+"'>"+html.join("")+"</div>"}function hideAll(){for(var i=0;i<spectrums.length;i++){if(spectrums[i]){spectrums[i].hide()}}}function instanceOptions(o,callbackContext){var opts=$.extend({},defaultOpts,o);opts.callbacks={"move":bind(opts.move,callbackContext),"change":bind(opts.change,callbackContext),"show":bind(opts.show,callbackContext),"hide":bind(opts.hide,callbackContext),"beforeShow":bind(opts.beforeShow,callbackContext)};return opts}function spectrum(element,o){var opts=instanceOptions(o,element),flat=opts.flat,showSelectionPalette=opts.showSelectionPalette,localStorageKey=opts.localStorageKey,theme=opts.theme,callbacks=opts.callbacks,resize=throttle(reflow,10),visible=false,isDragging=false,dragWidth=0,dragHeight=0,dragHelperHeight=0,slideHeight=0,slideWidth=0,alphaWidth=0,alphaSlideHelperWidth=0,slideHelperHeight=0,currentHue=0,currentSaturation=0,currentValue=0,currentAlpha=1,palette=[],paletteArray=[],paletteLookup={},selectionPalette=opts.selectionPalette.slice(0),maxSelectionSize=opts.maxSelectionSize,draggingClass="sp-dragging",shiftMovementDirection=null;var doc=element.ownerDocument,body=doc.body,boundElement=$(element),disabled=false,container=$(markup,doc).addClass(theme),pickerContainer=container.find(".sp-picker-container"),dragger=container.find(".sp-color"),dragHelper=container.find(".sp-dragger"),slider=container.find(".sp-hue"),slideHelper=container.find(".sp-slider"),alphaSliderInner=container.find(".sp-alpha-inner"),alphaSlider=container.find(".sp-alpha"),alphaSlideHelper=container.find(".sp-alpha-handle"),textInput=container.find(".sp-input"),paletteContainer=container.find(".sp-palette"),initialColorContainer=container.find(".sp-initial"),cancelButton=container.find(".sp-cancel"),clearButton=container.find(".sp-clear"),chooseButton=container.find(".sp-choose"),toggleButton=container.find(".sp-palette-toggle"),isInput=boundElement.is("input"),isInputTypeColor=isInput&&boundElement.attr("type")==="color"&&inputTypeColorSupport(),shouldReplace=isInput&&!flat,replacer=(shouldReplace)?$(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName):$([]),offsetElement=(shouldReplace)?replacer:boundElement,previewElement=replacer.find(".sp-preview-inner"),initialColor=opts.color||(isInput&&boundElement.val()),colorOnShow=false,preferredFormat=opts.preferredFormat,currentPreferredFormat=preferredFormat,clickoutFiresChange=!opts.showButtons||opts.clickoutFiresChange,isEmpty=!initialColor,allowEmpty=opts.allowEmpty&&!isInputTypeColor;
function applyOptions(){if(opts.showPaletteOnly){opts.showPalette=true}toggleButton.text(opts.showPaletteOnly?opts.togglePaletteMoreText:opts.togglePaletteLessText);if(opts.palette){palette=opts.palette.slice(0);paletteArray=$.isArray(palette[0])?palette:[palette];paletteLookup={};for(var i=0;i<paletteArray.length;i++){for(var j=0;j<paletteArray[i].length;j++){var rgb=tinycolor(paletteArray[i][j]).toRgbString();paletteLookup[rgb]=true}}}container.toggleClass("sp-flat",flat);container.toggleClass("sp-input-disabled",!opts.showInput);container.toggleClass("sp-alpha-enabled",opts.showAlpha);container.toggleClass("sp-clear-enabled",allowEmpty);container.toggleClass("sp-buttons-disabled",!opts.showButtons);container.toggleClass("sp-palette-buttons-disabled",!opts.togglePaletteOnly);container.toggleClass("sp-palette-disabled",!opts.showPalette);container.toggleClass("sp-palette-only",opts.showPaletteOnly);container.toggleClass("sp-initial-disabled",!opts.showInitial);container.addClass(opts.className).addClass(opts.containerClassName);reflow()}function initialize(){if(IE){container.find("*:not(input)").attr("unselectable","on")}applyOptions();if(shouldReplace){boundElement.after(replacer).hide()}if(!allowEmpty){clearButton.hide()}if(flat){boundElement.after(container).hide()}else{var appendTo=opts.appendTo==="parent"?boundElement.parent():$(opts.appendTo);if(appendTo.length!==1){appendTo=$("body")}appendTo.append(container)}updateSelectionPaletteFromStorage();offsetElement.bind("click.spectrum touchstart.spectrum",function(e){if(!disabled){toggle()}e.stopPropagation();if(!$(e.target).is("input")){e.preventDefault()}});if(boundElement.is(":disabled")||(opts.disabled===true)){disable()}container.click(stopPropagation);textInput.change(setFromTextInput);textInput.bind("paste",function(){setTimeout(setFromTextInput,1)});textInput.keydown(function(e){if(e.keyCode==13){setFromTextInput()}});cancelButton.text(opts.cancelText);cancelButton.bind("click.spectrum",function(e){e.stopPropagation();e.preventDefault();revert();hide()});clearButton.attr("title",opts.clearText);clearButton.bind("click.spectrum",function(e){e.stopPropagation();e.preventDefault();isEmpty=true;move();if(flat){updateOriginalInput(true)}});chooseButton.text(opts.chooseText);chooseButton.bind("click.spectrum",function(e){e.stopPropagation();e.preventDefault();if(IE&&textInput.is(":focus")){textInput.trigger("change")}if(isValid()){updateOriginalInput(true);hide()}});toggleButton.text(opts.showPaletteOnly?opts.togglePaletteMoreText:opts.togglePaletteLessText);toggleButton.bind("click.spectrum",function(e){e.stopPropagation();e.preventDefault();opts.showPaletteOnly=!opts.showPaletteOnly;if(!opts.showPaletteOnly&&!flat){container.css("left","-="+(pickerContainer.outerWidth(true)+5))}applyOptions()});draggable(alphaSlider,function(dragX,dragY,e){currentAlpha=(dragX/alphaWidth);isEmpty=false;if(e.shiftKey){currentAlpha=Math.round(currentAlpha*10)/10}move()},dragStart,dragStop);draggable(slider,function(dragX,dragY){currentHue=parseFloat(dragY/slideHeight);isEmpty=false;if(!opts.showAlpha){currentAlpha=1}move()},dragStart,dragStop);draggable(dragger,function(dragX,dragY,e){if(!e.shiftKey){shiftMovementDirection=null}else{if(!shiftMovementDirection){var oldDragX=currentSaturation*dragWidth;var oldDragY=dragHeight-(currentValue*dragHeight);var furtherFromX=Math.abs(dragX-oldDragX)>Math.abs(dragY-oldDragY);shiftMovementDirection=furtherFromX?"x":"y"}}var setSaturation=!shiftMovementDirection||shiftMovementDirection==="x";var setValue=!shiftMovementDirection||shiftMovementDirection==="y";if(setSaturation){currentSaturation=parseFloat(dragX/dragWidth)}if(setValue){currentValue=parseFloat((dragHeight-dragY)/dragHeight)}isEmpty=false;if(!opts.showAlpha){currentAlpha=1}move()},dragStart,dragStop);if(!!initialColor){set(initialColor);updateUI();currentPreferredFormat=preferredFormat||tinycolor(initialColor).format;addColorToSelectionPalette(initialColor)}else{updateUI()}if(flat){show()}function paletteElementClick(e){if(e.data&&e.data.ignore){set($(e.target).closest(".sp-thumb-el").data("color"));move()}else{set($(e.target).closest(".sp-thumb-el").data("color"));move();updateOriginalInput(true);if(opts.hideAfterPaletteSelect){hide()}}return false}var paletteEvent=IE?"mousedown.spectrum":"click.spectrum touchstart.spectrum";paletteContainer.delegate(".sp-thumb-el",paletteEvent,paletteElementClick);initialColorContainer.delegate(".sp-thumb-el:nth-child(1)",paletteEvent,{ignore:true},paletteElementClick)}function updateSelectionPaletteFromStorage(){if(localStorageKey&&window.localStorage){try{var oldPalette=window.localStorage[localStorageKey].split(",#");if(oldPalette.length>1){delete window.localStorage[localStorageKey];$.each(oldPalette,function(i,c){addColorToSelectionPalette(c)})}}catch(e){}try{selectionPalette=window.localStorage[localStorageKey].split(";")}catch(e){}}}function addColorToSelectionPalette(color){if(showSelectionPalette){var rgb=tinycolor(color).toRgbString();
if(!paletteLookup[rgb]&&$.inArray(rgb,selectionPalette)===-1){selectionPalette.push(rgb);while(selectionPalette.length>maxSelectionSize){selectionPalette.shift()}}if(localStorageKey&&window.localStorage){try{window.localStorage[localStorageKey]=selectionPalette.join(";")}catch(e){}}}}function getUniqueSelectionPalette(){var unique=[];if(opts.showPalette){for(var i=0;i<selectionPalette.length;i++){var rgb=tinycolor(selectionPalette[i]).toRgbString();if(!paletteLookup[rgb]){unique.push(selectionPalette[i])}}}return unique.reverse().slice(0,opts.maxSelectionSize)}function drawPalette(){var currentColor=get();var html=$.map(paletteArray,function(palette,i){return paletteTemplate(palette,currentColor,"sp-palette-row sp-palette-row-"+i,opts)});updateSelectionPaletteFromStorage();if(selectionPalette){html.push(paletteTemplate(getUniqueSelectionPalette(),currentColor,"sp-palette-row sp-palette-row-selection",opts))}paletteContainer.html(html.join(""))}function drawInitial(){if(opts.showInitial){var initial=colorOnShow;var current=get();initialColorContainer.html(paletteTemplate([initial,current],current,"sp-palette-row-initial",opts))}}function dragStart(){if(dragHeight<=0||dragWidth<=0||slideHeight<=0){reflow()}isDragging=true;container.addClass(draggingClass);shiftMovementDirection=null;boundElement.trigger("dragstart.spectrum",[get()])}function dragStop(){isDragging=false;container.removeClass(draggingClass);boundElement.trigger("dragstop.spectrum",[get()])}function setFromTextInput(){var value=textInput.val();if((value===null||value==="")&&allowEmpty){set(null);updateOriginalInput(true)}else{var tiny=tinycolor(value);if(tiny.isValid()){set(tiny);updateOriginalInput(true)}else{textInput.addClass("sp-validation-error")}}}function toggle(){if(visible){hide()}else{show()}}function show(){var event=$.Event("beforeShow.spectrum");if(visible){reflow();return}boundElement.trigger(event,[get()]);if(callbacks.beforeShow(get())===false||event.isDefaultPrevented()){return}hideAll();visible=true;$(doc).bind("keydown.spectrum",onkeydown);$(doc).bind("click.spectrum",clickout);$(window).bind("resize.spectrum",resize);replacer.addClass("sp-active");container.removeClass("sp-hidden");reflow();updateUI();colorOnShow=get();drawInitial();callbacks.show(colorOnShow);boundElement.trigger("show.spectrum",[colorOnShow])}function onkeydown(e){if(e.keyCode===27){hide()}}function clickout(e){if(e.button==2){return}if(isDragging){return}if(clickoutFiresChange){updateOriginalInput(true)}else{revert()}hide()}function hide(){if(!visible||flat){return}visible=false;$(doc).unbind("keydown.spectrum",onkeydown);$(doc).unbind("click.spectrum",clickout);$(window).unbind("resize.spectrum",resize);replacer.removeClass("sp-active");container.addClass("sp-hidden");callbacks.hide(get());boundElement.trigger("hide.spectrum",[get()])}function revert(){set(colorOnShow,true)}function set(color,ignoreFormatChange){if(tinycolor.equals(color,get())){updateUI();return}var newColor,newHsv;if(!color&&allowEmpty){isEmpty=true}else{isEmpty=false;newColor=tinycolor(color);newHsv=newColor.toHsv();currentHue=(newHsv.h%360)/360;currentSaturation=newHsv.s;currentValue=newHsv.v;currentAlpha=newHsv.a}updateUI();if(newColor&&newColor.isValid()&&!ignoreFormatChange){currentPreferredFormat=preferredFormat||newColor.getFormat()}}function get(opts){opts=opts||{};if(allowEmpty&&isEmpty){return null}return tinycolor.fromRatio({h:currentHue,s:currentSaturation,v:currentValue,a:Math.round(currentAlpha*100)/100},{format:opts.format||currentPreferredFormat})}function isValid(){return !textInput.hasClass("sp-validation-error")}function move(){updateUI();callbacks.move(get());boundElement.trigger("move.spectrum",[get()])}function updateUI(){textInput.removeClass("sp-validation-error");updateHelperLocations();var flatColor=tinycolor.fromRatio({h:currentHue,s:1,v:1});dragger.css("background-color",flatColor.toHexString());var format=currentPreferredFormat;if(currentAlpha<1&&!(currentAlpha===0&&format==="name")){if(format==="hex"||format==="hex3"||format==="hex6"||format==="name"){format="rgb"}}var realColor=get({format:format}),displayColor="";previewElement.removeClass("sp-clear-display");previewElement.css("background-color","transparent");if(!realColor&&allowEmpty){previewElement.addClass("sp-clear-display")}else{var realHex=realColor.toHexString(),realRgb=realColor.toRgbString();if(rgbaSupport||realColor.alpha===1){previewElement.css("background-color",realRgb)}else{previewElement.css("background-color","transparent");previewElement.css("filter",realColor.toFilter())}if(opts.showAlpha){var rgb=realColor.toRgb();rgb.a=0;var realAlpha=tinycolor(rgb).toRgbString();var gradient="linear-gradient(left, "+realAlpha+", "+realHex+")";if(IE){alphaSliderInner.css("filter",tinycolor(realAlpha).toFilter({gradientType:1},realHex))}else{alphaSliderInner.css("background","-webkit-"+gradient);alphaSliderInner.css("background","-moz-"+gradient);alphaSliderInner.css("background","-ms-"+gradient);alphaSliderInner.css("background","linear-gradient(to right, "+realAlpha+", "+realHex+")")
}}displayColor=realColor.toString(format)}if(opts.showInput){textInput.val(displayColor)}if(opts.showPalette){drawPalette()}drawInitial()}function updateHelperLocations(){var s=currentSaturation;var v=currentValue;if(allowEmpty&&isEmpty){alphaSlideHelper.hide();slideHelper.hide();dragHelper.hide()}else{alphaSlideHelper.show();slideHelper.show();dragHelper.show();var dragX=s*dragWidth;var dragY=dragHeight-(v*dragHeight);dragX=Math.max(-dragHelperHeight,Math.min(dragWidth-dragHelperHeight,dragX-dragHelperHeight));dragY=Math.max(-dragHelperHeight,Math.min(dragHeight-dragHelperHeight,dragY-dragHelperHeight));dragHelper.css({"top":dragY+"px","left":dragX+"px"});var alphaX=currentAlpha*alphaWidth;alphaSlideHelper.css({"left":(alphaX-(alphaSlideHelperWidth/2))+"px"});var slideY=(currentHue)*slideHeight;slideHelper.css({"top":(slideY-slideHelperHeight)+"px"})}}function updateOriginalInput(fireCallback){var color=get(),displayColor="",hasChanged=!tinycolor.equals(color,colorOnShow);if(color){displayColor=color.toString(currentPreferredFormat);addColorToSelectionPalette(color)}if(isInput){boundElement.val(displayColor)}if(fireCallback&&hasChanged){callbacks.change(color);boundElement.trigger("change",[color])}}function reflow(){dragWidth=dragger.width();dragHeight=dragger.height();dragHelperHeight=dragHelper.height();slideWidth=slider.width();slideHeight=slider.height();slideHelperHeight=slideHelper.height();alphaWidth=alphaSlider.width();alphaSlideHelperWidth=alphaSlideHelper.width();if(!flat){container.css("position","absolute");if(opts.offset){container.offset(opts.offset)}else{container.offset(getOffset(container,offsetElement))}}updateHelperLocations();if(opts.showPalette){drawPalette()}boundElement.trigger("reflow.spectrum")}function destroy(){boundElement.show();offsetElement.unbind("click.spectrum touchstart.spectrum");container.remove();replacer.remove();spectrums[spect.id]=null}function option(optionName,optionValue){if(optionName===undefined){return $.extend({},opts)}if(optionValue===undefined){return opts[optionName]}opts[optionName]=optionValue;applyOptions()}function enable(){disabled=false;boundElement.attr("disabled",false);offsetElement.removeClass("sp-disabled")}function disable(){hide();disabled=true;boundElement.attr("disabled",true);offsetElement.addClass("sp-disabled")}function setOffset(coord){opts.offset=coord;reflow()}initialize();var spect={show:show,hide:hide,toggle:toggle,reflow:reflow,option:option,enable:enable,disable:disable,offset:setOffset,set:function(c){set(c);updateOriginalInput()},get:get,destroy:destroy,container:container};spect.id=spectrums.push(spect)-1;return spect}function getOffset(picker,input){var extraY=0;var dpWidth=picker.outerWidth();var dpHeight=picker.outerHeight();var inputHeight=input.outerHeight();var doc=picker[0].ownerDocument;var docElem=doc.documentElement;var viewWidth=docElem.clientWidth+$(doc).scrollLeft();var viewHeight=docElem.clientHeight+$(doc).scrollTop();var offset=input.offset();offset.top+=inputHeight;offset.left-=Math.min(offset.left,(offset.left+dpWidth>viewWidth&&viewWidth>dpWidth)?Math.abs(offset.left+dpWidth-viewWidth):0);offset.top-=Math.min(offset.top,((offset.top+dpHeight>viewHeight&&viewHeight>dpHeight)?Math.abs(dpHeight+inputHeight-extraY):extraY));return offset}function noop(){}function stopPropagation(e){e.stopPropagation()}function bind(func,obj){var slice=Array.prototype.slice;var args=slice.call(arguments,2);return function(){return func.apply(obj,args.concat(slice.call(arguments)))}}function draggable(element,onmove,onstart,onstop){onmove=onmove||function(){};onstart=onstart||function(){};onstop=onstop||function(){};var doc=document;var dragging=false;var offset={};var maxHeight=0;var maxWidth=0;var hasTouch=("ontouchstart" in window);var duringDragEvents={};duringDragEvents["selectstart"]=prevent;duringDragEvents["dragstart"]=prevent;duringDragEvents["touchmove mousemove"]=move;duringDragEvents["touchend mouseup"]=stop;function prevent(e){if(e.stopPropagation){e.stopPropagation()}if(e.preventDefault){e.preventDefault()}e.returnValue=false}function move(e){if(dragging){if(IE&&doc.documentMode<9&&!e.button){return stop()}var t0=e.originalEvent&&e.originalEvent.touches&&e.originalEvent.touches[0];var pageX=t0&&t0.pageX||e.pageX;var pageY=t0&&t0.pageY||e.pageY;var dragX=Math.max(0,Math.min(pageX-offset.left,maxWidth));var dragY=Math.max(0,Math.min(pageY-offset.top,maxHeight));if(hasTouch){prevent(e)}onmove.apply(element,[dragX,dragY,e])}}function start(e){var rightclick=(e.which)?(e.which==3):(e.button==2);if(!rightclick&&!dragging){if(onstart.apply(element,arguments)!==false){dragging=true;maxHeight=$(element).height();maxWidth=$(element).width();offset=$(element).offset();$(doc).bind(duringDragEvents);$(doc.body).addClass("sp-dragging");move(e);prevent(e)}}}function stop(){if(dragging){$(doc).unbind(duringDragEvents);$(doc.body).removeClass("sp-dragging");setTimeout(function(){onstop.apply(element,arguments)},0)}dragging=false}$(element).bind("touchstart mousedown",start)
}function throttle(func,wait,debounce){var timeout;return function(){var context=this,args=arguments;var throttler=function(){timeout=null;func.apply(context,args)};if(debounce){clearTimeout(timeout)}if(debounce||!timeout){timeout=setTimeout(throttler,wait)}}}function inputTypeColorSupport(){return $.fn.spectrum.inputTypeColorSupport()}var dataID="spectrum.id";$.fn.spectrum=function(opts,extra){if(typeof opts=="string"){var returnValue=this;var args=Array.prototype.slice.call(arguments,1);this.each(function(){var spect=spectrums[$(this).data(dataID)];if(spect){var method=spect[opts];if(!method){throw new Error("Spectrum: no such method: '"+opts+"'")}if(opts=="get"){returnValue=spect.get()}else{if(opts=="container"){returnValue=spect.container}else{if(opts=="option"){returnValue=spect.option.apply(spect,args)}else{if(opts=="destroy"){spect.destroy();$(this).removeData(dataID)}else{method.apply(spect,args)}}}}}});return returnValue}return this.spectrum("destroy").each(function(){var options=$.extend({},opts,$(this).data());var spect=spectrum(this,options);$(this).data(dataID,spect.id)})};$.fn.spectrum.load=true;$.fn.spectrum.loadOpts={};$.fn.spectrum.draggable=draggable;$.fn.spectrum.defaults=defaultOpts;$.fn.spectrum.inputTypeColorSupport=function inputTypeColorSupport(){if(typeof inputTypeColorSupport._cachedResult==="undefined"){var colorInput=$("<input type='color' value='!' />")[0];inputTypeColorSupport._cachedResult=colorInput.type==="color"&&colorInput.value!=="!"}return inputTypeColorSupport._cachedResult};$.spectrum={};$.spectrum.localization={};$.spectrum.palettes={};$.fn.spectrum.processNativeColorInputs=function(){var colorInputs=$("input[type=color]");if(colorInputs.length&&!inputTypeColorSupport()){colorInputs.spectrum({preferredFormat:"hex6"})}};(function(){var trimLeft=/^[\s,#]+/,trimRight=/\s+$/,tinyCounter=0,math=Math,mathRound=math.round,mathMin=math.min,mathMax=math.max,mathRandom=math.random;var tinycolor=function(color,opts){color=(color)?color:"";opts=opts||{};if(color instanceof tinycolor){return color}if(!(this instanceof tinycolor)){return new tinycolor(color,opts)}var rgb=inputToRGB(color);this._originalInput=color,this._r=rgb.r,this._g=rgb.g,this._b=rgb.b,this._a=rgb.a,this._roundA=mathRound(100*this._a)/100,this._format=opts.format||rgb.format;this._gradientType=opts.gradientType;if(this._r<1){this._r=mathRound(this._r)}if(this._g<1){this._g=mathRound(this._g)}if(this._b<1){this._b=mathRound(this._b)}this._ok=rgb.ok;this._tc_id=tinyCounter++};tinycolor.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return !this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var rgb=this.toRgb();return(rgb.r*299+rgb.g*587+rgb.b*114)/1000},setAlpha:function(value){this._a=boundAlpha(value);this._roundA=mathRound(100*this._a)/100;return this},toHsv:function(){var hsv=rgbToHsv(this._r,this._g,this._b);return{h:hsv.h*360,s:hsv.s,v:hsv.v,a:this._a}},toHsvString:function(){var hsv=rgbToHsv(this._r,this._g,this._b);var h=mathRound(hsv.h*360),s=mathRound(hsv.s*100),v=mathRound(hsv.v*100);return(this._a==1)?"hsv("+h+", "+s+"%, "+v+"%)":"hsva("+h+", "+s+"%, "+v+"%, "+this._roundA+")"},toHsl:function(){var hsl=rgbToHsl(this._r,this._g,this._b);return{h:hsl.h*360,s:hsl.s,l:hsl.l,a:this._a}},toHslString:function(){var hsl=rgbToHsl(this._r,this._g,this._b);var h=mathRound(hsl.h*360),s=mathRound(hsl.s*100),l=mathRound(hsl.l*100);return(this._a==1)?"hsl("+h+", "+s+"%, "+l+"%)":"hsla("+h+", "+s+"%, "+l+"%, "+this._roundA+")"},toHex:function(allow3Char){return rgbToHex(this._r,this._g,this._b,allow3Char)},toHexString:function(allow3Char){return"#"+this.toHex(allow3Char)},toHex8:function(){return rgbaToHex(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:mathRound(this._r),g:mathRound(this._g),b:mathRound(this._b),a:this._a}},toRgbString:function(){return(this._a==1)?"rgb("+mathRound(this._r)+", "+mathRound(this._g)+", "+mathRound(this._b)+")":"rgba("+mathRound(this._r)+", "+mathRound(this._g)+", "+mathRound(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:mathRound(bound01(this._r,255)*100)+"%",g:mathRound(bound01(this._g,255)*100)+"%",b:mathRound(bound01(this._b,255)*100)+"%",a:this._a}},toPercentageRgbString:function(){return(this._a==1)?"rgb("+mathRound(bound01(this._r,255)*100)+"%, "+mathRound(bound01(this._g,255)*100)+"%, "+mathRound(bound01(this._b,255)*100)+"%)":"rgba("+mathRound(bound01(this._r,255)*100)+"%, "+mathRound(bound01(this._g,255)*100)+"%, "+mathRound(bound01(this._b,255)*100)+"%, "+this._roundA+")"},toName:function(){if(this._a===0){return"transparent"}if(this._a<1){return false}return hexNames[rgbToHex(this._r,this._g,this._b,true)]||false},toFilter:function(secondColor){var hex8String="#"+rgbaToHex(this._r,this._g,this._b,this._a);
var secondHex8String=hex8String;var gradientType=this._gradientType?"GradientType = 1, ":"";if(secondColor){var s=tinycolor(secondColor);secondHex8String=s.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")"},toString:function(format){var formatSet=!!format;format=format||this._format;var formattedString=false;var hasAlpha=this._a<1&&this._a>=0;var needsAlphaFormat=!formatSet&&hasAlpha&&(format==="hex"||format==="hex6"||format==="hex3"||format==="name");if(needsAlphaFormat){if(format==="name"&&this._a===0){return this.toName()}return this.toRgbString()}if(format==="rgb"){formattedString=this.toRgbString()}if(format==="prgb"){formattedString=this.toPercentageRgbString()}if(format==="hex"||format==="hex6"){formattedString=this.toHexString()}if(format==="hex3"){formattedString=this.toHexString(true)}if(format==="hex8"){formattedString=this.toHex8String()}if(format==="name"){formattedString=this.toName()}if(format==="hsl"){formattedString=this.toHslString()}if(format==="hsv"){formattedString=this.toHsvString()}return formattedString||this.toHexString()},_applyModification:function(fn,args){var color=fn.apply(null,[this].concat([].slice.call(args)));this._r=color._r;this._g=color._g;this._b=color._b;this.setAlpha(color._a);return this},lighten:function(){return this._applyModification(lighten,arguments)},brighten:function(){return this._applyModification(brighten,arguments)},darken:function(){return this._applyModification(darken,arguments)},desaturate:function(){return this._applyModification(desaturate,arguments)},saturate:function(){return this._applyModification(saturate,arguments)},greyscale:function(){return this._applyModification(greyscale,arguments)},spin:function(){return this._applyModification(spin,arguments)},_applyCombination:function(fn,args){return fn.apply(null,[this].concat([].slice.call(args)))},analogous:function(){return this._applyCombination(analogous,arguments)},complement:function(){return this._applyCombination(complement,arguments)},monochromatic:function(){return this._applyCombination(monochromatic,arguments)},splitcomplement:function(){return this._applyCombination(splitcomplement,arguments)},triad:function(){return this._applyCombination(triad,arguments)},tetrad:function(){return this._applyCombination(tetrad,arguments)}};tinycolor.fromRatio=function(color,opts){if(typeof color=="object"){var newColor={};for(var i in color){if(color.hasOwnProperty(i)){if(i==="a"){newColor[i]=color[i]}else{newColor[i]=convertToPercentage(color[i])}}}color=newColor}return tinycolor(color,opts)};function inputToRGB(color){var rgb={r:0,g:0,b:0};var a=1;var ok=false;var format=false;if(typeof color=="string"){color=stringInputToObject(color)}if(typeof color=="object"){if(color.hasOwnProperty("r")&&color.hasOwnProperty("g")&&color.hasOwnProperty("b")){rgb=rgbToRgb(color.r,color.g,color.b);ok=true;format=String(color.r).substr(-1)==="%"?"prgb":"rgb"}else{if(color.hasOwnProperty("h")&&color.hasOwnProperty("s")&&color.hasOwnProperty("v")){color.s=convertToPercentage(color.s);color.v=convertToPercentage(color.v);rgb=hsvToRgb(color.h,color.s,color.v);ok=true;format="hsv"}else{if(color.hasOwnProperty("h")&&color.hasOwnProperty("s")&&color.hasOwnProperty("l")){color.s=convertToPercentage(color.s);color.l=convertToPercentage(color.l);rgb=hslToRgb(color.h,color.s,color.l);ok=true;format="hsl"}}}if(color.hasOwnProperty("a")){a=color.a}}a=boundAlpha(a);return{ok:ok,format:color.format||format,r:mathMin(255,mathMax(rgb.r,0)),g:mathMin(255,mathMax(rgb.g,0)),b:mathMin(255,mathMax(rgb.b,0)),a:a}}function rgbToRgb(r,g,b){return{r:bound01(r,255)*255,g:bound01(g,255)*255,b:bound01(b,255)*255}}function rgbToHsl(r,g,b){r=bound01(r,255);g=bound01(g,255);b=bound01(b,255);var max=mathMax(r,g,b),min=mathMin(r,g,b);var h,s,l=(max+min)/2;if(max==min){h=s=0}else{var d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break}h/=6}return{h:h,s:s,l:l}}function hslToRgb(h,s,l){var r,g,b;h=bound01(h,360);s=bound01(s,100);l=bound01(l,100);function hue2rgb(p,q,t){if(t<0){t+=1}if(t>1){t-=1}if(t<1/6){return p+(q-p)*6*t}if(t<1/2){return q}if(t<2/3){return p+(q-p)*(2/3-t)*6}return p}if(s===0){r=g=b=l}else{var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3)}return{r:r*255,g:g*255,b:b*255}}function rgbToHsv(r,g,b){r=bound01(r,255);g=bound01(g,255);b=bound01(b,255);var max=mathMax(r,g,b),min=mathMin(r,g,b);var h,s,v=max;var d=max-min;s=max===0?0:d/max;if(max==min){h=0}else{switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break}h/=6}return{h:h,s:s,v:v}}function hsvToRgb(h,s,v){h=bound01(h,360)*6;s=bound01(s,100);v=bound01(v,100);var i=math.floor(h),f=h-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s),mod=i%6,r=[v,q,p,p,t,v][mod],g=[t,v,v,q,p,p][mod],b=[p,p,t,v,v,q][mod];return{r:r*255,g:g*255,b:b*255}
}function rgbToHex(r,g,b,allow3Char){var hex=[pad2(mathRound(r).toString(16)),pad2(mathRound(g).toString(16)),pad2(mathRound(b).toString(16))];if(allow3Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)){return hex[0].charAt(0)+hex[1].charAt(0)+hex[2].charAt(0)}return hex.join("")}function rgbaToHex(r,g,b,a){var hex=[pad2(convertDecimalToHex(a)),pad2(mathRound(r).toString(16)),pad2(mathRound(g).toString(16)),pad2(mathRound(b).toString(16))];return hex.join("")}tinycolor.equals=function(color1,color2){if(!color1||!color2){return false}return tinycolor(color1).toRgbString()==tinycolor(color2).toRgbString()};tinycolor.random=function(){return tinycolor.fromRatio({r:mathRandom(),g:mathRandom(),b:mathRandom()})};function desaturate(color,amount){amount=(amount===0)?0:(amount||10);var hsl=tinycolor(color).toHsl();hsl.s-=amount/100;hsl.s=clamp01(hsl.s);return tinycolor(hsl)}function saturate(color,amount){amount=(amount===0)?0:(amount||10);var hsl=tinycolor(color).toHsl();hsl.s+=amount/100;hsl.s=clamp01(hsl.s);return tinycolor(hsl)}function greyscale(color){return tinycolor(color).desaturate(100)}function lighten(color,amount){amount=(amount===0)?0:(amount||10);var hsl=tinycolor(color).toHsl();hsl.l+=amount/100;hsl.l=clamp01(hsl.l);return tinycolor(hsl)}function brighten(color,amount){amount=(amount===0)?0:(amount||10);var rgb=tinycolor(color).toRgb();rgb.r=mathMax(0,mathMin(255,rgb.r-mathRound(255*-(amount/100))));rgb.g=mathMax(0,mathMin(255,rgb.g-mathRound(255*-(amount/100))));rgb.b=mathMax(0,mathMin(255,rgb.b-mathRound(255*-(amount/100))));return tinycolor(rgb)}function darken(color,amount){amount=(amount===0)?0:(amount||10);var hsl=tinycolor(color).toHsl();hsl.l-=amount/100;hsl.l=clamp01(hsl.l);return tinycolor(hsl)}function spin(color,amount){var hsl=tinycolor(color).toHsl();var hue=(mathRound(hsl.h)+amount)%360;hsl.h=hue<0?360+hue:hue;return tinycolor(hsl)}function complement(color){var hsl=tinycolor(color).toHsl();hsl.h=(hsl.h+180)%360;return tinycolor(hsl)}function triad(color){var hsl=tinycolor(color).toHsl();var h=hsl.h;return[tinycolor(color),tinycolor({h:(h+120)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+240)%360,s:hsl.s,l:hsl.l})]}function tetrad(color){var hsl=tinycolor(color).toHsl();var h=hsl.h;return[tinycolor(color),tinycolor({h:(h+90)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+180)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+270)%360,s:hsl.s,l:hsl.l})]}function splitcomplement(color){var hsl=tinycolor(color).toHsl();var h=hsl.h;return[tinycolor(color),tinycolor({h:(h+72)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+216)%360,s:hsl.s,l:hsl.l})]}function analogous(color,results,slices){results=results||6;slices=slices||30;var hsl=tinycolor(color).toHsl();var part=360/slices;var ret=[tinycolor(color)];for(hsl.h=((hsl.h-(part*results>>1))+720)%360;--results;){hsl.h=(hsl.h+part)%360;ret.push(tinycolor(hsl))}return ret}function monochromatic(color,results){results=results||6;var hsv=tinycolor(color).toHsv();var h=hsv.h,s=hsv.s,v=hsv.v;var ret=[];var modification=1/results;while(results--){ret.push(tinycolor({h:h,s:s,v:v}));v=(v+modification)%1}return ret}tinycolor.mix=function(color1,color2,amount){amount=(amount===0)?0:(amount||50);var rgb1=tinycolor(color1).toRgb();var rgb2=tinycolor(color2).toRgb();var p=amount/100;var w=p*2-1;var a=rgb2.a-rgb1.a;var w1;if(w*a==-1){w1=w}else{w1=(w+a)/(1+w*a)}w1=(w1+1)/2;var w2=1-w1;var rgba={r:rgb2.r*w1+rgb1.r*w2,g:rgb2.g*w1+rgb1.g*w2,b:rgb2.b*w1+rgb1.b*w2,a:rgb2.a*p+rgb1.a*(1-p)};return tinycolor(rgba)};tinycolor.readability=function(color1,color2){var c1=tinycolor(color1);var c2=tinycolor(color2);var rgb1=c1.toRgb();var rgb2=c2.toRgb();var brightnessA=c1.getBrightness();var brightnessB=c2.getBrightness();var colorDiff=(Math.max(rgb1.r,rgb2.r)-Math.min(rgb1.r,rgb2.r)+Math.max(rgb1.g,rgb2.g)-Math.min(rgb1.g,rgb2.g)+Math.max(rgb1.b,rgb2.b)-Math.min(rgb1.b,rgb2.b));return{brightness:Math.abs(brightnessA-brightnessB),color:colorDiff}};tinycolor.isReadable=function(color1,color2){var readability=tinycolor.readability(color1,color2);return readability.brightness>125&&readability.color>500};tinycolor.mostReadable=function(baseColor,colorList){var bestColor=null;var bestScore=0;var bestIsReadable=false;for(var i=0;i<colorList.length;i++){var readability=tinycolor.readability(baseColor,colorList[i]);var readable=readability.brightness>125&&readability.color>500;var score=3*(readability.brightness/125)+(readability.color/500);if((readable&&!bestIsReadable)||(readable&&bestIsReadable&&score>bestScore)||((!readable)&&(!bestIsReadable)&&score>bestScore)){bestIsReadable=readable;bestScore=score;bestColor=tinycolor(colorList[i])}}return bestColor};var names=tinycolor.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};
var hexNames=tinycolor.hexNames=flip(names);function flip(o){var flipped={};for(var i in o){if(o.hasOwnProperty(i)){flipped[o[i]]=i}}return flipped}function boundAlpha(a){a=parseFloat(a);if(isNaN(a)||a<0||a>1){a=1}return a}function bound01(n,max){if(isOnePointZero(n)){n="100%"}var processPercent=isPercentage(n);n=mathMin(max,mathMax(0,parseFloat(n)));if(processPercent){n=parseInt(n*max,10)/100}if((math.abs(n-max)<0.000001)){return 1}return(n%max)/parseFloat(max)}function clamp01(val){return mathMin(1,mathMax(0,val))}function parseIntFromHex(val){return parseInt(val,16)}function isOnePointZero(n){return typeof n=="string"&&n.indexOf(".")!=-1&&parseFloat(n)===1}function isPercentage(n){return typeof n==="string"&&n.indexOf("%")!=-1}function pad2(c){return c.length==1?"0"+c:""+c}function convertToPercentage(n){if(n<=1){n=(n*100)+"%"}return n}function convertDecimalToHex(d){return Math.round(parseFloat(d)*255).toString(16)}function convertHexToDecimal(h){return(parseIntFromHex(h)/255)}var matchers=(function(){var CSS_INTEGER="[-\\+]?\\d+%?";var CSS_NUMBER="[-\\+]?\\d*\\.\\d+%?";var CSS_UNIT="(?:"+CSS_NUMBER+")|(?:"+CSS_INTEGER+")";var PERMISSIVE_MATCH3="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?";var PERMISSIVE_MATCH4="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?";return{rgb:new RegExp("rgb"+PERMISSIVE_MATCH3),rgba:new RegExp("rgba"+PERMISSIVE_MATCH4),hsl:new RegExp("hsl"+PERMISSIVE_MATCH3),hsla:new RegExp("hsla"+PERMISSIVE_MATCH4),hsv:new RegExp("hsv"+PERMISSIVE_MATCH3),hsva:new RegExp("hsva"+PERMISSIVE_MATCH4),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}})();function stringInputToObject(color){color=color.replace(trimLeft,"").replace(trimRight,"").toLowerCase();var named=false;if(names[color]){color=names[color];named=true}else{if(color=="transparent"){return{r:0,g:0,b:0,a:0,format:"name"}}}var match;if((match=matchers.rgb.exec(color))){return{r:match[1],g:match[2],b:match[3]}}if((match=matchers.rgba.exec(color))){return{r:match[1],g:match[2],b:match[3],a:match[4]}}if((match=matchers.hsl.exec(color))){return{h:match[1],s:match[2],l:match[3]}}if((match=matchers.hsla.exec(color))){return{h:match[1],s:match[2],l:match[3],a:match[4]}}if((match=matchers.hsv.exec(color))){return{h:match[1],s:match[2],v:match[3]}}if((match=matchers.hsva.exec(color))){return{h:match[1],s:match[2],v:match[3],a:match[4]}}if((match=matchers.hex8.exec(color))){return{a:convertHexToDecimal(match[1]),r:parseIntFromHex(match[2]),g:parseIntFromHex(match[3]),b:parseIntFromHex(match[4]),format:named?"name":"hex8"}}if((match=matchers.hex6.exec(color))){return{r:parseIntFromHex(match[1]),g:parseIntFromHex(match[2]),b:parseIntFromHex(match[3]),format:named?"name":"hex"}}if((match=matchers.hex3.exec(color))){return{r:parseIntFromHex(match[1]+""+match[1]),g:parseIntFromHex(match[2]+""+match[2]),b:parseIntFromHex(match[3]+""+match[3]),format:named?"name":"hex"}}return false}window.tinycolor=tinycolor})();$(function(){if($.fn.spectrum.load){$.fn.spectrum.processNativeColorInputs()}})});

/** JSON2.js **/
if(typeof JSON!=="object"){JSON={}}(function(){var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(n){return n<10?"0"+n:n}function this_value(){return this.valueOf()}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value}var gap,indent,meta,rep;function quote(string){rx_escapable.lastIndex=0;return rx_escapable.test(string)?'"'+string.replace(rx_escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);rx_dangerous.lastIndex=0;if(rx_dangerous.test(text)){text=text.replace(rx_dangerous,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

/** decimal.js v4.0.3 (https://github.com/MikeMcl/decimal.js/LICENCE) */
!function(e){"use strict";function n(e){for(var n,r,t=1,i=e.length,o=e[0]+"";i>t;t++){for(n=e[t]+"",r=y-n.length;r--;)n="0"+n;o+=n}for(i=o.length;48===o.charCodeAt(--i););return o.slice(0,i+1||1)}function r(e,n,r,t){var i,o,s,c,u;for(o=1,s=e[0];s>=10;s/=10,o++);return s=n-o,0>s?(s+=y,i=0):(i=Math.ceil((s+1)/y),s%=y),o=E(10,y-s),u=e[i]%o|0,null==t?3>s?(0==s?u=u/100|0:1==s&&(u=u/10|0),c=4>r&&99999==u||r>3&&49999==u||5e4==u||0==u):c=(4>r&&u+1==o||r>3&&u+1==o/2)&&(e[i+1]/o/100|0)==E(10,s-2)-1||(u==o/2||0==u)&&0==(e[i+1]/o/100|0):4>s?(0==s?u=u/1e3|0:1==s?u=u/100|0:2==s&&(u=u/10|0),c=(t||4>r)&&9999==u||!t&&r>3&&4999==u):c=((t||4>r)&&u+1==o||!t&&r>3&&u+1==o/2)&&(e[i+1]/o/1e3|0)==E(10,s-3)-1,c}function t(e,n,r){var t=e.constructor;return null==n||((m=0>n||n>8)||0!==n&&(t.errors?parseInt:parseFloat)(n)!=n)&&!u(t,"rounding mode",n,r,0)?t.rounding:0|n}function i(e,n,r,t){var i=e.constructor;return!(m=(t||0)>n||n>=A+1)&&(0===n||(i.errors?parseInt:parseFloat)(n)==n)||u(i,"argument",n,r,0)}function o(e,t){var i,o,s,c,u,l,f,h=0,g=0,p=0,m=e.constructor,d=m.ONE,N=m.rounding,v=m.precision;if(!e.c||!e.c[0]||e.e>17)return new m(e.c?e.c[0]?e.s<0?0:1/0:d:e.s?e.s<0?0:e:NaN);for(null==t?(w=!1,u=v):u=t,f=new m(.03125);e.e>-2;)e=e.times(f),p+=5;for(o=Math.log(E(2,p))/Math.LN10*2+5|0,u+=o,i=c=l=new m(d),m.precision=u;;){if(c=a(c.times(e),u,1),i=i.times(++g),f=l.plus(P(c,i,u,1)),n(f.c).slice(0,u)===n(l.c).slice(0,u)){for(s=p;s--;)l=a(l.times(l),u,1);if(null!=t)return m.precision=v,l;if(!(3>h&&r(l.c,u-o,N,h)))return a(l,m.precision=v,N,w=!0);m.precision=u+=10,i=c=f=new m(d),g=0,h++}l=f}}function s(e,r,t,i){var o,s,c=e.constructor,u=(e=new c(e)).e;if(null==r?t=0:(a(e,++r,t),t=i?r:r+e.e-u),u=e.e,o=n(e.c),1==i||2==i&&(u>=r||u<=c.toExpNeg)){for(;o.length<t;o+="0");o.length>1&&(o=o.charAt(0)+"."+o.slice(1)),o+=(0>u?"e":"e+")+u}else{if(i=o.length,0>u){for(s=t-i;++u;o="0"+o);o="0."+o}else if(++u>i){for(s=t-u,u-=i;u--;o+="0");s>0&&(o+=".")}else s=t-i,i>u?o=o.slice(0,u)+"."+o.slice(u):s>0&&(o+=".");if(s>0)for(;s--;o+="0");}return e.s<0&&e.c[0]?"-"+o:o}function c(e){var n=e.length-1,r=n*y+1;if(n=e[n]){for(;n%10==0;n/=10,r--);for(n=e[0];n>=10;n/=10,r++);}return r}function u(e,n,r,t,i){if(e.errors){var o=new Error((t||["new Decimal","cmp","div","eq","gt","gte","lt","lte","minus","mod","plus","times","toFraction","pow","random","log","sqrt","toNearest","divToInt"][N?0>N?-N:N:0>1/N?1:0])+"() "+(["number type has more than 15 significant digits","LN10 out of digits"][n]||n+([m?" out of range":" not an integer"," not a boolean or binary digit"][i]||""))+": "+r);throw o.name="Decimal Error",m=N=0,o}}function l(e,n,r){var t=new e(e.ONE);for(w=!1;1&r&&(t=t.times(n)),r>>=1,r;)n=n.times(n);return w=!0,t}function f(e,t){var i,o,s,c,l,h,g,p,m,d,N,v=1,E=10,x=e,b=x.c,y=x.constructor,O=y.ONE,S=y.rounding,D=y.precision;if(x.s<0||!b||!b[0]||!x.e&&1==b[0]&&1==b.length)return new y(b&&!b[0]?-1/0:1!=x.s?NaN:b?0:x);if(null==t?(w=!1,g=D):g=t,y.precision=g+=E,i=n(b),o=i.charAt(0),!(Math.abs(c=x.e)<15e14))return x=new y(o+"."+i.slice(1)),g+2>M.length&&u(y,1,g+2,"ln"),x=f(x,g-E).plus(new y(M.slice(0,g+2)).times(c+"")),y.precision=D,null==t?a(x,D,S,w=!0):x;for(;7>o&&1!=o||1==o&&i.charAt(1)>3;)x=x.times(e),i=n(x.c),o=i.charAt(0),v++;for(c=x.e,o>1?(x=new y("0."+i),c++):x=new y(o+"."+i.slice(1)),d=x,p=l=x=P(x.minus(O),x.plus(O),g,1),N=a(x.times(x),g,1),s=3;;){if(l=a(l.times(N),g,1),m=p.plus(P(l,new y(s),g,1)),n(m.c).slice(0,g)===n(p.c).slice(0,g)){if(p=p.times(2),0!==c&&(g+2>M.length&&u(y,1,g+2,"ln"),p=p.plus(new y(M.slice(0,g+2)).times(c+""))),p=P(p,new y(v),g,1),null!=t)return y.precision=D,p;if(!r(p.c,g-E,S,h))return a(p,y.precision=D,S,w=!0);y.precision=g+=E,m=l=x=P(d.minus(O),d.plus(O),g,1),N=a(x.times(x),g,1),s=h=1}p=m,s+=2}}function a(e,n,r,t){var i,o,s,c,u,l,f,a,h=e.constructor;e:if(null!=n){if(!(f=e.c))return e;for(i=1,c=f[0];c>=10;c/=10,i++);if(o=n-i,0>o)o+=y,s=n,u=f[a=0],l=u/E(10,i-s-1)%10|0;else if(a=Math.ceil((o+1)/y),a>=f.length){if(!t)break e;for(;f.length<=a;f.push(0));u=l=0,i=1,o%=y,s=o-y+1}else{for(u=c=f[a],i=1;c>=10;c/=10,i++);o%=y,s=o-y+i,l=0>s?0:v(u/E(10,i-s-1)%10)}if(t=t||0>n||null!=f[a+1]||(0>s?u:u%E(10,i-s-1)),t=4>r?(l||t)&&(0==r||r==(e.s<0?3:2)):l>5||5==l&&(4==r||t||6==r&&(o>0?s>0?u/E(10,i-s):0:f[a-1])%10&1||r==(e.s<0?8:7)),1>n||!f[0])return f.length=0,t?(n-=e.e+1,f[0]=E(10,(y-n%y)%y),e.e=-n||0):f[0]=e.e=0,e;if(0==o?(f.length=a,c=1,a--):(f.length=a+1,c=E(10,y-o),f[a]=s>0?(u/E(10,i-s)%E(10,s)|0)*c:0),t)for(;;){if(0==a){for(o=1,s=f[0];s>=10;s/=10,o++);for(s=f[0]+=c,c=1;s>=10;s/=10,c++);o!=c&&(e.e++,f[0]==b&&(f[0]=1));break}if(f[a]+=c,f[a]!=b)break;f[a--]=0,c=1}for(o=f.length;0===f[--o];f.pop());}return w&&(e.e>h.maxE?e.c=e.e=null:e.e<h.minE&&(e.c=[e.e=0])),e}var h,g,p,m,d=e.crypto,w=!0,N=0,v=Math.floor,E=Math.pow,x=Object.prototype.toString,b=1e7,y=7,O="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_",S={},D=9e15,A=1e9,F=3e3,M="2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";S.absoluteValue=S.abs=function(){var e=new this.constructor(this);return e.s<0&&(e.s=1),a(e)},S.ceil=function(){return a(new this.constructor(this),this.e+1,2)},S.comparedTo=S.cmp=function(e,n){var r,t=this,i=t.c,o=(N=-N,e=new t.constructor(e,n),e.c),s=t.s,c=e.s,u=t.e,l=e.e;if(!s||!c)return null;if(r=i&&!i[0],n=o&&!o[0],r||n)return r?n?0:-c:s;if(s!=c)return s;if(r=0>s,!i||!o)return u==l?0:!i^r?1:-1;if(u!=l)return u>l^r?1:-1;for(s=-1,c=(u=i.length)<(l=o.length)?u:l;++s<c;)if(i[s]!=o[s])return i[s]>o[s]^r?1:-1;return u==l?0:u>l^r?1:-1},S.decimalPlaces=S.dp=function(){var e,n,r=null;if(e=this.c){if(r=((n=e.length-1)-v(this.e/y))*y,n=e[n])for(;n%10==0;n/=10,r--);0>r&&(r=0)}return r},S.dividedBy=S.div=function(e,n){return N=2,P(this,new this.constructor(e,n))},S.dividedToIntegerBy=S.divToInt=function(e,n){var r=this,t=r.constructor;return N=18,a(P(r,new t(e,n),0,1,1),t.precision,t.rounding)},S.equals=S.eq=function(e,n){return N=3,0===this.cmp(e,n)},S.exponential=S.exp=function(){return o(this)},S.floor=function(){return a(new this.constructor(this),this.e+1,3)},S.greaterThan=S.gt=function(e,n){return N=4,this.cmp(e,n)>0},S.greaterThanOrEqualTo=S.gte=function(e,n){return N=5,n=this.cmp(e,n),1==n||0===n},S.isFinite=function(){return!!this.c},S.isInteger=S.isInt=function(){return!!this.c&&v(this.e/y)>this.c.length-2},S.isNaN=function(){return!this.s},S.isNegative=S.isNeg=function(){return this.s<0},S.isZero=function(){return!!this.c&&0==this.c[0]},S.lessThan=S.lt=function(e,n){return N=6,this.cmp(e,n)<0},S.lessThanOrEqualTo=S.lte=function(e,n){return N=7,n=this.cmp(e,n),-1==n||0===n},S.logarithm=S.log=function(e,t){var i,o,s,c,l,h,g,p,m,d=this,v=d.constructor,E=v.precision,x=v.rounding,b=5;if(null==e)e=new v(10),i=!0;else{if(N=15,e=new v(e,t),o=e.c,e.s<0||!o||!o[0]||!e.e&&1==o[0]&&1==o.length)return new v(NaN);i=e.eq(10)}if(o=d.c,d.s<0||!o||!o[0]||!d.e&&1==o[0]&&1==o.length)return new v(o&&!o[0]?-1/0:1!=d.s?NaN:o?0:1/0);if(l=i&&(c=o[0],o.length>1||1!=c&&10!=c&&100!=c&&1e3!=c&&1e4!=c&&1e5!=c&&1e6!=c),w=!1,g=E+b,p=g+10,h=f(d,g),i?(p>M.length&&u(v,1,p,"log"),s=new v(M.slice(0,p))):s=f(e,g),m=P(h,s,g,1),r(m.c,c=E,x))do if(g+=10,h=f(d,g),i?(p=g+10,p>M.length&&u(v,1,p,"log"),s=new v(M.slice(0,p))):s=f(e,g),m=P(h,s,g,1),!l){+n(m.c).slice(c+1,c+15)+1==1e14&&(m=a(m,E+1,0));break}while(r(m.c,c+=10,x));return w=!0,a(m,E,x)},S.minus=function(e,n){var r,t,i,o,s=this,c=s.constructor,u=s.s;if(N=8,e=new c(e,n),n=e.s,!u||!n)return new c(NaN);if(u!=n)return e.s=-n,s.plus(e);var l=s.c,f=e.c,h=v(e.e/y),g=v(s.e/y),p=c.precision,m=c.rounding;if(!g||!h){if(!l||!f)return l?(e.s=-n,e):new c(f?s:NaN);if(!l[0]||!f[0])return s=f[0]?(e.s=-n,e):new c(l[0]?s:3==m?-0:0),w?a(s,p,m):s}if(l=l.slice(),t=l.length,u=g-h){for((o=0>u)?(u=-u,r=l,t=f.length):(h=g,r=f),(g=Math.ceil(p/y))>t&&(t=g),u>(t+=2)&&(u=t,r.length=1),r.reverse(),n=u;n--;r.push(0));r.reverse()}else for((o=t<(i=f.length))&&(i=t),u=n=0;i>n;n++)if(l[n]!=f[n]){o=l[n]<f[n];break}if(o&&(r=l,l=f,f=r,e.s=-e.s),(n=-((i=l.length)-f.length))>0)for(;n--;l[i++]=0);for(g=b-1,n=f.length;n>u;){if(l[--n]<f[n]){for(t=n;t&&!l[--t];l[t]=g);--l[t],l[n]+=b}l[n]-=f[n]}for(;0==l[--i];l.pop());for(;0==l[0];l.shift(),--h);for(l[0]||(l=[h=0],e.s=3==m?-1:1),e.c=l,u=1,n=l[0];n>=10;n/=10,u++);return e.e=u+h*y-1,w?a(e,p,m):e},S.modulo=S.mod=function(e,n){var r,t,i=this,o=i.constructor,s=o.modulo;return N=9,e=new o(e,n),n=e.s,r=!i.c||!n||e.c&&!e.c[0],r||!e.c||i.c&&!i.c[0]?r?new o(NaN):a(new o(i),o.precision,o.rounding):(w=!1,9==s?(e.s=1,t=P(i,e,0,3,1),e.s=n,t.s*=n):t=P(i,e,0,s,1),t=t.times(e),w=!0,i.minus(t))},S.naturalLogarithm=S.ln=function(){return f(this)},S.negated=S.neg=function(){var e=new this.constructor(this);return e.s=-e.s||null,a(e)},S.plus=function(e,n){var r,t=this,i=t.constructor,o=t.s;if(N=10,e=new i(e,n),n=e.s,!o||!n)return new i(NaN);if(o!=n)return e.s=-n,t.minus(e);var s=t.c,c=e.c,u=v(e.e/y),l=v(t.e/y),f=i.precision,h=i.rounding;if(!l||!u){if(!s||!c)return new i(o/0);if(!s[0]||!c[0])return t=c[0]?e:new i(s[0]?t:0*o),w?a(t,f,h):t}if(s=s.slice(),o=l-u){for(0>o?(o=-o,r=s,n=c.length):(u=l,r=c,n=s.length),(l=Math.ceil(f/y))>n&&(n=l),o>++n&&(o=n,r.length=1),r.reverse();o--;r.push(0));r.reverse()}for(s.length-c.length<0&&(r=c,c=s,s=r),o=c.length,n=0,l=b;o;s[o]%=l)n=(s[--o]=s[o]+c[o]+n)/l|0;for(n&&(s.unshift(n),++u),o=s.length;0==s[--o];s.pop());for(e.c=s,o=1,n=s[0];n>=10;n/=10,o++);return e.e=o+u*y-1,w?a(e,f,h):e},S.precision=S.sd=function(e){var n=null,r=this;return e!=n&&e!==!!e&&1!==e&&0!==e&&u(r.constructor,"argument",e,"precision",1),r.c&&(n=c(r.c),e&&r.e+1>n&&(n=r.e+1)),n},S.round=function(){var e=this,n=e.constructor;return a(new n(e),e.e+1,n.rounding)},S.squareRoot=S.sqrt=function(){var e,r,t,i,o,s,c=this,u=c.c,l=c.s,f=c.e,h=c.constructor,g=new h(.5);if(1!==l||!u||!u[0])return new h(!l||0>l&&(!u||u[0])?NaN:u?c:1/0);for(w=!1,l=Math.sqrt(+c),0==l||l==1/0?(r=n(u),(r.length+f)%2==0&&(r+="0"),l=Math.sqrt(r),f=v((f+1)/2)-(0>f||f%2),l==1/0?r="1e"+f:(r=l.toExponential(),r=r.slice(0,r.indexOf("e")+1)+f),i=new h(r)):i=new h(l.toString()),t=(f=h.precision)+3;;)if(s=i,i=g.times(s.plus(P(c,s,t+2,1))),n(s.c).slice(0,t)===(r=n(i.c)).slice(0,t)){if(r=r.slice(t-3,t+1),"9999"!=r&&(o||"4999"!=r)){(!+r||!+r.slice(1)&&"5"==r.charAt(0))&&(a(i,f+1,1),e=!i.times(i).eq(c));break}if(!o&&(a(s,f+1,0),s.times(s).eq(c))){i=s;break}t+=4,o=1}return w=!0,a(i,f,h.rounding,e)},S.times=function(e,n){var r,t,i=this,o=i.constructor,s=i.c,c=(N=11,e=new o(e,n),e.c),u=v(i.e/y),l=v(e.e/y),f=i.s;if(n=e.s,e.s=f==n?1:-1,!((u||s&&s[0])&&(l||c&&c[0])))return new o(!f||!n||s&&!s[0]&&!c||c&&!c[0]&&!s?NaN:s&&c?0*e.s:e.s/0);for(t=u+l,f=s.length,n=c.length,n>f&&(r=s,s=c,c=r,l=f,f=n,n=l),l=f+n,r=[];l--;r.push(0));for(u=n-1;u>-1;u--){for(n=0,l=f+u;l>u;)n=r[l]+c[u]*s[l-u-1]+n,r[l--]=n%b|0,n=n/b|0;r[l]=(r[l]+n)%b|0}for(n?++t:r[0]||r.shift(),l=r.length;!r[--l];r.pop());for(e.c=r,f=1,n=r[0];n>=10;n/=10,f++);return e.e=f+t*y-1,w?a(e,o.precision,o.rounding):e},S.toDecimalPlaces=S.toDP=function(e,n){var r=this;return r=new r.constructor(r),null!=e&&i(r,e,"toDP")?a(r,(0|e)+r.e+1,t(r,n,"toDP")):r},S.toExponential=function(e,n){var r=this;return r.c?s(r,null!=e&&i(r,e,"toExponential")?0|e:null,null!=e&&t(r,n,"toExponential"),1):r.toString()},S.toFixed=function(e,n){var r,o=this,c=o.constructor,u=c.toExpNeg,l=c.toExpPos;return null!=e&&(e=i(o,e,r="toFixed")?o.e+(0|e):null,n=t(o,n,r)),c.toExpNeg=-(c.toExpPos=1/0),null!=e&&o.c?(r=s(o,e,n),o.s<0&&o.c&&(o.c[0]?r.indexOf("-")<0&&(r="-"+r):r=r.replace("-",""))):r=o.toString(),c.toExpNeg=u,c.toExpPos=l,r},S.toFormat=function(e,n){var r=this;if(!r.c)return r.toString();var t,i=r.s<0,o=r.constructor.format,s=o.groupSeparator,c=+o.groupSize,u=+o.secondaryGroupSize,l=r.toFixed(e,n).split("."),f=l[0],a=l[1],h=i?f.slice(1):f,g=h.length;if(u&&(t=c,c=u,g-=u=t),c>0&&g>0){for(t=g%c||c,f=h.substr(0,t);g>t;t+=c)f+=s+h.substr(t,c);u>0&&(f+=s+h.slice(t)),i&&(f="-"+f)}return a?f+o.decimalSeparator+((u=+o.fractionGroupSize)?a.replace(new RegExp("\\d{"+u+"}\\B","g"),"$&"+o.fractionGroupSeparator):a):f},S.toFraction=function(e){var r,t,i,o,s,l,f,a,h=this,g=h.constructor,p=r=new g(g.ONE),d=l=new g(0),x=h.c,b=new g(d);if(!x)return h.toString();for(i=b.e=c(x)-h.e-1,b.c[0]=E(10,(f=i%y)<0?y+f:f),(null==e||(!(N=12,s=new g(e)).s||(m=s.cmp(p)<0||!s.c)||g.errors&&v(s.e/y)<s.c.length-1)&&!u(g,"max denominator",e,"toFraction",0)||(e=s).cmp(b)>0)&&(e=i>0?b:p),w=!1,s=new g(n(x)),f=g.precision,g.precision=i=x.length*y*2;a=P(s,b,0,1,1),t=r.plus(a.times(d)),1!=t.cmp(e);)r=d,d=t,p=l.plus(a.times(t=p)),l=t,b=s.minus(a.times(t=b)),s=t;return t=P(e.minus(r),d,0,1,1),l=l.plus(t.times(p)),r=r.plus(t.times(d)),l.s=p.s=h.s,o=P(p,d,i,1).minus(h).abs().cmp(P(l,r,i,1).minus(h).abs())<1?[p+"",d+""]:[l+"",r+""],w=!0,g.precision=f,o},S.toNearest=function(e,n){var r=this,i=r.constructor;return r=new i(r),null==e?(e=new i(i.ONE),n=i.rounding):(N=17,e=new i(e),n=t(r,n,"toNearest")),e.c?r.c&&(e.c[0]?(w=!1,r=P(r,e,0,4>n?[4,5,7,8][n]:n,1).times(e),w=!0,a(r)):r.c=[r.e=0]):r.s&&(e.s&&(e.s=r.s),r=e),r},S.toNumber=function(){var e=this;return+e||(e.s?0*e.s:NaN)},S.toPower=S.pow=function(e,t){var i,s,c,u,h=this,g=h.constructor,p=h.s,m=(N=13,+(e=new g(e,t))),d=0>m?-m:m,x=g.precision,b=g.rounding;if(!h.c||!e.c||(c=!h.c[0])||!e.c[0])return new g(E(c?0*p:+h,m));if(h=new g(h),i=h.c.length,!h.e&&h.c[0]==h.s&&1==i)return h;if(t=e.c.length-1,e.e||e.c[0]!=e.s||t)if(s=v(e.e/y),c=s>=t,!c&&0>p)u=new g(NaN);else{if(c&&F>i*y*d){if(u=l(g,h,d),e.s<0)return g.ONE.div(u)}else{if(p=0>p&&1&e.c[Math.max(s,t)]?-1:1,t=E(+h,m),s=0!=t&&isFinite(t)?new g(t+"").e:v(m*(Math.log("0."+n(h.c))/Math.LN10+h.e+1)),s>g.maxE+1||s<g.minE-1)return new g(s>0?p/0:0);w=!1,g.rounding=h.s=1,d=Math.min(12,(s+"").length),u=o(e.times(f(h,x+d)),x),u=a(u,x+5,1),r(u.c,x,b)&&(s=x+10,u=a(o(e.times(f(h,s+d)),s),s+5,1),+n(u.c).slice(x+1,x+15)+1==1e14&&(u=a(u,x+1,0))),u.s=p,w=!0,g.rounding=b}u=a(u,x,b)}else u=a(h,x,b);return u},S.toPrecision=function(e,n){var r=this;return null!=e&&i(r,e,"toPrecision",1)&&r.c?s(r,0|--e,t(r,n,"toPrecision"),2):r.toString()},S.toSignificantDigits=S.toSD=function(e,n){var r=this,o=r.constructor;return r=new o(r),null!=e&&i(r,e,"toSD",1)?a(r,0|e,t(r,n,"toSD")):a(r,o.precision,o.rounding)},S.toString=function(e){var r,t,i,o=this,c=o.constructor,l=o.e;if(null===l)t=o.s?"Infinity":"NaN";else{if(e===r&&(l<=c.toExpNeg||l>=c.toExpPos))return s(o,null,c.rounding,1);if(t=n(o.c),0>l){for(;++l;t="0"+t);t="0."+t}else if(i=t.length,l>0)if(++l>i)for(l-=i;l--;t+="0");else i>l&&(t=t.slice(0,l)+"."+t.slice(l));else if(r=t.charAt(0),i>1)t=r+"."+t.slice(1);else if("0"==r)return r;if(null!=e)if((m=!(e>=2&&65>e))||e!=(0|e)&&c.errors)u(c,"base",e,"toString",0);else if(t=h(c,t,0|e,10,o.s),"0"==t)return t}return o.s<0?"-"+t:t},S.truncated=S.trunc=function(){return a(new this.constructor(this),this.e+1,1)},S.valueOf=S.toJSON=function(){return this.toString()},h=function(){function e(e,n,r){for(var t,i,o=[0],s=0,c=e.length;c>s;){for(i=o.length;i--;o[i]*=n);for(o[t=0]+=O.indexOf(e.charAt(s++));t<o.length;t++)o[t]>r-1&&(null==o[t+1]&&(o[t+1]=0),o[t+1]+=o[t]/r|0,o[t]%=r)}return o.reverse()}return function(n,r,t,i,o){var s,c,u,f,a,h,g=r.indexOf("."),p=n.precision,m=n.rounding;for(37>i&&(r=r.toLowerCase()),g>=0&&(r=r.replace(".",""),h=new n(i),f=l(n,h,r.length-g),h.c=e(f.toFixed(),10,t),h.e=h.c.length),a=e(r,i,t),s=c=a.length;0==a[--c];a.pop());if(!a[0])return"0";if(0>g?s--:(f.c=a,f.e=s,f.s=o,f=P(f,h,p,m,0,t),a=f.c,u=f.r,s=f.e),g=a[p],c=t/2,u=u||null!=a[p+1],4>m?(null!=g||u)&&(0==m||m==(0>o?3:2)):g>c||g==c&&(4==m||u||6==m&&1&a[p-1]||m==(0>o?8:7)))for(a.length=p,--t;++a[--p]>t;)a[p]=0,p||(++s,a.unshift(1));else a.length=p;for(c=a.length;!a[--c];);for(g=0,r="";c>=g;r+=O.charAt(a[g++]));if(0>s){for(;++s;r="0"+r);r="0."+r}else if(g=r.length,++s>g)for(s-=g;s--;r+="0");else g>s&&(r=r.slice(0,s)+"."+r.slice(s));return r}}();var P=function(){function e(e,n,r){var t,i=0,o=e.length;for(e=e.slice();o--;)t=e[o]*n+i,e[o]=t%r|0,i=t/r|0;return i&&e.unshift(i),e}function n(e,n,r,t){var i,o;if(r!=t)o=r>t?1:-1;else for(i=o=0;r>i;i++)if(e[i]!=n[i]){o=e[i]>n[i]?1:-1;break}return o}function r(e,n,r,t){for(var i=0;r--;)e[r]-=i,i=e[r]<n[r]?1:0,e[r]=i*t+e[r]-n[r];for(;!e[0]&&e.length>1;e.shift());}return function(t,i,o,s,c,u){var l,f,h,g,p,m,d,w,N,E,x,O,S,D,A,F,M,P,R,q=t.constructor,L=t.s==i.s?1:-1,I=t.c,U=i.c;if(!(I&&I[0]&&U&&U[0]))return new q(t.s&&i.s&&(I?!U||I[0]!=U[0]:U)?I&&0==I[0]||!U?0*L:L/0:NaN);for(u?(g=1,f=t.e-i.e):(u=b,g=y,f=v(t.e/g)-v(i.e/g)),P=U.length,F=I.length,N=new q(L),E=N.c=[],h=0;U[h]==(I[h]||0);h++);if(U[h]>(I[h]||0)&&f--,null==o?(L=o=q.precision,s=q.rounding):L=c?o+(t.e-i.e)+1:o,0>L)E.push(1),p=!0;else{if(L=L/g+2|0,h=0,1==P){for(m=0,U=U[0],L++;(F>h||m)&&L--;h++)D=m*u+(I[h]||0),E[h]=D/U|0,m=D%U|0;p=m||F>h}else{for(m=u/(U[0]+1)|0,m>1&&(U=e(U,m,u),I=e(I,m,u),P=U.length,F=I.length),A=P,x=I.slice(0,P),O=x.length;P>O;x[O++]=0);R=U.slice(),R.unshift(0),M=U[0],U[1]>=u/2&&M++;do m=0,l=n(U,x,P,O),0>l?(S=x[0],P!=O&&(S=S*u+(x[1]||0)),m=S/M|0,m>1?(m>=u&&(m=u-1),d=e(U,m,u),w=d.length,O=x.length,l=n(d,x,w,O),1==l&&(m--,r(d,w>P?R:U,w,u))):(0==m&&(l=m=1),d=U.slice()),w=d.length,O>w&&d.unshift(0),r(x,d,O,u),-1==l&&(O=x.length,l=n(U,x,P,O),1>l&&(m++,r(x,O>P?R:U,O,u))),O=x.length):0===l&&(m++,x=[0]),E[h++]=m,l&&x[0]?x[O++]=I[A]||0:(x=[I[A]],O=1);while((A++<F||null!=x[0])&&L--);p=null!=x[0]}E[0]||E.shift()}if(1==g)N.e=f,N.r=+p;else{for(h=1,L=E[0];L>=10;L/=10,h++);N.e=h+f*g-1,a(N,c?o+N.e+1:o,s,p)}return N}}();if(g=function(){function e(e){var n,r,t,i=this,o="config",s=i.errors?parseInt:parseFloat;return e==r||"object"!=typeof e&&!u(i,"object expected",e,o)?i:((t=e[n="precision"])!=r&&((m=1>t||t>A)||s(t)!=t?u(i,n,t,o,0):i[n]=0|t),(t=e[n="rounding"])!=r&&((m=0>t||t>8)||s(t)!=t?u(i,n,t,o,0):i[n]=0|t),(t=e[n="toExpNeg"])!=r&&((m=-D>t||t>0)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="toExpPos"])!=r&&((m=0>t||t>D)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="minE"])!=r&&((m=-D>t||t>0)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="maxE"])!=r&&((m=0>t||t>D)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="errors"])!=r&&(t===!!t||1===t||0===t?(m=N=0,i[n]=!!t):u(i,n,t,o,1)),(t=e[n="crypto"])!=r&&(t===!!t||1===t||0===t?i[n]=!(!t||!d||"object"!=typeof d):u(i,n,t,o,1)),(t=e[n="modulo"])!=r&&((m=0>t||t>9)||s(t)!=t?u(i,n,t,o,0):i[n]=0|t),(e=e[n="format"])!=r&&("object"==typeof e?i[n]=e:u(i,"format object expected",e,o)),i)}function n(e){return new this(e).exp()}function r(e){return new this(e).ln()}function t(e,n){return new this(e).log(n)}function o(e,n,r){var t,i,o=0;for("[object Array]"==x.call(n[0])&&(n=n[0]),t=new e(n[0]);++o<n.length;){if(i=new e(n[o]),!i.s){t=i;break}t[r](i)&&(t=i)}return t}function s(){return o(this,arguments,"lt")}function c(){return o(this,arguments,"gt")}function l(e,n){return new this(e).pow(n)}function f(e){var n,r,t,o=0,s=[],c=this,l=new c(c.ONE);if(null!=e&&i(l,e,"random")?e|=0:e=c.precision,r=Math.ceil(e/y),c.crypto)if(d&&d.getRandomValues)for(n=d.getRandomValues(new Uint32Array(r));r>o;)t=n[o],t>=429e7?n[o]=d.getRandomValues(new Uint32Array(1))[0]:s[o++]=t%1e7;else if(d&&d.randomBytes){for(n=d.randomBytes(r*=4);r>o;)t=n[o]+(n[o+1]<<8)+(n[o+2]<<16)+((127&n[o+3])<<24),t>=214e7?d.randomBytes(4).copy(n,o):(s.push(t%1e7),o+=4);o=r/4}else u(c,"crypto unavailable",d,"random");if(!o)for(;r>o;)s[o++]=1e7*Math.random()|0;for(r=s[--o],e%=y,r&&e&&(t=E(10,y-e),s[o]=(r/t|0)*t);0===s[o];o--)s.pop();if(0>o)s=[r=0];else{for(r=-1;0===s[0];)s.shift(),r-=y;for(o=1,t=s[0];t>=10;)t/=10,o++;y>o&&(r-=y-o)}return l.e=r,l.c=s,l}function g(e){return new this(e).sqrt()}function p(i){function o(e,n){var r=this;if(!(r instanceof o))return u(o,"Decimal called without new",e),new o(e,n);if(r.constructor=o,e instanceof o){if(null==n)return N=0,r.s=e.s,r.e=e.e,r.c=(e=e.c)?e.slice():e,r;if(10==n)return a(new o(e),o.precision,o.rounding);e+=""}return b(o,r,e,n)}return o.precision=20,o.rounding=4,o.modulo=1,o.toExpNeg=-7,o.toExpPos=21,o.minE=-D,o.maxE=D,o.errors=!0,o.crypto=!1,o.format={decimalSeparator:".",groupSeparator:",",groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:" ",fractionGroupSize:0},o.prototype=S,o.ONE=new o(1),o.ROUND_UP=0,o.ROUND_DOWN=1,o.ROUND_CEIL=2,o.ROUND_FLOOR=3,o.ROUND_HALF_UP=4,o.ROUND_HALF_DOWN=5,o.ROUND_HALF_EVEN=6,o.ROUND_HALF_CEIL=7,o.ROUND_HALF_FLOOR=8,o.EUCLID=9,o.config=e,o.constructor=p,o.exp=n,o.ln=r,o.log=t,o.max=s,o.min=c,o.pow=l,o.sqrt=g,o.random=f,null!=i&&o.config(i),o}var b=function(){var e=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,n=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")};return function(r,t,i,o){var s,c,l,f,g,p;if("string"!=typeof i&&(i=(f="number"==typeof i||"[object Number]"==x.call(i))&&0===i&&0>1/i?"-0":i+""),g=i,null==o&&e.test(i))t.s=45===i.charCodeAt(0)?(i=i.slice(1),-1):1;else{if(10==o)return a(new r(i),r.precision,r.rounding);if(i=n.call(i).replace(/^\+(?!-)/,""),t.s=45===i.charCodeAt(0)?(i=i.replace(/^-(?!-)/,""),-1):1,null!=o?o!=(0|o)&&r.errors||(m=!(o>=2&&65>o))?(u(r,"base",o,0,0),p=e.test(i)):(s="["+O.slice(0,o=0|o)+"]+",i=i.replace(/\.$/,"").replace(/^\./,"0."),(p=new RegExp("^"+s+"(?:\\."+s+")?$",37>o?"i":"").test(i))?(f&&(i.replace(/^0\.0*|\./,"").length>15&&u(r,0,g),f=!f),i=h(r,i,10,o,t.s)):"Infinity"!=i&&"NaN"!=i&&(u(r,"not a base "+o+" number",g),i="NaN")):p=e.test(i),!p)return t.c=t.e=null,"Infinity"!=i&&("NaN"!=i&&u(r,"not a number",g),t.s=null),N=0,t}for((c=i.indexOf("."))>-1&&(i=i.replace(".","")),(l=i.search(/e/i))>0?(0>c&&(c=l),c+=+i.slice(l+1),i=i.substring(0,l)):0>c&&(c=i.length),l=0;48===i.charCodeAt(l);l++);for(o=i.length;48===i.charCodeAt(--o););if(i=i.slice(l,o+1)){if(o=i.length,f&&o>15&&u(r,0,g),t.e=c=c-l-1,t.c=[],l=(c+1)%y,0>c&&(l+=y),o>l){for(l&&t.c.push(+i.slice(0,l)),o-=y;o>l;)t.c.push(+i.slice(l,l+=y));i=i.slice(l),l=y-i.length}else l-=o;for(;l--;i+="0");t.c.push(+i),w&&(t.e>r.maxE?t.c=t.e=null:t.e<r.minE&&(t.c=[t.e=0]))}else t.c=[t.e=0];return N=0,t}}();return p()}(),"function"==typeof define&&define.amd)define(function(){return g});else if("undefined"!=typeof module&&module.exports){if(module.exports=g,!d)try{d=require("crypto")}catch(R){}}else p=e.Decimal,g.noConflict=function(){return e.Decimal=p,g},e.Decimal=g}(this);